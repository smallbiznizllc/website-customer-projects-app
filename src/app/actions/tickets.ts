'use server'

import { getFirestore } from 'firebase-admin/firestore'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { Ticket, TicketStatus } from '@/lib/types/ticket'
import { generatePublicKey } from '@/lib/utils/validation'
import { sendTicketEmail, sendAdminNotificationEmail } from '@/lib/email/sendEmail'
import crypto from 'crypto'

// Initialize Firebase Admin
let db: ReturnType<typeof getFirestore> | null = null

if (!getApps().length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  if (
    privateKey && 
    process.env.FIREBASE_PROJECT_ID && 
    process.env.FIREBASE_CLIENT_EMAIL &&
    privateKey !== 'placeholder' &&
    process.env.FIREBASE_PROJECT_ID !== 'placeholder'
  ) {
    try {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey,
        }),
      })
      db = getFirestore()
    } catch (error) {
      console.warn('Firebase Admin initialization failed:', error)
    }
  }
} else {
  try {
    db = getFirestore()
  } catch (error) {
    console.warn('Firebase Admin getFirestore failed:', error)
  }
}

// Helper to get all admin emails
async function getAdminEmails(): Promise<string[]> {
  if (!db) return []
  try {
    const usersRef = db.collection('users')
    const snapshot = await usersRef.where('role', '==', 'admin').where('isActive', '==', true).get()
    
    return snapshot.docs.map(doc => doc.data().email as string).filter(Boolean)
  } catch (error) {
    console.error('Error fetching admin emails:', error)
    return []
  }
}

export async function createTicket(
  userId: string,
  userEmail: string,
  title: string,
  description: string,
  attachments: Array<{ fileName: string; s3Key: string; fileSize: number }>
) {
  if (!db) {
    throw new Error('Firebase is not configured. Please set up your Firebase credentials.')
  }

  const ticketId = crypto.randomUUID()
  const publicKey = generatePublicKey()
  
  const ticket: Omit<Ticket, 'id'> = {
    userId,
    userEmail,
    title,
    description,
    status: 'Not Started',
    attachments: attachments.map(att => ({
      fileName: att.fileName,
      fileSize: att.fileSize,
      fileUrl: '', // Will be generated on demand
      uploadedAt: new Date(),
      s3Key: att.s3Key,
    })),
    publicKey,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  await db.collection('tickets').doc(ticketId).set({
    ...ticket,
    createdAt: ticket.createdAt.toISOString(),
    updatedAt: ticket.updatedAt.toISOString(),
    attachments: ticket.attachments.map(att => ({
      ...att,
      uploadedAt: att.uploadedAt.toISOString(),
    })),
  })
  
  // Send email to user
  try {
    await sendTicketEmail({
      to: userEmail,
      ticketId,
      title: ticket.title,
      status: ticket.status,
      publicKey: ticket.publicKey,
    })
  } catch (error) {
    console.error('Error sending user email:', error)
  }

  // Send email notification to all admins
  try {
    const adminEmails = await getAdminEmails()
    for (const adminEmail of adminEmails) {
      await sendAdminNotificationEmail({
        to: adminEmail,
        ticketId,
        title: ticket.title,
        description: ticket.description,
        userEmail: ticket.userEmail,
        createdAt: ticket.createdAt,
      })
    }
  } catch (error) {
    console.error('Error sending admin emails:', error)
  }

  return { ticketId, publicKey }
}

export async function updateTicketStatus(
  ticketId: string,
  status: TicketStatus,
  internalNotes?: string
) {
  if (!db) {
    throw new Error('Firebase is not configured. Please set up your Firebase credentials.')
  }

  const ticketRef = db.collection('tickets').doc(ticketId)
  const ticketDoc = await ticketRef.get()
  
  if (!ticketDoc.exists) {
    throw new Error('Ticket not found')
  }

  const ticketData = ticketDoc.data()!
  const ticket = {
    ...ticketData,
    id: ticketDoc.id,
    createdAt: ticketData.createdAt ? new Date(ticketData.createdAt) : new Date(),
    updatedAt: ticketData.updatedAt ? new Date(ticketData.updatedAt) : new Date(),
    attachments: (ticketData.attachments || []).map((att: any) => ({
      ...att,
      uploadedAt: att.uploadedAt ? new Date(att.uploadedAt) : new Date(),
    })),
  } as Ticket
  
  await ticketRef.update({
    status,
    internalNotes: internalNotes !== undefined ? internalNotes : ticketData.internalNotes,
    updatedAt: new Date().toISOString(),
  })

  // Send email notification to user
  try {
    await sendTicketEmail({
      to: ticket.userEmail,
      ticketId,
      title: ticket.title,
      status,
      publicKey: ticket.publicKey,
    })
  } catch (error) {
    console.error('Error sending email:', error)
  }

  return { success: true }
}

export async function getTicketById(ticketId: string): Promise<Ticket | null> {
  if (!db) return null
  
  const ticketDoc = await db.collection('tickets').doc(ticketId).get()
  
  if (!ticketDoc.exists) {
    return null
  }

  const data = ticketDoc.data()!
  return {
    id: ticketDoc.id,
    ...data,
    createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    attachments: (data.attachments || []).map((att: any) => ({
      ...att,
      uploadedAt: att.uploadedAt ? new Date(att.uploadedAt) : new Date(),
    })),
  } as Ticket
}

export async function getTicketByPublicKey(
  ticketId: string,
  publicKey: string
): Promise<Ticket | null> {
  const ticket = await getTicketById(ticketId)
  
  if (!ticket || ticket.publicKey !== publicKey) {
    return null
  }

  return ticket
}

export async function getAllTickets(): Promise<Ticket[]> {
  if (!db) return []
  
  const snapshot = await db.collection('tickets').orderBy('createdAt', 'desc').get()
  
  return snapshot.docs.map(doc => {
    const data = doc.data()
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
      attachments: (data.attachments || []).map((att: any) => ({
        ...att,
        uploadedAt: att.uploadedAt ? new Date(att.uploadedAt) : new Date(),
      })),
    } as Ticket
  })
}

export async function getUserTickets(userId: string): Promise<Ticket[]> {
  if (!db) return []
  
  const snapshot = await db.collection('tickets')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get()
  
  return snapshot.docs.map(doc => {
    const data = doc.data()
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
      attachments: (data.attachments || []).map((att: any) => ({
        ...att,
        uploadedAt: att.uploadedAt ? new Date(att.uploadedAt) : new Date(),
      })),
    } as Ticket
  })
}


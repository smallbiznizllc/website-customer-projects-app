'use server'

import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { UserRole } from '@/lib/types/user'
import { sendRegistrationApprovalEmail } from '@/lib/email/sendEmail'
import crypto from 'crypto'

// Simple encryption/decryption for temporary password storage
// Use a 32-byte key (64 hex characters) or generate one if not provided
const getEncryptionKey = (): Buffer => {
  const keyString = process.env.REGISTRATION_ENCRYPTION_KEY
  if (keyString && keyString.length >= 64) {
    try {
      return Buffer.from(keyString.slice(0, 64), 'hex')
    } catch (error) {
      console.error('Invalid REGISTRATION_ENCRYPTION_KEY format. Must be 64 hex characters.')
      throw new Error('Invalid encryption key format. Please set REGISTRATION_ENCRYPTION_KEY to a 64-character hex string.')
    }
  }
  // Generate and use a key (note: this will be different on each server restart if env var not set)
  // WARNING: This means passwords encrypted with one key cannot be decrypted with another!
  console.warn('⚠️  REGISTRATION_ENCRYPTION_KEY not set. Using a random key that will change on server restart!')
  console.warn('⚠️  Set REGISTRATION_ENCRYPTION_KEY in .env.local for a stable key.')
  return crypto.randomBytes(32)
}

const ENCRYPTION_KEY = getEncryptionKey()
const ALGORITHM = 'aes-256-cbc'

function encrypt(text: string): string {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return iv.toString('hex') + ':' + encrypted
}

function decrypt(encryptedText: string): string {
  const parts = encryptedText.split(':')
  const iv = Buffer.from(parts.shift()!, 'hex')
  const encrypted = parts.join(':')
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv)
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

let db: ReturnType<typeof getFirestore> | null = null
let adminAuth: ReturnType<typeof getAuth> | null = null

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
      adminAuth = getAuth()
    } catch (error) {
      console.warn('Firebase Admin initialization failed:', error)
    }
  }
} else {
  try {
    db = getFirestore()
    adminAuth = getAuth()
  } catch (error) {
    console.warn('Firebase Admin initialization failed:', error)
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

export interface RegistrationRequest {
  id: string
  email: string
  displayName: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Date
  approvedAt?: Date
  rejectedAt?: Date
  userId?: string
}

export async function submitRegistrationRequest(
  email: string,
  password: string,
  displayName?: string
) {
  if (!db) {
    throw new Error('Firebase is not configured. Please set up your Firebase credentials.')
  }

  // Check if email already exists in pending registrations
  const pendingSnapshot = await db.collection('registrationRequests')
    .where('email', '==', email)
    .where('status', '==', 'pending')
    .get()

  if (!pendingSnapshot.empty) {
    throw new Error('A registration request with this email is already pending approval.')
  }

  // Check if user already exists in Firebase Auth
  try {
    if (adminAuth) {
      await adminAuth.getUserByEmail(email)
      throw new Error('An account with this email already exists.')
    }
  } catch (error: any) {
    // If error is not "user not found", rethrow it
    if (error.code !== 'auth/user-not-found') {
      throw error
    }
    // User doesn't exist, continue with registration
  }

  // Check if user exists in Firestore users collection
  const userSnapshot = await db.collection('users')
    .where('email', '==', email)
    .get()

  if (!userSnapshot.empty) {
    throw new Error('An account with this email already exists.')
  }

  const registrationId = crypto.randomUUID()
  const encryptedPassword = encrypt(password)

  // Store registration request (without creating Firebase Auth user)
  await db.collection('registrationRequests').doc(registrationId).set({
    email,
    encryptedPassword, // Store encrypted password (will be decrypted when approved)
    displayName: displayName || '',
    status: 'pending',
    createdAt: new Date().toISOString(),
  })

  // Send email notification to all admins
  try {
    const adminEmails = await getAdminEmails()
    for (const adminEmail of adminEmails) {
      await sendRegistrationApprovalEmail({
        to: adminEmail,
        registrationId,
        email,
        displayName,
        createdAt: new Date(),
      })
    }
  } catch (error) {
    console.error('Error sending admin emails:', error)
    // Don't throw - registration request was saved, email is secondary
  }

  return { success: true, message: 'Registration request submitted. You will receive an email once your account is approved.' }
}

export async function getAllRegistrationRequests(): Promise<RegistrationRequest[]> {
  if (!db) return []
  
  try {
    const snapshot = await db.collection('registrationRequests')
      .orderBy('createdAt', 'desc')
      .get()
    
    return snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        email: data.email,
        displayName: data.displayName || '',
        status: data.status,
        createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
        approvedAt: data.approvedAt ? new Date(data.approvedAt) : undefined,
        rejectedAt: data.rejectedAt ? new Date(data.rejectedAt) : undefined,
        userId: data.userId,
      } as RegistrationRequest
    })
  } catch (error) {
    console.error('Error fetching registration requests:', error)
    return []
  }
}

export async function getPendingRegistrationRequests(): Promise<RegistrationRequest[]> {
  if (!db) {
    console.error('Firebase db not initialized')
    throw new Error('Firebase is not configured')
  }
  
  try {
    console.log('Fetching pending registration requests...')
    const snapshot = await db.collection('registrationRequests')
      .where('status', '==', 'pending')
      .orderBy('createdAt', 'desc')
      .get()
    
    const requests = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        email: data.email,
        displayName: data.displayName || '',
        status: data.status,
        createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      } as RegistrationRequest
    })
    
    console.log(`Found ${requests.length} pending registration requests`)
    return requests
  } catch (error: any) {
    console.error('Error fetching pending registration requests:', error)
    // If it's an index error, provide helpful message
    if (error.message?.includes('index') || error.code === 'failed-precondition') {
      throw new Error('Firestore index required. Please deploy indexes: firebase deploy --only firestore:indexes')
    }
    throw error
  }
}

export async function approveRegistration(registrationId: string) {
  if (!db || !adminAuth) {
    throw new Error('Firebase is not configured. Please set up your Firebase credentials.')
  }

  const registrationDoc = await db.collection('registrationRequests').doc(registrationId).get()
  
  if (!registrationDoc.exists) {
    throw new Error('Registration request not found.')
  }

  const registrationData = registrationDoc.data()!
  
  if (registrationData.status !== 'pending') {
    throw new Error('Registration request has already been processed.')
  }

  // Decrypt password
  let password: string
  try {
    password = decrypt(registrationData.encryptedPassword)
  } catch (error: any) {
    console.error('Error decrypting password:', error)
    if (error.message?.includes('bad decrypt') || error.message?.includes('decrypt')) {
      throw new Error('Failed to decrypt password. This usually means REGISTRATION_ENCRYPTION_KEY changed or is missing. Please check your .env.local file and ensure the key matches the one used when the registration was created.')
    }
    throw error
  }

  // Create Firebase Auth user
  const userRecord = await adminAuth.createUser({
    email: registrationData.email,
    password: password,
    displayName: registrationData.displayName,
  })

  // Create user document in Firestore
  await db.collection('users').doc(userRecord.uid).set({
    email: registrationData.email,
    role: 'client' as UserRole,
    displayName: registrationData.displayName || '',
    isActive: true,
    createdAt: new Date().toISOString(),
  })

  await adminAuth.setCustomUserClaims(userRecord.uid, { role: 'client' })

  // Update registration request status
  await db.collection('registrationRequests').doc(registrationId).update({
    status: 'approved',
    approvedAt: new Date().toISOString(),
    userId: userRecord.uid,
  })

  // Send welcome email with temporary password (you'd want to implement this)
  // For now, just return success

  return { success: true, userId: userRecord.uid }
}

export async function rejectRegistration(registrationId: string) {
  if (!db) {
    throw new Error('Firebase is not configured. Please set up your Firebase credentials.')
  }

  const registrationDoc = await db.collection('registrationRequests').doc(registrationId).get()
  
  if (!registrationDoc.exists) {
    throw new Error('Registration request not found.')
  }

  const registrationData = registrationDoc.data()!
  
  if (registrationData.status !== 'pending') {
    throw new Error('Registration request has already been processed.')
  }

  await db.collection('registrationRequests').doc(registrationId).update({
    status: 'rejected',
    rejectedAt: new Date().toISOString(),
  })

  return { success: true }
}

'use server'

import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { User, UserRole } from '@/lib/types/user'

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

export async function getAllUsers(): Promise<User[]> {
  if (!db) return []
  
  const snapshot = await db.collection('users').get()
  
  return snapshot.docs.map(doc => {
    const data = doc.data()
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      lastLoginAt: data.lastLoginAt ? new Date(data.lastLoginAt) : undefined,
    } as User
  })
}

export async function createUser(
  email: string,
  password: string,
  role: UserRole = 'client',
  displayName?: string
) {
  if (!db || !adminAuth) {
    throw new Error('Firebase is not configured. Please set up your Firebase credentials.')
  }

  const userRecord = await adminAuth.createUser({
    email,
    password,
    displayName,
  })

  await db.collection('users').doc(userRecord.uid).set({
    email,
    role,
    displayName: displayName || '',
    isActive: true,
    createdAt: new Date().toISOString(),
  })

  await adminAuth.setCustomUserClaims(userRecord.uid, { role })

  return { userId: userRecord.uid }
}

export async function updateUserRole(userId: string, role: UserRole) {
  if (!db || !adminAuth) {
    throw new Error('Firebase is not configured. Please set up your Firebase credentials.')
  }
  await db.collection('users').doc(userId).update({ role })
  await adminAuth.setCustomUserClaims(userId, { role })
  return { success: true }
}

export async function toggleUserActive(userId: string, isActive: boolean) {
  if (!db || !adminAuth) {
    throw new Error('Firebase is not configured. Please set up your Firebase credentials.')
  }
  await db.collection('users').doc(userId).update({ isActive })
  await adminAuth.updateUser(userId, { disabled: !isActive })
  return { success: true }
}


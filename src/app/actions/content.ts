'use server'

import { getFirestore } from 'firebase-admin/firestore'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { LandingContent } from '@/lib/types/content'

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

export async function getLandingContent(): Promise<LandingContent> {
  if (!db) {
    // Return default content if Firebase is not configured
    return {
      hero: {
        title: 'Welcome to Our Service',
        subtitle: 'We provide exceptional support for your business needs',
        ctaText: 'Get Started',
      },
      services: [],
      contact: {
        email: 'contact@example.com',
      },
      footer: {
        text: '© 2024 All rights reserved',
      },
    }
  }

  try {
    const doc = await db.collection('content').doc('landing').get()
    
    if (doc.exists) {
      return doc.data() as LandingContent
    }
  } catch (error) {
    console.error('Error loading landing content:', error)
  }

  // Default content
  return {
    hero: {
      title: 'Welcome to Our Service',
      subtitle: 'We provide exceptional support for your business needs',
      ctaText: 'Get Started',
    },
    services: [],
    contact: {
      email: 'contact@example.com',
    },
    footer: {
      text: '© 2024 All rights reserved',
    },
  }
}

export async function updateLandingContent(content: LandingContent) {
  if (!db) {
    throw new Error('Firebase is not configured. Please set up your Firebase credentials.')
  }
  await db.collection('content').doc('landing').set(content, { merge: true })
  return { success: true }
}


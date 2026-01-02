'use server'

import { getFirestore } from 'firebase-admin/firestore'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { SEOConfig } from '@/lib/types/seo'

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

export async function getSEOConfig(): Promise<SEOConfig> {
  if (!db) {
    // Return default SEO config if Firebase is not configured
    return {
      title: 'SmallBizNiz LLC - Business Solutions',
      description: 'Professional business solutions and support services',
    }
  }

  try {
    const doc = await db.collection('seo').doc('main').get()
    
    if (doc.exists) {
      return doc.data() as SEOConfig
    }
  } catch (error) {
    console.error('Error loading SEO config:', error)
  }

  return {
    title: 'SmallBizNiz LLC - Business Solutions',
    description: 'Professional business solutions and support services',
  }
}

export async function updateSEOConfig(config: SEOConfig) {
  if (!db) {
    throw new Error('Firebase is not configured. Please set up your Firebase credentials.')
  }
  await db.collection('seo').doc('main').set(config, { merge: true })
  return { success: true }
}


'use server'

import { getFirestore } from 'firebase-admin/firestore'
import { initializeApp, getApps, cert } from 'firebase-admin/app'

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

export interface CalendarConfig {
  blackoutDates: string[] // ISO date strings
  hoursOfOperation: {
    [key: string]: { // day of week: 'monday', 'tuesday', etc.
      open: string // HH:mm format
      close: string // HH:mm format
      closed?: boolean
    }
  }
  specialAvailability?: Array<{
    date: string // ISO date string
    open: string
    close: string
    closed?: boolean
  }>
}

export async function getCalendarConfig(): Promise<CalendarConfig> {
  if (!db) {
    // Return default calendar config if Firebase is not configured
    return {
      blackoutDates: [],
      hoursOfOperation: {
        monday: { open: '09:00', close: '17:00' },
        tuesday: { open: '09:00', close: '17:00' },
        wednesday: { open: '09:00', close: '17:00' },
        thursday: { open: '09:00', close: '17:00' },
        friday: { open: '09:00', close: '17:00' },
        saturday: { closed: true },
        sunday: { closed: true },
      },
    }
  }

  try {
    const doc = await db.collection('calendar').doc('config').get()
    
    if (doc.exists) {
      return doc.data() as CalendarConfig
    }
  } catch (error) {
    console.error('Error loading calendar config:', error)
  }

  return {
    blackoutDates: [],
    hoursOfOperation: {
      monday: { open: '09:00', close: '17:00' },
      tuesday: { open: '09:00', close: '17:00' },
      wednesday: { open: '09:00', close: '17:00' },
      thursday: { open: '09:00', close: '17:00' },
      friday: { open: '09:00', close: '17:00' },
      saturday: { closed: true },
      sunday: { closed: true },
    },
  }
}

export async function updateCalendarConfig(config: CalendarConfig) {
  if (!db) {
    throw new Error('Firebase is not configured. Please set up your Firebase credentials.')
  }
  await db.collection('calendar').doc('config').set(config, { merge: true })
  return { success: true }
}

export async function isBlackoutDate(date: Date): Promise<boolean> {
  const config = await getCalendarConfig()
  const dateStr = date.toISOString().split('T')[0]
  return config.blackoutDates.includes(dateStr)
}

export async function getServiceHours(date: Date): Promise<{ open: string; close: string; closed: boolean } | null> {
  const config = await getCalendarConfig()
  const dateStr = date.toISOString().split('T')[0]
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'lowercase' })
  
  // Check special availability first
  if (config.specialAvailability) {
    const special = config.specialAvailability.find(s => s.date === dateStr)
    if (special) {
      return {
        open: special.open,
        close: special.close,
        closed: special.closed || false,
      }
    }
  }
  
  // Check regular hours
  const regularHours = config.hoursOfOperation[dayOfWeek]
  if (regularHours) {
    return {
      open: regularHours.open,
      close: regularHours.close,
      closed: regularHours.closed || false,
    }
  }
  
  return null
}


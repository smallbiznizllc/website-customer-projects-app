import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/firebase/auth'
import { getUserRole } from '@/lib/firebase/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import { initializeApp, getApps, cert } from 'firebase-admin/app'

// Initialize Firebase Admin for server-side checks
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

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    // Get the auth token from the request
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No authorization token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    
    if (!adminAuth) {
      return NextResponse.json(
        { error: 'Firebase Admin not configured' },
        { status: 500 }
      )
    }

    // Verify the token and get user info
    const decodedToken = await adminAuth.verifyIdToken(token)
    const userId = decodedToken.uid

    // Get user data from Firestore
    if (!db) {
      return NextResponse.json(
        { error: 'Firestore not configured' },
        { status: 500 }
      )
    }

    const userDoc = await db.collection('users').doc(userId).get()
    
    if (!userDoc.exists) {
      return NextResponse.json({
        userId,
        email: decodedToken.email,
        isAdmin: false,
        role: null,
        isActive: false,
        message: 'User document not found in Firestore',
      })
    }

    const userData = userDoc.data()!

    return NextResponse.json({
      userId,
      email: userData.email || decodedToken.email,
      isAdmin: userData.role === 'admin' && userData.isActive === true,
      role: userData.role || null,
      isActive: userData.isActive || false,
      displayName: userData.displayName || null,
      customClaims: decodedToken.role || null,
    })
  } catch (error: any) {
    console.error('Error checking admin status:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to check admin status' },
      { status: 500 }
    )
  }
}


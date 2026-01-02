// Script to create or update admin user
// Usage: npx tsx scripts/setup-admin.ts
// OR: npx ts-node --esm scripts/setup-admin.ts

import { createUser, getAllUsers, updateUserRole } from '../src/app/actions/admin'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import { initializeApp, getApps, cert } from 'firebase-admin/app'

// Initialize Firebase Admin
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
    } catch (error) {
      console.error('Firebase Admin initialization failed:', error)
      process.exit(1)
    }
  } else {
    console.error('Firebase Admin SDK not configured. Please set up your .env.local file.')
    process.exit(1)
  }
}

const ADMIN_EMAIL = 'service@smallbizniz.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChangeThisPassword123!' // Change this!

async function setupAdmin() {
  try {
    const db = getFirestore()
    const adminAuth = getAuth()
    
    console.log(`\n🔧 Setting up admin user: ${ADMIN_EMAIL}\n`)

    // Check if user exists in Firestore
    const usersSnapshot = await db.collection('users').where('email', '==', ADMIN_EMAIL).get()
    
    if (!usersSnapshot.empty) {
      // User exists in Firestore - check if they're admin
      const userDoc = usersSnapshot.docs[0]
      const userData = userDoc.data()
      
      if (userData.role === 'admin' && userData.isActive) {
        console.log('✅ Admin user already exists and is active!')
        console.log(`   User ID: ${userDoc.id}`)
        console.log(`   Email: ${userData.email}`)
        console.log(`   Role: ${userData.role}`)
        console.log(`   Active: ${userData.isActive}`)
        return
      } else {
        // Update existing user to admin
        console.log('📝 User exists but is not admin. Updating role...')
        await db.collection('users').doc(userDoc.id).update({
          role: 'admin',
          isActive: true,
        })
        
        // Update Firebase Auth custom claims
        try {
          await adminAuth.setCustomUserClaims(userDoc.id, { role: 'admin' })
          console.log('✅ Updated user role to admin!')
        } catch (error: any) {
          if (error.code === 'auth/user-not-found') {
            console.log('⚠️  User exists in Firestore but not in Firebase Auth. Creating Auth user...')
            // Create Auth user
            const userRecord = await adminAuth.createUser({
              email: ADMIN_EMAIL,
              password: ADMIN_PASSWORD,
              displayName: userData.displayName || 'Admin User',
            })
            await adminAuth.setCustomUserClaims(userRecord.uid, { role: 'admin' })
            // Update Firestore doc with new UID if different
            if (userRecord.uid !== userDoc.id) {
              await db.collection('users').doc(userRecord.uid).set({
                ...userData,
                role: 'admin',
                isActive: true,
              })
              await db.collection('users').doc(userDoc.id).delete()
            }
            console.log('✅ Created Firebase Auth user and set as admin!')
          } else {
            throw error
          }
        }
        return
      }
    }
    
    // User doesn't exist - check Firebase Auth
    let authUserId: string | null = null
    try {
      const authUser = await adminAuth.getUserByEmail(ADMIN_EMAIL)
      authUserId = authUser.uid
      console.log('📝 User exists in Firebase Auth but not in Firestore. Creating Firestore record...')
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        console.log('📝 User does not exist. Creating new admin user...')
        // Create Firebase Auth user
        const userRecord = await adminAuth.createUser({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          displayName: 'Admin User',
        })
        authUserId = userRecord.uid
        await adminAuth.setCustomUserClaims(authUserId, { role: 'admin' })
        console.log('✅ Created Firebase Auth user')
      } else {
        throw error
      }
    }
    
    // Create Firestore user document
    await db.collection('users').doc(authUserId!).set({
      email: ADMIN_EMAIL,
      role: 'admin',
      displayName: 'Admin User',
      isActive: true,
      createdAt: new Date().toISOString(),
    })
    
    console.log('✅ Created Firestore user document')
    console.log(`\n✅ Admin user setup complete!`)
    console.log(`   Email: ${ADMIN_EMAIL}`)
    console.log(`   Password: ${ADMIN_PASSWORD}`)
    console.log(`   ⚠️  IMPORTANT: Change the password after first login!`)
    console.log(`\n   You can now login at: http://localhost:3000/login`)
    
  } catch (error: any) {
    console.error('\n❌ Error setting up admin user:', error.message)
    if (error.code) {
      console.error(`   Error code: ${error.code}`)
    }
    process.exit(1)
  }
}

setupAdmin()


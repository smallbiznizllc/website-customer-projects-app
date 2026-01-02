import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth'
import { auth, db, isFirebaseConfigured } from './config'
import { doc, getDoc } from 'firebase/firestore'
import { User, UserRole } from '@/lib/types/user'

export const login = async (email: string, password: string) => {
  if (!auth || !isFirebaseConfigured()) {
    throw new Error('Firebase is not configured. Please set up your Firebase credentials.')
  }
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  return userCredential.user
}

export const logout = async () => {
  if (!auth) return
  await signOut(auth)
}

export const getCurrentUser = (): Promise<FirebaseUser | null> => {
  if (!auth || !isFirebaseConfigured()) {
    return Promise.resolve(null)
  }
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    })
  })
}

export const getUserRole = async (userId: string): Promise<UserRole> => {
  if (!db || !isFirebaseConfigured()) {
    return 'client'
  }
  try {
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (userDoc.exists()) {
      return userDoc.data().role as UserRole
    }
  } catch (error) {
    console.error('Error getting user role:', error)
  }
  return 'client'
}

export const getUserData = async (userId: string): Promise<User | null> => {
  if (!db || !isFirebaseConfigured()) {
    return null
  }
  try {
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() } as User
    }
  } catch (error) {
    console.error('Error getting user data:', error)
  }
  return null
}


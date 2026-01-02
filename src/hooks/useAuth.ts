'use client'

import { useState, useEffect } from 'react'
import { getCurrentUser } from '@/lib/firebase/auth'
import { User as FirebaseUser } from 'firebase/auth'

export function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCurrentUser().then((user) => {
      setUser(user)
      setLoading(false)
    })
  }, [])

  return { user, loading }
}




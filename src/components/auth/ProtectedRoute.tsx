'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, getUserRole } from '@/lib/firebase/auth'
import { User as FirebaseUser } from 'firebase/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'client'
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      if (requiredRole) {
        const role = await getUserRole(user.uid)
        if (requiredRole === 'admin' && role !== 'admin') {
          router.push('/dashboard')
          return
        }
      }

      setAuthorized(true)
      setLoading(false)
    }

    checkAuth()
  }, [router, requiredRole])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!authorized) {
    return null
  }

  return <>{children}</>
}




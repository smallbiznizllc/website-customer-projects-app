'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/firebase/auth'
import { getUserRole } from '@/lib/firebase/auth'
import { auth } from '@/lib/firebase/config'

interface AdminStatus {
  userId: string | null
  email: string | null
  isAdmin: boolean
  role: string | null
  isActive: boolean
  displayName: string | null
  loading: boolean
  error: string | null
}

export default function AdminStatusPage() {
  const [status, setStatus] = useState<AdminStatus>({
    userId: null,
    email: null,
    isAdmin: false,
    role: null,
    isActive: false,
    displayName: null,
    loading: true,
    error: null,
  })
  const router = useRouter()

  useEffect(() => {
    async function checkStatus() {
      try {
        const user = await getCurrentUser()
        
        if (!user) {
          setStatus(prev => ({
            ...prev,
            loading: false,
            error: 'Not logged in',
          }))
          return
        }

        // Get the ID token
        const token = await user.getIdToken()
        
        // Call the API to check admin status
        const response = await fetch('/api/check-admin', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to check admin status')
        }

        const data = await response.json()
        
        // Also get role from client-side function
        const role = await getUserRole(user.uid)

        setStatus({
          userId: data.userId || user.uid,
          email: data.email || user.email || null,
          isAdmin: data.isAdmin || role === 'admin',
          role: data.role || role || null,
          isActive: data.isActive || false,
          displayName: data.displayName || null,
          loading: false,
          error: null,
        })
      } catch (error: any) {
        console.error('Error checking admin status:', error)
        setStatus(prev => ({
          ...prev,
          loading: false,
          error: error.message || 'Failed to check admin status',
        }))
      }
    }

    checkStatus()
  }, [])

  if (status.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Checking admin status...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-6">Admin Status Check</h1>

          {status.error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              <p className="font-semibold">Error:</p>
              <p>{status.error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold mb-2">User Information</h2>
              <div className="space-y-2 text-sm">
                <p><strong>User ID:</strong> {status.userId || 'N/A'}</p>
                <p><strong>Email:</strong> {status.email || 'N/A'}</p>
                <p><strong>Display Name:</strong> {status.displayName || 'N/A'}</p>
              </div>
            </div>

            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold mb-2">Role & Permissions</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <strong>Role:</strong>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    status.role === 'admin' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {status.role || 'Not set'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <strong>Active:</strong>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    status.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {status.isActive ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <strong>Is Admin:</strong>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    status.isAdmin 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {status.isAdmin ? '✅ YES' : '❌ NO'}
                  </span>
                </div>
              </div>
            </div>

            {status.isAdmin ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <p className="text-green-800 font-semibold">
                  ✅ You have admin access!
                </p>
                <p className="text-green-700 text-sm mt-2">
                  You can access the admin panel and receive admin email notifications.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-yellow-800 font-semibold">
                  ⚠️ Admin access not detected
                </p>
                <p className="text-yellow-700 text-sm mt-2">
                  Your account does not have admin privileges. To get admin access:
                </p>
                <ul className="list-disc list-inside text-yellow-700 text-sm mt-2 space-y-1">
                  <li>Run the setup script: <code className="bg-yellow-100 px-1 rounded">npx tsx scripts/setup-admin.ts</code></li>
                  <li>Or update your user in Firestore: role = "admin", isActive = true</li>
                </ul>
              </div>
            )}

            <div className="pt-4">
              <button
                onClick={() => router.push('/admin')}
                className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 font-medium"
              >
                Go to Admin Panel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


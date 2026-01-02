'use client'

import { useEffect, useState } from 'react'
import { getPendingRegistrationRequests, approveRegistration, rejectRegistration, RegistrationRequest } from '@/app/actions/registration'
import { Check, X, RefreshCw } from 'lucide-react'

export default function RegistrationManager() {
  const [requests, setRequests] = useState<RegistrationRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      setLoading(true)
      const data = await getPendingRegistrationRequests()
      setRequests(data)
      console.log('Loaded registration requests:', data.length, data)
    } catch (error: any) {
      console.error('Error loading registration requests:', error)
      alert(`Error loading registration requests: ${error.message || 'Unknown error'}. Check console for details.`)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (requestId: string) => {
    if (!confirm('Are you sure you want to approve this registration request?')) {
      return
    }

    try {
      setProcessing(requestId)
      await approveRegistration(requestId)
      await loadRequests()
      alert('Registration approved successfully! The user can now log in.')
    } catch (error: any) {
      console.error('Error approving registration:', error)
      alert(error.message || 'Failed to approve registration')
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (requestId: string) => {
    if (!confirm('Are you sure you want to reject this registration request?')) {
      return
    }

    try {
      setProcessing(requestId)
      await rejectRegistration(requestId)
      await loadRequests()
      alert('Registration rejected.')
    } catch (error: any) {
      console.error('Error rejecting registration:', error)
      alert(error.message || 'Failed to reject registration')
    } finally {
      setProcessing(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Registration Requests</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Review and approve new user registrations
          </p>
        </div>
        <button
          onClick={loadRequests}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No pending registration requests
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
            New registration requests will appear here
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-yellow-50 dark:bg-yellow-900/20">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <p className="font-semibold text-yellow-800 dark:text-yellow-200">
                {requests.length} pending request{requests.length !== 1 ? 's' : ''} waiting for approval
              </p>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {requests.map((request) => (
              <div
                key={request.id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        {request.displayName || 'No name provided'}
                      </h3>
                      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 rounded-full">
                        Pending
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      <strong>Email:</strong> {request.email}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Requested: {request.createdAt.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleApprove(request.id)}
                      disabled={processing === request.id}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processing === request.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Approve
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      disabled={processing === request.id}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


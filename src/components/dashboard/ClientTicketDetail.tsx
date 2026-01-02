'use client'

import { Ticket } from '@/lib/types/ticket'
import { format } from 'date-fns'
import { useState, useEffect } from 'react'
import { Download } from 'lucide-react'

interface ClientTicketDetailProps {
  ticket: Ticket
}

export default function ClientTicketDetail({ ticket }: ClientTicketDetailProps) {
  const [attachmentUrls, setAttachmentUrls] = useState<Record<number, string>>({})
  const [loadingUrls, setLoadingUrls] = useState<Record<number, boolean>>({})

  const loadAttachmentUrl = async (index: number, s3Key: string) => {
    setLoadingUrls(prev => ({ ...prev, [index]: true }))
    try {
      const response = await fetch(`/api/download?key=${encodeURIComponent(s3Key)}`)
      if (response.ok) {
        const { url } = await response.json()
        setAttachmentUrls(prev => ({ ...prev, [index]: url }))
      } else {
        throw new Error('Failed to get download URL')
      }
    } catch (error) {
      console.error('Error loading attachment:', error)
      alert('Failed to load attachment URL')
    } finally {
      setLoadingUrls(prev => ({ ...prev, [index]: false }))
    }
  }

  useEffect(() => {
    ticket.attachments.forEach((att, idx) => {
      if (att.s3Key && !attachmentUrls[idx]) {
        loadAttachmentUrl(idx, att.s3Key)
      }
    })
  }, [ticket.attachments])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complete':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'Ready to Review':
        return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'More Info Needed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')
  const publicStatusUrl = `${appUrl}/ticket-status/${ticket.id}/${ticket.publicKey}`

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{ticket.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Created: {format(ticket.createdAt, 'MMM d, yyyy h:mm a')}</span>
              <span>•</span>
              <span>Updated: {format(ticket.updatedAt, 'MMM d, yyyy h:mm a')}</span>
            </div>
          </div>
          <span
            className={`px-4 py-2 rounded-lg border-2 font-semibold ${getStatusColor(
              ticket.status
            )}`}
          >
            {ticket.status}
          </span>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {ticket.description}
          </p>
        </div>

        {ticket.attachments.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Attachments</h2>
            <div className="space-y-2">
              {ticket.attachments.map((att, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{att.fileName}</p>
                    <p className="text-sm text-gray-500">
                      {(att.fileSize / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  {attachmentUrls[idx] ? (
                    <a
                      href={attachmentUrls[idx]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  ) : (
                    <button
                      disabled={loadingUrls[idx]}
                      onClick={() => loadAttachmentUrl(idx, att.s3Key)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                    >
                      {loadingUrls[idx] ? 'Loading...' : 'Load'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t pt-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Public Status Link</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Share this link to allow others to view the ticket status without logging in:
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={publicStatusUrl}
              readOnly
              className="flex-1 px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(publicStatusUrl)
                alert('Link copied to clipboard!')
              }}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}




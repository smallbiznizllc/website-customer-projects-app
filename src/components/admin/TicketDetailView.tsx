'use client'

import { useState } from 'react'
import { Ticket, TicketStatus } from '@/lib/types/ticket'
import { updateTicketStatus } from '@/app/actions/tickets'
import { format } from 'date-fns'
import { Download, Save } from 'lucide-react'

interface TicketDetailViewProps {
  ticket: Ticket
}

const statusOptions: TicketStatus[] = [
  'Not Started',
  'In Progress',
  'More Info Needed',
  'Ready to Review',
  'Complete',
]

export default function TicketDetailView({ ticket: initialTicket }: TicketDetailViewProps) {
  const [ticket, setTicket] = useState(initialTicket)
  const [status, setStatus] = useState<TicketStatus>(ticket.status)
  const [internalNotes, setInternalNotes] = useState(ticket.internalNotes || '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateTicketStatus(ticket.id, status, internalNotes)
      setTicket({ ...ticket, status, internalNotes })
      alert('Ticket updated successfully!')
    } catch (error) {
      console.error('Error updating ticket:', error)
      alert('Failed to update ticket')
    } finally {
      setSaving(false)
    }
  }

  const getStatusColor = (status: TicketStatus) => {
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{ticket.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>From: {ticket.userEmail}</span>
              <span>•</span>
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
                  {att.fileUrl && (
                    <a
                      href={att.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t pt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Update Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TicketStatus)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Internal Notes (only visible to admins)
            </label>
            <textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              rows={5}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Add internal notes about this ticket..."
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}




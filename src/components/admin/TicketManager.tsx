'use client'

import { useEffect, useState } from 'react'
import { getAllTickets } from '@/app/actions/tickets'
import { Ticket, TicketStatus } from '@/lib/types/ticket'
import Link from 'next/link'
import { format } from 'date-fns'

export default function TicketManager() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTickets()
  }, [])

  const loadTickets = async () => {
    try {
      const data = await getAllTickets()
      setTickets(data)
    } catch (error) {
      console.error('Error loading tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 'Complete':
        return 'bg-green-100 text-green-800'
      case 'In Progress':
        return 'bg-blue-100 text-blue-800'
      case 'Ready to Review':
        return 'bg-purple-100 text-purple-800'
      case 'More Info Needed':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading tickets...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">All Tickets</h2>
        <button
          onClick={loadTickets}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Refresh
        </button>
      </div>

      <div className="grid gap-4">
        {tickets.map((ticket) => (
          <Link
            key={ticket.id}
            href={`/admin/tickets/${ticket.id}`}
            className="block bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">{ticket.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                  {ticket.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>From: {ticket.userEmail}</span>
                  <span>•</span>
                  <span>{format(ticket.createdAt, 'MMM d, yyyy')}</span>
                  <span>•</span>
                  <span>{ticket.attachments.length} attachment(s)</span>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  ticket.status
                )}`}
              >
                {ticket.status}
              </span>
            </div>
          </Link>
        ))}

        {tickets.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No tickets found
          </div>
        )}
      </div>
    </div>
  )
}




'use client'

import { Ticket } from '@/lib/types/ticket'
import Link from 'next/link'
import { format } from 'date-fns'

interface TicketListProps {
  tickets: Ticket[]
}

export default function TicketList({ tickets }: TicketListProps) {
  const getStatusColor = (status: string) => {
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

  if (tickets.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
        <p className="text-gray-500 mb-4">No tickets found</p>
        <Link
          href="/dashboard/tickets/new"
          className="text-primary hover:underline"
        >
          Create your first ticket
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <Link
          key={ticket.id}
          href={`/dashboard/tickets/${ticket.id}`}
          className="block bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">{ticket.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                {ticket.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{format(ticket.createdAt, 'MMM d, yyyy')}</span>
                {ticket.attachments.length > 0 && (
                  <>
                    <span>•</span>
                    <span>{ticket.attachments.length} attachment(s)</span>
                  </>
                )}
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
    </div>
  )
}




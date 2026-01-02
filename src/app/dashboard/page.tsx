import { getCurrentUser } from '@/lib/firebase/auth'
import { getUserTickets } from '@/app/actions/tickets'
import { Ticket } from '@/lib/types/ticket'
import Link from 'next/link'
import { format } from 'date-fns'
import { Plus, Ticket as TicketIcon } from 'lucide-react'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    return null
  }

  const tickets = await getUserTickets(user.uid)
  const openTickets = tickets.filter(t => t.status !== 'Complete')
  const recentTickets = tickets.slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <Link
          href="/dashboard/tickets/new"
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Ticket
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <TicketIcon className="w-8 h-8 text-primary" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Tickets
              </p>
              <p className="text-2xl font-bold">{tickets.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <TicketIcon className="w-8 h-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Open Tickets
              </p>
              <p className="text-2xl font-bold">{openTickets.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <TicketIcon className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Completed
              </p>
              <p className="text-2xl font-bold">
                {tickets.filter(t => t.status === 'Complete').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Recent Tickets</h2>
        </div>
        <div className="p-6">
          {recentTickets.length > 0 ? (
            <div className="space-y-4">
              {recentTickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/dashboard/tickets/${ticket.id}`}
                  className="block p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{ticket.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {format(ticket.createdAt, 'MMM d, yyyy')}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        ticket.status === 'Complete'
                          ? 'bg-green-100 text-green-800'
                          : ticket.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No tickets yet. Create your first ticket to get started!</p>
              <Link
                href="/dashboard/tickets/new"
                className="mt-4 inline-block text-primary hover:underline"
              >
                Create a ticket
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}




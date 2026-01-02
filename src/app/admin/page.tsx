import { getAllTickets } from '@/app/actions/tickets'
import { getAllUsers } from '@/app/actions/admin'
import { Ticket, TicketStatus } from '@/lib/types/ticket'
import { Ticket as TicketIcon, Users, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const [tickets, users] = await Promise.all([
    getAllTickets(),
    getAllUsers(),
  ])

  const stats = {
    totalTickets: tickets.length,
    openTickets: tickets.filter(t => t.status !== 'Complete').length,
    completedTickets: tickets.filter(t => t.status === 'Complete').length,
    inProgressTickets: tickets.filter(t => t.status === 'In Progress').length,
    totalUsers: users.length,
    activeUsers: users.filter(u => u.isActive).length,
  }

  const recentTickets = tickets.slice(0, 5)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <TicketIcon className="w-8 h-8 text-primary" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Tickets
              </p>
              <p className="text-2xl font-bold">{stats.totalTickets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Open Tickets
              </p>
              <p className="text-2xl font-bold">{stats.openTickets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Completed
              </p>
              <p className="text-2xl font-bold">{stats.completedTickets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Users
              </p>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
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
                  href={`/admin/tickets/${ticket.id}`}
                  className="block p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{ticket.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {ticket.userEmail} • {new Date(ticket.createdAt).toLocaleDateString()}
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
              No tickets yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}




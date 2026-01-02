import { getTicketByPublicKey } from '@/app/actions/tickets'
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    ticketId: string
    publicKey: string
  }
}

export default async function TicketStatusPage({ params }: PageProps) {
  const ticket = await getTicketByPublicKey(params.ticketId, params.publicKey)

  if (!ticket) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Ticket Status</h1>
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold">Title</h2>
            <p>{ticket.title}</p>
          </div>
          <div>
            <h2 className="font-semibold">Status</h2>
            <span className={`px-3 py-1 rounded-full text-sm ${
              ticket.status === 'Complete' ? 'bg-green-100 text-green-800' :
              ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {ticket.status}
            </span>
          </div>
          <div>
            <h2 className="font-semibold">Description</h2>
            <p className="text-gray-600">{ticket.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}




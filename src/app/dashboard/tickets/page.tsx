import { getCurrentUser } from '@/lib/firebase/auth'
import { getUserTickets } from '@/app/actions/tickets'
import TicketList from '@/components/dashboard/TicketList'

export default async function TicketsPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    return null
  }

  const tickets = await getUserTickets(user.uid)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Tickets</h1>
      </div>
      <TicketList tickets={tickets} />
    </div>
  )
}




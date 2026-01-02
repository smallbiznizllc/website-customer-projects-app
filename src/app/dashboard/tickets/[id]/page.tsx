import { getCurrentUser } from '@/lib/firebase/auth'
import { getTicketById } from '@/app/actions/tickets'
import { notFound } from 'next/navigation'
import ClientTicketDetail from '@/components/dashboard/ClientTicketDetail'

interface PageProps {
  params: {
    id: string
  }
}

export default async function TicketDetailPage({ params }: PageProps) {
  const user = await getCurrentUser()
  
  if (!user) {
    return null
  }

  const ticket = await getTicketById(params.id)

  if (!ticket || ticket.userId !== user.uid) {
    notFound()
  }

  return <ClientTicketDetail ticket={ticket} />
}




import { getTicketById } from '@/app/actions/tickets'
import { notFound } from 'next/navigation'
import TicketDetailView from '@/components/admin/TicketDetailView'
import { generatePresignedDownloadUrl } from '@/lib/aws/s3'

interface PageProps {
  params: {
    id: string
  }
}

export default async function AdminTicketDetailPage({ params }: PageProps) {
  const ticket = await getTicketById(params.id)

  if (!ticket) {
    notFound()
  }

  // Generate presigned URLs for attachments
  const attachmentsWithUrls = await Promise.all(
    ticket.attachments.map(async (att) => {
      try {
        const url = await generatePresignedDownloadUrl(att.s3Key)
        return { ...att, fileUrl: url }
      } catch (error) {
        console.error('Error generating presigned URL:', error)
        return { ...att, fileUrl: '' }
      }
    })
  )

  return (
    <TicketDetailView ticket={{ ...ticket, attachments: attachmentsWithUrls }} />
  )
}




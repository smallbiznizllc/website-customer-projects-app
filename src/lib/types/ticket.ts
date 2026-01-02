export type TicketStatus = 
  | 'Not Started'
  | 'In Progress'
  | 'More Info Needed'
  | 'Ready to Review'
  | 'Complete'

export interface Ticket {
  id: string
  userId: string
  userEmail: string
  title: string
  description: string
  status: TicketStatus
  attachments: TicketAttachment[]
  internalNotes?: string
  publicKey: string // For public status link
  createdAt: Date
  updatedAt: Date
}

export interface TicketAttachment {
  fileName: string
  fileSize: number
  fileUrl: string
  uploadedAt: Date
  s3Key: string
}




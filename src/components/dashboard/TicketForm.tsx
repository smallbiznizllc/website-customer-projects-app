'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createTicket } from '@/app/actions/tickets'
import FileUpload from './FileUpload'
import { getCurrentUser } from '@/lib/firebase/auth'
import { useRouter } from 'next/navigation'

const ticketSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
})

type TicketFormData = z.infer<typeof ticketSchema>

export default function TicketForm() {
  const [attachments, setAttachments] = useState<Array<{
    fileName: string
    s3Key: string
    fileSize: number
  }>>([])
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
  })

  const onSubmit = async (data: TicketFormData) => {
    setSubmitting(true)
    try {
      const user = await getCurrentUser()
      if (!user || !user.email) {
        alert('You must be logged in to create a ticket')
        router.push('/login')
        return
      }

      const result = await createTicket(
        user.uid,
        user.email,
        data.title,
        data.description,
        attachments
      )
      
      reset()
      setAttachments([])
      alert('Ticket created successfully! You will receive an email confirmation.')
      router.push(`/dashboard/tickets/${result.ticketId}`)
    } catch (error: any) {
      console.error('Error creating ticket:', error)
      alert(error.message || 'Failed to create ticket')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          {...register('title')}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          {...register('description')}
          rows={5}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <FileUpload
        attachments={attachments}
        onAttachmentsChange={setAttachments}
      />

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-primary text-white py-2 px-4 rounded-lg disabled:opacity-50 hover:bg-primary/90"
      >
        {submitting ? 'Creating...' : 'Create Ticket'}
      </button>
    </form>
  )
}




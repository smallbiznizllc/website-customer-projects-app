'use client'

import { useState, useEffect } from 'react'
import { getUserTickets } from '@/app/actions/tickets'
import { Ticket } from '@/lib/types/ticket'

export function useTickets(userId: string | null) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    getUserTickets(userId).then((data) => {
      setTickets(data)
      setLoading(false)
    })
  }, [userId])

  return { tickets, loading }
}




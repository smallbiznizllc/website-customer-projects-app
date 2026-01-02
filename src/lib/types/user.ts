export type UserRole = 'admin' | 'client'

export interface User {
  id: string
  email: string
  role: UserRole
  displayName?: string
  isActive: boolean
  createdAt: Date
  lastLoginAt?: Date
}




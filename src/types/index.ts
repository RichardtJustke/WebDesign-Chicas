import { EventStatus, OrderStatus } from '@prisma/client'

export interface EventFormData {
  title: string
  date: string
  timeStart: string
  timeEnd: string
  location: string
  description?: string
  items: EventItemFormData[]
}

export interface EventItemFormData {
  name: string
  category: string
  qty: number
  unitPrice: number
  notes?: string
}

export interface OrderFormData {
  eventId: string
  paymentMethod: 'pix' | 'card'
}

export interface User {
  id: string
  name: string | null
  email: string
  createdAt: Date
}

export interface Event {
  id: string
  userId: string
  title: string
  date: Date
  timeStart: string
  timeEnd: string
  location: string
  description: string | null
  status: EventStatus
  createdAt: Date
  updatedAt: Date
  eventItems: EventItem[]
}

export interface EventItem {
  id: string
  eventId: string
  name: string
  category: string
  qty: number
  unitPrice: number
  notes: string | null
  subtotal: number
}

export interface Order {
  id: string
  userId: string
  eventId: string
  total: number
  currency: string
  status: OrderStatus
  paymentMethod: string | null
  createdAt: Date
  paidAt: Date | null
  pdfUrl: string | null
  event: Event
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}




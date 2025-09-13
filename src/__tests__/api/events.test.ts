import { POST, GET } from '@/app/api/events/route'
import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

// Mock das dependências
jest.mock('next-auth')
jest.mock('@/lib/prisma', () => ({
  prisma: {
    $transaction: jest.fn(),
    event: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    eventItem: {
      create: jest.fn(),
    },
  },
}))

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>
const mockPrisma = prisma as jest.Mocked<typeof prisma>

describe('/api/events', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST', () => {
    it('deve criar evento com sucesso', async () => {
      // Mock da sessão autenticada
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-123', email: 'test@email.com' },
        expires: new Date().toISOString(),
      })

      // Mock do Prisma
      const mockEvent = {
        id: 'event-123',
        userId: 'user-123',
        title: 'Festa de Aniversário',
        date: new Date('2024-12-25'),
        timeStart: '18:00',
        timeEnd: '23:00',
        location: 'Salão de Festas',
        description: 'Festa de aniversário',
        status: 'DRAFT',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const mockEventItem = {
        id: 'item-123',
        eventId: 'event-123',
        name: 'Bolo',
        category: 'Doces',
        qty: 1,
        unitPrice: 50.00,
        notes: 'Bolo de chocolate',
        subtotal: 50.00,
      }

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        return callback({
          event: {
            create: jest.fn().mockResolvedValue(mockEvent),
          },
          eventItem: {
            create: jest.fn().mockResolvedValue(mockEventItem),
          },
        })
      })

      const requestBody = {
        title: 'Festa de Aniversário',
        date: '2024-12-25',
        timeStart: '18:00',
        timeEnd: '23:00',
        location: 'Salão de Festas',
        description: 'Festa de aniversário',
        items: [
          {
            name: 'Bolo',
            category: 'Doces',
            qty: 1,
            unitPrice: 50.00,
            notes: 'Bolo de chocolate',
          },
        ],
      }

      const request = new NextRequest('http://localhost:3000/api/events', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Evento criado com sucesso')
    })

    it('deve retornar erro 401 se não autenticado', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/events', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Não autorizado')
    })

    it('deve retornar erro 400 para dados inválidos', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-123', email: 'test@email.com' },
        expires: new Date().toISOString(),
      })

      const requestBody = {
        title: '', // Título vazio
        date: '2024-12-25',
        timeStart: '18:00',
        timeEnd: '23:00',
        location: 'Salão de Festas',
        items: [], // Sem itens
      }

      const request = new NextRequest('http://localhost:3000/api/events', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Dados inválidos')
    })
  })

  describe('GET', () => {
    it('deve retornar eventos do usuário', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user-123', email: 'test@email.com' },
        expires: new Date().toISOString(),
      })

      const mockEvents = [
        {
          id: 'event-123',
          userId: 'user-123',
          title: 'Festa de Aniversário',
          date: new Date('2024-12-25'),
          timeStart: '18:00',
          timeEnd: '23:00',
          location: 'Salão de Festas',
          description: 'Festa de aniversário',
          status: 'DRAFT',
          createdAt: new Date(),
          updatedAt: new Date(),
          eventItems: [],
          orders: [],
        },
      ]

      mockPrisma.event.findMany.mockResolvedValue(mockEvents)

      const request = new NextRequest('http://localhost:3000/api/events')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockEvents)
    })

    it('deve retornar erro 401 se não autenticado', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/events')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Não autorizado')
    })
  })
})




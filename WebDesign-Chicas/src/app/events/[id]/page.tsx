"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Event, Order } from '@/types'
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils'
import { Edit, Send, FileText, Mail } from 'lucide-react'

interface EventPageProps {
  params: { id: string }
}

export default function EventPage({ params }: EventPageProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchEventData()
    }
  }, [status, router, params.id])

  const fetchEventData = async () => {
    try {
      const [eventResponse, ordersResponse] = await Promise.all([
        fetch(`/api/events/${params.id}`),
        fetch('/api/orders')
      ])

      const eventData = await eventResponse.json()
      const ordersData = await ordersResponse.json()

      if (eventData.success) {
        setEvent(eventData.data)
      } else {
        setError(eventData.error || 'Evento não encontrado')
      }

      if (ordersData.success) {
        // Filtrar pedidos relacionados a este evento
        const eventOrders = ordersData.data.filter((order: Order) => order.eventId === params.id)
        setOrders(eventOrders)
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setError('Erro ao carregar dados do evento')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateOrder = async () => {
    if (!event) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: event.id,
          paymentMethod: 'pix' // Default para PIX
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Atualizar status do evento para SUBMITTED
        await fetch(`/api/events/${params.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...event,
            status: 'SUBMITTED'
          }),
        })

        // Recarregar dados
        fetchEventData()
      } else {
        setError(result.error || 'Erro ao criar pedido')
      }
    } catch (error) {
      console.error('Erro ao criar pedido:', error)
      setError('Erro interno do servidor')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmOrder = async (orderId: string) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/orders/${orderId}/confirm`, {
        method: 'POST',
      })

      const result = await response.json()

      if (result.success) {
        fetchEventData()
      } else {
        setError(result.error || 'Erro ao confirmar pedido')
      }
    } catch (error) {
      console.error('Erro ao confirmar pedido:', error)
      setError('Erro interno do servidor')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGeneratePDF = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/pdf`, {
        method: 'POST',
      })

      const result = await response.json()

      if (result.success) {
        // Aqui você pode implementar o download do PDF ou mostrar uma mensagem de sucesso
        alert('PDF gerado com sucesso!')
      } else {
        setError(result.error || 'Erro ao gerar PDF')
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      setError('Erro interno do servidor')
    }
  }

  const handleSendEmail = async (orderId: string) => {
    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      })

      const result = await response.json()

      if (result.success) {
        alert('Email enviado com sucesso!')
      } else {
        setError(result.error || 'Erro ao enviar email')
      }
    } catch (error) {
      console.error('Erro ao enviar email:', error)
      setError('Erro interno do servidor')
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (error && !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Erro</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.push('/profile')}>
            Voltar ao Perfil
          </Button>
        </div>
      </div>
    )
  }

  if (!event) {
    return null
  }

  const totalValue = event.eventItems.reduce((sum, item) => sum + Number(item.subtotal), 0)
  const pendingOrder = orders.find(order => order.status === 'PENDING')
  const confirmedOrder = orders.find(order => order.status === 'PAID')

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
            <p className="text-gray-600">
              Criado em {formatDateTime(event.createdAt)}
            </p>
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/events/${event.id}/edit`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>

        {/* Status e Ações */}
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    event.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                    event.status === 'SUBMITTED' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {event.status === 'CONFIRMED' ? 'Confirmado' :
                     event.status === 'SUBMITTED' ? 'Enviado' : 'Rascunho'}
                  </span>
                </div>
                
                <div className="space-x-2">
                  {event.status === 'DRAFT' && (
                    <Button onClick={handleCreateOrder} disabled={isSubmitting}>
                      <Send className="h-4 w-4 mr-2" />
                      {isSubmitting ? 'Enviando...' : 'Enviar Pedido'}
                    </Button>
                  )}
                  
                  {pendingOrder && (
                    <Button 
                      onClick={() => handleConfirmOrder(pendingOrder.id)}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Confirmando...' : 'Confirmar Pedido'}
                    </Button>
                  )}
                  
                  {confirmedOrder && (
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => handleGeneratePDF(confirmedOrder.id)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Gerar PDF
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleSendEmail(confirmedOrder.id)}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Enviar Email
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informações do Evento */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Evento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Data e Horário</h3>
                <p className="text-gray-600">
                  {formatDate(event.date)} - {event.timeStart} às {event.timeEnd}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">Local</h3>
                <p className="text-gray-600">{event.location}</p>
              </div>
              
              {event.description && (
                <div>
                  <h3 className="font-medium text-gray-900">Descrição</h3>
                  <p className="text-gray-600">{event.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumo Financeiro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total de Itens:</span>
                  <span>{event.eventItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Valor Total:</span>
                  <span className="font-semibold">{formatCurrency(totalValue)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Itens */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Itens do Evento</CardTitle>
            <CardDescription>
              Lista completa de itens e valores
            </CardDescription>
          </CardHeader>
          <CardContent>
            {event.eventItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Nenhum item adicionado ao evento
              </p>
            ) : (
              <div className="space-y-4">
                {event.eventItems.map((item, index) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.category}</p>
                        {item.notes && (
                          <p className="text-sm text-gray-500 mt-1">{item.notes}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          {item.qty} x {formatCurrency(item.unitPrice)}
                        </div>
                        <div className="font-semibold">
                          {formatCurrency(Number(item.subtotal))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total:</span>
                    <span>{formatCurrency(totalValue)}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Histórico de Pedidos */}
        {orders.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">
                          Pedido #{order.id.slice(-8)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Criado em {formatDateTime(order.createdAt)}
                        </p>
                        {order.paidAt && (
                          <p className="text-sm text-gray-600">
                            Pago em {formatDateTime(order.paidAt)}
                          </p>
                        )}
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                          order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                          order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status === 'PAID' ? 'Pago' :
                           order.status === 'PENDING' ? 'Pendente' : 'Cancelado'}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {formatCurrency(Number(order.total))}
                        </div>
                        <div className="text-sm text-gray-600">
                          {order.paymentMethod?.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}




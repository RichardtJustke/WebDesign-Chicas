# Exemplos de Uso da API

Este documento contém exemplos práticos de como usar as APIs do Sistema de Gestão de Eventos.

## 🔐 Autenticação

### Registro de Usuário

```typescript
const registerUser = async () => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'João Silva',
      email: 'joao@email.com',
      password: 'minhasenha123',
      confirmPassword: 'minhasenha123'
    })
  })

  const result = await response.json()
  
  if (result.success) {
    console.log('Usuário criado:', result.data)
  } else {
    console.error('Erro:', result.error)
  }
}
```

### Login (NextAuth)

```typescript
import { signIn } from 'next-auth/react'

const loginUser = async () => {
  const result = await signIn('credentials', {
    email: 'joao@email.com',
    password: 'minhasenha123',
    redirect: false
  })

  if (result?.ok) {
    console.log('Login realizado com sucesso')
  } else {
    console.error('Erro no login:', result?.error)
  }
}
```

## 📅 Eventos

### Criar Evento

```typescript
const createEvent = async () => {
  const eventData = {
    title: 'Festa de Aniversário',
    date: '2024-12-25',
    timeStart: '18:00',
    timeEnd: '23:00',
    location: 'Salão de Festas ABC',
    description: 'Festa de aniversário de 30 anos',
    items: [
      {
        name: 'Bolo',
        category: 'Doces',
        qty: 1,
        unitPrice: 50.00,
        notes: 'Bolo de chocolate com recheio de brigadeiro'
      },
      {
        name: 'Refrigerantes',
        category: 'Bebidas',
        qty: 20,
        unitPrice: 3.50,
        notes: 'Coca-Cola, Fanta, Sprite'
      },
      {
        name: 'Salgadinhos',
        category: 'Salgados',
        qty: 100,
        unitPrice: 0.80,
        notes: 'Coxinha, pastel, rissole'
      }
    ]
  }

  const response = await fetch('/api/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData)
  })

  const result = await response.json()
  
  if (result.success) {
    console.log('Evento criado:', result.data)
    return result.data.id
  } else {
    console.error('Erro:', result.error)
  }
}
```

### Listar Eventos do Usuário

```typescript
const getUserEvents = async () => {
  const response = await fetch('/api/events')
  const result = await response.json()
  
  if (result.success) {
    console.log('Eventos:', result.data)
    return result.data
  } else {
    console.error('Erro:', result.error)
  }
}
```

### Buscar Evento Específico

```typescript
const getEvent = async (eventId: string) => {
  const response = await fetch(`/api/events/${eventId}`)
  const result = await response.json()
  
  if (result.success) {
    console.log('Evento:', result.data)
    return result.data
  } else {
    console.error('Erro:', result.error)
  }
}
```

### Atualizar Evento

```typescript
const updateEvent = async (eventId: string) => {
  const eventData = {
    title: 'Festa de Aniversário Atualizada',
    date: '2024-12-25',
    timeStart: '19:00', // Mudou o horário
    timeEnd: '24:00',
    location: 'Salão de Festas ABC',
    description: 'Festa de aniversário de 30 anos - versão atualizada',
    items: [
      {
        name: 'Bolo',
        category: 'Doces',
        qty: 1,
        unitPrice: 60.00, // Preço aumentou
        notes: 'Bolo de chocolate com recheio de brigadeiro'
      }
      // ... outros itens
    ]
  }

  const response = await fetch(`/api/events/${eventId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData)
  })

  const result = await response.json()
  
  if (result.success) {
    console.log('Evento atualizado:', result.data)
  } else {
    console.error('Erro:', result.error)
  }
}
```

## 🛒 Pedidos

### Criar Pedido

```typescript
const createOrder = async (eventId: string) => {
  const orderData = {
    eventId: eventId,
    paymentMethod: 'pix' // ou 'card'
  }

  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData)
  })

  const result = await response.json()
  
  if (result.success) {
    console.log('Pedido criado:', result.data)
    return result.data.id
  } else {
    console.error('Erro:', result.error)
  }
}
```

### Listar Pedidos do Usuário

```typescript
const getUserOrders = async () => {
  const response = await fetch('/api/orders')
  const result = await response.json()
  
  if (result.success) {
    console.log('Pedidos:', result.data)
    return result.data
  } else {
    console.error('Erro:', result.error)
  }
}
```

### Confirmar Pedido (Marcar como Pago)

```typescript
const confirmOrder = async (orderId: string) => {
  const response = await fetch(`/api/orders/${orderId}/confirm`, {
    method: 'POST'
  })

  const result = await response.json()
  
  if (result.success) {
    console.log('Pedido confirmado:', result.data)
  } else {
    console.error('Erro:', result.error)
  }
}
```

## 📄 PDF e Email

### Gerar PDF do Pedido

```typescript
const generatePDF = async (orderId: string) => {
  const response = await fetch(`/api/orders/${orderId}/pdf`, {
    method: 'POST'
  })

  const result = await response.json()
  
  if (result.success) {
    // O PDF é retornado como base64
    const pdfData = result.data.pdf
    const filename = result.data.filename
    
    // Converter para blob e fazer download
    const byteCharacters = atob(pdfData.split(',')[1])
    const byteNumbers = new Array(byteCharacters.length)
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: 'application/pdf' })
    
    // Criar link de download
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    window.URL.revokeObjectURL(url)
    
    console.log('PDF gerado com sucesso')
  } else {
    console.error('Erro:', result.error)
  }
}
```

### Enviar Email com PDF

```typescript
const sendEmailWithPDF = async (orderId: string) => {
  const response = await fetch('/api/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ orderId })
  })

  const result = await response.json()
  
  if (result.success) {
    console.log('Email enviado:', result.data)
  } else {
    console.error('Erro:', result.error)
  }
}
```

## 🔄 Fluxo Completo

### Exemplo de Fluxo Completo

```typescript
const completeEventFlow = async () => {
  try {
    // 1. Criar evento
    const eventId = await createEvent()
    if (!eventId) throw new Error('Falha ao criar evento')
    
    // 2. Buscar evento criado
    const event = await getEvent(eventId)
    console.log('Evento criado:', event.title)
    
    // 3. Criar pedido
    const orderId = await createOrder(eventId)
    if (!orderId) throw new Error('Falha ao criar pedido')
    
    // 4. Confirmar pedido (simular pagamento)
    await confirmOrder(orderId)
    console.log('Pedido confirmado')
    
    // 5. Gerar PDF
    await generatePDF(orderId)
    console.log('PDF gerado')
    
    // 6. Enviar email
    await sendEmailWithPDF(orderId)
    console.log('Email enviado')
    
    console.log('Fluxo completo realizado com sucesso!')
    
  } catch (error) {
    console.error('Erro no fluxo:', error)
  }
}
```

## 🛡️ Tratamento de Erros

### Exemplo de Tratamento de Erros

```typescript
const handleApiCall = async (url: string, options: RequestInit) => {
  try {
    const response = await fetch(url, options)
    const result = await response.json()
    
    if (!response.ok) {
      throw new Error(result.error || 'Erro na requisição')
    }
    
    return result
    
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro da API:', error.message)
      
      // Tratar diferentes tipos de erro
      if (error.message.includes('Não autorizado')) {
        // Redirecionar para login
        window.location.href = '/login'
      } else if (error.message.includes('Dados inválidos')) {
        // Mostrar erros de validação
        console.log('Verifique os dados enviados')
      } else {
        // Erro genérico
        console.log('Erro interno do servidor')
      }
    }
    
    throw error
  }
}
```

## 📱 Uso com React Hooks

### Hook Personalizado para Eventos

```typescript
import { useState, useEffect } from 'react'

const useEvents = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchEvents = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/events')
      const result = await response.json()
      
      if (result.success) {
        setEvents(result.data)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Erro ao carregar eventos')
    } finally {
      setLoading(false)
    }
  }

  const createEvent = async (eventData) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      })
      
      const result = await response.json()
      
      if (result.success) {
        setEvents(prev => [result.data, ...prev])
        return result.data
      } else {
        setError(result.error)
        return null
      }
    } catch (err) {
      setError('Erro ao criar evento')
      return null
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent
  }
}

// Uso do hook
const MyComponent = () => {
  const { events, loading, error, createEvent } = useEvents()

  const handleCreateEvent = async () => {
    const eventData = {
      title: 'Novo Evento',
      date: '2024-12-25',
      timeStart: '18:00',
      timeEnd: '23:00',
      location: 'Local do Evento',
      items: [
        {
          name: 'Item 1',
          category: 'Categoria',
          qty: 1,
          unitPrice: 10.00
        }
      ]
    }

    const newEvent = await createEvent(eventData)
    if (newEvent) {
      console.log('Evento criado:', newEvent)
    }
  }

  if (loading) return <div>Carregando...</div>
  if (error) return <div>Erro: {error}</div>

  return (
    <div>
      <button onClick={handleCreateEvent}>Criar Evento</button>
      {events.map(event => (
        <div key={event.id}>{event.title}</div>
      ))}
    </div>
  )
}
```

## 🔧 Configurações Avançadas

### Interceptadores de Requisição

```typescript
// Adicionar token de autenticação automaticamente
const apiClient = {
  async request(url: string, options: RequestInit = {}) {
    const session = await getSession()
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }
    
    if (session?.user?.id) {
      headers['Authorization'] = `Bearer ${session.user.id}`
    }
    
    return fetch(url, {
      ...options,
      headers
    })
  }
}

// Uso
const response = await apiClient.request('/api/events', {
  method: 'POST',
  body: JSON.stringify(eventData)
})
```

### Cache e Otimização

```typescript
// Cache simples para evitar requisições desnecessárias
const cache = new Map()

const cachedFetch = async (url: string, options: RequestInit = {}) => {
  const cacheKey = `${url}-${JSON.stringify(options)}`
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)
  }
  
  const response = await fetch(url, options)
  const data = await response.json()
  
  cache.set(cacheKey, data)
  
  // Limpar cache após 5 minutos
  setTimeout(() => {
    cache.delete(cacheKey)
  }, 5 * 60 * 1000)
  
  return data
}
```




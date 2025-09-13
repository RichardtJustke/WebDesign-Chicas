"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { eventSchema, type EventFormData, type EventItemFormData } from '@/lib/validations'
import { formatCurrency } from '@/lib/utils'
import { Plus, Minus, Trash2 } from 'lucide-react'

export default function NewEventPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    date: '',
    timeStart: '',
    timeEnd: '',
    location: '',
    description: '',
    items: []
  })

  const [newItem, setNewItem] = useState<EventItemFormData>({
    name: '',
    category: '',
    qty: 1,
    unitPrice: 0,
    notes: ''
  })

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    router.push('/login')
    return null
  }

  const addItem = () => {
    if (!newItem.name.trim() || !newItem.category.trim()) {
      setErrors({ item: 'Nome e categoria são obrigatórios' })
      return
    }

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { ...newItem }]
    }))

    setNewItem({
      name: '',
      category: '',
      qty: 1,
      unitPrice: 0,
      notes: ''
    })
    setErrors({})
  }

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const updateItemQuantity = (index: number, qty: number) => {
    if (qty < 1) return
    
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, qty } : item
      )
    }))
  }

  const updateItemPrice = (index: number, unitPrice: number) => {
    if (unitPrice < 0) return
    
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, unitPrice } : item
      )
    }))
  }

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => total + (item.qty * item.unitPrice), 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      const validatedData = eventSchema.parse(formData)

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      })

      const result = await response.json()

      if (result.success) {
        router.push(`/events/${result.data.id}`)
      } else {
        setErrors({ submit: result.error || 'Erro ao criar evento' })
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        const zodError = error as any
        const fieldErrors: Record<string, string> = {}
        zodError.errors.forEach((err: any) => {
          const path = err.path.join('.')
          fieldErrors[path] = err.message
        })
        setErrors(fieldErrors)
      } else {
        setErrors({ submit: 'Erro interno do servidor' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewItem(prev => ({ 
      ...prev, 
      [name]: name === 'qty' || name === 'unitPrice' ? Number(value) : value 
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Criar Novo Evento</h1>
          <p className="text-gray-600">Preencha os dados do evento e adicione os itens necessários</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Formulário do Evento */}
            <Card>
              <CardHeader>
                <CardTitle>Informações do Evento</CardTitle>
                <CardDescription>
                  Dados básicos do seu evento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Evento *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ex: Festa de Aniversário"
                    aria-invalid={!!errors.title}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600" role="alert">{errors.title}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Data *</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      aria-invalid={!!errors.date}
                    />
                    {errors.date && (
                      <p className="text-sm text-red-600" role="alert">{errors.date}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Local *</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Ex: Salão de Festas"
                      aria-invalid={!!errors.location}
                    />
                    {errors.location && (
                      <p className="text-sm text-red-600" role="alert">{errors.location}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timeStart">Horário de Início *</Label>
                    <Input
                      id="timeStart"
                      name="timeStart"
                      type="time"
                      value={formData.timeStart}
                      onChange={handleChange}
                      aria-invalid={!!errors.timeStart}
                    />
                    {errors.timeStart && (
                      <p className="text-sm text-red-600" role="alert">{errors.timeStart}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeEnd">Horário de Fim *</Label>
                    <Input
                      id="timeEnd"
                      name="timeEnd"
                      type="time"
                      value={formData.timeEnd}
                      onChange={handleChange}
                      aria-invalid={!!errors.timeEnd}
                    />
                    {errors.timeEnd && (
                      <p className="text-sm text-red-600" role="alert">{errors.timeEnd}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Descrição adicional do evento..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Carrinho de Itens */}
            <Card>
              <CardHeader>
                <CardTitle>Carrinho de Itens</CardTitle>
                <CardDescription>
                  Adicione os itens necessários para o evento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Formulário para adicionar item */}
                <div className="border rounded-lg p-4 space-y-3">
                  <h3 className="font-medium">Adicionar Item</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="itemName">Nome *</Label>
                      <Input
                        id="itemName"
                        name="name"
                        value={newItem.name}
                        onChange={handleItemChange}
                        placeholder="Ex: Bolo"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="itemCategory">Categoria *</Label>
                      <Input
                        id="itemCategory"
                        name="category"
                        value={newItem.category}
                        onChange={handleItemChange}
                        placeholder="Ex: Doces"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="itemQty">Qtd</Label>
                      <Input
                        id="itemQty"
                        name="qty"
                        type="number"
                        min="1"
                        value={newItem.qty}
                        onChange={handleItemChange}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="itemPrice">Preço Unit.</Label>
                      <Input
                        id="itemPrice"
                        name="unitPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        value={newItem.unitPrice}
                        onChange={handleItemChange}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>&nbsp;</Label>
                      <Button type="button" onClick={addItem} className="w-full">
                        <Plus className="h-4 w-4 mr-1" />
                        Adicionar
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="itemNotes">Observações</Label>
                    <Input
                      id="itemNotes"
                      name="notes"
                      value={newItem.notes}
                      onChange={handleItemChange}
                      placeholder="Observações especiais..."
                    />
                  </div>

                  {errors.item && (
                    <p className="text-sm text-red-600" role="alert">{errors.item}</p>
                  )}
                </div>

                {/* Lista de itens */}
                <div className="space-y-3">
                  <h3 className="font-medium">Itens Adicionados ({formData.items.length})</h3>
                  
                  {formData.items.length === 0 ? (
                    <p className="text-gray-500 text-sm">Nenhum item adicionado ainda</p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {formData.items.map((item, index) => (
                        <div key={index} className="border rounded-lg p-3 space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-sm text-gray-600">{item.category}</p>
                              {item.notes && (
                                <p className="text-xs text-gray-500">{item.notes}</p>
                              )}
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeItem(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => updateItemQuantity(index, item.qty - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium min-w-[2rem] text-center">
                              {item.qty}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => updateItemQuantity(index, item.qty + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => updateItemPrice(index, Number(e.target.value))}
                              className="w-20 h-8 text-sm"
                            />
                            
                            <span className="text-sm font-medium text-right min-w-[4rem]">
                              {formatCurrency(item.qty * item.unitPrice)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Total */}
                {formData.items.length > 0 && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total:</span>
                      <span>{formatCurrency(calculateTotal())}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Botões de ação */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            
            <div className="space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  // Salvar como rascunho
                  setFormData(prev => ({ ...prev }))
                }}
              >
                Salvar Rascunho
              </Button>
              
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Criando...' : 'Criar Evento'}
              </Button>
            </div>
          </div>

          {errors.submit && (
            <div className="text-center">
              <p className="text-red-600" role="alert">{errors.submit}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}




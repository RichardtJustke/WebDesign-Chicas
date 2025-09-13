import { eventSchema, eventItemSchema, orderSchema, registerSchema, loginSchema } from '@/lib/validations'

describe('Validações', () => {
  describe('eventSchema', () => {
    it('deve validar dados corretos de evento', () => {
      const validEvent = {
        title: 'Festa de Aniversário',
        date: '2024-12-25',
        timeStart: '18:00',
        timeEnd: '23:00',
        location: 'Salão de Festas',
        description: 'Festa de aniversário de 30 anos',
        items: [
          {
            name: 'Bolo',
            category: 'Doces',
            qty: 1,
            unitPrice: 50.00,
            notes: 'Bolo de chocolate'
          }
        ]
      }

      const result = eventSchema.safeParse(validEvent)
      expect(result.success).toBe(true)
    })

    it('deve rejeitar evento sem título', () => {
      const invalidEvent = {
        title: '',
        date: '2024-12-25',
        timeStart: '18:00',
        timeEnd: '23:00',
        location: 'Salão de Festas',
        items: []
      }

      const result = eventSchema.safeParse(invalidEvent)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Título é obrigatório')
      }
    })

    it('deve rejeitar evento sem itens', () => {
      const invalidEvent = {
        title: 'Festa de Aniversário',
        date: '2024-12-25',
        timeStart: '18:00',
        timeEnd: '23:00',
        location: 'Salão de Festas',
        items: []
      }

      const result = eventSchema.safeParse(invalidEvent)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Pelo menos um item é obrigatório')
      }
    })

    it('deve rejeitar horário de início posterior ao fim', () => {
      const invalidEvent = {
        title: 'Festa de Aniversário',
        date: '2024-12-25',
        timeStart: '23:00',
        timeEnd: '18:00',
        location: 'Salão de Festas',
        items: [
          {
            name: 'Bolo',
            category: 'Doces',
            qty: 1,
            unitPrice: 50.00
          }
        ]
      }

      const result = eventSchema.safeParse(invalidEvent)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Horário de início deve ser anterior ao horário de fim')
      }
    })
  })

  describe('eventItemSchema', () => {
    it('deve validar item correto', () => {
      const validItem = {
        name: 'Bolo',
        category: 'Doces',
        qty: 1,
        unitPrice: 50.00,
        notes: 'Bolo de chocolate'
      }

      const result = eventItemSchema.safeParse(validItem)
      expect(result.success).toBe(true)
    })

    it('deve rejeitar item sem nome', () => {
      const invalidItem = {
        name: '',
        category: 'Doces',
        qty: 1,
        unitPrice: 50.00
      }

      const result = eventItemSchema.safeParse(invalidItem)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Nome do item é obrigatório')
      }
    })

    it('deve rejeitar quantidade menor que 1', () => {
      const invalidItem = {
        name: 'Bolo',
        category: 'Doces',
        qty: 0,
        unitPrice: 50.00
      }

      const result = eventItemSchema.safeParse(invalidItem)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Quantidade deve ser pelo menos 1')
      }
    })

    it('deve rejeitar preço negativo', () => {
      const invalidItem = {
        name: 'Bolo',
        category: 'Doces',
        qty: 1,
        unitPrice: -10.00
      }

      const result = eventItemSchema.safeParse(invalidItem)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Preço deve ser maior ou igual a 0')
      }
    })
  })

  describe('registerSchema', () => {
    it('deve validar dados corretos de registro', () => {
      const validUser = {
        name: 'João Silva',
        email: 'joao@email.com',
        password: '123456',
        confirmPassword: '123456'
      }

      const result = registerSchema.safeParse(validUser)
      expect(result.success).toBe(true)
    })

    it('deve rejeitar senhas diferentes', () => {
      const invalidUser = {
        name: 'João Silva',
        email: 'joao@email.com',
        password: '123456',
        confirmPassword: '654321'
      }

      const result = registerSchema.safeParse(invalidUser)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Senhas não coincidem')
      }
    })

    it('deve rejeitar email inválido', () => {
      const invalidUser = {
        name: 'João Silva',
        email: 'email-invalido',
        password: '123456',
        confirmPassword: '123456'
      }

      const result = registerSchema.safeParse(invalidUser)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Email inválido')
      }
    })

    it('deve rejeitar senha muito curta', () => {
      const invalidUser = {
        name: 'João Silva',
        email: 'joao@email.com',
        password: '123',
        confirmPassword: '123'
      }

      const result = registerSchema.safeParse(invalidUser)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Senha deve ter pelo menos 6 caracteres')
      }
    })
  })

  describe('loginSchema', () => {
    it('deve validar dados corretos de login', () => {
      const validLogin = {
        email: 'joao@email.com',
        password: '123456'
      }

      const result = loginSchema.safeParse(validLogin)
      expect(result.success).toBe(true)
    })

    it('deve rejeitar email inválido', () => {
      const invalidLogin = {
        email: 'email-invalido',
        password: '123456'
      }

      const result = loginSchema.safeParse(invalidLogin)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Email inválido')
      }
    })

    it('deve rejeitar senha vazia', () => {
      const invalidLogin = {
        email: 'joao@email.com',
        password: ''
      }

      const result = loginSchema.safeParse(invalidLogin)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Senha é obrigatória')
      }
    })
  })
})




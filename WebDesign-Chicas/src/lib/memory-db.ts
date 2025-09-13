// Banco em memória temporário para testes
export interface User {
  id: string
  name: string
  email: string
  phone?: string
  passwordHash: string
  createdAt: Date
}

export const users: User[] = []

import { z } from "zod"

export const eventSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(100, "Título muito longo"),
  date: z.string().min(1, "Data é obrigatória"),
  timeStart: z.string().min(1, "Horário de início é obrigatório"),
  timeEnd: z.string().min(1, "Horário de fim é obrigatório"),
  location: z.string().min(1, "Local é obrigatório").max(200, "Local muito longo"),
  description: z.string().max(500, "Descrição muito longa").optional(),
  items: z.array(z.object({
    name: z.string().min(1, "Nome do item é obrigatório").max(100, "Nome muito longo"),
    category: z.string().min(1, "Categoria é obrigatória").max(50, "Categoria muito longa"),
    qty: z.number().min(1, "Quantidade deve ser pelo menos 1"),
    unitPrice: z.number().min(0, "Preço deve ser maior ou igual a 0"),
    notes: z.string().max(200, "Observações muito longas").optional(),
  })).min(1, "Pelo menos um item é obrigatório")
}).refine((data) => {
  // Validar se timeStart < timeEnd
  const startTime = new Date(`2000-01-01T${data.timeStart}`)
  const endTime = new Date(`2000-01-01T${data.timeEnd}`)
  return startTime < endTime
}, {
  message: "Horário de início deve ser anterior ao horário de fim",
  path: ["timeEnd"]
})

export const eventItemSchema = z.object({
  name: z.string().min(1, "Nome do item é obrigatório").max(100, "Nome muito longo"),
  category: z.string().min(1, "Categoria é obrigatória").max(50, "Categoria muito longa"),
  qty: z.number().min(1, "Quantidade deve ser pelo menos 1"),
  unitPrice: z.number().min(0, "Preço deve ser maior ou igual a 0"),
  notes: z.string().max(200, "Observações muito longas").optional(),
})

export const orderSchema = z.object({
  eventId: z.string().min(1, "ID do evento é obrigatório"),
  paymentMethod: z.enum(['pix', 'card'], {
    required_error: "Método de pagamento é obrigatório"
  })
})

export const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100, "Nome muito longo"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").max(100, "Senha muito longa"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"]
})

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória")
})

export type EventFormData = z.infer<typeof eventSchema>
export type EventItemFormData = z.infer<typeof eventItemSchema>
export type OrderFormData = z.infer<typeof orderSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type LoginFormData = z.infer<typeof loginSchema>




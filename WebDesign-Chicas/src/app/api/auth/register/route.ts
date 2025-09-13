import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { users } from "@/lib/memory-db"

const registerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres")
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    // Verificar se o usuário já existe
    const existingUser = users.find(
      user => user.email === validatedData.email.toLowerCase().trim()
    )

    if (existingUser) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 400 }
      )
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(validatedData.password, 10)

    // Criar usuário
    const newUser = {
      id: `user_${Date.now()}`,
      name: validatedData.name,
      email: validatedData.email.toLowerCase().trim(),
      phone: validatedData.phone,
      passwordHash,
      createdAt: new Date()
    }
    
    users.push(newUser)

    console.log("Usuário criado:", newUser.email)
    console.log("Total de usuários:", users.length)

    return NextResponse.json({ ok: true }, { status: 201 })

  } catch (error) {
    console.error("Erro no registro:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}




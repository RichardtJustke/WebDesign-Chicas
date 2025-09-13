import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { orderSchema } from "@/lib/validations"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Não autorizado" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = orderSchema.parse(body)

    // Verificar se o evento existe e pertence ao usuário
    const event = await prisma.event.findFirst({
      where: {
        id: validatedData.eventId,
        userId: session.user.id
      },
      include: {
        eventItems: true
      }
    })

    if (!event) {
      return NextResponse.json(
        { success: false, error: "Evento não encontrado" },
        { status: 404 }
      )
    }

    // Calcular total
    const total = event.eventItems.reduce((sum, item) => sum + Number(item.subtotal), 0)

    // Criar pedido
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        eventId: validatedData.eventId,
        total,
        currency: 'BRL',
        status: 'PENDING',
        paymentMethod: validatedData.paymentMethod,
      },
      include: {
        event: {
          include: {
            eventItems: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: order,
      message: "Pedido criado com sucesso"
    })

  } catch (error) {
    console.error("Erro ao criar pedido:", error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: "Dados inválidos" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Não autorizado" },
        { status: 401 }
      )
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        event: {
          include: {
            eventItems: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: orders
    })

  } catch (error) {
    console.error("Erro ao buscar pedidos:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}




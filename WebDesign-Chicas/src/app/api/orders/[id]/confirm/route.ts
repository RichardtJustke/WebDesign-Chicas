import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Não autorizado" },
        { status: 401 }
      )
    }

    // Verificar se o pedido existe e pertence ao usuário
    const order = await prisma.order.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Pedido não encontrado" },
        { status: 404 }
      )
    }

    // Atualizar status do pedido e evento
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Atualizar pedido
      const updatedOrder = await tx.order.update({
        where: { id: params.id },
        data: {
          status: 'PAID',
          paidAt: new Date(),
        }
      })

      // Atualizar status do evento
      await tx.event.update({
        where: { id: order.eventId },
        data: {
          status: 'CONFIRMED'
        }
      })

      return updatedOrder
    })

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: "Pedido confirmado com sucesso"
    })

  } catch (error) {
    console.error("Erro ao confirmar pedido:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}




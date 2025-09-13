import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { eventSchema } from "@/lib/validations"

export async function GET(
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

    const event = await prisma.event.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      },
      include: {
        eventItems: true,
        orders: true,
      }
    })

    if (!event) {
      return NextResponse.json(
        { success: false, error: "Evento não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: event
    })

  } catch (error) {
    console.error("Erro ao buscar evento:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

export async function PUT(
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

    const body = await request.json()
    const validatedData = eventSchema.parse(body)

    // Verificar se o evento existe e pertence ao usuário
    const existingEvent = await prisma.event.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!existingEvent) {
      return NextResponse.json(
        { success: false, error: "Evento não encontrado" },
        { status: 404 }
      )
    }

    // Atualizar evento e itens em uma transação
    const event = await prisma.$transaction(async (tx) => {
      // Atualizar evento
      const updatedEvent = await tx.event.update({
        where: { id: params.id },
        data: {
          title: validatedData.title,
          date: new Date(validatedData.date),
          timeStart: validatedData.timeStart,
          timeEnd: validatedData.timeEnd,
          location: validatedData.location,
          description: validatedData.description,
        }
      })

      // Deletar itens existentes
      await tx.eventItem.deleteMany({
        where: { eventId: params.id }
      })

      // Criar novos itens
      const eventItems = await Promise.all(
        validatedData.items.map(item =>
          tx.eventItem.create({
            data: {
              eventId: params.id,
              name: item.name,
              category: item.category,
              qty: item.qty,
              unitPrice: item.unitPrice,
              notes: item.notes,
              subtotal: item.qty * item.unitPrice,
            }
          })
        )
      )

      return { ...updatedEvent, eventItems }
    })

    return NextResponse.json({
      success: true,
      data: event,
      message: "Evento atualizado com sucesso"
    })

  } catch (error) {
    console.error("Erro ao atualizar evento:", error)
    
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




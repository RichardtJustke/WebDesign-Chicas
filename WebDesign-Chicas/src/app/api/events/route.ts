import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { eventSchema } from "@/lib/validations"

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
    const validatedData = eventSchema.parse(body)

    // Criar evento com itens em uma transação
    const event = await prisma.$transaction(async (tx) => {
      // Criar evento
      const newEvent = await tx.event.create({
        data: {
          userId: session.user.id,
          title: validatedData.title,
          date: new Date(validatedData.date),
          timeStart: validatedData.timeStart,
          timeEnd: validatedData.timeEnd,
          location: validatedData.location,
          description: validatedData.description,
          status: 'DRAFT',
        }
      })

      // Criar itens do evento
      const eventItems = await Promise.all(
        validatedData.items.map(item =>
          tx.eventItem.create({
            data: {
              eventId: newEvent.id,
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

      return { ...newEvent, eventItems }
    })

    return NextResponse.json({
      success: true,
      data: event,
      message: "Evento criado com sucesso"
    })

  } catch (error) {
    console.error("Erro ao criar evento:", error)
    
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

    const events = await prisma.event.findMany({
      where: { userId: session.user.id },
      include: {
        eventItems: true,
        orders: true,
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: events
    })

  } catch (error) {
    console.error("Erro ao buscar eventos:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}




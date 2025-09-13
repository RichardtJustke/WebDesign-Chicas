import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Não autorizado" },
        { status: 401 }
      )
    }

    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "ID do pedido é obrigatório" },
        { status: 400 }
      )
    }

    // Buscar pedido com dados completos
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: session.user.id
      },
      include: {
        user: true,
        event: {
          include: {
            eventItems: true
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Pedido não encontrado" },
        { status: 404 }
      )
    }

    // Gerar PDF (reutilizar lógica da API de PDF)
    const pdfResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/orders/${orderId}/pdf`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.user.id}` // Você pode implementar um token de API aqui
      }
    })

    if (!pdfResponse.ok) {
      return NextResponse.json(
        { success: false, error: "Erro ao gerar PDF" },
        { status: 500 }
      )
    }

    const pdfData = await pdfResponse.json()
    
    if (!pdfData.success) {
      return NextResponse.json(
        { success: false, error: pdfData.error },
        { status: 500 }
      )
    }

    // Converter base64 para buffer
    const pdfBase64 = pdfData.data.pdf.split(',')[1]
    const pdfBuffer = Buffer.from(pdfBase64, 'base64')

    // Enviar email
    const emailData = await resend.emails.send({
      from: 'Sistema de Eventos <noreply@seudominio.com>', // Substitua pelo seu domínio
      to: [order.user.email],
      subject: `Relatório do Evento: ${order.event.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Relatório do Evento</h1>
          
          <p>Olá ${order.user.name || 'Cliente'},</p>
          
          <p>Segue em anexo o relatório completo do seu evento <strong>${order.event.title}</strong>.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #374151; margin-top: 0;">Resumo do Evento</h2>
            <p><strong>Data:</strong> ${new Date(order.event.date).toLocaleDateString('pt-BR')}</p>
            <p><strong>Horário:</strong> ${order.event.timeStart} às ${order.event.timeEnd}</p>
            <p><strong>Local:</strong> ${order.event.location}</p>
            <p><strong>Total:</strong> R$ ${Number(order.total).toFixed(2)}</p>
            <p><strong>Status:</strong> ${order.status === 'PAID' ? 'Pago' : order.status === 'PENDING' ? 'Pendente' : 'Cancelado'}</p>
          </div>
          
          <p>O PDF contém todos os detalhes do evento, incluindo a lista completa de itens e valores.</p>
          
          <p>Se você tiver alguma dúvida, entre em contato conosco.</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          
          <p style="color: #6b7280; font-size: 14px;">
            Este email foi enviado automaticamente pelo Sistema de Gestão de Eventos.<br>
            Data de envio: ${new Date().toLocaleString('pt-BR')}
          </p>
        </div>
      `,
      attachments: [
        {
          filename: pdfData.data.filename,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    })

    if (emailData.error) {
      console.error('Erro ao enviar email:', emailData.error)
      return NextResponse.json(
        { success: false, error: "Erro ao enviar email" },
        { status: 500 }
      )
    }

    // Atualizar URL do PDF no pedido (opcional)
    await prisma.order.update({
      where: { id: orderId },
      data: {
        pdfUrl: pdfData.data.filename // Você pode salvar a URL do PDF aqui se usar storage
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        emailId: emailData.data?.id,
        message: "Email enviado com sucesso"
      }
    })

  } catch (error) {
    console.error("Erro ao enviar email:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}




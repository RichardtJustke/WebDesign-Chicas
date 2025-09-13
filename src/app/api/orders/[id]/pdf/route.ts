import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import jsPDF from "jspdf"

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

    // Buscar pedido com dados completos
    const order = await prisma.order.findFirst({
      where: {
        id: params.id,
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

    // Gerar PDF
    const pdf = new jsPDF()
    
    // Configurações do PDF
    const pageWidth = pdf.internal.pageSize.getWidth()
    const margin = 20
    const contentWidth = pageWidth - (margin * 2)
    
    let yPosition = margin
    
    // Função para adicionar texto com quebra de linha
    const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
      pdf.setFontSize(fontSize)
      if (isBold) {
        pdf.setFont(undefined, 'bold')
      } else {
        pdf.setFont(undefined, 'normal')
      }
      
      const lines = pdf.splitTextToSize(text, contentWidth)
      pdf.text(lines, margin, yPosition)
      yPosition += lines.length * (fontSize * 0.4) + 5
    }

    // Cabeçalho
    addText('RELATÓRIO DE EVENTO', 20, true)
    addText('Sistema de Gestão de Eventos', 14)
    addText('', 12) // Espaço
    
    // Dados do usuário
    addText('DADOS DO CLIENTE', 16, true)
    addText(`Nome: ${order.user.name || 'Não informado'}`, 12)
    addText(`Email: ${order.user.email}`, 12)
    addText(`Data do Pedido: ${new Date(order.createdAt).toLocaleDateString('pt-BR')}`, 12)
    addText('', 12) // Espaço
    
    // Dados do evento
    addText('DADOS DO EVENTO', 16, true)
    addText(`Título: ${order.event.title}`, 12)
    addText(`Data: ${new Date(order.event.date).toLocaleDateString('pt-BR')}`, 12)
    addText(`Horário: ${order.event.timeStart} às ${order.event.timeEnd}`, 12)
    addText(`Local: ${order.event.location}`, 12)
    if (order.event.description) {
      addText(`Descrição: ${order.event.description}`, 12)
    }
    addText('', 12) // Espaço
    
    // Itens do evento
    addText('ITENS DO EVENTO', 16, true)
    
    // Cabeçalho da tabela
    const tableHeaders = ['Item', 'Categoria', 'Qtd', 'Preço Unit.', 'Subtotal']
    const colWidths = [60, 40, 20, 30, 30]
    let xPosition = margin
    
    pdf.setFontSize(10)
    pdf.setFont(undefined, 'bold')
    
    tableHeaders.forEach((header, index) => {
      pdf.text(header, xPosition, yPosition)
      xPosition += colWidths[index]
    })
    
    yPosition += 10
    
    // Linha separadora
    pdf.line(margin, yPosition, pageWidth - margin, yPosition)
    yPosition += 5
    
    // Dados dos itens
    pdf.setFont(undefined, 'normal')
    pdf.setFontSize(9)
    
    order.event.eventItems.forEach((item) => {
      xPosition = margin
      
      // Verificar se precisa de nova página
      if (yPosition > 250) {
        pdf.addPage()
        yPosition = margin
      }
      
      const itemData = [
        item.name,
        item.category,
        item.qty.toString(),
        `R$ ${Number(item.unitPrice).toFixed(2)}`,
        `R$ ${Number(item.subtotal).toFixed(2)}`
      ]
      
      itemData.forEach((data, index) => {
        pdf.text(data, xPosition, yPosition)
        xPosition += colWidths[index]
      })
      
      yPosition += 8
      
      // Observações do item (se houver)
      if (item.notes) {
        pdf.setFontSize(8)
        pdf.text(`Obs: ${item.notes}`, margin + 5, yPosition)
        yPosition += 6
        pdf.setFontSize(9)
      }
    })
    
    yPosition += 10
    
    // Linha separadora final
    pdf.line(margin, yPosition, pageWidth - margin, yPosition)
    yPosition += 10
    
    // Total
    pdf.setFontSize(12)
    pdf.setFont(undefined, 'bold')
    pdf.text(`TOTAL: R$ ${Number(order.total).toFixed(2)}`, pageWidth - margin - 50, yPosition)
    
    yPosition += 20
    
    // Status do pedido
    addText('STATUS DO PEDIDO', 16, true)
    addText(`Status: ${order.status === 'PAID' ? 'PAGO' : order.status === 'PENDING' ? 'PENDENTE' : 'CANCELADO'}`, 12)
    addText(`Método de Pagamento: ${order.paymentMethod?.toUpperCase() || 'Não informado'}`, 12)
    if (order.paidAt) {
      addText(`Data do Pagamento: ${new Date(order.paidAt).toLocaleDateString('pt-BR')}`, 12)
    }
    
    yPosition += 20
    
    // Rodapé
    addText('Este documento foi gerado automaticamente pelo Sistema de Gestão de Eventos.', 10)
    addText(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 10)
    
    // Converter para buffer
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'))
    
    // Aqui você pode salvar o PDF em um storage (AWS S3, etc.) se necessário
    // Por enquanto, vamos retornar o PDF como base64 para download
    
    const pdfBase64 = pdf.output('datauristring')
    
    return NextResponse.json({
      success: true,
      data: {
        pdf: pdfBase64,
        filename: `evento-${order.event.title}-${new Date().toISOString().split('T')[0]}.pdf`
      },
      message: "PDF gerado com sucesso"
    })

  } catch (error) {
    console.error("Erro ao gerar PDF:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}




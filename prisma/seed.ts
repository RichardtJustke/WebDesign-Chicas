import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar usuários de exemplo
  const hashedPassword = await bcrypt.hash('123456', 12)

  const user1 = await prisma.user.upsert({
    where: { email: 'joao@email.com' },
    update: {},
    create: {
      name: 'João Silva',
      email: 'joao@email.com',
      passwordHash: hashedPassword,
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'maria@email.com' },
    update: {},
    create: {
      name: 'Maria Santos',
      email: 'maria@email.com',
      passwordHash: hashedPassword,
    },
  })

  console.log('✅ Usuários criados:', { user1: user1.email, user2: user2.email })

  // Criar eventos de exemplo
  const event1 = await prisma.event.create({
    data: {
      userId: user1.id,
      title: 'Festa de Aniversário',
      date: new Date('2024-12-25'),
      timeStart: '18:00',
      timeEnd: '23:00',
      location: 'Salão de Festas ABC',
      description: 'Festa de aniversário de 30 anos',
      status: 'CONFIRMED',
    },
  })

  const event2 = await prisma.event.create({
    data: {
      userId: user1.id,
      title: 'Casamento',
      date: new Date('2024-06-15'),
      timeStart: '16:00',
      timeEnd: '02:00',
      location: 'Fazenda São José',
      description: 'Cerimônia e recepção de casamento',
      status: 'DRAFT',
    },
  })

  const event3 = await prisma.event.create({
    data: {
      userId: user2.id,
      title: 'Formatura',
      date: new Date('2024-08-20'),
      timeStart: '19:00',
      timeEnd: '01:00',
      location: 'Centro de Convenções',
      description: 'Festa de formatura da turma 2024',
      status: 'SUBMITTED',
    },
  })

  console.log('✅ Eventos criados:', { 
    event1: event1.title, 
    event2: event2.title, 
    event3: event3.title 
  })

  // Criar itens para os eventos
  const event1Items = await Promise.all([
    prisma.eventItem.create({
      data: {
        eventId: event1.id,
        name: 'Bolo',
        category: 'Doces',
        qty: 1,
        unitPrice: 50.00,
        notes: 'Bolo de chocolate com recheio de brigadeiro',
        subtotal: 50.00,
      },
    }),
    prisma.eventItem.create({
      data: {
        eventId: event1.id,
        name: 'Refrigerantes',
        category: 'Bebidas',
        qty: 20,
        unitPrice: 3.50,
        notes: 'Coca-Cola, Fanta, Sprite',
        subtotal: 70.00,
      },
    }),
    prisma.eventItem.create({
      data: {
        eventId: event1.id,
        name: 'Salgadinhos',
        category: 'Salgados',
        qty: 100,
        unitPrice: 0.80,
        notes: 'Coxinha, pastel, rissole',
        subtotal: 80.00,
      },
    }),
  ])

  const event2Items = await Promise.all([
    prisma.eventItem.create({
      data: {
        eventId: event2.id,
        name: 'Buffet Completo',
        category: 'Alimentação',
        qty: 1,
        unitPrice: 2500.00,
        notes: 'Buffet completo para 100 pessoas',
        subtotal: 2500.00,
      },
    }),
    prisma.eventItem.create({
      data: {
        eventId: event2.id,
        name: 'Decoração',
        category: 'Decoração',
        qty: 1,
        unitPrice: 800.00,
        notes: 'Decoração completa do salão',
        subtotal: 800.00,
      },
    }),
    prisma.eventItem.create({
      data: {
        eventId: event2.id,
        name: 'Fotógrafo',
        category: 'Serviços',
        qty: 1,
        unitPrice: 1200.00,
        notes: 'Fotógrafo profissional por 8 horas',
        subtotal: 1200.00,
      },
    }),
  ])

  const event3Items = await Promise.all([
    prisma.eventItem.create({
      data: {
        eventId: event3.id,
        name: 'Coquetel',
        category: 'Alimentação',
        qty: 1,
        unitPrice: 1500.00,
        notes: 'Coquetel para 80 pessoas',
        subtotal: 1500.00,
      },
    }),
    prisma.eventItem.create({
      data: {
        eventId: event3.id,
        name: 'DJ',
        category: 'Entretenimento',
        qty: 1,
        unitPrice: 600.00,
        notes: 'DJ profissional por 6 horas',
        subtotal: 600.00,
      },
    }),
  ])

  console.log('✅ Itens criados:', { 
    event1Items: event1Items.length, 
    event2Items: event2Items.length, 
    event3Items: event3Items.length 
  })

  // Criar pedidos de exemplo
  const order1 = await prisma.order.create({
    data: {
      userId: user1.id,
      eventId: event1.id,
      total: 200.00, // Soma dos itens do event1
      currency: 'BRL',
      status: 'PAID',
      paymentMethod: 'pix',
      paidAt: new Date(),
    },
  })

  const order2 = await prisma.order.create({
    data: {
      userId: user1.id,
      eventId: event2.id,
      total: 4500.00, // Soma dos itens do event2
      currency: 'BRL',
      status: 'PENDING',
      paymentMethod: 'card',
    },
  })

  const order3 = await prisma.order.create({
    data: {
      userId: user2.id,
      eventId: event3.id,
      total: 2100.00, // Soma dos itens do event3
      currency: 'BRL',
      status: 'PAID',
      paymentMethod: 'pix',
      paidAt: new Date(),
    },
  })

  console.log('✅ Pedidos criados:', { 
    order1: order1.id, 
    order2: order2.id, 
    order3: order3.id 
  })

  console.log('🎉 Seed concluído com sucesso!')
  console.log('\n📊 Resumo dos dados criados:')
  console.log(`👥 Usuários: 2`)
  console.log(`📅 Eventos: 3`)
  console.log(`🛒 Itens: ${event1Items.length + event2Items.length + event3Items.length}`)
  console.log(`📋 Pedidos: 3`)
  console.log('\n🔑 Credenciais de teste:')
  console.log('Email: joao@email.com | Senha: 123456')
  console.log('Email: maria@email.com | Senha: 123456')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })




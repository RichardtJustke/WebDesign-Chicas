# Sistema de Gestão de Eventos

Um sistema completo para criação e gestão de eventos desenvolvido com Next.js 14, TypeScript, Prisma e PostgreSQL.

## 🚀 Funcionalidades

### Autenticação
- ✅ Registro de usuários
- ✅ Login com NextAuth
- ✅ Proteção de rotas
- ✅ Sessões seguras

### Gestão de Eventos
- ✅ Criação de eventos com formulário completo
- ✅ Edição de eventos existentes
- ✅ Status de eventos (Rascunho, Enviado, Confirmado)
- ✅ Validação de dados com Zod

### Carrinho de Itens
- ✅ Adicionar/remover itens do evento
- ✅ Controle de quantidade e preços
- ✅ Observações por item
- ✅ Cálculo automático de subtotais

### Pedidos e Pagamentos
- ✅ Criação de pedidos a partir de eventos
- ✅ Status de pedidos (Pendente, Pago, Cancelado)
- ✅ Métodos de pagamento (PIX, Cartão)
- ✅ Confirmação de pagamentos

### Relatórios e Comunicação
- ✅ Geração de PDF com dados completos
- ✅ Envio de email com PDF anexado
- ✅ Relatórios profissionais

## 🛠️ Tecnologias

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL com Prisma ORM
- **Authentication**: NextAuth.js
- **Validation**: Zod + React Hook Form
- **PDF Generation**: jsPDF
- **Email**: Resend
- **Testing**: Jest + Testing Library

## 📋 Pré-requisitos

- Node.js 18+ 
- PostgreSQL 14+
- npm ou yarn

## 🚀 Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd event-management-system
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp env.example .env.local
```

Edite o arquivo `.env.local` com suas configurações:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/event_management"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Email (Resend)
RESEND_API_KEY="your-resend-api-key"
```

4. **Configure o banco de dados**
```bash
# Gerar cliente Prisma
npm run db:generate

# Executar migrações
npm run db:migrate

# (Opcional) Popular com dados de exemplo
npm run db:seed
```

5. **Execute o projeto**
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 14)
│   ├── api/               # API Routes
│   │   ├── auth/          # Autenticação
│   │   ├── events/        # Eventos
│   │   ├── orders/        # Pedidos
│   │   └── email/         # Email
│   ├── events/            # Páginas de eventos
│   ├── login/             # Página de login
│   ├── register/          # Página de registro
│   └── profile/           # Dashboard do usuário
├── components/            # Componentes React
│   └── ui/               # Componentes de UI
├── lib/                   # Utilitários e configurações
│   ├── auth.ts           # Configuração NextAuth
│   ├── prisma.ts         # Cliente Prisma
│   ├── validations.ts    # Schemas Zod
│   └── utils.ts          # Funções utilitárias
├── types/                 # Tipos TypeScript
└── __tests__/            # Testes
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa linter

# Banco de dados
npm run db:generate  # Gera cliente Prisma
npm run db:push      # Sincroniza schema com banco
npm run db:migrate   # Executa migrações
npm run db:seed      # Popula banco com dados de exemplo

# Testes
npm run test         # Executa testes
npm run test:watch   # Executa testes em modo watch
```

## 📚 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Eventos
- `GET /api/events` - Lista eventos do usuário
- `POST /api/events` - Cria novo evento
- `GET /api/events/[id]` - Busca evento específico
- `PUT /api/events/[id]` - Atualiza evento

### Pedidos
- `GET /api/orders` - Lista pedidos do usuário
- `POST /api/orders` - Cria novo pedido
- `POST /api/orders/[id]/confirm` - Confirma pedido
- `POST /api/orders/[id]/pdf` - Gera PDF do pedido

### Email
- `POST /api/email/send` - Envia email com PDF

## 🧪 Testes

O projeto inclui testes para:
- Validações com Zod
- APIs de eventos e pedidos
- Componentes React

Execute os testes:
```bash
npm run test
```

## 🔒 Segurança

- ✅ Autenticação com NextAuth
- ✅ Proteção de rotas com middleware
- ✅ Validação de dados com Zod
- ✅ Sanitização de inputs
- ✅ Hash de senhas com bcrypt
- ✅ Rate limiting (implementar conforme necessário)

## 🎨 Acessibilidade

O projeto segue boas práticas de acessibilidade:
- ✅ Labels apropriados
- ✅ Atributos ARIA
- ✅ Navegação por teclado
- ✅ Contraste adequado
- ✅ Screen reader friendly

## 📱 Responsividade

- ✅ Design responsivo com Tailwind CSS
- ✅ Mobile-first approach
- ✅ Componentes adaptáveis

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Outras plataformas
- Configure as variáveis de ambiente
- Execute `npm run build`
- Inicie com `npm run start`

## 🔧 Configurações Adicionais

### Integração com Gateway de Pagamento

Para integrar com Stripe, adicione no `.env.local`:
```env
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Storage de Arquivos (AWS S3)

Para salvar PDFs em storage:
```env
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your-bucket-name"
```

## 📝 Exemplos de Uso

### Criar um Evento

```typescript
const eventData = {
  title: "Festa de Aniversário",
  date: "2024-12-25",
  timeStart: "18:00",
  timeEnd: "23:00",
  location: "Salão de Festas",
  description: "Festa de aniversário de 30 anos",
  items: [
    {
      name: "Bolo",
      category: "Doces",
      qty: 1,
      unitPrice: 50.00,
      notes: "Bolo de chocolate"
    }
  ]
}

const response = await fetch('/api/events', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(eventData)
})
```

### Criar um Pedido

```typescript
const orderData = {
  eventId: "event-123",
  paymentMethod: "pix"
}

const response = await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(orderData)
})
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique a documentação
2. Procure por issues existentes
3. Crie uma nova issue com detalhes do problema

## 🗺️ Roadmap

- [ ] Integração com gateway de pagamento (Stripe/PIX)
- [ ] Upload de imagens para eventos
- [ ] Notificações em tempo real
- [ ] Dashboard administrativo
- [ ] Relatórios avançados
- [ ] API pública
- [ ] App mobile




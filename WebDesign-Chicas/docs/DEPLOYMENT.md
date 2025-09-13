# Guia de Deploy

Este documento contém instruções detalhadas para fazer deploy do Sistema de Gestão de Eventos em diferentes plataformas.

## 🚀 Deploy no Vercel (Recomendado)

### 1. Preparação

1. **Conecte seu repositório ao GitHub/GitLab**
2. **Acesse [vercel.com](https://vercel.com)**
3. **Faça login e conecte sua conta**

### 2. Configuração do Projeto

1. **Clique em "New Project"**
2. **Importe seu repositório**
3. **Configure as seguintes opções:**
   - Framework Preset: `Next.js`
   - Root Directory: `./` (padrão)
   - Build Command: `npm run build`
   - Output Directory: `.next` (padrão)
   - Install Command: `npm install`

### 3. Variáveis de Ambiente

Adicione as seguintes variáveis de ambiente no painel do Vercel:

```env
# Database (use uma URL de produção)
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth
NEXTAUTH_URL="https://seu-dominio.vercel.app"
NEXTAUTH_SECRET="sua-chave-secreta-super-segura"

# Email (Resend)
RESEND_API_KEY="re_xxxxxxxxxx"

# Opcional: Stripe
STRIPE_SECRET_KEY="sk_live_xxxxxxxxxx"
STRIPE_PUBLISHABLE_KEY="pk_live_xxxxxxxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxx"

# Opcional: AWS S3
AWS_ACCESS_KEY_ID="AKIAXXXXXXXXXX"
AWS_SECRET_ACCESS_KEY="xxxxxxxxxxxxxxxxxx"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="seu-bucket"
```

### 4. Banco de Dados

#### Opção 1: Supabase (Gratuito)
1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Copie a connection string
4. Use no `DATABASE_URL`

#### Opção 2: PlanetScale
1. Acesse [planetscale.com](https://planetscale.com)
2. Crie um banco de dados
3. Copie a connection string
4. Use no `DATABASE_URL`

#### Opção 3: Railway
1. Acesse [railway.app](https://railway.app)
2. Crie um serviço PostgreSQL
3. Copie a connection string
4. Use no `DATABASE_URL`

### 5. Deploy

1. **Clique em "Deploy"**
2. **Aguarde o build completar**
3. **Acesse sua aplicação**

### 6. Configuração Pós-Deploy

```bash
# Execute as migrações do banco
npx prisma migrate deploy

# Gere o cliente Prisma
npx prisma generate
```

## 🐳 Deploy com Docker

### 1. Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 2. docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/event_management
      - NEXTAUTH_URL=http://localhost:3000
      - NEXTAUTH_SECRET=your-secret-key
      - RESEND_API_KEY=your-resend-key
    depends_on:
      - db

  db:
    image: postgres:14
    environment:
      - POSTGRES_DB=event_management
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

### 3. Deploy

```bash
# Build e execute
docker-compose up -d

# Execute migrações
docker-compose exec app npx prisma migrate deploy
```

## ☁️ Deploy no AWS

### 1. Preparação

1. **Configure AWS CLI**
2. **Crie um bucket S3 para assets**
3. **Configure RDS PostgreSQL**

### 2. Elastic Beanstalk

```bash
# Instale EB CLI
npm install -g aws-elasticbeanstalk-cli

# Configure
eb init

# Crie ambiente
eb create production

# Deploy
eb deploy
```

### 3. Variáveis de Ambiente no EB

```bash
eb setenv DATABASE_URL="postgresql://..."
eb setenv NEXTAUTH_URL="https://seu-dominio.elasticbeanstalk.com"
eb setenv NEXTAUTH_SECRET="sua-chave-secreta"
eb setenv RESEND_API_KEY="sua-chave-resend"
```

## 🏗️ Deploy no DigitalOcean

### 1. Droplet

1. **Crie um droplet Ubuntu 20.04**
2. **Configure SSH**
3. **Instale Node.js e PostgreSQL**

### 2. Configuração do Servidor

```bash
# Atualize o sistema
sudo apt update && sudo apt upgrade -y

# Instale Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instale PostgreSQL
sudo apt install postgresql postgresql-contrib

# Instale PM2
sudo npm install -g pm2

# Instale Nginx
sudo apt install nginx
```

### 3. Deploy da Aplicação

```bash
# Clone o repositório
git clone <seu-repositorio>
cd event-management-system

# Instale dependências
npm install

# Configure variáveis de ambiente
cp env.example .env
nano .env

# Build da aplicação
npm run build

# Execute migrações
npx prisma migrate deploy

# Inicie com PM2
pm2 start npm --name "event-management" -- start
pm2 save
pm2 startup
```

### 4. Configuração do Nginx

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔒 Configuração de SSL

### Let's Encrypt (Gratuito)

```bash
# Instale Certbot
sudo apt install certbot python3-certbot-nginx

# Obtenha certificado
sudo certbot --nginx -d seu-dominio.com

# Renovação automática
sudo crontab -e
# Adicione: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Monitoramento

### 1. Logs

```bash
# PM2 logs
pm2 logs event-management

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 2. Métricas

```bash
# PM2 monitoring
pm2 monit

# Sistema
htop
df -h
free -h
```

## 🔄 CI/CD com GitHub Actions

### .github/workflows/deploy.yml

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## 🚨 Troubleshooting

### Problemas Comuns

#### 1. Erro de Build
```bash
# Limpe cache
rm -rf .next node_modules
npm install
npm run build
```

#### 2. Erro de Banco de Dados
```bash
# Verifique conexão
npx prisma db push

# Execute migrações
npx prisma migrate deploy
```

#### 3. Erro de Memória
```bash
# Aumente limite de memória
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

#### 4. Erro de Permissões
```bash
# Corrija permissões
sudo chown -R $USER:$USER /path/to/app
chmod -R 755 /path/to/app
```

## 📈 Otimizações de Performance

### 1. Next.js

```javascript
// next.config.js
module.exports = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['seu-dominio.com'],
  },
  // Otimizações
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
}
```

### 2. Banco de Dados

```sql
-- Índices para performance
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_event_id ON orders(event_id);
CREATE INDEX idx_event_items_event_id ON event_items(event_id);
```

### 3. Cache

```typescript
// Cache de API
export const revalidate = 3600 // 1 hora

// Cache de página
export const dynamic = 'force-static'
```

## 🔐 Segurança

### 1. Headers de Segurança

```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}
```

### 2. Rate Limiting

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const rateLimitMap = new Map()

export function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1'
  const limit = 10
  const windowMs = 60 * 1000 // 1 minuto

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, {
      count: 0,
      resetTime: Date.now() + windowMs
    })
  }

  const ipData = rateLimitMap.get(ip)

  if (Date.now() > ipData.resetTime) {
    ipData.count = 0
    ipData.resetTime = Date.now() + windowMs
  }

  if (ipData.count >= limit) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    )
  }

  ipData.count++

  return NextResponse.next()
}
```

## 📋 Checklist de Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados configurado e migrações executadas
- [ ] Domínio configurado (se aplicável)
- [ ] SSL configurado
- [ ] Monitoramento configurado
- [ ] Backup do banco de dados configurado
- [ ] Logs configurados
- [ ] Testes passando
- [ ] Performance otimizada
- [ ] Segurança configurada




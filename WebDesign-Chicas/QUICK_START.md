# 🚀 Guia de Instalação Rápida

Este guia te ajudará a configurar o Sistema de Gestão de Eventos em poucos minutos.

## ⚡ Instalação em 5 Passos

### 1. Clone e Instale
```bash
git clone <seu-repositorio>
cd event-management-system
npm install
```

### 2. Configure o Banco de Dados
```bash
# Copie o arquivo de exemplo
cp env.example .env.local

# Edite com suas configurações
nano .env.local
```

**Configuração mínima necessária:**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/event_management"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta-aqui"
RESEND_API_KEY="sua-chave-resend"
```

### 3. Configure o Banco
```bash
# Gere o cliente Prisma
npm run db:generate

# Execute as migrações
npm run db:migrate

# (Opcional) Popule com dados de exemplo
npm run db:seed
```

### 4. Execute o Projeto
```bash
npm run dev
```

### 5. Acesse a Aplicação
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🔑 Credenciais de Teste

Se você executou o seed, use estas credenciais:

- **Email:** `joao@email.com` | **Senha:** `123456`
- **Email:** `maria@email.com` | **Senha:** `123456`

## 🎯 Primeiros Passos

1. **Faça login** com uma das credenciais acima
2. **Acesse o perfil** para ver o dashboard
3. **Clique em "Criar Evento"** para criar seu primeiro evento
4. **Adicione itens** ao carrinho do evento
5. **Salve o evento** e veja o resumo
6. **Crie um pedido** a partir do evento
7. **Confirme o pedido** e gere o PDF

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Inicia servidor de produção

# Banco de dados
npm run db:generate  # Gera cliente Prisma
npm run db:push      # Sincroniza schema
npm run db:migrate   # Executa migrações
npm run db:seed      # Popula com dados de exemplo

# Testes
npm run test         # Executa testes
npm run test:watch   # Testes em modo watch
```

## 🚨 Solução de Problemas

### Erro de Conexão com Banco
```bash
# Verifique se o PostgreSQL está rodando
sudo systemctl status postgresql

# Teste a conexão
psql -h localhost -U username -d event_management
```

### Erro de Build
```bash
# Limpe o cache
rm -rf .next node_modules
npm install
npm run build
```

### Erro de Permissões
```bash
# Corrija permissões (Linux/Mac)
sudo chown -R $USER:$USER .
chmod -R 755 .
```

## 📚 Próximos Passos

- 📖 Leia a [documentação completa](README.md)
- 🔧 Veja [exemplos de API](docs/API_EXAMPLES.md)
- 🚀 Aprenda sobre [deploy](docs/DEPLOYMENT.md)
- 🧪 Execute os [testes](src/__tests__/)

## 🆘 Precisa de Ajuda?

1. Verifique a [documentação completa](README.md)
2. Consulte os [exemplos de API](docs/API_EXAMPLES.md)
3. Execute os testes para verificar se tudo está funcionando
4. Abra uma issue no repositório

---

**🎉 Parabéns! Seu sistema está rodando!**




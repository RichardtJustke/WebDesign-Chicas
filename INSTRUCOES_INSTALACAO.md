# 🚀 Instruções de Instalação - Checkout Mercado Pago

## 📋 Arquivos Criados

O sistema de checkout foi criado com os seguintes arquivos:

- `checkout_env.txt` - Configurações (renomeie para `.env` em produção)
- `config.php` - Carrega as configurações
- `endpoint.php` - Cria preferências de pagamento
- `botao.html` - Interface do checkout
- `webhook.php` - Recebe confirmações de pagamento
- `success.html` - Página de sucesso
- `failure.html` - Página de erro
- `pending.html` - Página de pagamento pendente

## 🔧 Passo a Passo para Instalação

### 1. Configurar Credenciais do Mercado Pago

1. **Acesse o Mercado Pago Developers**: https://developers.mercadopago.com/
2. **Crie uma conta** ou faça login
3. **Vá em "Suas integrações"** → **"Criar aplicação"**
4. **Copie as credenciais**:
   - Access Token (para backend)
   - Public Key (para frontend)

### 2. Configurar o Arquivo .env

1. **Renomeie** `checkout_env.txt` para `.env`
2. **Substitua as credenciais** no arquivo `.env`:

```env
# Para TESTE (sandbox)
MP_ACCESS_TOKEN=TEST-SEU-ACCESS-TOKEN-AQUI
MP_PUBLIC_KEY=TEST-SUA-PUBLIC-KEY-AQUI

# Para PRODUÇÃO (quando estiver pronto)
MP_ACCESS_TOKEN=APP-SEU-ACCESS-TOKEN-AQUI
MP_PUBLIC_KEY=APP-SUA-PUBLIC-KEY-AQUI
```

3. **Ajuste as URLs** conforme seu domínio:
```env
MP_SUCCESS_URL=https://seudominio.com/success.html
MP_FAILURE_URL=https://seudominio.com/failure.html
MP_PENDING_URL=https://seudominio.com/pending.html
MP_WEBHOOK_URL=https://seudominio.com/webhook.php
```

### 3. Personalizar o Produto

No arquivo `botao.html`, ajuste as configurações do produto:

```javascript
const productConfig = {
    name: 'Seu Produto',           // Nome do produto
    description: 'Descrição...',   // Descrição
    price: 99.90,                 // Preço
    currency: 'BRL',              // Moeda
    quantity: 1                   // Quantidade
};
```

### 4. Upload para o Servidor

1. **Faça upload** de todos os arquivos para seu servidor
2. **Certifique-se** que o servidor suporta PHP 7.0+
3. **Configure permissões** de escrita para os arquivos de log

### 5. Testar em Sandbox

1. **Acesse** `https://seudominio.com/botao.html`
2. **Clique** no botão de pagamento
3. **Use os cartões de teste** do Mercado Pago:
   - **Aprovado**: 4009 1753 3280 6176
   - **Rejeitado**: 4000 0000 0000 0002
   - **Pendente**: 4000 0000 0000 0004

## 🧪 Cartões de Teste (Sandbox)

| Cartão | Resultado | CVV | Vencimento |
|--------|-----------|-----|------------|
| 4009 1753 3280 6176 | Aprovado | 123 | 11/25 |
| 4000 0000 0000 0002 | Rejeitado | 123 | 11/25 |
| 4000 0000 0000 0004 | Pendente | 123 | 11/25 |

## 🔄 Configurar Webhook (Opcional)

Para receber notificações automáticas:

1. **No painel do Mercado Pago**, vá em **"Webhooks"**
2. **Adicione a URL**: `https://seudominio.com/webhook.php`
3. **Selecione os eventos**: `payment`

## 🚀 Passar para Produção

1. **Substitua as credenciais** no `.env` pelas de produção
2. **Altere** `MP_ENVIRONMENT=production`
3. **Teste** com valores pequenos primeiro
4. **Configure** o webhook para produção

## 📱 Integração no Seu Site

Para integrar o botão em qualquer página:

```html
<!-- Inclua o botão -->
<button onclick="window.open('botao.html', 'checkout', 'width=800,height=600')">
    Pagar com Mercado Pago
</button>

<!-- Ou use um iframe -->
<iframe src="botao.html" width="100%" height="400"></iframe>
```

## 🛠️ Personalização Avançada

### Alterar Estilos
Edite o CSS no arquivo `botao.html` na seção `<style>`.

### Adicionar Campos
No `endpoint.php`, você pode adicionar campos personalizados:

```php
$preferenceData = [
    'items' => [...],
    'payer' => [
        'name' => $_POST['customer_name'] ?? 'Cliente',
        'email' => $_POST['customer_email'] ?? 'cliente@exemplo.com'
    ],
    // ... outros campos
];
```

### Salvar em Banco de Dados
No `webhook.php`, substitua o salvamento em arquivo por inserção no banco:

```php
// Exemplo com MySQL
$pdo = new PDO('mysql:host=localhost;dbname=checkout', $user, $pass);
$stmt = $pdo->prepare("INSERT INTO payments (external_reference, transaction_id, amount, status) VALUES (?, ?, ?, ?)");
$stmt->execute([$externalReference, $transactionId, $amount, 'approved']);
```

## 🔍 Logs e Debug

- **Logs de notificação**: `checkout_logs.txt`
- **Pagamentos aprovados**: `approved_payments.txt`
- **Erros**: Verifique o console do navegador

## ⚠️ Segurança

1. **Nunca** exponha o Access Token no frontend
2. **Use HTTPS** em produção
3. **Valide** os dados recebidos no webhook
4. **Mantenha** as credenciais seguras

## 🆘 Suporte

- **Documentação Mercado Pago**: https://developers.mercadopago.com/
- **Status da API**: https://status.mercadopago.com/
- **Suporte**: https://developers.mercadopago.com/support

---

## ✅ Checklist Final

- [ ] Credenciais configuradas
- [ ] URLs ajustadas para seu domínio
- [ ] Produto personalizado
- [ ] Testado em sandbox
- [ ] Webhook configurado (opcional)
- [ ] Pronto para produção

**🎉 Seu checkout está pronto para receber pagamentos!**

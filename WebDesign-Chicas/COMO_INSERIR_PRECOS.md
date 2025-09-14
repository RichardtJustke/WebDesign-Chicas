# Como Inserir Preços nos Serviços

## Localização dos Dados

Os dados dos serviços estão localizados em: `assets/js/services-data.js`

## Estrutura dos Preços

### Para Buffet (Pacotes Ouro/Prata/Bronze)

```javascript
pricing: {
  type: "per_person",
  options: [
    { label: "Até 50 pessoas", price: 0, unit: "pessoa" }, // TODO: Inserir preços reais
    { label: "51-100 pessoas", price: 0, unit: "pessoa" },
    { label: "101-200 pessoas", price: 0, unit: "pessoa" },
    { label: "Mais de 200 pessoas", price: 0, unit: "pessoa" }
  ]
}
```

**Como alterar:**
- Substitua o valor `0` pelo preço real por pessoa
- Exemplo: `price: 85.50` para R$ 85,50 por pessoa

### Para Audiovisual (Pacotes por Duração)

```javascript
pricing: {
  type: "fixed",
  options: [
    { label: "Fotografia 2h", price: 0, unit: "evento" }
  ]
}
```

**Como alterar:**
- Substitua o valor `0` pelo preço fixo do pacote
- Exemplo: `price: 450.00` para R$ 450,00

### Para RH (Pacotes por Quantidade de Pessoas)

```javascript
pricing: {
  type: "per_person",
  options: [
    { label: "Até 50 pessoas", price: 0, unit: "pessoa" }
  ]
}
```

**Como alterar:**
- Substitua o valor `0` pelo preço por pessoa
- Exemplo: `price: 25.00` para R$ 25,00 por pessoa

### Para Cerimonial (Pacotes Fixos)

```javascript
pricing: {
  type: "fixed",
  options: [
    { label: "Pacote Básico", price: 0, unit: "evento" }
  ]
}
```

**Como alterar:**
- Substitua o valor `0` pelo preço fixo do pacote
- Exemplo: `price: 1200.00` para R$ 1.200,00

## Tabelas de Preços nos Itens

Para adicionar tabelas de preços nos itens individuais, altere:

```javascript
priceTable: {
  hasTable: false, // Mude para true
  items: [] // Adicione os itens da tabela
}
```

**Exemplo de tabela:**
```javascript
priceTable: {
  hasTable: true,
  items: [
    { item: "Café Expresso", price: "R$ 3,50" },
    { item: "Café com Leite", price: "R$ 4,00" },
    { item: "Sanduíche Natural", price: "R$ 8,50" }
  ]
}
```

## Formato dos Preços

- Use números decimais com ponto: `85.50`
- O sistema automaticamente formata para o padrão brasileiro: R$ 85,50
- Para valores altos, use: `1200.00` (aparecerá como R$ 1.200,00)

## Localização dos TODOs

Procure por comentários `// TODO: Inserir preços reais` no arquivo para encontrar todos os locais que precisam ser atualizados.

## Teste Após Alterações

1. Abra uma página de serviço (ex: `/pages/servicos/buffet.html`)
2. Clique em "Ver Pacotes"
3. Verifique se os preços aparecem corretamente
4. Teste o botão "Adicionar ao Carrinho"
5. Verifique se o badge do carrinho atualiza

## Observações Importantes

- **Não altere** a estrutura dos objetos, apenas os valores de `price`
- **Não remova** os comentários TODO até que todos os preços estejam inseridos
- **Mantenha** o formato dos arrays e objetos intacto
- **Teste** cada serviço após fazer alterações

## Contato WhatsApp

O número do WhatsApp está configurado em:
```javascript
const WHATSAPP_CONFIG = {
  phone: "5511999999999", // TODO: Substituir pelo número real
  defaultMessageTemplate: "Olá! Gostaria de saber mais sobre os serviços da Chicas Eventos."
};
```

Altere apenas o número `5511999999999` para o número real da empresa.

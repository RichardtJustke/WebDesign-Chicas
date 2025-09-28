# Lógica de Cálculo do Total - Checkout

## 🎯 Comportamento Implementado

### **Caso 1: Apenas um item personalizado**
- **Condição**: 1 item selecionado com "Acima de 6h" (valor personalizado)
- **Exibição**: `Total: a combinar`
- **Estilo**: Texto em cinza e itálico

### **Caso 2: Apenas itens com valores fixos**
- **Condição**: Múltiplos itens, todos com valores definidos
- **Exibição**: `Total: R$ 760,00`
- **Estilo**: Texto normal em laranja

### **Caso 3: Itens fixos + pelo menos um personalizado**
- **Condição**: Mix de itens fixos e personalizados
- **Exibição**: `Subtotal: R$ 760,00 + valor personalizado a combinar`
- **Estilo**: Texto diferenciado para destacar a separação

### **Caso 4: Múltiplos itens personalizados**
- **Condição**: Vários itens, todos personalizados
- **Exibição**: `Total: a combinar`
- **Estilo**: Texto em cinza e itálico

## 🔧 Implementação Técnica

### **Função `calculateTotalDisplay()`**
```javascript
calculateTotalDisplay() {
    // Separa serviços por tipo
    const fixedServices = this.selectedServices.filter(service => 
        service.type === 'fixed' || service.priceKey !== 'custom'
    );
    const customServices = this.selectedServices.filter(service => 
        service.priceKey === 'custom'
    );

    // Aplica lógica condicional
    // Retorna { text: string, class: string }
}
```

### **Classes CSS Aplicadas**
- `.custom-total` - Para totais "a combinar"
- `.subtotal-total` - Para subtotais com valores mistos
- Sem classe - Para totais normais

## 📊 Exemplos Práticos

### **Exemplo 1: Fotografia 8h (personalizada)**
```
Item: Fotografia (Acima de 6h)
Total: a combinar
```

### **Exemplo 2: Cerimonial + Produção (fixos)**
```
Item: Cerimonial - R$ 800,00
Item: Produção - R$ 1.200,00
Total: R$ 2.000,00
```

### **Exemplo 3: Mix de valores**
```
Item: Cerimonial - R$ 800,00
Item: Fotografia (Acima de 6h) - A combinar
Subtotal: R$ 800,00 + valor personalizado a combinar
```

## 🎨 Estilos Visuais

### **CSS para Diferentes Tipos**
```css
.custom-total {
    color: #666;
    font-style: italic;
}

.subtotal-total {
    color: #333;
    font-weight: 600;
}

/* Total normal (sem classe) */
color: #b95929;
font-weight: 700;
```

## ✅ Benefícios da Implementação

### **Clareza para o Usuário**
- ✅ Valores definidos são mostrados claramente
- ✅ Valores a negociar são destacados
- ✅ Separação visual entre fixo e personalizado

### **Transparência Comercial**
- ✅ Cliente sabe exatamente o que já está definido
- ✅ Cliente entende o que precisa ser negociado
- ✅ Evita confusão sobre valores finais

### **Experiência do Usuário**
- ✅ Interface intuitiva e clara
- ✅ Feedback visual imediato
- ✅ Informações organizadas logicamente

## 🚀 Como Testar

### **Teste 1: Item Personalizado**
1. Selecione apenas "Fotografia"
2. Escolha "Acima de 6h"
3. Verifique: "Total: a combinar"

### **Teste 2: Itens Fixos**
1. Selecione "Cerimonial" e "Produção"
2. Verifique: "Total: R$ 2.000,00"

### **Teste 3: Mix de Valores**
1. Selecione "Cerimonial" (fixo) + "Fotografia" (8h)
2. Verifique: "Subtotal: R$ 800,00 + valor personalizado a combinar"

## 📝 Notas Técnicas

- **Detecção automática**: Sistema identifica tipos de serviços automaticamente
- **Atualização em tempo real**: Total muda conforme seleções
- **Persistência**: Valores mantidos durante a sessão
- **Responsividade**: Funciona em todos os dispositivos

## 🔄 Fluxo de Funcionamento

1. **Usuário seleciona serviços**
2. **Sistema categoriza** (fixo vs personalizado)
3. **Aplica lógica condicional** baseada na combinação
4. **Atualiza interface** com texto e estilo apropriados
5. **Mantém clareza** sobre valores definidos vs negociáveis

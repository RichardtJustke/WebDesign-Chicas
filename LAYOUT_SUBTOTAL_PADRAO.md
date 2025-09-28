# Layout de Subtotal Seguindo Padrão

## 🎯 Implementação do Padrão Solicitado

### **Layout Implementado:**

**Com valores personalizados:**
```
SUBTOTAL                    R$ 1.300
                    + valor personalizado a combinar
```

**Sem valores personalizados:**
```
SUBTOTAL                    R$ 1.300
```

## ✅ Estrutura HTML

### **Container Principal**
```html
<div class="subtotal-container">
    <div class="subtotal-row">
        <div class="subtotal-label">SUBTOTAL</div>
        <div class="subtotal-value">R$ 1.300</div>
    </div>
    <div class="custom-row">+ valor personalizado a combinar</div>
</div>
```

## 🎨 Estilos CSS Aplicados

### **Container do Subtotal**
```css
.subtotal-container {
    display: flex;
    flex-direction: column;
    gap: 4px;
}
```

### **Linha do Subtotal**
```css
.subtotal-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
```

### **Label "SUBTOTAL"**
```css
.subtotal-label {
    font-family: 'Outfit', sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: #333;
}
```

### **Valor do Subtotal**
```css
.subtotal-value {
    font-family: 'Outfit', sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: #b95929;
}
```

### **Linha do Valor Personalizado**
```css
.custom-row {
    font-family: 'Outfit', sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: #b95929;
    text-align: right;
    margin-top: 2px;
}
```

## 🔧 Lógica JavaScript

### **Detecção de Valor Personalizado**
```javascript
if (totalData.text.includes('+ valor personalizado a combinar')) {
    const numericPart = totalData.text.split(' + valor personalizado a combinar')[0];
    subtotalValue.textContent = numericPart;
} else {
    subtotalValue.textContent = totalData.text;
}
```

### **Criação da Linha Personalizada**
```javascript
if (totalData.text.includes('+ valor personalizado a combinar')) {
    const customRow = document.createElement('div');
    customRow.className = 'custom-row';
    customRow.textContent = '+ valor personalizado a combinar';
    subtotalContainer.appendChild(customRow);
}
```

## 📊 Comportamentos por Cenário

### **Cenário 1: Apenas Valores Fixos**
```
SUBTOTAL                    R$ 1.300
```

### **Cenário 2: Mix de Valores**
```
SUBTOTAL                    R$ 1.300
                    + valor personalizado a combinar
```

### **Cenário 3: Apenas Personalizados**
```
SUBTOTAL                    a combinar
```

## 🎯 Características Visuais

### **Label "SUBTOTAL"**
- ✅ Fonte igual aos itens (Outfit)
- ✅ Negrito (font-weight: 700)
- ✅ Cor escura (#333)
- ✅ Alinhado à esquerda

### **Valor do Subtotal**
- ✅ Fonte Outfit
- ✅ Cor laranja (#b95929)
- ✅ Tamanho maior (18px)
- ✅ Alinhado à direita

### **Valor Personalizado**
- ✅ Mesma fonte e cor do valor
- ✅ Alinhado à direita
- ✅ Pequeno espaçamento superior
- ✅ Aparece apenas quando necessário

## 🚀 Como Testar

### **Teste 1: Valores Fixos**
1. Selecione apenas serviços fixos
2. **Verifique**: "SUBTOTAL" em negrito + valor à direita

### **Teste 2: Mix de Valores**
1. Selecione serviço fixo + personalizado
2. **Verifique**: "SUBTOTAL" + valor + linha personalizada

### **Teste 3: Apenas Personalizados**
1. Selecione apenas "a combinar"
2. **Verifique**: "SUBTOTAL" + "a combinar"

## ✅ Status: IMPLEMENTADO

Layout de subtotal implementado seguindo o padrão solicitado:
- ✅ "SUBTOTAL" em negrito à esquerda
- ✅ Valor à direita na mesma linha
- ✅ "+ valor personalizado" na linha de baixo
- ✅ Fonte consistente com os itens
- ✅ Alinhamento correto

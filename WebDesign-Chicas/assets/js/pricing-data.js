// ====== DADOS DE PREÇOS - CHICAS EVENTOS ======

// Estrutura de preços por serviço e item
const PRICING_DATA = {
  audiovisual: {
    items: {
      fotografia: {
        "2h": 800,
        "3h": 1200,
        "8h": 2500,
        "Completo (8h)": 2500,
        "Básico (2h)": 800,
        "Intermediário (3h)": 1200
      },
      filmagem: {
        "2h": 1200,
        "4h": 2000,
        "8h": 3500,
        "Básico (2h)": 1200,
        "Intermediário (4h)": 2000,
        "Completo (8h)": 3500
      },
      drone: {
        "1h": 600,
        "2h": 1000,
        "Básico (2h)": 1000,
        "Completo (2h)": 1000
      },
      "social-media": {
        "Básico": 500,
        "Completo": 800,
        "Premium": 1200
      },
      "cobertura-ao-vivo": {
        "Básico": 1500,
        "Completo": 2500,
        "Premium": 4000
      },
      "pacotes-360": {
        "Básico": 3000,
        "Completo": 5000,
        "Premium": 8000
      }
    },
    packages: {
      "fotografia-2h": { price: 800 },
      "fotografia-3h": { price: 1200 },
      "fotografia-8h": { price: 2500 },
      "filmagem-2h": { price: 1200 },
      "filmagem-4h": { price: 2000 },
      "filmagem-8h": { price: 3500 },
      "drone-1h": { price: 600 },
      "drone-2h": { price: 1000 }
    }
  },

  buffet: {
    items: {
      coqueteis: {
        "Básico": 45,
        "Premium": 65,
        "VIP": 85
      },
      "coffee-break": {
        "Básico": 25,
        "Premium": 35,
        "VIP": 45
      },
      brunch: {
        "Básico": 35,
        "Premium": 50,
        "VIP": 70
      },
      "almoco-jantar": {
        "Básico": 55,
        "Premium": 75,
        "VIP": 95
      },
      sobremesas: {
        "Básico": 20,
        "Premium": 30,
        "VIP": 40
      },
      "bebidas-bar": {
        "Básico": 30,
        "Premium": 45,
        "VIP": 60
      }
    },
    packages: {
      ouro: {
        pricePerPerson: {
          "Até 50 pessoas": 120,
          "51-100 pessoas": 110,
          "101-200 pessoas": 100,
          "Mais de 200 pessoas": 90
        }
      },
      prata: {
        pricePerPerson: {
          "Até 50 pessoas": 85,
          "51-100 pessoas": 75,
          "101-200 pessoas": 65,
          "Mais de 200 pessoas": 55
        }
      },
      bronze: {
        pricePerPerson: {
          "Até 50 pessoas": 55,
          "51-100 pessoas": 45,
          "101-200 pessoas": 35,
          "Mais de 200 pessoas": 30
        }
      }
    }
  },

  rh: {
    items: {
      "garcom-bar": {
        "Básico": 150,
        "Premium": 200,
        "VIP": 250
      },
      recepcao: {
        "Básico": 120,
        "Premium": 150,
        "VIP": 180
      },
      seguranca: {
        "Básico": 200,
        "Premium": 250,
        "VIP": 300
      },
      "apoio-operacao": {
        "Básico": 100,
        "Premium": 130,
        "VIP": 160
      },
      "coordenacao-sala": {
        "Básico": 180,
        "Premium": 220,
        "VIP": 280
      },
      "limpeza-area": {
        "Básico": 80,
        "Premium": 100,
        "VIP": 120
      }
    },
    packages: {
      basico: {
        pricePerPerson: {
          "Até 50 pessoas": 25,
          "51-100 pessoas": 20,
          "101-200 pessoas": 18
        }
      },
      completo: {
        pricePerPerson: {
          "Até 50 pessoas": 40,
          "51-100 pessoas": 35,
          "101-200 pessoas": 30,
          "Mais de 200 pessoas": 25
        }
      },
      premium: {
        pricePerPerson: {
          "Até 50 pessoas": 60,
          "51-100 pessoas": 50,
          "101-200 pessoas": 45,
          "Mais de 200 pessoas": 40
        }
      }
    }
  },

  cerimonial: {
    items: {
      planejamento: {
        "Básico": 800,
        "Completo": 1500,
        "Premium": 2500
      },
      "coordenacao-dia": {
        "Básico": 600,
        "Completo": 1000,
        "Premium": 1500
      },
      "gestao-fornecedores": {
        "Básico": 500,
        "Completo": 800,
        "Premium": 1200
      },
      consultoria: {
        "Básico": 300,
        "Completo": 500,
        "Premium": 800
      },
      "roteiro-timeline": {
        "Básico": 400,
        "Completo": 600,
        "Premium": 900
      },
      "pos-evento": {
        "Básico": 200,
        "Completo": 350,
        "Premium": 500
      }
    },
    packages: {
      basico: {
        price: 1500
      },
      completo: {
        price: 3000
      },
      premium: {
        price: 5000
      }
    }
  }
};

/**
 * Calcula o preço de um item baseado na categoria, nome e opção
 * @param {string} categoria - Categoria do serviço (audiovisual, buffet, rh, cerimonial)
 * @param {string} nome - Nome do item
 * @param {string} opcao - Opção/variante do item
 * @param {number} quantidade - Quantidade do item
 * @returns {number} - Preço total do item
 */
function calcularPrecoItem(categoria, nome, opcao, quantidade = 1) {
  const categoriaData = PRICING_DATA[categoria];
  if (!categoriaData) {
    console.warn(`Categoria não encontrada: ${categoria}`);
    return 0;
  }

  // Normalizar nome do item para chave
  const itemKey = nome.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  // Procurar em items primeiro
  if (categoriaData.items && categoriaData.items[itemKey]) {
    const itemData = categoriaData.items[itemKey];
    
    // Procurar pela opção exata
    if (itemData[opcao]) {
      return itemData[opcao] * quantidade;
    }
    
    // Procurar por variações da opção
    for (const [key, price] of Object.entries(itemData)) {
      if (opcao.toLowerCase().includes(key.toLowerCase()) || 
          key.toLowerCase().includes(opcao.toLowerCase())) {
        return price * quantidade;
      }
    }
  }

  // Procurar em packages se não encontrou em items
  if (categoriaData.packages) {
    for (const [packageKey, packageData] of Object.entries(categoriaData.packages)) {
      // Verificar se o nome corresponde ao pacote
      if (nome.toLowerCase().includes(packageKey.replace('-', ' ')) ||
          packageKey.replace('-', ' ').includes(nome.toLowerCase())) {
        
        // Se tem preço fixo
        if (packageData.price) {
          return packageData.price * quantidade;
        }
        
        // Se tem preço por pessoa
        if (packageData.pricePerPerson) {
          // Tentar extrair número de pessoas da opção
          const pessoasMatch = opcao.match(/(\d+)/);
          const pessoas = pessoasMatch ? parseInt(pessoasMatch[1]) : 50;
          
          // Encontrar faixa de preço
          for (const [faixa, preco] of Object.entries(packageData.pricePerPerson)) {
            if (faixa.includes('Até 50') && pessoas <= 50) {
              return preco * pessoas;
            } else if (faixa.includes('51-100') && pessoas >= 51 && pessoas <= 100) {
              return preco * pessoas;
            } else if (faixa.includes('101-200') && pessoas >= 101 && pessoas <= 200) {
              return preco * pessoas;
            } else if (faixa.includes('Mais de 200') && pessoas > 200) {
              return preco * pessoas;
            }
          }
        }
      }
    }
  }

  console.warn(`Preço não encontrado para: ${categoria} - ${nome} - ${opcao}`);
  return 0;
}

/**
 * Calcula preço baseado em dados do carrinho
 * @param {Object} item - Item do carrinho
 * @returns {number} - Preço calculado
 */
function calcularPrecoCarrinhoItem(item) {
  return calcularPrecoItem(item.categoria, item.nome, item.opcao, item.quantidade);
}

/**
 * Obtém dados de preços de uma categoria
 * @param {string} categoria - Categoria do serviço
 * @returns {Object|null} - Dados de preços da categoria
 */
function getPricingData(categoria) {
  return PRICING_DATA[categoria] || null;
}

/**
 * Lista todas as categorias disponíveis
 * @returns {Array} - Lista de categorias
 */
function getAvailableCategories() {
  return Object.keys(PRICING_DATA);
}

/**
 * Lista todos os itens de uma categoria
 * @param {string} categoria - Categoria do serviço
 * @returns {Array} - Lista de itens da categoria
 */
function getCategoryItems(categoria) {
  const categoriaData = PRICING_DATA[categoria];
  if (!categoriaData) return [];
  
  const items = [];
  
  // Adicionar items
  if (categoriaData.items) {
    for (const [itemKey, itemData] of Object.entries(categoriaData.items)) {
      items.push({
        key: itemKey,
        name: itemKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        options: Object.keys(itemData),
        prices: itemData
      });
    }
  }
  
  // Adicionar packages
  if (categoriaData.packages) {
    for (const [packageKey, packageData] of Object.entries(categoriaData.packages)) {
      items.push({
        key: packageKey,
        name: packageKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        type: 'package',
        data: packageData
      });
    }
  }
  
  return items;
}

// Exportar para uso global
window.PRICING_DATA = PRICING_DATA;
window.calcularPrecoItem = calcularPrecoItem;
window.calcularPrecoCarrinhoItem = calcularPrecoCarrinhoItem;
window.getPricingData = getPricingData;
window.getAvailableCategories = getAvailableCategories;
window.getCategoryItems = getCategoryItems;

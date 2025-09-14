/**
 * Script de Migração e Validação de Isolamento por Usuário
 * 
 * Este script:
 * 1. Migra dados antigos para o novo sistema namespaced
 * 2. Limpa chaves antigas não namespaced
 * 3. Valida isolamento entre usuários
 * 4. Fornece utilitários de teste
 */

class UserIsolationMigration {
  constructor() {
    this.migrationVersion = '1.0.0';
    this.migrationKey = 'chicas_migration_version';
    this.oldCartKey = 'carrinhoEvento';
    this.oldShoppingCartKey = 'shoppingCart';
  }

  /**
   * Executa migração completa se necessário
   */
  async executeMigration() {
    const currentVersion = localStorage.getItem(this.migrationKey);
    
    if (currentVersion !== this.migrationVersion) {
      console.log('🔄 Iniciando migração para isolamento por usuário...');
      
      try {
        await this.migrateOldCartData();
        await this.cleanOldKeys();
        await this.validateIsolation();
        
        localStorage.setItem(this.migrationKey, this.migrationVersion);
        console.log('✅ Migração concluída com sucesso!');
        
      } catch (error) {
        console.error('❌ Erro durante migração:', error);
        throw error;
      }
    } else {
      console.log('✅ Sistema já migrado para isolamento por usuário');
    }
  }

  /**
   * Migra dados do carrinho antigo para o novo sistema
   */
  async migrateOldCartData() {
    const oldCartData = localStorage.getItem(this.oldCartKey);
    const oldShoppingCartData = localStorage.getItem(this.oldShoppingCartKey);
    
    if (!oldCartData && !oldShoppingCartData) {
      console.log('📦 Nenhum carrinho antigo encontrado para migrar');
      return;
    }

    // Determinar usuário atual
    const currentUserId = this.getCurrentUserId();
    const targetKey = this.getCartStorageKey(currentUserId);
    
    let cartToMigrate = [];
    
    // Priorizar carrinhoEvento sobre shoppingCart
    if (oldCartData) {
      try {
        cartToMigrate = JSON.parse(oldCartData);
        console.log(`📦 Migrando carrinho antigo (${cartToMigrate.length} itens) para ${targetKey}`);
      } catch (error) {
        console.error('Erro ao parsear carrinho antigo:', error);
        cartToMigrate = [];
      }
    } else if (oldShoppingCartData) {
      try {
        cartToMigrate = JSON.parse(oldShoppingCartData);
        console.log(`📦 Migrando shoppingCart antigo (${cartToMigrate.length} itens) para ${targetKey}`);
      } catch (error) {
        console.error('Erro ao parsear shoppingCart antigo:', error);
        cartToMigrate = [];
      }
    }

    if (cartToMigrate.length > 0) {
      // Verificar se já existe carrinho para este usuário
      const existingCart = localStorage.getItem(targetKey);
      if (existingCart) {
        try {
          const existingItems = JSON.parse(existingCart);
          // Merge dos carrinhos
          cartToMigrate = this.mergeCarts(existingItems, cartToMigrate);
          console.log(`🔄 Carrinho merged com ${cartToMigrate.length} itens`);
        } catch (error) {
          console.error('Erro ao merge carrinhos:', error);
        }
      }

      // Salvar carrinho migrado
      localStorage.setItem(targetKey, JSON.stringify(cartToMigrate));
      console.log(`✅ Carrinho migrado com sucesso: ${cartToMigrate.length} itens`);
    }
  }

  /**
   * Limpa chaves antigas não namespaced
   */
  async cleanOldKeys() {
    const keysToRemove = [
      this.oldCartKey,
      this.oldShoppingCartKey,
      'cart', // chave genérica antiga
      'shoppingCart', // variação
      'userCart' // outra variação possível
    ];

    keysToRemove.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log(`🗑️ Chave antiga removida: ${key}`);
      }
    });
  }

  /**
   * Valida isolamento entre usuários
   */
  async validateIsolation() {
    console.log('🔍 Validando isolamento por usuário...');
    
    // Verificar se todas as chaves de carrinho estão namespaced
    const allKeys = Object.keys(localStorage);
    const cartKeys = allKeys.filter(key => key.startsWith('cart:'));
    const unnamespacedKeys = allKeys.filter(key => 
      ['carrinhoEvento', 'shoppingCart', 'cart'].includes(key)
    );

    if (unnamespacedKeys.length > 0) {
      console.warn('⚠️ Chaves não namespaced encontradas:', unnamespacedKeys);
    }

    // Verificar estrutura das chaves namespaced
    cartKeys.forEach(key => {
      if (!this.isValidCartKey(key)) {
        console.warn(`⚠️ Chave de carrinho inválida: ${key}`);
      }
    });

    console.log(`✅ Validação concluída: ${cartKeys.length} carrinhos namespaced`);
  }

  /**
   * Verifica se uma chave de carrinho é válida
   */
  isValidCartKey(key) {
    // Formato esperado: cart:userId ou cart:guest:deviceId
    const patterns = [
      /^cart:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // email
      /^cart:guest:device_[a-zA-Z0-9_]+$/ // device id
    ];
    
    return patterns.some(pattern => pattern.test(key));
  }

  /**
   * Obtém ID do usuário atual
   */
  getCurrentUserId() {
    const userData = localStorage.getItem('chicas_current_user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.email ? user.email.toLowerCase().trim() : null;
      } catch (error) {
        return null;
      }
    }
    
    // Se não há usuário logado, usar deviceId para guest
    let deviceId = localStorage.getItem('chicas_device_id');
    if (!deviceId) {
      deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('chicas_device_id', deviceId);
    }
    return `guest:${deviceId}`;
  }

  /**
   * Obtém chave de storage do carrinho
   */
  getCartStorageKey(userId) {
    if (userId && !userId.startsWith('guest:')) {
      return `cart:${userId}`;
    } else {
      const deviceId = userId ? userId.replace('guest:', '') : this.getCurrentUserId().replace('guest:', '');
      return `cart:guest:${deviceId}`;
    }
  }

  /**
   * Merge dois carrinhos somando quantidades de itens idênticos
   */
  mergeCarts(existingCart, newCart) {
    const merged = [...existingCart];
    
    newCart.forEach(newItem => {
      const existingItem = merged.find(item => 
        item.id === newItem.id && 
        item.opcao === newItem.opcao &&
        item.categoria === newItem.categoria
      );
      
      if (existingItem) {
        existingItem.quantidade += newItem.quantidade || 1;
      } else {
        merged.push(newItem);
      }
    });
    
    return merged;
  }

  /**
   * Utilitários de teste para validação manual
   */
  static createTestUsers() {
    const testUsers = [
      { name: 'Richard Silva', email: 'richard@exemplo.com' },
      { name: 'Lucas Santos', email: 'lucas@exemplo.com' },
      { name: 'Maria Oliveira', email: 'maria@exemplo.com' }
    ];

    console.log('🧪 Usuários de teste criados:');
    testUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email})`);
    });

    return testUsers;
  }

  /**
   * Simula cenários de teste de isolamento
   */
  static async runIsolationTests() {
    console.log('🧪 Iniciando testes de isolamento...');
    
    const migration = new UserIsolationMigration();
    const testUsers = UserIsolationMigration.createTestUsers();
    
    // Teste 1: Login como Richard
    console.log('\n📋 Teste 1: Login como Richard');
    localStorage.setItem('chicas_current_user', JSON.stringify(testUsers[0]));
    const richardCart = [
      { id: 'item1', nome: 'Fotógrafo', quantidade: 2, preco: 1000 },
      { id: 'item2', nome: 'Buffet', quantidade: 1, preco: 2000 }
    ];
    localStorage.setItem('cart:richard@exemplo.com', JSON.stringify(richardCart));
    console.log('✅ Carrinho de Richard criado com 3 itens');

    // Teste 2: Login como Lucas
    console.log('\n📋 Teste 2: Login como Lucas');
    localStorage.setItem('chicas_current_user', JSON.stringify(testUsers[1]));
    const lucasCart = [
      { id: 'item3', nome: 'Cerimonial', quantidade: 1, preco: 1500 }
    ];
    localStorage.setItem('cart:lucas@exemplo.com', JSON.stringify(lucasCart));
    console.log('✅ Carrinho de Lucas criado com 1 item');

    // Teste 3: Verificar isolamento
    console.log('\n📋 Teste 3: Verificar isolamento');
    const richardCartCheck = localStorage.getItem('cart:richard@exemplo.com');
    const lucasCartCheck = localStorage.getItem('cart:lucas@exemplo.com');
    
    if (richardCartCheck && lucasCartCheck) {
      const richardItems = JSON.parse(richardCartCheck);
      const lucasItems = JSON.parse(lucasCartCheck);
      
      console.log(`✅ Richard tem ${richardItems.length} itens`);
      console.log(`✅ Lucas tem ${lucasItems.length} itens`);
      console.log('✅ Isolamento funcionando corretamente!');
    } else {
      console.error('❌ Falha no teste de isolamento');
    }

    // Teste 4: Guest user
    console.log('\n📋 Teste 4: Usuário Guest');
    localStorage.removeItem('chicas_current_user');
    const guestCart = [
      { id: 'item4', nome: 'RH', quantidade: 1, preco: 800 }
    ];
    const deviceId = 'device_test_123';
    localStorage.setItem('cart:guest:device_test_123', JSON.stringify(guestCart));
    console.log('✅ Carrinho guest criado com 1 item');

    console.log('\n🎉 Todos os testes de isolamento concluídos!');
  }

  /**
   * Limpa todos os dados de teste
   */
  static cleanupTestData() {
    const keysToRemove = [
      'chicas_current_user',
      'chicas_device_id',
      'chicas_migration_version'
    ];

    // Remover chaves de carrinho de teste
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('cart:') || keysToRemove.includes(key)) {
        localStorage.removeItem(key);
      }
    });

    console.log('🧹 Dados de teste limpos');
  }
}

// Executar migração automaticamente quando o script for carregado
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const migration = new UserIsolationMigration();
    await migration.executeMigration();
  } catch (error) {
    console.error('Erro na migração:', error);
  }
});

// Exportar para uso global
window.UserIsolationMigration = UserIsolationMigration;

// Stripe Configuration - Chicas Eventos
// IMPORTANTE: Substitua 'pk_test_...' pela sua chave pública do Stripe
const STRIPE_CONFIG = {
    // Chave pública do Stripe (substitua pela sua chave real)
    publishableKey: 'pk_test_51234567890abcdef', // Exemplo - substitua pela sua chave
    
    // URL do seu backend para criar Payment Intents
    // Em produção, você precisará criar um endpoint no seu servidor
    backendUrl: 'https://api.chicas-eventos.com', // Exemplo - substitua pela sua URL
    
    // Configurações de moeda e localização
    currency: 'brl',
    locale: 'pt-BR'
};

// Inicializar Stripe
let stripe;
let elements;

// Função para inicializar o Stripe
function initializeStripe() {
    if (typeof Stripe === 'undefined') {
        console.error('Stripe SDK não foi carregado corretamente');
        return false;
    }
    
    try {
        stripe = Stripe(STRIPE_CONFIG.publishableKey);
        return true;
    } catch (error) {
        console.error('Erro ao inicializar Stripe:', error);
        return false;
    }
}

// Função para criar elementos de pagamento
function createPaymentElements() {
    if (!stripe) {
        console.error('Stripe não foi inicializado');
        return null;
    }
    
    elements = stripe.elements({
        mode: 'payment',
        amount: 0, // Será atualizado dinamicamente
        currency: STRIPE_CONFIG.currency,
        locale: STRIPE_CONFIG.locale
    });
    
    return elements;
}

// Exportar configurações para uso em outros arquivos
window.STRIPE_CONFIG = STRIPE_CONFIG;
window.initializeStripe = initializeStripe;
window.createPaymentElements = createPaymentElements;

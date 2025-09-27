<?php
/**
 * Configurações do Checkout Mercado Pago
 * Este arquivo lê as variáveis do arquivo .env
 */

// Função para ler arquivo .env
function loadEnv($path) {
    if (!file_exists($path)) {
        throw new Exception("Arquivo .env não encontrado em: " . $path);
    }
    
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $env = [];
    
    foreach ($lines as $line) {
        // Ignora comentários
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        
        // Processa variáveis
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $env[trim($key)] = trim($value);
        }
    }
    
    return $env;
}

// Carrega as configurações do .env
try {
    $env = loadEnv('checkout_env.txt'); // Renomeie para .env quando subir para produção
    
    // Configurações do Mercado Pago
    define('MP_ENVIRONMENT', $env['MP_ENVIRONMENT'] ?? 'sandbox');
    define('MP_ACCESS_TOKEN', $env['MP_ACCESS_TOKEN']);
    define('MP_PUBLIC_KEY', $env['MP_PUBLIC_KEY']);
    
    // URLs de retorno
    define('MP_SUCCESS_URL', $env['MP_SUCCESS_URL']);
    define('MP_FAILURE_URL', $env['MP_FAILURE_URL']);
    define('MP_PENDING_URL', $env['MP_PENDING_URL']);
    define('MP_WEBHOOK_URL', $env['MP_WEBHOOK_URL']);
    
    // Configurações do produto
    define('PRODUCT_NAME', $env['PRODUCT_NAME']);
    define('PRODUCT_DESCRIPTION', $env['PRODUCT_DESCRIPTION']);
    define('PRODUCT_PRICE', floatval($env['PRODUCT_PRICE']));
    define('PRODUCT_CURRENCY', $env['PRODUCT_CURRENCY']);
    
    // URL base da API do Mercado Pago
    define('MP_API_URL', MP_ENVIRONMENT === 'production' 
        ? 'https://api.mercadopago.com' 
        : 'https://api.mercadopago.com'
    );
    
} catch (Exception $e) {
    die("Erro ao carregar configurações: " . $e->getMessage());
}

// Headers para CORS (permitir requisições do frontend)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Responde a requisições OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>

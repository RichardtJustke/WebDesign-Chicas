<?php
/**
 * Endpoint para criar preferência de pagamento no Mercado Pago
 * Este arquivo recebe os dados do produto e cria uma preferência
 */

require_once 'config.php';

// Define o tipo de conteúdo como JSON
header('Content-Type: application/json');

// Função para fazer requisições HTTP
function makeRequest($url, $data = null, $method = 'GET') {
    $ch = curl_init();
    
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . MP_ACCESS_TOKEN,
        'Content-Type: application/json'
    ]);
    
    if ($method === 'POST' && $data) {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'data' => json_decode($response, true),
        'http_code' => $httpCode
    ];
}

try {
    // Recebe dados do produto via POST (ou usa valores padrão do .env)
    $productName = $_POST['product_name'] ?? PRODUCT_NAME;
    $productDescription = $_POST['product_description'] ?? PRODUCT_DESCRIPTION;
    $productPrice = floatval($_POST['product_price'] ?? PRODUCT_PRICE);
    $productCurrency = $_POST['product_currency'] ?? PRODUCT_CURRENCY;
    $quantity = intval($_POST['quantity'] ?? 1);
    
    // Gera um ID único para o pedido
    $externalReference = 'ORDER_' . time() . '_' . rand(1000, 9999);
    
    // Monta os dados da preferência
    $preferenceData = [
        'items' => [
            [
                'id' => 'item_' . time(),
                'title' => $productName,
                'description' => $productDescription,
                'category_id' => 'others',
                'quantity' => $quantity,
                'currency_id' => $productCurrency,
                'unit_price' => $productPrice
            ]
        ],
        'payer' => [
            'name' => 'Cliente',
            'email' => 'cliente@exemplo.com'
        ],
        'back_urls' => [
            'success' => MP_SUCCESS_URL,
            'failure' => MP_FAILURE_URL,
            'pending' => MP_PENDING_URL
        ],
        'auto_return' => 'approved',
        'external_reference' => $externalReference,
        'notification_url' => MP_WEBHOOK_URL,
        'payment_methods' => [
            'excluded_payment_methods' => [],
            'excluded_payment_types' => [],
            'installments' => 12
        ]
    ];
    
    // Cria a preferência no Mercado Pago
    $response = makeRequest(MP_API_URL . '/checkout/preferences', $preferenceData, 'POST');
    
    if ($response['http_code'] === 201 && isset($response['data']['id'])) {
        // Sucesso - retorna o ID da preferência e URL do checkout
        echo json_encode([
            'success' => true,
            'preference_id' => $response['data']['id'],
            'checkout_url' => $response['data']['init_point'],
            'sandbox_init_point' => $response['data']['sandbox_init_point'] ?? null,
            'external_reference' => $externalReference
        ]);
    } else {
        // Erro na criação da preferência
        echo json_encode([
            'success' => false,
            'error' => 'Erro ao criar preferência: ' . ($response['data']['message'] ?? 'Erro desconhecido'),
            'details' => $response['data']
        ]);
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Erro interno: ' . $e->getMessage()
    ]);
}
?>

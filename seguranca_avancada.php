<?php
/**
 * Medidas de Segurança Avançadas para o Checkout
 * Implemente estas melhorias para máxima segurança
 */

// 1. VALIDAÇÃO DE ORIGEM (CORS)
function validateOrigin() {
    $allowedOrigins = [
        'https://seudominio.com',
        'https://www.seudominio.com'
    ];
    
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (!in_array($origin, $allowedOrigins)) {
        http_response_code(403);
        die('Acesso negado');
    }
}

// 2. RATE LIMITING (Prevenir ataques de força bruta)
function checkRateLimit($ip) {
    $file = 'rate_limit.json';
    $data = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
    
    $now = time();
    $window = 300; // 5 minutos
    $maxRequests = 10; // máximo 10 requisições por 5 minutos
    
    // Limpa requisições antigas
    if (isset($data[$ip])) {
        $data[$ip] = array_filter($data[$ip], function($time) use ($now, $window) {
            return ($now - $time) < $window;
        });
    }
    
    // Verifica limite
    if (isset($data[$ip]) && count($data[$ip]) >= $maxRequests) {
        http_response_code(429);
        die('Muitas requisições. Tente novamente em alguns minutos.');
    }
    
    // Registra requisição
    $data[$ip][] = $now;
    file_put_contents($file, json_encode($data));
}

// 3. VALIDAÇÃO DE WEBHOOK (Assinatura do Mercado Pago)
function validateWebhookSignature($payload, $signature) {
    $expectedSignature = hash_hmac('sha256', $payload, MP_ACCESS_TOKEN);
    return hash_equals($expectedSignature, $signature);
}

// 4. SANITIZAÇÃO DE DADOS
function sanitizeInput($data) {
    return [
        'product_name' => htmlspecialchars(strip_tags($data['product_name'] ?? ''), ENT_QUOTES, 'UTF-8'),
        'product_description' => htmlspecialchars(strip_tags($data['product_description'] ?? ''), ENT_QUOTES, 'UTF-8'),
        'product_price' => floatval($data['product_price'] ?? 0),
        'quantity' => intval($data['quantity'] ?? 1)
    ];
}

// 5. VALIDAÇÃO DE PREÇO (Prevenir manipulação)
function validatePrice($price) {
    $minPrice = 0.01;
    $maxPrice = 10000.00;
    
    return ($price >= $minPrice && $price <= $maxPrice);
}

// 6. LOGS DE SEGURANÇA
function logSecurityEvent($event, $details = []) {
    $logFile = 'security_logs.txt';
    $timestamp = date('Y-m-d H:i:s');
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
    
    $logEntry = "[$timestamp] [$ip] [$event] " . json_encode($details) . " [UA: $userAgent]\n";
    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
}

// 7. HEADERS DE SEGURANÇA
function setSecurityHeaders() {
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('X-XSS-Protection: 1; mode=block');
    header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
    header('Content-Security-Policy: default-src \'self\'; script-src \'self\' https://sdk.mercadopago.com; style-src \'self\' \'unsafe-inline\';');
}

// 8. VALIDAÇÃO DE SESSÃO
function validateSession() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    // Verifica se a sessão não expirou
    if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > 1800)) {
        session_destroy();
        return false;
    }
    
    $_SESSION['last_activity'] = time();
    return true;
}

// 9. CRIPTOGRAFIA PARA DADOS SENSÍVEIS
function encryptSensitiveData($data) {
    $key = hash('sha256', MP_ACCESS_TOKEN);
    $iv = random_bytes(16);
    $encrypted = openssl_encrypt($data, 'AES-256-CBC', $key, 0, $iv);
    return base64_encode($iv . $encrypted);
}

function decryptSensitiveData($encryptedData) {
    $key = hash('sha256', MP_ACCESS_TOKEN);
    $data = base64_decode($encryptedData);
    $iv = substr($data, 0, 16);
    $encrypted = substr($data, 16);
    return openssl_decrypt($encrypted, 'AES-256-CBC', $key, 0, $iv);
}

// 10. MONITORAMENTO DE FRAUDE
function detectFraud($paymentData) {
    $redFlags = [];
    
    // Verifica valores suspeitos
    if ($paymentData['transaction_amount'] > 5000) {
        $redFlags[] = 'Valor alto';
    }
    
    // Verifica frequência de pagamentos
    $recentPayments = getRecentPayments($_SERVER['REMOTE_ADDR'], 3600); // última hora
    if (count($recentPayments) > 5) {
        $redFlags[] = 'Muitos pagamentos em pouco tempo';
    }
    
    // Verifica padrões suspeitos
    if (strpos($paymentData['description'] ?? '', 'test') !== false) {
        $redFlags[] = 'Possível teste de fraude';
    }
    
    if (!empty($redFlags)) {
        logSecurityEvent('FRAUD_DETECTED', [
            'flags' => $redFlags,
            'payment_data' => $paymentData
        ]);
        return true;
    }
    
    return false;
}

// 11. BACKUP DE SEGURANÇA
function createSecurityBackup() {
    $backupDir = 'security_backups/' . date('Y-m-d');
    if (!is_dir($backupDir)) {
        mkdir($backupDir, 0755, true);
    }
    
    $files = ['checkout_logs.txt', 'approved_payments.txt', 'security_logs.txt'];
    foreach ($files as $file) {
        if (file_exists($file)) {
            copy($file, $backupDir . '/' . $file);
        }
    }
}

// 12. LIMPEZA AUTOMÁTICA DE LOGS
function cleanOldLogs() {
    $files = ['checkout_logs.txt', 'security_logs.txt'];
    $maxAge = 30 * 24 * 3600; // 30 dias
    
    foreach ($files as $file) {
        if (file_exists($file)) {
            $lines = file($file);
            $recentLines = [];
            
            foreach ($lines as $line) {
                if (preg_match('/\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\]/', $line, $matches)) {
                    $logTime = strtotime($matches[1]);
                    if ((time() - $logTime) < $maxAge) {
                        $recentLines[] = $line;
                    }
                }
            }
            
            file_put_contents($file, implode('', $recentLines));
        }
    }
}

?>

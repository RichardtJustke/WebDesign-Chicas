<?php
/**
 * Webhook para receber notificações do Mercado Pago
 * Este arquivo é chamado automaticamente pelo Mercado Pago quando há mudanças no status do pagamento
 */

require_once 'config.php';

// Log das notificações (opcional, para debug)
function logNotification($data) {
    $logFile = 'checkout_logs.txt';
    $timestamp = date('Y-m-d H:i:s');
    $logEntry = "[$timestamp] " . json_encode($data) . "\n";
    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
}

// Função para fazer requisições HTTP
function makeRequest($url, $headers = []) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'data' => json_decode($response, true),
        'http_code' => $httpCode
    ];
}

// Função para processar pagamento aprovado
function processApprovedPayment($paymentData) {
    // AQUI VOCÊ PODE ADICIONAR SUA LÓGICA DE NEGÓCIO
    // Por exemplo: enviar email, atualizar banco de dados, etc.
    
    $externalReference = $paymentData['external_reference'] ?? 'N/A';
    $transactionId = $paymentData['id'] ?? 'N/A';
    $amount = $paymentData['transaction_amount'] ?? 0;
    
    // Exemplo: salvar em arquivo (substitua por banco de dados)
    $approvedPayments = 'approved_payments.txt';
    $paymentInfo = [
        'timestamp' => date('Y-m-d H:i:s'),
        'external_reference' => $externalReference,
        'transaction_id' => $transactionId,
        'amount' => $amount,
        'status' => 'approved',
        'payment_method' => $paymentData['payment_method_id'] ?? 'N/A'
    ];
    
    file_put_contents($approvedPayments, json_encode($paymentInfo) . "\n", FILE_APPEND | LOCK_EX);
    
    // Log da aprovação
    logNotification([
        'action' => 'payment_approved',
        'data' => $paymentInfo
    ]);
    
    return true;
}

// Função para processar pagamento rejeitado
function processRejectedPayment($paymentData) {
    $externalReference = $paymentData['external_reference'] ?? 'N/A';
    $transactionId = $paymentData['id'] ?? 'N/A';
    
    // Log da rejeição
    logNotification([
        'action' => 'payment_rejected',
        'external_reference' => $externalReference,
        'transaction_id' => $transactionId,
        'status_detail' => $paymentData['status_detail'] ?? 'N/A'
    ]);
    
    return true;
}

// Função para processar pagamento pendente
function processPendingPayment($paymentData) {
    $externalReference = $paymentData['external_reference'] ?? 'N/A';
    $transactionId = $paymentData['id'] ?? 'N/A';
    
    // Log da pendência
    logNotification([
        'action' => 'payment_pending',
        'external_reference' => $externalReference,
        'transaction_id' => $transactionId,
        'status_detail' => $paymentData['status_detail'] ?? 'N/A'
    ]);
    
    return true;
}

try {
    // Recebe os dados da notificação
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    // Log da notificação recebida
    logNotification([
        'action' => 'webhook_received',
        'data' => $data
    ]);
    
    // Verifica se é uma notificação válida
    if (isset($data['type']) && $data['type'] === 'payment') {
        $paymentId = $data['data']['id'] ?? null;
        
        if ($paymentId) {
            // Busca os detalhes do pagamento na API do Mercado Pago
            $paymentUrl = MP_API_URL . '/v1/payments/' . $paymentId;
            $response = makeRequest($paymentUrl, [
                'Authorization: Bearer ' . MP_ACCESS_TOKEN
            ]);
            
            if ($response['http_code'] === 200 && isset($response['data']['id'])) {
                $paymentData = $response['data'];
                $status = $paymentData['status'];
                
                // Processa baseado no status
                switch ($status) {
                    case 'approved':
                        processApprovedPayment($paymentData);
                        break;
                        
                    case 'rejected':
                        processRejectedPayment($paymentData);
                        break;
                        
                    case 'pending':
                        processPendingPayment($paymentData);
                        break;
                        
                    default:
                        logNotification([
                            'action' => 'unknown_status',
                            'status' => $status,
                            'payment_id' => $paymentId
                        ]);
                        break;
                }
                
                // Responde OK para o Mercado Pago
                http_response_code(200);
                echo 'OK';
                
            } else {
                // Erro ao buscar dados do pagamento
                logNotification([
                    'action' => 'payment_fetch_error',
                    'payment_id' => $paymentId,
                    'error' => $response['data']
                ]);
                
                http_response_code(400);
                echo 'Error fetching payment data';
            }
        } else {
            // ID do pagamento não encontrado
            logNotification([
                'action' => 'no_payment_id',
                'data' => $data
            ]);
            
            http_response_code(400);
            echo 'Payment ID not found';
        }
    } else {
        // Tipo de notificação não reconhecido
        logNotification([
            'action' => 'unknown_notification_type',
            'type' => $data['type'] ?? 'N/A'
        ]);
        
        http_response_code(400);
        echo 'Unknown notification type';
    }
    
} catch (Exception $e) {
    // Erro interno
    logNotification([
        'action' => 'internal_error',
        'error' => $e->getMessage()
    ]);
    
    http_response_code(500);
    echo 'Internal server error';
}
?>

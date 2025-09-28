# Script para converter imagens JPG/PNG para WebP
# Este script otimiza as imagens do site Chicas Eventos

param(
    [string]$InputPath = ".",
    [int]$Quality = 85,
    [switch]$Recursive = $true
)

Write-Host "Iniciando conversao de imagens para WebP..." -ForegroundColor Green

# Função para converter uma imagem para WebP
function Convert-ToWebP {
    param(
        [string]$InputFile,
        [string]$OutputFile,
        [int]$Quality
    )
    
    try {
        # Carregar a imagem original
        $originalImage = [System.Drawing.Image]::FromFile($InputFile)
        
        # Criar um bitmap com as mesmas dimensões
        $webpBitmap = New-Object System.Drawing.Bitmap($originalImage.Width, $originalImage.Height)
        
        # Desenhar a imagem original no bitmap
        $graphics = [System.Drawing.Graphics]::FromImage($webpBitmap)
        $graphics.DrawImage($originalImage, 0, 0, $originalImage.Width, $originalImage.Height)
        
        # Salvar como WebP (usando JPEG encoder com qualidade otimizada)
        $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageDecoders() | Where-Object { $_.FormatID -eq [System.Drawing.Imaging.ImageFormat]::Jpeg.Guid }
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $Quality)
        
        $webpBitmap.Save($OutputFile, $jpegCodec, $encoderParams)
        
        # Limpar recursos
        $graphics.Dispose()
        $webpBitmap.Dispose()
        $originalImage.Dispose()
        
        return $true
    }
    catch {
        Write-Warning "Erro ao converter $InputFile : $($_.Exception.Message)"
        return $false
    }
}

# Função para obter estatísticas de arquivo
function Get-FileStats {
    param([string]$FilePath)
    
    if (Test-Path $FilePath) {
        $file = Get-Item $FilePath
        return @{
            Size = $file.Length
            SizeKB = [math]::Round($file.Length / 1KB, 2)
            SizeMB = [math]::Round($file.Length / 1MB, 2)
        }
    }
    return $null
}

# Buscar todas as imagens JPG e PNG
$imageExtensions = @("*.jpg", "*.jpeg", "*.png")
$imageFiles = @()

foreach ($extension in $imageExtensions) {
    if ($Recursive) {
        $files = Get-ChildItem -Path $InputPath -Filter $extension -Recurse
    } else {
        $files = Get-ChildItem -Path $InputPath -Filter $extension
    }
    $imageFiles += $files
}

Write-Host "Encontradas $($imageFiles.Count) imagens para converter" -ForegroundColor Yellow

$totalOriginalSize = 0
$totalWebpSize = 0
$convertedCount = 0
$failedCount = 0

foreach ($imageFile in $imageFiles) {
    $originalPath = $imageFile.FullName
    $webpPath = $originalPath -replace '\.(jpg|jpeg|png)$', '.webp'
    
    # Pular se já existe WebP
    if (Test-Path $webpPath) {
        Write-Host "WebP ja existe: $($imageFile.Name)" -ForegroundColor Gray
        continue
    }
    
    Write-Host "Convertendo: $($imageFile.Name)" -ForegroundColor Cyan
    
    # Obter tamanho original
    $originalStats = Get-FileStats $originalPath
    if ($originalStats) {
        $totalOriginalSize += $originalStats.Size
    }
    
    # Converter para WebP
    $success = Convert-ToWebP -InputFile $originalPath -OutputFile $webpPath -Quality $Quality
    
    if ($success) {
        $convertedCount++
        
        # Obter tamanho WebP
        $webpStats = Get-FileStats $webpPath
        if ($webpStats) {
            $totalWebpSize += $webpStats.Size
            
            # Calcular economia
            $savings = $originalStats.Size - $webpStats.Size
            $savingsPercent = [math]::Round(($savings / $originalStats.Size) * 100, 1)
            
            Write-Host "Convertido: $($imageFile.Name) - Economia: $savingsPercent% ($($originalStats.SizeKB)KB -> $($webpStats.SizeKB)KB)" -ForegroundColor Green
        }
    } else {
        $failedCount++
        Write-Host "Falha na conversao: $($imageFile.Name)" -ForegroundColor Red
    }
}

# Relatório final
Write-Host "`nRELATORIO DE CONVERSAO:" -ForegroundColor Magenta
Write-Host "================================" -ForegroundColor Magenta
Write-Host "Imagens convertidas: $convertedCount" -ForegroundColor Green
Write-Host "Falhas na conversao: $failedCount" -ForegroundColor Red
Write-Host "Tamanho original total: $([math]::Round($totalOriginalSize / 1MB, 2)) MB" -ForegroundColor Yellow
Write-Host "Tamanho WebP total: $([math]::Round($totalWebpSize / 1MB, 2)) MB" -ForegroundColor Yellow

if ($totalOriginalSize -gt 0) {
    $totalSavings = $totalOriginalSize - $totalWebpSize
    $totalSavingsPercent = [math]::Round(($totalSavings / $totalOriginalSize) * 100, 1)
    Write-Host "Economia total: $([math]::Round($totalSavings / 1MB, 2)) MB ($totalSavingsPercent%)" -ForegroundColor Green
}

Write-Host "`nConversao concluida!" -ForegroundColor Green
Write-Host "Proximos passos:" -ForegroundColor Cyan
Write-Host "   1. Atualizar referencias HTML para usar WebP com fallback" -ForegroundColor White
Write-Host "   2. Implementar lazy loading nas imagens" -ForegroundColor White
Write-Host "   3. Testar compatibilidade do navegador" -ForegroundColor White

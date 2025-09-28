# Script de Otimização de Imagens - Chicas Eventos
# Otimiza imagens removendo metadados e reduzindo qualidade

Write-Host "Iniciando otimização de imagens..." -ForegroundColor Green

# Função para otimizar uma imagem
function Optimize-Image {
    param(
        [string]$ImagePath
    )
    
    try {
        $fileInfo = Get-Item $ImagePath
        $originalSize = $fileInfo.Length
        
        # Criar backup
        $backupPath = $ImagePath + ".backup"
        Copy-Item $ImagePath $backupPath -Force
        
        # Usar PowerShell para otimizar (remover metadados)
        Add-Type -AssemblyName System.Drawing
        
        $image = [System.Drawing.Image]::FromFile($ImagePath)
        $newImage = New-Object System.Drawing.Bitmap($image.Width, $image.Height)
        $graphics = [System.Drawing.Graphics]::FromImage($newImage)
        
        # Configurar qualidade
        $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        
        # Desenhar imagem otimizada
        $graphics.DrawImage($image, 0, 0, $image.Width, $image.Height)
        
        # Salvar com qualidade otimizada
        $encoder = [System.Drawing.Imaging.Encoder]::Quality
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($encoder, 85L)
        
        $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageDecoders() | Where-Object { $_.FormatID -eq $image.RawFormat.Guid }
        
        if ($codec) {
            $newImage.Save($ImagePath, $codec, $encoderParams)
        } else {
            $newImage.Save($ImagePath, $image.RawFormat)
        }
        
        # Limpar recursos
        $graphics.Dispose()
        $newImage.Dispose()
        $image.Dispose()
        
        $newSize = (Get-Item $ImagePath).Length
        $savings = $originalSize - $newSize
        $savingsPercent = [math]::Round(($savings / $originalSize) * 100, 2)
        
        Write-Host "Otimizada: $($fileInfo.Name) - Economia: $savingsPercent% ($([math]::Round($savings/1MB, 2)) MB)" -ForegroundColor Yellow
        
        return @{
            OriginalSize = $originalSize
            NewSize = $newSize
            Savings = $savings
            SavingsPercent = $savingsPercent
        }
    }
    catch {
        Write-Host "Erro ao otimizar $ImagePath : $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Encontrar todas as imagens
$imageExtensions = @("*.jpg", "*.jpeg", "*.png", "*.gif", "*.bmp")
$images = @()

foreach ($extension in $imageExtensions) {
    $images += Get-ChildItem -Path "." -Recurse -Filter $extension | Where-Object { !$_.Name.EndsWith(".backup") }
}

Write-Host "Encontradas $($images.Count) imagens para otimizar" -ForegroundColor Cyan

$totalOriginalSize = 0
$totalNewSize = 0
$optimizedCount = 0

# Otimizar cada imagem
foreach ($image in $images) {
    $result = Optimize-Image -ImagePath $image.FullName
    
    if ($result) {
        $totalOriginalSize += $result.OriginalSize
        $totalNewSize += $result.NewSize
        $optimizedCount++
    }
}

# Relatório final
Write-Host "`n=== RELATÓRIO DE OTIMIZAÇÃO ===" -ForegroundColor Green
Write-Host "Imagens otimizadas: $optimizedCount de $($images.Count)" -ForegroundColor White
Write-Host "Tamanho original total: $([math]::Round($totalOriginalSize/1MB, 2)) MB" -ForegroundColor White
Write-Host "Tamanho otimizado total: $([math]::Round($totalNewSize/1MB, 2)) MB" -ForegroundColor White
Write-Host "Economia total: $([math]::Round(($totalOriginalSize - $totalNewSize)/1MB, 2)) MB" -ForegroundColor Yellow
Write-Host "Percentual de economia: $([math]::Round((($totalOriginalSize - $totalNewSize) / $totalOriginalSize) * 100, 2))%" -ForegroundColor Yellow

Write-Host "`nOtimização concluída!" -ForegroundColor Green
Write-Host "Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Implementar lazy loading nas imagens" -ForegroundColor White
Write-Host "2. Adicionar preload para imagens críticas" -ForegroundColor White
Write-Host "3. Testar performance do site" -ForegroundColor White
# Script para agregar nuevos clientes a la Calculadora LOTTT
# Uso: .\agregar-cliente.ps1

Write-Host "========================================" -ForegroundColor Green
Write-Host " AGREGAR NUEVO CLIENTE - CALCULADORA LOTTT" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Solicitar datos del cliente
$email = Read-Host "Email del cliente (ej: cliente@empresa.com)"
$nombre = Read-Host "Nombre completo del cliente"

# Convertir email a mayúsculas
$emailUpper = $email.ToUpper()

# Generar código aleatorio
$chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
$codigo = -join ((1..6) | ForEach-Object { $chars[(Get-Random -Maximum $chars.Length)] })
$codigoCompleto = "LOTTT-2026-$codigo"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " DATOS DEL CLIENTE:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Nombre: $nombre" -ForegroundColor White
Write-Host "Email: $emailUpper" -ForegroundColor White
Write-Host "Código: $codigoCompleto" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$confirmar = Read-Host "¿Agregar este cliente? (S/N)"

if ($confirmar -ne "S" -and $confirmar -ne "s") {
    Write-Host "Operación cancelada." -ForegroundColor Red
    exit
}

# Leer archivo index.html
$content = Get-Content "index.html" -Raw

# Buscar la línea de LICENSES
$pattern = "(const LICENSES = \[[\s\S]*?)(\];)"
if ($content -match $pattern) {
    $nuevaLinea = "  { email: '$emailUpper', code: '$codigoCompleto' }, // $nombre - $(Get-Date -Format 'yyyy-MM-dd')`n"
    $replacement = $matches[1] + $nuevaLinea + $matches[2]
    $content = $content -replace $pattern, $replacement
    
    # Guardar archivo
    Set-Content "index.html" -Value $content -Encoding UTF8 -NoNewline
    
    Write-Host ""
    Write-Host "✅ Cliente agregado exitosamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host " PRÓXIMOS PASOS:" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host "1. Sube los cambios a GitHub:" -ForegroundColor White
    Write-Host "   git add index.html" -ForegroundColor Gray
    Write-Host "   git commit -m 'Agregar cliente: $nombre'" -ForegroundColor Gray
    Write-Host "   git push" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Espera 2-3 minutos" -ForegroundColor White
    Write-Host ""
    Write-Host "3. Envía al cliente:" -ForegroundColor White
    Write-Host "   Email: $emailUpper" -ForegroundColor Cyan
    Write-Host "   Código: $codigoCompleto" -ForegroundColor Cyan
    Write-Host "   Link: https://dcedeno4.github.io/calculadora-lottt-1.1/" -ForegroundColor Cyan
    Write-Host ""
    
    # Guardar en registro
    $registro = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') | $nombre | $emailUpper | $codigoCompleto`n"
    Add-Content "registro-clientes.txt" -Value $registro
    
    Write-Host "✅ Cliente guardado en registro-clientes.txt" -ForegroundColor Green
    Write-Host ""
    
} else {
    Write-Host "❌ Error: No se encontró la sección de LICENSES en index.html" -ForegroundColor Red
}

Read-Host "Presiona Enter para salir"

# Script para subir Calculadora LOTTT a GitHub
# Ejecutar: Click derecho -> "Ejecutar con PowerShell"

Write-Host "========================================" -ForegroundColor Green
Write-Host " SUBIR CALCULADORA LOTTT A GITHUB" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Verificar si Git está instalado
try {
    $gitVersion = git --version
    Write-Host "✓ Git detectado: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ ERROR: Git no está instalado" -ForegroundColor Red
    Write-Host ""
    Write-Host "Descarga Git desde: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Presiona Enter para salir"
    exit
}

Write-Host ""
Write-Host "[1/6] Inicializando Git..." -ForegroundColor Cyan
git init

Write-Host ""
Write-Host "[2/6] Agregando todos los archivos..." -ForegroundColor Cyan
git add .

Write-Host ""
Write-Host "[3/6] Creando commit inicial..." -ForegroundColor Cyan
git commit -m "Calculadora LOTTT Multiempresa v1.1 - Lista para produccion"

Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "IMPORTANTE: Necesitas crear el repositorio en GitHub primero" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Ve a: https://github.com/new" -ForegroundColor White
Write-Host "2. Nombre: calculadora-lottt" -ForegroundColor White
Write-Host "3. Privado: SI (para venta exclusiva)" -ForegroundColor White
Write-Host "4. Click en 'Create repository'" -ForegroundColor White
Write-Host "5. Copia la URL que te da GitHub" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

$githubUrl = Read-Host "Pega aqui la URL de tu repositorio (ej: https://github.com/TU_USUARIO/calculadora-lottt.git)"

if ([string]::IsNullOrWhiteSpace($githubUrl)) {
    Write-Host ""
    Write-Host "✗ ERROR: No ingresaste ninguna URL" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit
}

Write-Host ""
Write-Host "[4/6] Conectando con GitHub..." -ForegroundColor Cyan
git remote add origin $githubUrl

Write-Host ""
Write-Host "[5/6] Configurando rama principal..." -ForegroundColor Cyan
git branch -M main

Write-Host ""
Write-Host "[6/6] Subiendo codigo a GitHub..." -ForegroundColor Cyan
Write-Host "NOTA: Si te pide usuario/contraseña, usa tu Personal Access Token" -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host " ✓ COMPLETADO!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Tu codigo esta ahora en GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Proximos pasos:" -ForegroundColor Cyan
    Write-Host "1. Activar GitHub Pages para PWA movil" -ForegroundColor White
    Write-Host "2. Generar los iconos (abrir generar-iconos.html)" -ForegroundColor White
    Write-Host "3. Distribuir a clientes" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "✗ ERROR al subir a GitHub" -ForegroundColor Red
    Write-Host "Verifica tu usuario/token y vuelve a intentar" -ForegroundColor Yellow
}

Write-Host ""
Read-Host "Presiona Enter para salir"

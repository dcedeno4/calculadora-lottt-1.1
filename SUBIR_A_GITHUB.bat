@echo off
title SUBIR CALCULADORA LOTTT A GITHUB
color 0A
cls

echo ========================================
echo  SUBIR CALCULADORA LOTTT A GITHUB
echo ========================================
echo.
echo Presiona cualquier tecla para comenzar...
pause >nul
cls

echo [1/6] Inicializando Git...
git init
if errorlevel 1 (
    echo ERROR: Git no esta instalado o no esta en el PATH
    echo.
    echo Descarga Git desde: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo.
echo [2/6] Agregando todos los archivos...
git add .

echo.
echo [3/6] Creando commit inicial...
git commit -m "Calculadora LOTTT Multiempresa v1.1 - Lista para produccion"

echo.
echo ========================================
echo IMPORTANTE: Necesitas crear el repositorio en GitHub primero
echo.
echo 1. Ve a: https://github.com/new
echo 2. Nombre: calculadora-lottt
echo 3. Privado: SI (para venta exclusiva)
echo 4. Click en "Create repository"
echo 5. Copia la URL que te da GitHub
echo ========================================
echo.

set /p GITHUB_URL="Pega aqui la URL de tu repositorio (ej: https://github.com/TU_USUARIO/calculadora-lottt.git): "

echo.
echo [4/6] Conectando con GitHub...
git remote add origin %GITHUB_URL%

echo.
echo [5/6] Configurando rama principal...
git branch -M main

echo.
echo [6/6] Subiendo codigo a GitHub...
git push -u origin main

echo.
echo ========================================
echo  COMPLETADO!
echo ========================================
echo.
echo Tu codigo esta ahora en GitHub!
echo.
echo Proximos pasos:
echo 1. Activar GitHub Pages para PWA movil
echo 2. Generar los iconos (abrir generar-iconos.html)
echo 3. Distribuir a clientes
echo.
pause

# 🚀 PUBLICAR CALCULADORA LOTTT EN GITHUB

## 📋 PASOS PARA PUBLICAR:

### 1️⃣ **Crear repositorio en GitHub**

1. Ve a: https://github.com/new
2. Nombre del repositorio: `calculadora-lottt`
3. Descripción: `Calculadora de Prestaciones LOTTT - Multiempresa v1.1`
4. **IMPORTANTE:** Marca como **Privado** (para venta exclusiva)
5. Click en "Create repository"

---

### 2️⃣ **Subir tu código a GitHub**

Abre PowerShell en la carpeta del proyecto y ejecuta:

```powershell
# Inicializar Git (si no está inicializado)
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Calculadora LOTTT Multiempresa v1.1 - Lista para producción"

# Conectar con GitHub (reemplaza TU_USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/calculadora-lottt.git

# Subir a GitHub
git push -u origin main
```

**Nota:** Si te pide usuario/contraseña, usa tu **Personal Access Token** de GitHub.

---

### 3️⃣ **Activar GitHub Pages (para PWA móvil)**

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú izquierdo, click en **Pages**
4. En "Source", selecciona: **main** branch y carpeta **/app**
5. Click en **Save**
6. Espera 1-2 minutos

**¡Listo!** Tu app estará en: `https://TU_USUARIO.github.io/calculadora-lottt/`

---

### 4️⃣ **Instalar en móviles**

Ahora tus clientes pueden:

**Android:**
1. Abrir Chrome
2. Ir a: `https://TU_USUARIO.github.io/calculadora-lottt/`
3. Menú → "Agregar a pantalla de inicio"
4. ¡Funciona como app nativa!

**iOS:**
1. Abrir Safari
2. Ir a: `https://TU_USUARIO.github.io/calculadora-lottt/`
3. Compartir → "Agregar a pantalla de inicio"
4. ¡Funciona como app nativa!

---

## 🔒 SEGURIDAD (Repositorio Privado):

Como el repositorio es **privado**, solo tú puedes ver el código.

Para dar acceso a clientes:
1. Settings → Collaborators
2. Agregar email del cliente
3. Ellos pueden clonar el repo

---

## 💡 ALTERNATIVA: Netlify (Más fácil)

Si prefieres algo más simple:

1. Ve a: https://www.netlify.com
2. Arrastra la carpeta `app/` a Netlify
3. ¡Listo! Te da un enlace automático

**Ventajas de Netlify:**
- ✅ Más rápido (solo arrastrar carpeta)
- ✅ HTTPS automático
- ✅ Dominio personalizado gratis
- ✅ Actualizaciones fáciles

---

## 📱 RESULTADO FINAL:

Tus clientes tendrán:

**PC:**
- Descargan el instalador (.exe, .dmg)
- Instalan como programa normal

**Móviles:**
- Abren el enlace web
- "Agregar a pantalla de inicio"
- Funciona como app nativa
- Funciona offline
- Icono en el escritorio

---

## 🎯 RECOMENDACIÓN:

**Para venta:**
1. **PC:** Distribuir instalador Electron
2. **Móviles:** Dar enlace de GitHub Pages o Netlify

**Ventaja:** Un solo código, múltiples plataformas.

---

## 🆘 ¿Necesitas ayuda?

Si necesitas:
- Configurar GitHub Pages
- Crear dominio personalizado (ej: calculadora-lottt.com)
- Proteger con contraseña
- Publicar en App Stores

¡Avísame!

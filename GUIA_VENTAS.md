# 💼 GUÍA DE VENTAS - CALCULADORA LOTTT

## 📋 PROCESO DE VENTA

### 1️⃣ **Cliente te contacta**
- Cliente solicita la calculadora
- Negocian precio
- Cliente realiza el pago

### 2️⃣ **Recopilas información del cliente**
Pide al cliente:
- ✅ **Correo electrónico** (ejemplo: cliente@empresa.com)
- ✅ **Nombre completo** (para registro)
- ✅ **Empresa** (opcional)

### 3️⃣ **Generas código de acceso único**

Usa este formato:
```
LOTTT-[AÑO]-[LETRAS ALEATORIAS]
```

Ejemplos:
- `LOTTT-2026-ABC123`
- `LOTTT-2026-XYZ789`
- `LOTTT-2026-QWE456`

**Generador de códigos:**
- Ve a: https://www.random.org/strings/
- Configuración:
  - 1 string
  - 6 caracteres
  - Solo letras mayúsculas y números
- Agrega el prefijo: `LOTTT-2026-`

### 4️⃣ **Agregas el cliente al sistema**

Edita el archivo: `index.html`

Busca la línea que dice:
```javascript
const LICENSES = [
```

Agrega una nueva línea:
```javascript
const LICENSES = [
  { email: 'CONTADORA2504@GMAIL.COM', code: 'PROD-2025-PRES-6481' },
  { email: 'CLIENTE@CORREO.COM', code: 'ABC-999' },
  { email: 'NUEVOCLIENTE@EMPRESA.COM', code: 'LOTTT-2026-ABC123' },  // ← NUEVO
];
```

**IMPORTANTE:**
- Email en MAYÚSCULAS
- Código exacto (respeta mayúsculas/minúsculas)
- No olvides la coma al final

### 5️⃣ **Subes los cambios a GitHub**

```powershell
cd c:\calculadora-lottt-desktop
git add index.html
git commit -m "Agregar nuevo cliente: [NOMBRE]"
git push
```

Espera 2-3 minutos para que GitHub Pages se actualice.

### 6️⃣ **Envías credenciales al cliente**

---

## 📧 PLANTILLAS DE EMAIL

### **OPCIÓN A: Versión Web (Recomendada)**

```
Asunto: ✅ Tu Calculadora LOTTT está lista

Hola [NOMBRE],

¡Gracias por tu compra! Tu Calculadora LOTTT ya está activada.

🌐 **ACCESO WEB:**
https://dcedeno4.github.io/calculadora-lottt-1.1/

📧 **Email:** [EMAIL DEL CLIENTE]
🔑 **Código:** [CÓDIGO GENERADO]

📱 **INSTALACIÓN EN MÓVIL:**

**Android:**
1. Abre el enlace en Chrome
2. Menú (⋮) → "Agregar a pantalla de inicio"
3. ¡Funciona como app nativa!

**iPhone/iPad:**
1. Abre el enlace en Safari
2. Compartir → "Agregar a pantalla de inicio"
3. ¡Funciona como app nativa!

💻 **INSTALACIÓN EN PC:**
1. Abre el enlace en tu navegador
2. Usa la aplicación directamente desde el navegador
3. Funciona sin internet después de la primera carga

✨ **CARACTERÍSTICAS:**
- ✅ Cálculo de vacaciones, utilidades y prestaciones
- ✅ Gestión de múltiples empresas
- ✅ Exportación a Excel y PDF
- ✅ Base de datos local (tus datos están seguros)
- ✅ Funciona offline

📞 **SOPORTE:**
Si tienes alguna duda, contáctame a [TU EMAIL/TELÉFONO]

Saludos,
[TU NOMBRE]
```

---

### **OPCIÓN B: Versión PC (Instalador)**

```
Asunto: ✅ Tu Calculadora LOTTT está lista

Hola [NOMBRE],

¡Gracias por tu compra! Descarga tu Calculadora LOTTT:

💾 **DESCARGA:**
[LINK DE GOOGLE DRIVE / DROPBOX]

📧 **Email:** [EMAIL DEL CLIENTE]
🔑 **Código:** [CÓDIGO GENERADO]

📥 **INSTALACIÓN:**
1. Descarga el archivo
2. Ejecuta el instalador
3. Abre la aplicación
4. Ingresa tu email y código
5. ¡Listo!

✨ **CARACTERÍSTICAS:**
- ✅ Cálculo de vacaciones, utilidades y prestaciones
- ✅ Gestión de múltiples empresas
- ✅ Exportación a Excel y PDF
- ✅ Base de datos local (tus datos están seguros)

📞 **SOPORTE:**
Si tienes alguna duda, contáctame a [TU EMAIL/TELÉFONO]

Saludos,
[TU NOMBRE]
```

---

## 🔒 SEGURIDAD

### **Ventajas del sistema actual:**

1. ✅ **Cada cliente tiene credenciales únicas**
2. ✅ **No pueden compartir el acceso** (email + código específicos)
3. ✅ **Puedes desactivar clientes** (eliminando su línea del código)
4. ✅ **Control total** (tú decides quién accede)

### **Para desactivar un cliente:**

1. Edita `index.html`
2. Elimina o comenta la línea del cliente:
```javascript
// { email: 'CLIENTE@CORREO.COM', code: 'ABC-999' },  // Desactivado
```
3. Sube cambios a GitHub

---

## 💰 PRECIOS SUGERIDOS

**Versión Web (acceso permanente):**
- Individual: $20-30 USD
- Empresarial: $50-100 USD

**Versión PC (instalador):**
- Individual: $30-40 USD
- Empresarial: $60-120 USD

**Paquete Completo (Web + PC):**
- Individual: $40-50 USD
- Empresarial: $80-150 USD

---

## 📊 REGISTRO DE CLIENTES

Mantén un registro en Excel:

| Fecha | Cliente | Email | Código | Precio | Estado |
|-------|---------|-------|--------|--------|--------|
| 2026-08-02 | Juan Pérez | juan@empresa.com | LOTTT-2026-ABC123 | $30 | Activo |
| 2026-08-03 | María López | maria@contadores.com | LOTTT-2026-XYZ789 | $50 | Activo |

---

## 🚀 DISTRIBUCIÓN

### **Versión Web:**
- ✅ Ya está lista en: https://dcedeno4.github.io/calculadora-lottt-1.1/
- ✅ Solo agregas clientes al código
- ✅ Actualizaciones automáticas

### **Versión PC:**
1. Crea instalador:
```powershell
npm install electron-builder --save-dev
npm run build
```

2. Sube el instalador a:
   - Google Drive
   - Dropbox
   - OneDrive
   - Tu propio servidor

3. Envía el link al cliente

---

## ❓ PREGUNTAS FRECUENTES

**P: ¿Puedo cambiar el precio?**
R: Sí, tú decides el precio según tu mercado.

**P: ¿Cuántos clientes puedo tener?**
R: Ilimitados.

**P: ¿Qué pasa si el cliente pierde su código?**
R: Puedes enviárselo de nuevo (lo tienes en tu registro).

**P: ¿Puedo ofrecer soporte técnico?**
R: Sí, puedes cobrar extra por soporte.

**P: ¿Cómo actualizo la aplicación?**
R: Subes cambios a GitHub y se actualiza automáticamente (versión web).

---

## 📞 SOPORTE A CLIENTES

**Problemas comunes:**

1. **"No puedo iniciar sesión"**
   - Verifica que el email esté en MAYÚSCULAS
   - Verifica que el código sea exacto
   - Verifica que agregaste al cliente en `index.html`

2. **"No puedo agregar empresas"**
   - Verifica que haya iniciado sesión correctamente
   - Recarga la página (Ctrl+F5)

3. **"Los datos se borraron"**
   - Los datos están en el navegador/PC del cliente
   - No se borran a menos que limpie caché o desinstale

---

¡Éxito en tus ventas! 🎉

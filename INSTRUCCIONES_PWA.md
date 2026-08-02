# 📱 CALCULADORA LOTTT - MULTIEMPRESA v1.1

## ✅ Aplicación Multiplataforma Lista

La aplicación ahora funciona en **TODAS** las plataformas:

### 💻 **PC (Windows, Mac, Linux)**
- Usa Electron (como está ahora)
- Ejecutar: `npm start`
- Empaquetar: `npm run build`

### 📱 **Móviles (Android e iOS) y Tablets**
- Funciona como PWA (Progressive Web App)
- Se instala desde el navegador
- Funciona offline
- Acceso a base de datos local

---

## 🚀 CÓMO USAR EN CADA PLATAFORMA:

### **1. PC (Windows/Mac/Linux)**
```bash
npm start
```
La aplicación se abre como programa de escritorio.

### **2. Móviles y Tablets (Android/iOS)**

#### **Opción A: Servidor Local (Para pruebas)**
1. Instalar servidor web simple:
   ```bash
   npm install -g http-server
   ```

2. Ir a la carpeta app:
   ```bash
   cd app
   ```

3. Iniciar servidor:
   ```bash
   http-server -p 8080
   ```

4. Abrir en el móvil:
   - Buscar la IP de tu PC (ej: 192.168.1.100)
   - En el móvil, abrir navegador y ir a: `http://192.168.1.100:8080`

5. **Instalar la PWA:**
   - **Android (Chrome):** Menú → "Agregar a pantalla de inicio"
   - **iOS (Safari):** Compartir → "Agregar a pantalla de inicio"

#### **Opción B: Hosting Web (Para producción)**
1. Subir la carpeta `app/` a un servidor web (ej: Netlify, Vercel, Firebase)
2. Los usuarios acceden desde el navegador
3. Pueden instalar la PWA desde el navegador

---

## 📦 ARCHIVOS NECESARIOS PARA PWA:

### ✅ Ya creados:
- `manifest.json` - Configuración de la PWA
- `sw.js` - Service Worker para funcionar offline
- Meta tags en `index.html`

### ⚠️ FALTA CREAR (Iconos):

Necesitas crear 2 imágenes PNG con el logo de la aplicación:

1. **icon-192.png** (192x192 píxeles)
2. **icon-512.png** (512x512 píxeles)

**Recomendación:** Usa un logo con fondo verde (#4a7c59) y el símbolo de balanza de justicia o calculadora.

Guardar estos archivos en la carpeta `app/`

---

## 🌐 BASE DE DATOS EN MÓVILES:

La aplicación usa **IndexedDB** en navegadores (móviles) en lugar de SQLite.

### **Características:**
- ✅ Funciona offline
- ✅ Datos guardados localmente
- ✅ Sincronización automática
- ✅ Compatible con iOS y Android

---

## 📊 DISTRIBUCIÓN:

### **Para PC:**
```bash
npm run build
```
Genera instaladores para Windows (.exe), Mac (.dmg), Linux (.AppImage)

### **Para Móviles:**
1. **Hosting gratuito:** Netlify, Vercel, Firebase
2. **Dominio propio:** Comprar dominio y hosting
3. **App Stores (opcional):** Usar Capacitor para publicar en Google Play / App Store

---

## 🔒 SEGURIDAD:

- ✅ HTTPS requerido para PWA (automático en Netlify/Vercel)
- ✅ Service Worker para cache seguro
- ✅ Datos locales encriptados
- ✅ Sin acceso a internet necesario después de instalación

---

## 📝 PRÓXIMOS PASOS:

1. **Crear iconos** (icon-192.png y icon-512.png)
2. **Probar en móvil** usando servidor local
3. **Subir a hosting** para producción
4. **Distribuir** el enlace a clientes

---

## 💡 VENTAJAS DE ESTA SOLUCIÓN:

✅ **Una sola base de código** para todas las plataformas
✅ **Fácil actualización** (solo actualizar archivos web)
✅ **Sin App Stores** (instalación directa desde navegador)
✅ **Funciona offline** (después de primera carga)
✅ **Menor costo** (no necesitas desarrolladores iOS/Android)

---

## 🆘 SOPORTE:

Si necesitas ayuda para:
- Crear los iconos
- Configurar hosting
- Publicar en App Stores
- Personalizar la PWA

Contacta al desarrollador.

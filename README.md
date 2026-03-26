# Mini-Web HTML5 Offline para Showpad

## Digital Frame - Coloplast

Mini-web HTML5 estática optimizada para funcionar 100% offline en Showpad (iPads/tablets).

---

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+
- npm

### Instalación
```bash
npm install
```

### Desarrollo (servidor local)
```bash
npm run dev
```
Abre http://localhost:8080 en el navegador.

### Generar ZIP para Showpad
```bash
npm run build
```
El archivo `dist/product.zip` estará listo para subir a Showpad.

---

## 📁 Estructura del Proyecto

```
Web Showpad/
├── index.html              ← Entrada principal (RAÍZ del ZIP)
├── package.json            ← Scripts npm
├── data/
│   └── content.json        ← Contenidos dinámicos
├── assets/
│   ├── css/
│   │   ├── styles.css      ← Estilos principales
│   │   └── components.css  ← Componentes UI
│   ├── js/
│   │   ├── app.js          ← Lógica principal
│   │   ├── navigation.js   ← Sistema de navegación
│   │   └── components.js   ← Componentes interactivos
│   ├── img/                ← Imágenes optimizadas
│   ├── video/              ← Vídeos MP4 (H.264)
│   └── fonts/              ← Fuentes locales
├── scripts/
│   └── build.js            ← Script de empaquetado
└── dist/
    └── product.zip         ← ZIP final (generado)
```

---

## 📝 Cómo Actualizar Contenido

### Opción 1: Editar content.json
1. Abre `data/content.json`
2. Modifica el contenido deseado
3. Guarda y recarga la página

```json
{
    "product": {
        "name": "Nombre del Producto",
        "subtitle": "Subtítulo"
    },
    "gallery": [
        { "image": "assets/img/foto1.jpg", "title": "Título" }
    ]
}
```

### Opción 2: Editar HTML directamente
1. Abre `index.html`
2. Modifica las secciones `<section data-page="...">`
3. Guarda y recarga

---

## 🖼️ Añadir Imágenes

1. Coloca la imagen en `assets/img/`
2. Formato recomendado: WebP o JPEG optimizado
3. Referencia en HTML:
```html
<img src="assets/img/tu-imagen.jpg" alt="Descripción">
```

---

## 🎬 Añadir Vídeos

1. Formato: **MP4 (H.264)** - obligatorio para iPad
2. Coloca el vídeo en `assets/video/`
3. Añade un poster (imagen de preview):
```html
<video poster="assets/img/video-poster.jpg" controls playsinline>
    <source src="assets/video/demo.mp4" type="video/mp4">
</video>
```

---

## 🔤 Añadir Fuentes Corporativas

1. Coloca los archivos `.woff2` en `assets/fonts/`
2. Añade en `styles.css`:
```css
@font-face {
    font-family: 'MiFuente';
    src: url('../fonts/mifuente.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
}

:root {
    --font-primary: 'MiFuente', sans-serif;
}
```

---

## ⚠️ Restricciones Importantes

| ❌ NO hacer | ✅ SÍ hacer |
|------------|-------------|
| URLs externas (CDN, Google Fonts) | Assets locales |
| fetch() a APIs externas | JSON local |
| Service Workers | Navegación JS simple |
| Formatos de vídeo no compatibles | MP4 H.264 |
| Rutas absolutas | Rutas relativas |

---

## 📱 Pruebas Recomendadas

1. **Navegador local**: Abrir `index.html` directamente (file://)
2. **Servidor local**: `npm run dev`
3. **iPad Safari**: Descomprimir ZIP y abrir
4. **Showpad**: Subir ZIP y verificar offline

---

## 📦 Entregables

- `dist/product.zip` - ZIP listo para Showpad
- Código fuente en repositorio Git
- Este README con instrucciones

---

## 📞 Soporte

Para dudas o modificaciones, contactar al equipo de desarrollo.

**Versión**: 1.0.0  
**Última actualización**: 2026-01-13

# Mizu Coder

**Mizu Coder** es una aplicación web interactiva que permite a los usuarios escribir y previsualizar código **HTML**, **CSS** y **JavaScript** en tiempo real.  
Incluye funcionalidades como vista previa en vivo, pestañas de edición y una consola integrada para capturar mensajes de `console.log`, `console.warn` y `console.error`.

---

## 🚀 Novedades de esta versión

- Se dividió el código en **HTML + CSS + JS** (antes estaba todo unificado).  
- Se actualizó el **selector de modo** estilo Apple:
  - **Modo Unificado** → Un solo archivo HTML con todo el código.  
  - **Modo Separado** → HTML, CSS y JS en pestañas independientes.  
  - **Modo Mizu** (⚠️ en desarrollo) → Usará `src/css/core.css` + `src/js/core.js`.  
  - **Modo Personalizado** (⚠️ en desarrollo) → Permitirá crear y gestionar múltiples archivos.  

> **Nota:** El **Modo Mizu** y el **Modo Personalizado** aún no son funcionales.  
En la próxima versión se agregará la capacidad de crear más pestañas JS/CSS para habilitarlos.

- Ajustes en el diseño:  
  - Se corrigió el sistema de redimensionamiento de ventanas con el slider.  
  - Vista responsiva: en pantallas grandes los editores y la vista previa se dividen horizontalmente, y en pantallas pequeñas se apilan verticalmente.  

- Estado actual: **estable y funcional** ✅

---

## ✨ Funcionalidades principales

- Editor en pestañas para **HTML, CSS y JS**.  
- Vista previa en vivo dentro de un `iframe`.  
- Consola integrada con soporte para logs, advertencias y errores.  
- Sistema de guardado automático en `localStorage`.  
- Exportación del contenido de cada pestaña a un archivo descargable.  
- Resizer (slider) para ajustar el tamaño entre editor y vista previa.

---

## 📂 Estructura actual del proyecto


mizu-coder/
│── index.html # Interfaz principal
│── src/
│ ├── css/
│ │ └── core.css # Estilos base
│ └── js/
│ └── core.js # Lógica principal


---

## 🛠️ Próximos pasos

- [ ] Agregar pestañas dinámicas para múltiples archivos JS/CSS.  
- [ ] Habilitar **Modo Mizu** y **Modo Personalizado**.  
- [ ] Mejorar la gestión de proyectos/exportación.  
- [ ] Optimizar la experiencia móvil.  

---

## 📜 Licencia

Este proyecto se distribuye bajo la licencia MIT.  
Eres libre de usarlo, modificarlo y compartirlo bajo los términos de dicha licencia.

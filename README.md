Mizu-Coder-DS004
Mizu Coder - Problema Solucionado 
Version: 1.1.0
Version generada con TII Falcon H1 34B.

Descripción 

Mizu Coder es una herramienta web diseñada para facilitar la edición y previsualización de código HTML, CSS y JavaScript. Permite a los usuarios escribir código en editores separados por pestañas y ver los resultados en tiempo real en un iframe integrado. 
Características 

    Editores de código : Tres editores de texto para HTML, CSS y JavaScript con resaltado de sintaxis y números de línea.
    Vista previa en vivo : Un iframe que muestra la salida del código HTML y CSS escrito, ejecutando también el JavaScript correspondiente.
    Consola integrada : Muestra los mensajes de consola (log, warn, error) generados por el código JavaScript.
    Guardado automático : El contenido escrito se guarda automáticamente en el almacenamiento local del navegador.
    Exportación de código : Permite exportar el código actual de la pestaña activa como archivo.
    Modo unificado/separado : Opciones para trabajar con HTML completo que incluye CSS y JS internos o con archivos separados.
    Redimensionamiento : Barra deslizante para ajustar el tamaño del área de edición y la vista previa.
     

Instalación y Uso 

    Clona o descarga este proyecto en tu máquina local.
    Abre el archivo index.html en tu navegador web favorito.
    Comienza a escribir tu código HTML, CSS y JavaScript en las respectivas pestañas.
    La vista previa se actualizará automáticamente a medida que escribas.
     

Nota 

Este proyecto utiliza Tailwind CSS a través de un CDN para el estilo y Font Awesome para los íconos. No requiere configuración adicional para ejecutarse, simplemente abre el archivo HTML en un navegador. 
Contribuyentes 

    Mizu Legends Studios
     

Licencia 

Este proyecto está bajo la licencia AGPL 3.0. 

# Mizu Coder

**Mizu Coder** es una aplicación web interactiva que permite a los usuarios escribir y previsualizar código **HTML**, **CSS** y **JavaScript** en tiempo real.  
Incluye funcionalidades como vista previa en vivo, pestañas de edición y una consola integrada para capturar mensajes de `console.log`, `console.warn` y `console.error`.

---

## 🚀 Novedades de esta versión 2.0.0

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

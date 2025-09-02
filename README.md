
**Versión: 2.1.0**  
**Desarrollado por: Mizu Legends Studios**

---

## 📖 Descripción

**Mizu Coder** es una aplicación web interactiva para escribir y previsualizar código **HTML**, **CSS** y **JavaScript** en tiempo real.  
Su objetivo es ofrecer un entorno ligero, personalizable y modular, ideal tanto para pruebas rápidas como para la creación de proyectos más grandes.

En esta versión, se introduce un sistema de **módulos independientes** para mejorar la escalabilidad y la facilidad de mantenimiento.

---

## 🚀 Novedades de la versión 2.1.0

- 🔄 **Nueva arquitectura modular**:  
  - `core.js` ahora actúa como **gestor central de módulos**.  
  - Se pueden habilitar/deshabilitar funciones sin eliminar código.  
  - Hasta **20 módulos JS independientes** pueden ser cargados dinámicamente.  

- 📂 **Estructura de archivos actualizada**:
  - `index.html` → Interfaz principal.  
  - `src/css/core.css` → Estilos globales.  
  - `src/js/core.js` → Punto de entrada, gestiona los módulos.  
  - `src/js/moduleX.js` → Funciones opcionales (ej: logros, participantes, equipos, etc.).  

- 🖥️ **Modos de uso mejorados**:
  - **Unificado**: todo en un solo archivo HTML.  
  - **Separado**: HTML, CSS y JS distribuidos.  
  - **Mizu (experimental)**: usa `core.css` + `core.js` como base.  
  - **Personalizado (experimental)**: permitirá crear y gestionar múltiples archivos JS/CSS.  

- 📐 **Mejor manejo del rendimiento**:  
  - Los módulos no activos ya no se cargan en memoria.  
  - El editor funciona más rápido y con menos bloqueos.  

---

## ✨ Funcionalidades principales

- 📝 Editores en pestañas para **HTML, CSS y JS**.  
- 🔄 Vista previa en vivo en un `iframe`.  
- 🖥️ Consola integrada con logs, advertencias y errores.  
- 💾 Guardado automático en `localStorage`.  
- 📤 Exportación de cada pestaña como archivo.  
- 📐 Ajuste dinámico de ventana (slider horizontal/vertical).  
- ⚡ Activación selectiva de módulos desde `core.js`.  

---

mizu-coder/
│── index.html # UI principal
│── src/
│ ├── css/
│ │ └── core.css # Estilos globales
│ └── js/
│ ├── core.js # Gestor de módulos
│ ├── editor.js # Editor principal
│ ├── preview.js # Vista previa
│ ├── console.js # Consola
│ ├── tabs.js # Gestión de pestañas dinámicas
│ ├── module1.js # Ejemplo: logros
│ ├── module2.js # Ejemplo: participantes
│ ├── module3.js # Ejemplo: equipos
│ └── ... # Hasta module20.js

---

## 🛠️ Instalación y uso

1. Clona o descarga este repositorio.  
2. Abre `index.html` en tu navegador.  
3. Escribe tu código en las pestañas de **HTML, CSS y JS**.  
4. Activa o desactiva módulos desde `core.js`.  
5. Observa los resultados en la vista previa integrada.  

---

## 📌 Roadmap (Próximos pasos)

- [ ] Sistema de **pestañas dinámicas** para hasta 20 archivos JS.  
- [ ] Habilitar los modos **Mizu** y **Personalizado**.  
- [ ] Interfaz para **activar/desactivar módulos en vivo**.  
- [ ] Gestión avanzada de proyectos (exportación/importación completa).  
- [ ] Optimización para dispositivos móviles.  

---

## 👨‍💻 Contribuyentes

- **Mizu Legends Studios**

---

## 📜 Licencia

Este proyecto está licenciado bajo **AGPL 3.0**.  
Eres libre de usarlo, modificarlo y distribuirlo bajo los términos de dicha licencia.


## 📂 Estructura del proyecto


# Mizu Coder

**Versión: 2.1.0**  
**Desarrollado por: Mizu Legends Studios**

---

## 📖 Descripción

**Mizu Coder** es una aplicación web interactiva diseñada para facilitar la edición y previsualización de código **HTML**, **CSS** y **JavaScript** en tiempo real.  
Permite a los usuarios escribir código en editores separados por pestañas, ver resultados instantáneamente en una vista previa integrada y depurar con una consola personalizada.

---

## 🚀 Novedades de la versión 2.1.0

- ✅ **Modo Mizu activado**: Ahora carga `src/css/core.css` y `src/js/core.js` desde archivos externos.
- ✅ **Soporte para pestañas dinámicas**: Puedes crear nuevas pestañas de JS/CSS con el botón **"+"**.
- ✅ **Persistencia básica**: Las nuevas pestañas se mantienen al recargar la página (gracias a `localStorage`).
- ✅ **Arquitectura modular con ES6**: Uso de módulos para mejor escalabilidad y mantenimiento.
- ✅ **UI mejorada**: Selector de modo Apple completamente funcional con retroalimentación visual.

> ⚠️ **Nota**: Aún no se pueden eliminar pestañas ni renombrar archivos. Estas funciones llegarán en la versión **2.2.0**.

---

## ✨ Funcionalidades principales

- 📝 **Editores en pestañas** para HTML, CSS y JS (incluyendo nuevas pestañas dinámicas).
- 🔄 **Vista previa en vivo** dentro de un `iframe` seguro.
- 🖥️ **Consola integrada** con soporte para `console.log`, `console.warn` y `console.error`.
- 💾 **Guardado automático** en `localStorage` (incluyendo estado de pestañas).
- 📤 **Exportación de código** por pestaña como archivo descargable.
- 📐 **Ajuste dinámico** entre editor y vista previa con slider (horizontal/vertical según pantalla).
- 🔧 **Selector de modo estilo Apple** ahora funcional (Modo Unificado, Separado, Mizu).

---

## 📂 Estructura del proyecto
mizu-coder/
│
├── index.html                    # Interfaz principal
│
└── src/
    ├── css/
    │   └── core.css              # Estilos base de la app
    │
    └── js/
        ├── core.js               # Punto de entrada: inicializa módulos y eventos
        │
        ├── stable/               # Módulos estables (funcionalidades base)
        │   └── stable.js         # Lógica de pestañas, consola, redimensionamiento, exportar, etc.
        │
        └── dev/                  # Módulos en desarrollo (nuevas funcionalidades)
            ├── mode-mizu.js      # Activa el modo Mizu y carga archivos externos
            └── tab-manager.js    # Gestiona pestañas dinámicas (crear, cambiar, persistir)


---

## 🛠️ Instalación y uso

1. Clona o descarga este proyecto en tu máquina local.  
2. Abre el archivo `index.html` en tu navegador (Chrome, Firefox, Edge recomendados).  
3. Escribe tu código en las pestañas de **HTML**, **CSS** o **JS**.  
4. Usa el botón **"+"** para crear nuevas pestañas de JS/CSS si lo necesitas.  
5. Activa el **Modo Mizu** desde el selector para usar `src/css/core.css` y `src/js/core.js`.  
6. Observa los resultados en tiempo real en la vista previa.  
7. Usa la **consola** para depurar con `console.log()`.

---

## 📌 Roadmap (Próximos pasos)

- [ ] Eliminar pestañas con botón "×".
- [ ] Renombrar pestañas y archivos personalizados.
- [ ] Modo Personalizado: permitir crear estructuras de proyecto avanzadas.
- [ ] Soporte para múltiples proyectos guardados.
- [ ] Optimización para móviles: mejoras en UX táctil y menús.
- [ ] Exportar proyecto completo como ZIP.

---

## 👨‍💻 Contribuyentes

- **Mizu Legends Studios**

---

## 📜 Licencia

Este proyecto está licenciado bajo **AGPL 3.0**.  
Eres libre de usarlo, modificarlo y distribuirlo bajo los términos de dicha licencia.

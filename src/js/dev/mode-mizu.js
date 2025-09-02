// src/js/dev/mode-mizu.js
// Activa el Modo Mizu: carga src/css/core.css y src/js/core.js externamente

/**
 * Activa el Modo Mizu
 * @param {object} app - Referencia a la app (para acceder a updatePreview, etc.)
 */
export function activateMizuMode(app) {
    const currentMode = 'mizu';
    const modeSelectorButton = document.getElementById('modeSelectorButton');
    const currentModeText = document.getElementById('currentModeText');

    // 1. Actualizar estado visual del selector
    updateModeSelectorUI('Estructura Mizu');

    // 2. Guardar modo en localStorage
    localStorage.setItem('mizu_coder_mode', currentMode);

    // 3. Asegurar que los archivos externos estén cargados
    loadExternalAssets();

    // 4. Forzar actualización de la vista previa
    if (typeof app.updatePreview === 'function') {
        app.updatePreview();
    }

    console.log('[Mizu Coder] Modo Mizu activado: usando src/css/core.css y src/js/core.js');
}

/**
 * Actualiza el UI del selector de modo
 * @param {string} text - Texto a mostrar
 */
function updateModeSelectorUI(text) {
    const currentModeText = document.getElementById('currentModeText');
    if (currentModeText) {
        currentModeText.textContent = text;
    }

    // Actualizar opciones del dropdown
    document.querySelectorAll('.mode-option').forEach(option => {
        if (option.dataset.mode === 'mizu') {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });

    // Limpiar y añadir badge "Activo"
    document.querySelectorAll('.mode-badge').forEach(b => b.remove());
    const activeOption = document.querySelector('[data-mode="mizu"]');
    if (activeOption) {
        const badge = document.createElement('div');
        badge.className = 'mode-badge';
        badge.textContent = 'Activo';
        activeOption.appendChild(badge);
    }
}

/**
 * Carga los recursos externos (CSS y JS)
 */
function loadExternalAssets() {
    // Evitar múltiples cargas
    if (document.getElementById('mizu-core-css')) {
        console.log('[Mizu Coder] core.css ya está cargado');
    } else {
        const cssLink = document.createElement('link');
        cssLink.id = 'mizu-core-css';
        cssLink.rel = 'stylesheet';
        cssLink.href = 'src/css/core.css';
        cssLink.onload = () => console.log('[Mizu Coder] CSS externo cargado: src/css/core.css');
        cssLink.onerror = () => console.error('[Mizu Coder] Error al cargar src/css/core.css');
        document.head.appendChild(cssLink);
    }

    // Cargar core.js como módulo (opcional, si se necesita en el editor)
    if (!document.getElementById('mizu-core-js')) {
        const jsScript = document.createElement('script');
        jsScript.id = 'mizu-core-js';
        jsScript.type = 'module';
        jsScript.src = 'src/js/core.js';
        jsScript.onload = () => console.log('[Mizu Coder] JS externo cargado: src/js/core.js');
        jsScript.onerror = () => console.error('[Mizu Coder] Error al cargar src/js/core.js');
        document.head.appendChild(jsScript);
    }
}

/**
 * Actualiza la vista previa para el Modo Mizu
 * @param {object} app - Referencia a la app
 */
export function updatePreviewForMizuMode(app) {
    const htmlEditor = document.getElementById('htmlEditor');
    const previewFrame = document.getElementById('previewFrame');

    if (!htmlEditor || !previewFrame) return;

    const htmlContent = htmlEditor.value;

    const fullHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="src/css/core.css">
    <title>Mizu Coder - Modo Mizu</title>
</head>
<body>
    ${htmlContent}
    <script type="module" src="src/js/core.js"><\/script>
</body>
</html>`;

    try {
        const previewDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
        previewDoc.open();
        previewDoc.write(fullHtml);
        previewDoc.close();

        // Aplicar consola personalizada
        if (typeof app.overrideConsole === 'function') {
            app.overrideConsole(previewFrame.contentWindow);
        }
    } catch (err) {
        console.error('Error al actualizar vista previa en Modo Mizu:', err);
    }
}

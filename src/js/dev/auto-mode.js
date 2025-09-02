// src/js/dev/auto-mode.js
/**
 * Detecta automáticamente el modo ideal según el uso de pestañas
 * @param {object} app - Referencia a la app
 * @returns {string} 'unified' | 'separated' | 'mizu' | 'custom'
 */
export function detectAutoMode(app) {
    const tabs = Array.from(document.querySelectorAll('.tab-button[data-id]'));
    const hasJS = tabs.some(t => t.dataset.type === 'js');
    const hasCSS = tabs.some(t => t.dataset.type === 'css');
    const htmlContent = document.getElementById('htmlEditor').value.trim();

    // Detectar si se usan rutas como src/js/core.js
    const usesMizuStructure = htmlContent.includes('src/css/') || htmlContent.includes('src/js/');

    // Detectar archivos personalizados
    const customFiles = tabs.filter(t => {
        const label = t.textContent.trim();
        return label !== 'JS Extra' && label !== 'CSS Extra';
    });

    if (usesMizuStructure) return 'mizu';
    if (customFiles.length > 0) return 'custom';
    if (hasJS || hasCSS) return 'separated';
    return 'unified';
}

/**
 * Activa el modo detectado
 * @param {string} mode
 * @param {object} app
 */
export function applyAutoMode(mode, app) {
    const option = document.querySelector(`.mode-option[data-mode="${mode}"]`);
    if (!option) return;

    // Actualizar UI
    document.querySelectorAll('.mode-option').forEach(o => o.classList.remove('active'));
    option.classList.add('active');

    const currentModeText = document.getElementById('currentModeText');
    const title = option.querySelector('.mode-title')?.textContent;
    if (title) currentModeText.textContent = title;

    // Guardar modo
    localStorage.setItem('mizu_coder_mode', mode);
    app.currentMode = mode;

    // Forzar actualización
    if (typeof app.updatePreview === 'function') {
        setTimeout(app.updatePreview, 100);
    }

    console.log(`🤖 Mizu Coder: Modo automático activado: ${mode}`);
}

// src/js/dev/dev.js
import { createNewTab, restoreSavedTabs } from './tab-manager.js';
import { activateMizuMode, updatePreviewForMizuMode } from './mode-mizu.js';

export function setupDevFeatures(app) {
    // Restaurar pestañas
    restoreSavedTabs(app);

    // Botón "+" para nuevas pestañas
    const addTabBtn = document.getElementById('addTabBtn');
    if (addTabBtn) {
        addTabBtn.addEventListener('click', () => {
            const type = (prompt('¿Qué tipo de pestaña? (js/css)', 'js') || 'js').toLowerCase();
            if (type === 'js' || type === 'css') {
                createNewTab(type, app);
            }
        });
    }

    // Detectar modo Mizu y actuar
    const modeOptions = document.querySelectorAll('.mode-option');
    modeOptions.forEach(option => {
        option.addEventListener('click', () => {
            if (option.dataset.mode === 'mizu') {
                activateMizuMode(app);
                // Opcional: forzar actualización
                setTimeout(() => updatePreviewForMizuMode(app), 100);
            }
        });
    });

    // Si ya está en modo Mizu al cargar
    const savedMode = localStorage.getItem('mizu_coder_mode');
    if (savedMode === 'mizu') {
        activateMizuMode(app);
        setTimeout(() => updatePreviewForMizuMode(app), 100);
    }
}

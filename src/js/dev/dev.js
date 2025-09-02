// src/js/dev/dev.js
import { createNewTab } from './tab-manager.js';
import { activateMizuMode } from './mode-mizu.js';

export function setupDevFeatures(app) {
    // Botón "+" para nuevas pestañas
    const addTabBtn = document.getElementById('addTabBtn');
    if (addTabBtn) {
        addTabBtn.addEventListener('click', () => {
            const type = prompt('¿Qué tipo de pestaña? (js/css)', 'js').toLowerCase();
            if (type === 'js' || type === 'css') {
                createNewTab(type, app);
            }
        });
    }

    // Si necesitas lógica adicional para modo Mizu
    if (app.currentMode === 'mizu') {
        activateMizuMode(app);
    }
}

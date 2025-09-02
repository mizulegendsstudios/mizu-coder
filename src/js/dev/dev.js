// src/js/dev/dev.js
import { createNewTab, restoreSavedTabs } from './tab-manager.js';

export function setupDevFeatures(app) {
    // Restaurar pestañas al cargar
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
}

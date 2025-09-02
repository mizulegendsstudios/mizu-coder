// src/js/dev/dev.js
import { createNewTab } from './tab-manager.js';
import { activateMizuMode } from './mode-mizu.js';

let devFeaturesInitialized = false;

export function setupDevFeatures(app) {
    if (devFeaturesInitialized) return;
    devFeaturesInitialized = true;

    // Restaurar pestañas guardadas
    restoreSavedTabs(app);

    // Botón "+" para nuevas pestañas
    const addTabBtn = document.getElementById('addTabBtn');
    if (addTabBtn) {
        addTabBtn.addEventListener('click', () => {
            // Solicitar tipo de pestaña
            let typeInput = prompt('¿Qué tipo de pestaña? (js/css)', 'js');

            // Validar entrada
            if (!typeInput) {
                console.log('❌ Mizu Coder: Creación de pestaña cancelada o entrada inválida');
                return;
            }

            const type = typeInput.toLowerCase().trim();
            if (type !== 'js' && type !== 'css') {
                alert('❌ Tipo inválido. Usa "js" o "css"');
                console.log('❌ Mizu Coder: Tipo inválido ingresado:', typeInput);
                return;
            }

            // Crear pestaña
            createNewTab(type, app);
            console.log(`✅ Mizu Coder: Pestaña creada - Tipo: ${type}`);
        });
    }

    // Detectar modo Mizu
    const modeOptions = document.querySelectorAll('.mode-option');
    modeOptions.forEach(option => {
        option.addEventListener('click', () => {
            if (option.dataset.mode === 'mizu') {
                activateMizuMode(app);
            }
            if (typeof app.updatePreview === 'function') {
                setTimeout(app.updatePreview, 100);
            }
        });
    });
}

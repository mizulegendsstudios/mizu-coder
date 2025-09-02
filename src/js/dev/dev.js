// src/js/dev/dev.js
// Funcionalidades en desarrollo: pestañas dinámicas, modo Mizu

import { createNewTab, restoreSavedTabs } from './tab-manager.js';
import { activateMizuMode } from './mode-mizu.js';

let initialized = false;

export function setupDevFeatures(app) {
    if (initialized) {
        console.warn('⚠️ setupDevFeatures ya fue inicializado');
        return;
    }
    initialized = true;

    console.log('🟢 Mizu Coder: Inicializando funcionalidades de desarrollo...');

    // --- 1. Restaurar pestañas guardadas ---
    restoreSavedTabs(app);

    // --- 2. Botón "+" para nuevas pestañas ---
    const addTabBtn = document.getElementById('addTabBtn');
    if (addTabBtn) {
        addTabBtn.addEventListener('click', () => {
            let typeInput = prompt('¿Qué tipo de pestaña? (js/css)', 'js');
            
            if (!typeInput) {
                console.log('❌ Mizu Coder: Creación cancelada');
                return;
            }

            const type = typeInput.trim().toLowerCase();
            if (type !== 'js' && type !== 'css') {
                alert('❌ Tipo inválido. Usa "js" o "css"');
                console.warn('❌ Tipo inválido:', typeInput);
                return;
            }

            createNewTab(type, app);
        });
    } else {
        console.warn('⚠️ Botón #addTabBtn no encontrado');
    }

    // --- 3. Selector de modo ---
    const modeOptions = document.querySelectorAll('.mode-option');
    if (modeOptions.length === 0) {
        console.warn('⚠️ No se encontraron opciones de modo');
        return;
    }

    modeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const mode = option.dataset.mode;
            console.log(`🎯 Modo seleccionado: ${mode}`);

            if (mode === 'mizu' && typeof activateMizuMode === 'function') {
                activateMizuMode(app);
            }

            // Forzar actualización
            if (typeof app.updatePreview === 'function') {
                setTimeout(() => {
                    app.updatePreview();
                }, 100);
            }
        });
    });

    // --- 4. Si ya está en modo Mizu, activarlo ---
    const savedMode = localStorage.getItem('mizu_coder_mode');
    if (savedMode === 'mizu') {
        activateMizuMode(app);
    }

    console.log('✅ Mizu Coder: Funcionalidades de desarrollo listas');
}

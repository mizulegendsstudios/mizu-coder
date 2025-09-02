// src/js/dev/dev.js
// Funcionalidades en desarrollo: pestañas dinámicas, modo Mizu

import { createNewTab, restoreSavedTabs } from './tab-manager.js';
import { activateMizuMode } from './mode-mizu.js';

let initialized = false;

export function setupDevFeatures(app) {
    if (initialized) {
        console.warn('⚠️ setupDevFeatures ya fue ejecutado');
        return;
    }
    initialized = true;

    console.log('🟢 Mizu Coder: Inicializando funcionalidades de desarrollo...');

    // --- 1. Restaurar pestañas guardadas (una sola vez) ---
    restoreSavedTabs(app);

    // --- 2. Botón "+" para nuevas pestañas ---
    const addTabBtn = document.getElementById('addTabBtn');
    if (addTabBtn) {
        addTabBtn.addEventListener('click', () => {
            const typeInput = prompt('¿Qué tipo de pestaña? (js/css)', 'js')?.trim();

            if (!typeInput) {
                console.log('❌ Mizu Coder: Creación cancelada o vacía');
                return;
            }

            const type = typeInput.toLowerCase();
            if (type !== 'js' && type !== 'css') {
                alert('❌ Tipo inválido. Usa "js" o "css"');
                console.warn('❌ Tipo inválido:', typeInput);
                return;
            }

            // ✅ Crear pestaña (tab-manager.js se encarga de evitar duplicados)
            createNewTab(type, app);
            console.log(`✅ Mizu Coder: Pestaña de ${type.toUpperCase()} creada`);
        });
    } else {
        console.warn('⚠️ Botón #addTabBtn no encontrado en el DOM');
    }

    // --- 3. Selector de modo ---
    const modeOptions = document.querySelectorAll('.mode-option');
    if (modeOptions.length === 0) {
        console.warn('⚠️ No se encontraron opciones de modo (.mode-option)');
        return;
    }

    modeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const mode = option.dataset.mode;
            console.log(`🎯 Mizu Coder: Modo seleccionado: ${mode}`);

            if (mode === 'mizu') {
                activateMizuMode(app);
            }

            // Forzar actualización de la vista previa
            if (typeof app.updatePreview === 'function') {
                setTimeout(app.updatePreview, 100);
            }
        });
    });

    // --- 4. Activar modo Mizu si estaba guardado ---
    const savedMode = localStorage.getItem('mizu_coder_mode');
    if (savedMode === 'mizu') {
        activateMizuMode(app);
    }

    console.log('✅ Mizu Coder: Funcionalidades de desarrollo cargadas');
}

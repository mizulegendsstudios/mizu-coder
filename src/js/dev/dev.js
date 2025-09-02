// src/js/dev/dev.js
// Funcionalidades en desarrollo: pestañas dinámicas, modo Mizu, estructura del proyecto

import { createNewTab, restoreSavedTabs } from './tab-manager.js';
import { activateMizuMode } from './mode-mizu.js';
import { renderFileStructure } from './file-structure.js';

let initialized = false;

export function setupDevFeatures(app) {
    if (initialized) {
        console.warn('⚠️ setupDevFeatures ya fue ejecutado');
        return;
    }
    initialized = true;

    console.log('🟢 Mizu Coder: Inicializando funcionalidades de desarrollo...');

    // === 1. Restaurar pestañas guardadas ===
    restoreSavedTabs(app);

    // === 2. Botón "+" para nuevas pestañas ===
    const addTabBtn = document.getElementById('addTabBtn');
    if (addTabBtn) {
        addTabBtn.addEventListener('click', () => {
            const typeInput = prompt('¿Qué tipo de pestaña? (js/css)', 'js')?.trim();

            if (!typeInput) {
                console.log('❌ Mizu Coder: Creación cancelada');
                return;
            }

            const type = typeInput.toLowerCase();
            if (type !== 'js' && type !== 'css') {
                alert('❌ Tipo inválido. Usa "js" o "css"');
                console.warn('❌ Tipo inválido:', typeInput);
                return;
            }

            createNewTab(type, app);
            console.log(`✅ Mizu Coder: Pestaña de ${type.toUpperCase()} creada`);
        });
    } else {
        console.warn('⚠️ Botón #addTabBtn no encontrado');
    }

    // === 3. Selector de modo ===
    const modeOptions = document.querySelectorAll('.mode-option');
    if (modeOptions.length === 0) {
        console.warn('⚠️ No se encontraron opciones de modo');
        return;
    }

    modeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const mode = option.dataset.mode;
            console.log(`🎯 Mizu Coder: Modo seleccionado: ${mode}`);

            if (mode === 'mizu' && typeof activateMizuMode === 'function') {
                activateMizuMode(app);
            }

            if (typeof app.updatePreview === 'function') {
                setTimeout(app.updatePreview, 100);
            }
        });
    });

    // === 4. Activar modo Mizu si estaba guardado ===
    const savedMode = localStorage.getItem('mizu_coder_mode');
    if (savedMode === 'mizu') {
        activateMizuMode(app);
    }

    // === 5. Pestaña "Estructura del Proyecto" ===
    const structureTab = document.getElementById('structure-tab');
    const structureWrapper = document.getElementById('structure-wrapper');
    const structureContent = document.getElementById('structureContent');
    const refreshStructure = document.getElementById('refreshStructure');

    if (structureTab && structureWrapper && structureContent) {
        // Cambiar a pestaña Estructura
        structureTab.addEventListener('click', () => {
            [htmlTab, cssTab, jsTab, consoleTab, structureTab].forEach(t => t.classList.remove('active'));
            [htmlWrapper, cssWrapper, jsWrapper, consoleWrapper, structureWrapper].forEach(w => w.style.display = 'none');
            structureTab.classList.add('active');
            structureWrapper.style.display = 'flex';

            // Actualizar al cambiar
            updateStructure();
        });

        // Botón de actualización manual
        refreshStructure?.addEventListener('click', updateStructure);

        // Actualización automática
        setInterval(updateStructure, 3000);
    }

    // Función para actualizar la estructura
    function updateStructure() {
        if (structureContent) {
            structureContent.innerHTML = '<div class="log-entry info">Generando estructura del proyecto...</div>';
            setTimeout(() => {
                renderFileStructure(structureContent);
            }, 100);
        }
    }

    console.log('✅ Mizu Coder: Funcionalidades de desarrollo cargadas');
}

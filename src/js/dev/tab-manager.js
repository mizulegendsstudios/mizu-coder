// src/js/dev/tab-manager.js
// Gestiona pestañas dinámicas (JS/CSS) con soporte para localStorage y prevención de bucles

import { generateUniqueId } from './utils.js';

/**
 * Crea una nueva pestaña de código (JS o CSS)
 * @param {string} type - 'js' o 'css'
 * @param {object} app - Referencia a la app (para updatePreview, etc.)
 */
export function createNewTab(type, app) {
    const id = `${type}-tab-${generateUniqueId()}`;
    const label = type === 'js' ? 'JS Extra' : 'CSS Extra';

    // Evitar IDs duplicados
    if (document.getElementById(`${id}-wrapper`)) {
        console.warn(`[Mizu Coder] Pestaña con ID duplicado: ${id}`);
        return;
    }

    // === 1. Crear el botón de pestaña ===
    const tabButton = document.createElement('button');
    tabButton.className = 'tab-button';
    tabButton.id = `${id}-button`;
    tabButton.dataset.type = type;
    tabButton.dataset.id = id;
    tabButton.textContent = label;

    // Cambiar a esta pestaña al hacer clic
    tabButton.addEventListener('click', () => {
        switchToTab(id, type);
    });

    // === 2. Crear el wrapper del editor ===
    const editorWrapper = document.createElement('div');
    editorWrapper.className = 'editor-wrapper';
    editorWrapper.id = `${id}-wrapper`;
    editorWrapper.style.display = 'none';

    // === 3. Números de línea ===
    const lineNumbersDiv = document.createElement('div');
    lineNumbersDiv.className = 'line-numbers';
    lineNumbersDiv.id = `${id}-line-numbers`;
    lineNumbersDiv.innerHTML = '1';

    // === 4. Editor de texto ===
    const editor = document.createElement('textarea');
    editor.className = 'editor';
    editor.dataset.id = id;
    editor.placeholder = `Escribe tu ${type.toUpperCase()} aquí...`;
    editor.value = loadTabContent(id) || '';

    // Sincronizar scroll
    editor.addEventListener('scroll', () => {
        lineNumbersDiv.scrollTop = editor.scrollTop;
    });

    // Actualizar números de línea
    const updateLines = () => {
        const lines = editor.value.split('\n');
        lineNumbersDiv.innerHTML = lines.map((_, i) => i + 1).join('<br>');
    };
    updateLines();

    editor.addEventListener('input', () => {
        updateLines();
        saveTabContent(id, editor.value);
        if (typeof app.updatePreview === 'function') {
            app.updatePreview();
        }
    });

    // === 5. Estructura final: números + editor ===
    editorWrapper.appendChild(lineNumbersDiv);
    editorWrapper.appendChild(editor);

    // === 6. Insertar en el DOM (antes del botón +) ===
    const tabsContainer = document.getElementById('tabs');
    const addTabBtn = document.getElementById('addTabBtn');
    tabsContainer.insertBefore(tabButton, addTabBtn);
    document.getElementById('editorContainer').appendChild(editorWrapper);

    // === 7. Cambiar a la nueva pestaña ===
    switchToTab(id, type);

    // === 8. Guardar estado ===
    saveTabState(id, type, label);
    console.log(`✅ Mizu Coder: Pestaña creada - ${id} (${type})`);
}

/**
 * Cambia a una pestaña específica
 * @param {string} id - ID sin sufijo
 * @param {string} type - 'js' o 'css'
 */
function switchToTab(id, type) {
    // Ocultar todos los wrappers
    document.querySelectorAll('.editor-wrapper').forEach(w => {
        w.style.display = 'none';
    });

    // Desactivar todas las pestañas
    document.querySelectorAll('.tab-button').forEach(tab => {
        tab.classList.remove('active');
    });

    // Mostrar el wrapper
    const wrapper = document.getElementById(`${id}-wrapper`);
    if (wrapper) wrapper.style.display = 'flex';

    // Activar el botón
    const button = document.getElementById(`${id}-button`);
    if (button) button.classList.add('active');

    console.log(`🟢 Mizu Coder: Cambiado a pestaña ${id}`);
}

/**
 * Guarda el contenido de una pestaña
 * @param {string} id
 * @param {string} content
 */
function saveTabContent(id, content) {
    try {
        localStorage.setItem(`mizu_coder_tab_${id}_content`, content);
    } catch (e) {
        console.warn(`❌ No se pudo guardar contenido de ${id}:`, e);
    }
}

/**
 * Carga el contenido de una pestaña
 * @param {string} id
 * @returns {string|null}
 */
function loadTabContent(id) {
    return localStorage.getItem(`mizu_coder_tab_${id}_content`);
}

/**
 * Guarda el estado de la pestaña
 * @param {string} id
 * @param {string} type
 * @param {string} label
 */
function saveTabState(id, type, label) {
    const savedTabs = JSON.parse(localStorage.getItem('mizu_coder_tabs') || '[]');
    if (!savedTabs.some(tab => tab.id === id)) {
        savedTabs.push({ id, type, label });
        localStorage.setItem('mizu_coder_tabs', JSON.stringify(savedTabs));
    }
}

/**
 * Restaura todas las pestañas guardadas
 * @param {object} app
 */
export function restoreSavedTabs(app) {
    if (restoreSavedTabs.hasRestored) return;
    restoreSavedTabs.hasRestored = true;

    const savedTabs = JSON.parse(localStorage.getItem('mizu_coder_tabs') || '[]');
    
    if (savedTabs.length === 0) return;

    console.log(`🔄 Mizu Coder: Restaurando ${savedTabs.length} pestañas...`);

    savedTabs.forEach(tab => {
        setTimeout(() => {
            if (!document.getElementById(`${tab.id}-wrapper`)) {
                createNewTab(tab.type, app);
            }
        }, 50);
    });
}

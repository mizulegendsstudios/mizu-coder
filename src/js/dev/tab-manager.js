// src/js/dev/tab-manager.js
// Gestión segura de pestañas dinámicas (JS/CSS) con cierre y renombrado

import { generateUniqueId } from './utils.js';
import { addCloseButton } from './close-tab.js';

// ✅ Evita múltiples inicializaciones
let tabsInitialized = false;
const createdTabIds = new Set(); // Evita duplicados

/**
 * Crea una nueva pestaña de código (JS o CSS)
 * @param {string} type - 'js' o 'css'
 * @param {object} app - Referencia a la app (para updatePreview, etc.)
 */
export function createNewTab(type = 'js', app) {
    // ✅ Validar tipo
    if (type !== 'js' && type !== 'css') {
        console.warn(`[Mizu Coder] Tipo inválido: ${type}`);
        return;
    }

    const id = `${type}-tab-${generateUniqueId()}`;

    // ✅ Evitar IDs duplicados
    if (createdTabIds.has(id)) {
        console.warn(`[Mizu Coder] ID duplicado evitado: ${id}`);
        return;
    }
    createdTabIds.add(id);

    console.log(`🆕 Mizu Coder: Creando pestaña - ${id} (${type})`);

    // === 1. Crear botón de pestaña ===
    const tabButton = document.createElement('button');
    tabButton.className = 'tab-button';
    tabButton.id = `${id}-button`;
    tabButton.dataset.id = id;
    tabButton.dataset.type = type;
    tabButton.textContent = type === 'js' ? 'JS Extra' : 'CSS Extra';

    // Cambiar a esta pestaña al hacer clic
    tabButton.addEventListener('click', () => switchToTab(id, type));

    // === 2. Doble clic para renombrar ===
    tabButton.addEventListener('dblclick', () => {
        const currentLabel = tabButton.textContent.trim().replace('×', '').trim();
        const newLabel = prompt('Nuevo nombre de la pestaña:', currentLabel);
        
        if (newLabel && newLabel.trim()) {
            const cleanLabel = newLabel.trim();
            tabButton.textContent = cleanLabel;
            
            // Recrear botón ×
            const closeBtn = tabButton.querySelector('.close-tab-btn');
            if (closeBtn) closeBtn.remove();
            addCloseButton(tabButton, id, type, app);
            
            // Actualizar estado
            updateTabState(id, cleanLabel, type);
            console.log(`✏️ Mizu Coder: Pestaña renombrada a "${cleanLabel}"`);
        }
    });

    // === 3. Añadir botón de cierre ❌ ===
    addCloseButton(tabButton, id, type, app);

    // === 4. Crear el wrapper del editor ===
    const wrapper = document.createElement('div');
    wrapper.className = 'editor-wrapper';
    wrapper.id = `${id}-wrapper`;
    wrapper.style.display = 'none';

    // === 5. Números de línea ===
    const lineNumbers = document.createElement('div');
    lineNumbers.className = 'line-numbers';
    lineNumbers.id = `${id}-line-numbers`;
    lineNumbers.innerHTML = '1';

    // === 6. Editor de texto ===
    const editor = document.createElement('textarea');
    editor.className = 'editor';
    editor.dataset.id = id;
    editor.placeholder = `Escribe tu ${type.toUpperCase()} aquí...`;

    // Sincronizar scroll
    editor.addEventListener('scroll', () => {
        lineNumbers.scrollTop = editor.scrollTop;
    });

    // Actualizar números de línea
    const updateLines = () => {
        const lines = editor.value.split('\n');
        lineNumbers.innerHTML = lines.map((_, i) => i + 1).join('<br>');
    };

    // Inicializar líneas
    updateLines();

    // Guardar y actualizar vista previa
    editor.addEventListener('input', () => {
        updateLines();
        saveTabContent(id, editor.value);
        if (typeof app?.updatePreview === 'function') {
            app.updatePreview();
        }
    });

    // === 7. Estructura final: números + editor ===
    wrapper.appendChild(lineNumbers);
    wrapper.appendChild(editor);

    // === 8. Insertar en el DOM (antes del botón +) ===
    const tabsContainer = document.getElementById('tabs');
    const addTabBtn = document.getElementById('addTabBtn');

    if (!tabsContainer || !addTabBtn) {
        console.error('❌ Mizu Coder: No se encontró #tabs o #addTabBtn');
        return;
    }

    tabsContainer.insertBefore(tabButton, addTabBtn);
    document.getElementById('editorContainer').appendChild(wrapper);

    // === 9. Cargar contenido guardado ===
    const savedContent = loadTabContent(id);
    if (savedContent) {
        editor.value = savedContent;
        updateLines();
    }

    // === 10. Cambiar a la nueva pestaña ===
    switchToTab(id, type);

    // === 11. Guardar estado en localStorage ===
    saveTabState(id, type, tabButton.textContent.trim());
}

/**
 * Cambia a una pestaña específica
 * @param {string} id - ID sin sufijo
 * @param {string} type - 'js' o 'css'
 */
function switchToTab(id, type) {
    // Ocultar todos los wrappers
    document.querySelectorAll('.editor-wrapper').forEach(w => w.style.display = 'none');
    // Desactivar todas las pestañas
    document.querySelectorAll('.tab-button').forEach(tab => tab.classList.remove('active'));

    // Mostrar el wrapper
    const wrapper = document.getElementById(`${id}-wrapper`);
    if (wrapper) wrapper.style.display = 'flex';

    // Activar el botón
    const button = document.getElementById(`${id}-button`);
    if (button) button.classList.add('active');

    console.log(`👁️ Mizu Coder: Vista cambiada a ${id}`);
}

// === Guardado en localStorage ===

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
 * Guarda el estado de la pestaña (ID, tipo, nombre)
 * @param {string} id
 * @param {string} type
 * @param {string} label
 */
function saveTabState(id, type, label) {
    const savedTabs = JSON.parse(localStorage.getItem('mizu_coder_tabs') || '[]');
    if (!savedTabs.some(tab => tab.id === id)) {
        savedTabs.push({ id, type, label });
        localStorage.setItem('mizu_coder_tabs', JSON.stringify(savedTabs));
        console.log(`💾 Mizu Coder: Pestaña guardada: ${id} (${label})`);
    }
}

/**
 * Actualiza el nombre de una pestaña en localStorage
 * @param {string} id
 * @param {string} label
 * @param {string} type
 */
function updateTabState(id, label, type) {
    const savedTabs = JSON.parse(localStorage.getItem('mizu_coder_tabs') || '[]');
    const tab = savedTabs.find(t => t.id === id);
    if (tab) {
        tab.label = label;
        tab.type = type;
        localStorage.setItem('mizu_coder_tabs', JSON.stringify(savedTabs));
    }
}

/**
 * Restaura todas las pestañas guardadas
 * @param {object} app
 */
export function restoreSavedTabs(app) {
    if (tabsInitialized) {
        console.log('🟡 Mizu Coder: restoreSavedTabs ya fue ejecutado');
        return;
    }
    tabsInitialized = true;

    const savedTabs = JSON.parse(localStorage.getItem('mizu_coder_tabs') || '[]');

    if (savedTabs.length === 0) {
        console.log('🟢 Mizu Coder: No hay pestañas guardadas');
        return;
    }

    console.log(`🔄 Mizu Coder: Restaurando ${savedTabs.length} pestañas...`);

    savedTabs.forEach(tab => {
        // ✅ Solo crear si no existe
        if (!document.getElementById(`${tab.id}-wrapper`)) {
            setTimeout(() => {
                createNewTab(tab.type, app);
                const editor = document.querySelector(`[data-id="${tab.id}"]`);
                if (editor && tab.label) {
                    const button = document.getElementById(`${tab.id}-button`);
                    if (button) {
                        button.textContent = tab.label;
                        // Recrear botón ×
                        const closeBtn = button.querySelector('.close-tab-btn');
                        if (closeBtn) closeBtn.remove();
                        addCloseButton(button, tab.id, tab.type, app);
                    }
                }
            }, 50);
        }
    });
}

// src/js/dev/tab-manager.js
// Gestiona la creación y control de pestañas dinámicas (JS/CSS)

import { generateUniqueId } from './utils.js';

/**
 * Crea una nueva pestaña de código (JS o CSS)
 * @param {string} type - 'js' o 'css'
 * @param {object} app - Referencia a la app para acceso a funciones como updatePreview
 */
export function createNewTab(type = 'js', app) {
    const id = `${type}-tab-${generateUniqueId()}`;
    const label = type === 'js' ? 'JS Extra' : 'CSS Extra';

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

    // === 3. Crear el textarea del editor ===
    const editor = document.createElement('textarea');
    editor.className = 'editor';
    editor.dataset.id = id;
    editor.placeholder = `Escribe tu ${type.toUpperCase()} aquí...`;
    editor.value = ''; // Puedes cargar desde localStorage si existe

    // Añadir eventos para actualización
    editor.addEventListener('input', () => {
        if (typeof app.updatePreview === 'function') {
            app.updatePreview();
        }
        saveTabContent(id, editor.value);
    });

    // Sincronizar scroll con números de línea
    const lineNumbersId = `${id}-line-numbers`;
    const lineNumbersDiv = document.createElement('div');
    lineNumbersDiv.className = 'line-numbers';
    lineNumbersDiv.id = lineNumbersId;
    lineNumbersDiv.innerHTML = '1';

    editor.addEventListener('scroll', () => {
        lineNumbersDiv.scrollTop = editor.scrollTop;
    });

    editor.addEventListener('input', () => {
        updateLineNumbers(editor, lineNumbersDiv);
    });

    // Actualizar números al inicio
    updateLineNumbers(editor, lineNumbersDiv);

    // === 4. Estructura final del wrapper: números + editor ===
    editorWrapper.appendChild(lineNumbersDiv);
    editorWrapper.appendChild(editor);

    // === 5. Insertar en el DOM ===
    const tabsContainer = document.getElementById('tabs');
    const container = document.getElementById('editorContainer');

    // Insertar antes del botón "+"
    const addTabBtn = document.getElementById('addTabBtn');
    tabsContainer.insertBefore(tabButton, addTabBtn);

    container.appendChild(editorWrapper);

    // === 6. Cargar contenido previo si existe ===
    const saved = loadTabContent(id);
    if (saved) {
        editor.value = saved;
        updateLineNumbers(editor, lineNumbersDiv);
    }

    // === 7. Cambiar a la nueva pestaña ===
    switchToTab(id, type);

    // === 8. Guardar estado de pestañas ===
    saveTabState(id, type, label);
    console.log(`[Mizu Coder] Pestaña creada: ${id} (${type})`);

    return { tabButton, editorWrapper, editor };
}

/**
 * Cambia a una pestaña específica
 * @param {string} id - ID de la pestaña (sin sufijo)
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

    // Mostrar el wrapper correcto
    const wrapper = document.getElementById(`${id}-wrapper`);
    if (wrapper) wrapper.style.display = 'flex';

    // Activar el botón
    const button = document.getElementById(`${id}-button`);
    if (button) button.classList.add('active');

    // Actualizar pestaña activa
    if (type === 'js') {
        window.activeTab = 'js';
    } else if (type === 'css') {
        window.activeTab = 'css';
    }

    console.log(`[Mizu Coder] Cambiado a pestaña: ${id}`);
}

/**
 * Actualiza los números de línea
 * @param {HTMLTextAreaElement} textarea
 * @param {HTMLDivElement} lineNumbersDiv
 */
function updateLineNumbers(textarea, lineNumbersDiv) {
    const lines = textarea.value.split('\n');
    lineNumbersDiv.innerHTML = lines.map((_, index) => index + 1).join('<br>');
}

/**
 * Guarda el contenido de una pestaña en localStorage
 * @param {string} id
 * @param {string} content
 */
function saveTabContent(id, content) {
    try {
        localStorage.setItem(`mizu_coder_tab_${id}_content`, content);
    } catch (e) {
        console.warn('No se pudo guardar el contenido de la pestaña:', e);
    }
}

/**
 * Carga el contenido de una pestaña desde localStorage
 * @param {string} id
 * @returns {string|null}
 */
function loadTabContent(id) {
    return localStorage.getItem(`mizu_coder_tab_${id}_content`);
}

/**
 * Guarda el estado de la pestaña (tipo, etiqueta)
 * @param {string} id
 * @param {string} type
 * @param {string} label
 */
function saveTabState(id, type, label) {
    const savedTabs = JSON.parse(localStorage.getItem('mizu_coder_tabs') || '[]');
    savedTabs.push({ id, type, label });
    localStorage.setItem('mizu_coder_tabs', JSON.stringify(savedTabs));
}

/**
 * Carga todas las pestañas guardadas al iniciar
 * @param {object} app
 */
export function restoreSavedTabs(app) {
    const savedTabs = JSON.parse(localStorage.getItem('mizu_coder_tabs') || '[]');
    savedTabs.forEach(tab => {
        setTimeout(() => {
            // Verificar que no exista ya
            if (!document.getElementById(`${tab.id}-wrapper`)) {
                createNewTab(tab.type, app);
                const editor = document.querySelector(`[data-id="${tab.id}"]`);
                if (editor) {
                    const savedContent = loadTabContent(tab.id);
                    if (savedContent) {
                        editor.value = savedContent;
                        updateLineNumbers(editor, document.getElementById(`${tab.id}-line-numbers`));
                    }
                }
            }
        }, 100); // Pequeño retraso para evitar conflictos
    });
}

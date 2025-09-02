// src/js/dev/tab-manager.js
// Gestión segura de pestañas dinámicas (JS/CSS)

import { generateUniqueId } from './utils.js';

// ✅ Evita múltiples restauraciones
let tabsRestored = false;
const createdTabIds = new Set(); // ✅ Evita pestañas duplicadas

export function createNewTab(type = 'js', app) {
    // ✅ Validar tipo
    if (type !== 'js' && type !== 'css') {
        console.warn(`[Mizu Coder] Tipo no soportado: ${type}`);
        return;
    }

    const id = `${type}-tab-${generateUniqueId()}`;

    // ✅ Evitar IDs duplicados
    if (createdTabIds.has(id)) {
        console.warn(`[Mizu Coder] ID duplicado bloqueado: ${id}`);
        return;
    }
    createdTabIds.add(id);

    console.log(`🆕 Mizu Coder: Creando pestaña - ${id} (${type})`);

    // === 1. Botón de pestaña ===
    const tabButton = document.createElement('button');
    tabButton.className = 'tab-button';
    tabButton.id = `${id}-button`;
    tabButton.dataset.id = id;
    tabButton.dataset.type = type;
    tabButton.textContent = type === 'js' ? 'JS Extra' : 'CSS Extra';

    tabButton.addEventListener('click', () => switchToTab(id, type));

    // === 2. Wrapper del editor ===
    const wrapper = document.createElement('div');
    wrapper.className = 'editor-wrapper';
    wrapper.id = `${id}-wrapper`;
    wrapper.style.display = 'none';

    // Números de línea
    const lineNumbers = document.createElement('div');
    lineNumbers.className = 'line-numbers';
    lineNumbers.id = `${id}-line-numbers`;
    lineNumbers.innerHTML = '1';

    // Editor
    const editor = document.createElement('textarea');
    editor.className = 'editor';
    editor.dataset.id = id;
    editor.placeholder = `Escribe tu ${type.toUpperCase()} aquí...`;

    // Sincronizar scroll
    editor.addEventListener('scroll', () => {
        lineNumbers.scrollTop = editor.scrollTop;
    });

    // Actualizar líneas y guardar
    const updateLines = () => {
        const lines = editor.value.split('\n');
        lineNumbers.innerHTML = lines.map((_, i) => i + 1).join('<br>');
    };

    editor.addEventListener('input', () => {
        updateLines();
        saveTabContent(id, editor.value);
        if (typeof app.updatePreview === 'function') {
            app.updatePreview();
        }
    });

    // Estructura final
    wrapper.appendChild(lineNumbers);
    wrapper.appendChild(editor);

    // === 3. Insertar en el DOM ===
    const tabsContainer = document.getElementById('tabs');
    const addTabBtn = document.getElementById('addTabBtn');

    if (!tabsContainer || !addTabBtn) {
        console.error('❌ Mizu Coder: No se encontró #tabs o #addTabBtn');
        return;
    }

    tabsContainer.insertBefore(tabButton, addTabBtn);
    document.getElementById('editorContainer').appendChild(wrapper);

    // === 4. Cargar contenido guardado ===
    const savedContent = loadTabContent(id);
    if (savedContent) {
        editor.value = savedContent;
        updateLines();
    }

    // === 5. Cambiar a la nueva pestaña ===
    switchToTab(id, type);

    // === 6. Guardar estado ===
    saveTabState(id, type);
}

function switchToTab(id, type) {
    document.querySelectorAll('.editor-wrapper').forEach(w => w.style.display = 'none');
    document.querySelectorAll('.tab-button').forEach(t => t.classList.remove('active'));

    const wrapper = document.getElementById(`${id}-wrapper`);
    const button = document.getElementById(`${id}-button`);

    if (wrapper) wrapper.style.display = 'flex';
    if (button) button.classList.add('active');

    console.log(`👁️ Mizu Coder: Vista cambiada a ${id}`);
}

// === Guardado en localStorage ===
function saveTabContent(id, content) {
    try {
        localStorage.setItem(`mizu_coder_tab_${id}_content`, content);
    } catch (e) {
        console.warn(`❌ No se pudo guardar ${id}:`, e);
    }
}

function loadTabContent(id) {
    return localStorage.getItem(`mizu_coder_tab_${id}_content`);
}

function saveTabState(id, type) {
    const savedTabs = JSON.parse(localStorage.getItem('mizu_coder_tabs') || '[]');
    if (!savedTabs.some(tab => tab.id === id)) {
        savedTabs.push({ id, type });
        localStorage.setItem('mizu_coder_tabs', JSON.stringify(savedTabs));
        console.log(`💾 Mizu Coder: Estado de pestaña guardado: ${id}`);
    }
}

// ✅ Restaurar pestañas (una sola vez)
export function restoreSavedTabs(app) {
    if (tabsRestored) {
        console.log('🟡 Mizu Coder: Pestañas ya restauradas');
        return;
    }
    tabsRestored = true;

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
            }, 50);
        }
    });
}

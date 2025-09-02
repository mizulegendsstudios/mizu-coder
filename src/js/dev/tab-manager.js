// src/js/dev/tab-manager.js
import { generateUniqueId } from './utils.js';

// ✅ Única instancia permitida
if (window.__MIZU_TAB_MANAGER__) {
    console.warn('⚠️ tab-manager.js ya fue cargado');
    export {};
    return;
}
window.__MIZU_TAB_MANAGER__ = true;

const createdTabIds = new Set();

export function createNewTab(type = 'js', app) {
    if (type !== 'js' && type !== 'css') {
        console.warn(`❌ Tipo inválido: ${type}`);
        return;
    }

    const id = `${type}-tab-${generateUniqueId()}`;

    if (createdTabIds.has(id)) {
        console.warn(`❌ ID duplicado: ${id}`);
        return;
    }

    createdTabIds.add(id);

    console.log(`🆕 Mizu Coder: Creando pestaña: ${id}`);

    const tabButton = document.createElement('button');
    tabButton.className = 'tab-button';
    tabButton.id = `${id}-button`;
    tabButton.dataset.id = id;
    tabButton.dataset.type = type;
    tabButton.textContent = type === 'js' ? 'JS Extra' : 'CSS Extra';

    tabButton.addEventListener('click', () => switchToTab(id, type));

    const wrapper = document.createElement('div');
    wrapper.className = 'editor-wrapper';
    wrapper.id = `${id}-wrapper`;
    wrapper.style.display = 'none';

    const lineNumbers = document.createElement('div');
    lineNumbers.className = 'line-numbers';
    lineNumbers.id = `${id}-line-numbers`;
    lineNumbers.innerHTML = '1';

    const editor = document.createElement('textarea');
    editor.className = 'editor';
    editor.dataset.id = id;
    editor.placeholder = `Escribe tu ${type.toUpperCase()} aquí...`;

    editor.addEventListener('scroll', () => {
        lineNumbers.scrollTop = editor.scrollTop;
    });

    const updateLines = () => {
        const lines = editor.value.split('\n');
        lineNumbers.innerHTML = lines.map((_, i) => i + 1).join('<br>');
    };

    editor.addEventListener('input', () => {
        updateLines();
        saveTabContent(id, editor.value);
        if (typeof app?.updatePreview === 'function') {
            app.updatePreview();
        }
    });

    wrapper.appendChild(lineNumbers);
    wrapper.appendChild(editor);

    const tabsContainer = document.getElementById('tabs');
    const addTabBtn = document.getElementById('addTabBtn');

    if (!tabsContainer || !addTabBtn) {
        console.error('❌ No se encontró #tabs o #addTabBtn');
        return;
    }

    tabsContainer.insertBefore(tabButton, addTabBtn);
    document.getElementById('editorContainer').appendChild(wrapper);

    // ✅ Cargar contenido guardado
    const saved = loadTabContent(id);
    if (saved) {
        editor.value = saved;
        updateLines();
    }

    switchToTab(id, type);
    saveTabState(id, type);
}

function switchToTab(id, type) {
    document.querySelectorAll('.editor-wrapper').forEach(w => w.style.display = 'none');
    document.querySelectorAll('.tab-button').forEach(t => t.classList.remove('active'));

    const wrapper = document.getElementById(`${id}-wrapper`);
    const button = document.getElementById(`${id}-button`);

    if (wrapper) wrapper.style.display = 'flex';
    if (button) button.classList.add('active');
}

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
    }
}

export function restoreSavedTabs(app) {
    if (window.__RESTORED__) return;
    window.__RESTORED__ = true;

    const savedTabs = JSON.parse(localStorage.getItem('mizu_coder_tabs') || '[]');
    if (savedTabs.length === 0) return;

    console.log(`🔄 Restaurando ${savedTabs.length} pestañas...`);
    savedTabs.forEach(tab => {
        if (!document.getElementById(`${tab.id}-wrapper`)) {
            setTimeout(() => createNewTab(tab.type, app), 50);
        }
    });
}

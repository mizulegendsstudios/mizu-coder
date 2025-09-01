// src/js/core.js
console.log('Mizu Coder v2.0 - JavaScript cargado');

// Variables globales
let editorInstances = {};
let currentLanguage = 'html';
let autoSaveInterval;

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM completamente cargado');
    initializeEditors();
    loadSavedCode();
    setupEventListeners();
    startAutoSave();
});

// Función para inicializar los editores de código
function initializeEditors() {
    // Configuración de CodeMirror o textarea personalizado
    editorInstances.html = document.getElementById('htmlEditor');
    editorInstances.css = document.getElementById('cssEditor');
    editorInstances.js = document.getElementById('jsEditor');
    
    // Agregar listeners para actualización en tiempo real
    Object.keys(editorInstances).forEach(lang => {
        editorInstances[lang].addEventListener('input', debounce(updatePreview, 300));
    });
}

// Cargar código guardado desde localStorage
function loadSavedCode() {
    const savedHTML = localStorage.getItem('mizu_html') || '';
    const savedCSS = localStorage.getItem('mizu_css') || '';
    const savedJS = localStorage.getItem('mizu_js') || '';
    
    if (editorInstances.html) editorInstances.html.value = savedHTML;
    if (editorInstances.css) editorInstances.css.value = savedCSS;
    if (editorInstances.js) editorInstances.js.value = savedJS;
    
    updatePreview();
}

// Actualizar la vista previa del iframe
function updatePreview() {
    const html = editorInstances.html?.value || '';
    const css = editorInstances.css?.value || '';
    const js = editorInstances.js?.value || '';
    
    const preview = document.getElementById('previewFrame');
    const previewDoc = preview.contentDocument || preview.contentWindow.document;
    
    // Construir el documento completo
    const fullHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>${css}</style>
        </head>
        <body>
            ${html}
            <script>
                try {
                    ${js}
                } catch(e) {
                    console.error('Error en JavaScript:', e);
                }
            <\/script>
        </body>
        </html>
    `;
    
    previewDoc.open();
    previewDoc.write(fullHTML);
    previewDoc.close();
}

// Configurar listeners de eventos
function setupEventListeners() {
    // Tabs
    document.querySelectorAll('.tab-button').forEach(tab => {
        tab.addEventListener('click', handleTabSwitch);
    });
    
    // Botones de acción
    document.getElementById('exportButton')?.addEventListener('click', exportCode);
    document.getElementById('resetButton')?.addEventListener('click', resetCode);
    
    // Redimensionamiento
    const resizer = document.getElementById('resizerSlider');
    resizer?.addEventListener('input', handleResize);
}

// Cambiar entre pestañas
function handleTabSwitch(event) {
    const targetTab = event.target.dataset.tab || 'html';
    currentLanguage = targetTab;
    
    // Actualizar UI
    document.querySelectorAll('.tab-button').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.editor-wrapper').forEach(w => w.style.display = 'none');
    
    event.target.classList.add('active');
    document.getElementById(`${targetTab}-editor-wrapper`).style.display = 'flex';
}

// Función para exportar código
function exportCode() {
    const code = editorInstances[currentLanguage]?.value || '';
    const blob = new Blob([code], { type: getMimeType(currentLanguage) });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `mizu_${currentLanguage}_export.${currentLanguage}`;
    a.click();
    
    URL.revokeObjectURL(url);
}

// Reiniciar el código actual
function resetCode() {
    if (confirm('¿Estás seguro de que quieres reiniciar el código actual?')) {
        editorInstances[currentLanguage].value = '';
        updatePreview();
        saveToLocalStorage();
    }
}

// Función para redimensionar paneles
function handleResize(event) {
    const percentage = event.target.value;
    const editorContainer = document.getElementById('editorContainer');
    const previewContainer = document.getElementById('previewContainer');
    
    if (window.innerWidth >= 768) {
        editorContainer.style.width = `${percentage}%`;
        previewContainer.style.width = `${100 - percentage}%`;
    } else {
        editorContainer.style.height = `${percentage}%`;
        previewContainer.style.height = `${100 - percentage}%`;
    }
}

// Auto-guardado cada 2 segundos
function startAutoSave() {
    autoSaveInterval = setInterval(saveToLocalStorage, 2000);
}

function saveToLocalStorage() {
    Object.keys(editorInstances).forEach(lang => {
        const code = editorInstances[lang]?.value || '';
        localStorage.setItem(`mizu_${lang}`, code);
    });
}

// Utilidades
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

function getMimeType(language) {
    const types = {
        html: 'text/html',
        css: 'text/css',
        js: 'application/javascript'
    };
    return types[language] || 'text/plain';
}

// Manejo de errores global
window.addEventListener('error', function(e) {
    console.error('Error global:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Promesa rechazada no manejada:', e.reason);
});

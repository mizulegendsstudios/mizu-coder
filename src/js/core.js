// src/js/core.js - Mizu Coder con consola funcional
console.log('Mizu Coder v2.1 - Consola integrada');

// Variables globales
let activeTab = 'html';
let unifiedMode = false;
let consoleBuffer = [];

// Referencias DOM (definidas globalmente)
let htmlEditor, cssEditor, jsEditor, previewFrame, consoleContent, consoleTab;
let htmlTab, cssTab, jsTab, clearConsoleBtn;

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();
    loadFromLocalStorage();
    updatePreview();
    updateAllLineNumbers();
});

// Obtener referencias a elementos DOM
function initializeElements() {
    htmlEditor = document.getElementById('htmlEditor');
    cssEditor = document.getElementById('cssEditor');
    jsEditor = document.getElementById('jsEditor');
    previewFrame = document.getElementById('previewFrame');
    consoleContent = document.getElementById('consoleContent');
    
    htmlTab = document.getElementById('html-tab');
    cssTab = document.getElementById('css-tab');
    jsTab = document.getElementById('js-tab');
    consoleTab = document.getElementById('console-tab');
    clearConsoleBtn = document.getElementById('clearConsole');
}

// Configurar todos los event listeners
function setupEventListeners() {
    // Eventos de entrada en editores
    htmlEditor.addEventListener('input', () => handleInput('html'));
    cssEditor.addEventListener('input', () => handleInput('css'));
    jsEditor.addEventListener('input', () => handleInput('js'));
    
    // Scroll sincronizado para números de línea
    htmlEditor.addEventListener('scroll', () => syncScroll(htmlEditor, 'html-line-numbers'));
    cssEditor.addEventListener('scroll', () => syncScroll(cssEditor, 'css-line-numbers'));
    jsEditor.addEventListener('scroll', () => syncScroll(jsEditor, 'js-line-numbers'));
    
    // Cambio de pestañas
    htmlTab.addEventListener('click', () => switchTab('html'));
    cssTab.addEventListener('click', () => switchTab('css'));
    jsTab.addEventListener('click', () => switchTab('js'));
    consoleTab.addEventListener('click', () => switchTab('console'));
    
    // Consola
    clearConsoleBtn.addEventListener('click', clearConsole);
    
    // Otros controles
    document.getElementById('exportButton').addEventListener('click', exportCode);
    document.getElementById('resetButton').addEventListener('click', resetPreview);
    document.getElementById('unifiedModeToggle').addEventListener('change', toggleUnifiedMode);
    document.getElementById('resizerSlider').addEventListener('input', handleResize);
}

// Función principal para actualizar la vista previa
function updatePreview() {
    const htmlCode = htmlEditor.value;
    const cssCode = cssEditor.value;
    const jsCode = jsEditor.value;
    
    const previewDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
    const previewWindow = previewFrame.contentWindow;
    
    try {
        // Crear documento completo
        const fullDocument = createFullDocument(htmlCode, cssCode, jsCode);
        
        previewDoc.open();
        previewDoc.write(fullDocument);
        previewDoc.close();
        
        // Configurar la consola después de que se cargue
        setTimeout(() => {
            setupConsoleInFrame(previewWindow);
            document.getElementById('debugInfo').textContent = "Estado: Listo";
        }, 100);
        
    } catch (error) {
        console.error("Error al actualizar preview:", error);
        document.getElementById('debugInfo').textContent = "Error: " + error.message;
    }
}

// Crear documento HTML completo
function createFullDocument(html, css, js) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>${css}</style>
        </head>
        <body>
            ${html}
            <script>
                // Redirigir console al padre
                const originalConsole = window.console;
                window.console = {
                    log: function(...args) {
                        window.parent.postMessage({type: 'console', method: 'log', args: args}, '*');
                        originalConsole.log.apply(originalConsole, args);
                    },
                    warn: function(...args) {
                        window.parent.postMessage({type: 'console', method: 'warn', args: args}, '*');
                        originalConsole.warn.apply(originalConsole, args);
                    },
                    error: function(...args) {
                        window.parent.postMessage({type: 'console', method: 'error', args: args}, '*');
                        originalConsole.error.apply(originalConsole, args);
                    }
                };
                
                // Capturar errores globales
                window.addEventListener('error', function(e) {
                    window.parent.postMessage({type: 'console', method: 'error', args: ['Error: ' + e.message + ' en ' + e.filename + ':' + e.lineno]}, '*');
                });
                
                // Ejecutar código JavaScript del usuario
                try {
                    ${js}
                } catch(e) {
                    console.error('Error en tu código: ' + e.message);
                }
            <\/script>
        </body>
        </html>
    `;
}

// Escuchar mensajes de la consola desde el iframe
function setupConsoleInFrame(previewWindow) {
    window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'console') {
            event.data.args.forEach(arg => {
                addConsoleMessage(arg, event.data.method);
            });
        }
    });
}

// Agregar mensaje a la consola
function addConsoleMessage(message, type = 'info') {
    const logEntry = document.createElement('div');
    logEntry.classList.add('log-entry', type);
    
    let formattedMessage = message;
    if (typeof message === 'object') {
        try {
            formattedMessage = JSON.stringify(message, null, 2);
        } catch (e) {
            formattedMessage = String(message);
        }
    }
    
    logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${formattedMessage}`;
    consoleContent.appendChild(logEntry);
    
    // Auto-scroll
    consoleContent.scrollTop = consoleContent.scrollHeight;
    
    // Indicador visual en la pestaña
    if (activeTab !== 'console') {
        consoleTab.style.color = '#ef4444';
        consoleTab.innerHTML = 'Consola <span style="color:#ef4444;font-size:0.7em;">●</span>';
    }
}

// Limpiar consola
function clearConsole() {
    consoleContent.innerHTML = '';
    addConsoleMessage('Consola limpiada.', 'info');
    consoleTab.style.color = '#9ca3af';
    consoleTab.innerHTML = 'Consola';
}

// Manejar entrada en editores
function handleInput(language) {
    updateLineNumbers(document.getElementById(`${language}Editor`), `${language}-line-numbers`);
    updatePreview();
    document.getElementById('saveIndicator').textContent = 'Guardando...';
}

// Actualizar números de línea
function updateLineNumbers(textarea, lineNumbersId) {
    const lines = textarea.value.split('\n');
    const lineNumbersDiv = document.getElementById(lineNumbersId);
    if (lineNumbersDiv) {
        lineNumbersDiv.innerHTML = lines.map((_, index) => index + 1).join('<br>');
    }
}

// Actualizar todos los números de línea
function updateAllLineNumbers() {
    updateLineNumbers(htmlEditor, 'html-line-numbers');
    updateLineNumbers(cssEditor, 'css-line-numbers');
    updateLineNumbers(jsEditor, 'js-line-numbers');
}

// Sincronizar scroll
function syncScroll(editor, lineNumbersId) {
    const lineNumbers = document.getElementById(lineNumbersId);
    if (lineNumbers) {
        lineNumbers.scrollTop = editor.scrollTop;
    }
}

// Cambiar entre pestañas
function switchTab(tabName) {
    const tabs = ['html', 'css', 'js', 'console'];
    tabs.forEach(tab => {
        document.getElementById(`${tab}-tab`).classList.remove('active');
        document.getElementById(`${tab}-editor-wrapper`).style.display = 'none';
        if (tab === 'console') {
            document.getElementById('console-wrapper').style.display = 'none';
        }
    });
    
    if (tabName === 'console') {
        document.getElementById('console-wrapper').style.display = 'flex';
        document.getElementById('console-tab').classList.add('active');
    } else {
        document.getElementById(`${tabName}-editor-wrapper`).style.display = 'flex';
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }
    
    activeTab = tabName;
}

// Exportar código
function exportCode() {
    const extensions = { html: 'html', css: 'css', js: 'js', console: 'txt' };
    const mimes = { html: 'text/html', css: 'text/css', js: 'application/javascript', console: 'text/plain' };
    
    let code = '';
    if (activeTab === 'console') {
        code = document.getElementById('consoleContent').innerText;
    } else {
        code = document.getElementById(`${activeTab}Editor`).value;
    }
    
    const blob = new Blob([code], { type: mimes[activeTab] });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mizu_export_${activeTab}.${extensions[activeTab]}`;
    a.click();
    URL.revokeObjectURL(url);
}

// Reiniciar preview
function resetPreview() {
    updatePreview();
}

// Toggle modo unificado
function toggleUnifiedMode() {
    unifiedMode = document.getElementById('unifiedModeToggle').checked;
    updatePreview();
}

// Redimensionar
function handleResize(e) {
    const value = e.target.value;
    const isMobile = window.innerWidth < 768;
    
    if (!isMobile) {
        document.getElementById('editorContainer').style.width = `${value}%`;
        document.getElementById('previewContainer').style.width = `${100 - value}%`;
    } else {
        document.getElementById('editorContainer').style.height = `${value}%`;
        document.getElementById('previewContainer').style.height = `${100 - value}%`;
    }
}

// Guardar y cargar desde localStorage
function saveToLocalStorage() {
    localStorage.setItem('mizu_html', htmlEditor.value);
    localStorage.setItem('mizu_css', cssEditor.value);
    localStorage.setItem('mizu_js', jsEditor.value);
    localStorage.setItem('mizu_unified_mode', unifiedMode);
    document.getElementById('saveIndicator').textContent = 'Guardado';
}

function loadFromLocalStorage() {
    htmlEditor.value = localStorage.getItem('mizu_html') || '';
    cssEditor.value = localStorage.getItem('mizu_css') || '';
    jsEditor.value = localStorage.getItem('mizu_js') || '';
    unifiedMode = localStorage.getItem('mizu_unified_mode') === 'true';
    if (document.getElementById('unifiedModeToggle')) {
        document.getElementById('unifiedModeToggle').checked = unifiedMode;
    }
}

// Auto-save cada 2 segundos
setInterval(saveToLocalStorage, 20000);

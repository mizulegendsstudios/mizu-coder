// src/js/core.js

// Obtener los elementos del DOM
const htmlEditor = document.getElementById('htmlEditor');
const cssEditor = document.getElementById('cssEditor');
const jsEditor = document.getElementById('jsEditor');
const previewFrame = document.getElementById('previewFrame');
const editorContainer = document.getElementById('editorContainer');
const previewContainer = document.getElementById('previewContainer');
const container = document.querySelector('.container');
const resizerSlider = document.getElementById('resizerSlider');
const exportButton = document.getElementById('exportButton');
const resetButton = document.getElementById('resetButton');
const saveIndicator = document.getElementById('saveIndicator');
const resizer = document.getElementById('resizer');
const debugInfo = document.getElementById('debugInfo');
const unifiedModeToggle = document.getElementById('unifiedModeToggle');
const consoleContent = document.getElementById('consoleContent');
const clearConsoleBtn = document.getElementById('clearConsole');

const htmlTab = document.getElementById('html-tab');
const cssTab = document.getElementById('css-tab');
const jsTab = document.getElementById('js-tab');
const consoleTab = document.getElementById('console-tab');

const htmlWrapper = document.getElementById('html-editor-wrapper');
const cssWrapper = document.getElementById('css-editor-wrapper');
const jsWrapper = document.getElementById('js-editor-wrapper');
const consoleWrapper = document.getElementById('console-wrapper');

const htmlLineNumbers = document.getElementById('html-line-numbers');
const cssLineNumbers = document.getElementById('css-line-numbers');
const jsLineNumbers = document.getElementById('js-line-numbers');

// Almacena la pestaña activa
let activeTab = 'html';
let unifiedMode = false;

// Nombres para las claves de localStorage
const storageKeys = {
    html: 'mizu_coder_html',
    css: 'mizu_coder_css',
    js: 'mizu_coder_js',
    unifiedMode: 'mizu_coder_unified_mode'
};

// Contenido inicial
const initialHTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Proyecto</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
            color: #333;
        }
        h1 { color: #2563eb; }
        .card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        button {
            background-color: #3b82f6;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin: 5px;
        }
        button:hover { background-color: #2563eb; }
    </style>
</head>
<body>
    <div class="card">
        <h1>¡Bienvenido a Mizu Coder!</h1>
        <p>Escribe tu código HTML, CSS y JavaScript en las pestañas correspondientes.</p>
        <button onclick="mostrarMensaje()">Haz clic aquí</button>
        <button id="botonJs">Otro botón con JS</button>
        <p id="contador">Contador: 0</p>
    </div>
    
    <script>
        console.log('¡Documento cargado y listo!');
        console.warn('Esta es una advertencia de ejemplo');
        console.error('Este es un error de ejemplo');
        
        document.addEventListener('DOMContentLoaded', function() {
            const botonJs = document.getElementById('botonJs');
            const contador = document.getElementById('contador');
            let count = 0;
            
            botonJs.addEventListener('click', function() {
                count++;
                contador.textContent = 'Contador: ' + count;
                this.textContent = 'Clickeado ' + count + ' veces';
                console.log('Botón clickeado ' + count + ' veces');
            });
        });

        function mostrarMensaje() {
            const ahora = new Date();
            alert('Hora actual: ' + ahora.toLocaleTimeString());
        }
    <\/script>
</body>
</html>`;

const initialCSS = `/* Estilos personalizados */
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
}
`;

const initialJS = `// JavaScript inicial
console.log('¡JavaScript cargado!');

document.addEventListener('DOMContentLoaded', function() {
    const botonJs = document.getElementById('botonJs');
    const contador = document.getElementById('contador');
    let count = 0;

    botonJs.addEventListener('click', function() {
        count++;
        contador.textContent = 'Contador: ' + count;
        this.textContent = 'Clickeado ' + count + ' veces';
        console.log('Botón clickeado ' + count + ' veces');
    });
});

// Función de ejemplo
function mostrarMensaje() {
    const ahora = new Date();
    alert('Hora actual: ' + ahora.toLocaleTimeString());
}
`;

// Actualizar números de línea
const updateLineNumbers = (textarea, lineNumbersDiv) => {
    const lines = textarea.value.split('\n');
    lineNumbersDiv.innerHTML = lines.map((_, index) => index + 1).join('<br>');
};

// Verificar si el HTML está completo
const isCompleteHTML = (html) => {
    return html.includes('<!DOCTYPE') || html.includes('<html') || html.includes('<head');
};

// Extraer CSS y JS del HTML completo
const extractFromCompleteHTML = (html) => {
    let css = '';
    let js = '';
    let pureHTML = html;

    const styleRegex = /<style([^>]*)>([\s\S]*?)<\/style>/gi;
    let match;
    while ((match = styleRegex.exec(html)) !== null) {
        css += match[2] + '\n';
        pureHTML = pureHTML.replace(match[0], '');
    }

    const scriptRegex = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
    while ((match = scriptRegex.exec(html)) !== null) {
        if (!match[1].includes('src=')) {
            js += match[2] + '\n';
            pureHTML = pureHTML.replace(match[0], '');
        }
    }
    return { html: pureHTML, css, js };
};

// Consola personalizada
const addConsoleMessage = (message, type = 'info') => {
    const logEntry = document.createElement('div');
    logEntry.classList.add('log-entry', type);
    let formattedMessage = message;
    if (typeof message === 'object') {
        try { formattedMessage = JSON.stringify(message, null, 2); }
        catch { formattedMessage = String(message); }
    }
    logEntry.textContent = formattedMessage;
    consoleContent.appendChild(logEntry);
    consoleContent.scrollTop = consoleContent.scrollHeight;

    if (activeTab !== 'console') {
        consoleTab.style.color = '#ef4444';
        consoleTab.innerHTML = 'Consola <span style="color:#ef4444;font-size:0.7em;">●</span>';
    }
};

const clearConsole = () => {
    consoleContent.innerHTML = '';
    addConsoleMessage('Consola limpiada.', 'info');
    consoleTab.style.color = '#9ca3af';
    consoleTab.innerHTML = 'Consola';
};

const overrideConsole = (previewWindow) => {
    if (!previewWindow) return;
    const originalLog = previewWindow.console.log;
    const originalWarn = previewWindow.console.warn;
    const originalError = previewWindow.console.error;

    previewWindow.console.log = (...args) => {
        originalLog.apply(previewWindow.console, args);
        args.forEach(arg => addConsoleMessage(arg, 'info'));
    };
    previewWindow.console.warn = (...args) => {
        originalWarn.apply(previewWindow.console, args);
        args.forEach(arg => addConsoleMessage(arg, 'warn'));
    };
    previewWindow.console.error = (...args) => {
        originalError.apply(previewWindow.console, args);
        args.forEach(arg => addConsoleMessage(arg, 'error'));
    };
};

// Actualizar vista previa
const updatePreview = () => {
    const htmlCode = htmlEditor.value;
    const cssCode = cssEditor.value;
    const jsCode = jsEditor.value;
    const previewDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
    const previewWindow = previewFrame.contentWindow;

    try {
        debugInfo.textContent = "Actualizando preview...";
        if (unifiedMode && isCompleteHTML(htmlCode)) {
            const extracted = extractFromCompleteHTML(htmlCode);
            const fullDocument = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>${extracted.css + (cssCode || '')}</style>
                </head>
                <body>
                    ${extracted.html}
                    <script>(function(){${extracted.js + (jsCode || '')}})();<\/script>
                </body>
                </html>`;
            previewDoc.open();
            previewDoc.write(fullDocument);
            previewDoc.close();
        } else {
            const fullDocument = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>${cssCode}</style>
                </head>
                <body>
                    ${htmlCode}
                    <script>(function(){${jsCode}})();<\/script>
                </body>
                </html>`;
            previewDoc.open();
            previewDoc.write(fullDocument);
            previewDoc.close();
        }
        setTimeout(() => { overrideConsole(previewWindow); }, 100);
        debugInfo.textContent = "Preview actualizado correctamente";
        setTimeout(() => { debugInfo.textContent = "Estado: Listo"; }, 100);
    } catch (error) {
        debugInfo.textContent = "Error: " + error.message;
        console.error("Error al actualizar preview:", error);
    }
};

// Guardado en localStorage
const saveToLocalStorage = () => {
    localStorage.setItem(storageKeys.html, htmlEditor.value);
    localStorage.setItem(storageKeys.css, cssEditor.value);
    localStorage.setItem(storageKeys.js, jsEditor.value);
    localStorage.setItem(storageKeys.unifiedMode, unifiedMode);
    saveIndicator.textContent = 'Guardado';
    setTimeout(() => { saveIndicator.textContent = ''; }, 2000);
};

const loadFromLocalStorage = () => {
    htmlEditor.value = localStorage.getItem(storageKeys.html) || initialHTML;
    cssEditor.value = localStorage.getItem(storageKeys.css) || initialCSS;
    jsEditor.value = localStorage.getItem(storageKeys.js) || initialJS;
    unifiedMode = localStorage.getItem(storageKeys.unifiedMode) === 'true';
    unifiedModeToggle.checked = unifiedMode;
};

// Eventos editores
const handleEditorInput = (editor, lineNumbers) => {
    updatePreview();
    updateLineNumbers(editor, lineNumbers);
    saveIndicator.textContent = 'Guardando...';
};

htmlEditor.addEventListener('input', () => handleEditorInput(htmlEditor, htmlLineNumbers));
cssEditor.addEventListener('input', () => handleEditorInput(cssEditor, cssLineNumbers));
jsEditor.addEventListener('input', () => handleEditorInput(jsEditor, jsLineNumbers));

htmlEditor.addEventListener('scroll', () => htmlLineNumbers.scrollTop = htmlEditor.scrollTop);
cssEditor.addEventListener('scroll', () => cssLineNumbers.scrollTop = cssEditor.scrollTop);
jsEditor.addEventListener('scroll', () => jsLineNumbers.scrollTop = jsEditor.scrollTop);

// Cambio de pestañas
const switchTab = (tabName) => {
    [htmlTab, cssTab, jsTab, consoleTab].forEach(tab => tab.classList.remove('active'));
    [htmlWrapper, cssWrapper, jsWrapper, consoleWrapper].forEach(wrapper => wrapper.style.display = 'none');
    if (tabName === 'html') { htmlTab.classList.add('active'); htmlWrapper.style.display = 'flex'; }
    else if (tabName === 'css') { cssTab.classList.add('active'); cssWrapper.style.display = 'flex'; }
    else if (tabName === 'js') { jsTab.classList.add('active'); jsWrapper.style.display = 'flex'; }
    else if (tabName === 'console') { consoleTab.classList.add('active'); consoleWrapper.style.display = 'flex'; consoleTab.style.color = '#3b82f6'; consoleTab.innerHTML = 'Consola'; }
    activeTab = tabName;
};

htmlTab.addEventListener('click', () => switchTab('html'));
cssTab.addEventListener('click', () => switchTab('css'));
jsTab.addEventListener('click', () => switchTab('js'));
consoleTab.addEventListener('click', () => switchTab('console'));

// Exportar código
exportButton.addEventListener('click', () => {
    let code = '', fileName = '', mimeType = '';
    if (activeTab === 'html') { code = htmlEditor.value; fileName = 'mizu_coder_html.html'; mimeType = 'text/html'; }
    else if (activeTab === 'css') { code = cssEditor.value; fileName = 'mizu_coder_css.css'; mimeType = 'text/css'; }
    else if (activeTab === 'js') { code = jsEditor.value; fileName = 'mizu_coder_js.js'; mimeType = 'application/javascript'; }
    else if (activeTab === 'console') { code = consoleContent.innerText; fileName = 'mizu_coder_console.txt'; mimeType = 'text/plain'; }

    const blob = new Blob([code], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Reiniciar preview
resetButton.addEventListener('click', () => updatePreview());

// Cambiar modo
unifiedModeToggle.addEventListener('change', () => { unifiedMode = unifiedModeToggle.checked; updatePreview(); });

// Limpiar consola
clearConsoleBtn.addEventListener('click', (e) => { e.stopPropagation(); clearConsole(); });

// Redimensionamiento
const updateLayout = (value) => {
    const isPortrait = window.innerWidth < 768;
    if (!isPortrait) {
        editorContainer.style.width = `${value}%`;
        previewContainer.style.width = `${100 - value}%`;
        editorContainer.style.height = '100%';
        previewContainer.style.height = '100%';
    } else {
        editorContainer.style.height = `${value}%`;
        previewContainer.style.height = `${100 - value}%`;
        editorContainer.style.width = '100%';
        previewContainer.style.width = '100%';
    }
};

resizerSlider.addEventListener('input', (e) => updateLayout(e.target.value));
window.addEventListener('resize', () => updateLayout(resizerSlider.value));

// Inicialización
window.onload = () => {
    loadFromLocalStorage();
    updatePreview();
    updateLineNumbers(htmlEditor, htmlLineNumbers);
    updateLineNumbers(cssEditor, cssLineNumbers);
    updateLineNumbers(jsEditor, jsLineNumbers);
    updateLayout(resizerSlider.value);
    setInterval(saveToLocalStorage, 2000);
};

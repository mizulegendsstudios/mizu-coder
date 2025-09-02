// src/js/stable/stable.js

/**
 * Funcionalidades estables de Mizu Coder (versión 2.1.0)
 * Manejo de editores, pestañas, consola, guardado, exportar, redimensionamiento.
 */

export function setupStableFeatures(app) {
    // Elementos del DOM
    const htmlEditor = document.getElementById('htmlEditor');
    const cssEditor = document.getElementById('cssEditor');
    const jsEditor = document.getElementById('jsEditor');
    const previewFrame = document.getElementById('previewFrame');
    const editorContainer = document.getElementById('editorContainer');
    const previewContainer = document.getElementById('previewContainer');
    const resizerSlider = document.getElementById('resizerSlider');
    const exportButton = document.getElementById('exportButton');
    const resetButton = document.getElementById('resetButton');
    const saveIndicator = document.getElementById('saveIndicator');
    const debugInfo = document.getElementById('debugInfo');
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

    // --- Selector de modo estilo Apple ---
    const modeSelectorButton = document.getElementById('modeSelectorButton');
    const modeSelectorDropdown = document.getElementById('modeSelectorDropdown');
    const modeOptions = document.querySelectorAll('.mode-option');
    const currentModeText = document.getElementById('currentModeText');

    let currentMode = localStorage.getItem('mizu_coder_mode') || 'unified';

    // Mostrar/ocultar menú
    modeSelectorButton.addEventListener('click', () => {
        modeSelectorDropdown.classList.toggle('show');
    });

    // Selección de modo
    modeOptions.forEach(option => {
        option.addEventListener('click', () => {
            modeOptions.forEach(o => o.classList.remove('active'));
            option.classList.add('active');
            currentMode = option.dataset.mode;
            localStorage.setItem('mizu_coder_mode', currentMode);

            currentModeText.textContent = option.querySelector('.mode-title').textContent;

            // Limpiar badges anteriores
            document.querySelectorAll('.mode-badge').forEach(b => b.remove());
            const badge = document.createElement('div');
            badge.className = 'mode-badge';
            badge.textContent = 'Activo';
            option.appendChild(badge);

            modeSelectorDropdown.classList.remove('show');
            updatePreview();
        });
    });

    // Pestaña activa
    let activeTab = 'html';

    // Claves de localStorage
    const storageKeys = {
        html: 'mizu_coder_html',
        css: 'mizu_coder_css',
        js: 'mizu_coder_js'
    };

    // Contenido inicial
    const initialHTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Proyecto</title>
</head>
<body>
    <div class="card">
        <h1>¡Bienvenido a Mizu Coder!</h1>
        <button onclick="mostrarMensaje()">Haz clic aquí</button>
        <button id="botonJs">Otro botón con JS</button>
        <p id="contador">Contador: 0</p>
    </div>
</body>
</html>`;

    const initialCSS = `body { font-family: sans-serif; }`;
    const initialJS = `console.log("¡JavaScript cargado!");`;

    // Actualizar números de línea
    const updateLineNumbers = (textarea, lineNumbersDiv) => {
        const lines = textarea.value.split('\n');
        lineNumbersDiv.innerHTML = lines.map((_, index) => index + 1).join('<br>');
    };

    // Verificar si HTML está completo
    const isCompleteHTML = (html) => {
        return html.includes('<!DOCTYPE') || html.includes('<html');
    };

    // Extraer CSS y JS del HTML
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
        logEntry.textContent = typeof message === 'object' ? JSON.stringify(message, null, 2) : message;
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
    };

    clearConsoleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        clearConsole();
    });

    const overrideConsole = (previewWindow) => {
        if (!previewWindow) return;
        ['log', 'warn', 'error'].forEach(type => {
            const original = previewWindow.console[type];
            previewWindow.console[type] = (...args) => {
                original.apply(previewWindow.console, args);
                args.forEach(arg => addConsoleMessage(arg, type));
            };
        });
    };

    // Actualizar vista previa
    const updatePreview = () => {
        const htmlCode = htmlEditor.value;
        const cssCode = cssEditor.value;
        const jsCode = jsEditor.value;
        const previewDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
        const previewWindow = previewFrame.contentWindow;
        let fullDocument = '';

        try {
            if (currentMode === 'unified') {
                if (isCompleteHTML(htmlCode)) {
                    const extracted = extractFromCompleteHTML(htmlCode);
                    fullDocument = `
                    <!DOCTYPE html><html><head>
                    <meta charset="UTF-8"><style>${extracted.css + cssCode}</style>
                    </head><body>${extracted.html}
                    <script>(function(){${extracted.js + jsCode}})();<\/script>
                    </body></html>`;
                } else {
                    fullDocument = `
                    <!DOCTYPE html><html><head>
                    <meta charset="UTF-8"><style>${cssCode}</style>
                    </head><body>${htmlCode}
                    <script>(function(){${jsCode}})();<\/script>
                    </body></html>`;
                }
            } else if (currentMode === 'separated') {
                fullDocument = `
                <!DOCTYPE html><html><head>
                <meta charset="UTF-8"><style>${cssCode}</style>
                </head><body>${htmlCode}
                <script>(function(){${jsCode}})();<\/script>
                </body></html>`;
            } else if (currentMode === 'mizu') {
                fullDocument = `
                <!DOCTYPE html><html><head>
                <meta charset="UTF-8">
                <link rel="stylesheet" href="src/css/core.css">
                </head><body>${htmlCode}
                <script src="src/js/core.js"><\/script>
                </body></html>`;
            } else if (currentMode === 'custom') {
                fullDocument = `
                <!DOCTYPE html><html><head>
                <meta charset="UTF-8"><style>${cssCode}</style>
                </head><body>${htmlCode}
                <script>(function(){${jsCode}})();<\/script>
                </body></html>`;
            }

            previewDoc.open();
            previewDoc.write(fullDocument);
            previewDoc.close();
            setTimeout(() => { overrideConsole(previewWindow); }, 100);
        } catch (err) {
            console.error("Error en preview:", err);
        }
    };

    // Guardado en localStorage
    const saveToLocalStorage = () => {
        localStorage.setItem(storageKeys.html, htmlEditor.value);
        localStorage.setItem(storageKeys.css, cssEditor.value);
        localStorage.setItem(storageKeys.js, jsEditor.value);
        localStorage.setItem('mizu_coder_mode', currentMode);
        saveIndicator.textContent = 'Guardado';
        setTimeout(() => { saveIndicator.textContent = ''; }, 2000);
    };

    const loadFromLocalStorage = () => {
        htmlEditor.value = localStorage.getItem(storageKeys.html) || initialHTML;
        cssEditor.value = localStorage.getItem(storageKeys.css) || initialCSS;
        jsEditor.value = localStorage.getItem(storageKeys.js) || initialJS;
        currentMode = localStorage.getItem('mizu_coder_mode') || 'unified';
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
        [htmlWrapper, cssWrapper, jsWrapper, consoleWrapper].forEach(w => w.style.display = 'none');
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

    // Exportar
    exportButton.addEventListener('click', () => {
        let code = '', fileName = '', mimeType = '';
        if (activeTab === 'html') { code = htmlEditor.value; fileName = 'mizu_coder.html'; mimeType = 'text/html'; }
        else if (activeTab === 'css') { code = cssEditor.value; fileName = 'mizu_coder.css'; mimeType = 'text/css'; }
        else if (activeTab === 'js') { code = jsEditor.value; fileName = 'mizu_coder.js'; mimeType = 'application/javascript'; }
        else if (activeTab === 'console') { code = consoleContent.innerText; fileName = 'mizu_coder_console.txt'; mimeType = 'text/plain'; }
        const blob = new Blob([code], { type: mimeType });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    });

    // Reset
    resetButton.addEventListener('click', () => updatePreview());

    // Layout
    const updateLayout = (value) => {
        const isPortrait = window.innerWidth < 768;
        if (!isPortrait) {
            editorContainer.style.width = `${value}%`;
            previewContainer.style.width = `${100 - value}%`;
        } else {
            editorContainer.style.height = `${value}%`;
            previewContainer.style.height = `${100 - value}%`;
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

    // Exponer funciones clave si se necesitan después
    app.updatePreview = updatePreview;
    app.switchTab = switchTab;
}

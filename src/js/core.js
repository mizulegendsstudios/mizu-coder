// src/js/core.js - Mizu Coder con consola funcional
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

// Mensaje inicial para la vista previa
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
        h1 {
            color: #2563eb;
        }
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
        button:hover {
            background-color: #2563eb;
        }
    </style>
</head>
<body>
    <div class="card">
        <h1>¡Bienvenido a Mizu Coder!</h1>
        <p>Escribe tu código HTML, CSS y JavaScript en las pestañas correspondientes.</p>
        <p>Puedes redimensionar el área de editor y vista previa con el control deslizante.</p>
        <button onclick="mostrarMensaje()">Haz clic aquí</button>
        <button id="botonJs">Otro botón con JS</button>
        <p id="contador">Contador: 0</p>
    </div>
    
    <script>
        // JavaScript incluido en HTML
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
            console.log('Mensaje mostrado a las ' + ahora.toLocaleTimeString());
        }
    <\/script>
</body>
</html>`;
const initialCSS = `/* Estilos personalizados para tu proyecto */
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
}

.header {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
}

.button {
    background-color: #3b82f6;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
}

.button:hover {
    background-color: #2563eb;
}`;
const initialJS = `// JavaScript para tu proyecto
console.log('¡JavaScript cargado!');

document.addEventListener('DOMContentLoaded', function() {
    console.log('¡Documento cargado y listo!');
    
    // Ejemplo de interacción
    const botonJs = document.getElementById('botonJs');
    const contador = document.getElementById('contador');
    let count = 0;
    
    botonJs.addEventListener('click', function() {
        count++;
        contador.textContent = 'Contador: ' + count;
        this.textContent = 'Clickeado ' + count + ' veces';
        console.log('Botón clickeado ' + count + ' veces');
    });
    
    // Ejemplo de modificación de estilos con JS
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Función de ejemplo
function mostrarMensaje() {
    const ahora = new Date();
    alert('Hora actual: ' + ahora.toLocaleTimeString());
    console.log('Mensaje mostrado a las ' + ahora.toLocaleTimeString());
}

// Esta función se llama desde el onclick en HTML
function cambiarColor() {
    const colores = ['#ff9999', '#99ff99', '#9999ff', '#ffff99', '#ff99ff'];
    const randomColor = colores[Math.floor(Math.random() * colores.length)];
    document.body.style.backgroundColor = randomColor;
    console.log('Color cambiado a: ' + randomColor);
}`;

// Función para actualizar los números de línea
const updateLineNumbers = (textarea, lineNumbersDiv) => {
    const lines = textarea.value.split('\n');
    lineNumbersDiv.innerHTML = lines.map((_, index) => index + 1).join('<br>');
};

// Función para detectar si el HTML contiene código completo
const isCompleteHTML = (html) => {
    return html.includes('<!DOCTYPE') || html.includes('<html') || html.includes('<head');
};

// Función para extraer CSS y JS del HTML completo
const extractFromCompleteHTML = (html) => {
    let css = '';
    let js = '';
    let pureHTML = html;
    
    // Extraer CSS de las etiquetas style
    const styleRegex = /<style([^>]*)>([\s\S]*?)<\/style>/gi;
    let match;
    while ((match = styleRegex.exec(html)) !== null) {
        css += match[2] + '\n';
        pureHTML = pureHTML.replace(match[0], '');
    }
    
    // Extraer JS de las etiquetas script
    const scriptRegex = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
    while ((match = scriptRegex.exec(html)) !== null) {
        // Solo incluir scripts internos, no externos
        if (!match[1].includes('src=')) {
            js += match[2] + '\n';
            pureHTML = pureHTML.replace(match[0], '');
        }
    }
    
    return { html: pureHTML, css, js };
};

// Función para agregar mensajes a la consola
const addConsoleMessage = (message, type = 'info') => {
    const logEntry = document.createElement('div');
    logEntry.classList.add('log-entry', type);
    
    // Formatear el mensaje para mostrar correctamente objetos
    let formattedMessage = message;
    if (typeof message === 'object') {
        try {
            formattedMessage = JSON.stringify(message, null, 2);
        } catch (e) {
            formattedMessage = String(message);
        }
    }
    
    logEntry.textContent = formattedMessage;
    consoleContent.appendChild(logEntry);
    
    // Auto-scroll to bottom
    consoleContent.scrollTop = consoleContent.scrollHeight;
    
    // Si estamos en la pestaña de consola, asegurarse de que está visible
    if (activeTab !== 'console') {
        consoleTab.style.color = '#ef4444';
        consoleTab.innerHTML = 'Consola <span style="color:#ef4444;font-size:0.7em;">●</span>';
    }
};

// Función para limpiar la consola
const clearConsole = () => {
    consoleContent.innerHTML = '';
    addConsoleMessage('Consola limpiada.', 'info');
    consoleTab.style.color = '#9ca3af';
    consoleTab.innerHTML = 'Consola';
};

// Sobrescribir console.log para capturar los mensajes
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

// Función para actualizar la vista previa - SOLUCIÓN DEFINITIVA
const updatePreview = () => {
    const htmlCode = htmlEditor.value;
    const cssCode = cssEditor.value;
    const jsCode = jsEditor.value;

    const previewDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
    const previewWindow = previewFrame.contentWindow;
    
    try {
        debugInfo.textContent = "Actualizando preview...";
        
        // Determinar el modo de operación
        if (unifiedMode && isCompleteHTML(htmlCode)) {
            // Modo unificado: el HTML contiene todo el código
            const extracted = extractFromCompleteHTML(htmlCode);
            const finalHTML = extracted.html;
            const finalCSS = extracted.css + (cssCode || '');
            const finalJS = extracted.js + (jsCode || '');
            
            const fullDocument = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>${finalCSS}</style>
                </head>
                <body>
                    ${finalHTML}
                    <script>
                        // Envolvemos todo el JS en una IIFE para evitar contaminación global
                        (function() {
                            ${finalJS}
                        })();
                    <\/script>
                </body>
                </html>
            `;
            
            previewDoc.open();
            previewDoc.write(fullDocument);
            previewDoc.close();
        } else {
            // Modo separado: HTML, CSS y JS por separado
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
                    <script>
                        // Envolvemos todo el JS en una IIFE para evitar contaminación global
                        (function() {
                            ${jsCode}
                        })();
                    <\/script>
                </body>
                </html>
            `;
            
            previewDoc.open();
            previewDoc.write(fullDocument);
            previewDoc.close();
        }
        
        // Sobrescribir console methods después de que el documento se cargue
        setTimeout(() => {
            overrideConsole(previewWindow);
        }, 100);
        
        debugInfo.textContent = "Preview actualizado correctamente";
        
        // Pequeño delay para asegurar que el JS se ejecute
        setTimeout(() => {
            debugInfo.textContent = "Estado: Listo";
        }, 100);
    } catch (error) {
        debugInfo.textContent = "Error: " + error.message;
        console.error("Error al actualizar preview:", error);
    }
};

// Función para guardar el contenido en el almacenamiento local
const saveToLocalStorage = () => {
    localStorage.setItem(storageKeys.html, htmlEditor.value);
    localStorage.setItem(storageKeys.css, cssEditor.value);
    localStorage.setItem(storageKeys.js, jsEditor.value);
    localStorage.setItem(storageKeys.unifiedMode, unifiedMode);
    
    // Mostrar indicador de guardado
    saveIndicator.textContent = 'Guardado';
    setTimeout(() => {
        saveIndicator.textContent = '';
    }, 2000);
};

// Función para cargar el contenido desde el almacenamiento local
const loadFromLocalStorage = () => {
    htmlEditor.value = localStorage.getItem(storageKeys.html) || initialHTML;
    cssEditor.value = localStorage.getItem(storageKeys.css) || initialCSS;
    jsEditor.value = localStorage.getItem(storageKeys.js) || initialJS;
    unifiedMode = localStorage.getItem(storageKeys.unifiedMode) === 'true';
    unifiedModeToggle.checked = unifiedMode;
};

// Escuchar los eventos de entrada para actualizar la vista previa y los números de línea
const handleEditorInput = (editor, lineNumbers) => {
    updatePreview();
    updateLineNumbers(editor, lineNumbers);
    saveIndicator.textContent = 'Guardando...';
};

htmlEditor.addEventListener('input', () => handleEditorInput(htmlEditor, htmlLineNumbers));
cssEditor.addEventListener('input', () => handleEditorInput(cssEditor, cssLineNumbers));
jsEditor.addEventListener('input', () => handleEditorInput(jsEditor, jsLineNumbers));

// Sincronizar el scroll de los editores con los números de línea
htmlEditor.addEventListener('scroll', () => htmlLineNumbers.scrollTop = htmlEditor.scrollTop);
cssEditor.addEventListener('scroll', () => cssLineNumbers.scrollTop = cssEditor.scrollTop);
jsEditor.addEventListener('scroll', () => jsLineNumbers.scrollTop = jsEditor.scrollTop);

// Lógica para el cambio de pestañas - CORREGIDA
const switchTab = (tabName) => {
    const tabs = [htmlTab, cssTab, jsTab, consoleTab];
    const wrappers = [htmlWrapper, cssWrapper, jsWrapper, consoleWrapper];

    tabs.forEach(tab => tab.classList.remove('active'));
    wrappers.forEach(wrapper => wrapper.style.display = 'none');

    // Mostrar el contenido correcto según la pestaña seleccionada
    if (tabName === 'html') {
        htmlTab.classList.add('active');
        htmlWrapper.style.display = 'flex';
    } else if (tabName === 'css') {
        cssTab.classList.add('active');
        cssWrapper.style.display = 'flex';
    } else if (tabName === 'js') {
        jsTab.classList.add('active');
        jsWrapper.style.display = 'flex';
    } else if (tabName === 'console') {
        consoleTab.classList.add('active');
        consoleWrapper.style.display = 'flex';
        // Restaurar el color normal de la pestaña de consola al seleccionarla
        consoleTab.style.color = '#3b82f6';
        consoleTab.innerHTML = 'Consola';
    }
    
    activeTab = tabName;
};

htmlTab.addEventListener('click', () => switchTab('html'));
cssTab.addEventListener('click', () => switchTab('css'));
jsTab.addEventListener('click', () => switchTab('js'));
consoleTab.addEventListener('click', () => switchTab('console'));

// Lógica para exportar el código
exportButton.addEventListener('click', () => {
    let code = '';
    let fileName = '';
    let mimeType = '';

    if (activeTab === 'html') {
        code = htmlEditor.value;
        fileName = 'mizu_coder_html.html';
        mimeType = 'text/html';
    } else if (activeTab === 'css') {
        code = cssEditor.value;
        fileName = 'mizu_coder_css.css';
        mimeType = 'text/css';
    } else if (activeTab === 'js') {
        code = jsEditor.value;
        fileName = 'mizu_coder_js.js';
        mimeType = 'application/javascript';
    } else if (activeTab === 'console') {
        // Exportar el contenido de la consola
        code = consoleContent.innerText;
        fileName = 'mizu_coder_console.txt';
        mimeType = 'text/plain';
    }

    const blob = new Blob([code], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Lógica para reiniciar el preview sin borrar el código
resetButton.addEventListener('click', () => {
    updatePreview();
});

// Cambiar entre modo unificado y separado
unifiedModeToggle.addEventListener('change', () => {
    unifiedMode = unifiedModeToggle.checked;
    updatePreview();
});

// Limpiar consola
clearConsoleBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Evitar que se toggle la consola
    clearConsole();
});

// Redimensionamiento con la barra de progreso
const updateLayout = (value) => {
    const isPortrait = window.innerWidth < 768;
    
    if (!isPortrait) {
        // Modo horizontal (escritorio)
        editorContainer.style.width = `${value}%`;
        previewContainer.style.width = `${100 - value}%`;
        editorContainer.style.height = '100%';
        previewContainer.style.height = '100%';
    } else {
        // Modo vertical (móvil)
        editorContainer.style.height = `${value}%`;
        previewContainer.style.height = `${100 - value}%`;
        editorContainer.style.width = '100%';
        previewContainer.style.width = '100%';
    }
};

// Escuchar el cambio en la barra de progreso
resizerSlider.addEventListener('input', (e) => {
    updateLayout(e.target.value);
});

// Ajustar el layout al cambiar el tamaño de la ventana
window.addEventListener('resize', () => {
    updateLayout(resizerSlider.value);
});

// Inicializar la vista previa con el contenido guardado o inicial
window.onload = () => {
    loadFromLocalStorage();
    updatePreview();
    updateLineNumbers(htmlEditor, htmlLineNumbers);
    updateLineNumbers(cssEditor, cssLineNumbers);
    updateLineNumbers(jsEditor, jsLineNumbers);
    
    updateLayout(resizerSlider.value);
    
    // Autoguardado cada 2 segundos
    setInterval(saveToLocalStorage, 2000);
};

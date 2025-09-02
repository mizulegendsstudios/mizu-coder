import { currentMode } from './mode-selector.js';
import { addConsoleMessage } from './console.js';

// Variables de elementos de vista previa
let previewFrame, debugInfo;

// Inicializar vista previa
function initializePreview() {
    previewFrame = document.getElementById('previewFrame');
    debugInfo = document.getElementById('debugInfo');
}

// Función para detectar si el HTML contiene código completo
function isCompleteHTML(html) {
    return html.includes('<!DOCTYPE') || html.includes('<html') || html.includes('<head');
}

// Función para extraer CSS y JS del HTML completo
function extractFromCompleteHTML(html) {
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
}

// Sobrescribir console.log para capturar los mensajes
function overrideConsole(previewWindow) {
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
}

// Función para actualizar la vista previa según el modo seleccionado
function updatePreview() {
    const htmlEditor = document.getElementById('htmlEditor');
    const cssEditor = document.getElementById('cssEditor');
    const jsEditor = document.getElementById('jsEditor');
    
    const htmlCode = htmlEditor.value;
    const cssCode = cssEditor.value;
    const jsCode = jsEditor.value;

    const previewDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
    const previewWindow = previewFrame.contentWindow;
    
    try {
        debugInfo.textContent = "Actualizando preview...";
        
        let fullDocument = '';
        
        // Determinar el modo de operación
        if (currentMode === 'unified') {
            // Modo unificado: el HTML contiene todo el código
            const extracted = extractFromCompleteHTML(htmlCode);
            const finalHTML = extracted.html;
            const finalCSS = extracted.css + (cssCode || '');
            const finalJS = extracted.js + (jsCode || '');
            
            fullDocument = `
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
        } else if (currentMode === 'separated') {
            // Modo separado: HTML, CSS y JS por separado
            fullDocument = `
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
        } else if (currentMode === 'mizu') {
            // Estructura Mizu: HTML + src/css/core.css + src/js/core.js
            fullDocument = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link rel="stylesheet" href="src/css/core.css">
                </head>
                <body>
                    ${htmlCode}
                    <script src="src/js/core.js"><\/script>
                </body>
                </html>
            `;
        } else if (currentMode === 'custom') {
            // Modo personalizado: similar al separado pero con posibilidad de agregar más archivos
            fullDocument = `
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
        }
        
        previewDoc.open();
        previewDoc.write(fullDocument);
        previewDoc.close();
        
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
}

export { initializePreview, updatePreview, isCompleteHTML, extractFromCompleteHTML, overrideConsole };

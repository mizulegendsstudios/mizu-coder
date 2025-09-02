import { activeTab } from '../core.js';

// Inicializar funcionalidad de exportación
function initializeExport() {
    const exportButton = document.getElementById('exportButton');
    const resetButton = document.getElementById('resetButton');
    
    exportButton.addEventListener('click', exportCode);
    resetButton.addEventListener('click', resetPreview);
}

// Exportar código según la pestaña activa
function exportCode() {
    const htmlEditor = document.getElementById('htmlEditor');
    const cssEditor = document.getElementById('cssEditor');
    const jsEditor = document.getElementById('jsEditor');
    const consoleContent = document.getElementById('consoleContent');
    
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
}

// Reiniciar la vista previa
function resetPreview() {
    // Esta función se implementará en el módulo de preview
    // Por ahora solo llamamos a updatePreview
    const updatePreview = require('./preview.js').updatePreview;
    updatePreview();
}

export { initializeExport, exportCode, resetPreview };

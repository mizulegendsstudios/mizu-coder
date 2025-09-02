import { updatePreview } from './preview.js';
import { saveToLocalStorage } from './storage.js';

// Variables de elementos del editor
let htmlEditor, cssEditor, jsEditor;
let htmlLineNumbers, cssLineNumbers, jsLineNumbers;

// Inicializar editores
function initializeEditors() {
    // Obtener elementos del DOM
    htmlEditor = document.getElementById('htmlEditor');
    cssEditor = document.getElementById('cssEditor');
    jsEditor = document.getElementById('jsEditor');
    
    htmlLineNumbers = document.getElementById('html-line-numbers');
    cssLineNumbers = document.getElementById('css-line-numbers');
    jsLineNumbers = document.getElementById('js-line-numbers');
    
    // Configurar event listeners
    setupEditorEventListeners();
    
    // Actualizar números de línea iniciales
    updateLineNumbers(htmlEditor, htmlLineNumbers);
    updateLineNumbers(cssEditor, cssLineNumbers);
    updateLineNumbers(jsEditor, jsLineNumbers);
}

// Configurar event listeners para los editores
function setupEditorEventListeners() {
    // Event listeners para entrada de texto
    htmlEditor.addEventListener('input', () => handleEditorInput(htmlEditor, htmlLineNumbers));
    cssEditor.addEventListener('input', () => handleEditorInput(cssEditor, cssLineNumbers));
    jsEditor.addEventListener('input', () => handleEditorInput(jsEditor, jsLineNumbers));
    
    // Sincronizar scroll con números de línea
    htmlEditor.addEventListener('scroll', () => htmlLineNumbers.scrollTop = htmlEditor.scrollTop);
    cssEditor.addEventListener('scroll', () => cssLineNumbers.scrollTop = cssEditor.scrollTop);
    jsEditor.addEventListener('scroll', () => jsLineNumbers.scrollTop = jsEditor.scrollTop);
    
    // Configurar pestañas
    setupTabs();
}

// Configurar el sistema de pestañas
function setupTabs() {
    const htmlTab = document.getElementById('html-tab');
    const cssTab = document.getElementById('css-tab');
    const jsTab = document.getElementById('js-tab');
    const consoleTab = document.getElementById('console-tab');
    
    const htmlWrapper = document.getElementById('html-editor-wrapper');
    const cssWrapper = document.getElementById('css-editor-wrapper');
    const jsWrapper = document.getElementById('js-editor-wrapper');
    const consoleWrapper = document.getElementById('console-wrapper');
    
    htmlTab.addEventListener('click', () => switchTab('html', htmlTab, htmlWrapper));
    cssTab.addEventListener('click', () => switchTab('css', cssTab, cssWrapper));
    jsTab.addEventListener('click', () => switchTab('js', jsTab, jsWrapper));
    consoleTab.addEventListener('click', () => switchTab('console', consoleTab, consoleWrapper));
}

// Cambiar entre pestañas
function switchTab(tabName, tabElement, wrapperElement) {
    const tabs = document.querySelectorAll('.tab-button');
    const wrappers = [
        document.getElementById('html-editor-wrapper'),
        document.getElementById('css-editor-wrapper'),
        document.getElementById('js-editor-wrapper'),
        document.getElementById('console-wrapper')
    ];
    
    // Desactivar todas las pestañas
    tabs.forEach(tab => tab.classList.remove('active'));
    wrappers.forEach(wrapper => wrapper.style.display = 'none');
    
    // Activar la pestaña seleccionada
    tabElement.classList.add('active');
    wrapperElement.style.display = 'flex';
    
    // Si es la consola, restaurar su apariencia normal
    if (tabName === 'console') {
        const consoleTab = document.getElementById('console-tab');
        consoleTab.style.color = '#3b82f6';
        consoleTab.innerHTML = 'Consola';
    }
}

// Función para actualizar los números de línea
function updateLineNumbers(textarea, lineNumbersDiv) {
    const lines = textarea.value.split('\n');
    lineNumbersDiv.innerHTML = lines.map((_, index) => index + 1).join('<br>');
}

// Manejar la entrada del editor
function handleEditorInput(editor, lineNumbers) {
    updatePreview();
    updateLineNumbers(editor, lineNumbers);
    
    // Mostrar indicador de guardado
    const saveIndicator = document.getElementById('saveIndicator');
    saveIndicator.textContent = 'Guardando...';
}

export { initializeEditors, updateLineNumbers, handleEditorInput, switchTab };

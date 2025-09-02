// Importación de módulos
import { initializeEditors, updateLineNumbers, handleEditorInput } from './modules/editor.js';
import { initializePreview, updatePreview } from './modules/preview.js';
import { initializeConsole, addConsoleMessage, clearConsole } from './modules/console.js';
import { initializeLayout, updateLayout } from './modules/layout.js';
import { initializeExport } from './modules/export.js';
import { initializeStorage, saveToLocalStorage, loadFromLocalStorage } from './modules/storage.js';
import { initializeModeSelector, currentMode } from './modules/mode-selector.js';

// Variables globales
let activeTab = 'html';

// Inicialización de la aplicación
function initializeApp() {
    // Inicializar todos los módulos
    initializeStorage();
    initializeEditors();
    initializePreview();
    initializeConsole();
    initializeLayout();
    initializeExport();
    initializeModeSelector();
    
    // Cargar datos guardados
    loadFromLocalStorage();
    
    // Configurar event listeners globales
    setupEventListeners();
    
    // Actualizar vista inicial
    updatePreview();
    updateLayout(document.getElementById('resizerSlider').value);
    
    // Iniciar autoguardado
    setInterval(saveToLocalStorage, 2000);
}

// Configurar event listeners globales
function setupEventListeners() {
    // Event listener para redimensionamiento de ventana
    window.addEventListener('resize', () => {
        updateLayout(document.getElementById('resizerSlider').value);
    });
}

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeApp);

// Exportar variables globales para uso en otros módulos
export { activeTab, currentMode };

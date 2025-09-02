// Importación de módulos
import { initializeEditors } from './editor.js';
import { initializePreview, updatePreview } from './preview.js';
import { initializeConsole } from './console.js';
import { initializeLayout, updateLayout } from './layout.js';
import { initializeExport } from './export.js';
import { initializeStorage, saveToLocalStorage, loadFromLocalStorage } from './storage.js';
import { initializeModeSelector } from './mode-selector.js';

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
    
    // Iniciar autoguardado
    setInterval(saveToLocalStorage, 2000);
}

// Configurar event listeners globales
function setupEventListeners() {
    // Event listener para redimensionamiento de ventana
    window.addEventListener('resize', () => {
        const resizerSlider = document.getElementById('resizerSlider');
        updateLayout(resizerSlider.value);
    });
}

// Iniciar la aplicación cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Exportar variables globales para uso en otros módulos
export { activeTab };

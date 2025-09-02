import { updatePreview } from './preview.js';
import { saveToLocalStorage } from './storage.js';

// Variables de elementos del selector de modo
let modeSelectorButton, modeSelectorDropdown, currentModeText, modeOptions;

// Variable para el modo actual
let currentMode = 'unified';

// Inicializar selector de modo
function initializeModeSelector() {
    modeSelectorButton = document.getElementById('modeSelectorButton');
    modeSelectorDropdown = document.getElementById('modeSelectorDropdown');
    currentModeText = document.getElementById('currentModeText');
    modeOptions = document.querySelectorAll('.mode-option');
    
    // Cargar modo guardado
    const savedMode = localStorage.getItem('mizu_coder_mode');
    if (savedMode) {
        currentMode = savedMode;
    }
    
    // Actualizar UI según el modo cargado
    updateModeUI(currentMode);
    
    // Configurar event listeners
    setupModeSelectorEventListeners();
}

// Configurar event listeners para el selector de modo
function setupModeSelectorEventListeners() {
    // Abrir/cerrar dropdown
    modeSelectorButton.addEventListener('click', (e) => {
        e.stopPropagation();
        modeSelectorDropdown.classList.toggle('show');
    });
    
    // Cerrar dropdown al hacer clic fuera de él
    document.addEventListener('click', (e) => {
        if (!modeSelectorButton.contains(e.target) && !modeSelectorDropdown.contains(e.target)) {
            modeSelectorDropdown.classList.remove('show');
        }
    });
    
    // Manejar selección de modo
    modeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const selectedMode = option.dataset.mode;
            currentMode = selectedMode;
            updateModeUI(selectedMode);
            updatePreview();
            saveToLocalStorage();
        });
    });
}

// Actualizar la UI según el modo seleccionado
function updateModeUI(mode) {
    // Actualizar el texto del botón
    const modeTexts = {
        'unified': 'Modo Unificado',
        'separated': 'Modo Separado',
        'mizu': 'Estructura Mizu',
        'custom': 'Personalizado'
    };
    currentModeText.textContent = modeTexts[mode] || 'Modo Unificado';
    
    // Actualizar las opciones activas en el dropdown
    modeOptions.forEach(option => {
        if (option.dataset.mode === mode) {
            option.classList.add('active');
            // Agregar badge "Activo"
            if (!option.querySelector('.mode-badge')) {
                const badge = document.createElement('div');
                badge.className = 'mode-badge';
                badge.textContent = 'Activo';
                option.appendChild(badge);
            }
        } else {
            option.classList.remove('active');
            // Eliminar badge "Activo"
            const badge = option.querySelector('.mode-badge');
            if (badge) {
                badge.remove();
            }
        }
    });
    
    // Ocultar el dropdown
    modeSelectorDropdown.classList.remove('show');
}

export { initializeModeSelector, currentMode, updateModeUI };

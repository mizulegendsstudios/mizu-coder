// src/js/core.js
import { setupStableFeatures } from './stable/stable.js';
import { setupDevFeatures } from './dev/dev.js';

const app = {
    currentMode: 'unified',
    tabs: [],
    init() {
        setupStableFeatures(this);
        setupDevFeatures(this);
        this.attachModeSelector();
    },
    attachModeSelector() {
        const button = document.getElementById('modeSelectorButton');
        const dropdown = document.getElementById('modeSelectorDropdown');
        if (button && dropdown) {
            button.addEventListener('click', () => {
                dropdown.classList.toggle('show');
            });
            // Cerrar al hacer clic fuera
            document.addEventListener('click', (e) => {
                if (!button.contains(e.target) && !dropdown.contains(e.target)) {
                    dropdown.classList.remove('show');
                }
            });
        }
    }
};

// Inicializar la app
app.init();

// Exportar para depuración (opcional)
window.mizuCoder = app;

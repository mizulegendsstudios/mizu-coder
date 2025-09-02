// src/js/core.js
import { setupStableFeatures } from '.src/stable/stable.js';
import { setupDevFeatures } from '.src/dev/dev.js';

const app = {
    currentMode: 'unified',
    tabs: [],
    init() {
        // Aseguramos que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupModules();
            });
        } else {
            this.setupModules();
        }
    },
    setupModules() {
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
            document.addEventListener('click', (e) => {
                if (!button.contains(e.target) && !dropdown.contains(e.target)) {
                    dropdown.classList.remove('show');
                }
            });
        }
    }
};

// Inicializar
app.init();

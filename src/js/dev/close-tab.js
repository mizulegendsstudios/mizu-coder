// src/js/dev/close-tab.js
// Permite cerrar pestañas con un botón ❌

/**
 * Añade un botón de cierre a una pestaña
 * @param {HTMLButtonElement} tabButton - Botón de la pestaña
 * @param {string} id - ID de la pestaña (ej: js-tab-abc123)
 * @param {string} type - 'js' o 'css'
 * @param {object} app - Referencia a la app
 */
export function addCloseButton(tabButton, id, type, app) {
    // Evitar múltiples botones
    if (tabButton.querySelector('.close-tab-btn')) return;

    // Botón de cierre
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-tab-btn';
    closeBtn.type = 'button';
    closeBtn.innerHTML = '&times;';
    closeBtn.title = 'Cerrar pestaña';
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: #ef4444;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        opacity: 0.7;
        padding: 0 0.25rem;
        margin-left: 0.25rem;
        line-height: 1;
    `;
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        closeTab(id, type, app);
    });

    // Hover
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '1');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '0.7');

    // Insertar
    tabButton.appendChild(closeBtn);
}

/**
 * Cierra una pestaña
 * @param {string} id - ID sin sufijo
 * @param {string} type - 'js' o 'css'
 * @param {object} app
 */
export function closeTab(id, type, app) {
    const button = document.getElementById(`${id}-button`);
    const wrapper = document.getElementById(`${id}-wrapper`);

    if (!button || !wrapper) return;

    const tabName = button.textContent.trim();

    // Confirmar (opcional)
    if (!confirm(`¿Cerrar la pestaña "${tabName}"?`)) return;

    // Eliminar del DOM
    button.remove();
    wrapper.remove();

    // Eliminar de localStorage
    removeTabFromStorage(id);

    // Si era la pestaña activa, cambiar a HTML
    if (button.classList.contains('active')) {
        const htmlTab = document.getElementById('html-tab');
        const htmlWrapper = document.getElementById('html-editor-wrapper');
        if (htmlTab && htmlWrapper) {
            htmlTab.click(); // Usa el evento ya existente
        }
    }

    console.log(`🗑️ Mizu Coder: Pestaña cerrada - ${id}`);
    if (typeof app.updatePreview === 'function') {
        app.updatePreview();
    }
}

/**
 * Elimina una pestaña de localStorage
 * @param {string} id
 */
function removeTabFromStorage(id) {
    // 1. Eliminar contenido
    localStorage.removeItem(`mizu_coder_tab_${id}_content`);

    // 2. Eliminar estado de pestañas
    const savedTabs = JSON.parse(localStorage.getItem('mizu_coder_tabs') || '[]');
    const filtered = savedTabs.filter(tab => tab.id !== id);
    localStorage.setItem('mizu_coder_tabs', JSON.stringify(filtered));
}

import { removeTabFromStorage } from './close-tab-utils.js';

export function addCloseButton(tabButton, id, type, app) {
    if (tabButton.querySelector('.close-tab-btn')) return;

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
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '1');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '0.7');
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        closeTab(id, type, app);
    });

    tabButton.appendChild(closeBtn);
}

export function closeTab(id, type, app) {
    const button = document.getElementById(`${id}-button`);
    const wrapper = document.getElementById(`${id}-wrapper`);

    if (!button || !wrapper) return;

    const tabName = button.textContent.trim();
    if (!confirm(`¿Cerrar la pestaña "${tabName}"?`)) return;

    button.remove();
    wrapper.remove();
    removeTabFromStorage(id);

    // Si era la activa, volver a HTML
    if (button.classList.contains('active')) {
        const htmlTab = document.getElementById('html-tab');
        if (htmlTab) htmlTab.click();
    }

    console.log(`🗑️ Mizu Coder: Pestaña cerrada - ${id}`);
    if (typeof app?.updatePreview === 'function') {
        app.updatePreview();
    }
}

// Variables de elementos de consola
let consoleContent, consoleTab;

// Inicializar consola
function initializeConsole() {
    consoleContent = document.getElementById('consoleContent');
    consoleTab = document.getElementById('console-tab');
    
    // Configurar event listener para limpiar consola
    const clearConsoleBtn = document.getElementById('clearConsole');
    clearConsoleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        clearConsole();
    });
}

// Función para agregar mensajes a la consola
function addConsoleMessage(message, type = 'info') {
    const logEntry = document.createElement('div');
    logEntry.classList.add('log-entry', type);
    
    // Formatear el mensaje para mostrar correctamente objetos
    let formattedMessage = message;
    if (typeof message === 'object') {
        try {
            formattedMessage = JSON.stringify(message, null, 2);
        } catch (e) {
            formattedMessage = String(message);
        }
    }
    
    logEntry.textContent = formattedMessage;
    consoleContent.appendChild(logEntry);
    
    // Auto-scroll to bottom
    consoleContent.scrollTop = consoleContent.scrollHeight;
    
    // Si estamos en la pestaña de consola, asegurarse de que está visible
    const activeTab = document.querySelector('.tab-button.active').id;
    if (activeTab !== 'console-tab') {
        consoleTab.style.color = '#ef4444';
        consoleTab.innerHTML = 'Consola <span style="color:#ef4444;font-size:0.7em;">●</span>';
    }
}

// Función para limpiar la consola
function clearConsole() {
    consoleContent.innerHTML = '';
    addConsoleMessage('Consola limpiada.', 'info');
    consoleTab.style.color = '#9ca3af';
    consoleTab.innerHTML = 'Consola';
}

export { initializeConsole, addConsoleMessage, clearConsole };

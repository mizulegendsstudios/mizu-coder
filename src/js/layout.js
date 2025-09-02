// Variables de elementos de layout
let resizerSlider, editorContainer, previewContainer;

// Inicializar layout
function initializeLayout() {
    resizerSlider = document.getElementById('resizerSlider');
    editorContainer = document.getElementById('editorContainer');
    previewContainer = document.getElementById('previewContainer');
    
    // Configurar event listener para el slider de redimensionamiento
    resizerSlider.addEventListener('input', (e) => {
        updateLayout(e.target.value);
    });
}

// Actualizar el layout según el valor del slider
function updateLayout(value) {
    const isPortrait = window.innerWidth < 768;
    
    if (!isPortrait) {
        // Modo horizontal (escritorio)
        editorContainer.style.width = `${value}%`;
        previewContainer.style.width = `${100 - value}%`;
        editorContainer.style.height = '100%';
        previewContainer.style.height = '100%';
    } else {
        // Modo vertical (móvil)
        editorContainer.style.height = `${value}%`;
        previewContainer.style.height = `${100 - value}%`;
        editorContainer.style.width = '100%';
        previewContainer.style.width = '100%';
    }
}

export { initializeLayout, updateLayout };

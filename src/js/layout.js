// Variables de elementos de layout
let resizerSlider, editorContainer, previewContainer, resizer;

// Inicializar layout
function initializeLayout() {
    resizerSlider = document.getElementById('resizerSlider');
    editorContainer = document.getElementById('editorContainer');
    previewContainer = document.getElementById('previewContainer');
    resizer = document.getElementById('resizer');
    
    // Configurar event listener para el slider de redimensionamiento
    resizerSlider.addEventListener('input', handleSliderInput);
    
    // Configurar event listener para el redimensionamiento manual
    setupResizer();
    
    // Inicializar el layout con el valor por defecto
    updateLayout(parseInt(resizerSlider.value));
}

// Manejar el input del slider
function handleSliderInput(e) {
    updateLayout(parseInt(e.target.value));
}

// Configurar el redimensionamiento manual con el divisor
function setupResizer() {
    let isResizing = false;
    
    resizer.addEventListener('mousedown', function(e) {
        isResizing = true;
        document.body.style.cursor = 'row-resize';
        if (window.innerWidth >= 768) {
            document.body.style.cursor = 'col-resize';
        }
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isResizing) return;
        
        const containerRect = container.getBoundingClientRect();
        let newValue;
        
        if (window.innerWidth >= 768) {
            // Modo horizontal
            const mouseX = e.clientX - containerRect.left;
            newValue = Math.max(20, Math.min(80, (mouseX / containerRect.width) * 100));
        } else {
            // Modo vertical
            const mouseY = e.clientY - containerRect.top;
            newValue = Math.max(20, Math.min(80, (mouseY / containerRect.height) * 100));
        }
        
        resizerSlider.value = newValue;
        updateLayout(newValue);
    });
    
    document.addEventListener('mouseup', function() {
        isResizing = false;
        document.body.style.cursor = '';
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
        resizer.style.width = '12px';
        resizer.style.height = '100%';
        resizer.style.cursor = 'col-resize';
    } else {
        // Modo vertical (móvil)
        editorContainer.style.height = `${value}%`;
        previewContainer.style.height = `${100 - value}%`;
        editorContainer.style.width = '100%';
        previewContainer.style.width = '100%';
        resizer.style.height = '12px';
        resizer.style.width = '100%';
        resizer.style.cursor = 'row-resize';
    }
    
    // Actualizar números de línea si es necesario
    const htmlEditor = document.getElementById('htmlEditor');
    const cssEditor = document.getElementById('cssEditor');
    const jsEditor = document.getElementById('jsEditor');
    const htmlLineNumbers = document.getElementById('html-line-numbers');
    const cssLineNumbers = document.getElementById('css-line-numbers');
    const jsLineNumbers = document.getElementById('js-line-numbers');
    
    if (htmlEditor && htmlLineNumbers) {
        setTimeout(() => {
            htmlLineNumbers.scrollTop = htmlEditor.scrollTop;
        }, 10);
    }
    if (cssEditor && cssLineNumbers) {
        setTimeout(() => {
            cssLineNumbers.scrollTop = cssEditor.scrollTop;
        }, 10);
    }
    if (jsEditor && jsLineNumbers) {
        setTimeout(() => {
            jsLineNumbers.scrollTop = jsEditor.scrollTop;
        }, 10);
    }
}

// Exportar funciones
export { initializeLayout, updateLayout };

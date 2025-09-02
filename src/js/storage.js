// src/js/storage.js
import { currentMode } from './mode-selector.js';

// Nombres para las claves de localStorage
const storageKeys = {
    html: 'mizu_coder_html',
    css: 'mizu_coder_css',
    js: 'mizu_coder_js',
    mode: 'mizu_coder_mode'
};

// Contenido inicial para los editores
const initialHTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Proyecto</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
            color: #333;
        }
        h1 {
            color: #2563eb;
        }
        .card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        button {
            background-color: #3b82f6;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin: 5px;
        }
        button:hover {
            background-color: #2563eb;
        }
    </style>
</head>
<body>
    <div class="card">
        <h1>¡Bienvenido a Mizu Coder!</h1>
        <p>Escribe tu código HTML, CSS y JavaScript en las pestañas correspondientes.</p>
        <p>Puedes redimensionar el área de editor y vista previa con el control deslizante.</p>
        <button onclick="mostrarMensaje()">Haz clic aquí</button>
        <button id="botonJs">Otro botón con JS</button>
        <p id="contador">Contador: 0</p>
    </div>
    
    <script>
        // JavaScript incluido en HTML
        console.log('¡Documento cargado y listo!');
        console.warn('Esta es una advertencia de ejemplo');
        console.error('Este es un error de ejemplo');
        
        document.addEventListener('DOMContentLoaded', function() {
            const botonJs = document.getElementById('botonJs');
            const contador = document.getElementById('contador');
            let count = 0;
            
            botonJs.addEventListener('click', function() {
                count++;
                contador.textContent = 'Contador: ' + count;
                this.textContent = 'Clickeado ' + count + ' veces';
                console.log('Botón clickeado ' + count + ' veces');
            });
        });

        function mostrarMensaje() {
            const ahora = new Date();
            alert('Hora actual: ' + ahora.toLocaleTimeString());
            console.log('Mensaje mostrado a las ' + ahora.toLocaleTimeString());
        }
    <\/script>
</body>
</html>`;

const initialCSS = `/* Estilos personalizados para tu proyecto */
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
}

.header {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
}

.button {
    background-color: #3b82f6;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
}

.button:hover {
    background-color: #2563eb;
}`;

const initialJS = `// JavaScript para tu proyecto
console.log('¡JavaScript cargado!');

document.addEventListener('DOMContentLoaded', function() {
    console.log('¡Documento cargado y listo!');
    
    // Ejemplo de interacción
    const botonJs = document.getElementById('botonJs');
    const contador = document.getElementById('contador');
    let count = 0;
    
    botonJs.addEventListener('click', function() {
        count++;
        contador.textContent = 'Contador: ' + count;
        this.textContent = 'Clickeado ' + count + ' veces';
        console.log('Botón clickeado ' + count + ' veces');
    });
    
    // Ejemplo de modificación de estilos con JS
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Función de ejemplo
function mostrarMensaje() {
    const ahora = new Date();
    alert('Hora actual: ' + ahora.toLocaleTimeString());
    console.log('Mensaje mostrado a las ' + ahora.toLocaleTimeString());
}

// Esta función se llama desde el onclick en HTML
function cambiarColor() {
    const colores = ['#ff9999', '#99ff99', '#9999ff', '#ffff99', '#ff99ff'];
    const randomColor = colores[Math.floor(Math.random() * colores.length)];
    document.body.style.backgroundColor = randomColor;
    console.log('Color cambiado a: ' + randomColor);
}`;

// Función para guardar el contenido en el almacenamiento local
function saveToLocalStorage() {
    const htmlEditor = document.getElementById('htmlEditor');
    const cssEditor = document.getElementById('cssEditor');
    const jsEditor = document.getElementById('jsEditor');
    const saveIndicator = document.getElementById('saveIndicator');
    
    localStorage.setItem(storageKeys.html, htmlEditor.value);
    localStorage.setItem(storageKeys.css, cssEditor.value);
    localStorage.setItem(storageKeys.js, jsEditor.value);
    localStorage.setItem(storageKeys.mode, currentMode);
    
    // Mostrar indicador de guardado
    saveIndicator.textContent = 'Guardado';
    setTimeout(() => {
        saveIndicator.textContent = '';
    }, 2000);
}

// Función para cargar el contenido desde el almacenamiento local
function loadFromLocalStorage() {
    const htmlEditor = document.getElementById('htmlEditor');
    const cssEditor = document.getElementById('cssEditor');
    const jsEditor = document.getElementById('jsEditor');
    
    htmlEditor.value = localStorage.getItem(storageKeys.html) || initialHTML;
    cssEditor.value = localStorage.getItem(storageKeys.css) || initialCSS;
    jsEditor.value = localStorage.getItem(storageKeys.js) || initialJS;
    
    // El modo se carga desde el módulo mode-selector
}

// Inicializar módulo de almacenamiento
function initializeStorage() {
    console.log('Storage module initialized');
}

export { initializeStorage, saveToLocalStorage, loadFromLocalStorage, storageKeys, initialHTML, initialCSS, initialJS };

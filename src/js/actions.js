import { saveToStorage } from './storage.js';

export function setupExport(editors, getMode) {
    const mode = getMode();
    const content = editors.getContent();

    if (mode === 'unified') {
        // Generar HTML completo embebiendo CSS y JS
        const fullHTML = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>${content.css}</style></head>
<body>${content.html}<script>${content.js}</script></body>
</html>`;
        downloadFile('mizu_coder_unified.html', fullHTML);
    } else {
        // Para otros modos, podrías generar un ZIP. Por simplicidad, exportamos un HTML igual.
        // Pero podrías implementar descarga múltiple o ZIP con JSZip.
        alert('Exportación en desarrollo: por ahora se genera un solo HTML combinado.');
        const fullHTML = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>${content.css}</style></head>
<body>${content.html}<script>${content.js}</script></body>
</html>`;
        downloadFile('mizu_coder_export.html', fullHTML);
    }
}

function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
}

export function setupReset(editors, getMode) {
    const mode = getMode();
    // Reiniciar a un ejemplo predeterminado según el modo
    if (mode === 'unified') {
        editors.html.value = `<!-- Código unificado: todo en un solo archivo -->
<!DOCTYPE html>
<html>
<head>
    <style>
        body { background: #f0f4ff; display: flex; justify-content: center; align-items: center; height: 100vh; }
        .card { background: white; padding: 2rem; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
    </style>
</head>
<body>
    <div class="card">
        <h2>Modo Unificado</h2>
        <p>Todo el código está dentro del HTML.</p>
    </div>
    <script>
        console.log('Modo unificado funcionando');
    </script>
</body>
</html>`;
        editors.css.value = '';
        editors.js.value = '';
    } else {
        // Ejemplo separado (mismo que el inicial)
        editors.html.value = `<!-- Tarjeta interactiva -->
<div class="card">
    <h2>✨ Mizu Coder</h2>
    <p>Has hecho clic <span id="count">0</span> veces</p>
    <button id="btn">Haz clic</button>
</div>`;
        editors.css.value = `/* Estilos elegantes */
body {
    background: linear-gradient(145deg, #f0f4ff, #d9e2fa);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Inter', sans-serif;
    margin: 0;
}

.card {
    background: rgba(255,255,255,0.7);
    backdrop-filter: blur(10px);
    border-radius: 32px;
    padding: 2rem 3rem;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    text-align: center;
    border: 1px solid rgba(255,255,255,0.5);
}

h2 {
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 1rem;
}

p {
    color: #475569;
    margin: 1.5rem 0;
}

button {
    background: #3b82f6;
    border: none;
    color: white;
    font-weight: 600;
    padding: 0.75rem 2rem;
    border-radius: 40px;
    cursor: pointer;
    transition: transform 0.1s, box-shadow 0.2s;
    box-shadow: 0 8px 16px rgba(59,130,246,0.3);
}

button:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 24px rgba(59,130,246,0.4);
}`;
        editors.js.value = `// Contador interactivo
let count = 0;
const btn = document.getElementById('btn');
const span = document.getElementById('count');

btn.addEventListener('click', () => {
    count++;
    span.textContent = count;
    console.log('Clic número ' + count);
});`;
    }

    // Forzar actualización de números de línea y preview
    editors.html.dispatchEvent(new Event('input'));
    editors.css.dispatchEvent(new Event('input'));
    editors.js.dispatchEvent(new Event('input'));

    // Guardar en localStorage
    saveToStorage({
        html: editors.html.value,
        css: editors.css.value,
        js: editors.js.value
    });
}

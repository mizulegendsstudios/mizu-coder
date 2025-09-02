// src/js/dev/file-structure.js
/**
 * Genera la estructura del proyecto basada en pestañas con contenido
 * @param {HTMLElement} container - Donde mostrar la estructura
 */
export function renderFileStructure(container) {
    if (!container) return;

    // Iniciar estructura
    let tree = 'proyecto/\n';

    // Archivos principales
    const files = [];

    // HTML principal
    const htmlContent = document.getElementById('htmlEditor')?.value.trim();
    if (htmlContent) {
        files.push('index.html');
    }

    // Pestañas dinámicas (JS/CSS)
    document.querySelectorAll('.tab-button[data-id]').forEach(button => {
        const id = button.dataset.id;
        const label = button.textContent.trim().replace('×', '').trim();
        const type = button.dataset.type;
        const editor = document.querySelector(`[data-id="${id}"]`);
        const content = editor?.value.trim();

        if (content) {
            // Si el nombre tiene ruta (ej: src/js/core.js)
            if (label.includes('/')) {
                files.push(label);
            } else {
                const dir = type === 'js' ? 'src/js' : 'src/css';
                const ext = type === 'js' ? 'js' : 'css';
                files.push(`${dir}/${label}.${ext}`);
            }
        }
    });

    // Eliminar duplicados y ordenar
    const uniqueFiles = [...new Set(files)].sort();

    // Generar árbol
    const root = {};
    uniqueFiles.forEach(file => {
        const parts = file.split('/');
        let current = root;
        parts.forEach(part => {
            if (!current[part]) current[part] = {};
            current = current[part];
        });
    });

    // Imprimir árbol
    const print = (node, depth = 0) => {
        const indent = '│   '.repeat(depth);
        const keys = Object.keys(node);
        keys.forEach((key, i) => {
            const isLast = i === keys.length - 1;
            const branch = isLast ? '└── ' : '├── ';
            tree += `${indent}${branch}${key}\n`;
            print(node[key], depth + 1);
        });
    };

    print(root);
    container.innerHTML = `<pre class="file-explorer">${tree}</pre>`;
}

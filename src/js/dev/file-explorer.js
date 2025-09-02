// src/js/dev/file-explorer.js
/**
 * Genera una vista de estructura de archivos basada en pestañas
 * @param {HTMLElement} container - Elemento donde mostrar la estructura
 */
export function renderFileStructure(container) {
    if (!container) return;

    // Obtener todas las pestañas con contenido
    const tabs = Array.from(document.querySelectorAll('.tab-button[data-id]')).map(button => {
        const id = button.dataset.id;
        const label = button.textContent.trim().replace('×', '').trim();
        const type = button.dataset.type;
        const editor = document.querySelector(`[data-id="${id}"]`);
        const content = editor?.value.trim();

        return { id, label, type, content };
    }).filter(tab => tab.content); // Solo pestañas con contenido

    // Generar estructura
    let structure = 'proyecto/\n';
    
    const files = [];

    // HTML
    const htmlContent = document.getElementById('htmlEditor')?.value.trim();
    if (htmlContent) files.push('index.html');

    // JS y CSS
    tabs.forEach(tab => {
        if (tab.label.includes('/')) {
            // Ruta personalizada: src/js/core.js
            files.push(tab.label);
        } else {
            const ext = tab.type === 'js' ? 'js' : 'css';
            files.push(`src/${ext === 'js' ? 'js' : 'css'}/${tab.label}.${ext}`);
        }
    });

    // Ordenar y agrupar
    const sorted = files.sort();
    const tree = generateTree(sorted);
    structure += tree.replace(/^/gm, '  ');

    // Mostrar
    container.innerHTML = `<pre class="file-explorer">${structure}</pre>`;
}

/**
 * Genera un árbol de directorios
 * @param {string[]} files
 * @returns {string}
 */
function generateTree(files) {
    const root = {};
    files.forEach(file => {
        const parts = file.split('/');
        let current = root;
        parts.forEach(part => {
            if (!current[part]) current[part] = {};
            current = current[part];
        });
    });

    return printTree(root, 0);
}

function printTree(node, depth) {
    const indent = '│   '.repeat(depth);
    const items = Object.keys(node);
    return items.map((item, i) => {
        const isLast = i === items.length - 1;
        const branch = isLast ? '└── ' : '├── ';
        return `${indent}${branch}${item}\n${printTree(node[item], depth + 1)}`;
    }).join('');
}

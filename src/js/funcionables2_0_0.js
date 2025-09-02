/* ==========================================================
   funcionables2_0_0.js
   Funciones estables y probadas de la versión 2.0.0
   Mantener este archivo sin experimentos, solo código validado
   ========================================================== */

// Estado actual de los editores
let editors = {
  html: "",
  css: "",
  js: ""
};

let currentEditor = "html"; // Por defecto inicia en HTML

/* ==========================================================
   📝 Gestión de pestañas
   ========================================================== */
function switchTab(tabName) {
  // Guardar el contenido actual
  editors[currentEditor] = document.getElementById("editor").value;

  // Cambiar de pestaña activa
  currentEditor = tabName;
  document.querySelectorAll(".tab-button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.editor === tabName);
  });

  // Cargar contenido en el editor
  document.getElementById("editor").value = editors[tabName];
  updateLineNumbers();
}

/* ==========================================================
   📄 Números de línea
   ========================================================== */
function updateLineNumbers() {
  const editor = document.getElementById("editor");
  const lineNumbers = document.getElementById("line-numbers");
  const lines = editor.value.split("\n").length;

  lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join("<br>");
}

/* ==========================================================
   🔄 Vista previa en vivo
   ========================================================== */
function updatePreview() {
  const preview = document.getElementById("preview");
  const previewDoc = preview.contentDocument || preview.contentWindow.document;

  previewDoc.open();
  previewDoc.write(`
    <!doctype html>
    <html lang="es">
      <head>
        <style>${editors.css}</style>
      </head>
      <body>
        ${editors.html}
        <script>
          try {
            ${editors.js}
          } catch (err) {
            console.error(err);
          }
        <\/script>
      </body>
    </html>
  `);
  previewDoc.close();
}

/* ==========================================================
   💾 Guardado automático
   ========================================================== */
function autoSave() {
  localStorage.setItem("mizuCoderEditors", JSON.stringify(editors));
  document.getElementById("save-status").innerText = "Guardado";
}

function loadSavedData() {
  const saved = localStorage.getItem("mizuCoderEditors");
  if (saved) {
    editors = JSON.parse(saved);
    document.getElementById("editor").value = editors[currentEditor];
    updateLineNumbers();
  }
}

/* ==========================================================
   🖥️ Consola personalizada
   ========================================================== */
function setupConsole() {
  const consoleContent = document.getElementById("console-content");
  const origLog = console.log;
  const origWarn = console.warn;
  const origError = console.error;

  function logMessage(type, args) {
    const entry = document.createElement("div");
    entry.classList.add("log-entry", type);
    entry.textContent = `[${type}] ${args.join(" ")}`;
    consoleContent.appendChild(entry);
    consoleContent.scrollTop = consoleContent.scrollHeight;
  }

  console.log = (...args) => { origLog(...args); logMessage("info", args); };
  console.warn = (...args) => { origWarn(...args); logMessage("warn", args); };
  console.error = (...args) => { origError(...args); logMessage("error", args); };

  document.getElementById("clear-console").addEventListener("click", () => {
    consoleContent.innerHTML = "";
  });
}

/* ==========================================================
   🎚️ Slider / Resizer
   ========================================================== */
function setupResizer() {
  const slider = document.getElementById("resizer");
  const editorContainer = document.getElementById("editor-container");
  const previewContainer = document.querySelector(".preview-container");

  function adjustLayout() {
    const value = slider.value;
    if (window.innerWidth >= 768) {
      // Horizontal (desktop)
      editorContainer.style.width = value + "%";
      previewContainer.style.width = (100 - value) + "%";
    } else {
      // Vertical (mobile)
      editorContainer.style.height = value + "%";
      previewContainer.style.height = (100 - value) + "%";
    }
  }

  slider.addEventListener("input", adjustLayout);
  window.addEventListener("resize", adjustLayout);
  adjustLayout(); // inicial
}

/* ==========================================================
   🚀 Inicialización
   ========================================================== */
window.addEventListener("DOMContentLoaded", () => {
  // Tabs
  document.querySelectorAll(".tab-button").forEach(btn => {
    btn.addEventListener("click", () => switchTab(btn.dataset.editor));
  });

  // Editor input
  document.getElementById("editor").addEventListener("input", () => {
    editors[currentEditor] = document.getElementById("editor").value;
    updateLineNumbers();
    updatePreview();
    autoSave();
  });

  // Guardar manual
  document.getElementById("save-btn").addEventListener("click", autoSave);

  // Inicializar subsistemas
  loadSavedData();
  updatePreview();
  setupConsole();
  setupResizer();
});

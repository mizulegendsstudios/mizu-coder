/* ==========================================================
   core.js
   Orquestador principal de Mizu Coder
   Versión: 2.1.0 (en desarrollo)
   ========================================================== */

/* ==========================================================
   ⚙️ Configuración inicial
   ========================================================== */
const MizuCore = {
  version: "2.1.0-dev",
  modules: {
    base: true,  // funcionables2_0_0.js
    experimental: false // nuevasfunciones.js
  },
  initialized: false
};

/* ==========================================================
   🔄 Carga dinámica de scripts
   ========================================================== */
function loadScript(path, callback) {
  const script = document.createElement("script");
  script.src = path;
  script.onload = () => {
    console.log(`[MizuCore] Script cargado: ${path}`);
    if (callback) callback();
  };
  script.onerror = () => console.error(`[MizuCore] Error al cargar: ${path}`);
  document.body.appendChild(script);
}

/* ==========================================================
   🚀 Inicialización
   ========================================================== */
function initMizuCoder() {
  if (MizuCore.initialized) {
    console.warn("[MizuCore] Ya inicializado.");
    return;
  }

  console.log(`%c[MizuCore] Iniciando Mizu Coder v${MizuCore.version}`, "color:#3b82f6; font-weight:bold;");

  // 1. Cargar funciones base (siempre)
  loadScript("./src/js/funcionables2_0_0.js", () => {
    console.log("[MizuCore] Módulo base listo ✅");

    // 2. Cargar funciones experimentales (opcional)
    if (MizuCore.modules.experimental) {
      loadScript("./src/js/nuevasfunciones.js", () => {
        console.log("[MizuCore] Módulo experimental habilitado ⚡");
        if (typeof initExperimental === "function") {
          initExperimental();
        }
      });
    }

    MizuCore.initialized = true;
  });
}

/* ==========================================================
   🖥️ Debug Info
   ========================================================== */
function showDebugInfo() {
  const debugDiv = document.createElement("div");
  debugDiv.className = "debug-info";
  debugDiv.innerText = `Mizu Coder v${MizuCore.version}\nBase: ${MizuCore.modules.base}\nExperimental: ${MizuCore.modules.experimental}`;
  document.body.appendChild(debugDiv);
}

/* ==========================================================
   🌐 Eventos globales
   ========================================================== */
window.addEventListener("DOMContentLoaded", () => {
  initMizuCoder();
  showDebugInfo();
});

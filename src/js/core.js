// core.js
const modules = {
    editor: { enabled: true, script: "src/js/editor.js" },
    preview: { enabled: true, script: "src/js/preview.js" },
    console: { enabled: true, script: "src/js/console.js" },
    tabs: { enabled: true, script: "src/js/tabs.js" },
    achievements: { enabled: false, script: "src/js/module1.js" },
    participants: { enabled: false, script: "src/js/module2.js" },
    teams: { enabled: false, script: "src/js/module3.js" },
    // ... seguir hasta module20
};

function loadModules() {
    Object.entries(modules).forEach(([name, mod]) => {
        if (mod.enabled) {
            const script = document.createElement("script");
            script.src = mod.script;
            script.type = "module";
            document.body.appendChild(script);
            console.log(`✅ Módulo cargado: ${name}`);
        } else {
            console.log(`⏸️ Módulo deshabilitado: ${name}`);
        }
    });
}

window.addEventListener("DOMContentLoaded", loadModules);

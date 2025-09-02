// src/js/core.js
// Punto de entrada de Mizu Coder v2.1.0
// Carga los módulos estables y de desarrollo

console.log('✅ Mizu Coder: core.js cargado correctamente');

// Verificar que el DOM esté listo antes de importar e inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

function initApp() {
    console.log('🟢 Mizu Coder: DOM completamente cargado y listo');

    // Objeto principal de la app
    const app = {
        currentMode: 'unified',
        tabs: []
    };

    // Cargar módulos
    Promise.all([
        import('./stable/stable.js'),
        import('./dev/dev.js')
    ])
    .then(([{ setupStableFeatures }, { setupDevFeatures }]) => {
        // Inicializar funcionalidades estables
        setupStableFeatures(app);
        console.log('🔵 Mizu Coder: Funcionalidades estables inicializadas');

        // Inicializar funcionalidades en desarrollo
        setupDevFeatures(app);
        console.log('🟢 Mizu Coder: Modo desarrollo activado (pestañas dinámicas, modo Mizu)');

        // Exponer app para depuración (opcional)
        window.mizuCoder = app;
    })
    .catch(err => {
        console.error('❌ Error al cargar módulos:', err);
    });
}

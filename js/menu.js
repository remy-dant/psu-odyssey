(function () {
    const STORAGE_KEY = 'collapsedModules';
    // Récupère l'état sauvegardé (liste des IDs de modules fermés)
    let collapsed = [];
    try {
        collapsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        if (!Array.isArray(collapsed)) collapsed = [];
    } catch (e) { collapsed = []; }

    const headers = document.querySelectorAll('.moduletable_menu h3, .moduletable h3');
    const usedIds = new Set();

    function buildId(h3, index) {
        let base = (h3.textContent || 'module').trim().toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9_-]/g, '');
        if (!base) base = 'module';
        let candidate = base;
        let i = 1;
        while (usedIds.has(candidate)) {
            candidate = base + '-' + (++i);
        }
        usedIds.add(candidate);
        return candidate;
    }

    headers.forEach((h3, idx) => {
        if (!h3.classList.contains('mod-collapse')) {
            h3.classList.add('mod-collapse');
        }
        // Assigner un id stable (data attribut) si absent
        if (!h3.dataset.moduleId) {
            h3.dataset.moduleId = buildId(h3, idx);
        }
        const id = h3.dataset.moduleId;
        if (collapsed.includes(id)) {
            h3.classList.add('collapsed');
        }
        h3.addEventListener('click', () => {
            h3.classList.toggle('collapsed');
            const isCollapsed = h3.classList.contains('collapsed');
            if (isCollapsed) {
                if (!collapsed.includes(id)) collapsed.push(id);
            } else {
                collapsed = collapsed.filter(x => x !== id);
            }
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(collapsed));
            } catch (e) {
                // stockage plein ou privé : ignorer silencieusement
            }
        });
    });
})();

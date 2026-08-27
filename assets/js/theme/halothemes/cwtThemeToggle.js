/**
 * Chrome World Trucks — dark / light theme toggle
 * Persists choice in localStorage under `cwt-theme`.
 */
export default function cwtThemeToggle() {
    const root = document.documentElement;
    const storageKey = 'cwt-theme';

    function getTheme() {
        const attr = root.getAttribute('data-theme');
        if (attr === 'light' || attr === 'dark') {
            return attr;
        }
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored === 'light' || stored === 'dark') {
                return stored;
            }
        } catch (e) { /* ignore */ }
        return 'dark';
    }

    function setTheme(theme) {
        const next = theme === 'light' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try {
            localStorage.setItem(storageKey, next);
        } catch (e) { /* ignore */ }

        document.querySelectorAll('[data-cwt-theme-toggle]').forEach((btn) => {
            btn.setAttribute('aria-pressed', next === 'light' ? 'true' : 'false');
            btn.setAttribute(
                'aria-label',
                next === 'light' ? 'Switch to dark theme' : 'Switch to light theme'
            );
            btn.title = next === 'light' ? 'Switch to dark theme' : 'Switch to light theme';
        });
    }

    setTheme(getTheme());

    $(document.body).on('click', '[data-cwt-theme-toggle]', (event) => {
        event.preventDefault();
        const current = getTheme();
        setTheme(current === 'light' ? 'dark' : 'light');
    });
}

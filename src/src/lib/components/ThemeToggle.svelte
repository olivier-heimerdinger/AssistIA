<script lang="ts">
    import { theme, type ThemeType } from "$lib/stores/theme";

    // Computed property (assuming Svelte 5 with $theme store reference)
    let currentMode = $derived($theme);

    function setMode(mode: ThemeType) {
        theme.setTheme(mode);
    }
</script>

<div class="theme-toggle">
    <button
        class="toggle-btn {currentMode === 'light' ? 'active' : ''}"
        onclick={() => setMode("light")}
        title="Mode Clair"
    >
        ☀️
    </button>
    <button
        class="toggle-btn {currentMode === 'auto' ? 'active' : ''}"
        onclick={() => setMode("auto")}
        title="Thème Auto (Système)"
    >
        ⚙️
    </button>
    <button
        class="toggle-btn {currentMode === 'dark' ? 'active' : ''}"
        onclick={() => setMode("dark")}
        title="Mode Sombre"
    >
        🌙
    </button>
</div>

<style>
    .theme-toggle {
        display: flex;
        background: var(--color-surface-2, rgba(0, 0, 0, 0.05));
        border-radius: 999px;
        padding: 0.25rem;
        gap: 0.25rem;
    }

    .toggle-btn {
        background: transparent;
        border: none;
        border-radius: 999px;
        padding: 0.4rem 0.6rem;
        cursor: pointer;
        font-size: 1rem;
        transition:
            background 0.2s,
            transform 0.1s;
        opacity: 0.6;
    }

    .toggle-btn:hover {
        opacity: 0.9;
        background: rgba(0, 0, 0, 0.05);
    }

    .toggle-btn.active {
        opacity: 1;
        background: var(--color-surface, white);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transform: scale(1.05);
    }

    /* Dark mode specifics for the toggle button itself if using CSS variables */
    :global([data-theme="dark"]) .toggle-btn:hover {
        background: rgba(255, 255, 255, 0.1);
    }
    :global([data-theme="dark"]) .toggle-btn.active {
        background: rgba(255, 255, 255, 0.15);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
</style>

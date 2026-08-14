<script lang="ts">
    import { builderStore } from "$lib/builder/store.svelte";
    import { uiStore } from "$lib/stores/ui.svelte";
    import { enhance } from "$app/forms";
    import type { SubmitFunction } from "@sveltejs/kit";

    let saving = $state(false);

    const handleSave: SubmitFunction = ({ formData }) => {
        saving = true;

        // Attach the current AST to the form submission
        formData.set("blocks", builderStore.toJSON());

        return async ({ result, update }) => {
            saving = false;
            // Optionnel: afficher un toast de succès ici
            if (result.type === "success") {
                console.log("Sauvegarde réussie");
            }
            await update({ reset: false });
        };
    };
</script>

<header class="builder-toolbar">
    <div class="left">
        <a href="/dashboard/documents" class="btn secondary">
            <span class="icon">←</span>
            Retour
        </a>
        <div class="divider"></div>
        <button
            class="icon-btn"
            class:active={uiStore.showGlobalSidebar}
            onclick={() =>
                (uiStore.showGlobalSidebar = !uiStore.showGlobalSidebar)}
            title="Afficher/Masquer Menu Principal"
        >
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                ><line x1="3" y1="12" x2="21" y2="12"></line><line
                    x1="3"
                    y1="6"
                    x2="21"
                    y2="6"
                ></line><line x1="3" y1="18" x2="21" y2="18"></line></svg
            >
        </button>
        <button
            class="icon-btn"
            class:active={builderStore.uiState.showSidebarLeft}
            onclick={() =>
                (builderStore.uiState.showSidebarLeft =
                    !builderStore.uiState.showSidebarLeft)}
            title="Afficher/Masquer Composants"
        >
            📦
        </button>
        <button
            class="icon-btn"
            class:active={builderStore.uiState.showSidebarRight}
            onclick={() =>
                (builderStore.uiState.showSidebarRight =
                    !builderStore.uiState.showSidebarRight)}
            title="Afficher/Masquer Propriétés"
        >
            🎨
        </button>
        <span class="document-name"
            >{builderStore.rootNode?.name || "Sans titre"}</span
        >
    </div>

    <div class="center">
        <!-- Viewport toggles (Desktop, Tablet, Mobile) could go here -->
        <div class="device-toggles">
            <button class="active">🖥️</button>
            <button>📱</button>
        </div>
    </div>

    <div class="right">
        <button
            class="btn secondary"
            onclick={() => console.log(builderStore.toJSON())}
        >
            Aperçu JSON
        </button>
        <form
            method="POST"
            action="?/save"
            use:enhance={handleSave}
            style="margin: 0;"
        >
            <button type="submit" class="btn primary" disabled={saving}>
                {saving ? "Enregistrement..." : "Sauvegarder"}
            </button>
        </form>
    </div>
</header>

<style>
    .builder-toolbar {
        height: 60px;
        background: var(--color-surface);
        border-bottom: 1px solid var(--color-border);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1rem;
        z-index: 10;
    }

    .left,
    .center,
    .right {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .center {
        flex: 1;
        justify-content: center;
    }

    .document-name {
        font-weight: 600;
        color: var(--color-text);
        font-size: 0.95rem;
    }

    .icon-btn {
        background: transparent;
        border: 1px solid transparent;
        color: var(--color-text-muted);
        border-radius: var(--radius-sm);
        padding: 0.5rem;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .icon-btn:hover {
        background: var(--color-surface-2);
        color: var(--color-text);
    }

    .icon-btn.active {
        color: var(--color-primary);
        background: rgba(108, 99, 255, 0.1);
        border-color: rgba(108, 99, 255, 0.2);
    }

    .device-toggles {
        display: flex;
        gap: 0.25rem;
        background: var(--color-surface-2);
        padding: 0.25rem;
        border-radius: var(--radius-md);
    }

    .device-toggles button {
        background: transparent;
        border: none;
        padding: 0.25rem 0.75rem;
        border-radius: var(--radius-sm);
        cursor: pointer;
        opacity: 0.5;
        transition: all 0.2s;
    }

    .device-toggles button.active,
    .device-toggles button:hover {
        opacity: 1;
        background: var(--color-surface);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .btn {
        padding: 0.5rem 1rem;
        border-radius: var(--radius-sm);
        font-weight: 500;
        font-size: 0.85rem;
        cursor: pointer;
        border: none;
        transition: all 0.2s;
    }

    .btn.primary {
        background: var(--color-primary);
        color: white;
        border-color: var(--color-primary);
    }
    .btn.primary:hover {
        background: var(--color-primary-hover);
    }

    .btn.secondary {
        background: transparent;
        border: 1px solid var(--color-border);
        color: var(--color-text);
    }
    .btn.secondary:hover {
        background: var(--color-surface-2);
    }
</style>

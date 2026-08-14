<script lang="ts">
    import { builderStore } from "$lib/builder/store.svelte";

    function handleDragStart(e: DragEvent, type: string) {
        if (e.dataTransfer) {
            e.dataTransfer.setData("builder/component-type", type);
            e.dataTransfer.effectAllowed = "copy";
        }
    }
</script>

<aside class="sidebar-left">
    <div class="header">Composants</div>
    <div class="component-list">
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            class="component-item"
            draggable="true"
            ondragstart={(e) => handleDragStart(e, "container")}
        >
            <span class="icon">📦</span>
            Conteneur
        </div>
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            class="component-item"
            draggable="true"
            ondragstart={(e) => handleDragStart(e, "text")}
        >
            <span class="icon">T</span>
            Texte
        </div>
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            class="component-item"
            draggable="true"
            ondragstart={(e) => handleDragStart(e, "button")}
        >
            <span class="icon">🔘</span>
            Bouton
        </div>
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            class="component-item"
            draggable="true"
            ondragstart={(e) => handleDragStart(e, "image")}
        >
            <span class="icon">🖼️</span>
            Image
        </div>
    </div>
</aside>

<style>
    .sidebar-left {
        width: 260px;
        background: var(--color-surface);
        border-right: 1px solid var(--color-border);
        display: flex;
        flex-direction: column;
        overflow-y: auto;
    }

    .header {
        padding: 1rem;
        font-weight: 600;
        border-bottom: 1px solid var(--color-border);
        color: var(--color-text);
    }

    .component-list {
        padding: 1rem;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
    }

    .component-item {
        background: var(--color-surface-2);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        padding: 1rem 0.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        cursor: grab;
        user-select: none;
        transition: all 0.2s;
        font-size: 0.85rem;
        color: var(--color-text);
    }

    .component-item:active {
        cursor: grabbing;
    }

    .component-item:hover {
        background: var(--color-surface-3);
        border-color: var(--color-primary);
        color: var(--color-primary);
    }

    .icon {
        font-size: 1.5rem;
    }
</style>

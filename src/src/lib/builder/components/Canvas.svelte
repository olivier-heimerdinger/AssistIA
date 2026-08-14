<script lang="ts">
    import { builderStore } from "$lib/builder/store.svelte";
    import BuilderNode from "./BuilderNode.svelte";

    // The canvas represents the rendered AST body
    const rootNode = $derived(builderStore.rootNode);
</script>

<div class="canvas-wrapper">
    <div class="canvas-container">
        <!-- This represents the simulated browser window / viewport -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            class="canvas-iframe"
            onclick={() => builderStore.selectNode(rootNode.id)}
            class:selected={builderStore.selectedNodeId === rootNode.id}
        >
            <BuilderNode node={rootNode} />
        </div>
    </div>
</div>

<style>
    .canvas-wrapper {
        flex: 1;
        background: var(--color-surface-2);
        display: flex;
        align-items: flex-start;
        justify-content: center;
        overflow: auto;
        padding: 2rem;
    }

    .canvas-container {
        width: 100%;
        max-width: 1200px; /* Optional default device width */
        min-height: calc(100vh - 4rem - 64px); /* Rough calc */
        background: white;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        border-radius: var(--radius-lg);
        overflow: hidden;
        transition: width 0.3s;
    }

    .canvas-iframe {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .canvas-iframe.selected {
        outline: 2px solid var(--color-primary);
        outline-offset: -2px;
    }

    .canvas-iframe.selected {
        outline: 2px solid var(--color-primary);
        outline-offset: -2px;
    }
</style>

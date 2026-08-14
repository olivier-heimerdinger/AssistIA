<script lang="ts">
    import type { PageData } from "./$types";
    import { onMount, onDestroy } from "svelte";
    import { builderStore } from "$lib/builder/store.svelte";

    import BuilderToolbar from "$lib/builder/components/BuilderToolbar.svelte";
    import SidebarLeft from "$lib/builder/components/SidebarLeft.svelte";
    import Canvas from "$lib/builder/components/Canvas.svelte";
    import SidebarRight from "$lib/builder/components/SidebarRight.svelte";

    let { data } = $props<{ data: PageData }>();

    onMount(() => {
        // Hydrate store from DB if available
        if (data.document?.blocks) {
            builderStore.loadFromJSON(data.document.blocks);
        } else {
            // New blank document, initialize Root
            builderStore.rootNode.name = data.document.title || "Body";
        }
    });

    onDestroy(() => {
        // Reset selection on exit
        builderStore.selectNode(null);
    });
</script>

<div class="web-builder-layout">
    <BuilderToolbar />

    <div class="builder-workspace">
        {#if builderStore.uiState.showSidebarLeft}
            <SidebarLeft />
        {/if}

        <Canvas />

        {#if builderStore.uiState.showSidebarRight}
            <SidebarRight />
        {/if}
    </div>
</div>

<style>
    /* Full height layout, preventing document scroll */
    :global(body) {
        margin: 0;
        overflow: hidden;
    }

    .web-builder-layout {
        display: flex;
        flex-direction: column;
        height: 100vh;
        width: 100%;
        background: var(--color-background);
        color: var(--color-text);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif;
    }

    .builder-workspace {
        display: flex;
        flex: 1;
        overflow: hidden; /* Children will scroll independently */
    }
</style>

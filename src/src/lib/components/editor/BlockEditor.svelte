<script lang="ts">
    import type { Block as BlockType } from "$lib/types/editor";
    import Block from "./Block.svelte";
    import SlashMenu from "./SlashMenu.svelte";

    let { blocks = $bindable<BlockType[]>([]) } = $props();

    // Slash Menu State
    let slashMenuState = $state({
        active: false,
        x: 0,
        y: 0,
        query: "",
        blockIndex: -1,
    });

    let slashMenuComponent: any = $state(null);

    function handleSlashCommand(
        index: number,
        query: string | null,
        rect: DOMRect | null,
    ) {
        if (query !== null && rect !== null) {
            slashMenuState.active = true;
            slashMenuState.query = query;
            slashMenuState.blockIndex = index;
            slashMenuState.x = rect.left;
            slashMenuState.y = rect.bottom + window.scrollY + 5;
        } else {
            closeSlashMenu();
        }
    }

    function closeSlashMenu() {
        slashMenuState.active = false;
        slashMenuState.blockIndex = -1;
    }

    function handleSlashSelect(type: BlockType["type"]) {
        if (slashMenuState.blockIndex >= 0) {
            const targetBlock = blocks[slashMenuState.blockIndex];
            targetBlock.type = type;
            targetBlock.content = ""; // Clear the /command text
            blocks[slashMenuState.blockIndex] = targetBlock;
        }
        closeSlashMenu();
    }

    // Drag and Drop State
    let draggedIndex: number | null = $state(null);
    let dropIndicatorIndex: number | null = $state(null);

    function handleDragStart(index: number, event: DragEvent) {
        draggedIndex = index;
        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = "move";
            // Required for Firefox
            event.dataTransfer.setData("text/plain", index.toString());
        }
    }

    function handleDragOver(
        index: number,
        event: DragEvent,
        nodeElem: HTMLElement,
    ) {
        event.preventDefault(); // Necessary to allow dropping
        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = "move";
        }

        const rect = nodeElem.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        if (event.clientY < midY) {
            dropIndicatorIndex = index; // Drop above
        } else {
            dropIndicatorIndex = index + 1; // Drop below
        }
    }

    function handleDrop(event: DragEvent) {
        event.preventDefault();
        if (draggedIndex !== null && dropIndicatorIndex !== null) {
            let targetIndex = dropIndicatorIndex;
            // Adjust index if dragging downwards
            if (draggedIndex < targetIndex) {
                targetIndex -= 1;
            }

            if (draggedIndex !== targetIndex) {
                const newBlocks = [...blocks];
                const [movedBlock] = newBlocks.splice(draggedIndex, 1);
                newBlocks.splice(targetIndex, 0, movedBlock);
                blocks = newBlocks;
            }
        }
        draggedIndex = null;
        dropIndicatorIndex = null;
    }

    function handleDragEnd() {
        draggedIndex = null;
        dropIndicatorIndex = null;
    }

    function handleKeyDown(index: number, event: KeyboardEvent) {
        if (slashMenuState.active && slashMenuComponent) {
            const handled = slashMenuComponent.handleKeyDown(event);
            if (handled) return;
        }

        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            // Split the block or create a new paragraph below it
            const newBlock: BlockType = {
                id: crypto.randomUUID(),
                type: "paragraph",
                content: "",
            };
            const newBlocks = [...blocks];
            newBlocks.splice(index + 1, 0, newBlock);
            blocks = newBlocks;

            // Note: Focus management should be handled here (using tick or actions)
            // For MVP, we simply add the block to the array.
        } else if (event.key === "Backspace" && blocks[index].content === "") {
            event.preventDefault();
            if (blocks.length > 1) {
                const newBlocks = [...blocks];
                newBlocks.splice(index, 1);
                blocks = newBlocks;
                // Note: Focus should move to previous block
            }
        }
    }

    function updateBlockContent(index: number, content: string) {
        blocks[index].content = content;
        // Trigger reactivity for Svelte 5 by assigning the array back if needed,
        // but mutating objects in the array might be enough if deeply reactive.
    }
</script>

{#if slashMenuState.active}
    <SlashMenu
        bind:this={slashMenuComponent}
        x={slashMenuState.x}
        y={slashMenuState.y}
        query={slashMenuState.query}
        onSelect={handleSlashSelect}
        onClose={closeSlashMenu}
    />
{/if}

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    class="block-editor"
    ondragover={(e) => {
        // Allows dropping at the very end of the list if you drag below all blocks
        e.preventDefault();
    }}
>
    {#if blocks.length === 0}
        <button
            class="add-btn"
            onclick={() =>
                (blocks = [
                    { id: crypto.randomUUID(), type: "paragraph", content: "" },
                ])}
        >
            Commencer à écrire...
        </button>
    {/if}

    {#each blocks as block, i (block.id)}
        {#if dropIndicatorIndex === i}
            <div class="drop-indicator"></div>
        {/if}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            class="block-wrapper"
            draggable="true"
            ondragstart={(e) => handleDragStart(i, e)}
            ondragover={(e) =>
                handleDragOver(i, e, e.currentTarget as HTMLElement)}
            ondrop={handleDrop}
            ondragend={handleDragEnd}
            class:dragging={draggedIndex === i}
        >
            <div class="drag-handle" title="Glisser pour déplacer">⋮⋮</div>

            <Block
                bind:block={blocks[i]}
                onkeydown={(e: KeyboardEvent) => handleKeyDown(i, e)}
                oncontentchange={(content: string) =>
                    updateBlockContent(i, content)}
                onslashcommand={(query, rect) =>
                    handleSlashCommand(i, query, rect)}
            />
        </div>
    {/each}
    {#if dropIndicatorIndex === blocks.length}
        <div class="drop-indicator"></div>
    {/if}
</div>

<style>
    .block-editor {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding: 1rem 0;
        max-width: 800px;
        margin: 0 auto;
    }

    .block-wrapper {
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
        position: relative;
        padding-left: 1.5rem;
        border-radius: 4px;
        transition: background 0.2s;
    }

    .block-wrapper.dragging {
        opacity: 0.5;
        background: var(--color-surface-2);
    }

    .drag-handle {
        position: absolute;
        left: 0;
        top: 0.25rem;
        opacity: 0;
        cursor: grab;
        color: var(--color-text-muted);
        user-select: none;
        padding: 0.1rem 0.2rem;
        border-radius: 4px;
        transition:
            opacity 0.2s,
            background 0.2s;
        font-size: 1.2rem;
        line-height: 1;
    }

    .drag-handle:active {
        cursor: grabbing;
    }

    .drag-handle:hover {
        background: var(--color-surface-2);
    }

    .block-wrapper:hover .drag-handle {
        opacity: 1;
    }

    .add-btn {
        background: transparent;
        border: 1px dashed var(--color-border);
        color: var(--color-text-muted);
        padding: 1rem;
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: all 0.2s;
        text-align: left;
    }

    .add-btn:hover {
        border-color: var(--color-primary);
        color: var(--color-primary);
    }

    .drop-indicator {
        height: 2px;
        background: var(--color-primary, #6c63ff); /* using implicit default */
        margin: 2px 0;
        border-radius: 2px;
        transition: all 0.2s;
        box-shadow: 0 0 4px rgba(108, 99, 255, 0.5);
    }
</style>

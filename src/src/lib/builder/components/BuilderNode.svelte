<script lang="ts">
    import type { BuilderNode as BuilderNodeType } from "$lib/builder/types";
    import { builderStore } from "$lib/builder/store.svelte";
    import BuilderNode from "./BuilderNode.svelte";

    // We bind to the specific node we are rendering
    let { node } = $props<{ node: BuilderNodeType }>();

    // Derived state for selection
    const isSelected = $derived(builderStore.selectedNodeId === node.id);

    // Dynamic style computation
    function compileStyles(styles: Record<string, string | undefined>): string {
        return Object.entries(styles)
            .filter(([_, v]) => v !== undefined)
            .map(
                ([k, v]) =>
                    `${k.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}:${v}`,
            )
            .join(";");
    }

    // Drag inside canvas
    function handleDragStart(e: DragEvent) {
        e.stopPropagation();
        if (e.dataTransfer) {
            e.dataTransfer.setData("builder/node-id", node.id);
            builderStore.dragState.draggedNodeId = node.id;
        }
    }

    function handleDragOver(e: DragEvent) {
        e.stopPropagation();
        e.preventDefault(); // Must prevent default to allow drop

        // Calculate drop cursor indicators (top/bottom/inside)
        // For simplicity in MVP, if it's a container, we drop inside.
        builderStore.dragState.targetNodeId = node.id;
        if (node.type === "container" || node.type === "canvas") {
            builderStore.dragState.dropPosition = "inside";
        } else {
            // Need bounding box logic to determine top/bottom
            const rect = (
                e.currentTarget as HTMLElement
            ).getBoundingClientRect();
            const mid = rect.top + rect.height / 2;
            builderStore.dragState.dropPosition =
                e.clientY < mid ? "top" : "bottom";
        }
    }

    function handleDragLeave(e: DragEvent) {
        e.stopPropagation();
        if (builderStore.dragState.targetNodeId === node.id) {
            builderStore.dragState.targetNodeId = null;
            builderStore.dragState.dropPosition = null;
        }
    }

    function handleDrop(e: DragEvent) {
        e.stopPropagation();
        e.preventDefault();

        const typeStr = e.dataTransfer?.getData("builder/component-type");
        const existingNodeId = e.dataTransfer?.getData("builder/node-id");

        const dropTargetId = builderStore.dragState.targetNodeId;
        const position = builderStore.dragState.dropPosition;

        if (!dropTargetId || !position) return;

        if (typeStr) {
            // New component from sidebar
            const newNode: BuilderNodeType = {
                id: crypto.randomUUID(),
                type: typeStr as any,
                name: "New " + typeStr,
                classes: [],
                styles: { padding: "10px", minHeight: "20px" }, // Default sensible styles
                attributes: {},
                children: [],
            };

            if (typeStr === "text") {
                newNode.content = "Nouveau texte";
            }
            if (typeStr === "button") {
                newNode.content = "Cliquez-moi";
                newNode.styles.backgroundColor = "var(--color-primary)";
                newNode.styles.color = "white";
                newNode.styles.borderRadius = "4px";
                newNode.styles.display = "inline-block";
                newNode.styles.textAlign = "center";
            }

            builderStore.insertNode(newNode, dropTargetId, position);
        } else if (existingNodeId) {
            // Moving an existing component
            const movingNode = builderStore.findNode(existingNodeId);
            if (movingNode && movingNode.id !== dropTargetId) {
                // Prevent infinite loop (dragging parent into its child)
                const isChildDrop = builderStore.findNode(
                    dropTargetId,
                    movingNode,
                );
                if (!isChildDrop) {
                    builderStore.insertNode(movingNode, dropTargetId, position);
                }
            }
        }

        // Reset drag state
        builderStore.dragState.draggedNodeId = null;
        builderStore.dragState.targetNodeId = null;
        builderStore.dragState.dropPosition = null;
    }

    function handleClick(e: MouseEvent) {
        e.stopPropagation();
        builderStore.selectNode(node.id);
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
{#if node.type === "container" || node.type === "canvas"}
    <div
        class="builder-node {node.classes.join(' ')}"
        class:selected={isSelected}
        class:drop-target={builderStore.dragState.targetNodeId === node.id}
        class:drop-inside={builderStore.dragState.targetNodeId === node.id &&
            builderStore.dragState.dropPosition === "inside"}
        style={compileStyles(node.styles)}
        draggable={node.type !== "canvas"}
        ondragstart={node.type !== "canvas" ? handleDragStart : undefined}
        ondragover={handleDragOver}
        ondragleave={handleDragLeave}
        ondrop={handleDrop}
        onclick={handleClick}
        data-node-id={node.id}
    >
        {#if builderStore.dragState.targetNodeId === node.id && builderStore.dragState.dropPosition === "top"}
            <div class="drop-indicator horizontal"></div>
        {/if}

        {#each node.children as child}
            <BuilderNode node={child} />
        {/each}

        <!-- Empty placeholder -->
        {#if node.children.length === 0 && node.type !== "canvas"}
            <div class="empty-placeholder">Container vide</div>
        {/if}

        {#if builderStore.dragState.targetNodeId === node.id && builderStore.dragState.dropPosition === "bottom"}
            <div class="drop-indicator horizontal bottom"></div>
        {/if}
    </div>
{:else if node.type === "text"}
    <div
        class="builder-node {node.classes.join(' ')}"
        class:selected={isSelected}
        style={compileStyles(node.styles)}
        draggable="true"
        ondragstart={handleDragStart}
        ondragover={handleDragOver}
        ondragleave={handleDragLeave}
        ondrop={handleDrop}
        onclick={handleClick}
        data-node-id={node.id}
    >
        {#if builderStore.dragState.targetNodeId === node.id && builderStore.dragState.dropPosition === "top"}
            <div class="drop-indicator horizontal"></div>
        {/if}

        <!-- Inline editing MVP: contenteditable -->
        <div
            contenteditable={isSelected}
            onblur={(e) =>
                builderStore.updateNodeContent(
                    node.id,
                    e.currentTarget.innerHTML,
                )}
        >
            {@html node.content || "Nouveau texte"}
        </div>

        {#if builderStore.dragState.targetNodeId === node.id && builderStore.dragState.dropPosition === "bottom"}
            <div class="drop-indicator horizontal bottom"></div>
        {/if}
    </div>
{:else if node.type === "button"}
    <div
        class="builder-node {node.classes.join(' ')}"
        class:selected={isSelected}
        style={compileStyles(node.styles)}
        draggable="true"
        ondragstart={handleDragStart}
        ondragover={handleDragOver}
        ondragleave={handleDragLeave}
        ondrop={handleDrop}
        onclick={handleClick}
        data-node-id={node.id}
    >
        {#if builderStore.dragState.targetNodeId === node.id && builderStore.dragState.dropPosition === "top"}
            <div class="drop-indicator horizontal"></div>
        {/if}

        <button style="all: inherit;">{node.content || "Bouton"}</button>

        {#if builderStore.dragState.targetNodeId === node.id && builderStore.dragState.dropPosition === "bottom"}
            <div class="drop-indicator horizontal bottom"></div>
        {/if}
    </div>
{:else if node.type === "image"}
    <div
        class="builder-node {node.classes.join(' ')}"
        class:selected={isSelected}
        draggable="true"
        ondragstart={handleDragStart}
        ondragover={handleDragOver}
        ondragleave={handleDragLeave}
        ondrop={handleDrop}
        onclick={handleClick}
        data-node-id={node.id}
    >
        {#if builderStore.dragState.targetNodeId === node.id && builderStore.dragState.dropPosition === "top"}
            <div class="drop-indicator horizontal"></div>
        {/if}

        <img
            src={node.attributes.src ||
                "https://placehold.co/400x300?text=Image"}
            alt={node.attributes.alt || "Image"}
            style="{compileStyles(
                node.styles,
            )}; max-width: 100%; display: block;"
        />

        {#if builderStore.dragState.targetNodeId === node.id && builderStore.dragState.dropPosition === "bottom"}
            <div class="drop-indicator horizontal bottom"></div>
        {/if}
    </div>
{:else}
    <!-- Fallback for generic node types -->
    <div class="builder-node" onclick={handleClick} class:selected={isSelected}>
        [Unsupported Node Type: {node.type}]
    </div>
{/if}

<style>
    .builder-node {
        position: relative;
        box-sizing: border-box;
        transition: outline 0.1s ease;
    }

    /* Hover outline for everything inside canvas */
    :global(.canvas-wrapper) .builder-node:hover {
        outline: 1px dashed rgba(108, 99, 255, 0.4);
        outline-offset: -1px;
    }

    /* Selected state */
    .builder-node.selected {
        outline: 2px solid var(--color-primary) !important;
        outline-offset: -2px;
    }

    /* Visual indicators for drag and drop */
    .drop-inside {
        background-color: rgba(108, 99, 255, 0.1) !important;
        outline: 2px dashed var(--color-primary) !important;
        outline-offset: -2px;
    }

    .drop-indicator.horizontal {
        position: absolute;
        top: -2px;
        left: 0;
        right: 0;
        height: 4px;
        background-color: var(--color-primary);
        z-index: 100;
        border-radius: 2px;
    }

    .drop-indicator.horizontal.bottom {
        top: auto;
        bottom: -2px;
    }

    .empty-placeholder {
        padding: 1rem;
        background: rgba(0, 0, 0, 0.02);
        border: 1px dashed rgba(0, 0, 0, 0.1);
        text-align: center;
        color: rgba(0, 0, 0, 0.3);
        font-size: 0.8rem;
        user-select: none;
    }
</style>

<script lang="ts">
    import type { Block as BlockType } from "$lib/types/editor";

    let {
        block = $bindable<BlockType>(),
        onkeydown,
        oncontentchange,
        onslashcommand,
    } = $props<{
        block: BlockType;
        onkeydown: (e: KeyboardEvent) => boolean | void;
        oncontentchange: (content: string) => void;
        onslashcommand?: (query: string | null, rect: DOMRect | null) => void;
    }>();

    let contentEditableElement: HTMLElement | null = $state(null);

    // Handle input to sync state
    function handleInput(event: Event) {
        const target = event.target as HTMLElement;
        block.content = target.innerHTML;
        if (oncontentchange) oncontentchange(block.content);

        // Check for slash command
        const text = target.innerText;
        if (text.startsWith("/") && onslashcommand) {
            const query = text.slice(1);

            // Try to get cursor position
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                onslashcommand(query, rect);
            } else {
                onslashcommand(query, target.getBoundingClientRect());
            }
        } else if (onslashcommand) {
            onslashcommand(null, null);
        }
    }

    function handleKeyUp(event: KeyboardEvent) {
        // We removed the hardcoded slash commands from here since the SlashMenu handles them now.
        // We leave this function to handle any future block-specific fast-formatting if needed.
    }

    // Auto-focus logic can be tricky, relying on element reference for now
    $effect(() => {
        if (
            contentEditableElement &&
            document.activeElement !== contentEditableElement
        ) {
            // We don't want to constantly update innerHTML if focused because it resets cursor
            if (contentEditableElement.innerHTML !== block.content) {
                contentEditableElement.innerHTML = block.content;
            }
        }
    });
</script>

<div class="block-container" class:heading={block.type.startsWith("h")}>
    {#if block.type === "h1"}
        <!-- svelte-ignore a11y_missing_content -->
        <h1
            bind:this={contentEditableElement}
            contenteditable="true"
            {onkeydown}
            onkeyup={handleKeyUp}
            oninput={handleInput}
            data-placeholder="Titre 1"
        ></h1>
    {:else if block.type === "h2"}
        <!-- svelte-ignore a11y_missing_content -->
        <h2
            bind:this={contentEditableElement}
            contenteditable="true"
            {onkeydown}
            onkeyup={handleKeyUp}
            oninput={handleInput}
            data-placeholder="Titre 2"
        ></h2>
    {:else if block.type === "h3"}
        <!-- svelte-ignore a11y_missing_content -->
        <h3
            bind:this={contentEditableElement}
            contenteditable="true"
            {onkeydown}
            onkeyup={handleKeyUp}
            oninput={handleInput}
            data-placeholder="Titre 3"
        ></h3>
    {:else if block.type === "ul"}
        <!-- svelte-ignore a11y_missing_content -->
        <li
            bind:this={contentEditableElement}
            contenteditable="true"
            {onkeydown}
            onkeyup={handleKeyUp}
            oninput={handleInput}
            data-placeholder="Élément de liste"
        ></li>
    {:else}
        <!-- svelte-ignore a11y_missing_content -->
        <p
            bind:this={contentEditableElement}
            contenteditable="true"
            {onkeydown}
            onkeyup={handleKeyUp}
            oninput={handleInput}
            data-placeholder="Tapez '/' pour les commandes"
        ></p>
    {/if}
</div>

<style>
    .block-container {
        flex: 1;
        min-width: 0; /* Prevent flex overflow */
    }

    [contenteditable="true"] {
        outline: none;
        padding: 0.25rem 0.5rem;
        margin: 0;
        border-radius: 4px;
        transition: background 0.2s;
        min-height: 1.5em;
        line-height: 1.5;
    }

    [contenteditable="true"]:empty::before {
        content: attr(data-placeholder);
        color: var(--color-text-muted);
        opacity: 0.6;
        pointer-events: none;
        display: block; /* For empty state */
    }

    [contenteditable="true"]:hover {
        background: rgba(108, 99, 255, 0.03);
    }

    [contenteditable="true"]:focus {
        background: rgba(108, 99, 255, 0.05);
    }

    h1,
    h2,
    h3,
    p,
    li {
        color: var(--color-text);
        font-family: inherit;
    }

    h1 {
        font-size: 2rem;
        font-weight: 700;
        margin-top: 1rem;
    }
    h2 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-top: 0.75rem;
    }
    h3 {
        font-size: 1.25rem;
        font-weight: 600;
        margin-top: 0.5rem;
    }
    p {
        font-size: 1rem;
    }
    li {
        font-size: 1rem;
        margin-left: 1.5rem;
        list-style-type: disc;
    }
</style>

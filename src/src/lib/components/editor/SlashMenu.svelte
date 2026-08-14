<script lang="ts">
    import { onMount } from "svelte";
    import type { BlockType } from "$lib/types/editor";

    let {
        x = 0,
        y = 0,
        query = "",
        onSelect,
        onClose,
    } = $props<{
        x: number;
        y: number;
        query: string;
        onSelect: (type: BlockType) => void;
        onClose: () => void;
    }>();

    const options = [
        {
            label: "Texte",
            type: "paragraph",
            icon: "¶",
            desc: "Commencer à écrire",
        },
        {
            label: "Titre 1",
            type: "h1",
            icon: "H1",
            desc: "Grand titre de section",
        },
        {
            label: "Titre 2",
            type: "h2",
            icon: "H2",
            desc: "Titre de section moyen",
        },
        {
            label: "Titre 3",
            type: "h3",
            icon: "H3",
            desc: "Petit titre de section",
        },
        {
            label: "Liste à puces",
            type: "ul",
            icon: "•",
            desc: "Créer une liste simple",
        },
    ] as const;

    let selectedIndex = $state(0);
    let menuElement: HTMLElement;

    // Filter options based on query
    let filteredOptions = $derived(
        options.filter(
            (opt) =>
                opt.label.toLowerCase().includes(query.toLowerCase()) ||
                opt.type.includes(query.toLowerCase()),
        ),
    );

    // Reset selection when query changes
    $effect(() => {
        query;
        selectedIndex = 0;
    });

    onMount(() => {
        // Adjust position if it goes off screen
        if (menuElement) {
            const rect = menuElement.getBoundingClientRect();
            if (rect.bottom > window.innerHeight) {
                // Approximate height, ideally measure it
                y = y - rect.height - 40;
            }
        }
    });

    export function handleKeyDown(e: KeyboardEvent) {
        if (!filteredOptions.length) return false;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            selectedIndex = (selectedIndex + 1) % filteredOptions.length;
            return true;
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            selectedIndex =
                (selectedIndex - 1 + filteredOptions.length) %
                filteredOptions.length;
            return true;
        } else if (e.key === "Enter") {
            e.preventDefault();
            onSelect(filteredOptions[selectedIndex].type);
            return true;
        } else if (e.key === "Escape") {
            e.preventDefault();
            onClose();
            return true;
        }
        return false;
    }
</script>

<div
    bind:this={menuElement}
    class="slash-menu"
    style="left: {x}px; top: {y}px;"
>
    {#if filteredOptions.length === 0}
        <div class="empty">Aucun résultat</div>
    {:else}
        {#each filteredOptions as option, i}
            <button
                class="menu-item"
                class:selected={i === selectedIndex}
                onmouseenter={() => (selectedIndex = i)}
                onclick={() => onSelect(option.type)}
            >
                <div class="icon">{option.icon}</div>
                <div class="details">
                    <span class="label">{option.label}</span>
                    <span class="desc">{option.desc}</span>
                </div>
            </button>
        {/each}
    {/if}
</div>

<style>
    .slash-menu {
        position: fixed;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        padding: 0.5rem;
        min-width: 280px;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .empty {
        padding: 1rem;
        text-align: center;
        color: var(--color-text-muted);
        font-size: 0.9rem;
    }

    .menu-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem 0.75rem;
        background: transparent;
        border: none;
        border-radius: var(--radius-sm);
        cursor: pointer;
        text-align: left;
        width: 100%;
        transition: background 0.1s;
    }

    .menu-item.selected {
        background: var(--color-surface-2);
    }

    .menu-item:hover {
        background: var(--color-surface-2);
    }

    .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        place-items: center;
        width: 2rem;
        height: 2rem;
        background: var(--color-surface-1);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        font-weight: bold;
        color: var(--color-text);
        font-size: 0.9rem;
    }

    .details {
        display: flex;
        flex-direction: column;
    }

    .label {
        color: var(--color-text);
        font-weight: 500;
        font-size: 0.95rem;
    }

    .desc {
        color: var(--color-text-muted);
        font-size: 0.8rem;
    }
</style>

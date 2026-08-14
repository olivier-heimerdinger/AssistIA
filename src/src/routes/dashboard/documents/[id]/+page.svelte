<script lang="ts">
    import { enhance } from "$app/forms";
    import BlockEditor from "$lib/components/editor/BlockEditor.svelte";
    import type { Block } from "$lib/types/editor";

    let { data, form } = $props();

    // svelte-ignore state_referenced_locally
    let documentId = data.document.id;
    // svelte-ignore state_referenced_locally
    let title = $state(data.document.title);
    // svelte-ignore state_referenced_locally
    let blocks = $state<Block[]>(data.document.blocks);

    let isSaving = $state(false);
    let saveTimeout: any;

    // Optional Auto-save logic (debounced)
    $effect(() => {
        // We use stringify to deeply watch for changes (a bit hacky but works for MVP)
        const currentBlocks = JSON.stringify(blocks);
        const currentTitle = title;

        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            // Uncomment to auto-submit form
            // document.getElementById('save-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }, 3000);
    });
</script>

<svelte:head>
    <title>{title || "Sans titre"} - Éditeur AssistIA</title>
</svelte:head>

<div class="editor-layout">
    <header class="editor-header">
        <div class="header-left">
            <a href="/dashboard/documents" class="btn-back">← Retour</a>

            <form
                id="save-form"
                method="POST"
                action="?/save"
                use:enhance={() => {
                    isSaving = true;
                    return async ({ update }) => {
                        await update({ reset: false });
                        isSaving = false;
                    };
                }}
            >
                <input type="hidden" name="title" value={title} />
                <input
                    type="hidden"
                    name="blocks"
                    value={JSON.stringify(blocks)}
                />
                <button
                    class="btn btn-primary btn-sm"
                    type="submit"
                    disabled={isSaving}
                >
                    {#if isSaving}
                        Enregistrement...
                    {:else if form?.success}
                        ✔️ Enregistré
                    {:else}
                        Enregistrer
                    {/if}
                </button>
            </form>
        </div>

        <div class="header-right">
            <form method="POST" action="?/delete" use:enhance>
                <button
                    class="btn btn-danger btn-sm"
                    type="submit"
                    onclick={(e) => {
                        if (!confirm("Supprimer ce document ?"))
                            e.preventDefault();
                    }}>Corbeille</button
                >
            </form>
        </div>
    </header>

    {#if form?.error}
        <div class="error-banner">{form.error}</div>
    {/if}

    <main class="editor-content">
        <input
            class="doc-title-input"
            bind:value={title}
            placeholder="Titre du document..."
            autocomplete="off"
        />

        <BlockEditor bind:blocks />
    </main>
</div>

<style>
    .editor-layout {
        display: flex;
        flex-direction: column;
        min-height: calc(100vh - 100px); /* Adjust based on global layout */
        background: var(--color-surface);
        border-radius: var(--radius-md);
        border: 1px solid var(--color-border);
        box-shadow: var(--shadow-card);
        overflow: hidden;
    }

    .editor-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.5rem;
        background: var(--color-surface-2);
        border-bottom: 1px solid var(--color-border);
    }

    .header-left,
    .header-right {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .btn-back {
        text-decoration: none;
        color: var(--color-text-muted);
        font-weight: 500;
        font-size: 0.95rem;
        transition: color 0.2s;
    }

    .btn-back:hover {
        color: var(--color-text);
    }

    .btn {
        padding: 0.4rem 0.8rem;
        border-radius: var(--radius-sm);
        font-weight: 600;
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.2s;
        border: 1px solid transparent;
        font-family: inherit;
    }

    .btn-primary {
        background: var(--color-primary);
        color: white;
    }

    .btn-primary:hover:not(:disabled) {
        opacity: 0.9;
        box-shadow: 0 4px 12px var(--color-primary-glow);
    }

    .btn-danger {
        background: transparent;
        color: var(--color-error);
        border-color: var(--color-error);
    }

    .btn-danger:hover {
        background: rgba(229, 62, 62, 0.1);
    }

    .btn:disabled {
        opacity: 0.7;
        cursor: wait;
    }

    .error-banner {
        background: rgba(229, 62, 62, 0.1);
        color: var(--color-error);
        padding: 0.75rem 1.5rem;
        border-bottom: 1px solid var(--color-error);
        font-size: 0.9rem;
    }

    .editor-content {
        padding: 2rem 10% 4rem;
        flex: 1;
        overflow-y: auto;
    }

    .doc-title-input {
        width: 100%;
        font-size: 2.5rem;
        font-weight: 800;
        color: var(--color-text);
        background: transparent;
        border: none;
        outline: none;
        padding: 0;
        margin-bottom: 2rem;
        font-family: inherit;
    }

    .doc-title-input::placeholder {
        color: var(--color-text-muted);
        opacity: 0.5;
    }
</style>

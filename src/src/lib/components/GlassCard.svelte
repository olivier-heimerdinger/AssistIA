<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        title,
        headerAction,
        footer,
        children,
        class: className = "",
    }: {
        title?: string;
        headerAction?: Snippet;
        footer?: Snippet;
        children: Snippet;
        class?: string;
    } = $props();
</script>

<div class="widget glass-card {className}">
    {#if title || headerAction}
        <div class="widget-header">
            {#if title}
                <h3>{title}</h3>
            {/if}
            {#if headerAction}
                {@render headerAction()}
            {/if}
        </div>
    {/if}

    <div class="widget-body">
        {@render children()}
    </div>

    {#if footer}
        <div class="widget-footer">
            {@render footer()}
        </div>
    {/if}
</div>

<style>
    .glass-card {
        background: rgba(255, 255, 255, 0.6);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.8);
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 8px 32px rgba(31, 38, 135, 0.05);
        display: flex;
        flex-direction: column;
        transition: box-shadow 0.2s;
    }

    .glass-card:hover {
        box-shadow:
            0 0 0 3px rgba(0, 123, 255, 0.15),
            0 8px 32px rgba(31, 38, 135, 0.05);
    }

    .widget-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
    }

    .widget-header h3 {
        margin: 0;
        font-size: 1.1rem;
        color: #2d3748;
        font-weight: 600;
    }

    .widget-body {
        flex: 1;
    }

    .widget-footer {
        display: flex;
        gap: 0.75rem;
        margin-top: 1.5rem;
    }
</style>

<script lang="ts">
    import { enhance } from "$app/forms";

    let { data } = $props();
</script>

<svelte:head>
    <title>Documents - AssistIA</title>
</svelte:head>

<div class="dashboard-header">
    <div class="title-section">
        <h1>Documents</h1>
        <p class="subtitle">Gérez vos rapports, notes et modèles.</p>
    </div>
    <div class="actions-section">
        <form method="POST" action="?/create" use:enhance>
            <button class="btn btn-primary" type="submit"
                >+ Nouveau Document</button
            >
        </form>
    </div>
</div>

<div class="documents-grid">
    {#each data.documents as doc}
        <a href="/dashboard/documents/{doc.id}" class="doc-card glass-box">
            <div class="doc-icon">📄</div>
            <div class="doc-info">
                <h3>{doc.title}</h3>
                <span class="doc-date"
                    >Modifié le {new Date(
                        doc.updatedAt,
                    ).toLocaleDateString()}</span
                >
            </div>
        </a>
    {:else}
        <div class="empty-state glass-box">
            <p>Aucun document pour le moment.</p>
            <form method="POST" action="?/create" use:enhance>
                <button class="btn btn-secondary mt-4" type="submit"
                    >Créer votre premier document</button
                >
            </form>
        </div>
    {/each}
</div>

<style>
    .dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 2rem;
    }

    .title-section h1 {
        font-size: 2rem;
        font-weight: 700;
        color: var(--color-text);
        margin: 0 0 0.5rem 0;
    }

    .subtitle {
        color: var(--color-text-muted);
        font-size: 1.1rem;
        margin: 0;
    }

    .btn {
        padding: 0.6rem 1.2rem;
        border-radius: var(--radius-sm);
        font-weight: 600;
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.2s;
        border: 1px solid transparent;
        font-family: inherit;
    }

    .btn-primary {
        background: var(--color-primary);
        color: white;
    }

    .btn-primary:hover {
        opacity: 0.9;
        box-shadow: 0 4px 12px var(--color-primary-glow);
    }

    .btn-secondary {
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        color: var(--color-text);
    }

    .btn-secondary:hover {
        background: var(--color-surface-2);
    }

    .mt-4 {
        margin-top: 1rem;
    }

    /* Documents Grid */
    .documents-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.5rem;
    }

    .glass-box {
        background: var(--glass-bg);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-md);
        padding: 1.5rem;
        box-shadow: var(--shadow-card);
    }

    .doc-card {
        display: flex;
        align-items: center;
        gap: 1rem;
        text-decoration: none;
        color: inherit;
        transition:
            transform 0.2s,
            box-shadow 0.2s,
            border-color 0.2s;
    }

    .doc-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
        border-color: var(--color-primary-glow);
    }

    .doc-icon {
        font-size: 2.5rem;
        line-height: 1;
        opacity: 0.8;
    }

    .doc-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .doc-info h3 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--color-text);
    }

    .doc-date {
        font-size: 0.85rem;
        color: var(--color-text-muted);
    }

    .empty-state {
        grid-column: 1 / -1;
        text-align: center;
        padding: 4rem 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .empty-state p {
        color: var(--color-text-muted);
        font-size: 1.1rem;
        margin: 0;
    }
</style>

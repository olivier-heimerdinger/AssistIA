<script lang="ts">
    import { fade, fly } from "svelte/transition";

    let { appointment = $bindable(), isOpen = $bindable(false) } = $props();

    let isGenerating = $state(false);
    let isEditing = $state(false);
    let isSaving = $state(false);
    let generatedSummary = $state("");
    let draftSummary = $state("");
    let errorMsg = $state("");

    function closePanel() {
        isOpen = false;
        isEditing = false;
        generatedSummary = "";
        draftSummary = "";
        errorMsg = "";
    }

    async function generateSummary() {
        if (!appointment.notes) return;

        isGenerating = true;
        errorMsg = "";

        try {
            const res = await fetch("/api/generate-summary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: appointment.id,
                    notes: appointment.notes,
                    title: appointment.title,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                generatedSummary = data.summary;
                if (appointment) {
                    appointment.summary = data.summary;
                }
            } else {
                errorMsg = data.error || "Erreur de communication avec l'IA.";
            }
        } catch (err) {
            errorMsg =
                "Impossible de joindre le serveur. LM Studio est-il actif ?";
        } finally {
            isGenerating = false;
        }
    }

    async function saveSummary() {
        if (!appointment.id) return;

        isSaving = true;
        errorMsg = "";

        try {
            const res = await fetch("/api/update-summary", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: appointment.id,
                    summary: draftSummary,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                generatedSummary = draftSummary;
                if (appointment) {
                    appointment.summary = draftSummary;
                }
                isEditing = false;
            } else {
                errorMsg = data.error || "Erreur lors de la sauvegarde.";
            }
        } catch (err) {
            errorMsg = "Impossible de joindre le serveur pour sauvegarder.";
        } finally {
            isSaving = false;
        }
    }

    $effect(() => {
        // When panel opens or appointment changes, check if we already have a saved summary
        if (isOpen && appointment && appointment.summary) {
            generatedSummary = appointment.summary;
            draftSummary = appointment.summary;
        } else if (isOpen && appointment && !appointment.summary) {
            generatedSummary = "";
            draftSummary = "";
        }
    });
</script>

{#if isOpen && appointment}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="panel-backdrop" transition:fade onclick={closePanel}></div>

    <aside
        class="details-panel glass-panel"
        transition:fly={{ x: 300, duration: 300 }}
    >
        <div class="panel-header">
            <h2>Détails du Rendez-vous</h2>
            <button class="close-btn" onclick={closePanel}>✕</button>
        </div>

        <div class="panel-content">
            <div class="header-card">
                <span
                    class="status-badge {appointment.status.replace(' ', '-')}"
                >
                    {appointment.status}
                </span>
                <h3>{appointment.title}</h3>
                <p class="time">⏱️ {appointment.time}</p>
                <p class="client">👤 {appointment.clientName}</p>
            </div>

            <div class="section">
                <!-- If we have a generated summary, show it. Otherwise show notes -->
                {#if generatedSummary}
                    <div class="summary-header-row">
                        <h4>Résumé Généré ✨</h4>
                        {#if !isEditing}
                            <button
                                class="btn-icon"
                                onclick={() => {
                                    draftSummary = generatedSummary;
                                    isEditing = true;
                                }}
                                title="Modifier"
                            >
                                ✏️
                            </button>
                        {/if}
                    </div>

                    <div class="summary-area">
                        {#if isEditing}
                            <textarea
                                class="summary-editor"
                                bind:value={draftSummary}
                                rows="8"
                            ></textarea>
                            <div class="editor-actions">
                                <button
                                    class="btn btn-secondary btn-sm"
                                    onclick={() => (isEditing = false)}
                                    disabled={isSaving}>Annuler</button
                                >
                                <button
                                    class="btn btn-primary btn-sm"
                                    onclick={saveSummary}
                                    disabled={isSaving}
                                >
                                    {#if isSaving}
                                        ⏳...
                                    {:else}
                                        Sauvegarder
                                    {/if}
                                </button>
                            </div>
                        {:else}
                            <div class="markdown-preview">
                                {#each generatedSummary.split("\n") as line}
                                    {#if line.startsWith("### ")}
                                        <h5 class="markdown-h3">
                                            {line.replace("### ", "")}
                                        </h5>
                                    {:else if line.trim() === ""}
                                        <br />
                                    {:else if line.startsWith("- ")}
                                        <li class="markdown-li">
                                            {line.replace("- ", "")}
                                        </li>
                                    {:else}
                                        <p class="markdown-p">{line}</p>
                                    {/if}
                                {/each}
                            </div>
                        {/if}
                    </div>
                {:else}
                    <h4>Notes de la Séance</h4>
                    <div class="notes-area">
                        <p>
                            {appointment.notes || "Aucune note pour le moment."}
                        </p>
                    </div>
                {/if}

                {#if errorMsg}
                    <div class="error-msg">
                        <p>⚠️ {errorMsg}</p>
                    </div>
                {/if}

                {#if appointment.status === "terminé" && !generatedSummary}
                    <div class="ai-action-box">
                        <div class="ai-header">
                            <span class="icon">✨</span>
                            <h5>Assistant IA</h5>
                        </div>
                        <p class="ai-desc">
                            Générez un compte-rendu structuré et préparez les
                            documents de suivi pour ce rendez-vous.
                        </p>
                        <button
                            class="btn btn-primary w-full"
                            onclick={generateSummary}
                            disabled={isGenerating}
                        >
                            {#if isGenerating}
                                ⏳ Génération en cours...
                            {:else}
                                Générer avec l'IA
                            {/if}
                        </button>
                    </div>
                {/if}
            </div>

            <div class="section actions">
                <h4>Actions Rapides</h4>
                <button class="btn btn-secondary w-full">Dossier Patient</button
                >
                <button class="btn btn-secondary w-full">Créer Facture</button>
                <button class="btn btn-secondary w-full text-danger"
                    >Annuler RDV</button
                >
            </div>
        </div>
    </aside>
{/if}

<style>
    .panel-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        z-index: 40;
        backdrop-filter: blur(2px);
    }

    .details-panel {
        position: fixed;
        top: 0;
        right: 0;
        width: 100%;
        max-width: 450px;
        height: 100vh;
        z-index: 50;
        background: var(--color-surface);
        box-shadow: -4px 0 24px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        border-left: 1px solid var(--color-border);
    }

    .glass-panel {
        background: var(--glass-bg);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
    }

    .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid var(--color-border);
    }

    .panel-header h2 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--color-text);
    }

    .close-btn {
        background: transparent;
        border: none;
        font-size: 1.2rem;
        color: var(--color-text-muted);
        cursor: pointer;
        padding: 0.5rem;
        transition: color 0.2s;
    }

    .close-btn:hover {
        color: var(--color-error);
    }

    .panel-content {
        padding: 1.5rem;
        overflow-y: auto;
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .header-card {
        background: var(--color-surface-2);
        padding: 1.5rem;
        border-radius: var(--radius-md);
        border: 1px solid var(--color-border);
    }

    .header-card h3 {
        margin: 0.75rem 0 0.25rem 0;
        font-size: 1.2rem;
        color: var(--color-text);
    }

    .header-card p {
        margin: 0.25rem 0;
        color: var(--color-text-muted);
        font-size: 0.95rem;
    }

    .status-badge {
        font-size: 0.7rem;
        padding: 0.2rem 0.6rem;
        border-radius: 999px;
        font-weight: 600;
        text-transform: uppercase;
        display: inline-block;
    }

    .status-badge.terminé {
        background: var(--color-surface-2);
        color: var(--color-text-muted);
        border: 1px solid var(--color-border);
    }

    .status-badge.à-venir {
        background: rgba(49, 130, 206, 0.1);
        color: #3182ce;
    }

    .status-badge.en-cours {
        background: rgba(221, 107, 32, 0.1);
        color: #dd6b20;
    }

    .section h4 {
        margin: 0 0 1rem 0;
        font-size: 1.05rem;
        color: var(--color-text);
        font-weight: 600;
    }

    .notes-area {
        background: var(--color-surface-2);
        padding: 1rem;
        border-radius: var(--radius-sm);
        border: 1px solid var(--color-border);
        min-height: 100px;
    }

    .notes-area p {
        margin: 0;
        font-size: 0.95rem;
        color: var(--color-text);
        line-height: 1.5;
        white-space: pre-wrap;
    }

    .ai-action-box {
        margin-top: 1.5rem;
        padding: 1.5rem;
        border-radius: var(--radius-md);
        background: linear-gradient(
            135deg,
            rgba(108, 99, 255, 0.1) 0%,
            rgba(0, 212, 170, 0.05) 100%
        );
        border: 1px solid rgba(108, 99, 255, 0.2);
    }

    .ai-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
    }

    .ai-header h5 {
        margin: 0;
        font-size: 1.1rem;
        color: var(--color-primary);
    }

    .ai-desc {
        font-size: 0.9rem;
        color: var(--color-text-muted);
        margin-bottom: 1.25rem;
        line-height: 1.4;
    }

    .btn {
        padding: 0.75rem 1rem;
        border-radius: var(--radius-sm);
        font-weight: 500;
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.2s;
        border: 1px solid transparent;
        font-family: inherit;
    }

    .w-full {
        width: 100%;
    }

    .btn-primary {
        background: var(--color-primary);
        color: white;
        box-shadow: 0 4px 12px var(--color-primary-glow);
    }

    .btn-primary:hover {
        opacity: 0.9;
        transform: translateY(-1px);
    }

    .actions {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-top: auto;
    }

    .btn-secondary {
        background: var(--color-surface);
        border-color: var(--color-border);
        color: var(--color-text);
    }

    .btn-secondary:hover {
        background: var(--color-surface-2);
        border-color: var(--color-primary);
    }

    .text-danger {
        color: var(--color-error);
    }

    .btn-secondary.text-danger:hover {
        border-color: var(--color-error);
        background: rgba(229, 62, 62, 0.05);
    }

    .summary-area {
        background: var(--color-surface);
        padding: 1.5rem;
        border-radius: var(--radius-md);
        border: 1px solid var(--color-primary-glow);
        box-shadow: 0 4px 20px rgba(108, 99, 255, 0.05);
    }

    .markdown-h3 {
        font-size: 1.1rem;
        color: var(--color-primary);
        margin: 1rem 0 0.5rem 0;
    }
    .markdown-h3:first-child {
        margin-top: 0;
    }

    .markdown-p {
        margin: 0.25rem 0;
        font-size: 0.95rem;
        line-height: 1.5;
        color: var(--color-text);
    }

    .markdown-li {
        margin-left: 1.5rem;
        font-size: 0.95rem;
        color: var(--color-text);
        list-style-type: disc;
    }

    .error-msg {
        margin-top: 1rem;
        padding: 0.75rem;
        background: rgba(229, 62, 62, 0.1);
        border-left: 3px solid var(--color-error);
        border-radius: 4px;
        color: var(--color-error);
        font-size: 0.9rem;
    }

    .btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        box-shadow: none;
    }

    .summary-header-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    .summary-header-row h4 {
        margin: 0;
    }

    .btn-icon {
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0.25rem 0.5rem;
        border-radius: var(--radius-sm);
        transition: background 0.2s;
    }

    .btn-icon:hover {
        background: var(--color-surface-2);
    }

    .summary-editor {
        width: 100%;
        background: var(--color-surface-2);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        padding: 0.75rem;
        color: var(--color-text);
        font-family: inherit;
        font-size: 0.95rem;
        resize: vertical;
        box-sizing: border-box;
    }

    .summary-editor:focus {
        outline: none;
        border-color: var(--color-primary);
    }

    .editor-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        margin-top: 0.75rem;
    }

    .btn-sm {
        padding: 0.4rem 0.75rem;
        font-size: 0.85rem;
    }
</style>

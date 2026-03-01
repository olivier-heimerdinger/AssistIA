<script lang="ts">
    import { user } from "$lib/stores/auth";
    import ThemeToggle from "$lib/components/ThemeToggle.svelte";
    import AppointmentPanel from "$lib/components/AppointmentPanel.svelte";

    let { data } = $props();

    let isPanelOpen = $state(false);
    let selectedAppointment = $state<any>(null);

    function openPanel(apt: any) {
        selectedAppointment = apt;
        isPanelOpen = true;
    }
</script>

<svelte:head>
    <title>Dashboard Secrétaire - AssistIA</title>
</svelte:head>

<div class="dashboard-header">
    <div class="title-section">
        <h1>Bonjour, {$user?.name || "Admin"} 👋</h1>
        <p class="subtitle">Voici votre programme pour aujourd'hui.</p>
    </div>
    <div class="actions-section">
        <button class="btn btn-primary">+ Nouveau Rendez-vous</button>
    </div>
</div>

<div class="stats-grid">
    <div class="stat-card">
        <div class="stat-icon">📈</div>
        <div class="stat-info">
            <span class="stat-value">{data.stats.totalToday}</span>
            <span class="stat-label">RDVs aujourd'hui</span>
        </div>
    </div>
    <div class="stat-card">
        <div class="stat-icon">🤖</div>
        <div class="stat-info">
            <span class="stat-value">{data.stats.aiActionsPending}</span>
            <span class="stat-label">Actions IA en attente</span>
        </div>
    </div>
    <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-info">
            <span class="stat-value">{data.stats.completed}</span>
            <span class="stat-label">Terminés</span>
        </div>
    </div>
</div>

<div class="timeline-section glass-box">
    <div class="section-header">
        <h2 class="section-title">Timeline du Jour</h2>
        <div class="filters">
            <button class="filter-btn active">Tous</button>
            <button class="filter-btn">À venir</button>
            <button class="filter-btn">À traiter</button>
        </div>
    </div>

    <div class="timeline">
        {#each data.appointments as apt}
            <div
                class="timeline-item {apt.status === 'en cours'
                    ? 'active'
                    : ''}"
            >
                <div class="time-column">
                    <span class="time">{apt.time.split(" - ")[0]}</span>
                    <span class="duration">45m</span>
                </div>

                <div
                    class="content-column cursor-pointer hover-effect"
                    role="button"
                    tabindex="0"
                    onclick={() => openPanel(apt)}
                    onkeydown={(e) => e.key === "Enter" && openPanel(apt)}
                >
                    <div class="apt-header">
                        <h3>{apt.title}</h3>
                        <span
                            class="status-badge {apt.status.replace(' ', '-')}"
                        >
                            {apt.status}
                        </span>
                    </div>

                    <div class="apt-details">
                        <span class="client-name">👤 {apt.clientName}</span>
                        {#if apt.aiActionStatus === "todo"}
                            <span class="ai-badge warning"
                                >✨ Action IA requise</span
                            >
                        {:else if apt.aiActionStatus === "done"}
                            <span class="ai-badge success"
                                >✨ Résumé généré</span
                            >
                        {/if}
                    </div>

                    {#if apt.notes && apt.status === "terminé"}
                        <div class="apt-preview-notes">
                            <p>"{apt.notes.substring(0, 60)}..."</p>
                            <button class="btn-text"
                                >Ouvrir et Générer le résumé</button
                            >
                        </div>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
</div>

<AppointmentPanel
    bind:isOpen={isPanelOpen}
    bind:appointment={selectedAppointment}
/>

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
    }

    .btn-primary {
        background: var(--color-primary);
        color: white;
    }

    .btn-primary:hover {
        opacity: 0.9;
        box-shadow: 0 4px 12px var(--color-primary-glow);
    }

    .btn-text {
        background: none;
        border: none;
        color: var(--color-primary);
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        padding: 0;
        margin-top: 0.5rem;
    }

    .btn-text:hover {
        text-decoration: underline;
    }

    /* Stats Grid */
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2.5rem;
    }

    .stat-card {
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        gap: 1.25rem;
        padding: 1.5rem;
        box-shadow: var(--shadow-card);
        transition: transform 0.2s;
    }

    .stat-card:hover {
        transform: translateY(-2px);
    }

    .stat-icon {
        font-size: 2rem;
    }

    .stat-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .stat-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--color-text);
        line-height: 1.2;
    }

    .stat-label {
        font-size: 0.85rem;
        color: var(--color-text-muted);
        font-weight: 500;
    }

    /* Glass Box Shared Pattern */
    .glass-box {
        background: var(--glass-bg);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-md);
        padding: 1.5rem;
        box-shadow: var(--shadow-card);
    }

    /* Timeline Section */
    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--color-border);
    }

    .section-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--color-text);
        margin: 0;
    }

    .filters {
        display: flex;
        gap: 0.5rem;
        background: var(--color-surface-2);
        padding: 0.25rem;
        border-radius: var(--radius-sm);
    }

    .filter-btn {
        background: transparent;
        border: none;
        padding: 0.4rem 0.8rem;
        border-radius: 4px;
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--color-text-muted);
        cursor: pointer;
        transition: all 0.2s;
    }

    .filter-btn.active {
        background: var(--color-surface);
        color: var(--color-text);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    /* Timeline Items */
    .timeline {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        position: relative;
    }

    .timeline::before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: 75px;
        width: 2px;
        background: var(--color-border);
        border-radius: 2px;
    }

    .timeline-item {
        display: flex;
        gap: 1.5rem;
        position: relative;
    }

    .timeline-item::after {
        content: "";
        position: absolute;
        left: 71px; /* Align with line */
        top: 24px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--color-surface-2);
        border: 2px solid var(--color-border);
        z-index: 2;
    }

    .timeline-item.active::after {
        background: var(--color-primary);
        border-color: var(--color-primary-glow);
        box-shadow: 0 0 0 4px var(--color-primary-glow);
    }

    .time-column {
        width: 60px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        padding-top: 0.5rem;
    }

    .time {
        font-weight: 600;
        color: var(--color-text);
        font-size: 0.95rem;
    }

    .duration {
        font-size: 0.75rem;
        color: var(--color-text-muted);
    }

    .content-column {
        flex: 1;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        padding: 1.25rem;
        transition: all 0.2s;
    }

    .cursor-pointer {
        cursor: pointer;
    }

    .hover-effect:hover {
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px var(--color-primary-glow);
        transform: translateX(4px);
    }

    .apt-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 0.5rem;
    }

    .apt-header h3 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--color-text);
    }

    .status-badge {
        font-size: 0.7rem;
        padding: 0.2rem 0.6rem;
        border-radius: 999px;
        font-weight: 600;
        text-transform: uppercase;
    }

    .status-badge.terminé {
        background: var(--color-surface-2);
        color: var(--color-text-muted);
    }

    .status-badge.à-venir {
        background: rgba(49, 130, 206, 0.1);
        color: #3182ce;
    }

    .status-badge.en-cours {
        background: rgba(221, 107, 32, 0.1);
        color: #dd6b20;
    }

    .apt-details {
        display: flex;
        gap: 1rem;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    .client-name {
        font-size: 0.9rem;
        color: var(--color-text-muted);
        font-weight: 500;
    }

    .ai-badge {
        font-size: 0.75rem;
        padding: 0.15rem 0.5rem;
        border-radius: 4px;
        font-weight: 500;
    }

    .ai-badge.warning {
        background: rgba(214, 158, 46, 0.15);
        color: #b7791f;
    }

    .ai-badge.success {
        background: rgba(56, 161, 105, 0.15);
        color: var(--color-success);
    }

    .apt-preview-notes {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px dashed var(--color-border);
    }

    .apt-preview-notes p {
        margin: 0;
        font-size: 0.9rem;
        color: var(--color-text-muted);
        font-style: italic;
    }
</style>

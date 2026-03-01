<script lang="ts">
    import { user } from "$lib/stores/auth";
    import GlassCard from "$lib/components/GlassCard.svelte";

    let { data } = $props();
</script>

<svelte:head>
    <title>Espace Client - Vue d'ensemble</title>
</svelte:head>

<div class="dashboard-header">
    <h1>Bonjour, {$user?.name || "Client"} 👋</h1>
    <p class="subtitle">Voici un résumé de votre activité récente.</p>
</div>

<div class="dashboard-grid">
    <!-- Next Appointment Widget -->
    <GlassCard title="Prochain Rendez-vous">
        {#snippet headerAction()}
            <span class="badge upcoming">À venir</span>
        {/snippet}

        <div class="appointment-details">
            <div class="calendar-icon">
                <span class="day">15</span>
                <span class="month">Mar</span>
            </div>
            <div class="info">
                <h4>{data.nextAppointment.title}</h4>
                <p class="time">
                    {data.nextAppointment.date} ({data.nextAppointment
                        .duration})
                </p>
                <p class="practitioner">
                    Avec : {data.nextAppointment.practitioner}
                </p>
            </div>
        </div>

        {#snippet footer()}
            <button class="btn secondary">Reprogrammer</button>
            <button class="btn primary">Détails</button>
        {/snippet}
    </GlassCard>

    <!-- Recent Documents Widget -->
    <GlassCard title="Derniers Documents">
        {#snippet headerAction()}
            <a href="#documents" class="view-all">Tout voir</a>
        {/snippet}

        <ul class="doc-list">
            {#each data.documents as doc}
                <li class="doc-item">
                    <div class="doc-icon">📄</div>
                    <div class="doc-info">
                        <span class="doc-name">{doc.name}</span>
                        <span class="doc-meta">{doc.type} • {doc.date}</span>
                    </div>
                </li>
            {/each}
        </ul>
    </GlassCard>

    <!-- Factures Widget -->
    <GlassCard title="Factures Récentes" class="invoices-widget">
        {#snippet headerAction()}
            <a href="#invoices" class="view-all">Historique</a>
        {/snippet}

        <div class="invoices-list">
            {#each data.invoices as invoice}
                <div class="invoice-item">
                    <div class="inv-left">
                        <span class="inv-id">{invoice.id}</span>
                        <span class="inv-date">{invoice.date}</span>
                    </div>
                    <div class="inv-right">
                        <span class="inv-amount">{invoice.amount} €</span>
                        <span
                            class="status-badge {invoice.status === 'payée'
                                ? 'paid'
                                : 'pending'}"
                        >
                            {invoice.status}
                        </span>
                    </div>
                </div>
            {/each}
        </div>
    </GlassCard>
</div>

<style>
    .dashboard-header {
        margin-bottom: 2.5rem;
    }

    .dashboard-header h1 {
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

    .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 1.5rem;
    }

    :global(.view-all) {
        font-size: 0.85rem;
        color: var(--color-primary);
        text-decoration: none;
        font-weight: 500;
    }

    :global(.view-all:hover) {
        text-decoration: underline;
    }

    /* Appointment Widget Styles */
    .appointment-details {
        display: flex;
        gap: 1.25rem;
        align-items: center;
        margin-bottom: 1.5rem;
    }

    .calendar-icon {
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-width: 60px;
        min-height: 70px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    }

    .calendar-icon .day {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--color-text);
    }

    .calendar-icon .month {
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--color-error);
        text-transform: uppercase;
    }

    .info h4 {
        margin: 0 0 0.4rem 0;
        font-size: 1.05rem;
        color: var(--color-text);
    }

    .info .time {
        margin: 0 0 0.25rem 0;
        color: var(--color-primary);
        font-weight: 500;
        font-size: 0.95rem;
    }

    .info .practitioner {
        margin: 0;
        color: var(--color-text-muted);
        font-size: 0.85rem;
    }

    .badge {
        font-size: 0.75rem;
        padding: 0.25rem 0.6rem;
        border-radius: 9999px;
        font-weight: 600;
    }

    .badge.upcoming {
        background: var(--color-primary-glow);
        color: var(--color-primary);
    }

    .btn {
        flex: 1;
        padding: 0.6rem;
        border-radius: var(--radius-sm);
        font-weight: 500;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s;
        border: 1px solid transparent;
    }

    .btn:hover {
        box-shadow: 0 0 0 3px var(--color-primary-glow);
    }

    .btn.primary {
        background: var(--color-primary);
        color: white;
    }

    .btn.primary:hover {
        opacity: 0.9;
    }

    .btn.secondary {
        background: var(--color-surface);
        border-color: var(--color-border);
        color: var(--color-text-muted);
    }

    .btn.secondary:hover {
        background: var(--color-surface-2);
        color: var(--color-text);
    }

    /* Documents List */
    .doc-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .doc-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        transition: all 0.2s;
        cursor: pointer;
    }

    .doc-item:hover {
        background: var(--color-surface-2);
        box-shadow: 0 0 0 3px var(--color-primary-glow);
    }

    .doc-icon {
        font-size: 1.5rem;
    }

    .doc-info {
        display: flex;
        flex-direction: column;
    }

    .doc-name {
        font-weight: 500;
        color: var(--color-text);
        font-size: 0.95rem;
    }

    .doc-meta {
        font-size: 0.8rem;
        color: var(--color-text-muted);
        margin-top: 0.2rem;
    }

    /* Invoices List */
    :global(.invoices-widget) {
        grid-column: span 1;
    }

    .invoices-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .invoice-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.85rem 1rem;
        background: var(--color-surface);
        border-radius: var(--radius-sm);
        border: 1px solid var(--color-border);
        transition: all 0.2s;
        cursor: pointer;
    }

    .invoice-item:hover {
        box-shadow: 0 0 0 3px var(--color-primary-glow);
        background: var(--color-surface-2);
    }

    .inv-left {
        display: flex;
        flex-direction: column;
    }

    .inv-id {
        font-weight: 600;
        color: var(--color-text);
        font-size: 0.9rem;
    }

    .inv-date {
        color: var(--color-text-muted);
        font-size: 0.8rem;
        margin-top: 0.2rem;
    }

    .inv-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

    .inv-amount {
        font-weight: 700;
        color: var(--color-text);
        font-size: 1rem;
    }

    .status-badge {
        font-size: 0.7rem;
        padding: 0.2rem 0.5rem;
        border-radius: var(--radius-sm);
        font-weight: 600;
        margin-top: 0.3rem;
        text-transform: uppercase;
    }

    .status-badge.paid {
        background: rgba(34, 197, 94, 0.15);
        color: var(--color-success);
    }

    .status-badge.pending {
        background: rgba(229, 62, 62, 0.15);
        color: var(--color-error);
    }
</style>

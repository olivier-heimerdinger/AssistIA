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
        color: #1a202c;
        margin: 0 0 0.5rem 0;
    }

    .subtitle {
        color: #718096;
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
        color: #007bff;
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
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-width: 60px;
        min-height: 70px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.02);
    }

    .calendar-icon .day {
        font-size: 1.5rem;
        font-weight: 700;
        color: #2d3748;
    }

    .calendar-icon .month {
        font-size: 0.8rem;
        font-weight: 600;
        color: #e53e3e;
        text-transform: uppercase;
    }

    .info h4 {
        margin: 0 0 0.4rem 0;
        font-size: 1.05rem;
        color: #1a202c;
    }

    .info .time {
        margin: 0 0 0.25rem 0;
        color: #007bff;
        font-weight: 500;
        font-size: 0.95rem;
    }

    .info .practitioner {
        margin: 0;
        color: #718096;
        font-size: 0.85rem;
    }

    .badge {
        font-size: 0.75rem;
        padding: 0.25rem 0.6rem;
        border-radius: 9999px;
        font-weight: 600;
    }

    .badge.upcoming {
        background: #ebf8ff;
        color: #3182ce;
    }

    .btn {
        flex: 1;
        padding: 0.6rem;
        border-radius: 8px;
        font-weight: 500;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s;
        border: 1px solid transparent;
    }

    .btn:hover {
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
    }

    .btn.primary {
        background: #007bff;
        color: white;
    }

    .btn.primary:hover {
        background: #0056b3;
    }

    .btn.secondary {
        background: white;
        border-color: #e2e8f0;
        color: #4a5568;
    }

    .btn.secondary:hover {
        background: #f7fafc;
        border-color: #cbd5e0;
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
        background: rgba(255, 255, 255, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.4);
        border-radius: 8px;
        transition: background 0.2s;
        cursor: pointer;
    }

    .doc-item:hover {
        background: white;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
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
        color: #2d3748;
        font-size: 0.95rem;
    }

    .doc-meta {
        font-size: 0.8rem;
        color: #718096;
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
        background: white;
        border-radius: 8px;
        border: 1px solid #edf2f7;
        transition: box-shadow 0.2s;
        cursor: pointer;
    }

    .invoice-item:hover {
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
    }

    .inv-left {
        display: flex;
        flex-direction: column;
    }

    .inv-id {
        font-weight: 600;
        color: #2d3748;
        font-size: 0.9rem;
    }

    .inv-date {
        color: #718096;
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
        color: #1a202c;
        font-size: 1rem;
    }

    .status-badge {
        font-size: 0.7rem;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-weight: 600;
        margin-top: 0.3rem;
        text-transform: uppercase;
    }

    .status-badge.paid {
        background: #c6f6d5;
        color: #22543d;
    }

    .status-badge.pending {
        background: #feebc8;
        color: #c05621;
    }
</style>

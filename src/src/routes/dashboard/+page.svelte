<script lang="ts">
    import { goto } from "$app/navigation";
    import { user, logout } from "$lib/stores/auth";

    async function handleLogout() {
        await logout();
        goto("/login");
    }
</script>

<svelte:head>
    <title>Dashboard — AssistIA</title>
</svelte:head>

<div class="app-shell">
    <!-- Sidebar -->
    <aside class="sidebar">
        <div class="sidebar-brand">
            <span class="brand-icon">✦</span>
            <span class="brand-name">AssistIA</span>
        </div>
        <nav class="sidebar-nav">
            <a href="/dashboard" class="nav-item active">
                <span class="nav-icon">⊞</span> Dashboard
            </a>
            <a href="/clients" class="nav-item">
                <span class="nav-icon">👤</span> Clients
            </a>
            <a href="/invoices" class="nav-item">
                <span class="nav-icon">🧾</span> Factures
            </a>
            <a href="/documents" class="nav-item">
                <span class="nav-icon">📄</span> Documents
            </a>
        </nav>
        <div class="sidebar-footer">
            <button onclick={handleLogout} class="btn-logout">
                ↩ Déconnexion
            </button>
        </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
        <header class="page-header">
            <div>
                <h1>Bonjour, {$user?.name ?? "Secrétaire"} 👋</h1>
                <p class="page-subtitle">Voici vos actions du jour</p>
            </div>
        </header>

        <!-- Stat Cards -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">📅</div>
                <div class="stat-info">
                    <span class="stat-value">—</span>
                    <span class="stat-label">Rendez-vous à traiter</span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">🧾</div>
                <div class="stat-info">
                    <span class="stat-value">—</span>
                    <span class="stat-label">Factures en attente</span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">👥</div>
                <div class="stat-info">
                    <span class="stat-value">—</span>
                    <span class="stat-label">Clients actifs</span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">📄</div>
                <div class="stat-info">
                    <span class="stat-value">—</span>
                    <span class="stat-label">Documents ce mois</span>
                </div>
            </div>
        </div>

        <!-- Timeline placeholder -->
        <section class="timeline-section">
            <h2 class="section-title">Rendez-vous récents</h2>
            <div class="empty-state">
                <span class="empty-icon">📭</span>
                <p>Aucun rendez-vous pour le moment.</p>
                <p class="empty-hint">
                    La synchronisation calendrier sera disponible bientôt.
                </p>
            </div>
        </section>
    </main>
</div>

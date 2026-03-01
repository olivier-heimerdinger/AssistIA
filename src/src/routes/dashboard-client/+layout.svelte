<script lang="ts">
    import { user, logout } from "$lib/stores/auth";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import type { Snippet } from "svelte";
    import ThemeToggle from "$lib/components/ThemeToggle.svelte";

    let { children }: { children: Snippet } = $props();

    onMount(() => {
        // Enforce authentication
        if (!$user) {
            goto("/login/client");
        }
    });

    async function handleLogout() {
        await logout();
        goto("/login/client");
    }
</script>

<div class="client-layout">
    <aside class="sidebar glass-panel">
        <div class="brand">
            <span class="icon">✦</span>
            <h2>Espace Client</h2>
        </div>

        <nav class="nav-links">
            <a href="/dashboard-client" class="active">Vue d'ensemble</a>
            <a href="#appointments">Mes Rendez-vous</a>
            <a href="#invoices">Mes Factures</a>
            <a href="#documents">Mes Documents</a>
        </nav>

        <div class="sidebar-footer">
            <ThemeToggle />
            <div class="user-profile">
                <div class="user-info">
                    <span class="user-avatar"
                        >{$user?.name?.charAt(0) || "C"}</span
                    >
                    <span class="user-name">{$user?.name || $user?.email}</span>
                </div>
                <button
                    onclick={handleLogout}
                    class="logout-btn"
                    title="Déconnexion"
                >
                    <span>🚪</span>
                </button>
            </div>
        </div>
    </aside>

    <main class="content-area">
        <!-- Render the matched child route here -->
        {@render children()}
    </main>
</div>

<style>
    .client-layout {
        display: flex;
        height: 100vh;
        overflow: hidden;
        /* Ensure global bg applies */
        background: var(--color-bg);
        color: var(--color-text);
    }

    /* Glassmorphism Sidebar */
    .glass-panel {
        background: var(--glass-bg);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border-right: 1px solid var(--glass-border);
    }

    .sidebar {
        width: 280px;
        display: flex;
        flex-direction: column;
        padding: 1.5rem;
        box-shadow: 2px 0 10px rgba(0, 0, 0, 0.02);
        z-index: 10;
    }

    .brand {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 2.5rem;
    }

    .brand .icon {
        color: var(--color-primary);
        font-size: 1.5rem;
    }

    .brand h2 {
        margin: 0;
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--color-text);
    }

    .nav-links {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        flex: 1;
    }

    .nav-links a {
        text-decoration: none;
        color: var(--color-text-muted);
        padding: 0.75rem 1rem;
        border-radius: var(--radius-sm);
        font-weight: 500;
        transition: all 0.2s;
    }

    .nav-links a:hover {
        background: var(--color-primary-glow);
        color: var(--color-primary);
    }

    .nav-links a.active {
        background: var(--color-primary);
        color: white;
    }

    .sidebar-footer {
        margin-top: auto;
        padding-top: 1.5rem;
        border-top: 1px solid var(--color-border);
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .user-profile {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
    }

    .user-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        overflow: hidden;
    }

    .user-avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        flex-shrink: 0;
        background: var(--color-surface-2);
        border-radius: 50%;
        font-weight: bold;
        color: var(--color-text-muted);
    }

    .user-name {
        font-weight: 500;
        font-size: 0.9rem;
        color: var(--color-text);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .logout-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        flex-shrink: 0;
        background: transparent;
        color: var(--color-error);
        border: 1px solid transparent;
        border-radius: var(--radius-sm);
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
    }

    .logout-btn:hover {
        background: rgba(229, 62, 62, 0.1);
        border-color: var(--color-error);
    }

    .content-area {
        flex: 1;
        overflow-y: auto;
        padding: 2.5rem;
    }
</style>

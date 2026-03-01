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
            goto("/login");
        }
    });

    async function handleLogout() {
        await logout();
        goto("/login");
    }
</script>

<div class="app-shell">
    <aside class="sidebar glass-panel">
        <div class="sidebar-brand">
            <span class="brand-icon">✧</span>
            <span class="brand-name">AssistIA Admin</span>
        </div>

        <nav class="sidebar-nav">
            <a href="/dashboard" class="nav-item active">
                <span class="nav-icon">📅</span>
                Timeline
            </a>
            <a href="#clients" class="nav-item">
                <span class="nav-icon">👥</span>
                Clients
            </a>
            <a href="#invoices" class="nav-item">
                <span class="nav-icon">🧾</span>
                Factures
            </a>
            <a href="#documents" class="nav-item">
                <span class="nav-icon">📁</span>
                Documents
            </a>
            <a href="#settings" class="nav-item">
                <span class="nav-icon">⚙️</span>
                Paramètres
            </a>
        </nav>

        <div class="sidebar-footer">
            <ThemeToggle />
            <div class="user-profile">
                <div class="user-info">
                    <span class="user-avatar"
                        >{$user?.name?.charAt(0) || "A"}</span
                    >
                    <span class="user-name">{$user?.name || $user?.email}</span>
                </div>
                <button
                    onclick={handleLogout}
                    class="btn-logout-icon"
                    title="Déconnexion"
                >
                    <span>🚪</span>
                </button>
            </div>
        </div>
    </aside>

    <main class="main-content">
        {@render children()}
    </main>
</div>

<style>
    .app-shell {
        display: grid;
        grid-template-columns: 260px 1fr;
        height: 100vh;
        overflow: hidden;
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
        display: flex;
        flex-direction: column;
        padding: 1.5rem 1rem;
        box-shadow: 2px 0 15px rgba(0, 0, 0, 0.03);
        z-index: 10;
        height: 100vh;
    }

    .sidebar-brand {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        padding: 0.5rem 0.75rem 1.5rem;
        border-bottom: 1px solid var(--color-border);
        margin-bottom: 1rem;
    }

    .brand-icon {
        font-size: 1.5rem;
        color: var(--color-primary);
    }

    .brand-name {
        font-weight: 700;
        font-size: 1.2rem;
        color: var(--color-text);
    }

    .sidebar-nav {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        flex: 1;
    }

    .nav-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        border-radius: var(--radius-sm);
        color: var(--color-text-muted);
        font-size: 0.95rem;
        font-weight: 500;
        text-decoration: none;
        transition: all 0.2s;
    }

    .nav-item:hover {
        background: var(--color-primary-glow);
        color: var(--color-primary);
    }

    .nav-item.active {
        background: var(--color-primary);
        color: white;
    }

    .nav-icon {
        font-size: 1.1rem;
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

    .btn-logout-icon {
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

    .btn-logout-icon:hover {
        background: rgba(229, 62, 62, 0.1);
        border-color: var(--color-error);
    }

    .main-content {
        padding: 2.5rem;
        overflow-y: auto;
        flex: 1;
    }
</style>

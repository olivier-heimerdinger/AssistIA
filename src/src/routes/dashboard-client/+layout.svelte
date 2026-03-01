<script lang="ts">
    import { user, logout } from "$lib/stores/auth";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import type { Snippet } from "svelte";

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
            <div class="user-info">
                <span class="user-avatar">{$user?.name?.charAt(0) || "C"}</span>
                <span class="user-name">{$user?.name || $user?.email}</span>
            </div>
            <button onclick={handleLogout} class="logout-btn"
                >Déconnexion</button
            >
        </div>
    </aside>

    <main class="content-area">
        <!-- Render the matched child route here -->
        {@render children()}
    </main>
</div>

<style>
    :global(body) {
        margin: 0;
        background: #f4f6fa; /* Light, premium background */
        font-family:
            "Inter",
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            sans-serif;
        color: #1a1a1a;
    }

    .client-layout {
        display: flex;
        height: 100vh;
        overflow: hidden;
    }

    /* Glassmorphism Sidebar */
    .glass-panel {
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border-right: 1px solid rgba(255, 255, 255, 0.5);
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
        color: #007bff;
        font-size: 1.5rem;
    }

    .brand h2 {
        margin: 0;
        font-size: 1.2rem;
        font-weight: 600;
        color: #2d3748;
    }

    .nav-links {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        flex: 1;
    }

    .nav-links a {
        text-decoration: none;
        color: #4a5568;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        font-weight: 500;
        transition: all 0.2s;
    }

    .nav-links a:hover {
        background: rgba(0, 123, 255, 0.05);
        color: #007bff;
    }

    .nav-links a.active {
        background: #007bff;
        color: white;
    }

    .sidebar-footer {
        margin-top: auto;
        padding-top: 1.5rem;
        border-top: 1px solid rgba(0, 0, 0, 0.05);
    }

    .user-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1rem;
    }

    .user-avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        background: #e2e8f0;
        border-radius: 50%;
        font-weight: bold;
        color: #4a5568;
    }

    .user-name {
        font-weight: 500;
        font-size: 0.9rem;
        color: #2d3748;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .logout-btn {
        width: 100%;
        padding: 0.75rem;
        background: transparent;
        color: #e53e3e;
        border: 1px solid #fc8181;
        border-radius: 8px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
    }

    .logout-btn:hover {
        background: #fff5f5;
        border-color: #e53e3e;
    }

    .content-area {
        flex: 1;
        overflow-y: auto;
        padding: 2.5rem;
    }
</style>

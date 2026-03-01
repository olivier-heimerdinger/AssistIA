<script lang="ts">
    import { goto } from "$app/navigation";
    import { login } from "$lib/stores/auth";

    let email = $state("");
    let password = $state("");
    let error = $state("");
    let loading = $state(false);

    async function handleLogin(e: SubmitEvent) {
        e.preventDefault();
        loading = true;
        error = "";
        try {
            await login(email, password);
            goto("/dashboard");
        } catch (err: unknown) {
            error =
                (err as { message?: string })?.message ||
                "Une erreur est survenue.";
        } finally {
            loading = false;
        }
    }
</script>

<svelte:head>
    <title>Connexion — AssistIA</title>
</svelte:head>

<div class="login-page">
    <div class="login-card">
        <div class="login-brand">
            <span class="login-icon">✦</span>
            <h1>AssistIA</h1>
            <p>Votre secrétaire intelligente</p>
        </div>

        <form onsubmit={handleLogin} class="login-form">
            <div class="form-group">
                <label for="email">Email</label>
                <input
                    id="email"
                    type="email"
                    bind:value={email}
                    placeholder="vous@exemple.com"
                    required
                    autocomplete="email"
                />
            </div>

            <div class="form-group">
                <label for="password">Mot de passe</label>
                <input
                    id="password"
                    type="password"
                    bind:value={password}
                    placeholder="••••••••"
                    required
                    autocomplete="current-password"
                />
            </div>

            {#if error}
                <div class="error-message">{error}</div>
            {/if}

            <button type="submit" class="btn-primary" disabled={loading}>
                {loading ? "Connexion..." : "Se connecter"}
            </button>
        </form>

        <div class="switch-login">
            <p>Vous êtes un client ?</p>
            <a href="/login/client">Accéder à mon Espace Client</a>
        </div>
    </div>
</div>

<style>
    .switch-login {
        margin-top: 1.5rem;
        text-align: center;
        padding-top: 1rem;
        border-top: 1px solid #eee;
    }
    .switch-login p {
        margin: 0 0 0.5rem 0;
        color: #666;
        font-size: 0.9rem;
    }
    .switch-login a {
        color: #007bff;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s;
    }
    .switch-login a:hover {
        color: #0056b3;
        text-decoration: underline;
    }
</style>

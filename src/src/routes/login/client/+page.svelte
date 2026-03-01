<script lang="ts">
    import { sendMagicLink } from "$lib/stores/auth";

    let email = $state("");
    let loading = $state(false);
    let success = $state(false);
    let errorMsg = $state("");

    async function handleLogin(e: Event) {
        e.preventDefault();
        try {
            loading = true;
            errorMsg = "";
            await sendMagicLink(email);
            success = true;
        } catch (err: any) {
            errorMsg =
                err.message ||
                "Une erreur s'est produite lors de l'envoi de l'email.";
        } finally {
            loading = false;
        }
    }
</script>

<div class="login-container">
    <h2>Accès Espace Client</h2>

    {#if success}
        <div class="success-message">
            <p>✅ Un lien de connexion a été envoyé par email !</p>
            <p>
                Veuillez consulter votre boîte de réception <b>{email}</b> et cliquer
                sur le "Magic Link".
            </p>
        </div>
    {:else}
        <p class="description">
            Saisissez votre adresse email. Nous vous enverrons un lien magique
            pour vous connecter instantanément, sans mot de passe.
        </p>

        <form onsubmit={handleLogin}>
            <div class="form-group">
                <label for="email">Votre Email</label>
                <input
                    type="email"
                    id="email"
                    bind:value={email}
                    placeholder="client@exemple.com"
                    required
                />
            </div>

            {#if errorMsg}
                <div class="error">{errorMsg}</div>
            {/if}

            <button type="submit" disabled={loading}>
                {loading ? "Envoi en cours..." : "Recevoir mon accès"}
            </button>
        </form>
    {/if}

    <div class="switch-login">
        <a href="/login">&larr; Retour à l'accès Secrétariat</a>
    </div>
</div>

<style>
    .switch-login {
        display: block;
        margin-top: 2rem;
        text-align: center;
        padding-top: 1rem;
        border-top: 1px solid #eee;
    }
    .switch-login a {
        color: #666;
        text-decoration: none;
        font-size: 0.9rem;
        transition: color 0.2s;
    }
    .switch-login a:hover {
        color: #333;
        text-decoration: underline;
    }
    .login-container {
        max-width: 400px;
        margin: 4rem auto;
        padding: 2rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        font-family: sans-serif;
    }
    h2 {
        text-align: center;
        margin-top: 0;
    }
    .description {
        color: #666;
        font-size: 0.9rem;
        text-align: center;
        margin-bottom: 1.5rem;
    }
    .form-group {
        margin-bottom: 1rem;
    }
    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
    }
    input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
    }
    button {
        width: 100%;
        padding: 0.75rem;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        font-weight: bold;
        cursor: pointer;
        transition: background 0.2s;
    }
    button:hover:not(:disabled) {
        background: #0056b3;
    }
    button:disabled {
        background: #ccc;
        cursor: not-allowed;
    }
    .error {
        color: #d32f2f;
        background: #ffebee;
        padding: 0.5rem;
        border-radius: 4px;
        margin-bottom: 1rem;
        font-size: 0.9rem;
    }
    .success-message {
        color: #2e7d32;
        background: #e8f5e9;
        padding: 1rem;
        border-radius: 4px;
        text-align: center;
    }
</style>

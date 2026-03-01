<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { verifyMagicLink } from "$lib/stores/auth";

    let status = $state("Vérification en cours...");
    let errorMsg = $state("");

    onMount(async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get("userId");
        const secret = urlParams.get("secret");

        if (!userId || !secret) {
            errorMsg = "Lien invalide ou expiré.";
            status = "Erreur d'authentification";
            return;
        }

        try {
            await verifyMagicLink(userId, secret);
            status = "Connexion réussie !";
            setTimeout(() => {
                // Future logic: check user roles here
                goto("/dashboard-client");
            }, 1000);
        } catch (e: any) {
            status = "Erreur d'authentification";
            errorMsg =
                e.message ||
                "Ce lien magique a probablement déjà été utilisé ou a expiré.";
        }
    });
</script>

<div class="verify-container">
    <h2>{status}</h2>
    {#if !errorMsg && status.includes("Vérification")}
        <div class="spinner"></div>
    {/if}

    {#if errorMsg}
        <div class="error-box">
            <p>{errorMsg}</p>
        </div>
        <a href="/login/client" class="retry-link">Demander un nouveau lien</a>
    {/if}
</div>

<style>
    .verify-container {
        max-width: 400px;
        margin: 6rem auto;
        padding: 2rem;
        text-align: center;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        font-family: sans-serif;
    }
    h2 {
        margin-top: 0;
        color: #333;
    }
    .spinner {
        margin: 2rem auto;
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #007bff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    .error-box {
        background: #ffebee;
        color: #d32f2f;
        padding: 1rem;
        border-radius: 4px;
        margin-top: 1.5rem;
    }
    .retry-link {
        display: inline-block;
        margin-top: 1.5rem;
        padding: 0.75rem 1.5rem;
        background: #007bff;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;
        transition: background 0.2s;
    }
    .retry-link:hover {
        background: #0056b3;
    }
</style>

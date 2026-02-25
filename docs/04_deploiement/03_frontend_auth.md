# Procédure — Démarrage du Frontend SvelteKit (Auth + Dashboard)

Ce document décrit le mode opératoire pour configurer et lancer le frontend SvelteKit avec l'authentification Appwrite.

## Pré-requis

- Stack Docker opérationnelle (`docker compose up -d`)
- Appwrite configuré et base de données initialisée (voir `02_appwrite_startup.md`)
- Un **Project ID** Appwrite disponible (depuis la Console Appwrite → Settings)

## Configuration de l'environnement

Dans le répertoire `/src`, créez un fichier `.env` à partir du modèle :

```bash
# Ce fichier existe déjà si vous avez cloné le projet
# Il est ignoré par git (.gitignore)
cat src/.env
```

Contenu attendu :

```env
VITE_APPWRITE_ENDPOINT=http://localhost/v1
VITE_APPWRITE_PROJECT_ID=votre_project_id_ici
```

> **Important :** `VITE_` est nécessaire pour exposer les variables côté client dans Vite/SvelteKit.

## Lancement du serveur de développement

```bash
cd src
npm install   # si pas encore fait
npm run dev
```

Le frontend répond sur `http://localhost:5173` et via Traefik sur `http://app.localhost`.

## Flux d'authentification

```
/ → redirigé vers /login
/login → Page de connexion email/password (Appwrite Email+Password Session)
  → Connexion OK → /dashboard
  → Erreur → message d'erreur sous le formulaire
/dashboard → Protégé : accès réservé à un utilisateur connecté
  → Si non connecté → redirigé vers /login
```

## Structure des fichiers créés

```
src/src/
├── lib/
│   ├── appwrite.ts          # Client Appwrite (Account, Databases)
│   └── stores/
│       └── auth.ts          # Store Svelte (user, isLoading, login, logout)
├── routes/
│   ├── +layout.svelte       # Auth guard global (redirect si non connecté)
│   ├── +page.svelte         # Redirect vers /login
│   ├── login/
│   │   └── +page.svelte     # Formulaire de connexion Admin
│   └── dashboard/
│       └── +page.svelte     # Dashboard secrétaire (sidebar + stats)
└── styles/
    └── global.css           # Design system complet (dark theme, tokens)
```

## Créer un utilisateur Admin

Pour pouvoir se connecter, créez un compte depuis la **console Appwrite** :

1. Allez sur `http://localhost` → Section **Auth** → **Users**.
2. Cliquez **Create User** et renseignez email + mot de passe.
3. Retournez sur `http://app.localhost/login` et connectez-vous avec ces identifiants.

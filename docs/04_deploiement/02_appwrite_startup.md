# Procédure d'initialisation de la Base de Données Appwrite

Ce document explique la procédure opérationnelle pour re-créer à zéro la base de données, les collections, et les attributs du projet **AssistIA** sur une nouvelle instance d'Appwrite.

## Pré-requis

1. Le stack Docker doit être lancé (Appwrite et MinIO doivent être en ligne).
   ```bash
   docker compose up -d
   ```
2. Un compte administrateur doit être créé sur la console Appwrite locale ([http://localhost](http://localhost)).
3. Un nouveau "Projet" doit être créé dans l'interface Appwrite (ex: "AssistIA").

## Configuration de l'environnement du script

Pour que le script d'initialisation Node.js ait les droits nécessaires pour créer l'architecture :

1. Dans votre Projet Appwrite, allez dans la section **API Keys**.
2. Créez une nouvelle clé API.  
   **Important :** Vous devez cocher les droits complets (`scopes`) pour la catégorie **Database** (read, write, etc.).
3. Récupérez les identifiants :
   - Le **Project ID** (trouvable dans les *Settings* du projet).
   - L' **API Key Secret**.
4. Dans le répertoire `/scripts`, dupliquez le fichier `.env.example` en `.env` :
   ```bash
   cd scripts
   cp .env.example .env
   ```
5. Éditez le fichier `/scripts/.env` et renseignez vos informations :
   ```env
   APPWRITE_ENDPOINT=http://localhost/v1
   APPWRITE_PROJECT_ID=votre_project_id
   APPWRITE_API_KEY=votre_api_key
   ```

## Exécution de l'initialisation

Le script va créer une base de données appelée "AssistIA" et ses 6 collections métiers (Profiles, Clients, Appointments, Invoices, Groups, Documents) avec tout le typage requis.

1. Installez les dépendances du script si ce n'est pas fait :
   ```bash
   cd scripts
   npm install
   ```
2. Lancez le script de setup :
   ```bash
   cd scripts
   node setup_appwrite.js
   ```

Vous observerez dans la console les différentes étapes de création. Si une collection ou une base de données existe déjà, elle ne sera pas écrasée (le script est idempotent).

## Validation

Pour vérifier que tout s'est bien passé, retournez sur la console Appwrite :
- Menu **Databases** -> AssistIA.
- Vous devriez voir les 6 collections. Cliquez sur l'une d'entre elles et allez dans l'onglet **Attributes** pour confirmer que les colonnes ont bien été injectées.

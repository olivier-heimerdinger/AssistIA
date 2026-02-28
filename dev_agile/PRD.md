# PRD : Secrétaire IA (SaaS)1. 

## 1. Vision du Projet

**Nom suggéré :** Assistant (ou AI-Assistant)

**Concept :** Une plateforme de gestion administrative centralisée où l'IA agit comme une secrétaire proactive : elle synchronise le calendrier, génère des factures, résume les échanges et gère la distribution de documents par groupes de clients, gère le résumé des réunions et les factures. Elle peut gérer la confection de document en format WYSIWYG pour faire soit des présentation en texte, soit des présentations en PDF. Et puis aussi des documents de type Publisher.

## 2. Fonctionnalités Clés (MVP)

2.1. Intelligence Artificielle & Automatisation

* AI Meeting Summary : Transformation des notes de rendez-vous en comptes-rendus structurés (Actions, Décisions, Points bloquants).

* Proactive Feedback : Génération automatique de brouillons d'emails de suivi ou de formulaires de feedback après un événement calendrier.

* Document Intelligence : Extraction automatique de données (montants, noms, dates) pour pré-remplir les factures.

2.2. Gestion des Rendez-vous & Calendrier

* Sync Bidirectionnelle : Intégration via API (Google Calendar / Outlook) pour lister les sessions.

* Dashboard de Suivi : Vue "Timeline" des rendez-vous nécessitant une action (ex: "Facture non générée", "Résumé manquant").

2.3. Facturation & Documents

* Factures Express : Génération de PDF (via jsPDF ou Svelte-PDF) basée sur la durée et le tarif client.

* Système de Groupes : Création d'espaces partagés. Un document déposé dans un groupe est accessible à tous les membres (clients) de ce groupe.

* Envoi Multicanal : Bouton d'envoi direct vers le client par email via l'interface.

2.4. Édition & Création de Documents

* Éditeur WYSIWYG : Interface avancée de création et d'édition de documents (présentations, rapports type Publisher, texte enrichi).
* Export Multi-formats : Conversion directe des documents édités au format PDF ou texte.

## 3. Modèle de Données


| Collection|Champs|Description|
|---|---|---|
|Profiles|"userId, name, hourlyRate, companyInfo"|Profil du secrétaire (l'utilisateur).|
|Clients|"name, email, groupId, billingAddress"|Base de données des clients.|
|Appointments|"calendarId, title, start, end, notes, status"|Sync depuis le calendrier + notes IA.|
|Invoices|"clientId, amount, status, pdfUrl, dueDate"|Suivi de la facturation.|
|Groups|"groupName, description, members (Array)"|Logique de partage de documents.|
|Documents|"fileId, groupId, type (invoice/summary), ownerId"|Métadonnées des fichiers stockés.|

## 4. Architecture Technique

(Choix Auto-hébergé)

**Frontend :** 
- Sveltekit, 
- Modern CSS reset. https://github.com/sindresorhus/modern-normalize
- UIkit: https://github.com/uikit/uikit

**Backend & DB :** Appwrite (Auto-hébergé via Docker) - choisi pour sa simplicité de gestion des groupes et du stockage.

**Stockage de Fichiers (S3-like) :** Utilisation d'une solution compatible S3 (ex: MinIO) auto-hébergée pour la gestion robuste, scalable et versionnée des documents partagés. L'interface comprendra un tableau de bord d'administration du stockage (gestion des buckets, quotas, politiques de rétention).

**Infrastructure & Déploiement :** Stack Docker complète comprenant Appwrite (ou le backend métier), MinIO (S3), et le conteneur du Frontend SvelteKit, orchestrée via `docker-compose`.

**IA :** OpenAI API (GPT-4o) ou Anthropic ou AI locale (Ollama, LM Studio).

## 5. Parcours Utilisateur (User Flows)

### 5.A. Parcours Secrétaire (Utilisateur Principal)

1. **Dashboard** : L'utilisateur voit son prochain rendez-vous.
2. **Séance terminée** : L'utilisateur saisit quelques notes rapides ou importe une transcription.
3. **Traitement IA** : Un clic sur "Générer Suite" crée le résumé, la facture PDF, et une proposition de feedback.
4. **Validation et Partage** : L'utilisateur approuve la génération et le document est "poussé" dans le **Groupe Client** dédié.

### 5.B. Parcours Client

1. **Invitation & Connexion** : Le client reçoit un email l'invitant à accéder à son espace sécurisé (via lien magique ou mot de passe).
2. **Espace Personnel (Dashboard Client)** : Vue simplifiée listant l'historique de ses rendez-vous, ses factures (avec statut de paiement) et ses comptes-rendus.
3. **Interaction** : Le client peut télécharger les PDF, payer une facture (si module de paiement intégré), ou déposer un document dans son groupe partagé.

### 5.C. Parcours Super Administrateur

1. **Connexion Back-Office** : Accès à un panneau d'administration global (peut être distinct du Dashboard Secrétaire).
2. **Gestion des Comptes** : Création, suspension ou modification des comptes "Secrétaires/Entreprises" (si le SaaS est multi-tenant).
3. **Supervision Technique & Stockage** : Suivi des métriques d'utilisation (API IA, quotas de stockage S3), gestion globale de l'espace MinIO et des backups.
4. **Configuration Globale** : Paramétrage des intégrations clés (clés API OpenAI, configuration SMTP, paramètres Appwrite).

## 6. Structure et Organisation du Projet

Pour assurer un développement itératif (Agile) et maintenir une documentation claire, le dépôt sera structuré de la manière suivante :

```text
/
├── docs/                 # Documentation documentaire (conception, archi)
│   ├── 01_gestion_projet/ # PRD, Roadmap, User Stories, CR de sprints, github_workflow.md
│   ├── 02_architecture/   # Modèles de données, Schémas (MCD, UML)
│   ├── 03_api/            # Collection Postman, specs OpenAPI/Swagger
│   └── 04_deploiement/    # Procédures Docker, CI/CD, backup MinIO
├── dev_agile/            # Fichiers de suivi pour l'IA et les sprints
│   ├── backlog.md         # Liste priorisée des fonctionnalités à développer
│   ├── sprint_current.md  # Suivi du sprint actif (TODO, IN PROGRESS, DONE)
│   └── conventions.md     # Règles de code (SvelteKit, nommage Appwrite, etc.)
├── src/                  # Code source de l'application SvelteKit
│   ├── app.html
│   ├── lib/
│   │   ├── components/       # Composants UI (Boutons, Modales, Éditeur WYSIWYG)
│   │   ├── server/           # Logique backend/API (Appwrite SDK, Appels IA)
│   │   ├── stores/           # Gestion d'état Svelte (Auth, Calendrier, UI)
│   │   └── utils/            # Fonctions utilitaires (Dates, parsing, génération PDF)
│   └── routes/
│       ├── +layout.svelte    # Shell d'application (Sidebar, Header)
│       ├── +page.svelte      # Page de connexion / Landing
│       ├── dashboard/        # Vue principale (Timeline des rendez-vous et actions)
│       ├── clients/          # Gestion des clients et des groupes
│       ├── documents/        # Éditeur WYSIWYG et liste des documents/présentations
│       └── invoices/         # Interface de facturation
├── static/               # Assets statiques (images, polices, css global)
└── docker-compose.yml    # Stack d'infrastructure (Appwrite, MinIO)
```

## 7. Sécurité & Confidentialité

* **Authentification & RBAC :** Gestion stricte des rôles via Appwrite. Un client n'accède qu'aux documents de son propre groupe. Voir la définition détaillée dans [roles.md](file:///Users/olhei/Dev/Assistant/docs/02_architecture/roles.md).
* **Confidentialité IA :** Possibilité d'utiliser des modèles locaux (ex. Ollama) pour garantir que les données sensibles ne quittent pas l'infrastructure (mode "Privacy First"), ou anonymisation préalable avant envoi vers OpenAI/Anthropic.

## 8. Évolutions Futures (Post-MVP)

* **Relances Automatiques :** Suivi intelligent des factures impayées avec génération d'emails de relance.
* **Portail Client Interactif :** Espace où les clients peuvent commenter les documents ou suggérer des modifications.
* **Intégration Multi-plateformes :** Notifications SMS / WhatsApp pour l'envoi de documents urgents.
* **Serveur MCP (Model Context Protocol) :** Intégration d'un serveur MCP permettant à d'autres clients IA (ex: Claude Desktop) d'interagir directement avec l'écosystème pour créer des événements, consulter des factures ou récupérer des métadonnées de clients.

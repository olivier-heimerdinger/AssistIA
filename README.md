# Assistant AI

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/olivier-heimerdinger/AssistIA)](https://github.com/olivier-heimerdinger/AssistIA/issues)

**Assistant AI** est une plateforme SaaS permettant de centraliser et d'automatiser la gestion administrative (rendez-vous, facturation, résumés intelligents via IA, partage de documents) entre un secrétariat (ou entreprise) et ses clients. Ce projet est construit avec **SvelteKit**, **Appwrite** (auto-hébergé), et intègre des capacités IA de pointe (traitement de texte, génération de comptes-rendus, etc.).

## 🚀 Fonctionnalités Clés

* **Intelligence Artificielle & Automatisation :** Génération automatique de résumés de rendez-vous, pré-remplissage de factures, et rédaction proactive d'emails.
* **Gestion des Rendez-vous :** Synchronisation bidirectionnelle (Google Calendar/Outlook) et vue timeline des actions en attente.
* **Édition & Facturation :** Éditeur WYSIWYG intégré pour la création de documents et présentations, génération de factures PDF, et envoi multicanal.
* **Espaces Clients & Groupes :** Partage sécurisé de documents via des groupes dédiés. Chaque client accède uniquement à son historique et à ses fichiers.
* **Super Administration :** Back-office pour la gestion des quotas de stockage et des locataires (multi-tenancy).

## 🛠️ Stack Technique

* **Frontend :** SvelteKit, UIkit, Modern CSS Reset.
* **Backend & BaaS :** Appwrite (Authentification, Base de données, RBAC).
* **Stockage de Fichiers :** MinIO (compatible S3) pour le versioning et le partage robuste des documents.
* **Intelligence Artificielle :** Intégration d'API LLM (OpenAI, Anthropic) ou exécution de modèles en local (Ollama).
* **Déploiement :** Stack entièrement orchestrée avec Docker (`docker-compose`).

## 📁 Architecture du Projet

Le développement de ce projet suit une méthode itérative (Agile). Toute la documentation et le suivi sont versionnés :
* `docs/` : Contient toute la documentation technique (PRD, flow GitHub, prompt IA système, architecture).
* `dev_agile/` : Contient le backlog du produit et le suivi du sprint en cours.
* `src/` : Code source SvelteKit (à venir).

> Consultez le document de référence [PRD.md](./PRD.md) ou la documentation du [Workflow GitHub](./docs/01_gestion_projet/github_workflow.md) pour plus d'informations.

## 🤝 Contribution & Développement

Les développements respectent des conventions strictes décrites dans le `docs/01_gestion_projet/github_workflow.md` (Git Flow, Conventional Commits). Toute évolution d'infrastructure ou de logique métier s'appuie sur le *Master Prompt* de l'AI Agent (`docs/01_gestion_projet/ai_system_prompt.md`).

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](./LICENSE) pour plus de détails.

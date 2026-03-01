# Backlog Produit - Assistant AI

## Epic 1 : Infrastructure & Base de Données
- [ ] Mettre en place la stack Docker (Appwrite, SvelteKit, MinIO)
- [ ] Configurer les collections Appwrite (Profils, Clients, RDVs, Factures, Groupes)
- [ ] Paramétrer les droits et accès Appwrite (RBAC)
- [x] **Refactoring Docker** :
    - [x] Utiliser un réseau bridge pour Appwrite (domaine unique)
    - [x] Utiliser le backend pour stocker toutes les données plutôt qu'Appwrite directement (Option native locale au final)
    - [x] Implémenter WebSockets pour les mises à jour temps réel
    - [x] Utiliser des chemins relatifs pour l'administration Appwrite et MinIO
    - [x] Utiliser des chemins relatifs pour les images et fichiers
    - [x] Remplacer MinIO par rustFS (Ou option de stockage locale d'Appwrite)

## Epic 2 : Authentification & Espace Client
- [x] Créer le flux de connexion pour le Secrétaire (Admin)
- [ ] Créer la logique d'invitations (magic link/email) pour les Clients
- [ ] Développer le Dashboard Client (liste des RDV, Factures, Documents)

## Epic 3 : Core Features (Rendez-vous & IA)
- [ ] Implémenter la synchronisation avec Google/Outlook Calendar
- [ ] Créer le Dashboard Secrétaire (Timeline listant les actions à faire)
- [ ] Construire l'appel API (OpenAI/Ollama) pour générer les résumés et recommandations
- [ ] Automatiser la création de brouillons d'emails / feedbacks

## Epic 4 : Édition de Documents & Facturation
- [ ] Intégrer un éditeur WYSIWYG avancé (texte enrichi & publisher-like)
- [ ] Créer l'export PDF (via html2pdf, jsPDF ou similaire)
- [ ] Faire le lien entre le stockage local / éditeur et le bucket S3 (MinIO)
- [ ] Gérer l'envoi de documents par email (Notification Multicanal)
- [ ] **Refactoring Frontend** : utiliser des polices basiques ou importer les polices localement (asset folder)

## Epic 5 : Super Admin & Evolutions (MCP)
- [ ] Créer le Dashboard Super Admin (gestion quotas S3, stats IA, comptes utilisateurs)
- [ ] Implémenter le serveur MCP pour les requêtes IA externes

# Guide Utilisateur - AssistIA

Bienvenue sur **AssistIA**, votre assistant administratif intelligent. Ce guide vous explique de manière simple comment utiliser la plateforme au quotidien, selon votre profil.

---

## 👔 1. Pour les Secrétaires (Administrateurs de Projet)

Votre objectif est de vous faire gagner du temps sur vos tâches administratives après chaque rendez-vous.

### A. Le Tableau de bord (Dashboard)
À votre connexion, vous arrivez sur le **Dashboard**.
* Vous y verrez la **Timeline** de tous vos rendez-vous (synchronisés depuis votre agenda Google Calendar ou Outlook).
* Les rendez-vous "en attente d'action" (sans compte-rendu ou facture) sont mis en évidence.

### B. Traiter un rendez-vous (La magie de l'IA)
Une fois un rendez-vous terminé :
1. Cliquez sur le rendez-vous dans votre Timeline.
2. Dans la zone **Notes de la Séance**, saisissez quelques notes rapides de ce qui s'est dit.
3. Cliquez sur le bouton **"Générer avec l'IA"**.
4. L'Intelligence Artificielle va automatiquement analyser vos notes et rédiger un **compte-rendu propre** et structuré (Résumé, Décisions, Actions).

### C. Gérer l'IA et Éditer les Comptes Rendus
* **Édition manuelle** : Si le résumé généré par l'IA nécessite une retouche, cliquez simplement sur l'icône ✏️ dans l'encart "Résumé Généré". Vous pourrez modifier le texte et cliquer sur "Sauvegarder". Le résumé sera mis à jour.
* **Configuration de l'IA (Mode Super-Admin)** : La plateforme peut s'interfacer avec différentes IA. Dans le fichier `.env` du serveur, vous pouvez choisir le fournisseur (ex: `AI_PROVIDER=lmstudio` pour un fonctionnement 100% privé et local, ou `AI_PROVIDER=openai` pour utiliser GPT-4).

### D. Valider et Partager
1. L'IA vous affiche les documents générés (comptes-rendus, etc.). **Relisez-les**.
2. Cliquez sur **"Valider"**. 
3. Les documents sont automatiquement déposés dans le **Groupe Client** (un dossier partagé sécurisé) et le client en est notifié.

---

## 👤 2. Pour les Clients

Votre espace personnel vous permet de suivre votre activité de manière transparente et centralisée.

### A. Connexion
* Lorsque votre Secrétaire crée votre dossier, vous recevrez un email d'invitation.
* Cliquez sur le lien sécurisé dans l'email pour accéder à votre espace (pas besoin de retenir un mot de passe compliqué si vous utilisez le lien magique).

### B. Votre Espace Personnel (Dashboard Client)
Cet espace est strictement privé. Vous seul et votre Secrétaire y avez accès. Vous y trouverez :
1. **Historique des rendez-vous** : Retrouvez l'historique et les résumés des séances passées.
2. **Vos Factures** : Consultez et téléchargez vos factures au format PDF. L'état (Payée/En attente) est visible directement.
3. **Vos Documents Partagés** : Un espace sécurisé où vous pouvez télécharger les fichiers envoyés par votre secrétaire, ou **déposer vos propres documents** pour les transmettre de manière sécurisée sans passer par des emails classiques.

---

## ❓ Besoin d'aide ?
En cas de problème ou si vous avez des questions, n'hésitez pas à télécharger vos documents ou contacter directement le support de votre plateforme via la section "Aide" de votre tableau de bord.

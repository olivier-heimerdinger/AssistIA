# User Stories - Assistant AI

Ce document détaille les User Stories (US) principales basées sur le PRD pour les prochains sprints.

## Epic 1 : Infrastructure & Base de Données

**US 1.1 : Structure BDD**
*En tant que Développeur,*
*Je veux créer les collections Appwrite (Profils, Clients, RDVs, Factures, Groupes)*
*Afin de pouvoir stocker et manipuler les données de l'application.*
- [ ] DTO & Schémas validés
- [ ] Collections créées via API/Console Appwrite

**US 1.2 : Permissions (RBAC)**
*En tant qu'Admin système,*
*Je veux configurer des règles d'accès strictes sur Appwrite*
*Afin qu'un client ne puisse accéder qu'aux données de son Groupe.*

## Epic 2 : Authentification & Espace Client

**US 2.1 : Login Secrétaire**
*En tant que Secrétaire,*
*Je veux pouvoir me connecter avec un email et mot de passe de façon sécurisée*
*Afin d'accéder au dashboard complet de mon instance.*

**US 2.2 : Invitation & Login Client**
*En tant que Client,*
*Je veux recevoir un lien magique (ou un email avec un mot de passe)*
*Afin d'accéder rapidement et de manière sécurisée à mon espace personnel.*

**US 2.3 : Dashboard Client (Lecture seule)**
*En tant que Client,*
*Je veux voir la liste de mes rendez-vous passés et de mes factures*
*Afin de suivre mon historique avec le secrétariat.*

## Epic 3 : Core Features (Rendez-vous & IA)

**US 3.1 : Dashboard Timeline Secrétaire**
*En tant que Secrétaire,*
*Je veux avoir une vue chronologique (Timeline) de mes rendez-vous*
*Afin d'identifier rapidement ceux pour lesquels une action (résumé, facture) est requise.*

**US 3.2 : Analyse et Résumé des notes**
*En tant que Secrétaire,*
*Je veux saisir des notes brutes sur un rendez-vous et demander à l'IA d'en faire un résumé structuré*
*Afin de gagner du temps de rédaction.*

**US 3.3 : Générateur de feedbacks**
*En tant que Secrétaire,*
*Je veux que l'IA me propose un brouillon d'e-mail de suivi après un RDV*
*Afin de relancer ou remercier mon client pro-activement sans tout écrire de zéro.*

## Epic 4 : Édition de Documents & Facturation

**US 4.1 : Éditeur WYSIWYG**
*En tant que Secrétaire,*
*Je veux pouvoir rédiger et mettre en page des rapports ou présentations riches dans le navigateur*
*Afin de produire des documents propres sans outil externe.*

**US 4.2 : Génération PDF des factures**
*En tant que Secrétaire,*
*Je veux générer une facture PDF automatiquement pré-remplie avec le tarif horaire défini pour le client*
*Afin de clore la facturation d'un rendez-vous d'un simple clic.*

**US 4.3 : Partage de documents aux Groupes**
*En tant que Secrétaire,*
*Je veux pousser un document généré dans un "Groupe Client"*
*Afin que les clients de ce groupe y aient accès instantanément sur leur Dashboard.*

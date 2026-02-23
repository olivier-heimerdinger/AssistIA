# Gestion du Dépôt GitHub & Git Flow

Ce document définit les conventions et le workflow à respecter pour le développement du projet **Assistant AI** afin de garantir une collaboration fluide et un historique propre.

## 1. Stratégie de Branches (Git Flow Simplifié)

L'arborescence du dépôt repose sur deux branches principales et des branches éphémères :

- **`main`** : Branche de production. Le code y est toujours stable, testé et déployable. Les tags de version (ex: `v1.0.0`) y sont posés.
- **`develop`** : Branche d'intégration. Elle rassemble toutes les nouvelles fonctionnalités terminées avant la prochaine release.

### Branches éphémères
Créées depuis `develop`, elles sont mergées dans `develop` une fois terminées.
- **`feature/nom-de-la-feature`** : Pour développer une nouvelle fonctionnalité (ex: `feature/auth-appwrite`).
- **`bugfix/nom-du-bug`** : Pour corriger un bug non critique présent sur `develop`.
- **`hotfix/nom-du-hotfix`** : Créée **depuis `main`** pour corriger une urgence en production. Mergée ensuite dans `main` ET `develop`.

## 2. Conventions de Commits (Conventional Commits)

Chaque message de commit doit être explicite et structuré selon le format suivant :
`<type>(<scope optionnel>): <description courte>`

**Types autorisés :**
- `feat` : Ajout d'une nouvelle fonctionnalité.
- `fix` : Correction d'un bug.
- `docs` : Ajout ou modification de la documentation (ex: MAJ du PRD).
- `style` : Changements de formatage (espaces, point-virgules, etc.) sans impact sur la logique.
- `refactor` : Modification du code qui n'ajoute pas de fonctionnalité et ne corrige pas de bug (optimisation).
- `test` : Ajout ou modification de tests.
- `chore` : Tâches de maintenance, mise à jour des dépendances, configuration (Docker, etc.).

**Exemples :**
- `feat(auth): implémentation de la connexion secrétaire`
- `fix(ui): correction de l'alignement du bouton de génération PDF`
- `docs(projet): ajout des règles de gestion GitHub`

## 3. Pull Requests (PR) & Code Review

Les fusions vers `develop` ou `main` ne se font **jamais** directement (pas de force push). Elles nécessitent systématiquement une Pull Request.

### Règles pour une PR :
1. **Titre clair** : Reprendre la nomenclature des commits (ex: `feat: espace client - historique factures`).
2. **Lien avec une Issue / Tâche** : Mentionner le composant du backlog ou l'issue GitHub (ex: "Closes #12").
3. **Description** : Expliquer brièvement **quoi** a été fait et **pourquoi**.
4. **Validation (Review)** : Idéalement, la PR doit être relue (Code Review) avant d'être approuvée. Si vous êtes seul, utilisez la PR comme un point de vérification (linting, tests CI passés) avant de fusionner.

### Stratégie de Merge :
- Utiliser **Squash and Merge** pour garder un historique `develop` ou `main` lisible (un seul commit par feature).

## 4. Intégration Continue (GitHub Actions)

Des workflows automatisés (CI/CD) seront configurés pour s'assurer de la qualité du code à chaque PR :
- **Lint & Format** : Vérification SvelteKit (`eslint`, `prettier`).
- **Build test** : S'assurer que le projet compile correctement sans erreur Svelte.
- (Optionnel) **Tests unitaires** : Exécution des scripts de tests existants.

*(Les détails de déploiement continu vers la stack Docker/MinIO seront documentés dans `docs/04_deploiement/`)*

# Infrastructure & Déploiement

Ce document regroupe les instructions pour lancer et vérifier l'infrastructure du projet **Assistant AI**. L'application repose sur deux socles de données majeurs : **Appwrite** (Backend as a Service) et **MinIO** (Stockage de fichiers type S3).

## 1. Démarrer l'infrastructure unifiée (Appwrite + MinIO)

Pour simplifier le développement local et la gestion des réseaux, les deux systèmes ont été fusionnés via Docker Compose (support natif des fichiers `docker-compose.yml` et `docker-compose.override.yml`).

À la racine du projet, lancez simplement :

```bash
docker compose up -d
```

Docker téléchargera et lancera :
- La stack complète **Appwrite** (Base MariaDB, Redis, API, Traefik...).
- L'instance **MinIO** et son utilitaire de setup (`assistia-minio-init`) configurés pour utiliser le même réseau qu'Appwrite.

**Accès :**
- **Console Appwrite :** http://localhost (Créer le projet initial "AssistIA")
- **Console MinIO (S3) :** http://localhost:9001 (User: `admin` / Password: `supersecretadmin` par défaut)
- **Endpoint API S3 :** http://localhost:9000

---

## 2. Configuration Environnement (.env)

Les configurations secrètes sont gérées par le fichier caché `.env` (généré à l'origine par Appwrite). *Veillez à ne jamais le commiter s'il contient des mots de passe fixes de production*.

---

## 3. Script de Test Global

Une fois MinIO et Appwrite lancés, vous pouvez utiliser le script de vérification fourni pour valider que tous les services sont joignables :

```bash
chmod +x scripts/test_infra.sh
./scripts/test_infra.sh
```

Ce script vérifiera la présence de la console MinIO et de l'API Appwrite en local.

# Infrastructure & Déploiement

Ce document regroupe les instructions pour lancer et vérifier l'infrastructure du projet **Assistant AI**. L'application repose sur deux socles de données majeurs : **Appwrite** (Backend as a Service) et **MinIO** (Stockage de fichiers type S3).

## 1. Démarrer MinIO (Stockage S3)

MinIO est géré via le `docker-compose.yml` présent à la racine du projet.
Il inclut un conteneur d'initialisation (`minio-init`) qui crée automatiquement un bucket sécurisé nommé `assistia-documents`.

**Lancement :**
```bash
docker-compose up -d minio minio-init
```

**Accès :**
- **Console d'administration :** http://localhost:9001 (User: `admin` / Password: `supersecretadmin` par défaut, modifiable via un `.env`).
- **Endpoint API S3 :** http://localhost:9000

---

## 2. Installer et Démarrer Appwrite

Appwrite étant une suite complète, il est recommandé de l'installer via son script officiel pour générer sa propre configuration Docker (généralement dans un sous-dossier `appwrite/`).

**Installation :**
Exécutez la commande suivante à la racine du projet pour installer Appwrite (suivez les instructions interactives) :

```bash
docker run -it --rm \
    --volume /var/run/docker.sock:/var/run/docker.sock \
    --volume "$(pwd)"/appwrite:/usr/src/code/appwrite:rw \
    entrypoint/appwrite install
```

**Accès :**
Une fois installé, la console Appwrite est disponible sur le port 80 (ou celui choisi pendant l'installation), typiquement `http://localhost`.

---

## 3. Script de Test Global

Une fois MinIO et Appwrite lancés, vous pouvez utiliser le script de vérification fourni pour valider que tous les services sont joignables :

```bash
chmod +x scripts/test_infra.sh
./scripts/test_infra.sh
```

Ce script vérifiera la présence de la console MinIO et de l'API Appwrite en local.

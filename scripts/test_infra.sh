#!/bin/bash

# Script de test de l'infrastructure locale (Appwrite & MinIO)

echo "🔍 Vérification de l'infrastructure locale Assistant AI..."
echo "----------------------------------------"

# 1. Vérifier MinIO (Console)
echo -n "[MinIO] Vérification de la console Web (Port 9001)... "
curl -s -o /dev/null -w "%{http_code}" http://localhost:9001 > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ En ligne !"
else
    echo "❌ Hors ligne (est-ce que 'docker-compose up -d minio' a été lancé ?)"
fi

# 2. Vérifier MinIO (API S3)
echo -n "[MinIO] Vérification de l'API S3 (Port 9000)... "
curl -s -o /dev/null -w "%{http_code}" http://localhost:9000/minio/health/live > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ En ligne !"
else
    echo "❌ Hors ligne"
fi

# 3. Vérifier Appwrite (Healthcheck standard)
echo -n "[Appwrite] Vérification de l'instance Appwrite (Port 80)... "
# Le ping health d'appwrite répond sur /v1/health
curl -s -o /dev/null -w "%{http_code}" http://localhost/v1/health > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ En ligne !"
else
    echo "⚠️ Hors ligne ou port différent (Vérifiez votre dossier 'appwrite/')"
fi

echo "----------------------------------------"
echo "Terminé."

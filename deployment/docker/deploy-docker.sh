#!/bin/bash
# SCRIPT DE DÉPLOIEMENT DOCKER - DOUNIE CUISINE
# Déploiement avec Docker Compose

set -e

echo "🚀 DÉMARRAGE DÉPLOIEMENT DOUNIE CUISINE AVEC DOCKER"

# Fonction de log
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Vérification Docker
if ! command -v docker &> /dev/null; then
    log "❌ Docker n'est pas installé"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    log "❌ Docker Compose n'est pas installé"
    exit 1
fi

# 1. Construction des images
log "Construction des images Docker..."
docker-compose build --no-cache

# 2. Arrêt des services existants
log "Arrêt des services existants..."
docker-compose down --remove-orphans

# 3. Démarrage des services
log "Démarrage des services..."
docker-compose up -d

# 4. Attente du démarrage
log "Attente du démarrage des services..."
sleep 15

# 5. Vérification des services
log "Vérification des services..."

# Vérification MongoDB
if docker-compose exec -T mongodb mongosh --eval "db.runCommand('ping')" > /dev/null 2>&1; then
    log "✅ MongoDB démarré avec succès"
else
    log "⚠️ MongoDB non accessible"
fi

# Vérification Backend
if curl -f http://localhost:8001/api/health > /dev/null 2>&1; then
    log "✅ Backend API démarré avec succès"
else
    log "⚠️ Backend API non accessible"
    docker-compose logs backend
fi

# Vérification Frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    log "✅ Frontend démarré avec succès"
else
    log "⚠️ Frontend non accessible"
    docker-compose logs frontend
fi

# 6. Informations d'accès
log "🎉 DÉPLOIEMENT DOCKER TERMINÉ!"

echo ""
echo "=== INFORMATIONS D'ACCÈS ==="
echo "🌐 Application publique: http://localhost:3000"
echo "🔧 API Backend: http://localhost:8001"
echo "🔌 API Health: http://localhost:8001/api/health"
echo "📊 MongoDB: localhost:27017"

echo ""
echo "=== COMMANDES UTILES ==="
echo "Voir les conteneurs: docker-compose ps"
echo "Logs backend: docker-compose logs -f backend"
echo "Logs frontend: docker-compose logs -f frontend"
echo "Logs MongoDB: docker-compose logs -f mongodb"
echo "Shell backend: docker-compose exec backend bash"
echo "Shell MongoDB: docker-compose exec mongodb mongosh"
echo "Arrêter: docker-compose down"
echo "Redémarrer: docker-compose restart"
echo "================================="
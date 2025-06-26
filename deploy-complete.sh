#!/bin/bash
# SCRIPT DE DÉPLOIEMENT COMPLET - DOUNIE CUISINE
# Démarre tous les services du restaurant haïtien

set -e

echo "🚀 DÉMARRAGE COMPLET DE DOUNIE CUISINE"

# Variables
PROJECT_DIR="/app"

# Fonction de log
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# 1. Installation des dépendances API (Express.js + TypeScript)
log "📦 Installation dépendances API..."
cd $PROJECT_DIR/api
npm install

# 2. Installation des dépendances Public App (React + Vite)
log "📦 Installation dépendances Public..."
cd $PROJECT_DIR/public
npm install

# 3. Installation des dépendances Administration (React)
log "📦 Installation dépendances Administration..."
cd $PROJECT_DIR/administration
npm install

# 4. Installation des dépendances Backend FastAPI (Python)
log "📦 Installation dépendances Backend Python..."
cd $PROJECT_DIR/backend
pip install -r requirements.txt

# 5. Installation des dépendances Frontend React (si différent)
log "📦 Installation dépendances Frontend..."
cd $PROJECT_DIR/frontend
yarn install

# 6. Configuration de la base de données
log "🗄️ Configuration base de données..."
# PostgreSQL pour l'API principal
sudo systemctl start postgresql || echo "PostgreSQL déjà en cours ou non installé"
# MongoDB pour le backend alternatif
sudo systemctl start mongodb || echo "MongoDB déjà en cours ou non installé"

# 7. Construction des applications
log "🔨 Construction des applications..."

# Build API
cd $PROJECT_DIR/api
npm run build

# Build Public App
cd $PROJECT_DIR/public
npm run build

# Build Administration
cd $PROJECT_DIR/administration
npm run build

# 8. Démarrage des services via supervisor
log "🚀 Démarrage des services..."

# Configuration supervisor pour tous les services
sudo tee /etc/supervisor/conf.d/dounie-complete.conf > /dev/null <<EOF
[group:dounie-cuisine]
programs=dounie-api,dounie-public,dounie-admin,dounie-backend,dounie-frontend

[program:dounie-api]
command=npm start
directory=$PROJECT_DIR/api
user=root
autostart=true
autorestart=true
stderr_logfile=/var/log/dounie-api.err.log
stdout_logfile=/var/log/dounie-api.out.log
environment=NODE_ENV=production,PORT=5000

[program:dounie-public]
command=npm run preview
directory=$PROJECT_DIR/public
user=root
autostart=true
autorestart=true
stderr_logfile=/var/log/dounie-public.err.log
stdout_logfile=/var/log/dounie-public.out.log
environment=PORT=80

[program:dounie-admin]
command=serve -s build -l 3001
directory=$PROJECT_DIR/administration
user=root
autostart=true
autorestart=true
stderr_logfile=/var/log/dounie-admin.err.log
stdout_logfile=/var/log/dounie-admin.out.log

[program:dounie-backend]
command=python server.py
directory=$PROJECT_DIR/backend
user=root
autostart=true
autorestart=true
stderr_logfile=/var/log/dounie-backend-py.err.log
stdout_logfile=/var/log/dounie-backend-py.out.log
environment=PORT=8001

[program:dounie-frontend]
command=yarn start
directory=$PROJECT_DIR/frontend
user=root
autostart=true
autorestart=true
stderr_logfile=/var/log/dounie-frontend.err.log
stdout_logfile=/var/log/dounie-frontend.out.log
environment=PORT=3000
EOF

# Installation de serve pour servir les builds React
npm install -g serve

# Redémarrage supervisor
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start dounie-cuisine:*

# 9. Vérification des services
log "🔍 Vérification des services..."
sleep 10

# Test API Express (Port 5000)
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    log "✅ API Express (Port 5000) - OK"
else
    log "⚠️ API Express (Port 5000) - Non accessible"
fi

# Test Public App (Port 80)
if curl -f http://localhost:80 > /dev/null 2>&1; then
    log "✅ Public App (Port 80) - OK"
else
    log "⚠️ Public App (Port 80) - Non accessible"
fi

# Test Administration (Port 3001)
if curl -f http://localhost:3001 > /dev/null 2>&1; then
    log "✅ Administration (Port 3001) - OK"
else
    log "⚠️ Administration (Port 3001) - Non accessible"
fi

# Test Backend FastAPI (Port 8001)
if curl -f http://localhost:8001/api/health > /dev/null 2>&1; then
    log "✅ Backend FastAPI (Port 8001) - OK"
else
    log "⚠️ Backend FastAPI (Port 8001) - Non accessible"
fi

# Test Frontend React (Port 3000)
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    log "✅ Frontend React (Port 3000) - OK"
else
    log "⚠️ Frontend React (Port 3000) - Non accessible"
fi

log "🎉 DÉPLOIEMENT COMPLET TERMINÉ!"

echo ""
echo "=== ACCÈS AUX APPLICATIONS ==="
echo "🌐 Site Public (Vite): http://localhost:80"
echo "👥 Site Public (React): http://localhost:3000"
echo "🔧 Administration: http://localhost:3001"
echo "🔌 API Express: http://localhost:5000"
echo "🔌 API FastAPI: http://localhost:8001"

echo ""
echo "=== GESTION DES SERVICES ==="
echo "Status: sudo supervisorctl status dounie-cuisine:*"
echo "Restart: sudo supervisorctl restart dounie-cuisine:*"
echo "Logs API: sudo supervisorctl tail dounie-api"
echo "Logs Admin: sudo supervisorctl tail dounie-admin"
echo "================================="
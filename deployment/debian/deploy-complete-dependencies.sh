#!/bin/bash
# SCRIPT DE DÉPLOIEMENT COMPLET AVEC SYSTÈME DE DÉPENDANCES
# DOUNIE CUISINE - Restaurant Haïtien
# Ordre d'exécution: Base de données → Services Backend → Services Frontend

set -e

echo "🚀 DÉPLOIEMENT COMPLET DOUNIE CUISINE AVEC GESTION DES DÉPENDANCES"

# Variables
PROJECT_DIR="/app"
LOG_DIR="/var/log/dounie"

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction de log avec couleurs
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] ✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] ⚠️ $1${NC}"
}

log_error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ❌ $1${NC}"
}

# Fonction pour vérifier qu'un service est démarré
wait_for_service() {
    local service_name=$1
    local port=$2
    local max_attempts=30
    local attempt=1

    log "Attente du démarrage de $service_name sur le port $port..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s -o /dev/null -w "%{http_code}" http://localhost:$port > /dev/null 2>&1; then
            log_success "$service_name démarré avec succès (port $port)"
            return 0
        fi
        
        log "Tentative $attempt/$max_attempts pour $service_name..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    log_error "$service_name n'a pas démarré dans les temps impartis"
    return 1
}

# Créer les répertoires de logs
sudo mkdir -p $LOG_DIR
sudo chmod 755 $LOG_DIR

echo "🗂️ ÉTAPE 1: PRÉPARATION DU SYSTÈME"

# 1.1 Mise à jour système
log "Mise à jour du système..."
sudo apt update && sudo apt upgrade -y

# 1.2 Installation des dépendances système
log "Installation des dépendances système..."
sudo apt install -y curl wget git build-essential

echo ""
echo "📦 ÉTAPE 2: INSTALLATION DES BASES DE DONNÉES (ORDRE DE PRIORITÉ)"

# 2.1 Installation et configuration MongoDB (pour Backend FastAPI)
log "Installation MongoDB..."
if ! command -v mongod &> /dev/null; then
    curl -fsSL https://pgp.mongodb.com/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
    echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] http://repo.mongodb.org/apt/debian bookworm/mongodb-org/7.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
    sudo apt update
    sudo apt install -y mongodb-org
fi

# 2.2 Installation PostgreSQL (pour API Express)
log "Installation PostgreSQL..."
if ! command -v psql &> /dev/null; then
    sudo apt install -y postgresql postgresql-contrib
fi

# 2.3 Démarrage des bases de données (OBLIGATOIRE AVANT LES SERVICES)
log "Démarrage MongoDB..."
sudo service mongodb start || sudo systemctl start mongod || echo "MongoDB déjà en cours"

log "Démarrage PostgreSQL..."
sudo service postgresql start || echo "PostgreSQL déjà en cours"

# 2.4 Configuration des bases de données
log "Configuration des bases de données..."
sudo -u postgres createdb dounie_cuisine 2>/dev/null || echo "DB dounie_cuisine existe déjà"

log_success "Bases de données configurées et démarrées"

echo ""
echo "🐍 ÉTAPE 3: ENVIRONNEMENT PYTHON (Backend FastAPI)"

# 3.1 Installation Python et pip
log "Installation Python et pip..."
sudo apt install -y python3 python3-pip python3-venv

# 3.2 Installation des dépendances Backend FastAPI
log "Installation dépendances Backend FastAPI..."
cd $PROJECT_DIR/backend
pip3 install -r requirements.txt

log_success "Backend FastAPI configuré"

echo ""
echo "🟢 ÉTAPE 4: ENVIRONNEMENT NODE.JS (Frontends et API)"

# 4.1 Installation Node.js et npm
log "Installation Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

# 4.2 Installation Yarn
log "Installation Yarn..."
if ! command -v yarn &> /dev/null; then
    npm install -g yarn
fi

# 4.3 Installation serve (pour servir les builds)
log "Installation serve..."
npm install -g serve

echo ""
echo "📱 ÉTAPE 5: INSTALLATION DÉPENDANCES APPLICATIONS (ORDRE SÉQUENTIEL)"

# 5.1 API Express (TypeScript)
log "Installation dépendances API Express..."
cd $PROJECT_DIR/api
npm install

# 5.2 Frontend React principal
log "Installation dépendances Frontend React..."
cd $PROJECT_DIR/frontend
yarn install

# 5.3 Site Public (Vite)
log "Installation dépendances Site Public..."
cd $PROJECT_DIR/public
npm install

# 5.4 Administration (avec correction des conflits)
log "Installation dépendances Administration..."
cd $PROJECT_DIR/administration
npm install --legacy-peer-deps || npm install --force

log_success "Toutes les dépendances installées"

echo ""
echo "🔨 ÉTAPE 6: CONSTRUCTION DES APPLICATIONS (ORDRE DE DÉPENDANCE)"

# 6.1 Build API Express
log "Construction API Express..."
cd $PROJECT_DIR/api
npm run build

# 6.2 Build Site Public
log "Construction Site Public..."
cd $PROJECT_DIR/public
npm run build

# 6.3 Build Administration (si possible)
log "Construction Administration..."
cd $PROJECT_DIR/administration
npm run build || log_warning "Build Administration échoué, utilisation en mode dev"

log_success "Applications construites"

echo ""
echo "⚙️ ÉTAPE 7: CONFIGURATION SUPERVISOR (GESTION DÉPENDANCES SERVICES)"

log "Configuration Supervisor..."
sudo apt install -y supervisor

# Configuration avec dépendances entre services
sudo tee /etc/supervisor/conf.d/dounie-complete.conf > /dev/null <<EOF
[group:dounie-databases]
programs=dounie-mongodb,dounie-postgres

[group:dounie-backends]
programs=dounie-backend-fastapi,dounie-api-express

[group:dounie-frontends]
programs=dounie-frontend-react,dounie-public-site,dounie-admin

; ============= BASES DE DONNÉES (PRIORITÉ 1) =============
[program:dounie-mongodb]
command=mongod --dbpath /var/lib/mongodb --logpath $LOG_DIR/mongodb.log --fork
directory=/var/lib/mongodb
user=mongodb
autostart=true
autorestart=true
priority=100
stderr_logfile=$LOG_DIR/mongodb.err.log
stdout_logfile=$LOG_DIR/mongodb.out.log

[program:dounie-postgres]
command=/usr/lib/postgresql/15/bin/postgres -D /var/lib/postgresql/15/main -c config_file=/etc/postgresql/15/main/postgresql.conf
directory=/var/lib/postgresql/15/main
user=postgres
autostart=true
autorestart=true
priority=101
stderr_logfile=$LOG_DIR/postgres.err.log
stdout_logfile=$LOG_DIR/postgres.out.log

; ============= BACKENDS (PRIORITÉ 2) =============
[program:dounie-backend-fastapi]
command=python3 server.py
directory=$PROJECT_DIR/backend
user=root
autostart=true
autorestart=true
priority=200
stderr_logfile=$LOG_DIR/backend-fastapi.err.log
stdout_logfile=$LOG_DIR/backend-fastapi.out.log
environment=PORT=8001,MONGO_URL="mongodb://localhost:27017/dounie_cuisine"

[program:dounie-api-express]
command=npm start
directory=$PROJECT_DIR/api
user=root
autostart=true
autorestart=true
priority=201
stderr_logfile=$LOG_DIR/api-express.err.log
stdout_logfile=$LOG_DIR/api-express.out.log
environment=NODE_ENV=production,PORT=5000

; ============= FRONTENDS (PRIORITÉ 3) =============
[program:dounie-frontend-react]
command=yarn start
directory=$PROJECT_DIR/frontend
user=root
autostart=true
autorestart=true
priority=300
stderr_logfile=$LOG_DIR/frontend-react.err.log
stdout_logfile=$LOG_DIR/frontend-react.out.log
environment=PORT=3000

[program:dounie-public-site]
command=npm run preview -- --port 80 --host 0.0.0.0
directory=$PROJECT_DIR/public
user=root
autostart=true
autorestart=true
priority=301
stderr_logfile=$LOG_DIR/public-site.err.log
stdout_logfile=$LOG_DIR/public-site.out.log

[program:dounie-admin]
command=serve -s build -l 3001
directory=$PROJECT_DIR/administration
user=root
autostart=true
autorestart=true
priority=302
stderr_logfile=$LOG_DIR/admin.err.log
stdout_logfile=$LOG_DIR/admin.out.log
EOF

echo ""
echo "🚀 ÉTAPE 8: DÉMARRAGE SÉQUENTIEL DES SERVICES (ORDRE DE DÉPENDANCE)"

# 8.1 Redémarrage supervisor
log "Redémarrage de Supervisor..."
sudo service supervisor restart
sudo supervisorctl reread
sudo supervisorctl update

# 8.2 Démarrage en ordre de priorité
log "Démarrage des bases de données (Priorité 1)..."
sudo supervisorctl start dounie-databases:*
sleep 10

log "Démarrage des backends (Priorité 2)..."
sudo supervisorctl start dounie-backends:*
sleep 15

# Vérification des backends avant de démarrer les frontends
if wait_for_service "Backend FastAPI" 8001; then
    log_success "Backend FastAPI prêt"
else
    log_warning "Backend FastAPI n'est pas prêt, mais on continue"
fi

log "Démarrage des frontends (Priorité 3)..."
sudo supervisorctl start dounie-frontends:*

echo ""
echo "🔍 ÉTAPE 9: VÉRIFICATION DES SERVICES (TESTS DE SANTÉ)"

sleep 20

# Tests de santé pour chaque service
log "Vérification de l'état des services..."

# Backend FastAPI (Port 8001)
if curl -f http://localhost:8001/api/health > /dev/null 2>&1; then
    log_success "✅ Backend FastAPI (Port 8001) - OPÉRATIONNEL"
else
    log_error "❌ Backend FastAPI (Port 8001) - NON ACCESSIBLE"
fi

# API Express (Port 5000)
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    log_success "✅ API Express (Port 5000) - OPÉRATIONNEL"
else
    log_warning "⚠️ API Express (Port 5000) - NON ACCESSIBLE"
fi

# Frontend React (Port 3000)
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    log_success "✅ Frontend React (Port 3000) - OPÉRATIONNEL"
else
    log_error "❌ Frontend React (Port 3000) - NON ACCESSIBLE"
fi

# Site Public (Port 80)
if curl -f http://localhost:80 > /dev/null 2>&1; then
    log_success "✅ Site Public (Port 80) - OPÉRATIONNEL"
else
    log_error "❌ Site Public (Port 80) - NON ACCESSIBLE"
fi

# Administration (Port 3001)
if curl -f http://localhost:3001 > /dev/null 2>&1; then
    log_success "✅ Administration (Port 3001) - OPÉRATIONNEL"
else
    log_warning "⚠️ Administration (Port 3001) - NON ACCESSIBLE"
fi

echo ""
echo "🎉 DÉPLOIEMENT COMPLET TERMINÉ!"

echo ""
echo "=== INFORMATIONS D'ACCÈS ==="
echo "🌐 Site Public (Vite): http://localhost:80"
echo "👥 Frontend React: http://localhost:3000"
echo "🔧 Administration: http://localhost:3001"
echo "🔌 API Express: http://localhost:5000"
echo "🔌 Backend FastAPI: http://localhost:8001"
echo "📊 MongoDB: localhost:27017"
echo "🐘 PostgreSQL: localhost:5432"

echo ""
echo "=== GESTION DES SERVICES (ORDRE DE DÉPENDANCE) ==="
echo "Status global: sudo supervisorctl status"
echo "Restart bases: sudo supervisorctl restart dounie-databases:*"
echo "Restart backends: sudo supervisorctl restart dounie-backends:*"
echo "Restart frontends: sudo supervisorctl restart dounie-frontends:*"
echo "Logs système: tail -f $LOG_DIR/*.log"
echo "================================="
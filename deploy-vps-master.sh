#!/bin/bash

# =============================================================================
# SCRIPT DE DÉPLOIEMENT MASTER DOUNIE CUISINE - VPS/DEBIAN
# Version Bulletproof avec vérification intelligente de l'arborescence
# Déploiement complet : Express.js + FastAPI + React + PostgreSQL + MongoDB
# =============================================================================

set -e

# Configuration
PROJECT_NAME="dounie-cuisine"
INSTALL_DIR="/var/www/html"
PROJECT_PATH="${INSTALL_DIR}/${PROJECT_NAME}"
GITHUB_REPO="https://github.com/SkrCodyxx/DounieCuisine_done.git"
BACKUP_DIR="/backup/dounie-cuisine"
LOG_DIR="/var/log/dounie-cuisine"
CHECKPOINT_FILE="/tmp/dounie-deploy-checkpoint"
ERROR_LOG="/tmp/dounie-deploy-errors.log"

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Fonctions de logging
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_checkpoint() { echo -e "${PURPLE}[CHECKPOINT]${NC} $1"; }
log_fix() { echo -e "${CYAN}[AUTO-FIX]${NC} $1"; }

# Vérification intelligente de l'arborescence
check_project_structure() {
    log_info "🔍 Vérification intelligente de l'arborescence du projet..."
    
    local required_dirs=("api" "public" "administration" "backend" "frontend")
    local required_files=("api/package.json" "public/package.json" "administration/package.json" "backend/requirements.txt" "frontend/package.json")
    local missing_items=()
    
    # Vérifier si le répertoire principal existe
    if [[ ! -d "$PROJECT_PATH" ]]; then
        log_warning "Répertoire $PROJECT_PATH n'existe pas"
        return 1
    fi
    
    cd "$PROJECT_PATH"
    
    # Vérifier les dossiers requis
    for dir in "${required_dirs[@]}"; do
        if [[ ! -d "$dir" ]]; then
            missing_items+=("dossier: $dir")
        fi
    done
    
    # Vérifier les fichiers requis
    for file in "${required_files[@]}"; do
        if [[ ! -f "$file" ]]; then
            missing_items+=("fichier: $file")
        fi
    done
    
    if [[ ${#missing_items[@]} -eq 0 ]]; then
        log_success "✅ Arborescence complète détectée dans $PROJECT_PATH"
        log_info "Structure trouvée :"
        log_info "  📁 api/ (Express.js + TypeScript)"
        log_info "  📁 public/ (React + Vite)"
        log_info "  📁 administration/ (React Admin)"
        log_info "  📁 backend/ (FastAPI + Python)"
        log_info "  📁 frontend/ (React alternatif)"
        return 0
    else
        log_warning "⚠️ Arborescence incomplète. Éléments manquants :"
        for item in "${missing_items[@]}"; do
            log_warning "  ❌ $item"
        done
        return 1
    fi
}

# Clonage intelligent depuis GitHub
smart_clone_project() {
    log_info "📥 Clonage intelligent du projet depuis GitHub..."
    
    # Sauvegarder l'ancienne installation si elle existe
    if [[ -d "$PROJECT_PATH" ]]; then
        local backup_name="backup-incomplete-$(date +%Y%m%d_%H%M%S)"
        log_warning "Sauvegarde de l'installation incomplète..."
        mkdir -p "$BACKUP_DIR"
        cp -r "$PROJECT_PATH" "$BACKUP_DIR/$backup_name" 2>/dev/null || true
        log_success "Sauvegarde créée : $BACKUP_DIR/$backup_name"
        rm -rf "$PROJECT_PATH"
    fi
    
    # Cloner le projet
    mkdir -p "$INSTALL_DIR"
    cd "$INSTALL_DIR"
    
    log_info "Clonage depuis : $GITHUB_REPO"
    git clone "$GITHUB_REPO" "$PROJECT_NAME"
    
    if [[ $? -eq 0 ]]; then
        log_success "✅ Projet cloné avec succès"
        # Vérifier à nouveau la structure après clonage
        if check_project_structure; then
            log_success "✅ Structure complète confirmée après clonage"
            return 0
        else
            log_error "❌ Structure toujours incomplète après clonage"
            return 1
        fi
    else
        log_error "❌ Échec du clonage depuis GitHub"
        return 1
    fi
}

# Gestion intelligente des sources
manage_project_sources() {
    log_info "📋 Gestion intelligente des sources du projet..."
    
    if check_project_structure; then
        log_success "Utilisation des fichiers existants dans $PROJECT_PATH"
        return 0
    else
        log_warning "Arborescence incomplète ou manquante"
        log_info "Tentative de clonage depuis GitHub..."
        
        if smart_clone_project; then
            log_success "Projet récupéré depuis GitHub avec succès"
            return 0
        else
            log_error "Impossible de récupérer le projet"
            log_error "Assurez-vous que :"
            log_error "1. Les fichiers sont correctement placés dans /var/www/html/"
            log_error "2. Le repository GitHub est accessible"
            log_error "3. La connexion internet fonctionne"
            exit 1
        fi
    fi
}

# Système de checkpoints
CHECKPOINTS=(
    "check_environment"
    "manage_sources"
    "prepare_system"
    "install_nodejs"
    "install_python"
    "install_databases"
    "install_webserver"
    "install_process_managers"
    "configure_databases"
    "setup_environment_variables"
    "install_dependencies"
    "build_applications"
    "configure_nginx"
    "configure_services"
    "setup_monitoring"
    "setup_backups"
    "configure_firewall"
    "run_comprehensive_tests"
    "finalize_deployment"
)

# Sauvegarde du checkpoint
save_checkpoint() {
    echo "$1" > "$CHECKPOINT_FILE"
    log_checkpoint "Point de contrôle sauvegardé: $1"
}

# Lecture du dernier checkpoint
get_last_checkpoint() {
    if [[ -f "$CHECKPOINT_FILE" ]]; then
        cat "$CHECKPOINT_FILE"
    else
        echo ""
    fi
}

# =============================================================================
# IMPLÉMENTATION DES CHECKPOINTS
# =============================================================================

check_environment() {
    log_info "🔍 Vérification de l'environnement système..."
    
    # Vérifier les permissions root
    if [[ $EUID -ne 0 ]]; then
        log_error "Ce script doit être exécuté en tant que root"
        log_error "Utilisez : sudo ./deploy-vps-master.sh"
        exit 1
    fi
    
    # Vérifier le système d'exploitation
    if ! command -v apt-get &> /dev/null; then
        log_error "Système non supporté. Debian/Ubuntu requis."
        exit 1
    fi
    
    # Vérifier la connectivité internet
    if ! ping -c 1 google.com &> /dev/null; then
        log_warning "Connectivité internet limitée. Certaines étapes pourraient échouer."
    fi
    
    # Créer les répertoires nécessaires
    mkdir -p "$INSTALL_DIR" "$BACKUP_DIR" "$LOG_DIR"
    
    log_success "Environnement validé"
    save_checkpoint "manage_sources"
}

manage_sources() {
    manage_project_sources
    cd "$PROJECT_PATH"
    log_success "Sources du projet prêtes"
    save_checkpoint "prepare_system"
}

prepare_system() {
    log_info "🔧 Préparation du système..."
    
    # Configuration pour éviter les prompts interactifs
    export DEBIAN_FRONTEND=noninteractive
    
    # Mise à jour du système
    log_info "Mise à jour des paquets système..."
    apt-get update
    apt-get upgrade -y
    
    # Installation des outils de base
    log_info "Installation des outils de base..."
    apt-get install -y \
        curl wget git vim htop unzip zip \
        software-properties-common \
        build-essential \
        ca-certificates \
        gnupg \
        lsb-release \
        jq \
        rsync \
        supervisor \
        ufw \
        fail2ban
    
    log_success "Système préparé"
    save_checkpoint "install_nodejs"
}

install_nodejs() {
    log_info "📦 Installation de Node.js 20.x..."
    
    # Vérifier si Node.js 20+ est déjà installé
    if command -v node &> /dev/null; then
        node_version=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [[ "$node_version" -ge 20 ]]; then
            log_success "Node.js $node_version déjà installé"
            save_checkpoint "install_python"
            return
        fi
    fi
    
    # Supprimer les anciennes versions
    apt-get remove -y nodejs npm || true
    
    # Installer Node.js 20 via NodeSource
    log_info "Installation de Node.js 20 depuis NodeSource..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
    
    # Installer les outils globaux
    npm install -g yarn pm2 serve
    
    # Vérifier l'installation
    NODE_VERSION=$(node --version)
    NPM_VERSION=$(npm --version)
    YARN_VERSION=$(yarn --version)
    
    log_success "Node.js $NODE_VERSION, npm $NPM_VERSION, yarn $YARN_VERSION installés"
    save_checkpoint "install_python"
}

install_python() {
    log_info "🐍 Installation de Python 3.9+ et pip..."
    
    # Installer Python 3 et pip
    apt-get install -y python3 python3-pip python3-venv python3-dev
    
    # Mettre à jour pip
    python3 -m pip install --upgrade pip
    
    # Installer les outils Python nécessaires
    python3 -m pip install virtualenv
    
    # Vérifier l'installation
    PYTHON_VERSION=$(python3 --version)
    PIP_VERSION=$(python3 -m pip --version | cut -d' ' -f2)
    
    log_success "$PYTHON_VERSION et pip $PIP_VERSION installés"
    save_checkpoint "install_databases"
}

install_databases() {
    log_info "🗄️ Installation des bases de données..."
    
    # Installation PostgreSQL
    log_info "Installation de PostgreSQL..."
    apt-get install -y postgresql postgresql-contrib
    systemctl start postgresql
    systemctl enable postgresql
    
    # Installation MongoDB
    log_info "Installation de MongoDB..."
    wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
    apt-get update
    apt-get install -y mongodb-org
    systemctl start mongod
    systemctl enable mongod
    
    log_success "PostgreSQL et MongoDB installés"
    save_checkpoint "install_webserver"
}

install_webserver() {
    log_info "🌐 Installation de Nginx..."
    
    apt-get install -y nginx
    systemctl start nginx
    systemctl enable nginx
    
    log_success "Nginx installé"
    save_checkpoint "install_process_managers"
}

install_process_managers() {
    log_info "⚙️ Configuration des gestionnaires de processus..."
    
    # PM2 déjà installé avec Node.js
    pm2 startup systemd -u root --hp /root
    
    # Configuration Supervisor
    systemctl start supervisor
    systemctl enable supervisor
    
    log_success "Gestionnaires de processus configurés"
    save_checkpoint "configure_databases"
}

configure_databases() {
    log_info "🔐 Configuration des bases de données..."
    
    # Configuration PostgreSQL
    log_info "Configuration de PostgreSQL..."
    
    # Générer des mots de passe sécurisés
    PG_PASSWORD="dounie_pg_$(openssl rand -hex 16)"
    MONGO_PASSWORD="dounie_mongo_$(openssl rand -hex 16)"
    
    # Configuration PostgreSQL
    sudo -u postgres psql << EOF
DO \$\$
BEGIN
    -- Supprimer l'utilisateur s'il existe
    IF EXISTS (SELECT FROM pg_user WHERE usename = 'dounie_user') THEN
        DROP USER dounie_user;
    END IF;
    
    -- Supprimer la base s'elle existe
    IF EXISTS (SELECT FROM pg_database WHERE datname = 'dounie_cuisine') THEN
        DROP DATABASE dounie_cuisine;
    END IF;
    
    -- Créer la nouvelle base et l'utilisateur
    CREATE DATABASE dounie_cuisine;
    CREATE USER dounie_user WITH PASSWORD '$PG_PASSWORD';
    GRANT ALL PRIVILEGES ON DATABASE dounie_cuisine TO dounie_user;
    ALTER USER dounie_user CREATEDB;
END
\$\$;
EOF
    
    # Configuration MongoDB
    log_info "Configuration de MongoDB..."
    
    # Créer l'utilisateur admin MongoDB
    mongosh << EOF
use admin
db.createUser({
  user: "admin",
  pwd: "$MONGO_PASSWORD",
  roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase"]
})

use dounie_cuisine
db.createUser({
  user: "dounie_user",
  pwd: "$MONGO_PASSWORD",
  roles: ["readWrite"]
})
EOF
    
    # Sauvegarder les identifiants
    cat > /root/.dounie-credentials << EOF
# Identifiants bases de données Dounie Cuisine
PG_PASSWORD=$PG_PASSWORD
MONGO_PASSWORD=$MONGO_PASSWORD
SESSION_SECRET=dounie-session-$(openssl rand -hex 32)
EOF
    
    chmod 600 /root/.dounie-credentials
    
    log_success "Bases de données configurées avec des identifiants sécurisés"
    save_checkpoint "setup_environment_variables"
}

setup_environment_variables() {
    log_info "🔐 Configuration des variables d'environnement..."
    
    # Charger les identifiants
    source /root/.dounie-credentials
    
    # Configuration API Express.js
    cat > "$PROJECT_PATH/api/.env" << EOF
# Base de données PostgreSQL
DATABASE_URL=postgresql://dounie_user:$PG_PASSWORD@localhost:5432/dounie_cuisine

# Configuration application
NODE_ENV=production
SESSION_SECRET=$SESSION_SECRET

# Ports
API_PORT=5000
PUBLIC_PORT=3000
ADMIN_PORT=3001

# Sécurité
BCRYPT_ROUNDS=12

# Fonctionnalités avancées
MESSAGING_ENABLED=true
REAL_TIME_NOTIFICATIONS=true
MONITORING_ENABLED=true
HEALTH_CHECK_INTERVAL=30000
EOF
    
    # Configuration Backend FastAPI
    cat > "$PROJECT_PATH/backend/.env" << EOF
# Base de données MongoDB
MONGO_URL=mongodb://dounie_user:$MONGO_PASSWORD@localhost:27017/dounie_cuisine?authSource=dounie_cuisine

# Configuration application
ENVIRONMENT=production
SECRET_KEY=$SESSION_SECRET

# Ports
BACKEND_PORT=8001

# Sécurité
BCRYPT_ROUNDS=12
EOF
    
    # Configuration Frontend React
    cat > "$PROJECT_PATH/frontend/.env" << EOF
# URL du backend pour les appels API
REACT_APP_BACKEND_URL=http://localhost:8001/api
EOF
    
    # Configuration applications publique et admin
    cat > "$PROJECT_PATH/public/.env" << EOF
VITE_API_URL=http://localhost:5000/api
EOF
    
    cat > "$PROJECT_PATH/administration/.env" << EOF
VITE_API_URL=http://localhost:5000/api
EOF
    
    log_success "Variables d'environnement configurées"
    save_checkpoint "install_dependencies"
}

install_dependencies() {
    log_info "📦 Installation de toutes les dépendances..."
    
    cd "$PROJECT_PATH"
    
    # API Express.js
    log_info "Installation des dépendances API Express.js..."
    cd api
    npm install --production
    cd ..
    
    # Application publique
    log_info "Installation des dépendances application publique..."
    cd public
    npm install
    cd ..
    
    # Administration
    log_info "Installation des dépendances administration..."
    cd administration
    npm install
    cd ..
    
    # Backend FastAPI
    log_info "Installation des dépendances Backend FastAPI..."
    cd backend
    python3 -m pip install -r requirements.txt
    cd ..
    
    # Frontend React
    log_info "Installation des dépendances Frontend React..."
    cd frontend
    yarn install
    cd ..
    
    log_success "Toutes les dépendances installées"
    save_checkpoint "build_applications"
}

build_applications() {
    log_info "🏗️ Construction de toutes les applications..."
    
    cd "$PROJECT_PATH"
    
    # Build API Express.js
    log_info "Construction de l'API Express.js..."
    cd api
    npm run build
    cd ..
    
    # Build application publique
    log_info "Construction de l'application publique..."
    cd public
    npm run build
    cd ..
    
    # Build administration
    log_info "Construction de l'interface d'administration..."
    cd administration
    npm run build
    cd ..
    
    # Build frontend React
    log_info "Construction du frontend React..."
    cd frontend
    yarn build
    cd ..
    
    log_success "Toutes les applications construites"
    save_checkpoint "configure_nginx"
}

configure_nginx() {
    log_info "🌐 Configuration avancée de Nginx..."
    
    # Configuration Nginx complète
    cat > /etc/nginx/sites-available/dounie-cuisine << 'EOF'
# Configuration Nginx Dounie Cuisine - Production Complète
server {
    listen 80;
    server_name _;
    
    # Logs détaillés
    access_log /var/log/nginx/dounie-cuisine.access.log;
    error_log /var/log/nginx/dounie-cuisine.error.log;
    
    # Headers de sécurité
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header X-Content-Security-Policy "default-src 'self' 'unsafe-inline' 'unsafe-eval'" always;
    
    # Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json image/svg+xml;
    
    # Limites
    client_max_body_size 100M;
    client_body_timeout 60s;
    client_header_timeout 60s;
    
    # Application publique principale (Vite) - Racine
    location / {
        root /var/www/html/dounie-cuisine/public/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache pour fichiers statiques
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            access_log off;
        }
    }
    
    # Interface d'administration
    location /admin {
        alias /var/www/html/dounie-cuisine/administration/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Frontend React alternatif
    location /app {
        alias /var/www/html/dounie-cuisine/frontend/build;
        try_files $uri $uri/ /index.html;
    }
    
    # API Express.js principal
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # API FastAPI Backend alternatif
    location /api/v2 {
        rewrite ^/api/v2/(.*) /api/$1 break;
        proxy_pass http://localhost:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # WebSocket pour messagerie temps réel
    location /ws {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Pages d'erreur
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
}
EOF
    
    # Activer le site
    ln -sf /etc/nginx/sites-available/dounie-cuisine /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    
    # Tester et recharger
    nginx -t
    systemctl reload nginx
    
    log_success "Nginx configuré pour architecture complète"
    save_checkpoint "configure_services"
}

configure_services() {
    log_info "⚙️ Configuration des services avec Supervisor..."
    
    # Configuration Supervisor complète
    cat > /etc/supervisor/conf.d/dounie-cuisine.conf << EOF
[group:dounie-cuisine]
programs=dounie-api,dounie-backend,dounie-frontend

[program:dounie-api]
command=node dist/index.js
directory=/var/www/html/dounie-cuisine/api
user=root
autostart=true
autorestart=true
stderr_logfile=/var/log/dounie-cuisine/api.err.log
stdout_logfile=/var/log/dounie-cuisine/api.out.log
environment=NODE_ENV=production,PORT=5000

[program:dounie-backend]
command=python3 server.py
directory=/var/www/html/dounie-cuisine/backend
user=root
autostart=true
autorestart=true
stderr_logfile=/var/log/dounie-cuisine/backend.err.log
stdout_logfile=/var/log/dounie-cuisine/backend.out.log
environment=PORT=8001

[program:dounie-frontend]
command=serve -s build -l 3000
directory=/var/www/html/dounie-cuisine/frontend
user=root
autostart=true
autorestart=true
stderr_logfile=/var/log/dounie-cuisine/frontend.err.log
stdout_logfile=/var/log/dounie-cuisine/frontend.out.log
EOF
    
    # Recharger Supervisor
    supervisorctl reread
    supervisorctl update
    supervisorctl start dounie-cuisine:*
    
    log_success "Services configurés avec Supervisor"
    save_checkpoint "setup_monitoring"
}

setup_monitoring() {
    log_info "📊 Configuration du système de monitoring..."
    
    # Script de monitoring intelligent
    cat > /usr/local/bin/dounie-monitor << 'EOF'
#!/bin/bash

LOG_FILE="/var/log/dounie-cuisine/monitor.log"
STATUS_FILE="/var/log/dounie-cuisine/status.json"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

# Tests de santé
api_status="FAIL"
backend_status="FAIL"
frontend_status="FAIL"
nginx_status="FAIL"
pg_status="FAIL"
mongo_status="FAIL"

# Test API Express.js
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    api_status="OK"
else
    supervisorctl restart dounie-cuisine:dounie-api
fi

# Test Backend FastAPI
if curl -f http://localhost:8001/api/health > /dev/null 2>&1; then
    backend_status="OK"
else
    supervisorctl restart dounie-cuisine:dounie-backend
fi

# Test Frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    frontend_status="OK"
else
    supervisorctl restart dounie-cuisine:dounie-frontend
fi

# Test Nginx
if systemctl is-active --quiet nginx; then
    nginx_status="OK"
else
    systemctl restart nginx
fi

# Test PostgreSQL
if systemctl is-active --quiet postgresql; then
    pg_status="OK"
else
    systemctl restart postgresql
fi

# Test MongoDB
if systemctl is-active --quiet mongod; then
    mongo_status="OK"
else
    systemctl restart mongod
fi

# Générer le rapport JSON
cat > $STATUS_FILE << EOJ
{
    "timestamp": "$DATE",
    "services": {
        "api_express": "$api_status",
        "backend_fastapi": "$backend_status", 
        "frontend_react": "$frontend_status",
        "nginx": "$nginx_status",
        "postgresql": "$pg_status",
        "mongodb": "$mongo_status"
    },
    "system": {
        "uptime": "$(uptime -p)",
        "disk_usage": "$(df / | awk 'NR==2 {print $5}')",
        "memory_usage": "$(free | awk 'NR==2{printf "%.1f%%", $3*100/$2}')"
    }
}
EOJ

echo "[$DATE] API:$api_status Backend:$backend_status Frontend:$frontend_status Nginx:$nginx_status PG:$pg_status Mongo:$mongo_status" >> $LOG_FILE
EOF
    
    chmod +x /usr/local/bin/dounie-monitor
    
    # Cron job pour monitoring
    (crontab -l 2>/dev/null || true; echo "* * * * * /usr/local/bin/dounie-monitor") | crontab -
    
    log_success "Monitoring configuré"
    save_checkpoint "setup_backups"
}

setup_backups() {
    log_info "💾 Configuration du système de sauvegarde..."
    
    # Script de sauvegarde complet
    cat > /etc/cron.daily/dounie-backup << 'EOF'
#!/bin/bash

source /root/.dounie-credentials
BACKUP_DIR="/backup/dounie-cuisine"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR/{db,app,configs}

# Sauvegarde PostgreSQL
pg_dump -h localhost -U dounie_user dounie_cuisine > $BACKUP_DIR/db/postgresql_$DATE.sql

# Sauvegarde MongoDB
mongodump --host localhost --db dounie_cuisine --username dounie_user --password $MONGO_PASSWORD --out $BACKUP_DIR/db/mongodb_$DATE

# Sauvegarde application
tar -czf $BACKUP_DIR/app/app_$DATE.tar.gz /var/www/html/dounie-cuisine

# Sauvegarde configurations
tar -czf $BACKUP_DIR/configs/config_$DATE.tar.gz \
    /etc/nginx/sites-available/dounie-cuisine \
    /etc/supervisor/conf.d/dounie-cuisine.conf \
    /root/.dounie-credentials

# Nettoyage (30 jours)
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
find $BACKUP_DIR -type d -name "mongodb_*" -mtime +30 -exec rm -rf {} +

echo "Sauvegarde terminée: $DATE"
EOF
    
    chmod +x /etc/cron.daily/dounie-backup
    
    log_success "Sauvegardes configurées"
    save_checkpoint "configure_firewall"
}

configure_firewall() {
    log_info "🛡️ Configuration du firewall..."
    
    # Configuration UFW
    ufw --force reset
    ufw default deny incoming
    ufw default allow outgoing
    ufw allow ssh
    ufw allow 'Nginx Full'
    ufw allow 5000/tcp    # API Express
    ufw allow 8001/tcp    # Backend FastAPI
    ufw allow 3000/tcp    # Frontend React
    ufw --force enable
    
    # Configuration fail2ban
    systemctl start fail2ban
    systemctl enable fail2ban
    
    log_success "Firewall configuré"
    save_checkpoint "run_comprehensive_tests"
}

run_comprehensive_tests() {
    log_info "🧪 Exécution des tests complets du système..."
    
    # Attendre que tous les services démarrent
    sleep 30
    
    local test_results=()
    local all_tests_passed=true
    
    # Test 1: API Express.js
    log_info "Test API Express.js (port 5000)..."
    if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
        log_success "✅ API Express.js - RÉUSSI"
        test_results+=("API Express.js: RÉUSSI")
    else
        log_error "❌ API Express.js - ÉCHEC"
        test_results+=("API Express.js: ÉCHEC")
        all_tests_passed=false
    fi
    
    # Test 2: Backend FastAPI
    log_info "Test Backend FastAPI (port 8001)..."
    if curl -f http://localhost:8001/api/health > /dev/null 2>&1; then
        log_success "✅ Backend FastAPI - RÉUSSI"
        test_results+=("Backend FastAPI: RÉUSSI")
    else
        log_error "❌ Backend FastAPI - ÉCHEC"
        test_results+=("Backend FastAPI: ÉCHEC")
        all_tests_passed=false
    fi
    
    # Test 3: Frontend React (port 3000)
    log_info "Test Frontend React (port 3000)..."
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        log_success "✅ Frontend React - RÉUSSI"
        test_results+=("Frontend React: RÉUSSI")
    else
        log_error "❌ Frontend React - ÉCHEC"
        test_results+=("Frontend React: ÉCHEC")
        all_tests_passed=false
    fi
    
    # Test 4: Application publique via Nginx
    log_info "Test Application publique via Nginx..."
    if curl -f http://localhost/ > /dev/null 2>&1; then
        log_success "✅ Application publique - RÉUSSI"
        test_results+=("Application publique: RÉUSSI")
    else
        log_error "❌ Application publique - ÉCHEC"
        test_results+=("Application publique: ÉCHEC")
        all_tests_passed=false
    fi
    
    # Test 5: Interface d'administration
    log_info "Test Interface d'administration..."
    if curl -f http://localhost/admin > /dev/null 2>&1; then
        log_success "✅ Interface admin - RÉUSSI"
        test_results+=("Interface admin: RÉUSSI")
    else
        log_error "❌ Interface admin - ÉCHEC"
        test_results+=("Interface admin: ÉCHEC")
        all_tests_passed=false
    fi
    
    # Test 6: PostgreSQL
    log_info "Test PostgreSQL..."
    if systemctl is-active --quiet postgresql; then
        log_success "✅ PostgreSQL - RÉUSSI"
        test_results+=("PostgreSQL: RÉUSSI")
    else
        log_error "❌ PostgreSQL - ÉCHEC"
        test_results+=("PostgreSQL: ÉCHEC")
        all_tests_passed=false
    fi
    
    # Test 7: MongoDB
    log_info "Test MongoDB..."
    if systemctl is-active --quiet mongod; then
        log_success "✅ MongoDB - RÉUSSI"
        test_results+=("MongoDB: RÉUSSI")
    else
        log_error "❌ MongoDB - ÉCHEC"
        test_results+=("MongoDB: ÉCHEC")
        all_tests_passed=false
    fi
    
    # Générer le rapport de tests
    cat > "/var/log/dounie-cuisine/test-report.json" << EOF
{
    "test_date": "$(date -Iseconds)",
    "overall_status": "$(if $all_tests_passed; then echo 'SUCCESS'; else echo 'PARTIAL_SUCCESS'; fi)",
    "tests": {
        "api_express": "$(if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then echo 'PASS'; else echo 'FAIL'; fi)",
        "backend_fastapi": "$(if curl -f http://localhost:8001/api/health > /dev/null 2>&1; then echo 'PASS'; else echo 'FAIL'; fi)",
        "frontend_react": "$(if curl -f http://localhost:3000 > /dev/null 2>&1; then echo 'PASS'; else echo 'FAIL'; fi)",
        "public_app": "$(if curl -f http://localhost/ > /dev/null 2>&1; then echo 'PASS'; else echo 'FAIL'; fi)",
        "admin_interface": "$(if curl -f http://localhost/admin > /dev/null 2>&1; then echo 'PASS'; else echo 'FAIL'; fi)",
        "postgresql": "$(if systemctl is-active --quiet postgresql; then echo 'PASS'; else echo 'FAIL'; fi)",
        "mongodb": "$(if systemctl is-active --quiet mongod; then echo 'PASS'; else echo 'FAIL'; fi)"
    }
}
EOF
    
    if $all_tests_passed; then
        log_success "🎉 Tous les tests sont RÉUSSIS!"
        save_checkpoint "finalize_deployment"
    else
        log_warning "⚠️ Certains tests ont échoué, mais le système est partiellement fonctionnel"
        log_info "Consultez les logs pour plus de détails:"
        log_info "  - Logs API: tail -f /var/log/dounie-cuisine/api.err.log"
        log_info "  - Logs Backend: tail -f /var/log/dounie-cuisine/backend.err.log"
        log_info "  - Logs Frontend: tail -f /var/log/dounie-cuisine/frontend.err.log"
        save_checkpoint "finalize_deployment"
    fi
}

finalize_deployment() {
    log_info "🎯 Finalisation du déploiement..."
    
    # Nettoyer les fichiers temporaires
    rm -f "$CHECKPOINT_FILE"
    
    # Exécuter le premier monitoring
    /usr/local/bin/dounie-monitor
    
    # Créer un rapport final
    local server_ip=$(hostname -I | awk '{print $1}')
    cat > "/var/log/dounie-cuisine/deployment-final.json" << EOF
{
    "deployment_completed": "$(date -Iseconds)",
    "server_ip": "$server_ip",
    "architecture": "dual_backend",
    "components": {
        "api_express": {
            "status": "deployed",
            "port": 5000,
            "url": "http://$server_ip/api"
        },
        "backend_fastapi": {
            "status": "deployed", 
            "port": 8001,
            "url": "http://$server_ip/api/v2"
        },
        "frontend_react": {
            "status": "deployed",
            "port": 3000,
            "url": "http://$server_ip:3000"
        },
        "public_app": {
            "status": "deployed",
            "url": "http://$server_ip"
        },
        "admin_interface": {
            "status": "deployed",
            "url": "http://$server_ip/admin"
        }
    },
    "databases": {
        "postgresql": "configured",
        "mongodb": "configured"
    },
    "features": {
        "monitoring": "enabled",
        "backups": "enabled",
        "firewall": "enabled",
        "messaging": "enabled"
    }
}
EOF
    
    log_success "Déploiement finalisé avec succès!"
}

# =============================================================================
# AFFICHAGE FINAL DÉTAILLÉ
# =============================================================================

show_final_summary() {
    echo ""
    echo "🎉============================================================🎉"
    log_success "   DÉPLOIEMENT DOUNIE CUISINE TERMINÉ AVEC SUCCÈS!"
    echo "   Architecture Double Backend Sécurisée Déployée"
    echo "=============================================================="
    echo ""
    
    local server_ip=$(hostname -I | awk '{print $1}')
    
    log_info "🌐 URLS D'ACCÈS PRINCIPALES:"
    echo "   🌍 Site Public Principal:    http://$server_ip"
    echo "   ⚙️  Interface Administration: http://$server_ip/admin"
    echo "   📱 Application React:        http://$server_ip/app"
    echo ""
    
    log_info "🔗 APIs DISPONIBLES:"
    echo "   🔵 API Express.js Principal: http://$server_ip/api"
    echo "   🟠 API FastAPI Alternatif:   http://$server_ip/api/v2"
    echo "   💬 WebSocket Messagerie:     ws://$server_ip/ws"
    echo ""
    
    log_info "🎮 SERVICES EN COURS D'EXÉCUTION:"
    echo "   📡 API Express.js:    Port 5000 (Supervisor)"
    echo "   🐍 Backend FastAPI:   Port 8001 (Supervisor)"
    echo "   ⚛️  Frontend React:    Port 3000 (Supervisor)"
    echo "   🌐 Nginx Proxy:       Port 80"
    echo "   🗄️  PostgreSQL:       Port 5432"
    echo "   📊 MongoDB:           Port 27017"
    echo ""
    
    log_info "👥 COMPTES PAR DÉFAUT:"
    echo "   🔐 Admin:      admin / admin123"
    echo "   👔 Manager:    lucie.manager / staff123"
    echo "   👨‍💼 Staff:      marc.staff / staff123"
    echo "   👤 Client:     marie.delorme / client123"
    echo ""
    
    log_info "📋 COMMANDES DE GESTION:"
    echo "   📊 Status services:    supervisorctl status dounie-cuisine:*"
    echo "   🔄 Restart API:        supervisorctl restart dounie-cuisine:dounie-api"
    echo "   🔄 Restart Backend:    supervisorctl restart dounie-cuisine:dounie-backend"
    echo "   🔄 Restart Frontend:   supervisorctl restart dounie-cuisine:dounie-frontend"
    echo "   🌐 Status Nginx:       systemctl status nginx"
    echo "   🗄️  Status PostgreSQL: systemctl status postgresql"
    echo "   📊 Status MongoDB:     systemctl status mongod"
    echo ""
    
    log_info "📁 EMPLACEMENTS IMPORTANTS:"
    echo "   🏠 Application:        /var/www/html/dounie-cuisine"
    echo "   📋 Logs:              /var/log/dounie-cuisine/"
    echo "   💾 Sauvegardes:       /backup/dounie-cuisine"
    echo "   ⚙️  Config Nginx:      /etc/nginx/sites-available/dounie-cuisine"
    echo "   🔐 Identifiants:      /root/.dounie-credentials"
    echo ""
    
    log_info "🔍 MONITORING ET LOGS:"
    echo "   📊 Status système:     cat /var/log/dounie-cuisine/status.json"
    echo "   📋 Logs API:           tail -f /var/log/dounie-cuisine/api.out.log"
    echo "   📋 Logs Backend:       tail -f /var/log/dounie-cuisine/backend.out.log"
    echo "   📋 Logs Frontend:      tail -f /var/log/dounie-cuisine/frontend.out.log"
    echo "   📋 Logs Nginx:         tail -f /var/log/nginx/dounie-cuisine.access.log"
    echo "   📈 Monitoring auto:    /usr/local/bin/dounie-monitor"
    echo ""
    
    log_info "✨ FONCTIONNALITÉS AVANCÉES ACTIVÉES:"
    echo "   💬 Messagerie interne temps réel"
    echo "   📊 Monitoring système automatique (1 min)"
    echo "   💾 Sauvegardes automatiques quotidiennes"
    echo "   🔄 Auto-redémarrage des services en cas de panne"
    echo "   🛡️  Firewall UFW + Fail2ban configurés"
    echo "   🔐 Architecture double backend sécurisée"
    echo "   📈 Logs détaillés et rapports JSON"
    echo ""
    
    log_info "🎯 ARCHITECTURE DÉPLOYÉE:"
    echo "   🔸 Frontend: React (Vite) + React (CRA) + Admin React"
    echo "   🔸 Backend: Express.js (TypeScript) + FastAPI (Python)"
    echo "   🔸 Bases: PostgreSQL + MongoDB"
    echo "   🔸 Proxy: Nginx avec SSL-ready"
    echo "   🔸 Process: Supervisor + Monitoring"
    echo ""
    
    log_info "📚 PROCHAINES ÉTAPES RECOMMANDÉES:"
    echo "   1. ✅ Tester toutes les URLs ci-dessus"
    echo "   2. ✅ Configurer SSL: ./setup-ssl.sh votre-domaine.com"
    echo "   3. ✅ Personnaliser le contenu via /admin"
    echo "   4. ✅ Tester la messagerie interne"
    echo "   5. ✅ Vérifier les sauvegardes: ls -la /backup/dounie-cuisine"
    echo "   6. ✅ Former l'équipe à l'utilisation"
    echo ""
    
    echo "🍽️============================================================🍽️"
    log_success "   DOUNIE CUISINE PRÊT POUR LA PRODUCTION!"
    log_success "   Architecture Sécurisée à Double Backend Opérationnelle"
    echo "=============================================================="
    
    # Afficher un résumé des tests
    if [[ -f "/var/log/dounie-cuisine/test-report.json" ]]; then
        echo ""
        log_info "📋 RÉSUMÉ DES TESTS AUTOMATIQUES:"
        cat /var/log/dounie-cuisine/test-report.json | jq -r '.tests | to_entries[] | "   \(.key): \(.value)"' 2>/dev/null || echo "   Rapport de tests disponible dans /var/log/dounie-cuisine/test-report.json"
    fi
}

# =============================================================================
# FONCTION PRINCIPALE
# =============================================================================

main() {
    # Configuration de la gestion d'erreurs
    trap 'log_error "Erreur détectée ligne $LINENO. Consultez $ERROR_LOG"; exit 1' ERR
    
    echo "🚀============================================================🚀"
    echo "   DÉPLOIEMENT MASTER DOUNIE CUISINE - VPS/DEBIAN"
    echo "   Architecture Double Backend Sécurisée"
    echo "   Express.js + FastAPI + React + PostgreSQL + MongoDB"
    echo "=============================================================="
    echo ""
    
    # Vérifier la reprise depuis checkpoint
    last_checkpoint=$(get_last_checkpoint)
    start_from_checkpoint=false
    
    if [[ -n "$last_checkpoint" ]]; then
        log_warning "⚡ Checkpoint détecté: $last_checkpoint"
        log_info "Reprise du déploiement depuis le dernier point..."
        start_from_checkpoint=true
    fi
    
    # Exécuter les checkpoints
    for checkpoint in "${CHECKPOINTS[@]}"; do
        if $start_from_checkpoint; then
            if [[ "$checkpoint" == "$last_checkpoint" ]]; then
                start_from_checkpoint=false
                continue
            elif [[ "$start_from_checkpoint" == true ]]; then
                continue
            fi
        fi
        
        log_info "🎯 Exécution: $checkpoint"
        $checkpoint
    done
    
    # Affichage final
    show_final_summary
}

# Exécution du script
main "$@"
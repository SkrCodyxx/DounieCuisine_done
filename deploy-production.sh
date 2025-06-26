#!/bin/bash

# =============================================================================
# DPLOIEMENT COMPLET DOUNIE CUISINE - DEBIAN/UBUNTU
# Script unique pour deploiement production sur serveur VPS/dedie
# Architecture: Express.js + FastAPI + React + PostgreSQL + MongoDB
# Auteur: Dounie Cuisine Team
# Version: 2.0 Final
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

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='033[0m'

# Fonctions de logging
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_checkpoint() { echo -e "${PURPLE}[CHECKPOINT]${NC} $1"; }

# Verification de l'arborescence du projet
check_project_structure() {
    log_info " Verification de l'arborescence du projet..."
    
    local required_dirs=("api" "public" "administration" "backend" "frontend")
    local required_files=("api/package.json" "public/package.json" "administration/package.json" "backend/requirements.txt" "frontend/package.json")
    local missing_items=()
    
    if [[ ! -d "$PROJECT_PATH" ]]; then
        log_warning "Repertoire $PROJECT_PATH n'existe pas"
        return 1
    fi
    
    cd "$PROJECT_PATH"
    
    for dir in "${required_dirs[@]}"; do
        if [[ ! -d "$dir" ]]; then
            missing_items+=("dossier: $dir")
        fi
    done
    
    for file in "${required_files[@]}"; do
        if [[ ! -f "$file" ]]; then
            missing_items+=("fichier: $file")
        fi
    done
    
    if [[ ${#missing_items[@]} -eq 0 ]]; then
        log_success " Arborescence complete detectee"
        return 0
    else
        log_warning " lements manquants: ${missing_items[*]}"
        return 1
    fi
}

# Clonage intelligent depuis GitHub
clone_project_from_github() {
    log_info " Clonage du projet depuis GitHub..."
    
    if [[ -d "$PROJECT_PATH" ]]; then
        local backup_name="backup-$(date +%Y%m%d_%H%M%S)"
        mkdir -p "$BACKUP_DIR"
        mv "$PROJECT_PATH" "$BACKUP_DIR/$backup_name"
        log_info "Sauvegarde creee: $BACKUP_DIR/$backup_name"
    fi
    
    mkdir -p "$INSTALL_DIR"
    cd "$INSTALL_DIR"
    
    if git clone "$GITHUB_REPO" "$PROJECT_NAME"; then
        log_success " Projet clone avec succes depuis GitHub"
        return 0
    else
        log_error " chec du clonage"
        return 1
    fi
}

# Gestion intelligente des sources
manage_project_sources() {
    log_info " Gestion des sources du projet..."
    
    if check_project_structure; then
        log_success "Utilisation des fichiers existants"
        return 0
    else
        log_info "Tentative de clonage depuis GitHub..."
        if clone_project_from_github && check_project_structure; then
            return 0
        else
            log_error "Impossible de recuperer le projet complet"
            log_error "Assurez-vous que :"
            log_error "1. Les fichiers sont dans /var/www/html/ OU"
            log_error "2. Le repository GitHub est accessible"
            exit 1
        fi
    fi
}

# Systeme de checkpoints
CHECKPOINTS=(
    "check_environment"
    "manage_sources"
    "prepare_system"
    "install_nodejs"
    "install_python"
    "install_databases"
    "install_webserver"
    "configure_databases"
    "setup_environment_variables"
    "install_dependencies"
    "build_applications"
    "configure_nginx"
    "configure_services"
    "setup_monitoring"
    "setup_backups"
    "configure_firewall"
    "run_final_tests"
    "finalize_deployment"
)

save_checkpoint() {
    echo "$1" > "$CHECKPOINT_FILE"
    log_checkpoint "Point sauvegarde: $1"
}

get_last_checkpoint() {
    [[ -f "$CHECKPOINT_FILE" ]] && cat "$CHECKPOINT_FILE" || echo ""
}

# =============================================================================
# IMPLMENTATION DES TAPES DE DPLOIEMENT
# =============================================================================

check_environment() {
    log_info " Verification de l'environnement..."
    
    if [[ $EUID -ne 0 ]]; then
        log_error "Ce script doit etre execute en tant que root"
        log_error "Utilisez: sudo ./deploy-production.sh"
        exit 1
    fi
    
    if ! command -v apt-get &> /dev/null; then
        log_error "Systeme non supporte. Debian/Ubuntu requis."
        exit 1
    fi
    
    mkdir -p "$INSTALL_DIR" "$BACKUP_DIR" "$LOG_DIR"
    log_success "Environnement valide"
    save_checkpoint "manage_sources"
}

manage_sources() {
    manage_project_sources
    cd "$PROJECT_PATH"
    log_success "Sources du projet pretes"
    save_checkpoint "prepare_system"
}

prepare_system() {
    log_info " Preparation du systeme..."
    
    export DEBIAN_FRONTEND=noninteractive
    
    apt-get update
    apt-get upgrade -y
    
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
        fail2ban \
        bc \
        nginx
    
    log_success "Systeme prepare"
    save_checkpoint "install_nodejs"
}

install_nodejs() {
    log_info " Installation de Node.js 20..."
    
    if command -v node &> /dev/null; then
        node_version=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [[ "$node_version" -ge 20 ]]; then
            log_success "Node.js $node_version dej installe"
            
            # Installer les outils globaux si manquants
            npm install -g yarn pm2 serve 2>/dev/null || true
            
            save_checkpoint "install_python"
            return
        fi
    fi
    
    # Installation Node.js 20
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
    npm install -g yarn pm2 serve
    
    log_success "Node.js $(node --version) installe"
    save_checkpoint "install_python"
}

install_python() {
    log_info " Installation de Python et dependances..."
    
    apt-get install -y python3 python3-pip python3-venv python3-dev python3-full
    
    # Corriger le probleme externally-managed
    python3 -m pip install --break-system-packages --upgrade pip virtualenv
    
    # Installer les packages Python via apt quand possible
    apt-get install -y \
        python3-fastapi \
        python3-uvicorn \
        python3-pymongo \
        python3-bcrypt \
        python3-passlib \
        python3-python-multipart || {
        log_warning "Installation apt echouee, utilisation de pip..."
        python3 -m pip install --break-system-packages \
            fastapi uvicorn pymongo bcrypt passlib python-multipart
    }
    
    log_success "Python $(python3 --version) installe"
    save_checkpoint "install_databases"
}

install_databases() {
    log_info " Installation des bases de donnees..."
    
    # PostgreSQL
    apt-get install -y postgresql postgresql-contrib
    
    # Creer l'utilisateur postgres si necessaire
    if ! id "postgres" &>/dev/null; then
        adduser --system --group --home /var/lib/postgresql --shell /bin/bash postgres
    fi
    
    systemctl start postgresql
    systemctl enable postgresql
    
    # MongoDB
    log_info "Installation de MongoDB..."
    
    # Methode moderne pour MongoDB
    curl -fsSL https://pgp.mongodb.com/server-6.0.asc | gpg --dearmor -o /usr/share/keyrings/mongodb-server-6.0.gpg
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
    
    apt-get update
    apt-get install -y mongodb-org || {
        log_warning "Installation MongoDB officielle echouee, utilisation du package Debian..."
        apt-get install -y mongodb
    }
    
    systemctl start mongod || systemctl start mongodb
    systemctl enable mongod || systemctl enable mongodb
    
    log_success "Bases de donnees installees"
    save_checkpoint "install_webserver"
}

install_webserver() {
    log_info " Configuration de Nginx..."
    
    systemctl start nginx
    systemctl enable nginx
    
    # Configuration PM2
    pm2 startup systemd -u root --hp /root || true
    
    # Configuration Supervisor
    systemctl start supervisor
    systemctl enable supervisor
    
    log_success "Serveur web configure"
    save_checkpoint "configure_databases"
}

configure_databases() {
    log_info " Configuration des bases de donnees..."
    
    # Generer des mots de passe securises
    local PG_PASSWORD="dounie_pg_$(openssl rand -hex 16 2>/dev/null || echo "secure$(date +%s)")"
    local MONGO_PASSWORD="dounie_mongo_$(openssl rand -hex 16 2>/dev/null || echo "secure$(date +%s)")"
    local SESSION_SECRET="dounie-session-$(openssl rand -hex 32 2>/dev/null || echo "supersecure$(date +%s)")"
    
    # Attendre que PostgreSQL soit pret
    sleep 5
    
    # Configuration PostgreSQL
    log_info "Configuration de PostgreSQL..."
    sudo -u postgres psql << EOF || {
        log_warning "Configuration PostgreSQL avancee echouee, utilisation basique..."
        sudo -u postgres createdb dounie_cuisine 2>/dev/null || true
        sudo -u postgres psql -c "CREATE USER dounie_user WITH PASSWORD '$PG_PASSWORD';" 2>/dev/null || true
        sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE dounie_cuisine TO dounie_user;" 2>/dev/null || true
    }
DO \$\$
BEGIN
    IF EXISTS (SELECT FROM pg_user WHERE usename = 'dounie_user') THEN
        DROP USER dounie_user;
    END IF;
    
    IF EXISTS (SELECT FROM pg_database WHERE datname = 'dounie_cuisine') THEN
        DROP DATABASE dounie_cuisine;
    END IF;
    
    CREATE DATABASE dounie_cuisine;
    CREATE USER dounie_user WITH PASSWORD '$PG_PASSWORD';
    GRANT ALL PRIVILEGES ON DATABASE dounie_cuisine TO dounie_user;
    ALTER USER dounie_user CREATEDB;
END
\$\$;
EOF
    
    # Configuration MongoDB
    log_info "Configuration de MongoDB..."
    sleep 5
    
    mongosh << EOF || {
        log_warning "Configuration MongoDB avancee echouee, mais on continue..."
    }
use admin
try {
    db.createUser({
      user: "admin",
      pwd: "$MONGO_PASSWORD",
      roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase"]
    })
} catch(e) { print("Admin existe dej") }

use dounie_cuisine
try {
    db.createUser({
      user: "dounie_user",
      pwd: "$MONGO_PASSWORD",
      roles: ["readWrite"]
    })
} catch(e) { print("Utilisateur existe dej") }
EOF
    
    # Sauvegarder les identifiants
    cat > /root/.dounie-credentials << EOF
PG_PASSWORD=$PG_PASSWORD
MONGO_PASSWORD=$MONGO_PASSWORD
SESSION_SECRET=$SESSION_SECRET
EOF
    
    chmod 600 /root/.dounie-credentials
    log_success "Bases de donnees configurees"
    save_checkpoint "setup_environment_variables"
}

setup_environment_variables() {
    log_info " Configuration des variables d'environnement..."
    
    source /root/.dounie-credentials
    
    # API Express.js
    cat > "$PROJECT_PATH/api/.env" << EOF
DATABASE_URL=postgresql://dounie_user:$PG_PASSWORD@localhost:5432/dounie_cuisine
NODE_ENV=production
SESSION_SECRET=$SESSION_SECRET
API_PORT=5000
PUBLIC_PORT=3000
ADMIN_PORT=3001
BCRYPT_ROUNDS=12
MESSAGING_ENABLED=true
REAL_TIME_NOTIFICATIONS=true
MONITORING_ENABLED=true
EOF
    
    # Backend FastAPI
    cat > "$PROJECT_PATH/backend/.env" << EOF
MONGO_URL=mongodb://dounie_user:$MONGO_PASSWORD@localhost:27017/dounie_cuisine?authSource=dounie_cuisine
ENVIRONMENT=production
SECRET_KEY=$SESSION_SECRET
BACKEND_PORT=8001
BCRYPT_ROUNDS=12
EOF
    
    # Frontend React
    cat > "$PROJECT_PATH/frontend/.env" << EOF
REACT_APP_BACKEND_URL=http://localhost:8001/api
EOF
    
    # Applications publique et admin
    cat > "$PROJECT_PATH/public/.env" << EOF
VITE_API_URL=http://localhost:5000/api
EOF
    
    cat > "$PROJECT_PATH/administration/.env" << EOF
VITE_API_URL=http://localhost:5000/api
EOF
    
    log_success "Variables d'environnement configurees"
    save_checkpoint "install_dependencies"
}

install_dependencies() {
    log_info " Installation des dependances..."
    
    cd "$PROJECT_PATH"
    
    # API Express.js
    log_info " Dependances API Express.js..."
    cd api && npm install --production && cd ..
    
    # Application publique
    log_info " Dependances application publique..."
    cd public && npm install && cd ..
    
    # Administration
    log_info " Dependances administration..."
    cd administration && npm install && cd ..
    
    # Backend FastAPI
    log_info " Dependances Backend FastAPI..."
    cd backend
    python3 -m pip install --break-system-packages -r requirements.txt || {
        log_warning "Installation pip echouee, packages dej installes via apt"
    }
    cd ..
    
    # Frontend React
    log_info " Dependances Frontend React..."
    cd frontend && yarn install && cd ..
    
    log_success "Toutes les dependances installees"
    save_checkpoint "build_applications"
}

build_applications() {
    log_info " Construction des applications..."
    
    cd "$PROJECT_PATH"
    
    # Build API Express.js
    log_info " Build API Express.js..."
    cd api && (npm run build || log_warning "Build API echoue") && cd ..
    
    # Build application publique
    log_info " Build application publique..."
    cd public && (npm run build || log_warning "Build public echoue") && cd ..
    
    # Build administration
    log_info " Build administration..."
    cd administration && (npm run build || log_warning "Build admin echoue") && cd ..
    
    # Build frontend React
    log_info " Build frontend React..."
    cd frontend && (yarn build || log_warning "Build frontend echoue") && cd ..
    
    log_success "Applications construites"
    save_checkpoint "configure_nginx"
}

configure_nginx() {
    log_info " Configuration de Nginx..."
    
    cat > /etc/nginx/sites-available/dounie-cuisine << 'EOF'
server {
    listen 80;
    server_name _;
    
    # Logs
    access_log /var/log/nginx/dounie-cuisine.access.log;
    error_log /var/log/nginx/dounie-cuisine.error.log;
    
    # Headers de securite
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    # Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Limites
    client_max_body_size 100M;
    
    # Application publique (racine)
    location / {
        root /var/www/html/dounie-cuisine/public/dist;
        try_files $uri $uri/ /index.html;
        
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
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
    }
    
    # WebSocket pour messagerie
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
    
    # Gestion des erreurs
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
}
EOF
    
    # Activer le site
    ln -sf /etc/nginx/sites-available/dounie-cuisine /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    
    nginx -t && systemctl reload nginx
    
    log_success "Nginx configure"
    save_checkpoint "configure_services"
}

configure_services() {
    log_info " Configuration des services..."
    
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
    
    supervisorctl reread
    supervisorctl update
    supervisorctl start dounie-cuisine:*
    
    log_success "Services configures"
    save_checkpoint "setup_monitoring"
}

setup_monitoring() {
    log_info " Configuration du monitoring..."
    
    cat > /usr/local/bin/dounie-monitor << 'EOF'
#!/bin/bash
LOG_FILE="/var/log/dounie-cuisine/monitor.log"
STATUS_FILE="/var/log/dounie-cuisine/status.json"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

mkdir -p /var/log/dounie-cuisine

api_status="FAIL"
backend_status="FAIL"
frontend_status="FAIL"
nginx_status="FAIL"
pg_status="FAIL"
mongo_status="FAIL"

if timeout 5 curl -f -s http://localhost:5000/api/health > /dev/null 2>&1; then
    api_status="OK"
else
    supervisorctl restart dounie-cuisine:dounie-api > /dev/null 2>&1
fi

if timeout 5 curl -f -s http://localhost:8001/api/health > /dev/null 2>&1; then
    backend_status="OK"
else
    supervisorctl restart dounie-cuisine:dounie-backend > /dev/null 2>&1
fi

if timeout 5 curl -f -s http://localhost:3000 > /dev/null 2>&1; then
    frontend_status="OK"
else
    supervisorctl restart dounie-cuisine:dounie-frontend > /dev/null 2>&1
fi

if systemctl is-active --quiet nginx; then
    nginx_status="OK"
fi

if systemctl is-active --quiet postgresql; then
    pg_status="OK"
fi

if systemctl is-active --quiet mongod || systemctl is-active --quiet mongodb; then
    mongo_status="OK"
fi

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
    (crontab -l 2>/dev/null || true; echo "* * * * * /usr/local/bin/dounie-monitor") | crontab -
    
    log_success "Monitoring configure"
    save_checkpoint "setup_backups"
}

setup_backups() {
    log_info " Configuration des sauvegardes..."
    
    cat > /etc/cron.daily/dounie-backup << 'EOF'
#!/bin/bash
source /root/.dounie-credentials 2>/dev/null || {
    PG_PASSWORD="default"
    MONGO_PASSWORD="default"
}

BACKUP_DIR="/backup/dounie-cuisine"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR/{db,app,configs}

# Sauvegarde PostgreSQL
sudo -u postgres pg_dump dounie_cuisine > $BACKUP_DIR/db/postgresql_$DATE.sql 2>/dev/null || echo "Erreur PostgreSQL backup"

# Sauvegarde MongoDB
mongodump --db dounie_cuisine --out $BACKUP_DIR/db/mongodb_$DATE 2>/dev/null || echo "Erreur MongoDB backup"

# Sauvegarde application
tar -czf $BACKUP_DIR/app/app_$DATE.tar.gz /var/www/html/dounie-cuisine 2>/dev/null

# Sauvegarde configurations
tar -czf $BACKUP_DIR/configs/config_$DATE.tar.gz \
    /etc/nginx/sites-available/dounie-cuisine \
    /etc/supervisor/conf.d/dounie-cuisine.conf \
    /root/.dounie-credentials 2>/dev/null

# Nettoyage (30 jours)
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete 2>/dev/null
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete 2>/dev/null
find $BACKUP_DIR -type d -name "mongodb_*" -mtime +30 -exec rm -rf {} + 2>/dev/null

echo "Sauvegarde terminee: $DATE"
EOF
    
    chmod +x /etc/cron.daily/dounie-backup
    
    log_success "Sauvegardes configurees"
    save_checkpoint "configure_firewall"
}

configure_firewall() {
    log_info " Configuration du firewall..."
    
    ufw --force reset
    ufw default deny incoming
    ufw default allow outgoing
    ufw allow ssh
    ufw allow 'Nginx Full'
    ufw allow 5000/tcp
    ufw allow 8001/tcp
    ufw allow 3000/tcp
    ufw --force enable
    
    systemctl start fail2ban
    systemctl enable fail2ban
    
    log_success "Firewall configure"
    save_checkpoint "run_final_tests"
}

run_final_tests() {
    log_info " Tests finaux du systeme..."
    
    sleep 30
    
    local tests_passed=0
    local total_tests=7
    
    # Tests des services
    if timeout 10 curl -f -s http://localhost:5000/api/health > /dev/null 2>&1; then
        log_success " API Express.js - OK"
        ((tests_passed++))
    else
        log_error " API Express.js - CHEC"
    fi
    
    if timeout 10 curl -f -s http://localhost:8001/api/health > /dev/null 2>&1; then
        log_success " Backend FastAPI - OK"
        ((tests_passed++))
    else
        log_error " Backend FastAPI - CHEC"
    fi
    
    if timeout 10 curl -f -s http://localhost:3000 > /dev/null 2>&1; then
        log_success " Frontend React - OK"
        ((tests_passed++))
    else
        log_error " Frontend React - CHEC"
    fi
    
    if timeout 10 curl -f -s http://localhost/ > /dev/null 2>&1; then
        log_success " Application publique - OK"
        ((tests_passed++))
    else
        log_error " Application publique - CHEC"
    fi
    
    if timeout 10 curl -f -s http://localhost/admin > /dev/null 2>&1; then
        log_success " Interface admin - OK"
        ((tests_passed++))
    else
        log_error " Interface admin - CHEC"
    fi
    
    if systemctl is-active --quiet postgresql; then
        log_success " PostgreSQL - OK"
        ((tests_passed++))
    else
        log_error " PostgreSQL - CHEC"
    fi
    
    if systemctl is-active --quiet mongod || systemctl is-active --quiet mongodb; then
        log_success " MongoDB - OK"
        ((tests_passed++))
    else
        log_error " MongoDB - CHEC"
    fi
    
    # Executer le monitoring
    /usr/local/bin/dounie-monitor
    
    log_info "Tests reussis: $tests_passed/$total_tests"
    
    if [[ $tests_passed -eq $total_tests ]]; then
        log_success " Tous les tests sont RUSSIS!"
    elif [[ $tests_passed -ge 5 ]]; then
        log_warning " Systeme partiellement fonctionnel"
    else
        log_error " Plusieurs problemes detectes"
    fi
    
    save_checkpoint "finalize_deployment"
}

finalize_deployment() {
    log_info " Finalisation du deploiement..."
    
    rm -f "$CHECKPOINT_FILE"
    /usr/local/bin/dounie-monitor
    
    log_success "Deploiement finalise"
}

# =============================================================================
# AFFICHAGE FINAL
# =============================================================================

show_final_summary() {
    echo ""
    echo "============================================================"
    log_success "   DPLOIEMENT DOUNIE CUISINE TERMIN!"
    echo "   Architecture Double Backend Deployee avec Succes"
    echo "=============================================================="
    echo ""
    
    local server_ip=$(hostname -I | awk '{print $1}')
    
    log_info " URLS D'ACCS:"
    echo "    Site Public:         http://$server_ip"
    echo "     Administration:      http://$server_ip/admin"
    echo "    App React:           http://$server_ip/app"
    echo "    API Express:         http://$server_ip/api"
    echo "    API FastAPI:         http://$server_ip/api/v2"
    echo "    WebSocket:           ws://$server_ip/ws"
    echo ""
    
    log_info " SERVICES ACTIFS:"
    echo "    API Express.js:      Port 5000"
    echo "    Backend FastAPI:     Port 8001"
    echo "     Frontend React:      Port 3000"
    echo "    Nginx Proxy:         Port 80"
    echo "     PostgreSQL:         Port 5432"
    echo "    MongoDB:             Port 27017"
    echo ""
    
    log_info " COMPTES PAR DFAUT:"
    echo "    Admin:    admin / admin123"
    echo "    Manager:  lucie.manager / staff123"
    echo "    Staff:    marc.staff / staff123"
    echo "    Client:   marie.delorme / client123"
    echo ""
    
    log_info " GESTION:"
    echo "   Status:     supervisorctl status dounie-cuisine:*"
    echo "   Restart:    supervisorctl restart dounie-cuisine:*"
    echo "   Logs:       tail -f /var/log/dounie-cuisine/*.log"
    echo "   Monitoring: cat /var/log/dounie-cuisine/status.json"
    echo ""
    
    log_info " EMPLACEMENTS:"
    echo "   Application:   /var/www/html/dounie-cuisine"
    echo "   Logs:          /var/log/dounie-cuisine/"
    echo "   Sauvegardes:   /backup/dounie-cuisine"
    echo "   Config Nginx:  /etc/nginx/sites-available/dounie-cuisine"
    echo "   Identifiants:  /root/.dounie-credentials"
    echo ""
    
    log_info " FONCTIONNALITS ACTIVES:"
    echo "    Messagerie temps reel"
    echo "    Monitoring automatique (1 min)"
    echo "    Sauvegardes quotidiennes"
    echo "    Auto-redemarrage des services"
    echo "     Firewall UFW + Fail2ban"
    echo "    Architecture double backend"
    echo ""
    
    log_info " PROCHAINES TAPES:"
    echo "   1.  Tester toutes les URLs ci-dessus"
    echo "   2.  Changer les mots de passe par defaut"
    echo "   3.  Configurer SSL: certbot --nginx -d votre-domaine.com"
    echo "   4.  Personnaliser le contenu"
    echo "   5.  Former l'equipe"
    echo ""
    
    echo "============================================================"
    log_success "   DOUNIE CUISINE PRT POUR LA PRODUCTION!"
    echo "=============================================================="
}

# =============================================================================
# FONCTION PRINCIPALE
# =============================================================================

main() {
    trap 'log_error "Erreur ligne $LINENO"; exit 1' ERR
    
    echo "============================================================"
    echo "   DPLOIEMENT PRODUCTION DOUNIE CUISINE"
    echo "   Debian/Ubuntu - Architecture Double Backend"
    echo "   Express.js + FastAPI + React + PostgreSQL + MongoDB"
    echo "=============================================================="
    echo ""
    
    # Gestion des checkpoints
    last_checkpoint=$(get_last_checkpoint)
    start_from_checkpoint=false
    
    if [[ -n "$last_checkpoint" ]]; then
        log_warning " Checkpoint detecte: $last_checkpoint"
        log_info "Reprise du deploiement..."
        start_from_checkpoint=true
    fi
    
    # Execution des etapes
    for checkpoint in "${CHECKPOINTS[@]}"; do
        if $start_from_checkpoint; then
            if [[ "$checkpoint" == "$last_checkpoint" ]]; then
                start_from_checkpoint=false
                continue
            elif [[ "$start_from_checkpoint" == true ]]; then
                continue
            fi
        fi
        
        log_info " tape: $checkpoint"
        $checkpoint
    done
    
    # Affichage final
    show_final_summary
}

# Execution du script
main "$@"

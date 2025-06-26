#!/bin/bash
# Script de déploiement principal pour Dounie Cuisine sur VPS
# Usage: ./deploy-vps.sh [domain]
# Version corrigée - Fonctionne depuis n'importe où

set -e

# Configuration
DOMAIN=${1:-"localhost"}
PROJECT_NAME="dounie-cuisine"
INSTALL_DIR="/var/www/html"
BACKUP_DIR="/backup/dounie-cuisine"

# Détection du répertoire source
SOURCE_DIR=""
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Détection intelligente du répertoire source
detect_source_directory() {
    log_info "🔍 Détection du répertoire source du projet..."
    
    # Vérifier si nous sommes dans le répertoire du projet
    if [[ -f "package.json" && -d "api" && -d "public" && -d "administration" ]]; then
        SOURCE_DIR="$(pwd)"
        log_success "Projet détecté dans le répertoire courant: $SOURCE_DIR"
        return 0
    fi
    
    # Vérifier si nous sommes dans un sous-répertoire du projet
    local current_dir="$(pwd)"
    while [[ "$current_dir" != "/" ]]; do
        if [[ -f "$current_dir/package.json" && -d "$current_dir/api" && -d "$current_dir/public" && -d "$current_dir/administration" ]]; then
            SOURCE_DIR="$current_dir"
            log_success "Projet détecté dans le répertoire parent: $SOURCE_DIR"
            return 0
        fi
        current_dir="$(dirname "$current_dir")"
    done
    
    # Vérifier dans le répertoire du script
    if [[ -f "$SCRIPT_DIR/package.json" && -d "$SCRIPT_DIR/api" && -d "$SCRIPT_DIR/public" && -d "$SCRIPT_DIR/administration" ]]; then
        SOURCE_DIR="$SCRIPT_DIR"
        log_success "Projet détecté dans le répertoire du script: $SOURCE_DIR"
        return 0
    fi
    
    # Vérifier si le projet est déjà installé dans /var/www/html
    if [[ -f "${INSTALL_DIR}/${PROJECT_NAME}/package.json" && -d "${INSTALL_DIR}/${PROJECT_NAME}/api" && -d "${INSTALL_DIR}/${PROJECT_NAME}/public" && -d "${INSTALL_DIR}/${PROJECT_NAME}/administration" ]]; then
        SOURCE_DIR="${INSTALL_DIR}/${PROJECT_NAME}"
        log_success "Projet déjà présent dans le répertoire d'installation: $SOURCE_DIR"
        return 0
    fi
    
    log_error "Impossible de localiser le projet Dounie Cuisine"
    log_error "Assurez-vous d'exécuter ce script depuis le répertoire du projet ou d'avoir copié les fichiers au préalable"
    exit 1
}

# Vérifications initiales
check_environment() {
    log_info "Vérification de l'environnement de déploiement..."
    
    # Vérifier les permissions root
    if [[ $EUID -ne 0 ]]; then
        log_error "Ce script doit être exécuté en tant que root"
        exit 1
    fi
    
    # Vérifier le système
    if ! command -v apt &> /dev/null; then
        log_error "Système non supporté. Ubuntu/Debian requis."
        exit 1
    fi
    
    log_success "Environnement validé"
}

# Préparation du déploiement
prepare_deployment() {
    log_info "Préparation du déploiement..."
    
    # Détection du répertoire source
    detect_source_directory
    
    # Créer les répertoires nécessaires
    mkdir -p $INSTALL_DIR
    mkdir -p $BACKUP_DIR
    mkdir -p /var/log/dounie-cuisine
    
    # Copier le projet dans le répertoire d'installation si nécessaire
    if [[ "$SOURCE_DIR" != "${INSTALL_DIR}/${PROJECT_NAME}" ]]; then
        if [ -d "${INSTALL_DIR}/${PROJECT_NAME}" ]; then
            log_warning "Installation existante détectée. Création d'une sauvegarde..."
            cp -r "${INSTALL_DIR}/${PROJECT_NAME}" "${BACKUP_DIR}/backup-$(date +%Y%m%d_%H%M%S)"
        fi
        
        # Copier les nouveaux fichiers avec rsync pour éviter les problèmes
        log_info "Copie des fichiers depuis $SOURCE_DIR vers ${INSTALL_DIR}/${PROJECT_NAME}..."
        mkdir -p "${INSTALL_DIR}/${PROJECT_NAME}"
        rsync -av --exclude='node_modules' --exclude='.git' --exclude='dist' --exclude='build' \
              --exclude='logs' --exclude='.env' "$SOURCE_DIR/" "${INSTALL_DIR}/${PROJECT_NAME}/"
    else
        log_success "Les fichiers sont déjà dans le répertoire d'installation"
    fi
    
    log_success "Fichiers déployés"
}

# Installation des services
install_services() {
    log_info "Installation des services système..."
    
    # Mise à jour du système
    apt update && apt upgrade -y
    
    # Installation des paquets de base
    apt install -y curl wget git vim htop unzip software-properties-common rsync
    
    # Node.js 20
    if ! command -v node &> /dev/null || [ "$(node --version | cut -d'v' -f2 | cut -d'.' -f1)" -lt "20" ]; then
        log_info "Installation de Node.js 20..."
        curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
        apt install -y nodejs
    fi
    
    # PostgreSQL
    if ! command -v psql &> /dev/null; then
        log_info "Installation de PostgreSQL..."
        apt install -y postgresql postgresql-contrib
        systemctl start postgresql
        systemctl enable postgresql
    fi
    
    # Nginx
    if ! command -v nginx &> /dev/null; then
        log_info "Installation de Nginx..."
        apt install -y nginx
        systemctl start nginx
        systemctl enable nginx
    fi
    
    # PM2
    if ! command -v pm2 &> /dev/null; then
        log_info "Installation de PM2..."
        npm install -g pm2
        pm2 startup systemd -u root --hp /root
    fi
    
    log_success "Services installés"
}

# Configuration de la base de données
setup_database() {
    log_info "Configuration de la base de données..."
    
    # Créer la base de données et l'utilisateur
    sudo -u postgres psql << EOF
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'dounie_cuisine') THEN
        CREATE DATABASE dounie_cuisine;
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'dounie_user') THEN
        CREATE USER dounie_user WITH PASSWORD 'dounie_secure_2025!';
    END IF;
    
    GRANT ALL PRIVILEGES ON DATABASE dounie_cuisine TO dounie_user;
END
\$\$;
EOF
    
    log_success "Base de données configurée"
}

# Installation et build des applications
build_applications() {
    log_info "Installation des dépendances et build..."
    
    cd "${INSTALL_DIR}/${PROJECT_NAME}"
    
    # Configuration de l'environnement
    cat > api/.env << EOF
DATABASE_URL=postgresql://dounie_user:dounie_secure_2025!@localhost:5432/dounie_cuisine
NODE_ENV=production
SESSION_SECRET=dounie-cuisine-super-secure-session-${RANDOM}-$(date +%s)
API_PORT=5000
PUBLIC_PORT=3000
ADMIN_PORT=3001
EOF
    
    # API
    log_info "Build de l'API..."
    cd api
    npm install --production
    npm run db:push || log_warning "Migration de DB échouée, continuons..."
    npm run build
    cd ..
    
    # Applications frontend
    log_info "Build du frontend public..."
    cd public
    npm install
    npm run build
    cd ..
    
    log_info "Build de l'administration..."
    cd administration
    npm install
    npm run build
    cd ..
    
    log_success "Applications buildées"
}

# Configuration de Nginx
setup_nginx() {
    log_info "Configuration de Nginx..."
    
    cat > /etc/nginx/sites-available/dounie-cuisine << EOF
# Configuration Dounie Cuisine
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};
    
    # Logs
    access_log /var/log/nginx/dounie-cuisine.access.log;
    error_log /var/log/nginx/dounie-cuisine.error.log;
    
    # Sécurité
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header X-Robots-Tag "index, follow" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Application publique (racine)
    location / {
        root ${INSTALL_DIR}/${PROJECT_NAME}/public/dist;
        try_files \$uri \$uri/ /index.html;
        
        # Cache pour les fichiers statiques
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            access_log off;
        }
    }
    
    # Interface d'administration
    location /admin {
        alias ${INSTALL_DIR}/${PROJECT_NAME}/administration/dist;
        try_files \$uri \$uri/ /index.html;
        
        # Sécurité supplémentaire pour l'admin
        add_header X-Admin-Access "restricted" always;
    }
    
    # API Backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # WebSocket pour temps réel
    location /ws {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # Gestion des erreurs
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
    
    # Limites
    client_max_body_size 100M;
    client_body_timeout 60s;
    client_header_timeout 60s;
}
EOF
    
    # Activer le site
    ln -sf /etc/nginx/sites-available/dounie-cuisine /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    
    # Test et reload
    nginx -t && systemctl reload nginx
    
    log_success "Nginx configuré"
}

# Configuration de PM2
setup_pm2() {
    log_info "Configuration de PM2..."
    
    cd "${INSTALL_DIR}/${PROJECT_NAME}"
    
    # Arrêter les anciennes instances
    pm2 delete dounie-api 2>/dev/null || true
    
    # Configuration PM2
    cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'dounie-api',
    script: 'api/dist/index.js',
    cwd: '${INSTALL_DIR}/${PROJECT_NAME}',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: '/var/log/dounie-cuisine/api-err.log',
    out_file: '/var/log/dounie-cuisine/api-out.log',
    log_file: '/var/log/dounie-cuisine/api-combined.log',
    time: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    max_memory_restart: '500M'
  }]
};
EOF
    
    # Démarrer avec PM2
    pm2 start ecosystem.config.js
    pm2 save
    
    log_success "PM2 configuré"
}

# Configuration du monitoring
setup_monitoring() {
    log_info "Configuration du monitoring..."
    
    # Script de monitoring simple
    cat > /usr/local/bin/dounie-health-check << 'EOF'
#!/bin/bash
# Script de vérification de santé Dounie Cuisine

LOG_FILE="/var/log/dounie-cuisine/health-check.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

# Fonction de log
log_health() {
    echo "[$DATE] $1" >> $LOG_FILE
}

# Vérifier l'API
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    log_health "✓ API: OK"
else
    log_health "✗ API: FAIL - Redémarrage..."
    pm2 restart dounie-api
fi

# Vérifier Nginx
if systemctl is-active --quiet nginx; then
    log_health "✓ Nginx: OK"
else
    log_health "✗ Nginx: FAIL - Redémarrage..."
    systemctl restart nginx
fi

# Vérifier PostgreSQL
if systemctl is-active --quiet postgresql; then
    log_health "✓ PostgreSQL: OK"
else
    log_health "✗ PostgreSQL: FAIL - Redémarrage..."
    systemctl restart postgresql
fi

# Nettoyage des logs anciens
find /var/log/dounie-cuisine -name "*.log" -mtime +7 -delete 2>/dev/null || true
EOF

    chmod +x /usr/local/bin/dounie-health-check
    
    # Cron job pour le monitoring
    (crontab -l 2>/dev/null || true; echo "*/5 * * * * /usr/local/bin/dounie-health-check") | crontab -
    
    log_success "Monitoring configuré"
}

# Configuration des sauvegardes
setup_backups() {
    log_info "Configuration des sauvegardes..."
    
    cat > /etc/cron.daily/dounie-backup << EOF
#!/bin/bash
DATE=\$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/dounie-cuisine"

mkdir -p \$BACKUP_DIR

# Sauvegarde DB
pg_dump -h localhost -U dounie_user dounie_cuisine > \$BACKUP_DIR/db_\$DATE.sql

# Sauvegarde app
tar -czf \$BACKUP_DIR/app_\$DATE.tar.gz ${INSTALL_DIR}/${PROJECT_NAME}

# Nettoyage (30 jours)
find \$BACKUP_DIR -name "*.sql" -mtime +30 -delete
find \$BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Sauvegarde terminée: \$DATE"
EOF

    chmod +x /etc/cron.daily/dounie-backup
    
    log_success "Sauvegardes configurées"
}

# Configuration du firewall
setup_firewall() {
    log_info "Configuration du firewall..."
    
    # UFW
    apt install -y ufw
    ufw --force reset
    ufw default deny incoming
    ufw default allow outgoing
    ufw allow ssh
    ufw allow 'Nginx Full'
    ufw --force enable
    
    log_success "Firewall configuré"
}

# Tests de déploiement
run_deployment_tests() {
    log_info "Tests de déploiement..."
    
    sleep 10  # Attendre que les services démarrent
    
    # Test API
    if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
        log_success "✓ API Health Check: OK"
    else
        log_error "✗ API Health Check: FAIL"
        return 1
    fi
    
    # Test Nginx
    if curl -f http://localhost/ > /dev/null 2>&1; then
        log_success "✓ Site Public: OK"
    else
        log_error "✗ Site Public: FAIL"
        return 1
    fi
    
    # Test Admin
    if curl -f http://localhost/admin > /dev/null 2>&1; then
        log_success "✓ Interface Admin: OK"
    else
        log_warning "⚠ Interface Admin: Vérification manuelle nécessaire"
    fi
    
    log_success "Tests de déploiement terminés"
}

# Affichage des informations finales
show_deployment_info() {
    echo ""
    log_success "🎉 DÉPLOIEMENT DOUNIE CUISINE TERMINÉ!"
    echo ""
    log_info "🌐 URLs d'accès:"
    log_info "   Site Public: http://${DOMAIN}"
    log_info "   Administration: http://${DOMAIN}/admin"
    log_info "   API: http://${DOMAIN}/api"
    echo ""
    log_info "📋 Gestion du système:"
    log_info "   Status: pm2 status"
    log_info "   Logs API: pm2 logs dounie-api"
    log_info "   Restart API: pm2 restart dounie-api"
    log_info "   Nginx: systemctl status nginx"
    log_info "   PostgreSQL: systemctl status postgresql"
    echo ""
    log_info "📁 Emplacements importants:"
    log_info "   Application: ${INSTALL_DIR}/${PROJECT_NAME}"
    log_info "   Logs: /var/log/dounie-cuisine/"
    log_info "   Sauvegardes: ${BACKUP_DIR}"
    log_info "   Config Nginx: /etc/nginx/sites-available/dounie-cuisine"
    echo ""
    log_info "🔒 Prochaines étapes recommandées:"
    log_info "   1. Configurer SSL: certbot --nginx -d ${DOMAIN}"
    log_info "   2. Configurer un nom de domaine réel"
    log_info "   3. Personnaliser les paramètres dans l'interface admin"
    log_info "   4. Tester toutes les fonctionnalités"
    echo ""
    log_success "Dounie Cuisine est prêt pour la production! 🍽️"
}

# Fonction principale
main() {
    echo "🚀 Déploiement Dounie Cuisine - Service Traiteur & Événements"
    echo "============================================================"
    echo "Domaine: ${DOMAIN}"
    echo "Installation: ${INSTALL_DIR}/${PROJECT_NAME}"
    echo ""
    
    check_environment
    prepare_deployment
    install_services
    setup_database
    build_applications
    setup_nginx
    setup_pm2
    setup_monitoring
    setup_backups
    setup_firewall
    run_deployment_tests
    show_deployment_info
}

# Gestion d'erreur
trap 'log_error "Erreur de déploiement. Vérifiez les logs."; exit 1' ERR

# Exécution
main "$@"
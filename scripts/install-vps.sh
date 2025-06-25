#!/bin/bash
# Script d'installation automatique Dounie Cuisine pour VPS Debian/Ubuntu
# Copier ce projet dans /var/www/html et exécuter ce script

set -e

echo "🚀 Installation automatique de Dounie Cuisine sur VPS"
echo "=================================================="

# Configuration des couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration des variables
APP_DIR="/var/www/html/dounie-cuisine"
API_PORT=${API_PORT:-5000}
PUBLIC_PORT=${PUBLIC_PORT:-3000}
ADMIN_PORT=${ADMIN_PORT:-3001}
DOMAIN=${DOMAIN:-"votre-domaine.com"}

# Vérification des prérequis
check_prerequisites() {
    log_info "Vérification des prérequis système..."
    
    # Vérifier les permissions root
    if [[ $EUID -ne 0 ]]; then
        log_error "Ce script doit être exécuté en tant que root"
        exit 1
    fi

    # Vérifier le système d'exploitation
    if ! command -v apt &> /dev/null; then
        log_error "Ce script ne fonctionne que sur les systèmes Debian/Ubuntu"
        exit 1
    fi

    # Vérifier si le répertoire existe
    if [ ! -d "$APP_DIR" ]; then
        log_error "Le répertoire $APP_DIR n'existe pas. Veuillez copier le projet d'abord."
        exit 1
    fi

    log_success "Prérequis vérifiés"
}

# Mise à jour du système
update_system() {
    log_info "Mise à jour du système..."
    apt update
    apt upgrade -y
    log_success "Système mis à jour"
}

# Installation de Node.js 20
install_nodejs() {
    log_info "Installation de Node.js 20..."
    
    # Supprimer les anciennes versions
    apt remove -y nodejs npm 2>/dev/null || true
    
    # Installer Node.js 20 via NodeSource
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
    
    # Vérifier l'installation
    NODE_VERSION=$(node --version)
    NPM_VERSION=$(npm --version)
    
    log_success "Node.js $NODE_VERSION et npm $NPM_VERSION installés"
}

# Installation de PostgreSQL
install_postgresql() {
    log_info "Installation de PostgreSQL..."
    
    apt install -y postgresql postgresql-contrib
    
    # Démarrer PostgreSQL
    systemctl start postgresql
    systemctl enable postgresql
    
    # Créer la base de données et l'utilisateur
    sudo -u postgres psql -c "CREATE DATABASE dounie_cuisine;" 2>/dev/null || log_warning "Base de données existe déjà"
    sudo -u postgres psql -c "CREATE USER dounie_user WITH PASSWORD 'dounie_secure_password_2025';" 2>/dev/null || log_warning "Utilisateur existe déjà"
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE dounie_cuisine TO dounie_user;"
    
    log_success "PostgreSQL installé et configuré"
}

# Installation de Nginx
install_nginx() {
    log_info "Installation de Nginx..."
    
    apt install -y nginx
    
    # Démarrer Nginx
    systemctl start nginx
    systemctl enable nginx
    
    log_success "Nginx installé"
}

# Installation de PM2
install_pm2() {
    log_info "Installation de PM2..."
    
    npm install -g pm2
    
    # Configuration du démarrage automatique
    pm2 startup systemd -u root --hp /root
    
    log_success "PM2 installé"
}

# Configuration de l'environnement
setup_environment() {
    log_info "Configuration de l'environnement..."
    
    cd "$APP_DIR"
    
    # Créer le fichier .env pour l'API
    cat > api/.env << EOF
# Configuration de la base de données PostgreSQL
DATABASE_URL=postgresql://dounie_user:dounie_secure_password_2025@localhost:5432/dounie_cuisine

# Configuration de l'application
NODE_ENV=production
SESSION_SECRET=dounie-cuisine-super-secure-session-key-2025-production

# Configuration des ports
API_PORT=${API_PORT}
PUBLIC_PORT=${PUBLIC_PORT}
ADMIN_PORT=${ADMIN_PORT}

# Configuration pour les emails (optionnel)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EOF

    log_success "Fichiers d'environnement créés"
}

# Installation des dépendances
install_dependencies() {
    log_info "Installation des dépendances..."
    
    cd "$APP_DIR"
    
    # API
    log_info "Installation des dépendances API..."
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
    
    log_success "Toutes les dépendances installées"
}

# Configuration de la base de données
setup_database() {
    log_info "Configuration de la base de données..."
    
    cd "$APP_DIR/api"
    
    # Exécuter les migrations
    npm run db:push
    
    log_success "Base de données configurée"
}

# Build des applications
build_applications() {
    log_info "Build des applications..."
    
    cd "$APP_DIR"
    
    # Build de l'API
    log_info "Build de l'API..."
    cd api
    npm run build
    cd ..
    
    # Build de l'application publique
    log_info "Build de l'application publique..."
    cd public
    npm run build
    cd ..
    
    # Build de l'administration
    log_info "Build de l'administration..."
    cd administration
    npm run build
    cd ..
    
    log_success "Applications buildées"
}

# Configuration de Nginx
setup_nginx() {
    log_info "Configuration de Nginx..."
    
    # Créer le fichier de configuration
    cat > /etc/nginx/sites-available/dounie-cuisine << EOF
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
    
    # Application publique (racine)
    location / {
        root ${APP_DIR}/public/dist;
        try_files \$uri \$uri/ /index.html;
        
        # Cache pour les fichiers statiques
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Interface d'administration
    location /admin {
        alias ${APP_DIR}/administration/dist;
        try_files \$uri \$uri/ /index.html;
        
        # Authentification basique optionnelle
        # auth_basic "Administration Dounie Cuisine";
        # auth_basic_user_file /etc/nginx/.htpasswd;
    }
    
    # API Backend
    location /api {
        proxy_pass http://localhost:${API_PORT};
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
    
    # Gestion des erreurs
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
    
    # Taille maximale des uploads
    client_max_body_size 50M;
}
EOF

    # Activer le site
    ln -sf /etc/nginx/sites-available/dounie-cuisine /etc/nginx/sites-enabled/
    
    # Supprimer le site par défaut
    rm -f /etc/nginx/sites-enabled/default
    
    # Tester la configuration
    nginx -t
    
    # Recharger Nginx
    systemctl reload nginx
    
    log_success "Nginx configuré"
}

# Configuration de PM2
setup_pm2() {
    log_info "Configuration de PM2..."
    
    cd "$APP_DIR"
    
    # Créer le fichier de configuration PM2
    cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'dounie-api',
      script: 'api/dist/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: ${API_PORT}
      },
      error_file: './logs/api-err.log',
      out_file: './logs/api-out.log',
      log_file: './logs/api-combined.log',
      time: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
};
EOF

    # Créer le dossier des logs
    mkdir -p logs
    
    # Démarrer l'application avec PM2
    pm2 start ecosystem.config.js
    
    # Sauvegarder la configuration PM2
    pm2 save
    
    log_success "PM2 configuré et application démarrée"
}

# Configuration du firewall
setup_firewall() {
    log_info "Configuration du firewall..."
    
    # Installer UFW si pas installé
    apt install -y ufw
    
    # Configuration UFW
    ufw --force reset
    ufw default deny incoming
    ufw default allow outgoing
    
    # Autoriser SSH
    ufw allow ssh
    
    # Autoriser HTTP et HTTPS
    ufw allow 'Nginx Full'
    
    # Activer UFW
    ufw --force enable
    
    log_success "Firewall configuré"
}

# Configuration SSL avec Certbot
setup_ssl() {
    log_info "Configuration SSL avec Let's Encrypt..."
    
    # Installer Certbot
    apt install -y certbot python3-certbot-nginx
    
    # Demander si l'utilisateur veut configurer SSL
    read -p "Voulez-vous configurer SSL pour ${DOMAIN}? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Obtenir le certificat SSL
        certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} --non-interactive --agree-tos --email admin@${DOMAIN}
        
        # Configuration du renouvellement automatique
        (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
        
        log_success "SSL configuré avec succès"
    else
        log_warning "SSL non configuré. Vous pouvez le faire manuellement plus tard."
    fi
}

# Configuration des sauvegardes
setup_backups() {
    log_info "Configuration des sauvegardes automatiques..."
    
    # Créer le script de sauvegarde
    cat > /etc/cron.daily/dounie-backup << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/dounie-cuisine"

# Créer le dossier de sauvegarde
mkdir -p $BACKUP_DIR

# Sauvegarde base de données
pg_dump -h localhost -U dounie_user dounie_cuisine > $BACKUP_DIR/db_$DATE.sql

# Sauvegarde fichiers application
tar -czf $BACKUP_DIR/app_$DATE.tar.gz /var/www/html/dounie-cuisine

# Nettoyer les anciennes sauvegardes (garder 30 jours)
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Sauvegarde Dounie Cuisine terminée - $DATE"
EOF

    chmod +x /etc/cron.daily/dounie-backup
    
    log_success "Sauvegardes automatiques configurées"
}

# Vérification finale
final_check() {
    log_info "Vérification finale de l'installation..."
    
    # Vérifier les services
    if systemctl is-active --quiet nginx; then
        log_success "✓ Nginx fonctionne"
    else
        log_error "✗ Nginx ne fonctionne pas"
    fi
    
    if systemctl is-active --quiet postgresql; then
        log_success "✓ PostgreSQL fonctionne"
    else
        log_error "✗ PostgreSQL ne fonctionne pas"
    fi
    
    if pm2 list | grep -q "dounie-api"; then
        log_success "✓ Application PM2 fonctionne"
    else
        log_error "✗ Application PM2 ne fonctionne pas"
    fi
    
    # Vérifier l'API
    sleep 5
    if curl -f http://localhost:${API_PORT}/api/health > /dev/null 2>&1; then
        log_success "✓ API accessible"
    else
        log_warning "⚠ API non accessible (en cours de démarrage...)"
    fi
    
    # Afficher les informations finales
    echo ""
    log_success "=== INSTALLATION TERMINÉE AVEC SUCCÈS ==="
    echo ""
    log_info "🌐 Site web: http://${DOMAIN}"
    log_info "⚙️  Administration: http://${DOMAIN}/admin"
    log_info "🔗 API: http://${DOMAIN}/api"
    echo ""
    log_info "📋 Commandes utiles:"
    log_info "   pm2 status              - Voir le statut des applications"
    log_info "   pm2 logs                - Voir les logs en temps réel"
    log_info "   pm2 restart dounie-api  - Redémarrer l'API"
    log_info "   systemctl status nginx  - Statut Nginx"
    log_info "   systemctl status postgresql - Statut PostgreSQL"
    echo ""
    log_info "📁 Logs importantes:"
    log_info "   Application: ${APP_DIR}/logs/"
    log_info "   Nginx: /var/log/nginx/"
    log_info "   Sauvegardes: /backup/dounie-cuisine/"
    echo ""
}

# Fonction principale
main() {
    log_info "🍽️  Installation de Dounie Cuisine - Service Traiteur & Événements"
    echo ""
    
    check_prerequisites
    update_system
    install_nodejs
    install_postgresql
    install_nginx
    install_pm2
    setup_environment
    install_dependencies
    setup_database
    build_applications
    setup_nginx
    setup_pm2
    setup_firewall
    setup_ssl
    setup_backups
    final_check
    
    log_success "🎉 Dounie Cuisine est maintenant installé et prêt à fonctionner!"
}

# Gestion des erreurs
trap 'log_error "Une erreur est survenue. Installation interrompue."; exit 1' ERR

# Exécution du script principal
main "$@"
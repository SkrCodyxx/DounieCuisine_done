#!/bin/bash

# Script de déploiement automatique pour Dounie Cuisine
# Ce script déploie l'API, l'application publique et l'interface d'administration
# Version corrigée - Fonctionne depuis n'importe où

set -e

echo "🚀 Début du déploiement de Dounie Cuisine..."

# Configuration
API_PORT=${API_PORT:-5000}
PUBLIC_PORT=${PUBLIC_PORT:-80}
ADMIN_PORT=${ADMIN_PORT:-3001}
PROJECT_NAME="dounie-cuisine"
INSTALL_DIR="/var/www/html"

# Détection du répertoire source
SOURCE_DIR=""
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Couleurs pour l'affichage
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
    log_error "Assurez-vous d'exécuter ce script depuis le répertoire du projet"
    exit 1
}

# Préparation intelligente du répertoire de travail
prepare_working_directory() {
    log_info "📁 Préparation du répertoire de travail..."
    
    detect_source_directory
    
    # Si nous ne sommes pas déjà dans le bon répertoire, copier les fichiers
    if [[ "$SOURCE_DIR" != "${INSTALL_DIR}/${PROJECT_NAME}" ]]; then
        if [[ "$SOURCE_DIR" != "$(pwd)" ]]; then
            log_info "Changement vers le répertoire source: $SOURCE_DIR"
            cd "$SOURCE_DIR"
        fi
        
        # Si on a les permissions root et qu'on veut déployer dans /var/www/html
        if [[ $EUID -eq 0 && ! -z "$INSTALL_DIR" ]]; then
            log_info "Copie vers le répertoire d'installation: ${INSTALL_DIR}/${PROJECT_NAME}"
            mkdir -p "${INSTALL_DIR}/${PROJECT_NAME}"
            rsync -av --exclude='node_modules' --exclude='.git' --exclude='dist' --exclude='build' \
                  "$SOURCE_DIR/" "${INSTALL_DIR}/${PROJECT_NAME}/"
            cd "${INSTALL_DIR}/${PROJECT_NAME}"
        fi
    else
        log_info "Utilisation du répertoire actuel: $SOURCE_DIR"
        cd "$SOURCE_DIR"
    fi
    
    log_success "Répertoire de travail préparé: $(pwd)"
}

# Vérification des prérequis
check_prerequisites() {
    log_info "Vérification des prérequis..."
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js n'est pas installé"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        log_error "npm n'est pas installé"
        exit 1
    fi
    
    if ! command -v pm2 &> /dev/null; then
        log_warning "PM2 n'est pas installé. Installation..."
        npm install -g pm2
    fi
    
    log_success "Prérequis vérifiés"
}

# Installation des dépendances
install_dependencies() {
    log_info "Installation des dépendances..."
    
    # API
    cd api
    log_info "Installation des dépendances API..."
    npm install
    cd ..
    
    # Application publique
    cd public
    log_info "Installation des dépendances application publique..."
    npm install
    cd ..
    
    # Administration
    cd administration
    log_info "Installation des dépendances administration..."
    npm install
    cd ..
    
    log_success "Toutes les dépendances installées"
}

# Configuration de la base de données
setup_database() {
    log_info "Configuration de la base de données..."
    
    cd api
    
    # Vérification des variables d'environnement
    if [ -z "$DATABASE_URL" ] && [ ! -f ".env" ]; then
        log_warning "DATABASE_URL non définie et fichier .env manquant"
        log_info "Création d'un fichier .env de base..."
        cat > .env << EOF
DATABASE_URL=postgresql://localhost:5432/dounie_cuisine
NODE_ENV=development
SESSION_SECRET=dounie-cuisine-dev-session-key
API_PORT=5000
PUBLIC_PORT=3000
ADMIN_PORT=3001
EOF
    fi
    
    # Migration de la base de données
    log_info "Exécution des migrations..."
    npm run db:push || log_warning "Migration échouée - vérifiez la configuration de la base de données"
    
    cd ..
    
    log_success "Base de données configurée"
}

# Build des applications
build_applications() {
    log_info "Build des applications..."
    
    # Build de l'API
    cd api
    log_info "Build de l'API..."
    npm run build
    cd ..
    
    # Build de l'application publique
    cd public
    log_info "Build de l'application publique..."
    npm run build
    cd ..
    
    # Build de l'administration
    cd administration
    log_info "Build de l'administration..."
    npm run build
    cd ..
    
    log_success "Applications buildées"
}

# Configuration du serveur web (nginx)
setup_nginx() {
    log_info "Configuration du serveur web..."
    
    # Création du fichier de configuration nginx
    cat > /tmp/dounie-cuisine.conf << EOF
server {
    listen 80;
    server_name _;
    
    # Application publique - servie directement sur port 80
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Interface d'administration
    location /admin {
        proxy_pass http://localhost:$ADMIN_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # API
    location /api {
        proxy_pass http://localhost:$API_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

    # Installation de nginx si nécessaire et si on a les permissions root
    if [[ $EUID -eq 0 ]]; then
        if ! command -v nginx &> /dev/null; then
            log_info "Installation de nginx..."
            apt update
            apt install -y nginx
        fi
        
        # Configuration de nginx
        cp /tmp/dounie-cuisine.conf /etc/nginx/sites-available/dounie-cuisine
        ln -sf /etc/nginx/sites-available/dounie-cuisine /etc/nginx/sites-enabled/
        nginx -t
        systemctl reload nginx
        
        log_success "Serveur web configuré"
    else
        log_warning "Permissions insuffisantes pour configurer nginx. Configuration sautée."
    fi
}

# Déploiement avec PM2
deploy_with_pm2() {
    log_info "Déploiement avec PM2..."
    
    # Arrêt des processus existants
    pm2 delete dounie-api 2>/dev/null || true
    pm2 delete dounie-public 2>/dev/null || true
    pm2 delete dounie-admin 2>/dev/null || true
    
    # Démarrage de l'API
    cd api
    pm2 start dist/index.js --name dounie-api --env production
    cd ..
    
    # Démarrage de l'application publique (sur port 3000, nginx redirige depuis port 80)
    cd public
    pm2 serve dist 3000 --name dounie-public --spa
    cd ..
    
    # Démarrage de l'administration
    cd administration
    pm2 serve dist $ADMIN_PORT --name dounie-admin --spa
    cd ..
    
    # Sauvegarde de la configuration PM2
    pm2 save
    
    # Configuration du démarrage automatique (uniquement si root)
    if [[ $EUID -eq 0 ]]; then
        pm2 startup systemd -u root --hp /root
    else
        log_warning "Configuration du démarrage automatique PM2 sautée (permissions insuffisantes)"
    fi
    
    log_success "Applications déployées avec PM2"
}

# Vérification de l'état des services
check_services() {
    log_info "Vérification de l'état des services..."
    
    # Attendre que les services démarrent
    sleep 5
    
    # Vérification de l'API
    if curl -f http://localhost:$API_PORT/api/health > /dev/null 2>&1; then
        log_success "API fonctionnelle sur le port $API_PORT"
    else
        log_error "API non accessible sur le port $API_PORT"
        return 1
    fi
    
    # Vérification de l'application publique
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        log_success "Application publique fonctionnelle sur le port 3000 (accessible via port 80)"
    else
        log_error "Application publique non accessible sur le port 3000"
        return 1
    fi
    
    # Vérification de l'administration
    if curl -f http://localhost:$ADMIN_PORT > /dev/null 2>&1; then
        log_success "Interface d'administration fonctionnelle sur le port $ADMIN_PORT"
    else
        log_error "Interface d'administration non accessible sur le port $ADMIN_PORT"
        return 1
    fi
    
    log_success "Tous les services sont fonctionnels"
}

# Fonction de nettoyage en cas d'erreur
cleanup_on_error() {
    log_error "Erreur détectée. Nettoyage..."
    pm2 delete dounie-api 2>/dev/null || true
    pm2 delete dounie-public 2>/dev/null || true
    pm2 delete dounie-admin 2>/dev/null || true
    exit 1
}

# Capture des erreurs
trap cleanup_on_error ERR

# Exécution du déploiement
main() {
    log_info "=== DÉPLOIEMENT DOUNIE CUISINE ==="
    
    prepare_working_directory
    check_prerequisites
    install_dependencies
    setup_database
    build_applications
    
    # Configuration nginx uniquement si on a les permissions et qu'on n'est pas sur Replit
    if [[ $EUID -eq 0 && -z "$REPLIT_ENVIRONMENT" ]]; then
        setup_nginx
    fi
    
    deploy_with_pm2
    
    # Attendre quelques secondes pour que les services démarrent
    sleep 5
    
    check_services
    
    log_success "=== DÉPLOIEMENT TERMINÉ AVEC SUCCÈS ==="
    log_info "🌐 Application publique: http://localhost (port 80)"
    log_info "⚙️  Interface d'administration: http://localhost:$ADMIN_PORT/admin"
    log_info "🔗 API: http://localhost:$API_PORT/api"
    
    # Affichage des logs PM2
    log_info "Pour voir les logs: pm2 logs"
    log_info "Pour voir le statut: pm2 status"
    log_info "Pour redémarrer: pm2 restart all"
}

# Exécution du script principal
main "$@"
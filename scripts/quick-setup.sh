#!/bin/bash
# Script de setup rapide pour développement local

set -e

echo "🚀 Setup rapide Dounie Cuisine - Développement"
echo "=============================================="

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }

# Vérifier Node.js
check_nodejs() {
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$NODE_VERSION" -ge "18" ]; then
            log_success "Node.js $NODE_VERSION détecté"
        else
            log_warning "Node.js version $NODE_VERSION détectée. Version 18+ recommandée."
        fi
    else
        echo "❌ Node.js non trouvé. Veuillez installer Node.js 18+ d'abord."
        exit 1
    fi
}

# Installation des dépendances
install_dependencies() {
    log_info "Installation des dépendances..."
    
    # API
    log_info "Installation API..."
    cd api && npm install && cd ..
    
    # Public
    log_info "Installation Public..."
    cd public && npm install && cd ..
    
    # Administration
    log_info "Installation Administration..."
    cd administration && npm install && cd ..
    
    log_success "Dépendances installées"
}

# Configuration PostgreSQL pour développement
setup_dev_db() {
    log_info "Configuration base de données développement..."
    
    # Vérifier si PostgreSQL est installé
    if command -v psql &> /dev/null; then
        log_info "PostgreSQL détecté"
        
        # Créer DB de dev si elle n'existe pas
        sudo -u postgres psql << EOF 2>/dev/null || log_warning "DB existe déjà"
CREATE DATABASE dounie_cuisine_dev;
CREATE USER dounie_dev WITH PASSWORD 'dev123';
GRANT ALL PRIVILEGES ON DATABASE dounie_cuisine_dev TO dounie_dev;
EOF
        
        # Mettre à jour .env pour le développement
        cat > api/.env << EOF
DATABASE_URL=postgresql://dounie_dev:dev123@localhost:5432/dounie_cuisine_dev
NODE_ENV=development
SESSION_SECRET=dounie-cuisine-dev-session-key
API_PORT=5000
PUBLIC_PORT=3000
ADMIN_PORT=3001
EOF
        
        # Migrations
        cd api
        npm run db:push || log_warning "Migration échouée"
        cd ..
        
        log_success "Base de données configurée"
    else
        log_warning "PostgreSQL non détecté. Configuration manuelle nécessaire."
        
        # Configuration avec une DB alternative pour dev
        cat > api/.env << EOF
# Configuration développement - PostgreSQL requis pour production
DATABASE_URL=postgresql://localhost:5432/dounie_cuisine_dev
NODE_ENV=development
SESSION_SECRET=dounie-cuisine-dev-session-key
API_PORT=5000
PUBLIC_PORT=3000
ADMIN_PORT=3001
EOF
    fi
}

# Configuration supervisord pour développement
setup_dev_supervisor() {
    log_info "Configuration supervisord développement..."
    
    # Vérifier si supervisor est installé
    if command -v supervisord &> /dev/null; then
        cat > supervisord-dev.conf << EOF
[supervisord]
nodaemon=true
user=root
logfile=/tmp/supervisord.log
pidfile=/tmp/supervisord.pid
childlogdir=/tmp/

[unix_http_server]
file=/tmp/supervisor.sock
chmod=0700

[supervisorctl]
serverurl=unix:///tmp/supervisor.sock

[rpcinterface:supervisor]
supervisor.rpcinterface_factory = supervisor.rpcinterface:make_main_rpcinterface

[program:api]
command=npm run dev
directory=./api
autostart=true
autorestart=true
stdout_logfile=/tmp/api.out.log
stderr_logfile=/tmp/api.err.log

[program:public]
command=npm run dev
directory=./public
autostart=true
autorestart=true
stdout_logfile=/tmp/public.out.log
stderr_logfile=/tmp/public.err.log

[program:administration]
command=npm run dev
directory=./administration
autostart=true
autorestart=true
stdout_logfile=/tmp/admin.out.log
stderr_logfile=/tmp/admin.err.log
EOF
        
        log_success "Configuration supervisord créée: supervisord-dev.conf"
    else
        log_warning "Supervisor non installé. Installation manuelle recommandée."
    fi
}

# Créer scripts de développement
create_dev_scripts() {
    log_info "Création des scripts de développement..."
    
    # Script de démarrage
    cat > start-dev.sh << 'EOF'
#!/bin/bash
echo "🚀 Démarrage Dounie Cuisine - Développement"

# Démarrer en arrière-plan
if command -v supervisord &> /dev/null && [ -f "supervisord-dev.conf" ]; then
    echo "Démarrage avec supervisord..."
    supervisord -c supervisord-dev.conf &
    echo "Services démarrés en arrière-plan"
    echo "📱 Public: http://localhost:3000"
    echo "🔧 Admin: http://localhost:3001" 
    echo "⚡ API: http://localhost:5000"
    echo "📋 Logs: supervisorctl -c supervisord-dev.conf tail -f all"
else
    echo "Démarrage manuel requis:"
    echo "Terminal 1: cd api && npm run dev"
    echo "Terminal 2: cd public && npm run dev"
    echo "Terminal 3: cd administration && npm run dev"
fi
EOF
    
    # Script d'arrêt
    cat > stop-dev.sh << 'EOF'
#!/bin/bash
echo "🛑 Arrêt des services de développement..."

if [ -f "/tmp/supervisord.pid" ]; then
    supervisorctl -c supervisord-dev.conf shutdown
    echo "Services arrêtés"
else
    echo "Arrêtez manuellement les processus npm run dev"
fi
EOF
    
    # Script de test
    cat > test-dev.sh << 'EOF'
#!/bin/bash
echo "🧪 Tests de développement Dounie Cuisine"

# Test API
echo "Test API..."
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ API: OK"
else
    echo "❌ API: Non accessible"
fi

# Test Public
echo "Test Public..."
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Public: OK"
else
    echo "❌ Public: Non accessible"
fi

# Test Admin
echo "Test Admin..."
if curl -f http://localhost:3001 > /dev/null 2>&1; then
    echo "✅ Admin: OK"
else
    echo "❌ Admin: Non accessible"
fi

echo "Tests terminés"
EOF
    
    chmod +x start-dev.sh stop-dev.sh test-dev.sh
    
    log_success "Scripts de développement créés"
}

# Instructions finales
show_dev_instructions() {
    echo ""
    log_success "🎉 Setup de développement terminé!"
    echo ""
    log_info "📋 Scripts disponibles:"
    log_info "   ./start-dev.sh  - Démarrer tous les services"
    log_info "   ./stop-dev.sh   - Arrêter tous les services"
    log_info "   ./test-dev.sh   - Tester les services"
    echo ""
    log_info "🌐 URLs de développement:"
    log_info "   Public: http://localhost:3000"
    log_info "   Admin: http://localhost:3001"
    log_info "   API: http://localhost:5000"
    echo ""
    log_info "📁 Commandes manuelles:"
    log_info "   API: cd api && npm run dev"
    log_info "   Public: cd public && npm run dev" 
    log_info "   Admin: cd administration && npm run dev"
    echo ""
    log_warning "Note: PostgreSQL requis pour le fonctionnement complet"
    echo ""
}

# Fonction principale
main() {
    check_nodejs
    install_dependencies
    setup_dev_db
    setup_dev_supervisor
    create_dev_scripts
    show_dev_instructions
}

main "$@"
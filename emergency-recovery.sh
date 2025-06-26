#!/bin/bash

# =============================================================================
# SCRIPT DE RÉCUPÉRATION D'URGENCE DOUNIE CUISINE
# Diagnostic et correction automatique des problèmes
# =============================================================================

set -e

# Configuration
PROJECT_PATH="/var/www/html/dounie-cuisine"
LOG_DIR="/var/log/dounie-cuisine"
BACKUP_DIR="/backup/dounie-cuisine"
GITHUB_REPO="https://github.com/SkrCodyxx/DounieCuisine_done.git"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Fonctions de logging
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_fix() { echo -e "${PURPLE}[FIX]${NC} $1"; }

# Fonction de diagnostic système
diagnose_system() {
    log_info "🔍 Diagnostic du système Dounie Cuisine..."
    
    local issues_found=()
    
    # Vérifier l'arborescence du projet
    if [[ ! -d "$PROJECT_PATH" ]]; then
        issues_found+=("PROJECT_MISSING")
        log_error "Projet manquant dans $PROJECT_PATH"
    else
        local required_dirs=("api" "public" "administration" "backend" "frontend")
        for dir in "${required_dirs[@]}"; do
            if [[ ! -d "$PROJECT_PATH/$dir" ]]; then
                issues_found+=("DIR_MISSING_$dir")
                log_error "Répertoire manquant: $dir"
            fi
        done
    fi
    
    # Vérifier les services
    if ! systemctl is-active --quiet nginx; then
        issues_found+=("NGINX_DOWN")
        log_error "Nginx non actif"
    fi
    
    if ! systemctl is-active --quiet postgresql; then
        issues_found+=("POSTGRESQL_DOWN")
        log_error "PostgreSQL non actif"
    fi
    
    if ! systemctl is-active --quiet mongod; then
        issues_found+=("MONGODB_DOWN")
        log_error "MongoDB non actif"
    fi
    
    if ! systemctl is-active --quiet supervisor; then
        issues_found+=("SUPERVISOR_DOWN")
        log_error "Supervisor non actif"
    fi
    
    # Vérifier les applications
    if ! curl -f -s http://localhost:5000/api/health > /dev/null 2>&1; then
        issues_found+=("API_DOWN")
        log_error "API Express.js non accessible"
    fi
    
    if ! curl -f -s http://localhost:8001/api/health > /dev/null 2>&1; then
        issues_found+=("BACKEND_DOWN")
        log_error "Backend FastAPI non accessible"
    fi
    
    if ! curl -f -s http://localhost:3000 > /dev/null 2>&1; then
        issues_found+=("FRONTEND_DOWN")
        log_error "Frontend React non accessible"
    fi
    
    # Retourner les problèmes trouvés
    echo "${issues_found[@]}"
}

# Correction automatique des problèmes
fix_project_missing() {
    log_fix "📥 Récupération du projet depuis GitHub..."
    
    mkdir -p "$(dirname "$PROJECT_PATH")"
    cd "$(dirname "$PROJECT_PATH")"
    
    if [[ -d "$PROJECT_PATH" ]]; then
        mv "$PROJECT_PATH" "${PROJECT_PATH}.broken.$(date +%Y%m%d_%H%M%S)"
    fi
    
    git clone "$GITHUB_REPO" "$(basename "$PROJECT_PATH")"
    
    if [[ $? -eq 0 ]]; then
        log_success "Projet récupéré avec succès"
        return 0
    else
        log_error "Échec de la récupération du projet"
        return 1
    fi
}

fix_nginx_down() {
    log_fix "🌐 Réparation de Nginx..."
    
    # Vérifier la configuration
    if ! nginx -t > /dev/null 2>&1; then
        log_fix "Configuration Nginx invalide, restauration..."
        cp /etc/nginx/sites-available/default /etc/nginx/sites-enabled/
        rm -f /etc/nginx/sites-enabled/dounie-cuisine
    fi
    
    systemctl restart nginx
    systemctl enable nginx
    
    if systemctl is-active --quiet nginx; then
        log_success "Nginx réparé"
        return 0
    else
        log_error "Échec de la réparation de Nginx"
        return 1
    fi
}

fix_postgresql_down() {
    log_fix "🗄️ Réparation de PostgreSQL..."
    
    systemctl restart postgresql
    systemctl enable postgresql
    
    # Attendre que PostgreSQL démarre
    sleep 5
    
    if systemctl is-active --quiet postgresql; then
        log_success "PostgreSQL réparé"
        return 0
    else
        log_error "Échec de la réparation de PostgreSQL"
        return 1
    fi
}

fix_mongodb_down() {
    log_fix "📊 Réparation de MongoDB..."
    
    systemctl restart mongod
    systemctl enable mongod
    
    # Attendre que MongoDB démarre
    sleep 5
    
    if systemctl is-active --quiet mongod; then
        log_success "MongoDB réparé"
        return 0
    else
        log_error "Échec de la réparation de MongoDB"
        return 1
    fi
}

fix_supervisor_down() {
    log_fix "⚙️ Réparation de Supervisor..."
    
    systemctl restart supervisor
    systemctl enable supervisor
    
    # Redémarrer les programmes Dounie
    sleep 3
    supervisorctl reread
    supervisorctl update
    supervisorctl restart dounie-cuisine:*
    
    if systemctl is-active --quiet supervisor; then
        log_success "Supervisor réparé"
        return 0
    else
        log_error "Échec de la réparation de Supervisor"
        return 1
    fi
}

fix_api_down() {
    log_fix "🔵 Réparation de l'API Express.js..."
    
    cd "$PROJECT_PATH/api"
    
    # Vérifier les dépendances
    if [[ ! -d "node_modules" ]]; then
        log_fix "Installation des dépendances API..."
        npm install --production
    fi
    
    # Vérifier le build
    if [[ ! -d "dist" ]]; then
        log_fix "Build de l'API..."
        npm run build
    fi
    
    # Redémarrer via Supervisor
    supervisorctl restart dounie-cuisine:dounie-api
    
    # Attendre et tester
    sleep 10
    if curl -f -s http://localhost:5000/api/health > /dev/null 2>&1; then
        log_success "API Express.js réparée"
        return 0
    else
        log_error "Échec de la réparation de l'API"
        return 1
    fi
}

fix_backend_down() {
    log_fix "🟠 Réparation du Backend FastAPI..."
    
    cd "$PROJECT_PATH/backend"
    
    # Vérifier les dépendances
    if ! python3 -c "import fastapi" > /dev/null 2>&1; then
        log_fix "Installation des dépendances Backend..."
        python3 -m pip install -r requirements.txt
    fi
    
    # Redémarrer via Supervisor
    supervisorctl restart dounie-cuisine:dounie-backend
    
    # Attendre et tester
    sleep 10
    if curl -f -s http://localhost:8001/api/health > /dev/null 2>&1; then
        log_success "Backend FastAPI réparé"
        return 0
    else
        log_error "Échec de la réparation du Backend"
        return 1
    fi
}

fix_frontend_down() {
    log_fix "⚛️ Réparation du Frontend React..."
    
    cd "$PROJECT_PATH/frontend"
    
    # Vérifier les dépendances
    if [[ ! -d "node_modules" ]]; then
        log_fix "Installation des dépendances Frontend..."
        yarn install
    fi
    
    # Vérifier le build
    if [[ ! -d "build" ]]; then
        log_fix "Build du Frontend..."
        yarn build
    fi
    
    # Redémarrer via Supervisor
    supervisorctl restart dounie-cuisine:dounie-frontend
    
    # Attendre et tester
    sleep 10
    if curl -f -s http://localhost:3000 > /dev/null 2>&1; then
        log_success "Frontend React réparé"
        return 0
    else
        log_error "Échec de la réparation du Frontend"
        return 1
    fi
}

# Restauration depuis sauvegarde
restore_from_backup() {
    log_fix "💾 Restauration depuis la dernière sauvegarde..."
    
    if [[ ! -d "$BACKUP_DIR" ]]; then
        log_error "Aucune sauvegarde trouvée"
        return 1
    fi
    
    # Trouver la dernière sauvegarde
    local latest_backup=$(find "$BACKUP_DIR/app" -name "app_*.tar.gz" | sort | tail -1)
    
    if [[ -z "$latest_backup" ]]; then
        log_error "Aucune sauvegarde d'application trouvée"
        return 1
    fi
    
    log_info "Restauration depuis: $latest_backup"
    
    # Sauvegarder l'état actuel
    if [[ -d "$PROJECT_PATH" ]]; then
        mv "$PROJECT_PATH" "${PROJECT_PATH}.pre-restore.$(date +%Y%m%d_%H%M%S)"
    fi
    
    # Extraire la sauvegarde
    tar -xzf "$latest_backup" -C /
    
    if [[ $? -eq 0 ]]; then
        log_success "Restauration réussie"
        return 0
    else
        log_error "Échec de la restauration"
        return 1
    fi
}

# Réinstallation complète d'urgence
emergency_reinstall() {
    log_fix "🚨 RÉINSTALLATION COMPLÈTE D'URGENCE..."
    
    log_warning "Cette opération va tout réinstaller depuis zéro"
    read -p "Continuer? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Opération annulée"
        return 1
    fi
    
    # Sauvegarder l'état actuel
    if [[ -d "$PROJECT_PATH" ]]; then
        local backup_name="emergency-backup-$(date +%Y%m%d_%H%M%S)"
        mkdir -p "$BACKUP_DIR"
        cp -r "$PROJECT_PATH" "$BACKUP_DIR/$backup_name"
        log_info "Sauvegarde d'urgence créée: $BACKUP_DIR/$backup_name"
    fi
    
    # Exécuter le script de déploiement master
    if [[ -f "/app/deploy-vps-master.sh" ]]; then
        log_fix "Exécution du déploiement master..."
        bash /app/deploy-vps-master.sh
    else
        log_error "Script de déploiement master introuvable"
        return 1
    fi
}

# Génération d'un rapport de diagnostic
generate_diagnostic_report() {
    local issues=("$@")
    local report_file="$LOG_DIR/diagnostic-report-$(date +%Y%m%d_%H%M%S).json"
    
    mkdir -p "$LOG_DIR"
    
    cat > "$report_file" << EOF
{
    "diagnostic_date": "$(date -Iseconds)",
    "issues_found": [
$(for issue in "${issues[@]}"; do echo "        \"$issue\","; done | sed '$ s/,$//')
    ],
    "system_status": {
        "nginx": "$(systemctl is-active nginx 2>/dev/null || echo 'inactive')",
        "postgresql": "$(systemctl is-active postgresql 2>/dev/null || echo 'inactive')",
        "mongodb": "$(systemctl is-active mongod 2>/dev/null || echo 'inactive')",
        "supervisor": "$(systemctl is-active supervisor 2>/dev/null || echo 'inactive')"
    },
    "connectivity": {
        "api_express": "$(if curl -f -s http://localhost:5000/api/health > /dev/null 2>&1; then echo 'accessible'; else echo 'inaccessible'; fi)",
        "backend_fastapi": "$(if curl -f -s http://localhost:8001/api/health > /dev/null 2>&1; then echo 'accessible'; else echo 'inaccessible'; fi)",
        "frontend_react": "$(if curl -f -s http://localhost:3000 > /dev/null 2>&1; then echo 'accessible'; else echo 'inaccessible'; fi)",
        "public_app": "$(if curl -f -s http://localhost/ > /dev/null 2>&1; then echo 'accessible'; else echo 'inaccessible'; fi)"
    },
    "resources": {
        "disk_usage": "$(df / | awk 'NR==2 {print $5}')",
        "memory_usage": "$(free | awk 'NR==2{printf "%.1f%%", $3*100/$2}')",
        "uptime": "$(uptime -p)"
    }
}
EOF
    
    log_info "Rapport de diagnostic sauvegardé: $report_file"
}

# Menu interactif de récupération
show_recovery_menu() {
    local issues=("$@")
    
    echo ""
    echo "🔧============================================================🔧"
    echo "   MENU DE RÉCUPÉRATION DOUNIE CUISINE"
    echo "=============================================================="
    echo ""
    
    if [[ ${#issues[@]} -eq 0 ]]; then
        log_success "Aucun problème détecté! Le système semble fonctionnel."
        return 0
    fi
    
    log_warning "Problèmes détectés: ${#issues[@]}"
    for issue in "${issues[@]}"; do
        echo "   ❌ $issue"
    done
    
    echo ""
    echo "Options de récupération:"
    echo "1. Correction automatique des problèmes détectés"
    echo "2. Restauration depuis la dernière sauvegarde"
    echo "3. Réinstallation complète d'urgence"
    echo "4. Diagnostic détaillé seulement"
    echo "5. Quitter"
    echo ""
    
    read -p "Choisissez une option (1-5): " choice
    
    case $choice in
        1)
            log_info "🔧 Correction automatique des problèmes..."
            auto_fix_issues "${issues[@]}"
            ;;
        2)
            restore_from_backup
            ;;
        3)
            emergency_reinstall
            ;;
        4)
            generate_diagnostic_report "${issues[@]}"
            log_info "Diagnostic terminé. Consultez les logs pour plus de détails."
            ;;
        5)
            log_info "Récupération annulée"
            exit 0
            ;;
        *)
            log_error "Option invalide"
            show_recovery_menu "${issues[@]}"
            ;;
    esac
}

# Correction automatique basée sur les problèmes détectés
auto_fix_issues() {
    local issues=("$@")
    local fixed_count=0
    local total_issues=${#issues[@]}
    
    for issue in "${issues[@]}"; do
        case $issue in
            PROJECT_MISSING)
                if fix_project_missing; then
                    fixed_count=$((fixed_count + 1))
                fi
                ;;
            NGINX_DOWN)
                if fix_nginx_down; then
                    fixed_count=$((fixed_count + 1))
                fi
                ;;
            POSTGRESQL_DOWN)
                if fix_postgresql_down; then
                    fixed_count=$((fixed_count + 1))
                fi
                ;;
            MONGODB_DOWN)
                if fix_mongodb_down; then
                    fixed_count=$((fixed_count + 1))
                fi
                ;;
            SUPERVISOR_DOWN)
                if fix_supervisor_down; then
                    fixed_count=$((fixed_count + 1))
                fi
                ;;
            API_DOWN)
                if fix_api_down; then
                    fixed_count=$((fixed_count + 1))
                fi
                ;;
            BACKEND_DOWN)
                if fix_backend_down; then
                    fixed_count=$((fixed_count + 1))
                fi
                ;;
            FRONTEND_DOWN)
                if fix_frontend_down; then
                    fixed_count=$((fixed_count + 1))
                fi
                ;;
            DIR_MISSING_*)
                # Si des répertoires manquent, récupérer le projet complet
                if fix_project_missing; then
                    fixed_count=$((fixed_count + 1))
                fi
                ;;
        esac
    done
    
    echo ""
    log_info "📊 Résultats de la correction automatique:"
    echo "   Problèmes corrigés: $fixed_count/$total_issues"
    
    if [[ $fixed_count -eq $total_issues ]]; then
        log_success "🎉 Tous les problèmes ont été corrigés!"
        log_info "🧪 Exécution des tests de validation..."
        
        if [[ -f "/app/test-complete-system.sh" ]]; then
            bash /app/test-complete-system.sh
        fi
    else
        log_warning "⚠️ Certains problèmes n'ont pas pu être corrigés automatiquement"
        log_info "Vous pouvez essayer la restauration depuis sauvegarde ou la réinstallation complète"
    fi
}

# Fonction principale
main() {
    echo "🚨 SCRIPT DE RÉCUPÉRATION D'URGENCE DOUNIE CUISINE"
    echo "=================================================="
    echo ""
    
    # Vérifier les permissions root
    if [[ $EUID -ne 0 ]]; then
        log_error "Ce script doit être exécuté en tant que root"
        log_error "Utilisez: sudo ./emergency-recovery.sh"
        exit 1
    fi
    
    # Diagnostic du système
    local issues_detected=($(diagnose_system))
    
    # Générer un rapport de diagnostic
    generate_diagnostic_report "${issues_detected[@]}"
    
    # Afficher le menu de récupération
    show_recovery_menu "${issues_detected[@]}"
}

# Exécution du script
main "$@"
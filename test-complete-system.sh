#!/bin/bash

# =============================================================================
# SCRIPT DE TESTS AUTOMATIQUES DOUNIE CUISINE
# Tests complets de l'architecture double backend
# =============================================================================

set -e

# Configuration
PROJECT_PATH="/var/www/html/dounie-cuisine"
LOG_DIR="/var/log/dounie-cuisine"
TEST_REPORT="/var/log/dounie-cuisine/comprehensive-test-report.json"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Fonctions de logging
log_info() { echo -e "${BLUE}[TEST]${NC} $1"; }
log_success() { echo -e "${GREEN}[PASS]${NC} $1"; }
log_error() { echo -e "${RED}[FAIL]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARN]${NC} $1"; }

# Initialisation des résultats
declare -A test_results
total_tests=0
passed_tests=0
failed_tests=0

# Fonction pour enregistrer un résultat de test
record_test() {
    local test_name="$1"
    local result="$2"
    local details="$3"
    
    test_results["$test_name"]="$result"
    total_tests=$((total_tests + 1))
    
    if [[ "$result" == "PASS" ]]; then
        passed_tests=$((passed_tests + 1))
        log_success "$test_name - $details"
    else
        failed_tests=$((failed_tests + 1))
        log_error "$test_name - $details"
    fi
}

# Tests de connectivité des services
test_services() {
    log_info "🔍 Tests de connectivité des services..."
    
    # Test API Express.js
    if curl -f -s http://localhost:5000/api/health > /dev/null 2>&1; then
        record_test "api_express" "PASS" "API Express.js accessible sur port 5000"
    else
        record_test "api_express" "FAIL" "API Express.js non accessible"
    fi
    
    # Test Backend FastAPI
    if curl -f -s http://localhost:8001/api/health > /dev/null 2>&1; then
        record_test "backend_fastapi" "PASS" "Backend FastAPI accessible sur port 8001"
    else
        record_test "backend_fastapi" "FAIL" "Backend FastAPI non accessible"
    fi
    
    # Test Frontend React
    if curl -f -s http://localhost:3000 > /dev/null 2>&1; then
        record_test "frontend_react" "PASS" "Frontend React accessible sur port 3000"
    else
        record_test "frontend_react" "FAIL" "Frontend React non accessible"
    fi
    
    # Test Application publique
    if curl -f -s http://localhost/ > /dev/null 2>&1; then
        record_test "public_app" "PASS" "Application publique accessible via Nginx"
    else
        record_test "public_app" "FAIL" "Application publique non accessible"
    fi
    
    # Test Interface admin
    if curl -f -s http://localhost/admin > /dev/null 2>&1; then
        record_test "admin_interface" "PASS" "Interface d'administration accessible"
    else
        record_test "admin_interface" "FAIL" "Interface d'administration non accessible"
    fi
    
    # Test Frontend alternatif
    if curl -f -s http://localhost/app > /dev/null 2>&1; then
        record_test "frontend_alt" "PASS" "Frontend alternatif accessible"
    else
        record_test "frontend_alt" "FAIL" "Frontend alternatif non accessible"
    fi
}

# Tests des bases de données
test_databases() {
    log_info "🗄️ Tests des bases de données..."
    
    # Test PostgreSQL
    if systemctl is-active --quiet postgresql; then
        # Test de connexion à la base
        if sudo -u postgres psql -c "SELECT 1;" > /dev/null 2>&1; then
            record_test "postgresql" "PASS" "PostgreSQL opérationnel et accessible"
        else
            record_test "postgresql" "FAIL" "PostgreSQL en cours mais non accessible"
        fi
    else
        record_test "postgresql" "FAIL" "PostgreSQL non démarré"
    fi
    
    # Test MongoDB
    if systemctl is-active --quiet mongod; then
        if mongosh --eval "db.adminCommand('ismaster')" > /dev/null 2>&1; then
            record_test "mongodb" "PASS" "MongoDB opérationnel et accessible"
        else
            record_test "mongodb" "FAIL" "MongoDB en cours mais non accessible"
        fi
    else
        record_test "mongodb" "FAIL" "MongoDB non démarré"
    fi
}

# Tests des services système
test_system_services() {
    log_info "⚙️ Tests des services système..."
    
    # Test Nginx
    if systemctl is-active --quiet nginx; then
        if nginx -t > /dev/null 2>&1; then
            record_test "nginx" "PASS" "Nginx actif avec configuration valide"
        else
            record_test "nginx" "FAIL" "Nginx actif mais configuration invalide"
        fi
    else
        record_test "nginx" "FAIL" "Nginx non actif"
    fi
    
    # Test Supervisor
    if systemctl is-active --quiet supervisor; then
        local running_programs=$(supervisorctl status | grep -c "RUNNING" || echo "0")
        if [[ $running_programs -gt 0 ]]; then
            record_test "supervisor" "PASS" "Supervisor actif avec $running_programs programmes en cours"
        else
            record_test "supervisor" "FAIL" "Supervisor actif mais aucun programme en cours"
        fi
    else
        record_test "supervisor" "FAIL" "Supervisor non actif"
    fi
    
    # Test Firewall
    if ufw status | grep -q "Status: active"; then
        record_test "firewall" "PASS" "Firewall UFW actif"
    else
        record_test "firewall" "FAIL" "Firewall UFW non actif"
    fi
}

# Tests de performance
test_performance() {
    log_info "📈 Tests de performance..."
    
    # Test temps de réponse API Express
    local api_response_time=$(curl -o /dev/null -s -w "%{time_total}" http://localhost:5000/api/health 2>/dev/null || echo "999")
    if (( $(echo "$api_response_time < 2.0" | bc -l) )); then
        record_test "api_performance" "PASS" "API Express répond en ${api_response_time}s"
    else
        record_test "api_performance" "FAIL" "API Express lente: ${api_response_time}s"
    fi
    
    # Test temps de réponse Backend FastAPI
    local backend_response_time=$(curl -o /dev/null -s -w "%{time_total}" http://localhost:8001/api/health 2>/dev/null || echo "999")
    if (( $(echo "$backend_response_time < 2.0" | bc -l) )); then
        record_test "backend_performance" "PASS" "Backend FastAPI répond en ${backend_response_time}s"
    else
        record_test "backend_performance" "FAIL" "Backend FastAPI lent: ${backend_response_time}s"
    fi
    
    # Test utilisation mémoire
    local memory_usage=$(free | awk 'NR==2{printf "%.1f", $3*100/$2}')
    if (( $(echo "$memory_usage < 80.0" | bc -l) )); then
        record_test "memory_usage" "PASS" "Utilisation mémoire: ${memory_usage}%"
    else
        record_test "memory_usage" "FAIL" "Utilisation mémoire élevée: ${memory_usage}%"
    fi
    
    # Test espace disque
    local disk_usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [[ $disk_usage -lt 85 ]]; then
        record_test "disk_usage" "PASS" "Utilisation disque: ${disk_usage}%"
    else
        record_test "disk_usage" "FAIL" "Utilisation disque critique: ${disk_usage}%"
    fi
}

# Tests de sécurité
test_security() {
    log_info "🔒 Tests de sécurité..."
    
    # Test headers de sécurité
    local security_headers=$(curl -I -s http://localhost/ | grep -c -E "(X-Frame-Options|X-XSS-Protection|X-Content-Type-Options)" || echo "0")
    if [[ $security_headers -ge 2 ]]; then
        record_test "security_headers" "PASS" "$security_headers headers de sécurité détectés"
    else
        record_test "security_headers" "FAIL" "Headers de sécurité insuffisants"
    fi
    
    # Test protection des fichiers sensibles
    if curl -f -s http://localhost/.env > /dev/null 2>&1; then
        record_test "file_protection" "FAIL" "Fichiers .env accessibles publiquement"
    else
        record_test "file_protection" "PASS" "Fichiers sensibles protégés"
    fi
    
    # Test fail2ban
    if systemctl is-active --quiet fail2ban; then
        record_test "fail2ban" "PASS" "Fail2ban actif"
    else
        record_test "fail2ban" "FAIL" "Fail2ban non actif"
    fi
}

# Tests fonctionnels
test_functionality() {
    log_info "🎯 Tests fonctionnels..."
    
    # Test des routes API
    local api_routes=("/api/health" "/api/status")
    local working_routes=0
    
    for route in "${api_routes[@]}"; do
        if curl -f -s "http://localhost:5000$route" > /dev/null 2>&1; then
            working_routes=$((working_routes + 1))
        fi
    done
    
    if [[ $working_routes -eq ${#api_routes[@]} ]]; then
        record_test "api_routes" "PASS" "Toutes les routes API fonctionnelles"
    else
        record_test "api_routes" "FAIL" "$working_routes/${#api_routes[@]} routes API fonctionnelles"
    fi
    
    # Test des proxies Nginx
    if curl -f -s http://localhost/api/health > /dev/null 2>&1; then
        record_test "nginx_proxy_api" "PASS" "Proxy Nginx vers API fonctionnel"
    else
        record_test "nginx_proxy_api" "FAIL" "Proxy Nginx vers API non fonctionnel"
    fi
    
    if curl -f -s http://localhost/api/v2/health > /dev/null 2>&1; then
        record_test "nginx_proxy_backend" "PASS" "Proxy Nginx vers Backend fonctionnel"
    else
        record_test "nginx_proxy_backend" "FAIL" "Proxy Nginx vers Backend non fonctionnel"
    fi
}

# Tests de monitoring
test_monitoring() {
    log_info "📊 Tests du système de monitoring..."
    
    # Test script de monitoring
    if [[ -f "/usr/local/bin/dounie-monitor" && -x "/usr/local/bin/dounie-monitor" ]]; then
        record_test "monitor_script" "PASS" "Script de monitoring présent et exécutable"
    else
        record_test "monitor_script" "FAIL" "Script de monitoring manquant"
    fi
    
    # Test cron job monitoring
    if crontab -l | grep -q "dounie-monitor"; then
        record_test "monitor_cron" "PASS" "Cron job de monitoring configuré"
    else
        record_test "monitor_cron" "FAIL" "Cron job de monitoring manquant"
    fi
    
    # Test fichier de status
    if [[ -f "/var/log/dounie-cuisine/status.json" ]]; then
        record_test "status_file" "PASS" "Fichier de status présent"
    else
        record_test "status_file" "FAIL" "Fichier de status manquant"
    fi
}

# Tests de sauvegardes
test_backups() {
    log_info "💾 Tests du système de sauvegarde..."
    
    # Test script de sauvegarde
    if [[ -f "/etc/cron.daily/dounie-backup" && -x "/etc/cron.daily/dounie-backup" ]]; then
        record_test "backup_script" "PASS" "Script de sauvegarde configuré"
    else
        record_test "backup_script" "FAIL" "Script de sauvegarde manquant"
    fi
    
    # Test répertoire de sauvegarde
    if [[ -d "/backup/dounie-cuisine" ]]; then
        record_test "backup_directory" "PASS" "Répertoire de sauvegarde présent"
    else
        record_test "backup_directory" "FAIL" "Répertoire de sauvegarde manquant"
    fi
    
    # Test permissions de sauvegarde
    if [[ -w "/backup/dounie-cuisine" ]]; then
        record_test "backup_permissions" "PASS" "Permissions de sauvegarde correctes"
    else
        record_test "backup_permissions" "FAIL" "Permissions de sauvegarde incorrectes"
    fi
}

# Génération du rapport final
generate_report() {
    log_info "📋 Génération du rapport de tests..."
    
    local success_rate=$(echo "scale=1; $passed_tests * 100 / $total_tests" | bc -l)
    local overall_status="SUCCESS"
    
    if [[ $failed_tests -gt 0 ]]; then
        if [[ $failed_tests -le 3 ]]; then
            overall_status="PARTIAL_SUCCESS"
        else
            overall_status="FAILURE"
        fi
    fi
    
    # Créer le rapport JSON
    cat > "$TEST_REPORT" << EOF
{
    "test_date": "$(date -Iseconds)",
    "overall_status": "$overall_status",
    "summary": {
        "total_tests": $total_tests,
        "passed_tests": $passed_tests,
        "failed_tests": $failed_tests,
        "success_rate": "${success_rate}%"
    },
    "results": {
EOF
    
    # Ajouter tous les résultats de tests
    local first=true
    for test_name in "${!test_results[@]}"; do
        if [[ "$first" == true ]]; then
            first=false
        else
            echo "," >> "$TEST_REPORT"
        fi
        echo "        \"$test_name\": \"${test_results[$test_name]}\"" >> "$TEST_REPORT"
    done
    
    cat >> "$TEST_REPORT" << EOF
    },
    "recommendations": [
$(if [[ "${test_results[api_express]}" == "FAIL" ]]; then echo '        "Vérifier les logs API Express: tail -f /var/log/dounie-cuisine/api.err.log",'; fi)
$(if [[ "${test_results[backend_fastapi]}" == "FAIL" ]]; then echo '        "Vérifier les logs Backend FastAPI: tail -f /var/log/dounie-cuisine/backend.err.log",'; fi)
$(if [[ "${test_results[postgresql]}" == "FAIL" ]]; then echo '        "Redémarrer PostgreSQL: systemctl restart postgresql",'; fi)
$(if [[ "${test_results[mongodb]}" == "FAIL" ]]; then echo '        "Redémarrer MongoDB: systemctl restart mongod",'; fi)
$(if [[ "${test_results[nginx]}" == "FAIL" ]]; then echo '        "Vérifier configuration Nginx: nginx -t",'; fi)
        "Consulter les logs détaillés dans /var/log/dounie-cuisine/"
    ]
}
EOF
    
    log_info "Rapport sauvegardé dans: $TEST_REPORT"
}

# Affichage du résumé final
show_summary() {
    echo ""
    echo "🧪============================================================🧪"
    echo "   RAPPORT DE TESTS AUTOMATIQUES DOUNIE CUISINE"
    echo "=============================================================="
    echo ""
    
    local success_rate=$(echo "scale=1; $passed_tests * 100 / $total_tests" | bc -l)
    
    log_info "📊 RÉSUMÉ DES TESTS:"
    echo "   Total des tests:     $total_tests"
    echo "   Tests réussis:       $passed_tests"
    echo "   Tests échoués:       $failed_tests"
    echo "   Taux de réussite:    ${success_rate}%"
    echo ""
    
    if [[ $failed_tests -eq 0 ]]; then
        log_success "🎉 TOUS LES TESTS SONT RÉUSSIS!"
        log_success "Le système Dounie Cuisine est 100% opérationnel"
    elif [[ $failed_tests -le 3 ]]; then
        log_warning "⚠️ TESTS PARTIELLEMENT RÉUSSIS"
        log_warning "Le système est fonctionnel mais nécessite quelques ajustements"
    else
        log_error "❌ PLUSIEURS TESTS ONT ÉCHOUÉ"
        log_error "Le système nécessite une attention immédiate"
    fi
    
    echo ""
    log_info "📋 DÉTAILS DES RÉSULTATS:"
    for test_name in "${!test_results[@]}"; do
        local result="${test_results[$test_name]}"
        if [[ "$result" == "PASS" ]]; then
            echo -e "   ✅ $test_name"
        else
            echo -e "   ❌ $test_name"
        fi
    done
    
    echo ""
    log_info "📁 FICHIERS GÉNÉRÉS:"
    echo "   📋 Rapport complet:  $TEST_REPORT"
    echo "   📊 Status système:   /var/log/dounie-cuisine/status.json"
    echo "   📝 Logs détaillés:   /var/log/dounie-cuisine/"
    
    echo ""
    echo "=============================================================="
    if [[ $failed_tests -eq 0 ]]; then
        log_success "SYSTÈME DOUNIE CUISINE VALIDÉ ET PRÊT POUR LA PRODUCTION!"
    else
        log_warning "Consultez le rapport détaillé pour les recommandations"
    fi
    echo "=============================================================="
}

# Fonction principale
main() {
    echo "🧪 DÉMARRAGE DES TESTS AUTOMATIQUES DOUNIE CUISINE"
    echo "=================================================="
    echo ""
    
    # Créer le répertoire de logs si nécessaire
    mkdir -p "$LOG_DIR"
    
    # Exécuter tous les tests
    test_services
    test_databases
    test_system_services
    test_performance
    test_security
    test_functionality
    test_monitoring
    test_backups
    
    # Générer le rapport et afficher le résumé
    generate_report
    show_summary
}

# Exécution du script
main "$@"
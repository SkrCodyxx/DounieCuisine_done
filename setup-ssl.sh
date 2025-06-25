#!/bin/bash

# Script de configuration SSL automatique pour Dounie Cuisine
# Usage: ./setup-ssl.sh votre-domaine.com

set -e

# Configuration
DOMAIN=${1:-""}
EMAIL=${2:-"admin@${DOMAIN}"}

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Vérification des paramètres
if [[ -z "$DOMAIN" ]]; then
    log_error "Usage: ./setup-ssl.sh votre-domaine.com [email@domain.com]"
    log_error "Exemple: ./setup-ssl.sh dounie-cuisine.com admin@dounie-cuisine.com"
    exit 1
fi

log_info "🔐 Configuration SSL pour: $DOMAIN"
log_info "📧 Email de contact: $EMAIL"

# Vérifier que le domaine pointe vers ce serveur
log_info "Vérification DNS du domaine..."
SERVER_IP=$(curl -s ifconfig.me)
DOMAIN_IP=$(dig +short "$DOMAIN" | tail -n1)

if [[ "$SERVER_IP" != "$DOMAIN_IP" ]]; then
    log_warning "⚠️  Le domaine $DOMAIN ne pointe pas vers ce serveur ($SERVER_IP)"
    log_warning "IP du domaine: $DOMAIN_IP"
    log_warning "IP du serveur: $SERVER_IP"
    
    read -p "Continuer quand même ? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_error "Configuration SSL annulée"
        exit 1
    fi
fi

# Installation de Certbot
log_info "Installation de Certbot..."
apt-get update
apt-get install -y certbot python3-certbot-nginx

# Sauvegarde de la configuration Nginx actuelle
log_info "Sauvegarde de la configuration Nginx..."
cp /etc/nginx/sites-available/dounie-cuisine "/etc/nginx/sites-available/dounie-cuisine.backup.$(date +%Y%m%d_%H%M%S)"

# Configuration Nginx pour le domaine
log_info "Mise à jour de la configuration Nginx pour le domaine..."
sed -i "s/server_name _;/server_name $DOMAIN www.$DOMAIN;/" /etc/nginx/sites-available/dounie-cuisine

# Test de la configuration
nginx -t
systemctl reload nginx

# Obtention du certificat SSL
log_info "Obtention du certificat SSL Let's Encrypt..."
certbot --nginx \
    --non-interactive \
    --agree-tos \
    --email "$EMAIL" \
    --domains "$DOMAIN" \
    --redirect

# Configuration du renouvellement automatique
log_info "Configuration du renouvellement automatique..."
cat > /etc/cron.d/certbot-renew << EOF
# Renouvellement automatique des certificats SSL Let's Encrypt
0 12 * * * root /usr/bin/certbot renew --quiet --post-hook "systemctl reload nginx"
EOF

# Amélioration de la sécurité SSL
log_info "Amélioration de la configuration SSL..."
cat >> /etc/nginx/sites-available/dounie-cuisine << 'EOF'

# Configuration SSL avancée
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;

# HSTS (HTTP Strict Transport Security)
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

# Sécurité headers supplémentaires
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;

# OCSP Stapling
ssl_stapling on;
ssl_stapling_verify on;
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;
EOF

# Test final et reload
nginx -t
systemctl reload nginx

# Vérification SSL
log_info "Vérification de la configuration SSL..."
sleep 5

if curl -I "https://$DOMAIN" > /dev/null 2>&1; then
    log_success "✅ SSL configuré avec succès!"
else
    log_warning "⚠️  Problème de configuration SSL détecté"
fi

# Test de redirection HTTP → HTTPS
if curl -I "http://$DOMAIN" 2>/dev/null | grep -q "301\|302"; then
    log_success "✅ Redirection HTTP vers HTTPS fonctionnelle"
else
    log_warning "⚠️  Problème de redirection HTTP vers HTTPS"
fi

# Affichage des informations finales
echo ""
log_success "🎉 Configuration SSL terminée!"
echo ""
log_info "🌐 URLs sécurisées:"
log_info "   Site Public:        https://$DOMAIN"
log_info "   Administration:     https://$DOMAIN/admin"
log_info "   API:                https://$DOMAIN/api"
echo ""
log_info "📋 Informations SSL:"
log_info "   Certificat valide jusqu'au: $(openssl x509 -in /etc/letsencrypt/live/$DOMAIN/cert.pem -noout -enddate | cut -d= -f2)"
log_info "   Renouvellement automatique: Activé"
log_info "   Commande de test: certbot renew --dry-run"
echo ""
log_info "🔧 Maintenance:"
log_info "   Logs Certbot: /var/log/letsencrypt/"
log_info "   Forcer renouvellement: certbot renew --force-renewal"
log_info "   Vérifier statut SSL: curl -I https://$DOMAIN"
echo ""
log_success "🔐 Votre site Dounie Cuisine est maintenant sécurisé avec SSL!"
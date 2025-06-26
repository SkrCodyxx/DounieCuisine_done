#!/bin/bash
# SCRIPT DE DÉPLOIEMENT DEBIAN - DOUNIE CUISINE
# Déploiement complet sur serveur Debian/Ubuntu VPS

set -e

echo "🚀 DÉMARRAGE DÉPLOIEMENT DOUNIE CUISINE SUR DEBIAN"

# Variables
PROJECT_DIR="/var/www/dounie-cuisine"
SERVICE_USER="dounie"
DB_NAME="dounie_cuisine"

# Fonction de log
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# 1. Mise à jour système
log "Mise à jour du système..."
sudo apt update && sudo apt upgrade -y

# 2. Installation des dépendances
log "Installation des dépendances..."
sudo apt install -y python3 python3-pip nodejs npm mongodb nginx git supervisor curl

# 3. Création utilisateur système
log "Création utilisateur système..."
sudo useradd -m -s /bin/bash $SERVICE_USER || true

# 4. Clonage/copie du projet
log "Installation du projet..."
sudo mkdir -p $PROJECT_DIR
sudo cp -r /app/* $PROJECT_DIR/
sudo chown -R $SERVICE_USER:$SERVICE_USER $PROJECT_DIR

# 5. Installation des dépendances backend
log "Installation dépendances Python..."
cd $PROJECT_DIR/backend
sudo -u $SERVICE_USER pip3 install -r requirements.txt

# 6. Installation des dépendances frontend
log "Installation dépendances Node.js..."
cd $PROJECT_DIR/frontend
sudo -u $SERVICE_USER npm install
sudo -u $SERVICE_USER npm run build

# 7. Configuration MongoDB
log "Configuration MongoDB..."
sudo systemctl start mongodb
sudo systemctl enable mongodb

# 8. Configuration des variables d'environnement
log "Configuration environnement..."
sudo -u $SERVICE_USER tee $PROJECT_DIR/backend/.env > /dev/null <<EOF
MONGO_URL=mongodb://localhost:27017/$DB_NAME
DATABASE_NAME=$DB_NAME
PORT=8001
NODE_ENV=production
EOF

sudo -u $SERVICE_USER tee $PROJECT_DIR/frontend/.env > /dev/null <<EOF
REACT_APP_BACKEND_URL=http://localhost/api
EOF

# 9. Configuration Nginx
log "Configuration Nginx..."
sudo tee /etc/nginx/sites-available/dounie-cuisine > /dev/null <<EOF
server {
    listen 80;
    server_name _;

    # Frontend (React)
    location / {
        root $PROJECT_DIR/frontend/build;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API
    location /api {
        rewrite ^/api/(.*) /\$1 break;
        proxy_pass http://localhost:8001;
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

sudo ln -sf /etc/nginx/sites-available/dounie-cuisine /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx

# 10. Configuration Supervisor
log "Configuration Supervisor..."
sudo tee /etc/supervisor/conf.d/dounie-backend.conf > /dev/null <<EOF
[program:dounie-backend]
command=python3 -m uvicorn server:app --host 0.0.0.0 --port 8001
directory=$PROJECT_DIR/backend
user=$SERVICE_USER
autostart=true
autorestart=true
stderr_logfile=/var/log/dounie-backend.err.log
stdout_logfile=/var/log/dounie-backend.out.log
environment=PYTHONPATH="$PROJECT_DIR/backend"
EOF

# 11. Démarrage des services
log "Démarrage des services..."
sudo systemctl enable supervisor
sudo systemctl restart supervisor
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start dounie-backend

# 12. Vérification finale
log "Vérification du déploiement..."
sleep 5

if curl -f http://localhost:8001/api/health > /dev/null 2>&1; then
    log "✅ Backend démarré avec succès"
else
    log "❌ Erreur backend - vérifiez les logs"
    sudo supervisorctl status dounie-backend
    exit 1
fi

if curl -f http://localhost > /dev/null 2>&1; then
    log "✅ Frontend accessible avec succès"
else
    log "❌ Erreur frontend - vérifiez Nginx"
    sudo nginx -t
    exit 1
fi

log "🎉 DÉPLOIEMENT TERMINÉ AVEC SUCCÈS!"
log "🌐 Application accessible sur: http://votre-ip"
log "📊 Backend API: http://votre-ip/api/health"
log "👀 Logs backend: sudo supervisorctl tail dounie-backend"
log "🔧 Gestion services: sudo supervisorctl status"

echo ""
echo "=== INFORMATIONS DÉPLOIEMENT ==="
echo "Utilisateur système: $SERVICE_USER"
echo "Répertoire projet: $PROJECT_DIR"
echo "Base de données: MongoDB ($DB_NAME)"
echo "Services: Nginx + Supervisor + MongoDB"
echo "================================="
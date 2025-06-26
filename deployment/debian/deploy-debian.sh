#!/bin/bash
# Script de déploiement automatique Dounie Cuisine sur VPS Debian
# Usage: ./deploy-debian.sh

set -e

echo "🚀 DÉPLOIEMENT DOUNIE CUISINE SUR VPS DEBIAN"
echo "============================================="

# 1. Mise à jour système
echo "📦 Mise à jour du système..."
sudo apt update && sudo apt upgrade -y

# 2. Installation des dépendances système
echo "🔧 Installation des dépendances..."
sudo apt install -y \
    nodejs npm \
    python3 python3-pip python3-venv \
    mongodb \
    nginx \
    supervisor \
    git curl wget

# 3. Configuration MongoDB
echo "🗃️ Configuration MongoDB..."
sudo systemctl start mongodb
sudo systemctl enable mongodb

# 4. Création de l'environnement Python
echo "🐍 Configuration Python..."
python3 -m venv /app/.venv
source /app/.venv/bin/activate
pip install --upgrade pip

# 5. Installation dépendances backend
echo "📚 Installation dépendances backend..."
cd /app/backend
pip install -r requirements.txt

# 6. Installation dépendances frontend
echo "⚛️ Installation dépendances frontend..."
cd /app/frontend
npm install
npm run build

# 7. Configuration Nginx
echo "🌐 Configuration Nginx..."
sudo cp /app/nginx-dounie.conf /etc/nginx/sites-available/dounie-cuisine
sudo ln -sf /etc/nginx/sites-available/dounie-cuisine /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

# 8. Configuration services Supervisor
echo "👷 Configuration Supervisor..."
sudo cp /app/supervisor-dounie.conf /etc/supervisor/conf.d/dounie.conf
sudo systemctl restart supervisor
sudo systemctl enable supervisor

# 9. Démarrage des services
echo "🚀 Démarrage des services..."
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start all

# 10. Configuration firewall
echo "🔒 Configuration firewall..."
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

# 11. Vérification finale
echo "✅ Vérification du déploiement..."
sleep 5

if curl -f http://localhost/api/health; then
    echo "🎉 DÉPLOIEMENT RÉUSSI!"
    echo "🌐 Site accessible sur: http://$(curl -s ifconfig.me)"
    echo "🛠️ Admin accessible sur: http://$(curl -s ifconfig.me)/admin"
else
    echo "❌ Erreur de déploiement - vérifiez les logs"
    sudo supervisorctl status
fi

echo "📋 Commandes utiles:"
echo "- Statut services: sudo supervisorctl status"
echo "- Redémarrer: sudo supervisorctl restart all"
echo "- Logs: sudo tail -f /var/log/supervisor/*.log"
# Guide de Déploiement - Dounie Cuisine

## Prérequis Système

### Serveur Linux (Ubuntu/Debian recommandé)
- **CPU**: 2 cores minimum, 4 cores recommandé
- **RAM**: 4GB minimum, 8GB recommandé
- **Stockage**: 20GB minimum d'espace libre
- **Réseau**: Connexion internet stable

### Logiciels Requis
- **Node.js** 18+ 
- **npm** ou **yarn**
- **PostgreSQL** 14+
- **nginx** (optionnel, pour production)
- **PM2** (installé automatiquement par le script)

## Installation Rapide

### 1. Préparation du Serveur

```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation de Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installation de PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Configuration de PostgreSQL
sudo -u postgres createuser --interactive --pwprompt dounie_user
sudo -u postgres createdb -O dounie_user dounie_cuisine
```

### 2. Configuration de la Base de Données

```bash
# Connexion à PostgreSQL
sudo -u postgres psql

-- Création de l'utilisateur et de la base
CREATE USER dounie_user WITH PASSWORD 'votre_mot_de_passe_securise';
CREATE DATABASE dounie_cuisine OWNER dounie_user;
GRANT ALL PRIVILEGES ON DATABASE dounie_cuisine TO dounie_user;
\q
```

### 3. Variables d'Environnement

Créer le fichier `.env` dans le répertoire racine :

```bash
# Base de données
DATABASE_URL=postgresql://dounie_user:votre_mot_de_passe_securise@localhost:5432/dounie_cuisine

# Ports des applications
API_PORT=5000
PUBLIC_PORT=3000
ADMIN_PORT=3001

# Environnement
NODE_ENV=production

# Sécurité (générer des clés aléatoirement)
SESSION_SECRET=votre_session_secret_tres_long_et_aleatoire
JWT_SECRET=votre_jwt_secret_tres_long_et_aleatoire

# Email (optionnel)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-email
```

### 4. Déploiement Automatique

```bash
# Cloner le projet
git clone <url-du-repository> dounie-cuisine
cd dounie-cuisine

# Rendre le script exécutable
chmod +x deploy.sh

# Lancer le déploiement
./deploy.sh
```

## Configuration Avancée

### Configuration nginx (Production)

Le script configure automatiquement nginx. Configuration manuelle si nécessaire :

```nginx
server {
    listen 80;
    server_name votre-domaine.com;
    
    # Application publique
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Interface d'administration
    location /admin {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL/HTTPS avec Let's Encrypt

```bash
# Installation de Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtention du certificat SSL
sudo certbot --nginx -d votre-domaine.com

# Test de renouvellement automatique
sudo certbot renew --dry-run
```

## Gestion des Services

### Commandes PM2 Utiles

```bash
# Voir le statut des services
pm2 status

# Voir les logs en temps réel
pm2 logs

# Redémarrer tous les services
pm2 restart all

# Redémarrer un service spécifique
pm2 restart dounie-api

# Arrêter tous les services
pm2 stop all

# Supprimer tous les services
pm2 delete all

# Monitorer les performances
pm2 monit
```

### Sauvegarde et Restauration

```bash
# Sauvegarde de la base de données
pg_dump -U dounie_user -h localhost dounie_cuisine > backup_$(date +%Y%m%d_%H%M%S).sql

# Restauration de la base de données
psql -U dounie_user -h localhost dounie_cuisine < backup_file.sql

# Sauvegarde automatique quotidienne (crontab)
0 2 * * * /usr/bin/pg_dump -U dounie_user dounie_cuisine > /backup/dounie_$(date +\%Y\%m\%d).sql
```

## Maintenance

### Mise à Jour du Code

```bash
# Arrêter les services
pm2 stop all

# Mettre à jour le code
git pull origin main

# Réinstaller les dépendances si nécessaire
cd api && npm install && cd ..
cd public && npm install && cd ..
cd administration && npm install && cd ..

# Rebuilder les applications
./deploy.sh

# Les services redémarrent automatiquement
```

### Surveillance des Logs

```bash
# Logs de l'API
pm2 logs dounie-api

# Logs nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Logs PostgreSQL
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

## Dépannage

### Problèmes Courants

1. **Port déjà utilisé**
   ```bash
   # Trouver le processus utilisant le port
   sudo lsof -i :5000
   
   # Tuer le processus
   sudo kill -9 <PID>
   ```

2. **Erreur de connexion base de données**
   ```bash
   # Vérifier que PostgreSQL fonctionne
   sudo systemctl status postgresql
   
   # Redémarrer PostgreSQL
   sudo systemctl restart postgresql
   ```

3. **Erreur de permissions**
   ```bash
   # Changer le propriétaire des fichiers
   sudo chown -R $USER:$USER /path/to/dounie-cuisine
   ```

4. **Mémoire insuffisante**
   ```bash
   # Créer un fichier swap
   sudo fallocate -l 2G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   ```

### Tests de Santé

```bash
# Test API
curl http://localhost:5000/api/health

# Test application publique
curl http://localhost:3000

# Test administration
curl http://localhost:3001
```

## Performance

### Optimisation de la Base de Données

```sql
-- Index pour améliorer les performances
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_reservations_date ON reservations(date_time);
CREATE INDEX idx_menu_items_category ON menu_items(category);

-- Analyse des performances
ANALYZE;
```

### Monitoring

Installer un système de monitoring comme **Prometheus + Grafana** pour surveiller :
- CPU et mémoire
- Temps de réponse API
- Nombre de connexions base de données
- Trafic réseau

## Sécurité

### Firewall

```bash
# Configuration UFW
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw deny 5432  # PostgreSQL (accès local uniquement)
```

### Sauvegardes Automatiques

Configurer des sauvegardes automatiques vers un service cloud (AWS S3, Google Cloud Storage) pour garantir la récupération des données.

## Support

En cas de problème :
1. Vérifier les logs PM2 : `pm2 logs`
2. Vérifier les logs nginx : `sudo tail -f /var/log/nginx/error.log`
3. Vérifier la connectivité base de données
4. Contacter l'équipe de support technique
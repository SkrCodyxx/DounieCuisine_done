# Manuel de déploiement - Dounie Cuisine

## Architecture de l'application

L'application Dounie Cuisine est maintenant séparée en 3 parties distinctes :

```
/workspace/
├── api/              # Serveur API backend
├── public/           # Site web public pour clients
├── administration/   # Interface d'administration
└── shared/          # Données partagées (intégré dans api/)
```

## Prérequis système

### Environnement minimum
- **Node.js** : Version 20 ou supérieure
- **PostgreSQL** : Version 14 ou supérieure
- **RAM** : 2GB minimum, 4GB recommandé
- **Stockage** : 10GB minimum
- **Système** : Linux/Windows/macOS

### Dépendances techniques
- **Express.js** : Serveur web backend
- **React** : Interfaces utilisateur
- **Vite** : Build tool et serveur de développement
- **Drizzle ORM** : Gestion base de données
- **TailwindCSS** : Styles et composants UI

## Configuration de l'environnement

### Variables d'environnement requises

Créer un fichier `.env` dans le dossier `api/` :

```env
# Base de données
DATABASE_URL=postgresql://username:password@localhost:5432/dounie_cuisine
PGHOST=localhost
PGPORT=5432
PGUSER=votre_utilisateur
PGPASSWORD=votre_mot_de_passe
PGDATABASE=dounie_cuisine

# Application
NODE_ENV=production
SESSION_SECRET=votre_clé_secrète_session_très_longue_et_complexe

# Configuration serveur
PORT=5000
HOST=0.0.0.0

# Sécurité
BCRYPT_ROUNDS=12
```

### Configuration base de données

1. **Créer la base de données PostgreSQL** :
```sql
CREATE DATABASE dounie_cuisine;
CREATE USER dounie_user WITH PASSWORD 'mot_de_passe_sécurisé';
GRANT ALL PRIVILEGES ON DATABASE dounie_cuisine TO dounie_user;
```

2. **Appliquer le schéma** :
```bash
cd api/
npm run db:push
```

## Installation en développement

### 1. Installation de l'API

```bash
cd api/
npm install
npm run db:push  # Créer les tables
npm run dev      # Démarrer en mode développement
```

L'API sera disponible sur `http://localhost:5000`

### 2. Installation de l'administration

```bash
cd administration/
npm install
npm run dev      # Démarrer en mode développement
```

L'interface d'administration sera disponible sur `http://localhost:5173`

### 3. Installation du site public

```bash
cd public/
npm install
npm run dev      # Démarrer en mode développement
```

Le site public sera disponible sur `http://localhost:5174`

## Déploiement en production

### Configuration serveur de production

#### 1. Préparer le serveur
```bash
# Installer Node.js (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installer PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Installer PM2 pour la gestion des processus
sudo npm install -g pm2
```

#### 2. Configuration PostgreSQL production
```bash
sudo -u postgres psql
CREATE DATABASE dounie_cuisine_prod;
CREATE USER dounie_prod WITH PASSWORD 'mot_de_passe_très_sécurisé';
GRANT ALL PRIVILEGES ON DATABASE dounie_cuisine_prod TO dounie_prod;
\q
```

#### 3. Configuration des fichiers de production

**api/ecosystem.config.js** :
```javascript
module.exports = {
  apps: [{
    name: 'dounie-api',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
```

### Build et déploiement

#### 1. Build de l'API
```bash
cd api/
npm install --production
npm run build
```

#### 2. Build de l'administration
```bash
cd administration/
npm install
npm run build
# Les fichiers sont générés dans dist/
```

#### 3. Build du site public
```bash
cd public/
npm install
npm run build
# Les fichiers sont générés dans dist/
```

### Configuration Nginx

**Configuration pour servir les 3 applications** :

```nginx
# /etc/nginx/sites-available/dounie-cuisine
server {
    listen 80;
    server_name votre-domaine.com;

    # Redirection HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name votre-domaine.com;

    # Certificats SSL
    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/private.key;

    # Site public (racine)
    location / {
        root /var/www/dounie-cuisine/public/dist;
        try_files $uri $uri/ /index.html;
        
        # Headers de sécurité
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
    }

    # Interface d'administration
    location /admin {
        alias /var/www/dounie-cuisine/administration/dist;
        try_files $uri $uri/ /index.html;
        
        # Authentification supplémentaire possible
        # auth_basic "Administration";
        # auth_basic_user_file /etc/nginx/.htpasswd;
    }

    # API Backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Fichiers statiques avec cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Démarrage des services

#### 1. Démarrer l'API avec PM2
```bash
cd api/
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 2. Activer Nginx
```bash
sudo ln -s /etc/nginx/sites-available/dounie-cuisine /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Surveillance et maintenance

### Monitoring avec PM2
```bash
# Voir le statut des processus
pm2 status

# Voir les logs en temps réel
pm2 logs

# Redémarrer l'application
pm2 restart dounie-api

# Voir les métriques
pm2 monit
```

### Logs système
```bash
# Logs API
tail -f /var/www/dounie-cuisine/api/logs/combined.log

# Logs Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Logs PostgreSQL
tail -f /var/log/postgresql/postgresql-14-main.log
```

### Sauvegardes automatiques

**Script de sauvegarde quotidienne** (`/etc/cron.daily/dounie-backup`) :
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/dounie-cuisine"

# Créer le dossier de sauvegarde
mkdir -p $BACKUP_DIR

# Sauvegarde base de données
pg_dump -h localhost -U dounie_prod dounie_cuisine_prod > $BACKUP_DIR/db_$DATE.sql

# Sauvegarde fichiers application
tar -czf $BACKUP_DIR/app_$DATE.tar.gz /var/www/dounie-cuisine

# Nettoyer les anciennes sauvegardes (garder 30 jours)
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

# Envoyer notification
echo "Sauvegarde Dounie Cuisine terminée - $DATE" | mail -s "Backup Status" admin@votre-domaine.com
```

### Mises à jour

#### Procédure de mise à jour
1. **Tester en développement** d'abord
2. **Sauvegarder** la base de données et les fichiers
3. **Mettre à jour le code** :
```bash
cd /var/www/dounie-cuisine
git pull origin main
```

4. **Rebuild les applications** :
```bash
cd api && npm install && npm run build
cd ../administration && npm install && npm run build
cd ../public && npm install && npm run build
```

5. **Redémarrer les services** :
```bash
pm2 restart dounie-api
sudo systemctl reload nginx
```

### Configuration SSL/HTTPS

#### Avec Certbot (Let's Encrypt)
```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx

# Obtenir le certificat
sudo certbot --nginx -d votre-domaine.com

# Renouvellement automatique
sudo crontab -e
# Ajouter : 0 12 * * * /usr/bin/certbot renew --quiet
```

## Sécurité en production

### Firewall
```bash
# UFW (Ubuntu)
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

### Configuration sécurisée PostgreSQL
```bash
# Éditer postgresql.conf
sudo nano /etc/postgresql/14/main/postgresql.conf

# Modifier :
listen_addresses = 'localhost'
ssl = on

# Éditer pg_hba.conf pour restrictions d'accès
sudo nano /etc/postgresql/14/main/pg_hba.conf
```

### Headers de sécurité
Les headers de sécurité sont configurés dans Nginx pour :
- Protection XSS
- Protection contre le clickjacking
- Politique de référent sécurisée
- Protection MIME sniffing

## Résolution de problèmes

### Problèmes courants

#### API ne démarre pas
1. Vérifier les variables d'environnement
2. Tester la connexion base de données
3. Examiner les logs PM2

#### Interface d'administration inaccessible
1. Vérifier la configuration Nginx
2. S'assurer que les fichiers sont buildés
3. Vérifier les permissions fichiers

#### Base de données lente
1. Analyser les requêtes lentes
2. Optimiser les index
3. Ajuster la configuration PostgreSQL

### Commandes de diagnostic
```bash
# Tester l'API
curl -I http://localhost:5000/api/health

# Vérifier l'espace disque
df -h

# Vérifier la mémoire
free -h

# Vérifier les processus
top
```

Ce manuel couvre tous les aspects du déploiement pour assurer une installation robuste et sécurisée de Dounie Cuisine en production.
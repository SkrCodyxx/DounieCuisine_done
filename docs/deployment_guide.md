# Guide de Déploiement Dounie Cuisine

Ce document décrit les étapes recommandées pour déployer l'application Dounie Cuisine en environnement de production.

## Prérequis Serveur

*   Un serveur Linux (Ubuntu 20.04+ ou Debian 11+ recommandé).
*   Accès root ou sudo.
*   Node.js version LTS (ex: 18.x, 20.x).
*   npm ou yarn.
*   PostgreSQL (version 14+).
*   Nginx (ou un autre reverse proxy/serveur web).
*   PM2 (ou Supervisor) pour la gestion des processus Node.js.
*   Git.
*   (Optionnel mais recommandé) Certbot pour la gestion des certificats SSL Let's Encrypt.

## 1. Configuration Initiale du Serveur

1.  **Mettre à jour le système**:
    ```bash
    sudo apt update && sudo apt upgrade -y
    ```
2.  **Installer les dépendances de base**:
    ```bash
    sudo apt install -y curl wget git build-essential nginx nodejs npm postgresql postgresql-contrib pm2
    ```
    *Note : Pour Node.js, vous pourriez préférer utiliser NVM (Node Version Manager) pour installer une version spécifique.*
3.  **Configurer le pare-feu (UFW)**:
    ```bash
    sudo ufw allow OpenSSH
    sudo ufw allow 'Nginx Full' # Autorise HTTP et HTTPS
    # Si votre API et WebSocket sont sur des ports différents et non proxyfiés par Nginx sur 80/443 :
    # sudo ufw allow 5000/tcp # Exemple pour l'API/WebSocket sur le port 5000
    sudo ufw enable
    ```

## 2. Configuration de la Base de Données PostgreSQL

1.  **Sécuriser PostgreSQL et créer un utilisateur/base de données pour l'application** (si pas déjà fait) :
    ```bash
    sudo -u postgres psql
    ```
    Dans psql :
    ```sql
    CREATE USER dounie_prod_user WITH PASSWORD 'MOT_DE_PASSE_SOLIDE_PROD';
    CREATE DATABASE dounie_cuisine_prod OWNER dounie_prod_user;
    ALTER USER dounie_prod_user CREATEDB; -- Optionnel, si l'utilisateur doit pouvoir créer des DB (utile pour certains outils de migration)
    \q
    ```
2.  Assurez-vous que PostgreSQL accepte les connexions de votre application (généralement configuré dans `pg_hba.conf` et `postgresql.conf` si l'API n'est pas sur le même serveur que la DB). Pour une configuration locale, c'est souvent déjà correct.

## 3. Déploiement de l'API Backend (`api/`)

1.  **Cloner le projet sur le serveur** (si pas déjà fait) :
    ```bash
    git clone <URL_DU_REPOSITORY_GIT> /var/www/dounie-cuisine
    cd /var/www/dounie-cuisine/api
    ```
2.  **Installer les dépendances de production**:
    ```bash
    npm install --production
    # IMPORTANT : Installer la dépendance WebSocket si ce n'est pas déjà dans package.json
    # npm install ws --production
    ```
3.  **Configurer les variables d'environnement**:
    Créez un fichier `.env` dans le dossier `api/` :
    ```
    DATABASE_URL=postgresql://dounie_prod_user:MOT_DE_PASSE_SOLIDE_PROD@localhost:5432/dounie_cuisine_prod
    SESSION_SECRET=VOTRE_TRES_LONGUE_ET_COMPLEXE_CLE_DE_SESSION_SECRETE_POUR_LA_PROD
    NODE_ENV=production
    PORT=5000 # Ou un autre port si Nginx écoute sur celui-ci
    CORS_ORIGIN_ADMIN=https://admin.votredomaine.com # URL de votre frontend admin en production
    CORS_ORIGIN_PUBLIC=https://votredomaine.com   # URL de votre frontend public en production
    WEBSOCKET_PORT=5000 # Assurez-vous que Nginx peut proxyfier les connexions WebSocket vers ce port
    ```
    Sécurisez ce fichier `.env` (permissions restrictives).
4.  **Builder l'application TypeScript**:
    ```bash
    npm run build
    ```
5.  **Appliquer les migrations/schéma à la base de données de production**:
    (La commande exacte dépend de l'outil de migration utilisé, ex: Drizzle Migrate)
    ```bash
    npm run db:push # Ou la commande de migration appropriée pour la production
    ```
6.  **Configurer PM2 pour gérer l'application API**:
    Créez un fichier de configuration pour PM2 (par exemple, `ecosystem.config.js`) dans le dossier `api/` (voir exemple dans `api/README.md` ou ci-dessous).
    Exemple simplifié `ecosystem.config.js`:
    ```javascript
    module.exports = {
      apps : [{
        name   : "dounie-api",
        script : "./dist/index.js", // Chemin vers le point d'entrée buildé
        instances: "1", // Ou 'max' pour utiliser tous les cœurs CPU disponibles
        exec_mode: "cluster", // Si instances > 1
        env_production: {
           NODE_ENV: "production",
           // D'autres variables spécifiques à PM2 peuvent être ajoutées ici
        }
      }]
    }
    ```
    Démarrez avec PM2 :
    ```bash
    pm2 start ecosystem.config.js --env production
    pm2 startup # Pour que PM2 redémarre automatiquement au boot du serveur
    pm2 save
    ```

## 4. Déploiement des Frontends (`administration/` et `public/`)

Pour chaque application frontend (répétez pour `administration` et `public`) :

1.  **Navigation et Installation des Dépendances**:
    ```bash
    cd /var/www/dounie-cuisine/public # ou administration
    npm install
    ```
2.  **Configurer les variables d'environnement**:
    Créez un fichier `.env.production` (ou `.env.local` si Vite le prend en compte pour le build de prod) :
    *   `VITE_API_URL=https://votredomaine.com/api` (URL publique de votre API via Nginx)
    *   `VITE_WS_URL=wss://votredomaine.com` (URL publique de votre WebSocket via Nginx, en `wss` sécurisé)
3.  **Builder l'application**:
    ```bash
    npm run build
    ```
    Les fichiers statiques seront générés dans le dossier `dist/` de chaque application.

## 5. Configuration de Nginx

Nginx servira de reverse proxy pour l'API et servira les fichiers statiques des frontends.

Créez une configuration de serveur Nginx (par exemple, dans `/etc/nginx/sites-available/dounie-cuisine`):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name votredomaine.com admin.votredomaine.com; # Adaptez avec vos domaines/sous-domaines

    # Redirection HTTP vers HTTPS (si SSL est configuré)
    # location / {
    #    return 301 https://$host$request_uri;
    # }

    # Pour la configuration SSL avec Certbot, voir section 6.
}

# Exemple de configuration pour HTTPS (après avoir obtenu les certificats SSL)
# server {
#     listen 443 ssl http2;
#     listen [::]:443 ssl http2;
#     server_name votredomaine.com;

#     ssl_certificate /etc/letsencrypt/live/votredomaine.com/fullchain.pem;
#     ssl_certificate_key /etc/letsencrypt/live/votredomaine.com/privkey.pem;
#     include /etc/letsencrypt/options-ssl-nginx.conf;
#     ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

#     root /var/www/dounie-cuisine/public/dist; # Pour le site public
#     index index.html;

#     location / {
#         try_files $uri $uri/ /index.html; # Pour le routage SPA React
#     }

#     location /api {
#         proxy_pass http://localhost:5000; # Port de votre API Node.js
#         proxy_http_version 1.1;
#         proxy_set_header Upgrade $http_upgrade;
#         proxy_set_header Connection 'upgrade';
#         proxy_set_header Host $host;
#         proxy_cache_bypass $http_upgrade;
#         proxy_set_header X-Real-IP $remote_addr;
#         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
#         proxy_set_header X-Forwarded-Proto $scheme;
#     }

#     # Configuration pour WebSocket (si l'API est sur /ws ou un sous-chemin de /api)
#     # Assurez-vous que le chemin correspond à ce que le client WebSocket essaie de joindre
#     location /ws { # Ou par exemple /api/ws si le serveur WS est sur un sous-chemin
#         proxy_pass http://localhost:5000; # Même port que l'API si le serveur WS y est attaché
#         proxy_http_version 1.1;
#         proxy_set_header Upgrade $http_upgrade;
#         proxy_set_header Connection "upgrade";
#         proxy_set_header Host $host;
#     }
# }

# server {
#     listen 443 ssl http2;
#     listen [::]:443 ssl http2;
#     server_name admin.votredomaine.com;

#     ssl_certificate /etc/letsencrypt/live/admin.votredomaine.com/fullchain.pem; # Ou utilisez le même cert si wildcard/SAN
#     ssl_certificate_key /etc/letsencrypt/live/admin.votredomaine.com/privkey.pem;
#     # ... autres directives SSL

#     root /var/www/dounie-cuisine/administration/dist; # Pour l'admin
#     index index.html;

#     location / {
#         try_files $uri $uri/ /index.html; # Pour le routage SPA React
#     }

#     # La location /api pour l'admin pointera vers la même API backend
#     location /api {
#         proxy_pass http://localhost:5000;
#         # ... mêmes directives proxy que pour le site public
#     }
# }
```

Activez le site et testez la configuration Nginx :
```bash
sudo ln -s /etc/nginx/sites-available/dounie-cuisine /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 6. Configuration SSL avec Let's Encrypt (Recommandé)

1.  **Installer Certbot**:
    ```bash
    sudo apt install certbot python3-certbot-nginx
    ```
2.  **Obtenir et installer les certificats**:
    Assurez-vous que vos enregistrements DNS pointent correctement vers votre serveur.
    ```bash
    sudo certbot --nginx -d votredomaine.com -d admin.votredomaine.com # Ajoutez tous les domaines/sous-domaines
    ```
    Suivez les instructions. Certbot modifiera automatiquement votre configuration Nginx pour HTTPS.
3.  **Configurer le renouvellement automatique**:
    Certbot configure généralement un cronjob ou un timer systemd pour le renouvellement. Testez-le :
    ```bash
    sudo certbot renew --dry-run
    ```

## 7. Finalisation et Tests

*   Accédez à vos domaines/sous-domaines en HTTPS.
*   Testez toutes les fonctionnalités clés des applications (inscription, connexion, fonctionnalités admin, etc.).
*   Vérifiez les logs de PM2 (`pm2 logs dounie-api`) et Nginx (`/var/log/nginx/`) pour toute erreur.
*   Assurez-vous que les WebSockets fonctionnent correctement si la messagerie est active (vérifiez la console du navigateur pour les erreurs de connexion `wss://`).

## 8. Sauvegardes

Configurez des sauvegardes régulières pour votre base de données PostgreSQL et pour les fichiers de votre application (notamment les fichiers uploadés s'il y en a, et les configurations).
Exemple de sauvegarde PostgreSQL :
```bash
pg_dump -U dounie_prod_user -d dounie_cuisine_prod -F c -b -v -f /chemin/vers/backup/dounie_backup_$(date +%Y%m%d_%H%M%S).dump
```
Automatisez cela avec un script et cron.

## 9. Monitoring

Utilisez les outils de PM2 (`pm2 monit`) pour un monitoring de base de l'API. Pour un monitoring plus avancé, envisagez des solutions comme Prometheus/Grafana, Datadog, ou Sentry pour le suivi des erreurs.

Ce guide est une base. Adaptez-le à votre environnement spécifique et à vos besoins de sécurité et de performance.

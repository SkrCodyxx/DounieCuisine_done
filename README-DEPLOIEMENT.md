# 🍽️ Dounie Cuisine - Guide de Déploiement Complet

## Vue d'ensemble du Projet

**Dounie Cuisine** est un système complet de **service traiteur et organisation d'événements** haïtiens comprenant :

- 🍽️ **Service Traiteur Professionnel** avec livraison
- 🎵 **Services DJ et Animation Musicale**  
- 🎉 **Organisation Complète d'Événements**
- 👥 **Équipe de Service Dédiée**
- 📱 **Système de Gestion Complet**

## Architecture du Système

```
dounie-cuisine/
├── 🌐 public/              # Application publique clients (React + Vite)
├── ⚙️  administration/      # Interface d'administration staff (React + Vite)
├── 🔗 api/                 # Backend API (Express.js + PostgreSQL)
├── 📜 scripts/             # Scripts d'installation et déploiement
├── 📋 deploy-vps.sh        # Script de déploiement VPS principal
└── 📖 README-DEPLOIEMENT.md # Ce guide
```

## 🚀 Déploiement sur VPS (Production)

### Prérequis

- **VPS Ubuntu 20.04+ ou Debian 11+**
- **Accès root SSH**
- **Nom de domaine pointé vers le VPS** (optionnel)
- **2GB+ RAM, 20GB+ stockage**

### Installation Automatique

```bash
# 1. Copier le projet sur le VPS
scp -r dounie-cuisine/ root@votre-vps:/var/www/html/

# 2. Se connecter au VPS  
ssh root@votre-vps

# 3. Aller dans le répertoire
cd /var/www/html/dounie-cuisine

# 4. Rendre le script exécutable
chmod +x deploy-vps.sh

# 5. Lancer le déploiement (remplacer par votre domaine)
./deploy-vps.sh votre-domaine.com
```

### Ce que fait le script automatiquement

✅ **Installation système :**
- Node.js 20.x
- PostgreSQL 15
- Nginx
- PM2 (gestionnaire de processus)
- UFW Firewall

✅ **Configuration base de données :**
- Création DB `dounie_cuisine`
- Utilisateur `dounie_user` sécurisé
- Migrations automatiques

✅ **Build et déploiement :**
- Installation dépendances
- Build production optimisé
- Configuration environnements

✅ **Configuration web :**
- Nginx avec compression Gzip
- Proxy API automatique
- Cache fichiers statiques
- Sécurité headers

✅ **Services et monitoring :**
- PM2 cluster mode
- Health checks automatiques
- Logs centralisés
- Sauvegardes quotidiennes
- Firewall configuré

## 🛠️ Développement Local

### Setup Rapide

```bash
# 1. Cloner et aller dans le projet
cd dounie-cuisine

# 2. Script de setup automatique
chmod +x scripts/quick-setup.sh
./scripts/quick-setup.sh

# 3. Démarrer en développement
./start-dev.sh
```

### URLs de Développement

- **Site Public :** http://localhost:3000
- **Administration :** http://localhost:3001  
- **API :** http://localhost:5000

### Comptes de Test

**Administration :**
- **Admin :** `admin` / `admin123`
- **Manager :** `lucie.manager` / `staff123`
- **Staff :** `marc.staff` / `staff123`

**Clients :**
- **Client :** `marie.delorme` / `client123`

## 🌐 URLs de Production

Après déploiement, votre site sera accessible via :

- **🌐 Site Public :** `http://votre-domaine.com`
- **⚙️ Administration :** `http://votre-domaine.com/admin`
- **🔗 API :** `http://votre-domaine.com/api`

## 🔧 Gestion du Système

### Commandes PM2 (Gestion des services)

```bash
# Statut des services
pm2 status

# Logs en temps réel
pm2 logs dounie-api

# Redémarrer l'API
pm2 restart dounie-api

# Monitoring en temps réel
pm2 monit
```

### Commandes Nginx

```bash
# Statut Nginx
systemctl status nginx

# Redémarrer Nginx
systemctl restart nginx

# Recharger configuration
nginx -s reload

# Tester configuration
nginx -t
```

### Logs Importantes

```bash
# Logs application
tail -f /var/log/dounie-cuisine/api-combined.log

# Logs Nginx
tail -f /var/log/nginx/dounie-cuisine.access.log
tail -f /var/log/nginx/dounie-cuisine.error.log

# Logs PostgreSQL
tail -f /var/log/postgresql/postgresql-15-main.log
```

## 🔒 Configuration SSL (HTTPS)

```bash
# Installer Certbot
apt install certbot python3-certbot-nginx

# Obtenir certificat SSL gratuit
certbot --nginx -d votre-domaine.com -d www.votre-domaine.com

# Renouvellement automatique (déjà configuré)
crontab -l | grep certbot
```

## 💾 Sauvegardes

### Sauvegardes Automatiques

Le système créé automatiquement :
- **Sauvegarde quotidienne** de la base de données
- **Sauvegarde quotidienne** des fichiers application
- **Rétention 30 jours**
- **Emplacement :** `/backup/dounie-cuisine/`

### Sauvegarde Manuelle

```bash
# Sauvegarde DB
pg_dump -h localhost -U dounie_user dounie_cuisine > backup_$(date +%Y%m%d).sql

# Sauvegarde fichiers
tar -czf backup_app_$(date +%Y%m%d).tar.gz /var/www/html/dounie-cuisine
```

### Restauration

```bash
# Restaurer DB
psql -h localhost -U dounie_user dounie_cuisine < backup_YYYYMMDD.sql

# Restaurer fichiers
tar -xzf backup_app_YYYYMMDD.tar.gz -C /
```

## 📊 Administration du Contenu

L'interface d'administration permet de gérer **TOUT le contenu** :

### Paramètres Généraux
- ✅ Informations entreprise
- ✅ Heures d'ouverture
- ✅ Coordonnées et adresses

### Contenu Dynamique
- ✅ **Bannières et annonces** promotionnelles
- ✅ **Textes du site** (titres, descriptions, CTA)
- ✅ **Menu traiteur** avec photos et prix
- ✅ **Galerie d'événements** avec albums photos
- ✅ **Logos et branding** (upload images)

### Gestion d'Événements
- ✅ **Réservations d'événements** en temps réel
- ✅ **Commandes traiteur** et suivi
- ✅ **Calendrier** des événements à venir
- ✅ **Gestion du personnel** et des rôles

## 🚨 Résolution de Problèmes

### L'API ne démarre pas

```bash
# Vérifier les logs
pm2 logs dounie-api

# Vérifier la DB
systemctl status postgresql

# Redémarrer tout
pm2 restart dounie-api
systemctl restart postgresql
```

### Site web inaccessible

```bash
# Vérifier Nginx
nginx -t
systemctl status nginx

# Vérifier les permissions
ls -la /var/www/html/dounie-cuisine/

# Redémarrer Nginx
systemctl restart nginx
```

### Base de données corrompue

```bash
# Vérifier PostgreSQL
sudo -u postgres psql -c "\l"

# Restaurer depuis sauvegarde
psql -h localhost -U dounie_user dounie_cuisine < /backup/dounie-cuisine/db_latest.sql
```

## 🔄 Mises à Jour

### Déployer une Nouvelle Version

```bash
# 1. Sauvegarder l'actuel
cp -r /var/www/html/dounie-cuisine /backup/dounie-cuisine/backup-$(date +%Y%m%d)

# 2. Copier nouveau code
scp -r nouvelle-version/ root@vps:/var/www/html/dounie-cuisine/

# 3. Rebuild et redémarrer
cd /var/www/html/dounie-cuisine
./deploy-vps.sh votre-domaine.com
```

## 📈 Optimisations Performance

### Configuration Avancée Nginx

```nginx
# Dans /etc/nginx/sites-available/dounie-cuisine

# Cache statique
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Compression
gzip on;
gzip_comp_level 6;
gzip_types text/css application/javascript;
```

### Monitoring Avancé

```bash
# Installer htop pour monitoring
apt install htop

# Surveiller les ressources
htop

# Surveiller la DB
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"
```

## 🆘 Support et Contacts

### Logs de Debug

```bash
# Activer mode debug
echo "NODE_ENV=development" >> /var/www/html/dounie-cuisine/api/.env
pm2 restart dounie-api

# Logs détaillés
pm2 logs dounie-api --lines 100
```

### Health Checks

Le système inclut des health checks automatiques toutes les 5 minutes :
- **API disponibilité**
- **Nginx statut**  
- **PostgreSQL connexion**
- **Redémarrage automatique** en cas de problème

---

## 🎉 Félicitations !

Votre système **Dounie Cuisine** est maintenant déployé et opérationnel !

**Prochaines étapes recommandées :**

1. ✅ **Personnaliser le contenu** via l'interface admin
2. ✅ **Ajouter vos vraies photos** de plats et événements  
3. ✅ **Configurer SSL** avec votre domaine
4. ✅ **Tester toutes les fonctionnalités** de réservation
5. ✅ **Former votre équipe** à l'utilisation de l'administration

**Bon travail ! Votre service traiteur haïtien est prêt à conquérir le marché ! 🍽️🎉**
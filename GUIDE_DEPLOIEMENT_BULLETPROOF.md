# 🍽️ GUIDE DE DÉPLOIEMENT BULLETPROOF - DOUNIE CUISINE

## 📋 Vue d'ensemble

Ce guide vous permettra de déployer **Dounie Cuisine** avec une **architecture double backend sécurisée** sur n'importe quel serveur VPS/Debian de manière **100% fonctionnelle**.

### 🏗️ Architecture Déployée

```
┌─────────────────────────────────────────────────────────────┐
│                    DOUNIE CUISINE v2.0                     │
│                Architecture Double Backend                  │
├─────────────────────────────────────────────────────────────┤
│  🌐 Nginx (Reverse Proxy + SSL Ready)                      │
│     ├── 📱 App Publique (React + Vite) → Port 80          │
│     ├── ⚙️  Interface Admin (React) → /admin               │
│     ├── 📱 Frontend Alt (React) → /app                     │
│     ├── 🔵 API Express.js → /api (Port 5000)              │
│     └── 🟠 API FastAPI → /api/v2 (Port 8001)              │
├─────────────────────────────────────────────────────────────┤
│  🗄️ Bases de Données Doubles                               │
│     ├── PostgreSQL (API Express.js)                        │
│     └── MongoDB (Backend FastAPI)                          │
├─────────────────────────────────────────────────────────────┤
│  ⚙️ Gestion des Processus                                   │
│     ├── Supervisor (Backend + Frontend)                    │
│     └── Monitoring Auto + Sauvegardes                      │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 DÉPLOIEMENT EN 3 ÉTAPES

### ÉTAPE 1: Préparation du Serveur

```bash
# 1. Connectez-vous à votre VPS en tant que root
ssh root@votre-serveur

# 2. Créer le répertoire de destination
mkdir -p /var/www/html

# 3. Se placer dans le répertoire
cd /var/www/html
```

### ÉTAPE 2: Récupération et Déploiement

```bash
# Option A: Si vous avez déjà les fichiers localement
# Copiez tout le contenu de votre projet dans /var/www/html/

# Option B: Le script clonera automatiquement depuis GitHub
# si l'arborescence n'est pas complète

# 4. Télécharger le script de déploiement master
wget https://raw.githubusercontent.com/SkrCodyxx/DounieCuisine_done/main/deploy-vps-master.sh

# 5. Rendre le script exécutable
chmod +x deploy-vps-master.sh

# 6. Lancer le déploiement automatique
sudo ./deploy-vps-master.sh
```

### ÉTAPE 3: Validation du Déploiement

```bash
# 7. Tester automatiquement tout le système
wget https://raw.githubusercontent.com/SkrCodyxx/DounieCuisine_done/main/test-complete-system.sh
chmod +x test-complete-system.sh
sudo ./test-complete-system.sh
```

## 🎯 URLs D'ACCÈS APRÈS DÉPLOIEMENT

Une fois le déploiement terminé, votre système sera accessible via :

| Service | URL | Description |
|---------|-----|-------------|
| **🌍 Site Public** | `http://votre-ip` | Application principale (React + Vite) |
| **⚙️ Administration** | `http://votre-ip/admin` | Interface d'administration |
| **📱 App Alternative** | `http://votre-ip/app` | Frontend React alternatif |
| **🔵 API Express** | `http://votre-ip/api` | API principal (Express.js + TypeScript) |
| **🟠 API FastAPI** | `http://votre-ip/api/v2` | API alternatif (FastAPI + Python) |
| **💬 WebSocket** | `ws://votre-ip/ws` | Messagerie temps réel |

## 👥 Comptes par Défaut

### Administration
| Rôle | Nom d'utilisateur | Mot de passe | Permissions |
|------|------------------|-------------|-------------|
| **Admin** | `admin` | `admin123` | Accès complet |
| **Manager** | `lucie.manager` | `staff123` | Gestion opérationnelle |
| **Staff** | `marc.staff` | `staff123` | Consultation et mise à jour |

### Client Test
| Rôle | Nom d'utilisateur | Mot de passe |
|------|------------------|-------------|
| **Client** | `marie.delorme` | `client123` |

> ⚠️ **IMPORTANT:** Changez tous les mots de passe par défaut en production !

## 📊 FONCTIONNALITÉS AUTOMATIQUES

### ✨ Inclus dans le Déploiement

- ✅ **Monitoring automatique** (chaque minute)
- ✅ **Sauvegardes quotidiennes** (PostgreSQL + MongoDB + Fichiers)
- ✅ **Auto-redémarrage** des services en cas de panne
- ✅ **Firewall UFW** configuré automatiquement
- ✅ **Fail2ban** pour la protection SSH
- ✅ **Logs détaillés** avec rotation automatique
- ✅ **Headers de sécurité** Nginx
- ✅ **Compression Gzip** optimisée
- ✅ **SSL Ready** (configuration avec Let's Encrypt)

### 📈 Système de Monitoring

Le système génère automatiquement des rapports JSON :

```bash
# Status en temps réel
cat /var/log/dounie-cuisine/status.json

# Rapport de déploiement
cat /var/log/dounie-cuisine/deployment-final.json

# Rapport de tests
cat /var/log/dounie-cuisine/test-report.json
```

## 🔧 GESTION DU SYSTÈME

### Commandes de Base

```bash
# Voir le status de tous les services
supervisorctl status dounie-cuisine:*

# Redémarrer un service spécifique
supervisorctl restart dounie-cuisine:dounie-api
supervisorctl restart dounie-cuisine:dounie-backend
supervisorctl restart dounie-cuisine:dounie-frontend

# Redémarrer tous les services Dounie
supervisorctl restart dounie-cuisine:*

# Status des services système
systemctl status nginx postgresql mongod supervisor
```

### Logs Détaillés

```bash
# Logs des applications
tail -f /var/log/dounie-cuisine/api.out.log      # API Express.js
tail -f /var/log/dounie-cuisine/backend.out.log  # Backend FastAPI
tail -f /var/log/dounie-cuisine/frontend.out.log # Frontend React

# Logs système
tail -f /var/log/nginx/dounie-cuisine.access.log # Nginx
tail -f /var/log/dounie-cuisine/monitor.log      # Monitoring
```

### Sauvegardes

```bash
# Voir les sauvegardes disponibles
ls -la /backup/dounie-cuisine/

# Sauvegardes automatiques dans :
/backup/dounie-cuisine/db/        # Bases de données
/backup/dounie-cuisine/app/       # Application complète
/backup/dounie-cuisine/configs/   # Configurations
```

## 🆘 DÉPANNAGE ET RÉCUPÉRATION

### Script de Récupération d'Urgence

Si quelque chose ne fonctionne pas :

```bash
# Télécharger et exécuter le script de récupération
wget https://raw.githubusercontent.com/SkrCodyxx/DounieCuisine_done/main/emergency-recovery.sh
chmod +x emergency-recovery.sh
sudo ./emergency-recovery.sh
```

### Problèmes Courants et Solutions

#### 🔵 API Express.js ne démarre pas
```bash
# Vérifier les logs
tail -f /var/log/dounie-cuisine/api.err.log

# Redémarrer
supervisorctl restart dounie-cuisine:dounie-api

# Vérifier les dépendances
cd /var/www/html/dounie-cuisine/api
npm install --production
npm run build
```

#### 🟠 Backend FastAPI ne démarre pas
```bash
# Vérifier les logs
tail -f /var/log/dounie-cuisine/backend.err.log

# Redémarrer
supervisorctl restart dounie-cuisine:dounie-backend

# Vérifier les dépendances Python
cd /var/www/html/dounie-cuisine/backend
pip3 install -r requirements.txt
```

#### 🌐 Nginx erreur 502/503
```bash
# Vérifier la configuration
nginx -t

# Vérifier que les services backend sont en cours
curl http://localhost:5000/api/health
curl http://localhost:8001/api/health

# Redémarrer Nginx
systemctl restart nginx
```

#### 🗄️ Base de données inaccessible
```bash
# PostgreSQL
systemctl status postgresql
systemctl restart postgresql

# MongoDB  
systemctl status mongod
systemctl restart mongod

# Vérifier les connexions
sudo -u postgres psql -c "SELECT version();"
mongosh --eval "db.version()"
```

## 🔒 CONFIGURATION SSL (OPTIONNEL)

### Installation SSL avec Let's Encrypt

```bash
# 1. Installer Certbot
apt install -y certbot python3-certbot-nginx

# 2. Obtenir le certificat (remplacez par votre domaine)
certbot --nginx -d votre-domaine.com -d www.votre-domaine.com

# 3. Le renouvellement automatique est configuré via cron
```

### Configuration SSL Manuelle

```bash
# Modifier la configuration Nginx pour HTTPS
nano /etc/nginx/sites-available/dounie-cuisine

# Ajouter la section SSL et rediriger HTTP vers HTTPS
# Le certificat sera automatiquement intégré par Certbot
```

## 📈 OPTIMISATION DE PERFORMANCE

### Recommandations Serveur

- **RAM minimale :** 2GB (4GB recommandés)
- **Stockage :** 20GB minimum (50GB recommandés)
- **CPU :** 2 cores minimum
- **Bande passante :** Illimitée de préférence

### Optimisations Automatiques Incluses

- ✅ **Compression Gzip** pour tous les assets
- ✅ **Cache navigateur** 1 an pour fichiers statiques
- ✅ **PM2 cluster mode** pour l'API Express
- ✅ **Index de base de données** optimisés
- ✅ **Lazy loading** des images
- ✅ **Minification** des assets

## 🔄 MISES À JOUR

### Mise à Jour Automatique

```bash
# Le script de déploiement peut être relancé pour les mises à jour
cd /var/www/html
./deploy-vps-master.sh

# Il reprendra automatiquement depuis le dernier checkpoint en cas d'interruption
```

### Mise à Jour Manuelle des Composants

```bash
# Mettre à jour le code depuis GitHub
cd /var/www/html/dounie-cuisine
git pull origin main

# Réinstaller les dépendances si nécessaire
cd api && npm install --production && npm run build
cd ../frontend && yarn install && yarn build
cd ../backend && pip3 install -r requirements.txt

# Redémarrer les services
supervisorctl restart dounie-cuisine:*
```

## 🎯 VALIDATION DU DÉPLOIEMENT

### Tests Automatiques Complets

```bash
# Exécuter la suite complète de tests
./test-complete-system.sh

# Le script teste :
# ✅ Connectivité des 5 services
# ✅ Performance des APIs
# ✅ Bases de données  
# ✅ Sécurité
# ✅ Monitoring
# ✅ Sauvegardes
# ✅ Configuration système
```

### Tests Manuels de Validation

1. **Accéder à toutes les URLs** listées ci-dessus
2. **Se connecter avec les comptes par défaut**
3. **Tester la messagerie interne** (si disponible)
4. **Vérifier les logs** sans erreurs critiques
5. **Confirmer les sauvegardes automatiques**

## 📚 RESSOURCES SUPPLÉMENTAIRES

### Emplacements Importants

```
/var/www/html/dounie-cuisine/          # Application
/var/log/dounie-cuisine/               # Logs applicatifs
/backup/dounie-cuisine/                # Sauvegardes
/etc/nginx/sites-available/dounie-cuisine  # Config Nginx
/etc/supervisor/conf.d/dounie-cuisine.conf # Config Supervisor
/root/.dounie-credentials              # Identifiants DB
```

### Commandes de Diagnostic

```bash
# Status complet du système
/usr/local/bin/dounie-monitor

# Rapport de santé détaillé
curl -s http://localhost:5000/api/health | jq
curl -s http://localhost:8001/api/health | jq

# Utilisation des ressources
htop
df -h
free -h
```

---

## 🎉 FÉLICITATIONS !

Si vous avez suivi ce guide, vous avez maintenant :

✅ **Un système de restaurant complet** opérationnel  
✅ **Architecture double backend** sécurisée  
✅ **Monitoring et sauvegardes** automatiques  
✅ **Haute disponibilité** avec auto-redémarrage  
✅ **Sécurité renforcée** avec firewall  
✅ **Performance optimisée** avec cache et compression  
✅ **SSL ready** pour la production  

**Votre système Dounie Cuisine est maintenant prêt pour la production ! 🍽️**

---

*Pour toute assistance supplémentaire, consultez les logs détaillés ou utilisez le script de récupération d'urgence.*
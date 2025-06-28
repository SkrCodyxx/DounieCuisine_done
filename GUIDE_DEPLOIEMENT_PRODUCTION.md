# 🍽️ GUIDE DE DÉPLOIEMENT PRODUCTION - DOUNIE CUISINE

## 📋 Introduction

**Dounie Cuisine** est un système complet de gestion de restaurant haïtien avec une architecture backend Node.js sécurisée. Ce guide vous permet de déployer le système en production sur n'importe quel serveur Debian/Ubuntu.

### 🏗️ Architecture Déployée

```
┌─────────────────────────────────────────────────────────────┐
│                    DOUNIE CUISINE v2.0                     │
│                 Architecture Backend Node.js                │
├─────────────────────────────────────────────────────────────┤
│  🌐 Nginx (Reverse Proxy + SSL Ready)                      │
│     ├── 📱 App Publique (React + Vite) → /                │
│     ├── ⚙️  Interface Admin (React + Vite) → /admin        │
│     └── 🔵 API Express.js → /api (Port 5000)              │
├─────────────────────────────────────────────────────────────┤
│  🗄️ Base de Données                                        │
│     └── PostgreSQL 15 (API Express.js)                    │
├─────────────────────────────────────────────────────────────┤
│  ⚙️ Services et Monitoring                                  │
│     ├── Supervisor (Gestion des processus)                │
│     ├── Monitoring automatique (1 min)                    │
│     ├── Sauvegardes quotidiennes                          │
│     └── Auto-redémarrage en cas de panne                  │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 DÉPLOIEMENT RAPIDE

### Prérequis

- **Système :** Debian 11+ ou Ubuntu 20.04+
- **Accès :** Root ou sudo
- **Ressources :** 2GB RAM minimum, 20GB stockage
- **Réseau :** Connexion internet stable

### Déploiement en 3 Étapes

#### ÉTAPE 1: Préparation du Serveur

```bash
# Connexion au serveur
ssh root@votre-serveur

# Créer le répertoire de destination
mkdir -p /var/www/html
cd /var/www/html
```

#### ÉTAPE 2: Téléchargement et Déploiement

```bash
# Cloner le projet depuis GitHub
git clone https://github.com/SkrCodyxx/DounieCuisine_done.git dounie-cuisine
cd dounie-cuisine

# OU copier vos fichiers si vous les avez localement
# cp -r /chemin/vers/vos/fichiers/* /var/www/html/dounie-cuisine/

# Lancer le déploiement automatique
sudo ./deploy-production.sh
```

#### ÉTAPE 3: Validation

Le script va automatiquement :
- ✅ Installer toutes les dépendances
- ✅ Configurer les bases de données
- ✅ Builder toutes les applications
- ✅ Configurer Nginx et les services
- ✅ Tester automatiquement le système

## 🌐 URLs d'Accès

Une fois le déploiement terminé :

| Service | URL | Description |
|---------|-----|-------------|
| **🌍 Site Public** | `http://votre-ip` | Application principale pour clients |
| **⚙️ Administration** | `http://votre-ip/admin` | Interface de gestion |
| **🔵 API Express** | `http://votre-ip/api` | API principal (TypeScript) |
| **💬 WebSocket** | `ws://votre-ip/ws` | Messagerie temps réel (via API Express) |

## 👥 Comptes par Défaut

### Administration
| Rôle | Nom d'utilisateur | Mot de passe | Permissions |
|------|------------------|-------------|-------------|
| **Admin** | `admin` | `admin123` | Accès complet |
| **Manager** | `lucie.manager` | `staff123` | Gestion opérationnelle |
| **Staff** | `marc.staff` | `staff123` | Consultation |

### Client Test
| Rôle | Nom d'utilisateur | Mot de passe |
|------|------------------|-------------|
| **Client** | `marie.delorme` | `client123` |

> ⚠️ **IMPORTANT :** Changez immédiatement tous les mots de passe en production !

## 🔧 Gestion du Système

### Commandes de Base

```bash
# Voir le statut de tous les services
supervisorctl status dounie-cuisine:*

# Redémarrer un service spécifique
supervisorctl restart dounie-cuisine:dounie-api       # API Express
# supervisorctl restart dounie-cuisine:dounie-frontend # Si frontend/ est utilisé et géré par supervisor

# Redémarrer tous les services applicatifs Dounie
supervisorctl restart dounie-cuisine:*

# Statut des services système
systemctl status nginx postgresql
```

### Logs et Monitoring

```bash
# Voir les logs en temps réel
tail -f /var/log/dounie-cuisine/api.out.log      # API Express
# tail -f /var/log/dounie-cuisine/frontend.out.log # Si frontend/ est utilisé

# Voir les erreurs
tail -f /var/log/dounie-cuisine/api.err.log
# tail -f /var/log/dounie-cuisine/frontend.err.log # Si frontend/ est utilisé

# Status système JSON
cat /var/log/dounie-cuisine/status.json

# Logs Nginx
tail -f /var/log/nginx/dounie-cuisine.access.log
tail -f /var/log/nginx/dounie-cuisine.error.log
```

### Monitoring Automatique

Le système inclut un monitoring automatique qui vérifie toutes les minutes :
- ✅ Santé de l'API Express
- ✅ Fonctionnement des frontends (public et administration)
- ✅ Statut de la base de données PostgreSQL
- ✅ Auto-redémarrage en cas de panne

```bash
# Exécuter manuellement le monitoring
/usr/local/bin/dounie-monitor

# Voir l'historique du monitoring
tail -f /var/log/dounie-cuisine/monitor.log
```

## 💾 Sauvegardes

### Sauvegardes Automatiques

Le système effectue automatiquement :
- 📅 **Quotidiennes** à 3h du matin
- 🗄️ **PostgreSQL** : export SQL complet
- 📁 **Application** : archive tar.gz (contenant les builds des frontends et l'API)
- ⚙️ **Configurations** : sauvegarde des configs Nginx et Supervisor

### Emplacements des Sauvegardes

```bash
/backup/dounie-cuisine/
├── db/           # Sauvegardes base de données
│   └── postgresql_YYYYMMDD_HHMMSS.sql
├── app/          # Sauvegardes application
│   └── app_YYYYMMDD_HHMMSS.tar.gz
└── configs/      # Sauvegardes configurations
    └── config_YYYYMMDD_HHMMSS.tar.gz
```

### Restauration Manuelle

```bash
# Restaurer PostgreSQL
sudo -u postgres psql -d dounie_cuisine < /backup/dounie-cuisine/db/postgresql_YYYYMMDD_HHMMSS.sql

# Restaurer l'application
tar -xzf /backup/dounie-cuisine/app/app_YYYYMMDD_HHMMSS.tar.gz -C /var/www/html/dounie-cuisine # Adapter le chemin de restauration
supervisorctl restart dounie-cuisine:*
```

## 🔒 Configuration SSL

### SSL Automatique avec Let's Encrypt

```bash
# Installer Certbot
apt install -y certbot python3-certbot-nginx

# Obtenir le certificat SSL (remplacez par votre domaine)
certbot --nginx -d votre-domaine.com -d www.votre-domaine.com

# Le renouvellement automatique est configuré via cron
```

### Vérification SSL

```bash
# Vérifier le certificat
certbot certificates

# Test de renouvellement
certbot renew --dry-run
```

## 🛡️ Sécurité

### Firewall Configuré Automatiquement

Le script configure automatiquement :
- ✅ **UFW** : Firewall avec règles sécurisées
- ✅ **Fail2ban** : Protection contre les attaques brute force
- ✅ **Headers sécurité** : Protection XSS, CSRF, etc.

```bash
# Voir le statut du firewall
ufw status verbose

# Voir les tentatives d'intrusion bloquées
fail2ban-client status
```

### Bonnes Pratiques de Sécurité

1. **Changez les mots de passe par défaut**
2. **Configurez SSL/TLS**
3. **Mettez à jour régulièrement le système**
4. **Surveillez les logs d'accès**
5. **Limitez l'accès SSH par clé**

## 🔄 Mises à Jour

### Mise à Jour du Code

```bash
# Aller dans le répertoire du projet
cd /var/www/html/dounie-cuisine

# Sauvegarder avant mise à jour
cp -r . /backup/dounie-cuisine/backup-before-update-$(date +%Y%m%d)

# Mettre à jour depuis GitHub
git pull origin main

# Réinstaller les dépendances si nécessaire
cd api && npm install --production
cd ../frontend && yarn install && yarn build
cd ../public && npm install && npm run build
cd ../administration && npm install && npm run build

# Redémarrer les services
supervisorctl restart dounie-cuisine:*
```

### Mise à Jour Système

```bash
# Mettre à jour le système
apt update && apt upgrade -y

# Redémarrer si nécessaire
reboot
```

## 🆘 Dépannage

### Problèmes Courants

#### API Express ne démarre pas
```bash
# Vérifier les logs
tail -f /var/log/dounie-cuisine/api.err.log

# Vérifier les dépendances
cd /var/www/html/dounie-cuisine/api
npm install --production
npm run build

# Redémarrer
supervisorctl restart dounie-cuisine:dounie-api
```

#### Backend FastAPI ne démarre pas
```bash
# Vérifier les logs
tail -f /var/log/dounie-cuisine/backend.err.log

# Vérifier les dépendances Python
# cd /var/www/html/dounie-cuisine/backend # Supprimé
# pip3 install --break-system-packages -r requirements.txt # Supprimé

# Redémarrer
# supervisorctl restart dounie-cuisine:dounie-backend # Supprimé
```

#### Frontends ne se chargent pas (public ou admin)
```bash
# Vérifier les builds
cd /var/www/html/dounie-cuisine/public && npm run build
cd /var/www/html/dounie-cuisine/administration && npm run build
# cd /var/www/html/dounie-cuisine/frontend && yarn build # Supprimé si frontend/ est supprimé

# Vérifier Nginx
nginx -t
systemctl reload nginx

# Redémarrer les services applicatifs si nécessaire (gérés par Nginx pour servir les statiques)
# supervisorctl restart dounie-cuisine:dounie-frontend # Supprimé si frontend/ est géré par Nginx
```

#### Base de données PostgreSQL inaccessible
```bash
# PostgreSQL
systemctl status postgresql
systemctl restart postgresql

# Vérifier les connexions
sudo -u postgres psql -c "SELECT version();"
```

### Diagnostic Complet

```bash
# Vérifier tous les services
supervisorctl status dounie-cuisine:dounie-api # Ajusté pour refléter les services restants
systemctl status nginx postgresql

# Tester la connectivité
curl http://localhost:5000/api/health
curl http://localhost/ # Teste Nginx et l'app publique
curl http://localhost/admin # Teste Nginx et l'app admin

# Vérifier l'utilisation des ressources
htop
df -h
free -h
```

## 📈 Performance

### Optimisations Incluses

- ✅ **Compression Gzip** pour tous les assets
- ✅ **Cache navigateur** optimisé
- ✅ **Headers de performance**
- ✅ **Timeout configurés**
- ✅ **Monitoring des ressources**

### Métriques de Performance

```bash
# Temps de réponse API
curl -o /dev/null -s -w "%{time_total}" http://localhost:5000/api/health

# Utilisation mémoire
free -h

# Utilisation disque
df -h

# Charge système
uptime
```

### Recommandations Serveur

- **RAM :** 2GB minimum, 4GB recommandé
- **CPU :** 2 cores minimum
- **Stockage :** 20GB minimum, SSD recommandé
- **Réseau :** Bande passante illimitée

## 📊 Monitoring Avancé

### Métriques Disponibles

Le système génère automatiquement :
- 📊 **Status JSON** : État en temps réel
- 📈 **Logs détaillés** : Historique complet
- 🔍 **Health checks** : Vérifications automatiques
- 📱 **Alertes** : Notifications en cas de problème

### Tableau de Bord

```bash
# Status en temps réel
watch -n 5 'cat /var/log/dounie-cuisine/status.json | jq'

# Surveillance continue
tail -f /var/log/dounie-cuisine/monitor.log
```

## 🌍 Accès à Distance

### Configuration pour Domaine

```bash
# Modifier la configuration Nginx pour votre domaine
nano /etc/nginx/sites-available/dounie-cuisine

# Remplacer "server_name _;" par "server_name votre-domaine.com www.votre-domaine.com;"
# Puis recharger Nginx
nginx -t && systemctl reload nginx
```

### DNS et Domaine

1. **Pointer votre domaine** vers l'IP du serveur
2. **Configurer SSL** avec Let's Encrypt
3. **Tester l'accès** via le domaine

## 📚 Ressources Supplémentaires

### Fichiers de Configuration Importants

```
/var/www/html/dounie-cuisine/           # Application
/etc/nginx/sites-available/dounie-cuisine  # Config Nginx
/etc/supervisor/conf.d/dounie-cuisine.conf # Config Supervisor
/root/.dounie-credentials               # Identifiants DB
/var/log/dounie-cuisine/               # Logs application
/backup/dounie-cuisine/                # Sauvegardes
```

### Commandes de Maintenance

```bash
# Redémarrage complet
supervisorctl restart dounie-cuisine:*
systemctl restart nginx

# Nettoyage des logs
find /var/log/dounie-cuisine/ -name "*.log" -mtime +7 -delete

# Vérification de l'espace disque
df -h
du -sh /var/www/html/dounie-cuisine/

# Sauvegarde manuelle
/etc/cron.daily/dounie-backup
```

## 🎯 Support et Contact

### En cas de Problème

1. **Consultez les logs** détaillés
2. **Vérifiez le status** des services
3. **Testez la connectivité** des APIs
4. **Consultez ce guide** de dépannage

### Informations Système

```bash
# Version système
lsb_release -a

# Versions des services
node --version
nginx -v
psql --version
```

---

## 🎉 Félicitations !

Si vous avez suivi ce guide, vous avez maintenant :

✅ **Un système de restaurant complet** opérationnel  
✅ **Architecture backend Node.js** sécurisée
✅ **Monitoring et sauvegardes** automatiques  
✅ **Haute disponibilité** avec auto-redémarrage  
✅ **Sécurité renforcée** avec firewall  
✅ **Performance optimisée** avec cache et compression  
✅ **SSL ready** pour la production  

**Votre système Dounie Cuisine est maintenant prêt pour servir vos clients ! 🍽️**

---

*Ce guide est maintenu à jour avec les dernières versions et bonnes pratiques. Pour toute question ou amélioration, consultez la documentation technique dans le repository.*
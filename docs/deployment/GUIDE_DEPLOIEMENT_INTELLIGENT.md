# 🚀 Guide de Déploiement Intelligent - Dounie Cuisine

## Vue d'ensemble

Ce guide détaille l'utilisation du **système de déploiement intelligent** avec checkpoints, auto-correction et surveillance en temps réel pour Dounie Cuisine.

## 📋 Scripts de Déploiement Disponibles

### 1. Script Principal Intelligent (`deploy-smart.sh`)
- **Auto-correction** des erreurs
- **Système de checkpoints** avec reprise automatique
- **Monitoring en temps réel**
- **Installation complète** depuis zéro

### 2. Script SSL (`setup-ssl.sh`)
- **Configuration SSL automatique** avec Let's Encrypt
- **Renouvellement automatique**
- **Sécurisation avancée**

### 3. Scripts Docker (`docker-deployment/`)
- **Containerisation complète**
- **Orchestration Docker Compose**
- **Production-ready**

### 4. Scripts Kubernetes (`k8s-deployment/`)
- **Déploiement K8s/K3s**
- **Haute disponibilité**
- **Scalabilité automatique**

## 🎯 Déploiement avec Checkpoints

### Fonctionnement du Système de Checkpoints

Le script `deploy-smart.sh` utilise un système de points de contrôle qui permet :

1. **Sauvegarde automatique** de la progression
2. **Reprise intelligente** après correction d'erreur
3. **Auto-correction** des problèmes courants
4. **Monitoring** en temps réel du déploiement

### Liste des Checkpoints

```bash
CHECKPOINTS=(
    "check_environment"           # Vérification environnement
    "prepare_system"             # Préparation système
    "install_nodejs"             # Installation Node.js 20
    "install_postgresql"         # Installation PostgreSQL
    "install_nginx"              # Installation Nginx
    "install_pm2"                # Installation PM2
    "setup_project_structure"    # Structure projet
    "configure_database"         # Configuration DB
    "setup_environment_variables" # Variables d'environnement
    "install_dependencies"       # Dépendances
    "fix_security_vulnerabilities" # Sécurité
    "build_applications"         # Build applications
    "configure_nginx"            # Configuration Nginx
    "configure_pm2"              # Configuration PM2
    "setup_messaging_system"     # Messagerie interne
    "setup_monitoring"           # Monitoring temps réel
    "setup_backup_system"        # Système sauvegarde
    "configure_firewall"         # Firewall
    "run_health_checks"          # Vérifications santé
    "finalize_deployment"        # Finalisation
)
```

### Auto-Corrections Automatiques

#### 1. Problème Node.js (Version incorrecte)
**Symptôme:** `npm WARN EBADENGINE`
```bash
# Auto-correction appliquée :
- Suppression ancienne version
- Installation Node.js 20.x
- Vérification version
- Reprise automatique
```

#### 2. Problème Base de Données
**Symptôme:** `DATABASE_URL n'est pas définie`
```bash
# Auto-correction appliquée :
- Génération mot de passe sécurisé
- Configuration PostgreSQL
- Création utilisateur et base
- Configuration variables d'environnement
```

#### 3. Problèmes de Permissions
**Symptôme:** `Permission denied`
```bash
# Auto-correction appliquée :
- Correction permissions fichiers
- Configuration répertoires logs
- Ajustement propriétaires
```

#### 4. Vulnérabilités de Sécurité
**Symptôme:** `X moderate severity vulnerabilities`
```bash
# Auto-correction appliquée :
- npm audit fix --force
- Mise à jour dépendances
- Vérification post-correction
```

## 🛠️ Utilisation des Scripts

### Déploiement Standard (Recommandé)

```bash
# 1. Copier les fichiers sur le serveur
scp -r dounie-cuisine/ root@votre-serveur:/var/www/html/

# 2. Se connecter au serveur
ssh root@votre-serveur

# 3. Aller dans le répertoire
cd /var/www/html/dounie-cuisine

# 4. Lancer le déploiement intelligent
chmod +x deploy-smart.sh
./deploy-smart.sh
```

### Déploiement avec SSL

```bash
# Après le déploiement principal
./setup-ssl.sh votre-domaine.com admin@votre-domaine.com
```

### Déploiement Docker

```bash
# Configuration Docker Compose
cd docker-deployment
docker-compose up -d
```

### Déploiement Kubernetes

```bash
# K8s standard
cd k8s-deployment
./deploy-k8s.sh k8s

# K3s lightweight
./deploy-k8s.sh k3s
```

## 🔧 Gestion des Erreurs et Reprise

### Scénario 1 : Erreur pendant l'installation

```bash
# Le script s'arrête à cause d'une erreur
[ERROR] Erreur détectée (Code: 1, Ligne: 245)
[AUTO-FIX] Tentative de correction automatique...
[SUCCESS] Problème corrigé automatiquement. Reprise du déploiement...
[CHECKPOINT] Point de contrôle sauvegardé: install_dependencies
```

### Scénario 2 : Reprise après interruption

```bash
# Relancer le script
./deploy-smart.sh

# Le script reprend automatiquement
[WARNING] Checkpoint détecté: configure_database
[INFO] Reprise du déploiement depuis le dernier point de contrôle...
[CHECKPOINT] Point de contrôle sauvegardé: setup_environment_variables
```

### Scénario 3 : Correction manuelle nécessaire

```bash
# Si l'auto-correction échoue
[ERROR] Impossible de corriger automatiquement. Arrêt du déploiement.

# Corriger manuellement le problème puis relancer
./deploy-smart.sh
```

## 📊 Monitoring en Temps Réel

### Surveillance Automatique

Le système inclut une surveillance automatique avec :

#### Health Checks (Toutes les minutes)
```bash
# Vérifications automatiques :
✓ API: OK
✓ Nginx: OK  
✓ PostgreSQL: OK
✓ Disk: OK (75%)
✓ Memory: OK (62.3%)
```

#### Alertes Automatiques
- **Mémoire > 90%** → Nettoyage automatique
- **Disque > 85%** → Alerte critique
- **Service down** → Redémarrage automatique
- **Erreur API** → Notification immédiate

#### Logs Centralisés
```bash
# Emplacements des logs :
/var/log/dounie-cuisine/health-monitor.log    # Monitoring système
/var/log/dounie-cuisine/api-combined.log      # Logs API
/var/log/dounie-cuisine/backup.log            # Logs sauvegarde
/var/log/dounie-cuisine/deployment-report.json # Rapport déploiement
```

## 💾 Système de Sauvegarde Intelligent

### Sauvegardes Automatiques

#### Quotidiennes (via cron)
```bash
# Sauvegarde automatique chaque jour :
- Base de données → /backup/dounie-cuisine/db/
- Application → /backup/dounie-cuisine/app/
- Configurations → /backup/dounie-cuisine/configs/
- Rétention : 30 jours
```

#### Points de Restauration
```bash
# Structure des sauvegardes :
/backup/dounie-cuisine/
├── db/
│   ├── db_20250625_143022.sql
│   └── db_20250624_143018.sql
├── app/
│   ├── app_20250625_143022.tar.gz
│   └── app_20250624_143018.tar.gz
└── configs/
    ├── configs_20250625_143022.tar.gz
    └── configs_20250624_143018.tar.gz
```

### Restauration Intelligente

```bash
# Restauration automatique en cas de problème :
1. Arrêt des services
2. Restauration dernière sauvegarde valide
3. Vérification intégrité
4. Redémarrage services
5. Tests fonctionnels
```

## 🔐 Sécurité et Certification

### Configuration SSL Automatique

```bash
# Le script setup-ssl.sh configure :
✓ Certificat Let's Encrypt gratuit
✓ Redirection HTTP → HTTPS automatique
✓ Headers de sécurité avancés
✓ Renouvellement automatique
✓ Configuration SSL optimisée
```

### Firewall Intelligent

```bash
# Configuration UFW automatique :
✓ SSH autorisé
✓ HTTP/HTTPS autorisés  
✓ Port API (5000) sécurisé
✓ Autres ports bloqués
✓ Protection DDoS basique
```

### Secrets Générés Automatiquement

```bash
# Génération automatique de :
- Mot de passe DB aléatoire (32 caractères)
- Clé de session (64 caractères)
- Clé JWT (32 caractères)
- Stockage sécurisé dans /root/.dounie-db-credentials
```

## 🚀 Optimisations Avancées

### Performance Automatique

#### Configuration PM2 Optimisée
```javascript
// Cluster mode avec 2 instances
instances: 2,
exec_mode: 'cluster',
max_memory_restart: '500M',
autorestart: true,
max_restarts: 10
```

#### Nginx Haute Performance
```nginx
# Compression Gzip optimisée
gzip_comp_level 6;
gzip_types text/css application/javascript;

# Cache statique 1 an
expires 1y;
add_header Cache-Control "public, immutable";

# Buffers optimisés
proxy_buffer_size 128k;
proxy_buffers 4 256k;
```

### Scalabilité Kubernetes

#### Auto-scaling
```yaml
# Configuration HPA (Horizontal Pod Autoscaler)
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: dounie-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: dounie-app
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## 📈 Métriques et Tableaux de Bord

### Indicateurs de Performance

#### Métriques Système
```json
{
  "timestamp": "2025-06-25T14:30:22Z",
  "api": "OK",
  "nginx": "OK", 
  "database": "OK",
  "disk": "OK (75%)",
  "memory": "OK (62.3%)",
  "uptime": "2 days, 14 hours"
}
```

#### Métriques Applicatives
- **Temps de réponse API** : < 100ms
- **Requêtes par seconde** : 50+ 
- **Taux d'erreur** : < 1%
- **Disponibilité** : 99.9%

### Alertes et Notifications

#### Canaux de Notification
1. **Interface Admin** → Messages temps réel
2. **Logs système** → Fichiers structurés  
3. **Email** → Alertes critiques (optionnel)
4. **Webhook** → Intégrations externes (optionnel)

## 🔄 Mises à Jour et Maintenance

### Déploiement de Nouvelles Versions

```bash
# Procédure de mise à jour :
1. Sauvegarde automatique pré-déploiement
2. Build nouvelles images
3. Tests automatiques
4. Déploiement progressif (rolling update)
5. Vérifications post-déploiement
6. Rollback automatique si échec
```

### Maintenance Préventive

#### Tâches Automatisées
- **Nettoyage logs** → Quotidien (>7 jours)
- **Optimisation DB** → Hebdomadaire  
- **Vérification SSL** → Mensuelle
- **Tests complets** → Mensuelle
- **Mise à jour sécurité** → Automatique

## 🆘 Dépannage Avancé

### Diagnostics Automatiques

```bash
# Script de diagnostic intégré :
./deploy-smart.sh --diagnose

# Vérifications effectuées :
✓ Services en cours d'exécution
✓ Ports d'écoute
✓ Connectivité base de données
✓ Permissions fichiers
✓ Espace disque
✓ Utilisation mémoire
✓ Logs d'erreur récents
```

### Récupération d'Urgence

```bash
# En cas de panne majeure :
1. ./deploy-smart.sh --emergency-restore
2. Sélection point de restauration
3. Restauration complète automatique
4. Vérification intégrité
5. Redémarrage services
6. Tests fonctionnels
```

## 📞 Support et Escalade

### Niveaux de Support

#### Niveau 1 : Auto-résolution
- **Scripts automatiques** de correction
- **Redémarrages** intelligents
- **Nettoyage** automatique

#### Niveau 2 : Intervention Manuelle
- **Consultation logs** détaillés
- **Correction** problèmes spécifiques
- **Ajustements** configuration

#### Niveau 3 : Support Expert
- **Analyse** approfondie
- **Modifications** architecture
- **Optimisations** avancées

### Contacts d'Urgence
- **Email Support:** admin@dounie-cuisine.com
- **Escalade:** urgence@dounie-cuisine.com
- **Documentation:** https://docs.dounie-cuisine.com

---

Ce guide vous assure un déploiement robuste et une gestion optimale de votre infrastructure Dounie Cuisine avec une approche intelligente et automatisée.
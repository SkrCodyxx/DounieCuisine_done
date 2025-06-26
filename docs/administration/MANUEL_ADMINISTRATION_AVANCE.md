# 🔧 Manuel d'Administration Avancé - Dounie Cuisine

## Introduction

Ce manuel s'adresse aux administrateurs système et responsables techniques de Dounie Cuisine. Il couvre la gestion avancée, la sécurité, le monitoring et la maintenance du système.

## 🏗️ Architecture Technique

### Vue d'ensemble de l'Infrastructure

```
┌─────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE DOUNIE CUISINE            │
├─────────────────────────────────────────────────────────────┤
│  🌐 Nginx (Reverse Proxy + SSL)                           │
│     ├── Port 80/443 → Load Balancing                       │
│     └── Headers de sécurité + Compression                  │
├─────────────────────────────────────────────────────────────┤
│  ⚙️ PM2 Cluster (Gestionnaire de Processus)                │
│     ├── API Backend (Port 5000) → 2 instances             │
│     ├── Monitoring temps réel                              │
│     └── Auto-restart + Health checks                       │
├─────────────────────────────────────────────────────────────┤
│  🗄️ PostgreSQL 15 (Base de Données)                        │
│     ├── Utilisateur: dounie_user                           │
│     ├── Base: dounie_cuisine                               │
│     └── Sauvegardes automatiques                           │
├─────────────────────────────────────────────────────────────┤
│  💬 Système de Messagerie WebSocket                        │
│     ├── Communication temps réel                           │
│     ├── Notifications système                              │
│     └── Monitoring intégré                                 │
├─────────────────────────────────────────────────────────────┤
│  📊 Monitoring et Alertes                                  │
│     ├── Health checks automatiques                         │
│     ├── Métriques de performance                           │
│     └── Alertes intelligentes                              │
└─────────────────────────────────────────────────────────────┘
```

### Composants Principaux

#### 1. Frontend Applications
- **Application Publique** (`/public/`) - React + Vite + Tailwind
- **Interface d'Administration** (`/administration/`) - React + Vite + Tailwind
- **Build optimisé** pour la production

#### 2. Backend API
- **Framework:** Express.js + TypeScript
- **ORM:** Drizzle ORM
- **Authentification:** Passport.js + Sessions
- **WebSockets:** ws library pour temps réel

#### 3. Base de Données
- **PostgreSQL 15** avec configuration optimisée
- **Schéma complet** pour restaurant management
- **Indexes** optimisés pour performance

## 👨‍💼 Gestion des Utilisateurs et Rôles

### Hiérarchie des Rôles

```
👑 ADMINISTRATEUR
   ├── Accès complet au système
   ├── Gestion des utilisateurs et rôles
   ├── Configuration système
   ├── Accès aux logs et monitoring
   └── Gestion des sauvegardes

📋 MANAGER
   ├── Gestion des commandes et événements
   ├── Supervision du personnel
   ├── Rapports et statistiques
   ├── Configuration du menu
   └── Communication avec clients

👨‍🍳 STAFF
   ├── Consultation des commandes
   ├── Mise à jour des statuts
   ├── Messagerie interne
   └── Accès limité aux rapports

👤 CLIENT
   ├── Commandes et réservations
   ├── Consultation du menu
   ├── Historique personnel
   └── Communication avec le restaurant
```

### Commandes d'Administration Utilisateurs

#### Création d'un Nouvel Administrateur
```sql
-- Connexion à PostgreSQL
sudo -u postgres psql dounie_cuisine

-- Créer un nouvel administrateur
INSERT INTO users (id, username, email, password_hash, role, created_at, is_active)
VALUES (
    gen_random_uuid(),
    'nouvel_admin',
    'admin@dounie-cuisine.com',
    '$2b$12$hash_du_mot_de_passe',  -- Utiliser bcrypt
    'admin',
    NOW(),
    true
);
```

#### Modification des Permissions
```sql
-- Promouvoir un utilisateur en manager
UPDATE users SET role = 'manager' WHERE username = 'nom_utilisateur';

-- Désactiver un compte
UPDATE users SET is_active = false WHERE username = 'nom_utilisateur';

-- Réinitialiser le mot de passe (nécessite un nouveau hash)
UPDATE users SET password_hash = '$2b$12$nouveau_hash' WHERE username = 'nom_utilisateur';
```

#### Audit des Connexions
```sql
-- Vérifier les dernières connexions
SELECT username, last_login, ip_address, user_agent 
FROM user_sessions 
ORDER BY last_login DESC 
LIMIT 20;

-- Utilisateurs les plus actifs
SELECT u.username, COUNT(s.id) as sessions_count
FROM users u
LEFT JOIN user_sessions s ON u.id = s.user_id
WHERE s.created_at > NOW() - INTERVAL '30 days'
GROUP BY u.username
ORDER BY sessions_count DESC;
```

## 🔒 Sécurité Avancée

### Configuration des Mots de Passe

#### Politique de Sécurité
```javascript
// Configuration dans api/config/security.js
const passwordPolicy = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxAge: 90, // jours
  preventReuse: 5, // derniers mots de passe
  lockoutAttempts: 5,
  lockoutDuration: 30 // minutes
};
```

#### Commandes de Gestion
```bash
# Forcer la réinitialisation de tous les mots de passe
curl -X POST http://localhost:5000/api/admin/force-password-reset \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json"

# Vérifier la force des mots de passe existants
curl -X GET http://localhost:5000/api/admin/password-strength-audit \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### Surveillance de Sécurité

#### Détection d'Intrusion
```bash
# Analyser les tentatives de connexion suspectes
grep "Failed login" /var/log/dounie-cuisine/api-combined.log | \
  awk '{print $4}' | sort | uniq -c | sort -nr

# Bloquer une IP suspecte
ufw deny from 192.168.1.100

# Vérifier les connexions actives
netstat -tulpn | grep :5000
```

#### Audit de Sécurité Automatique
```bash
# Script d'audit quotidien
cat > /usr/local/bin/dounie-security-audit << 'EOF'
#!/bin/bash
AUDIT_LOG="/var/log/dounie-cuisine/security-audit.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$DATE] Début audit sécurité" >> $AUDIT_LOG

# Vérifier les connexions root
who | grep root >> $AUDIT_LOG

# Vérifier les ports ouverts
nmap -sT localhost | grep open >> $AUDIT_LOG

# Vérifier les processus suspects
ps aux | grep -v grep | grep -E "(nc|netcat|wget|curl)" >> $AUDIT_LOG

# Vérifier l'intégrité des fichiers critiques
find /var/www/html/dounie-cuisine -name "*.js" -newer /tmp/last-audit 2>/dev/null >> $AUDIT_LOG

echo "[$DATE] Fin audit sécurité" >> $AUDIT_LOG
touch /tmp/last-audit
EOF

chmod +x /usr/local/bin/dounie-security-audit

# Programmer l'exécution quotidienne
echo "0 6 * * * /usr/local/bin/dounie-security-audit" | crontab -
```

## 📊 Monitoring et Performance

### Métriques Système Avancées

#### Configuration Prometheus (Optionnel)
```yaml
# /etc/prometheus/prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'dounie-cuisine'
    static_configs:
      - targets: ['localhost:5000']
    metrics_path: '/api/metrics'
    scrape_interval: 10s

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['localhost:9100']
```

#### Scripts de Monitoring Personnalisés
```bash
# Script de monitoring avancé
cat > /usr/local/bin/dounie-advanced-monitoring << 'EOF'
#!/bin/bash

METRICS_FILE="/var/log/dounie-cuisine/metrics.json"
DATE=$(date -Iseconds)

# Collecte des métriques
API_RESPONSE_TIME=$(curl -w "%{time_total}" -s -o /dev/null http://localhost:5000/api/health)
DB_CONNECTIONS=$(sudo -u postgres psql -d dounie_cuisine -t -c "SELECT count(*) FROM pg_stat_activity WHERE datname='dounie_cuisine';")
ACTIVE_SESSIONS=$(curl -s http://localhost:5000/api/admin/active-sessions | jq '.count')
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
MEMORY_USAGE=$(free | awk 'NR==2{printf "%.1f", $3*100/$2}')
CPU_LOAD=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | sed 's/,//')

# Génération JSON
cat > $METRICS_FILE << EOJ
{
  "timestamp": "$DATE",
  "api_response_time": $API_RESPONSE_TIME,
  "database_connections": $DB_CONNECTIONS,
  "active_sessions": $ACTIVE_SESSIONS,
  "disk_usage_percent": $DISK_USAGE,
  "memory_usage_percent": $MEMORY_USAGE,
  "cpu_load_1min": $CPU_LOAD,
  "status": "$(systemctl is-active dounie-api)"
}
EOJ

# Alertes conditionnelles
if (( $(echo "$API_RESPONSE_TIME > 1.0" | bc -l) )); then
    echo "ALERT: API response time high: ${API_RESPONSE_TIME}s" >> /var/log/dounie-cuisine/alerts.log
fi

if [[ $DISK_USAGE -gt 85 ]]; then
    echo "ALERT: Disk usage critical: ${DISK_USAGE}%" >> /var/log/dounie-cuisine/alerts.log
fi

if (( $(echo "$MEMORY_USAGE > 90.0" | bc -l) )); then
    echo "ALERT: Memory usage critical: ${MEMORY_USAGE}%" >> /var/log/dounie-cuisine/alerts.log
fi
EOF

chmod +x /usr/local/bin/dounie-advanced-monitoring

# Exécution toutes les 2 minutes
echo "*/2 * * * * /usr/local/bin/dounie-advanced-monitoring" | crontab -
```

### Optimisation des Performances

#### Configuration PostgreSQL Avancée
```sql
-- /etc/postgresql/15/main/postgresql.conf optimisé
-- (Redémarrage PostgreSQL requis après modification)

-- Mémoire
shared_buffers = 256MB                  -- 25% de la RAM
effective_cache_size = 1GB              -- 75% de la RAM
work_mem = 4MB                          -- Par connexion
maintenance_work_mem = 64MB             -- Maintenance

-- Écriture
wal_buffers = 16MB
checkpoint_completion_target = 0.9
max_wal_size = 1GB
min_wal_size = 80MB

-- Connexions
max_connections = 200
shared_preload_libraries = 'pg_stat_statements'

-- Logging performance
log_min_duration_statement = 1000       -- Log requêtes > 1s
log_checkpoints = on
log_connections = on
log_disconnections = on
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '

-- Statistiques
track_activities = on
track_counts = on
track_io_timing = on
track_functions = pl
```

#### Requêtes d'Optimisation
```sql
-- Analyser les requêtes lentes
SELECT query, calls, total_time, mean_time, stddev_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Vérifier l'utilisation des index
SELECT schemaname, tablename, attname, n_distinct, correlation
FROM pg_stats
WHERE tablename IN ('orders', 'users', 'menu_items', 'events')
ORDER BY tablename, attname;

-- Analyser la fragmentation des tables
SELECT schemaname, tablename, 
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
       pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - 
                     pg_relation_size(schemaname||'.'||tablename)) as index_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

#### Optimisation Nginx
```nginx
# /etc/nginx/sites-available/dounie-cuisine optimisé
server {
    # Configuration SSL optimisée
    ssl_session_cache shared:SSL:50m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;
    
    # OCSP stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    
    # Configuration cache avancée
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary Accept-Encoding;
        access_log off;
        
        # Compression d'images à la volée
        gzip_static on;
    }
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;
    
    location /api/auth/login {
        limit_req zone=login burst=3 nodelay;
        proxy_pass http://localhost:5000;
    }
    
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://localhost:5000;
    }
    
    # Sécurité avancée
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self';" always;
    
    # Hide nginx version
    server_tokens off;
}
```

## 💾 Gestion Avancée des Sauvegardes

### Stratégie de Sauvegarde 3-2-1

#### Configuration Complète
```bash
# Script de sauvegarde avancé avec rotation et vérification
cat > /usr/local/bin/dounie-backup-advanced << 'EOF'
#!/bin/bash

BACKUP_DIR="/backup/dounie-cuisine"
REMOTE_BACKUP_DIR="/mnt/remote-backup"  # NFS/CIFS mount point
DATE=$(date +%Y%m%d_%H%M%S)
LOG_FILE="/var/log/dounie-cuisine/backup-advanced.log"

log_backup() {
    echo "[$(date)] $1" | tee -a $LOG_FILE
}

# Créer les répertoires
mkdir -p $BACKUP_DIR/{db,app,configs,logs}
mkdir -p $REMOTE_BACKUP_DIR 2>/dev/null || true

log_backup "Début sauvegarde avancée"

# 1. Sauvegarde base de données avec compression
log_backup "Sauvegarde DB en cours..."
source /root/.dounie-db-credentials
pg_dump -h localhost -U dounie_user dounie_cuisine | gzip > $BACKUP_DIR/db/db_$DATE.sql.gz

# Vérification intégrité DB
if gzip -t $BACKUP_DIR/db/db_$DATE.sql.gz; then
    log_backup "✓ Sauvegarde DB OK"
else
    log_backup "✗ Erreur sauvegarde DB"
    exit 1
fi

# 2. Sauvegarde application avec exclusions intelligentes
log_backup "Sauvegarde application en cours..."
tar --exclude='node_modules' \
    --exclude='*.log' \
    --exclude='dist' \
    --exclude='.git' \
    -czf $BACKUP_DIR/app/app_$DATE.tar.gz \
    /var/www/html/dounie-cuisine

# 3. Sauvegarde configurations système
log_backup "Sauvegarde configurations en cours..."
tar -czf $BACKUP_DIR/configs/configs_$DATE.tar.gz \
    /etc/nginx/sites-available/dounie-cuisine \
    /root/.dounie-db-credentials \
    /var/www/html/dounie-cuisine/ecosystem.config.js \
    /etc/systemd/system/dounie*.service 2>/dev/null || true

# 4. Sauvegarde logs récents (7 derniers jours)
log_backup "Sauvegarde logs en cours..."
find /var/log/dounie-cuisine -name "*.log" -mtime -7 | \
    tar -czf $BACKUP_DIR/logs/logs_$DATE.tar.gz -T -

# 5. Copie vers stockage distant (si disponible)
if [[ -d "$REMOTE_BACKUP_DIR" ]]; then
    log_backup "Copie vers stockage distant..."
    rsync -av --delete $BACKUP_DIR/ $REMOTE_BACKUP_DIR/
    log_backup "✓ Copie distante terminée"
fi

# 6. Vérification des sauvegardes
EXPECTED_FILES=("db_$DATE.sql.gz" "app_$DATE.tar.gz" "configs_$DATE.tar.gz")
ALL_OK=true

for file in "${EXPECTED_FILES[@]}"; do
    if [[ -f "$BACKUP_DIR/db/$file" ]] || [[ -f "$BACKUP_DIR/app/$file" ]] || [[ -f "$BACKUP_DIR/configs/$file" ]]; then
        log_backup "✓ $file présent"
    else
        log_backup "✗ $file manquant"
        ALL_OK=false
    fi
done

# 7. Nettoyage intelligent
log_backup "Nettoyage des anciennes sauvegardes..."
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

# 8. Rapport final
if $ALL_OK; then
    log_backup "✓ Sauvegarde complète réussie"
    exit 0
else
    log_backup "✗ Sauvegarde incomplète - intervention requise"
    exit 1
fi
EOF

chmod +x /usr/local/bin/dounie-backup-advanced
```

#### Test de Restauration Automatisé
```bash
# Script de test de restauration (à exécuter en environnement de test)
cat > /usr/local/bin/dounie-restore-test << 'EOF'
#!/bin/bash

BACKUP_DIR="/backup/dounie-cuisine"
TEST_DB="dounie_cuisine_restore_test"
LOG_FILE="/var/log/dounie-cuisine/restore-test.log"

log_test() {
    echo "[$(date)] $1" | tee -a $LOG_FILE
}

# Récupérer la dernière sauvegarde
LATEST_BACKUP=$(ls -t $BACKUP_DIR/db/db_*.sql.gz | head -1)

if [[ -z "$LATEST_BACKUP" ]]; then
    log_test "✗ Aucune sauvegarde trouvée"
    exit 1
fi

log_test "Test de restauration: $LATEST_BACKUP"

# Créer une base de test
sudo -u postgres psql -c "DROP DATABASE IF EXISTS $TEST_DB;"
sudo -u postgres psql -c "CREATE DATABASE $TEST_DB;"

# Restaurer la sauvegarde
if zcat "$LATEST_BACKUP" | sudo -u postgres psql $TEST_DB > /dev/null 2>&1; then
    log_test "✓ Restauration réussie"
    
    # Vérifier l'intégrité des données
    TABLE_COUNT=$(sudo -u postgres psql -d $TEST_DB -t -c "SELECT count(*) FROM information_schema.tables WHERE table_schema='public';")
    log_test "Tables restaurées: $TABLE_COUNT"
    
    # Nettoyer
    sudo -u postgres psql -c "DROP DATABASE $TEST_DB;"
    log_test "✓ Test terminé avec succès"
else
    log_test "✗ Échec de la restauration"
    exit 1
fi
EOF

chmod +x /usr/local/bin/dounie-restore-test

# Test hebdomadaire automatique
echo "0 3 * * 0 /usr/local/bin/dounie-restore-test" >> /etc/crontab
```

## 🔄 Déploiement et Mise à Jour

### Déploiement Blue-Green

#### Script de Déploiement Sans Interruption
```bash
cat > /usr/local/bin/dounie-blue-green-deploy << 'EOF'
#!/bin/bash

DEPLOY_DIR="/var/www/html"
CURRENT_DIR="$DEPLOY_DIR/dounie-cuisine"
BLUE_DIR="$DEPLOY_DIR/dounie-cuisine-blue"
GREEN_DIR="$DEPLOY_DIR/dounie-cuisine-green"
BACKUP_DIR="/backup/deployments"

# Déterminer l'environnement actuel
if [[ -L "$CURRENT_DIR" ]]; then
    CURRENT_TARGET=$(readlink "$CURRENT_DIR")
    if [[ "$CURRENT_TARGET" == *"blue"* ]]; then
        CURRENT_ENV="blue"
        NEW_ENV="green"
        NEW_DIR="$GREEN_DIR"
    else
        CURRENT_ENV="green"
        NEW_ENV="blue"
        NEW_DIR="$BLUE_DIR"
    fi
else
    CURRENT_ENV="none"
    NEW_ENV="blue"
    NEW_DIR="$BLUE_DIR"
fi

echo "Déploiement $CURRENT_ENV → $NEW_ENV"

# Sauvegarde pré-déploiement
/usr/local/bin/dounie-backup-advanced

# Préparation du nouvel environnement
if [[ -d "$NEW_DIR" ]]; then
    rm -rf "$NEW_DIR"
fi

cp -r "$CURRENT_DIR"/* "$NEW_DIR"/ 2>/dev/null || true

# Build de la nouvelle version
cd "$NEW_DIR"
echo "Build en cours..."

# API
cd api && npm install --production && npm run build && cd ..

# Frontend
cd public && npm install && npm run build && cd ..
cd administration && npm install && npm run build && cd ..

# Test de l'application
echo "Tests pré-déploiement..."
if ! curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✗ Échec des tests - annulation du déploiement"
    exit 1
fi

# Basculement
rm -f "$CURRENT_DIR"
ln -s "$NEW_DIR" "$CURRENT_DIR"

# Redémarrage des services
pm2 restart dounie-api
sleep 10

# Vérification post-déploiement
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✓ Déploiement $NEW_ENV réussi"
    
    # Nettoyage de l'ancien environnement après 24h
    OLD_DIR=$([ "$NEW_ENV" == "blue" ] && echo "$GREEN_DIR" || echo "$BLUE_DIR")
    echo "rm -rf $OLD_DIR" | at now + 24 hours
else
    echo "✗ Échec du déploiement - rollback"
    # Rollback automatique
    rm -f "$CURRENT_DIR"
    if [[ "$CURRENT_ENV" != "none" ]]; then
        OLD_DIR=$([ "$NEW_ENV" == "blue" ] && echo "$GREEN_DIR" || echo "$BLUE_DIR")
        ln -s "$OLD_DIR" "$CURRENT_DIR"
        pm2 restart dounie-api
    fi
    exit 1
fi
EOF

chmod +x /usr/local/bin/dounie-blue-green-deploy
```

### Pipeline CI/CD Simple

#### Webhook de Déploiement Automatique
```bash
# Script webhook pour déploiement automatique depuis Git
cat > /usr/local/bin/dounie-git-deploy << 'EOF'
#!/bin/bash

REPO_URL="https://github.com/votre-org/dounie-cuisine.git"
DEPLOY_DIR="/tmp/dounie-deploy"
LOG_FILE="/var/log/dounie-cuisine/deploy.log"

log_deploy() {
    echo "[$(date)] $1" | tee -a $LOG_FILE
}

# Cloner la dernière version
log_deploy "Clonage du repository..."
rm -rf $DEPLOY_DIR
git clone $REPO_URL $DEPLOY_DIR

if [[ $? -ne 0 ]]; then
    log_deploy "✗ Échec du clonage"
    exit 1
fi

# Tests automatiques
cd $DEPLOY_DIR
log_deploy "Exécution des tests..."

# Tests backend
cd api && npm install && npm test
if [[ $? -ne 0 ]]; then
    log_deploy "✗ Échec des tests backend"
    exit 1
fi

# Tests frontend
cd ../public && npm install && npm run test
cd ../administration && npm install && npm run test

# Déploiement si tous les tests passent
log_deploy "Tests réussis - déploiement en cours..."
cp -r $DEPLOY_DIR/* /var/www/html/dounie-cuisine/

# Utiliser le déploiement blue-green
/usr/local/bin/dounie-blue-green-deploy

log_deploy "✓ Déploiement automatique terminé"
EOF

chmod +x /usr/local/bin/dounie-git-deploy
```

## 📈 Reporting et Analytics

### Génération de Rapports Automatisés

#### Rapport Quotidien Système
```bash
cat > /usr/local/bin/dounie-daily-report << 'EOF'
#!/bin/bash

REPORT_DIR="/var/log/dounie-cuisine/reports"
DATE=$(date +%Y%m%d)
REPORT_FILE="$REPORT_DIR/daily-report-$DATE.html"

mkdir -p $REPORT_DIR

# Génération HTML
cat > $REPORT_FILE << 'EOH'
<!DOCTYPE html>
<html>
<head>
    <title>Rapport Quotidien Dounie Cuisine</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { color: #2563eb; border-bottom: 2px solid #2563eb; }
        .section { margin: 20px 0; }
        .metric { background: #f3f4f6; padding: 10px; margin: 5px 0; border-left: 4px solid #2563eb; }
        .alert { background: #fef2f2; border-left: 4px solid #ef4444; }
        .success { background: #f0fdf4; border-left: 4px solid #22c55e; }
    </style>
</head>
<body>
EOH

echo "<h1 class='header'>Rapport Quotidien - $(date '+%d/%m/%Y')</h1>" >> $REPORT_FILE

# Métriques système
echo "<div class='section'>" >> $REPORT_FILE
echo "<h2>Métriques Système</h2>" >> $REPORT_FILE

UPTIME=$(uptime -p)
LOAD=$(uptime | awk -F'load average:' '{print $2}')
DISK_USAGE=$(df / | awk 'NR==2 {print $5}')
MEMORY_USAGE=$(free | awk 'NR==2{printf "%.1f%%", $3*100/$2}')

echo "<div class='metric'>Uptime: $UPTIME</div>" >> $REPORT_FILE
echo "<div class='metric'>Charge système: $LOAD</div>" >> $REPORT_FILE
echo "<div class='metric'>Utilisation disque: $DISK_USAGE</div>" >> $REPORT_FILE
echo "<div class='metric'>Utilisation mémoire: $MEMORY_USAGE</div>" >> $REPORT_FILE

# Métriques application
API_STATUS=$(curl -s http://localhost:5000/api/health | jq -r '.status' 2>/dev/null || echo "ERROR")
DB_CONNECTIONS=$(sudo -u postgres psql -d dounie_cuisine -t -c "SELECT count(*) FROM pg_stat_activity WHERE datname='dounie_cuisine';" 2>/dev/null || echo "N/A")

if [[ "$API_STATUS" == "ok" ]]; then
    echo "<div class='metric success'>API Status: $API_STATUS</div>" >> $REPORT_FILE
else
    echo "<div class='metric alert'>API Status: $API_STATUS</div>" >> $REPORT_FILE
fi

echo "<div class='metric'>Connexions DB actives: $DB_CONNECTIONS</div>" >> $REPORT_FILE
echo "</div>" >> $REPORT_FILE

# Logs d'erreur récents
echo "<div class='section'>" >> $REPORT_FILE
echo "<h2>Erreurs Récentes (24h)</h2>" >> $REPORT_FILE
ERROR_COUNT=$(grep -c "ERROR" /var/log/dounie-cuisine/api-combined.log 2>/dev/null || echo "0")
echo "<div class='metric'>Nombre d'erreurs: $ERROR_COUNT</div>" >> $REPORT_FILE

if [[ $ERROR_COUNT -gt 0 ]]; then
    echo "<h3>Détail des erreurs:</h3>" >> $REPORT_FILE
    echo "<pre>" >> $REPORT_FILE
    tail -20 /var/log/dounie-cuisine/api-combined.log | grep ERROR >> $REPORT_FILE
    echo "</pre>" >> $REPORT_FILE
fi
echo "</div>" >> $REPORT_FILE

# Sauvegardes
echo "<div class='section'>" >> $REPORT_FILE
echo "<h2>État des Sauvegardes</h2>" >> $REPORT_FILE
LAST_BACKUP=$(ls -t /backup/dounie-cuisine/db/db_*.sql.gz 2>/dev/null | head -1)
if [[ -n "$LAST_BACKUP" ]]; then
    BACKUP_DATE=$(stat -c %y "$LAST_BACKUP" | cut -d' ' -f1)
    BACKUP_SIZE=$(du -h "$LAST_BACKUP" | cut -f1)
    echo "<div class='metric success'>Dernière sauvegarde: $BACKUP_DATE ($BACKUP_SIZE)</div>" >> $REPORT_FILE
else
    echo "<div class='metric alert'>Aucune sauvegarde trouvée</div>" >> $REPORT_FILE
fi
echo "</div>" >> $REPORT_FILE

echo "</body></html>" >> $REPORT_FILE

# Envoi par email (optionnel)
if command -v mail >/dev/null 2>&1; then
    mail -s "Rapport Quotidien Dounie Cuisine - $(date +%d/%m/%Y)" \
         -a "Content-Type: text/html" \
         admin@dounie-cuisine.com < $REPORT_FILE
fi

echo "Rapport généré: $REPORT_FILE"
EOF

chmod +x /usr/local/bin/dounie-daily-report

# Programmation quotidienne à 7h
echo "0 7 * * * /usr/local/bin/dounie-daily-report" | crontab -
```

## 🆘 Procédures d'Urgence

### Plan de Reprise d'Activité (PRA)

#### Procédure de Récupération Complète
```bash
cat > /usr/local/bin/dounie-disaster-recovery << 'EOF'
#!/bin/bash

echo "🚨 PROCÉDURE DE RÉCUPÉRATION D'URGENCE DOUNIE CUISINE"
echo "=================================================="

# Vérification des prérequis
echo "1. Vérification de l'environnement..."
if [[ ! -d "/backup/dounie-cuisine" ]]; then
    echo "✗ Répertoire de sauvegarde introuvable"
    exit 1
fi

# Arrêt des services
echo "2. Arrêt des services..."
pm2 stop all
systemctl stop nginx
systemctl stop postgresql

# Restauration de la base de données
echo "3. Restauration de la base de données..."
LATEST_DB_BACKUP=$(ls -t /backup/dounie-cuisine/db/db_*.sql.gz | head -1)
if [[ -n "$LATEST_DB_BACKUP" ]]; then
    sudo -u postgres dropdb dounie_cuisine 2>/dev/null || true
    sudo -u postgres createdb dounie_cuisine
    zcat "$LATEST_DB_BACKUP" | sudo -u postgres psql dounie_cuisine
    echo "✓ Base de données restaurée"
else
    echo "✗ Aucune sauvegarde DB trouvée"
    exit 1
fi

# Restauration de l'application
echo "4. Restauration de l'application..."
LATEST_APP_BACKUP=$(ls -t /backup/dounie-cuisine/app/app_*.tar.gz | head -1)
if [[ -n "$LATEST_APP_BACKUP" ]]; then
    rm -rf /var/www/html/dounie-cuisine
    tar -xzf "$LATEST_APP_BACKUP" -C /
    echo "✓ Application restaurée"
else
    echo "✗ Aucune sauvegarde APP trouvée"
    exit 1
fi

# Restauration des configurations
echo "5. Restauration des configurations..."
LATEST_CONFIG_BACKUP=$(ls -t /backup/dounie-cuisine/configs/configs_*.tar.gz | head -1)
if [[ -n "$LATEST_CONFIG_BACKUP" ]]; then
    tar -xzf "$LATEST_CONFIG_BACKUP" -C /
    echo "✓ Configurations restaurées"
fi

# Redémarrage des services
echo "6. Redémarrage des services..."
systemctl start postgresql
sleep 5
systemctl start nginx
sleep 2

cd /var/www/html/dounie-cuisine
pm2 start ecosystem.config.js

# Vérifications finales
echo "7. Vérifications finales..."
sleep 10

if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ Récupération réussie - Système opérationnel"
else
    echo "❌ Problème détecté - Intervention manuelle requise"
    exit 1
fi

echo ""
echo "🎉 RÉCUPÉRATION TERMINÉE AVEC SUCCÈS"
echo "   Vérifiez le fonctionnement complet du système"
echo "   Consultez les logs pour plus de détails"
EOF

chmod +x /usr/local/bin/dounie-disaster-recovery
```

### Contacts d'Urgence

#### Procédure d'Escalade
```
🚨 CONTACTS D'URGENCE - DOUNIE CUISINE
=====================================

NIVEAU 1 - Support Technique
📧 support@dounie-cuisine.com
📱 +509 XX XX XX XX
⏰ Lundi-Vendredi 8h-17h

NIVEAU 2 - Administrateur Système  
📧 admin@dounie-cuisine.com
📱 +509 XX XX XX XX (Urgences)
⏰ 24h/7j pour urgences critiques

NIVEAU 3 - Direction Technique
📧 cto@dounie-cuisine.com
📱 +509 XX XX XX XX
⏰ Escalade uniquement

CRITÈRES D'ESCALADE:
🔴 Critique: Service indisponible > 30min
🟡 Important: Performance dégradée > 2h  
🟢 Normal: Problèmes mineurs
```

---

Ce manuel d'administration avancé vous donne tous les outils nécessaires pour maintenir votre infrastructure Dounie Cuisine de manière professionnelle et sécurisée.
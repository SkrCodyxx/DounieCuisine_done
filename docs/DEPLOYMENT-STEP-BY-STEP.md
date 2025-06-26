# 📋 DÉPLOIEMENT ÉTAPE PAR ÉTAPE - DOUNIE CUISINE

## 🎯 COMMANDES UNE PAR UNE AVEC SYSTÈME DE DÉPENDANCES

### ÉTAPE 1: PRÉPARATION SYSTÈME
```bash
# 1.1 Mise à jour système
sudo apt update && sudo apt upgrade -y

# 1.2 Installation outils de base
sudo apt install -y curl wget git build-essential
```

### ÉTAPE 2: BASES DE DONNÉES (PRIORITÉ 1 - OBLIGATOIRE)
```bash
# 2.1 Installation MongoDB
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] http://repo.mongodb.org/apt/debian bookworm/mongodb-org/7.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org

# 2.2 Installation PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# 2.3 DÉMARRAGE DES BASES (OBLIGATOIRE AVANT TOUT)
sudo service mongodb start
sudo service postgresql start

# 2.4 Création base de données
sudo -u postgres createdb dounie_cuisine
```

### ÉTAPE 3: ENVIRONNEMENT PYTHON (BACKEND FASTAPI)
```bash
# 3.1 Installation Python
sudo apt install -y python3 python3-pip python3-venv

# 3.2 Installation dépendances Backend
cd /app/backend
pip3 install -r requirements.txt
```

### ÉTAPE 4: ENVIRONNEMENT NODE.JS
```bash
# 4.1 Installation Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 4.2 Installation Yarn et serve
npm install -g yarn serve

# 4.3 Vérification versions
node --version  # Doit être v20.x
npm --version
yarn --version
```

### ÉTAPE 5: INSTALLATION DÉPENDANCES APPLICATIONS (ORDRE SÉQUENTIEL)
```bash
# 5.1 API Express (TypeScript)
cd /app/api
npm install

# 5.2 Frontend React principal
cd /app/frontend
yarn install

# 5.3 Site Public (Vite)
cd /app/public
npm install

# 5.4 Administration (avec gestion conflits)
cd /app/administration
npm install --legacy-peer-deps
```

### ÉTAPE 6: CONSTRUCTION APPLICATIONS
```bash
# 6.1 Build API Express
cd /app/api
npm run build

# 6.2 Build Site Public
cd /app/public
npm run build

# 6.3 Build Administration (si possible)
cd /app/administration
npm run build || echo "Mode dev pour admin"
```

### ÉTAPE 7: CONFIGURATION SUPERVISOR
```bash
# 7.1 Installation Supervisor
sudo apt install -y supervisor

# 7.2 Création répertoires logs
sudo mkdir -p /var/log/dounie
sudo chmod 755 /var/log/dounie

# 7.3 Configuration avec dépendances (voir fichier config complet)
sudo nano /etc/supervisor/conf.d/dounie-complete.conf

# 7.4 Redémarrage supervisor
sudo service supervisor restart
sudo supervisorctl reread
sudo supervisorctl update
```

### ÉTAPE 8: DÉMARRAGE SERVICES (ORDRE DE DÉPENDANCE)
```bash
# 8.1 PRIORITÉ 1: Bases de données
sudo supervisorctl start dounie-databases:*
sleep 10

# 8.2 PRIORITÉ 2: Backends (attendre que les DB soient prêtes)
sudo supervisorctl start dounie-backends:*
sleep 15

# 8.3 PRIORITÉ 3: Frontends (attendre que les backends soient prêts)
sudo supervisorctl start dounie-frontends:*
```

### ÉTAPE 9: VÉRIFICATION SERVICES
```bash
# 9.1 Status général
sudo supervisorctl status

# 9.2 Tests de santé
curl http://localhost:8001/api/health  # Backend FastAPI
curl http://localhost:5000/api/health  # API Express
curl http://localhost:3000             # Frontend React
curl http://localhost:80               # Site Public
curl http://localhost:3001             # Administration
```

## 🔧 COMMANDES DE GESTION

### Redémarrage sélectif (respecter l'ordre)
```bash
# Redémarrer seulement les bases
sudo supervisorctl restart dounie-databases:*

# Redémarrer seulement les backends
sudo supervisorctl restart dounie-backends:*

# Redémarrer seulement les frontends
sudo supervisorctl restart dounie-frontends:*

# Redémarrage complet (dans l'ordre)
sudo supervisorctl stop dounie-frontends:*
sudo supervisorctl stop dounie-backends:*
sudo supervisorctl restart dounie-databases:*
sleep 5
sudo supervisorctl start dounie-backends:*
sleep 10
sudo supervisorctl start dounie-frontends:*
```

### Monitoring et logs
```bash
# Voir tous les processus
sudo supervisorctl status

# Logs en temps réel
tail -f /var/log/dounie/backend-fastapi.out.log
tail -f /var/log/dounie/api-express.out.log
tail -f /var/log/dounie/frontend-react.out.log

# Logs d'erreurs
tail -f /var/log/dounie/*.err.log
```

### Dépannage par service
```bash
# Backend FastAPI ne démarre pas
cd /app/backend
python3 server.py  # Test manuel
tail -f /var/log/dounie/backend-fastapi.err.log

# API Express problème
cd /app/api
npm start  # Test manuel
tail -f /var/log/dounie/api-express.err.log

# Frontend React problème
cd /app/frontend
yarn start  # Test manuel
tail -f /var/log/dounie/frontend-react.err.log
```

## ⚠️ ORDRE DE DÉPENDANCE CRITIQUE

### OBLIGATOIRE - Respecter cet ordre:
1. **Bases de données** (MongoDB + PostgreSQL) → ATTENDRE démarrage complet
2. **Backends** (FastAPI + Express) → ATTENDRE que les DB soient prêtes
3. **Frontends** (React + Vite + Admin) → ATTENDRE que les backends répondent

### JAMAIS faire:
❌ Démarrer les frontends avant les backends  
❌ Démarrer les backends avant les bases de données  
❌ Redémarrer tout en même temps sans attendre  

### TOUJOURS faire:
✅ Vérifier la santé des services avant de passer au suivant  
✅ Attendre 10-15 secondes entre chaque groupe  
✅ Consulter les logs en cas de problème  

## 🎯 PORTS ET SERVICES

| Service | Port | Dépend de | URL de test |
|---------|------|-----------|-------------|
| MongoDB | 27017 | - | `mongosh` |
| PostgreSQL | 5432 | - | `psql -h localhost` |
| Backend FastAPI | 8001 | MongoDB | `http://localhost:8001/api/health` |
| API Express | 5000 | PostgreSQL | `http://localhost:5000/api/health` |
| Frontend React | 3000 | Backend FastAPI | `http://localhost:3000` |
| Site Public | 80 | - | `http://localhost:80` |
| Administration | 3001 | Backend FastAPI | `http://localhost:3001` |

## 🚀 SCRIPT AUTOMATIQUE COMPLET

Pour déployer automatiquement avec gestion des dépendances:
```bash
cd /app
chmod +x deployment/debian/deploy-complete-dependencies.sh
./deployment/debian/deploy-complete-dependencies.sh
```

Ce script gère automatiquement l'ordre de dépendance et les temps d'attente.
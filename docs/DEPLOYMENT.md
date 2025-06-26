# 🚀 GUIDE DE DÉPLOIEMENT - DOUNIE CUISINE

## Environnements supportés

### 1. Debian/Ubuntu VPS ⭐ **RECOMMANDÉ**
Script automatisé pour déploiement sur serveur dédié.

**Prérequis:**
- Serveur Debian 11+ ou Ubuntu 20.04+
- 2GB RAM minimum
- Accès root ou sudo

**Déploiement:**
```bash
cd deployment/debian
chmod +x deploy-debian.sh
./deploy-debian.sh
```

**Services installés:**
- Nginx (reverse proxy)
- Supervisor (gestion processus)
- MongoDB (base de données)
- Python 3 + pip (backend)
- Node.js + npm (frontend)

**Ports:**
- 80: Interface publique
- 8001: API Backend (interne)
- 27017: MongoDB (interne)

### 2. Kubernetes
Déploiement sur cluster Kubernetes avec haute disponibilité.

**Prérequis:**
- Cluster Kubernetes fonctionnel
- kubectl configuré
- Ingress Controller (optionnel)

**Déploiement:**
```bash
cd deployment/k8s
chmod +x deploy-k8s.sh
./deploy-k8s.sh
```

**Ressources créées:**
- Namespace: `dounie-cuisine`
- Deployment: App + PostgreSQL + Nginx
- Services: Exposition interne
- PersistentVolumes: Stockage données
- ConfigMap/Secrets: Configuration

### 3. Docker Compose
Déploiement local ou développement avec conteneurs.

**Prérequis:**
- Docker 20.10+
- Docker Compose 2.0+

**Déploiement:**
```bash
cd deployment/docker
chmod +x deploy-docker.sh
./deploy-docker.sh
```

**Services:**
- backend: API FastAPI
- frontend: Interface React
- mongodb: Base de données
- nginx: Reverse proxy

## Configuration production

### Variables d'environnement

**Backend (.env):**
```env
MONGO_URL=mongodb://localhost:27017/dounie_cuisine
DATABASE_NAME=dounie_cuisine
PORT=8001
NODE_ENV=production
```

**Frontend (.env):**
```env
REACT_APP_BACKEND_URL=http://localhost/api
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    # Frontend
    location / {
        root /var/www/dounie-cuisine/frontend/build;
        try_files $uri $uri/ /index.html;
    }

    # API Backend
    location /api {
        rewrite ^/api/(.*) /$1 break;
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## SSL/HTTPS (Production)

### Certbot (Let's Encrypt)
```bash
# Installation
sudo apt install certbot python3-certbot-nginx

# Génération certificat
sudo certbot --nginx -d votre-domaine.com

# Renouvellement automatique
sudo crontab -e
# Ajouter: 0 2 * * * /usr/bin/certbot renew --quiet
```

## Monitoring et maintenance

### Supervision des services
```bash
# Status des services
sudo supervisorctl status

# Redémarrage backend
sudo supervisorctl restart dounie-backend

# Logs en temps réel
sudo supervisorctl tail -f dounie-backend
```

### Sauvegarde MongoDB
```bash
# Sauvegarde
mongodump --db dounie_cuisine --out /backup/$(date +%Y%m%d)

# Restauration
mongorestore --db dounie_cuisine /backup/20250626/dounie_cuisine
```

### Monitoring système
```bash
# Utilisation disque
df -h

# Mémoire
free -h

# Processus
top -p $(pgrep -f "python.*server.py")
```

## Dépannage

### Backend ne démarre pas
```bash
# Vérifier les logs
sudo supervisorctl tail dounie-backend stderr

# Vérifier les dépendances
cd /var/www/dounie-cuisine/backend
pip install -r requirements.txt
```

### Frontend inaccessible
```bash
# Vérifier Nginx
sudo nginx -t
sudo systemctl status nginx

# Vérifier build
cd /var/www/dounie-cuisine/frontend
npm run build
```

### Base de données
```bash
# Status MongoDB
sudo systemctl status mongodb

# Connexion test
mongosh dounie_cuisine --eval "db.stats()"
```

## Performance

### Optimisations recommandées
- **Nginx**: Compression gzip activée
- **MongoDB**: Index sur champs fréquents
- **Backend**: Mode production FastAPI
- **Frontend**: Build optimisé React

### Métriques cibles
- Temps de réponse API: < 100ms
- Chargement page: < 2 secondes  
- Concurrent users: 100+
- Uptime: 99.9%

## Sécurité

### Mesures implémentées
✅ Variables d'environnement sécurisées  
✅ Validation des entrées API  
✅ Authentification JWT  
✅ CORS configuré  
✅ Nginx rate limiting  

### Recommandations additionnelles
- Firewall UFW configuré
- Fail2ban pour SSH
- Mises à jour système régulières
- Monitoring des logs d'accès
# 🍽️ DOUNIE CUISINE - Système de Gestion Restaurant Haïtien

## Vue d'ensemble
Système complet de gestion pour restaurant haïtien avec interface publique et administration.

### Architecture
- **Backend**: FastAPI + Python + MongoDB
- **Frontend**: React + Tailwind CSS
- **Base de données**: MongoDB
- **Authentification**: Système de rôles (Admin/Staff)

### Fonctionnalités principales
✅ **Site public** avec menu haïtien authentique  
✅ **Système de récupération de mot de passe** complet  
✅ **Interface d'administration** pour gestion  
✅ **Gestion des devis** avec notification manuelle  
✅ **Menu dynamique** avec plats traditionnels  
✅ **Système de réservations**  
✅ **Statistiques et tableaux de bord**  

## 🚀 Démarrage rapide

### Prérequis
- Python 3.8+
- Node.js 16+
- MongoDB
- Yarn (pour frontend)

### Installation locale
```bash
# 1. Installer les dépendances backend
cd backend
pip install -r requirements.txt

# 2. Installer les dépendances frontend
cd ../frontend
yarn install

# 3. Démarrer MongoDB
mongod

# 4. Démarrer le backend
cd ../backend
python server.py

# 5. Démarrer le frontend
cd ../frontend
yarn start
```

### Accès applications
- **Site public**: http://localhost:3000
- **Interface admin**: http://localhost:3001 (si séparée)
- **API Backend**: http://localhost:8001
- **API Health**: http://localhost:8001/api/health

## 🛠️ Déploiement

### Debian/Ubuntu VPS
```bash
cd deployment/debian
chmod +x deploy-debian.sh
./deploy-debian.sh
```

### Kubernetes
```bash
cd deployment/k8s
chmod +x deploy-k8s.sh
./deploy-k8s.sh
```

### Docker
```bash
cd deployment/docker
chmod +x deploy-docker.sh
./deploy-docker.sh
```

## 👥 Comptes par défaut

### Comptes administrateurs
- **Admin**: `admin` / `Admin123!`
- **Staff**: `staff` / `Staff123!`

### Emails de récupération
- `admin@dounie-cuisine.ca`
- `staff@dounie-cuisine.ca`

## 🍽️ Menu haïtien authentique

### Plats traditionnels
1. **Poule nan Sos** - 24.99$ CAD
   - Poulet traditionnel en sauce créole
   
2. **Riz Collé aux Pois** - 18.99$ CAD
   - Riz aux haricots rouges, plat national
   
3. **Poisson Gros Sel** - 28.99$ CAD
   - Poisson grillé aux épices créoles

## 📚 Documentation

- [Guide de déploiement](deployment/README.md)
- [Documentation API](docs/api/README.md)
- [Guide utilisateur](docs/USER_GUIDE.md)
- [Tests complets](docs/complete/test_result.md)

## 🧪 Tests

### Lancer les tests
```bash
# Tests backend
cd tests
python backend_test.py

# Tests de charge
node simple-load-test.js
```

### Statut des tests
- ✅ **Backend**: 100% (35/35 tests passés)
- ✅ **Système récupération**: Complet et fonctionnel
- ✅ **Menu haïtien**: Validé et authentique
- ✅ **Performance**: Temps de réponse < 3ms

## 📄 Licence
Projet privé - Dounie Cuisine © 2025

## 🤝 Support
Pour toute question technique, consultez la documentation dans `/docs/`
# Dounie Cuisine - Système de Gestion de Restaurant

## Vue d'ensemble

Dounie Cuisine est un système complet de gestion de restaurant haïtien composé de trois applications distinctes.

## Architecture

```
dounie-cuisine/
├── 🌐 public/              # Application publique clients (Port 3000)
├── ⚙️  administration/      # Interface d'administration (Port 3001)
├── 🔗 api/                 # Backend API REST (Port 5000)
├── 📁 docs/               # Documentation complète
├── 🚀 deploy.sh           # Script de déploiement automatique
└── README.md
```

## Déploiement Rapide

```bash
# Rendre le script exécutable
chmod +x deploy.sh

# Lancer le déploiement complet
./deploy.sh
```

## Applications

### 🌐 Application Publique
- **URL**: `http://localhost:3000`
- **Pour**: Clients et visiteurs
- **Fonctionnalités**: Menu, réservations, commandes, programme fidélité

### ⚙️ Interface d'Administration  
- **URL**: `http://localhost:3001`
- **Pour**: Personnel du restaurant (admin/manager)
- **Fonctionnalités**: Gestion complète du restaurant

### 🔗 API Backend
- **URL**: `http://localhost:5000/api`
- **Pour**: Communication entre applications
- **Fonctionnalités**: Authentification, CRUD, calculs fiscaux

## Configuration Environnement

Variables d'environnement requises :
```bash
DATABASE_URL=postgresql://user:password@localhost/dounie_cuisine
NODE_ENV=production
API_PORT=5000
PUBLIC_PORT=3000
ADMIN_PORT=3001
```

## Documentation

- **Guide utilisateur**: `/docs/USER_GUIDE.md`
- **Guide de déploiement**: `/docs/deployment.md`
- **Documentation technique**: `/docs/README.md`

## Support

Pour questions ou support technique, consultez la documentation dans `/docs`.

---

*Dounie Cuisine - Découvrez l'authenticité de la cuisine haïtienne*
# 🍽️ Dounie Cuisine - Système de Gestion de Restaurant Haïtien/Caribéen

## 📖 Description

Dounie Cuisine est une application complète de gestion de restaurant spécialisée dans la cuisine haïtienne et caribéenne. Le système offre une expérience bilingue (français/créole haïtien) avec deux interfaces distinctes :

- **Application Publique** : Interface client pour consultation du menu, réservations, commandes
- **Interface d'Administration** : Système de gestion complet pour le personnel

## 🌟 Fonctionnalités

### Interface Publique (Clients)
- ✅ Consultation du menu avec thème caribéen
- ✅ Système de réservation en ligne
- ✅ Programme de fidélité avec points
- ✅ Inscription et connexion client
- ✅ Interface bilingue (français/créole)
- ✅ Design responsive adapté mobile

### Interface d'Administration (Staff)
- ✅ Tableau de bord avec statistiques en temps réel
- ✅ Gestion des commandes et réservations
- ✅ Gestion du personnel et des rôles
- ✅ Système de calendrier et planification
- ✅ Gestion financière avec taxes canadiennes
- ✅ Contrôle d'inventaire
- ✅ Système d'annonces et communications

## 🏗️ Architecture Technique

### Frontend
- **React 18** avec TypeScript
- **Vite** pour le build et développement
- **Tailwind CSS** pour le style
- **Shadcn/ui** pour les composants
- **Wouter** pour le routing
- **TanStack Query** pour la gestion d'état

### Backend
- **Express.js** avec TypeScript
- **PostgreSQL** avec Drizzle ORM
- **Session-based authentication**
- **bcrypt** pour le hachage des mots de passe

### Sécurité
- Authentification basée sur les rôles
- Protection contre l'injection SQL
- Validation des données avec Zod
- Sessions sécurisées

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+
- PostgreSQL (fourni par Replit)
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone [URL_DU_REPO]
cd dounie-cuisine

# Installer les dépendances
npm install
cd api && npm install
cd ../public && npm install
cd ../administration && npm install
cd ..

# Démarrer en mode développement
npm run dev
```

### Variables d'Environnement
```env
DATABASE_URL=postgresql://user:password@host:port/database
NODE_ENV=development
SESSION_SECRET=your-secret-key
```

## 👥 Comptes de Test

### Administrateur
- **Username:** admin
- **Password:** admin123
- **Accès:** Interface d'administration complète

### Staff Managers
- **Username:** lucie.manager
- **Password:** staff123
- **Accès:** Gestion et supervision

### Staff Members
- **Username:** marc.staff, sarah.staff, david.staff
- **Password:** staff123
- **Accès:** Opérations courantes

### Clients Test
- **Username:** marie.delorme, jean.baptiste, etc.
- **Password:** client123
- **Accès:** Interface publique uniquement

## 🧪 Tests et Simulation

### Générateur de Trafic
```bash
node test-traffic-generator.js
```
Ce script génère automatiquement :
- 20 comptes clients
- 50 commandes de test
- 30 réservations
- Activité administrateur simulée

### Tests Automatisés
- Tests d'authentification et sécurité
- Tests de fonctionnalités CRUD
- Tests d'intégration API
- Tests de performance

## 📊 Données de Test Incluses

L'application est pré-remplie avec :
- ✅ Menu haïtien authentique (5+ plats)
- ✅ 20+ clients de test
- ✅ 150+ commandes simulées
- ✅ 50+ réservations
- ✅ Personnel complet (admin, managers, staff)
- ✅ Données financières et inventaire
- ✅ Événements de calendrier

## 🔧 Déploiement

### Sur Replit
```bash
# Déploiement automatique avec nginx
./deploy.sh
```

### Configuration Nginx
- Port 80 : Application publique
- Port 3001 : Interface d'administration
- Port 5000 : API Backend

## 📱 Utilisation

### Clients
1. Accéder à l'application publique
2. S'inscrire ou se connecter
3. Explorer le menu caribéen
4. Faire des réservations
5. Gagner des points de fidélité

### Personnel
1. Accéder à `/admin`
2. Se connecter avec les identifiants staff
3. Gérer les commandes et réservations
4. Consulter les statistiques
5. Administrer le système

## 🌍 Internationalisation

- **Français** : Interface principale
- **Créole Haïtien** : Traductions authentiques
- **Anglais** : Support secondaire

## 📈 Fonctionnalités Métier

### Comptabilité Canadienne
- Calcul automatique GST (5%)
- Calcul automatique QST (9.975%)
- Rapports financiers
- Gestion de la paie

### Système de Fidélité
- Points par achat (1 point = 1$)
- Récompenses personnalisées
- Promotions saisonnières

### Thèmes Festifs
- Thème haïtien par défaut
- Animations caribéennes
- Adaptations saisonnières

## 🛡️ Sécurité

- Authentification multi-rôles
- Hachage bcrypt des mots de passe
- Protection CSRF
- Validation stricte des entrées
- Sessions sécurisées

## 📝 Logs et Monitoring

- Logs d'authentification
- Monitoring des performances
- Alertes de sécurité
- Statistiques d'utilisation

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commiter les changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Support

Pour toute question ou problème :
- Ouvrir une issue GitHub
- Contacter l'équipe de développement
- Consulter la documentation

---

**Bon Apeti! • Bon Appétit! • Good Appetite!** 🇭🇹🍽️
# RSManager

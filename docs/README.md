# Dounie Cuisine - Restaurant Management System

## Vue d'ensemble

Dounie Cuisine est un système de gestion de restaurant haïtien complet avec site web public et interface d'administration. L'application propose des services de restaurant, traiteur, DJ et organisation d'événements.

## Fonctionnalités

### Site Public
- **Page d'accueil** : Présentation authentique haïtienne avec couleurs du drapeau
- **Menu interactif** : 15 plats haïtiens traditionnels avec filtres et recherche
- **Galerie photos** : 24 images organisées par catégories (Plats, Restaurant, Équipe, Événements)
- **Système de réservations** : Formulaire flexible pour tous types d'événements
- **Contact** : Formulaire de contact, informations pratiques et carte
- **Authentification** : Inscription et connexion pour clients et personnel

### Interface d'Administration
- **Tableau de bord** : Statistiques en temps réel et vue d'ensemble
- **Gestion menu** : CRUD complet des plats avec photos et descriptions
- **Gestion réservations** : Traitement et suivi des demandes clients
- **Gestion galerie** : Upload et organisation des photos par catégories
- **Gestion utilisateurs** : Administration des comptes clients et personnel
- **Système d'inventaire** : Suivi des stocks et approvisionnements
- **Comptabilité** : Transactions financières et reporting
- **Événements** : Planification et gestion du calendrier

### Services Proposés
- **Restaurant** : Service sur place avec ambiance haïtienne authentique
- **Traiteur** : Service à domicile pour événements privés
- **DJ/Animation** : Services musicaux avec spécialité kompa
- **Organisation d'événements** : Mariages, baptêmes, fêtes d'entreprise, festivals culturels

## Architecture Technique

### Frontend
- **React 18** avec TypeScript
- **Vite** pour le développement et build
- **Wouter** pour le routing client
- **TanStack Query** pour la gestion d'état serveur
- **Shadcn/ui** + **Radix UI** pour les composants
- **Tailwind CSS** pour le styling
- **React Hook Form** + **Zod** pour les formulaires

### Backend
- **Node.js** avec **Express.js**
- **TypeScript** pour la sécurité des types
- **PostgreSQL** comme base de données
- **Drizzle ORM** pour l'accès aux données
- **bcrypt** pour le hashage des mots de passe
- **express-session** pour la gestion des sessions

### Base de Données
- **PostgreSQL 16** avec tables optimisées
- **Drizzle ORM** pour les migrations et requêtes
- **Relations** complètes entre toutes les entités
- **Indexation** pour les performances

## Installation et Déploiement

### Prérequis
- Node.js 18+ et npm
- PostgreSQL 16+
- Nginx (pour déploiement production)

### Installation Locale
```bash
# Cloner le projet
git clone <repository-url>
cd dounie-cuisine

# Installer les dépendances
npm install

# Configuration base de données
createdb dounie_cuisine
export DATABASE_URL="postgresql://user:password@localhost:5432/dounie_cuisine"

# Initialiser la base de données
npm run db:push

# Démarrer en développement
npm run dev
```

### Déploiement Production
Utiliser le script automatisé fourni :
```bash
# Rendre le script exécutable
chmod +x deploy.sh

# Exécuter le déploiement
sudo ./deploy.sh
```

## Configuration

### Variables d'Environnement
```
DATABASE_URL=postgresql://user:password@localhost:5432/dounie_cuisine
NODE_ENV=production
PORT=5000
SESSION_SECRET=your-super-secret-key-here
```

### Comptes par Défaut
- **Super Admin** : `admin` / `admin123`
- **Manager** : Créer via interface d'inscription
- **Staff** : Créer via interface d'inscription
- **Client** : Créer via interface d'inscription

## Utilisation

### Pour les Clients
1. Visiter le site public
2. Explorer le menu et la galerie
3. Faire une réservation avec formulaire flexible
4. Créer un compte pour suivi des réservations
5. Contacter pour services spécialisés (traiteur, DJ, événements)

### Pour le Personnel
1. Se connecter via `/login` avec identifiants fournis
2. Accéder au tableau de bord selon les permissions
3. Gérer les réservations et commandes
4. Mettre à jour le menu et la galerie
5. Suivre l'inventaire et les finances

### Pour les Administrateurs
1. Accès complet à toutes les fonctionnalités
2. Gestion des utilisateurs et permissions
3. Configuration des thèmes et annonces
4. Rapports financiers et statistiques
5. Sauvegarde et maintenance système

## Structure des Fichiers

```
dounie-cuisine/
├── client/               # Application React
│   ├── src/
│   │   ├── pages/       # Pages React
│   │   │   ├── public/  # Pages publiques
│   │   │   └── admin/   # Interface admin
│   │   ├── components/  # Composants réutilisables
│   │   ├── hooks/       # Hooks personnalisés
│   │   ├── lib/         # Utilitaires
│   │   └── styles/      # Thèmes CSS
├── server/              # API Express
│   ├── routes/          # Routes API
│   ├── services/        # Services métier
│   └── storage/         # Accès données
├── shared/              # Types partagés
├── docs/                # Documentation
└── scripts/             # Scripts de déploiement
```

## Support et Maintenance

### Surveillance
- Logs applicatifs dans `/var/log/dounie-cuisine/`
- Métriques PostgreSQL via `pg_stat_statements`
- Monitoring Nginx via access/error logs

### Sauvegarde
```bash
# Sauvegarde base de données
pg_dump dounie_cuisine > backup_$(date +%Y%m%d).sql

# Sauvegarde fichiers
tar -czf files_backup_$(date +%Y%m%d).tar.gz /var/www/html/dounie-cuisine/
```

### Mise à Jour
```bash
# Pull dernières modifications
git pull origin main

# Réinstaller dépendances si nécessaire
npm install

# Redémarrer services
sudo systemctl restart dounie-cuisine
sudo systemctl reload nginx
```

## Licences et Crédits

- **Framework** : React, Express.js (MIT)
- **UI Components** : Shadcn/ui, Radix UI (MIT)
- **Base de données** : PostgreSQL (PostgreSQL License)
- **Thème** : Design authentique haïtien original
- **Icons** : Lucide React (ISC License)

## Contact Support

Pour support technique ou questions :
- **Email** : support@dounie-cuisine.com
- **Documentation** : `/docs/`
- **Issues** : GitHub Issues

---

**Dounie Cuisine** - Goûtez l'authenticité de la cuisine haïtienne
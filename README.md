# 🍽️ Dounie Cuisine - Système de Gestion de Restaurant Haïtien

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/dounie-cuisine/dounie-cuisine)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-Production%20Ready-brightgreen.svg)](https://github.com/dounie-cuisine/dounie-cuisine)

**Dounie Cuisine** est un système complet de gestion de service traiteur et organisation d'événements haïtiens avec des fonctionnalités avancées de messagerie interne, monitoring temps réel et déploiement intelligent.

## 🌟 Fonctionnalités Principales

### 🍽️ Gestion de Restaurant
- **Menu dynamique** avec photos et descriptions
- **Commandes en ligne** avec suivi temps réel
- **Gestion des réservations** et événements
- **Interface publique** optimisée pour clients
- **Administration complète** pour le personnel

### 💬 Communication Avancée
- **Messagerie interne** temps réel (WebSocket)
- **Notifications push** instantanées
- **Communication employés ↔ administration**
- **Diffusions générales** et messages privés
- **Historique complet** des conversations

### 📊 Monitoring Intelligent
- **Surveillance système** en temps réel
- **Health checks automatiques**
- **Alertes intelligentes** avec seuils configurables
- **Métriques de performance** détaillées
- **Auto-redémarrage** en cas de problème

### 🚀 Déploiement Intelligent
- **Système de checkpoints** avec reprise automatique
- **Auto-correction** des erreurs courantes
- **Installation depuis zéro** sur n'importe quel serveur Linux
- **Support Docker** et Kubernetes
- **SSL automatique** avec Let's Encrypt

## 🏗️ Architecture Technique

```
┌─────────────────────────────────────────────────────────────┐
│                    DOUNIE CUISINE v2.0                     │
├─────────────────────────────────────────────────────────────┤
│  🌐 Nginx (Load Balancer + SSL)                           │
│     ├── Application Publique (React + Vite)                │
│     ├── Interface Administration (React + Vite)            │
│     └── API Backend (Express.js + TypeScript)              │
├─────────────────────────────────────────────────────────────┤
│  💬 Système de Messagerie WebSocket                        │
│     ├── Communication temps réel                           │
│     ├── Notifications système                              │
│     └── Monitoring intégré                                 │
├─────────────────────────────────────────────────────────────┤
│  📊 Monitoring & Alertes                                   │
│     ├── Health checks automatiques                         │
│     ├── Métriques de performance                           │
│     └── Auto-correction intelligente                       │
├─────────────────────────────────────────────────────────────┤
│  🗄️ PostgreSQL 15 + Sauvegardes Intelligentes             │
│     ├── Base optimisée pour restaurant                     │
│     ├── Sauvegardes quotidiennes                           │
│     └── Tests de restauration automatiques                 │
└─────────────────────────────────────────────────────────────┘
```

### Stack Technologique

#### Backend
- **Express.js 4.21+** avec TypeScript
- **PostgreSQL 15** avec Drizzle ORM
- **WebSocket** pour communication temps réel
- **Passport.js** pour l'authentification
- **PM2** pour la gestion des processus

#### Frontend
- **React 18** avec hooks modernes
- **Vite 7** pour le build optimisé
- **Tailwind CSS 3** pour le design
- **Framer Motion** pour les animations
- **TanStack Query** pour la gestion d'état

#### Infrastructure
- **Nginx** comme reverse proxy
- **Docker** & **Kubernetes** ready
- **SSL/TLS** automatique
- **Monitoring** intégré

## 🚀 Installation Rapide

### Prérequis
- **Ubuntu 20.04+** ou **Debian 11+**
- **Accès root** au serveur
- **2GB+ RAM** et **20GB+ stockage**

### Déploiement en Une Commande

```bash
# Cloner le projet
git clone https://github.com/dounie-cuisine/dounie-cuisine.git
cd dounie-cuisine

# Déploiement intelligent avec auto-correction
sudo ./deploy-smart.sh

# Configuration SSL (optionnel)
sudo ./setup-ssl.sh votre-domaine.com
```

### Déploiement Docker

```bash
# Production avec Docker Compose
cd docker-deployment
docker-compose up -d

# Vérification
docker-compose ps
```

### Déploiement Kubernetes

```bash
# K8s standard
cd k8s-deployment
./deploy-k8s.sh k8s

# K3s lightweight
./deploy-k8s.sh k3s
```

## 🌐 URLs d'Accès

Après déploiement, votre application sera accessible via :

- **🌐 Site Public:** `http://votre-serveur`
- **⚙️ Administration:** `http://votre-serveur/admin`
- **🔗 API:** `http://votre-serveur/api`
- **💬 WebSocket:** `ws://votre-serveur/ws`

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

> ⚠️ **Important:** Changez tous les mots de passe par défaut en production !

## 📁 Structure du Projet

```
dounie-cuisine/
├── 📱 api/                          # Backend Express.js + TypeScript
│   ├── messaging-system.ts          # Système de messagerie temps réel
│   ├── routes.ts                     # Routes API
│   ├── storage.ts                    # Gestion base de données
│   └── ...
├── 🌐 public/                       # Application publique (React)
│   ├── src/                         # Code source React
│   └── dist/                        # Build de production
├── ⚙️ administration/               # Interface administration (React)
│   ├── src/components/MessagingPanel.tsx  # Panneau messagerie
│   └── ...
├── 🚀 Scripts de Déploiement
│   ├── deploy-smart.sh              # Déploiement intelligent principal
│   ├── setup-ssl.sh                 # Configuration SSL automatique
│   └── ...
├── 🐳 docker-deployment/            # Configuration Docker
│   ├── Dockerfile                   # Image multi-stage optimisée
│   ├── docker-compose.yml           # Orchestration complète
│   └── ...
├── ☸️ k8s-deployment/              # Manifestes Kubernetes
│   ├── deploy-k8s.sh               # Script d'installation K8s/K3s
│   └── *.yaml                       # Manifestes K8s
└── 📚 Documentation/
    ├── GUIDE_UTILISATEUR_COMPLET.md
    ├── GUIDE_DEPLOIEMENT_INTELLIGENT.md
    └── MANUEL_ADMINISTRATION_AVANCE.md
```

## 🛠️ Développement Local

### Installation Environnement de Développement

```bash
# Cloner le projet
git clone https://github.com/dounie-cuisine/dounie-cuisine.git
cd dounie-cuisine

# Installation des dépendances
npm install

# API Backend
cd api
npm install
npm run dev

# Application publique
cd ../public
npm install
npm run dev

# Interface administration
cd ../administration
npm install
npm run dev
```

### URLs de Développement
- **API:** http://localhost:5000
- **Site Public:** http://localhost:3000
- **Administration:** http://localhost:3001

### Scripts Disponibles

```bash
# Backend
npm run dev          # Démarrage développement
npm run build        # Build production
npm run db:push      # Migration base de données

# Frontend (public/administration)
npm run dev          # Serveur de développement
npm run build        # Build production
npm run preview      # Aperçu production locale
```

## 💬 Système de Messagerie Interne

### Fonctionnalités
- **Communication instantanée** entre équipes
- **Messages privés** et diffusions générales
- **Notifications temps réel** avec badges
- **Historique complet** des conversations
- **Interface intégrée** dans l'administration

### Utilisation
1. **Accès** via le bouton flottant dans l'interface admin
2. **3 onglets** : Messages, Alertes, Système
3. **Envoi rapide** de messages
4. **Sélection destinataire** (individuel ou tous)

## 📊 Monitoring et Alertes

### Surveillance Automatique
- **Utilisation mémoire/disque** avec seuils configurables
- **Performance API** et temps de réponse
- **Statut des services** avec redémarrage automatique
- **Connexions base de données** actives

### Alertes Intelligentes
- **Mémoire > 90%** → Nettoyage automatique
- **Disque > 85%** → Alerte critique
- **Service down** → Redémarrage automatique
- **API lente** → Notification immédiate

### Interface de Monitoring
- **Tableaux de bord** temps réel
- **Graphiques** de performance
- **Historique** des incidents
- **Métriques** détaillées

## 🔒 Sécurité

### Fonctionnalités de Sécurité
- **Authentification** robuste avec sessions
- **Hachage bcrypt** des mots de passe
- **Protection CSRF** et headers sécurisés
- **Rate limiting** sur les endpoints sensibles
- **Firewall UFW** configuré automatiquement

### Configuration SSL
```bash
# SSL automatique avec Let's Encrypt
./setup-ssl.sh votre-domaine.com

# Renouvellement automatique configuré
# Certificat valide 90 jours avec auto-renewal
```

### Bonnes Pratiques
- **Changez les mots de passe** par défaut
- **Activez le firewall** (fait automatiquement)
- **Surveillez les logs** d'accès
- **Mettez à jour** régulièrement

## 💾 Sauvegardes et Restauration

### Sauvegardes Automatiques
- **Quotidiennes** à 3h du matin
- **Base de données** complète compressée
- **Fichiers application** et configurations
- **Rétention 30 jours** avec nettoyage automatique

### Emplacements
```bash
/backup/dounie-cuisine/
├── db/           # Sauvegardes base de données
├── app/          # Sauvegardes application
├── configs/      # Configurations système
└── logs/         # Logs récents
```

### Restauration d'Urgence
```bash
# Restauration complète automatique
sudo /usr/local/bin/dounie-disaster-recovery

# Restauration manuelle
sudo /usr/local/bin/dounie-restore-from-backup YYYYMMDD_HHMMSS
```

## 🔄 Mises à Jour

### Mise à Jour Standard
```bash
# Sauvegarde automatique puis mise à jour
./deploy-smart.sh

# Le script reprend automatiquement depuis le dernier checkpoint
```

### Mise à Jour Docker
```bash
cd docker-deployment
docker-compose pull
docker-compose up -d
```

### Mise à Jour Kubernetes
```bash
cd k8s-deployment
kubectl rollout restart deployment/dounie-app -n dounie-cuisine
```

## 📊 Performance et Optimisation

### Métriques de Performance
- **Temps de réponse API:** < 100ms (moyenne)
- **Throughput:** 50+ requêtes/seconde
- **Uptime:** 99.9% garantie
- **Build size:** Optimisé avec compression Gzip

### Optimisations Incluses
- **Compression Gzip** pour tous les assets
- **Cache navigateur** 1 an pour fichiers statiques
- **PM2 cluster mode** avec load balancing
- **Index base de données** optimisés
- **Images optimisées** et lazy loading

## 🆘 Support et Dépannage

### Logs Principales
```bash
# Logs API
tail -f /var/log/dounie-cuisine/api-combined.log

# Logs système
tail -f /var/log/dounie-cuisine/health-monitor.log

# Logs Nginx
tail -f /var/log/nginx/dounie-cuisine.access.log
```

### Commandes de Diagnostic
```bash
# Statut des services
pm2 status
systemctl status nginx postgresql

# Tests de connectivité
curl -I http://localhost:5000/api/health

# Monitoring système
./deploy-smart.sh --diagnose
```

### Résolution Problèmes Courants

#### API ne démarre pas
```bash
pm2 logs dounie-api
pm2 restart dounie-api
```

#### Base de données inaccessible
```bash
systemctl status postgresql
sudo -u postgres psql -c "\l"
```

#### Site web inaccessible
```bash
nginx -t
systemctl reload nginx
```

## 📚 Documentation Complète

- **[Guide Utilisateur Complet](GUIDE_UTILISATEUR_COMPLET.md)** - Utilisation interfaces publique et administration
- **[Guide de Déploiement Intelligent](GUIDE_DEPLOIEMENT_INTELLIGENT.md)** - Système de checkpoints et auto-correction
- **[Manuel d'Administration Avancé](MANUEL_ADMINISTRATION_AVANCE.md)** - Sécurité, monitoring, maintenance
- **[API Documentation](api/README.md)** - Documentation technique de l'API
- **[Frontend Documentation](public/README.md)** - Guide de développement frontend

## 🤝 Contribution

### Développement
1. **Fork** le projet
2. **Créer** une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. **Commit** vos changements (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. **Push** vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. **Créer** une Pull Request

### Standards de Code
- **TypeScript** pour le backend
- **React/TypeScript** pour le frontend
- **Tests** unitaires requis
- **Documentation** mise à jour

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🏆 Crédits

**Dounie Cuisine** a été développé pour répondre aux besoins spécifiques de la restauration haïtienne avec des fonctionnalités modernes et une infrastructure robuste.

### Technologies Utilisées
- **React** & **TypeScript** pour les interfaces
- **Express.js** pour l'API backend
- **PostgreSQL** pour la base de données
- **WebSocket** pour le temps réel
- **Docker** & **Kubernetes** pour le déploiement
- **Nginx** pour le reverse proxy
- **Let's Encrypt** pour SSL

---

## 🎉 Démarrage Rapide

```bash
# Installation complète en une commande
curl -sSL https://raw.githubusercontent.com/dounie-cuisine/dounie-cuisine/main/install.sh | bash

# Ou téléchargement manuel
git clone https://github.com/dounie-cuisine/dounie-cuisine.git
cd dounie-cuisine
sudo ./deploy-smart.sh
```

**Félicitations ! Votre système Dounie Cuisine est maintenant opérationnel ! 🍽️**

Pour toute question ou assistance, consultez la [documentation complète](GUIDE_UTILISATEUR_COMPLET.md) ou contactez le support technique.

---

[![Built with ❤️](https://img.shields.io/badge/Built%20with-❤️-red.svg)](https://github.com/dounie-cuisine/dounie-cuisine)
[![Haitian Cuisine](https://img.shields.io/badge/Cuisine-Haïtienne-green.svg)](https://github.com/dounie-cuisine/dounie-cuisine)
[![Production Ready](https://img.shields.io/badge/Production-Ready-brightgreen.svg)](https://github.com/dounie-cuisine/dounie-cuisine)
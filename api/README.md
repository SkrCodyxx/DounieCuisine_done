# 🔗 API Backend - Dounie Cuisine

## Vue d'ensemble

L'API Backend de Dounie Cuisine est construite avec **Express.js + TypeScript** et fournit toutes les fonctionnalités pour la gestion du restaurant, la messagerie temps réel et le monitoring système.

## 🏗️ Architecture

```
api/
├── 📁 dist/                    # Build de production
├── 📁 node_modules/            # Dépendances
├── 📁 routes/                  # Routes API organisées
├── 📁 services/                # Services métier
├── 📁 shared/                  # Types et utilitaires partagés
├── 📄 index.ts                 # Point d'entrée principal
├── 📄 routes.ts                # Définition des routes
├── 📄 storage.ts               # Gestion base de données
├── 📄 storage-db.ts            # Schéma Drizzle ORM
├── 📄 messaging-system.ts      # Système de messagerie WebSocket
├── 📄 init-data.ts             # Données d'initialisation
├── 📄 db.ts                    # Configuration base de données
├── 📄 package.json             # Dépendances et scripts
└── 📄 .env                     # Variables d'environnement
```

## 🚀 Démarrage Rapide

### Installation
```bash
cd api
npm install
```

### Configuration Environnement
```bash
# Copier et configurer les variables d'environnement
cp .env.example .env

# Modifier les valeurs selon votre environnement
nano .env
```

### Variables d'Environnement Requises
```env
# Base de données
DATABASE_URL=postgresql://dounie_user:password@localhost:5432/dounie_cuisine

# Application
NODE_ENV=production
SESSION_SECRET=votre_clé_secrète_très_longue

# Ports
API_PORT=5000
PUBLIC_PORT=3000
ADMIN_PORT=3001

# Fonctionnalités avancées
MESSAGING_ENABLED=true
MONITORING_ENABLED=true
REAL_TIME_NOTIFICATIONS=true

# Sécurité
BCRYPT_ROUNDS=12
```

### Scripts Disponibles
```bash
# Développement
npm run dev              # Démarrage avec hot-reload

# Production
npm run build            # Compilation TypeScript
npm run start            # Démarrage production

# Base de données
npm run db:push          # Appliquer le schéma
npm run db:migrate       # Migrations manuelles
```

## 📊 Endpoints API

### 🔐 Authentification & Profil
```http
POST   /api/auth/login          # Connexion utilisateur
POST   /api/auth/logout         # Déconnexion
POST   /api/auth/register       # Inscription (clients)
GET    /api/auth/current-user   # Profil utilisateur authentifié
PUT    /api/auth/profile        # Mettre à jour le profil utilisateur authentifié
```

### 🔑 Réinitialisation de Mot de Passe (Admin & Utilisateur)
```http
POST   /api/admin/generate-password-reset # (Admin) Générer un code pour un utilisateur
GET    /api/admin/password-reset-codes    # (Admin) Voir les codes actifs
POST   /api/auth/verify-reset-code        # Vérifier la validité d'un code
POST   /api/auth/reset-password           # Réinitialiser le mot de passe avec un code valide
```

### 👥 Gestion Utilisateurs & Permissions (Admin)
```http
GET    /api/users                         # (Admin) Liste de tous les utilisateurs
POST   /api/users                         # (Admin) Créer un nouvel utilisateur
# PUT    /api/users/:id                     # (Admin) Modifier utilisateur (à implémenter si besoin au-delà de /api/auth/profile)
# DELETE /api/users/:id                   # (Admin) Supprimer utilisateur (à implémenter si besoin)
GET    /api/admin/role-permissions        # (Admin) Lister les rôles et permissions
POST   /api/admin/role-permissions        # (Admin) Créer un rôle et ses permissions
PUT    /api/admin/role-permissions/:id    # (Admin) Modifier un rôle et ses permissions
```

### 🏢 Gestion des Clients (Staff/Admin)
```http
GET    /api/clients                       # Lister les clients (avec recherche)
POST   /api/clients                       # Créer un client
GET    /api/clients/:id                   # Détails d'un client
PUT    /api/clients/:id                   # Modifier un client
DELETE /api/clients/:id                   # (Admin) Supprimer un client
```

### ⚙️ Paramètres de l'Entreprise (Admin)
```http
GET    /api/company-settings              # Récupérer les paramètres
PUT    /api/company-settings              # Mettre à jour les paramètres
```

### 📝 Gestion des Devis (Staff/Admin)
```http
GET    /api/quotes                        # Lister les devis (avec filtre clientId)
POST   /api/quotes                        # Créer un devis
GET    /api/quotes/:id                    # Détails d'un devis
PUT    /api/quotes/:id                    # Modifier un devis
POST   /api/quotes/:id/send               # Marquer un devis comme envoyé
DELETE /api/quotes/:id                    # (Admin) Supprimer un devis
```

### 🖼️ Gestion des Galeries (Staff/Admin avec permission 'manage_galleries')
```http
GET    /api/galleries                     # Lister les galeries
POST   /api/galleries                     # Créer une galerie
PUT    /api/galleries/:id                 # Modifier une galerie
DELETE /api/galleries/:id               # Supprimer une galerie
GET    /api/gallery-images                # Lister les images (avec filtre galleryId)
POST   /api/gallery-images                # Ajouter une image à une galerie
PUT    /api/gallery-images/:id            # Modifier une image
DELETE /api/gallery-images/:id          # Supprimer une image
```

### 📄 Gestion des Pages de Contenu (Staff/Admin avec permission 'manage_content')
```http
GET    /api/content-pages                 # Lister toutes les pages
POST   /api/content-pages                 # Créer une page
GET    /api/content-pages/:slug           # Récupérer une page par son slug
PUT    /api/content-pages/:id             # Modifier une page
DELETE /api/content-pages/:id           # Supprimer une page
```

### ✉️ Messages Clients (Formulaire de Contact) (Staff/Admin)
```http
GET    /api/customer-messages             # Lister les messages (avec filtre non lus)
POST   /api/customer-messages             # (Public) Envoyer un message via formulaire de contact
PUT    /api/customer-messages/:id         # Marquer un message (ex: comme lu)
```

### 💬 Messagerie Interne (Employés authentifiés)
```http
GET    /api/internal-messages             # Lister les messages reçus ou envoyés
POST   /api/internal-messages             # Envoyer un message interne
PUT    /api/internal-messages/:id         # Marquer un message (ex: comme lu)
DELETE /api/internal-messages/:id       # Supprimer un message (logique soft delete)
```

### 💬 Messagerie Client (Admin <-> Client) (Staff)
```http
GET    /api/client-messages               # Lister les conversations (avec filtre clientId)
POST   /api/client-messages               # (Staff) Envoyer un message à un client
```

### 🍽️ Gestion du Menu (Staff/Admin avec permission 'manage_menu')
```http
GET    /api/menu                          # Menu complet (public)
POST   /api/menu                          # Ajouter un article au menu
PUT    /api/menu/:id                      # Modifier un article du menu
DELETE /api/menu/:id                    # Supprimer un article du menu
PUT    /api/menu/:id/price                # Mettre à jour le prix d'un article
PUT    /api/menu/:id/photo                # Mettre à jour la photo d'un article
```

### 📢 Gestion des Annonces (Staff/Admin avec permission 'manage_announcements')
```http
GET    /api/announcements                 # Lister les annonces (avec filtres)
POST   /api/announcements                 # Créer une annonce
PUT    /api/announcements/:id             # Modifier une annonce
```

### 📋 Gestion des Commandes (Staff/Auth)
```http
GET    /api/orders                        # (Staff) Lister toutes les commandes
POST   /api/orders                        # (Auth) Créer une commande
PUT    /api/orders/:id                    # (Staff) Modifier une commande (ex: statut)
# GET    /api/orders/:id                    # Détails commande (implicite ou à ajouter)
```

### 🎉 Gestion des Réservations (Staff/Public)
```http
GET    /api/reservations                  # (Staff) Lister toutes les réservations
POST   /api/reservations                  # (Public/Auth) Créer une réservation
GET    /api/reservations/date/:date       # (Public) Vérifier dispo pour une date
PUT    /api/reservations/:id              # (Staff) Modifier une réservation
```

### 🗓️ Gestion du Calendrier des Employés (Staff)
```http
GET    /api/calendar/events               # Lister les événements (avec filtre de date)
POST   /api/calendar/events               # Créer un événement
PUT    /api/calendar/events/:id           # Modifier un événement
DELETE /api/calendar/events/:id         # Supprimer un événement
```

### 💰 Gestion Financière (Staff avec permissions 'view_financials', 'manage_financials')
```http
GET    /api/finance/transactions          # Lister les transactions (avec filtre de date)
POST   /api/finance/transactions          # Créer une transaction
GET    /api/finance/summary               # Obtenir un résumé financier
POST   /api/finance/calculate-taxes       # Calculer les taxes canadiennes pour un montant
```

### 🎨 Gestion des Thèmes Festifs (Admin)
```http
GET    /api/themes                        # Lister les thèmes
POST   /api/themes                        # Créer un thème
GET    /api/themes/active                 # Obtenir le thème actif
PUT    /api/themes/:id/activate           # Activer un thème
```

### 🎁 Gestion des Récompenses de Fidélité (Admin/Auth)
```http
GET    /api/loyalty/rewards               # Lister les récompenses
POST   /api/loyalty/rewards               # (Admin) Créer une récompense
```

### 📦 Gestion de l'Inventaire (Staff avec permission 'manage_inventory')
```http
GET    /api/inventory                     # Lister les articles d'inventaire
POST   /api/inventory                     # Ajouter un article à l'inventaire
# PUT /api/inventory/:id ...             # TODO: Routes pour modifier/supprimer inventaire
```

### 📊 Statistiques & Santé
```http
GET    /api/ping                          # Ping pour vérifier si l'API est en ligne
GET    /api/health                        # Health check détaillé (si implémenté)
GET    /api/status                        # Statut basique (pour tests)
GET    /api/admin/stats                   # (Staff) Statistiques utilisateur/profil (anciennement /api/auth/profile)
GET    /api/dashboard/stats               # (Staff) Statistiques pour le tableau de bord admin
```

## 💬 Système de Messagerie WebSocket

### Connexion WebSocket
```javascript
// Connexion client
const ws = new WebSocket('ws://localhost:5000/ws?userId=USER_ID');

// Gestion des messages
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  handleMessage(data);
};
```

### Types de Messages
```typescript
interface Message {
  id: string;
  from: string;
  to: string;
  content: string;
  type: 'direct' | 'broadcast' | 'notification';
  timestamp: Date;
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

interface SystemNotification {
  id: string;
  type: 'system' | 'backup' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  resolved: boolean;
}
```

### Envoi de Messages
```javascript
// Message direct
ws.send(JSON.stringify({
  to: 'user_id',
  content: 'Votre message',
  type: 'direct',
  priority: 'normal'
}));

// Diffusion générale
ws.send(JSON.stringify({
  to: 'all',
  content: 'Annonce générale',
  type: 'broadcast',
  priority: 'high'
}));
```

## 📊 Monitoring Système

### Métriques Collectées
- **Performance API** (temps de réponse, throughput)
- **Utilisation ressources** (mémoire, CPU, disque)
- **Connexions base de données** actives
- **Sessions utilisateurs** actives
- **Erreurs et exceptions**

### Health Checks
```http
GET /api/health
```

Réponse:
```json
{
  "status": "ok",
  "timestamp": "2025-06-25T14:30:22Z",
  "services": {
    "database": "connected",
    "messaging": "active",
    "monitoring": "running"
  },
  "metrics": {
    "uptime": 86400,
    "memory_usage": 62.3,
    "response_time": 89
  }
}
```

## 🗄️ Base de Données

### Schéma Principal (basé sur `shared/schema.ts`)
Voici les principales tables utilisées par l'application (liste non exhaustive des champs) :

*   **`users`**: Informations des utilisateurs (clients, employés, admins).
    *   `(id, username, email, password, role, firstName, lastName, etc.)`
*   **`rolePermissions`**: Définit les permissions pour chaque rôle.
    *   `(id, roleName, permissionsJson, etc.)`
*   **`clients`**: Informations spécifiques aux clients (pour CRM).
    *   `(id, firstName, lastName, email, phoneNumber, company, address, source, etc.)`
*   **`companySettings`**: Paramètres globaux de l'entreprise.
    *   `(id, companyName, logoUrl, defaultTaxRate, currency, etc.)`
*   **`menuItems`**: Articles du menu.
    *   `(id, name, description, category, price, imageUrl, isAvailable, etc.)`
*   **`orders`**: Commandes passées par les clients.
    *   `(id, userId, clientId, itemsJson, totalAmount, gstAmount, qstAmount, status, orderType, etc.)`
*   **`reservations`**: Réservations de tables ou d'événements.
    *   `(id, userId, guestName, partySize, dateTime, status, confirmationCode, etc.)`
*   **`employees`**: Informations sur les employés (liées à la table `users`).
    *   `(id, userId, position, hireDate, hourlyRate, etc.)`
*   **`calendarEvents`**: Événements du calendrier interne (équipes, réunions).
    *   `(id, title, eventType, startTime, endTime, createdBy, etc.)`
*   **`inventory`**: Gestion des stocks.
    *   `(id, name, currentStock, minimumStock, unit, costPerUnit, etc.)`
*   **`financialTransactions`**: Suivi des transactions financières.
    *   `(id, type, category, amount, date, description, etc.)`
*   **`loyaltyRewards`**: Programme de fidélité.
    *   `(id, name, pointsRequired, discountAmount, etc.)`
*   **`festiveThemes`**: Thèmes pour occasions spéciales.
    *   `(id, name, startDate, endDate, stylesJson, isActive, etc.)`
*   **`announcements`**: Annonces affichées sur le site.
    *   `(id, title, content, position, isActive, createdBy, etc.)`
*   **`quotes`**: Devis pour clients.
    *   `(id, quoteNumber, clientId, itemsJson, totalTTC, status, validityDate, etc.)`
*   **`galleries`**: Galeries de photos.
    *   `(id, name, description, isActive, sortOrder, etc.)`
*   **`galleryImages`**: Images des galeries.
    *   `(id, galleryId, imageUrl, title, sortOrder, etc.)`
*   **`contentPages`**: Pages de contenu personnalisables (ex: "À propos").
    *   `(id, slug, title, content, isActive, showInNavigation, etc.)`
*   **`customerMessages`**: Messages reçus via le formulaire de contact public.
    *   `(id, firstName, email, message, isRead, etc.)`
*   **`internalMessages`**: Messagerie entre employés/admins.
    *   `(id, senderId, recipientId, content, threadId, isRead, etc.)`
*   **`clientMessages`**: Messagerie entre staff et clients enregistrés.
    *   `(id, clientId, senderId, content, sentAt, isReadByClient, isReadByAdmin, etc.)`

> Le schéma exact avec tous les champs et relations est défini dans `api/shared/schema.ts` et appliqué via Drizzle ORM (ou un outil similaire) dans `api/db.ts` et `api/storage-db.ts`.

### Migrations
```bash
# Appliquer le schéma complet
npm run db:push

# Initialiser les données de test
npm run db:seed
```

## 🔒 Sécurité

### Authentification
- **Sessions** sécurisées avec Express-session
- **Hachage bcrypt** pour les mots de passe
- **Protection CSRF** sur toutes les routes

### Autorisation
```typescript
// Middleware d'autorisation par rôle
const requireRole = (role: 'admin' | 'manager' | 'staff') => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: 'Accès interdit' });
    }
    next();
  };
};

// Utilisation
app.get('/api/admin/users', requireRole('admin'), getUsersHandler);
```

### Validation des Données
```typescript
import { z } from 'zod';

// Schéma de validation
const CreateOrderSchema = z.object({
  items: z.array(z.object({
    menu_item_id: z.string().uuid(),
    quantity: z.number().positive()
  })),
  delivery_date: z.string().datetime(),
  special_instructions: z.string().optional()
});

// Validation middleware
const validateBody = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        error: 'Données invalides',
        details: result.error.issues 
      });
    }
    next();
  };
};
```

## ⚡ Performance

### Optimisations Incluses
- **Connection pooling** PostgreSQL
- **Compression gzip** pour les réponses
- **Cache en mémoire** pour les données fréquemment accédées
- **Index optimisés** sur les requêtes courantes

### Métriques de Performance
- **Temps de réponse moyen:** < 100ms
- **Throughput:** 50+ req/sec
- **Memory usage:** < 500MB
- **CPU usage:** < 50%

## 🔧 Configuration PM2

### Fichier de Configuration
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'dounie-api',
    script: 'dist/index.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: '/var/log/dounie-cuisine/api-err.log',
    out_file: '/var/log/dounie-cuisine/api-out.log',
    log_file: '/var/log/dounie-cuisine/api-combined.log',
    time: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    max_memory_restart: '500M'
  }]
};
```

### Commandes PM2
```bash
# Démarrage
pm2 start ecosystem.config.js

# Monitoring
pm2 status
pm2 logs dounie-api
pm2 monit

# Redémarrage
pm2 restart dounie-api

# Arrêt
pm2 stop dounie-api
```

## 📝 Logs et Debugging

### Configuration des Logs
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: '/var/log/dounie-cuisine/api-error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: '/var/log/dounie-cuisine/api-combined.log' 
    })
  ]
});
```

### Emplacements des Logs
```bash
/var/log/dounie-cuisine/
├── api-combined.log      # Tous les logs API
├── api-error.log         # Erreurs uniquement
├── health-monitor.log    # Monitoring système
└── backup.log           # Logs de sauvegarde
```

## 🧪 Tests

### Tests Unitaires
```bash
# Lancer tous les tests
npm test

# Tests avec coverage
npm run test:coverage

# Tests en mode watch
npm run test:watch
```

### Tests d'Intégration
```typescript
import request from 'supertest';
import app from '../index';

describe('API Health Check', () => {
  test('GET /api/health should return 200', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);
    
    expect(response.body.status).toBe('ok');
  });
});
```

## 🔄 Déploiement

### Build de Production
```bash
# Compilation TypeScript
npm run build

# Vérification du build
node dist/index.js
```

### Variables d'Environnement Production
```bash
NODE_ENV=production
DATABASE_URL=postgresql://dounie_user:secure_password@localhost:5432/dounie_cuisine
SESSION_SECRET=super_secure_session_secret_minimum_32_characters
BCRYPT_ROUNDS=12
```

### Commandes de Maintenance
```bash
# Redémarrage sécurisé
pm2 reload dounie-api

# Sauvegarde avant mise à jour
npm run backup

# Mise à jour des dépendances
npm update --production
```

## 📞 Support et Dépannage

### Problèmes Courants

#### API ne démarre pas
```bash
# Vérifier les logs
pm2 logs dounie-api

# Vérifier les variables d'environnement
cat .env

# Tester la connexion DB
npm run db:test
```

#### Connexion base de données échouée
```bash
# Vérifier PostgreSQL
systemctl status postgresql

# Tester la connexion
psql -h localhost -U dounie_user -d dounie_cuisine
```

#### Performance dégradée
```bash
# Monitoring en temps réel
pm2 monit

# Analyse des logs
tail -f /var/log/dounie-cuisine/api-combined.log
```

Pour plus d'assistance, consultez le [Guide d'Administration Avancé](../MANUEL_ADMINISTRATION_AVANCE.md).

---

**API Dounie Cuisine v2.0** - Système robuste et scalable pour la gestion de restaurant moderne 🍽️
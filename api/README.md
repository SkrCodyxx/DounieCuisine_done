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

### 🔐 Authentification
```http
POST   /api/auth/login          # Connexion utilisateur
POST   /api/auth/logout         # Déconnexion
GET    /api/auth/profile        # Profil utilisateur actuel
POST   /api/auth/register       # Inscription (clients)
```

### 👥 Gestion Utilisateurs
```http
GET    /api/users               # Liste des utilisateurs
POST   /api/users               # Créer utilisateur
PUT    /api/users/:id           # Modifier utilisateur
DELETE /api/users/:id           # Supprimer utilisateur
GET    /api/users/:id/profile   # Profil utilisateur spécifique
```

### 🍽️ Gestion du Menu
```http
GET    /api/menu                # Menu complet
GET    /api/menu/categories     # Catégories du menu
GET    /api/menu/items          # Articles du menu
POST   /api/menu/items          # Ajouter article
PUT    /api/menu/items/:id      # Modifier article
DELETE /api/menu/items/:id      # Supprimer article
POST   /api/menu/items/:id/image # Upload image
```

### 📋 Gestion des Commandes
```http
GET    /api/orders              # Liste des commandes
POST   /api/orders              # Créer commande
GET    /api/orders/:id          # Détails commande
PUT    /api/orders/:id          # Modifier commande
PUT    /api/orders/:id/status   # Changer statut
DELETE /api/orders/:id          # Annuler commande
```

### 🎉 Gestion des Événements
```http
GET    /api/events              # Liste des événements
POST   /api/events              # Créer événement
GET    /api/events/:id          # Détails événement
PUT    /api/events/:id          # Modifier événement
DELETE /api/events/:id          # Annuler événement
GET    /api/events/calendar     # Vue calendrier
```

### 💬 Messagerie Interne
```http
GET    /api/messages            # Messages utilisateur
POST   /api/messages            # Envoyer message
PUT    /api/messages/:id/read   # Marquer comme lu
GET    /api/messages/conversations # Conversations actives
```

### 📊 Monitoring et Statistiques
```http
GET    /api/health              # Health check
GET    /api/stats               # Statistiques générales
GET    /api/stats/sales         # Statistiques ventes
GET    /api/stats/orders        # Statistiques commandes
GET    /api/system/status       # Statut système
GET    /api/system/metrics      # Métriques performance
```

### 🔧 Administration
```http
GET    /api/admin/users         # Gestion utilisateurs
GET    /api/admin/system        # Configuration système
PUT    /api/admin/settings      # Modifier paramètres
GET    /api/admin/logs          # Logs système
POST   /api/admin/backup        # Déclencher sauvegarde
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

### Schéma Principal
```sql
-- Utilisateurs
users (id, username, email, password_hash, role, created_at, is_active)

-- Menu
menu_categories (id, name, description, sort_order)
menu_items (id, category_id, name, description, price, image_url, available)

-- Commandes
orders (id, user_id, total_amount, status, created_at, delivery_date)
order_items (id, order_id, menu_item_id, quantity, unit_price)

-- Événements
events (id, client_id, event_type, event_date, guest_count, budget, status)

-- Messagerie
messages (id, from_user_id, to_user_id, content, type, priority, created_at, read_at)
```

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
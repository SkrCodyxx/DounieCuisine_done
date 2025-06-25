# Manuel d'intégration API - Dounie Cuisine

## Architecture API

L'API de Dounie Cuisine suit une architecture REST moderne avec authentification par session et validation stricte des données.

### URL de base
- **Développement** : `http://localhost:5000/api`
- **Production** : `https://votre-domaine.com/api`

## Authentification

### Connexion
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Réponse succès (200)** :
```json
{
  "user": {
    "id": 1,
    "username": "admin",
    "firstName": "Admin",
    "lastName": "System",
    "role": "admin",
    "email": "admin@dounie.com"
  }
}
```

### Déconnexion
```http
POST /api/auth/logout
```

### Vérification du statut utilisateur
```http
GET /api/user
```

## Endpoints publics (Site client)

### Menu et articles
```http
# Récupérer le menu complet
GET /api/menu

# Articles par catégorie
GET /api/menu?category=plats

# Article spécifique
GET /api/menu/:id
```

**Réponse menu** :
```json
[
  {
    "id": 1,
    "name": "Griot Traditionnel",
    "nameEn": "Traditional Griot",
    "description": "Porc mariné et frit, spécialité haïtienne",
    "descriptionEn": "Marinated and fried pork, Haitian specialty",
    "category": "plats",
    "price": "18.50",
    "isAvailable": true,
    "isFestive": false,
    "allergies": ["gluten"],
    "ingredients": ["porc", "épices", "citron"],
    "preparationTime": 25,
    "calories": 420
  }
]
```

### Thèmes et personnalisation
```http
# Thème actif
GET /api/themes/active

# Tous les thèmes
GET /api/themes
```

### Annonces publiques
```http
GET /api/announcements/active
```

### Images placeholder
```http
GET /api/placeholder/:width/:height
```

## Endpoints réservations (Site client)

### Créer une réservation
```http
POST /api/reservations
Content-Type: application/json

{
  "guestName": "Jean Dupont",
  "guestEmail": "jean@email.com",
  "guestPhone": "514-555-0123",
  "partySize": 4,
  "dateTime": "2024-02-15T19:00:00Z",
  "specialRequests": "Table près de la fenêtre",
  "occasion": "anniversary"
}
```

### Vérifier disponibilité
```http
GET /api/reservations/availability?date=2024-02-15&time=19:00&partySize=4
```

## Endpoints administration (Accès restreint)

### Gestion des employés
```http
# Liste des employés
GET /api/admin/employees

# Créer un employé
POST /api/admin/employees
{
  "firstName": "Marie",
  "lastName": "Leblanc",
  "email": "marie@dounie.com",
  "username": "marie.leblanc",
  "password": "motdepasse123",
  "role": "staff",
  "position": "Serveuse",
  "department": "service",
  "hourlyRate": "18.00"
}

# Modifier un employé
PUT /api/admin/employees/:id

# Supprimer un employé
DELETE /api/admin/employees/:id
```

### Gestion du menu (Admin)
```http
# Ajouter un article
POST /api/admin/menu
{
  "name": "Nouveau plat",
  "nameEn": "New dish",
  "description": "Description du plat",
  "descriptionEn": "Dish description",
  "category": "plats",
  "price": "22.00",
  "isAvailable": true,
  "allergies": ["lactose"],
  "ingredients": ["ingredient1", "ingredient2"],
  "preparationTime": 30
}

# Modifier un article
PUT /api/admin/menu/:id

# Supprimer un article
DELETE /api/admin/menu/:id
```

### Gestion des commandes
```http
# Liste des commandes
GET /api/admin/orders

# Commandes filtrées
GET /api/admin/orders?status=pending&date=2024-02-15

# Mettre à jour le statut
PUT /api/admin/orders/:id/status
{
  "status": "confirmed"
}
```

### Gestion des réservations (Admin)
```http
# Réservations par date
GET /api/admin/reservations?date=2024-02-15

# Créer réservation (admin)
POST /api/admin/reservations

# Modifier réservation
PUT /api/admin/reservations/:id

# Changer statut
PUT /api/admin/reservations/:id/status
{
  "status": "confirmed"
}
```

### Gestion de l'inventaire
```http
# Liste inventaire
GET /api/admin/inventory

# Ajouter article inventaire
POST /api/admin/inventory
{
  "name": "Riz blanc",
  "category": "ingredients",
  "currentStock": 50,
  "minimumStock": 10,
  "unit": "kg",
  "costPerUnit": "3.50",
  "supplier": "Distributeur ABC",
  "location": "Garde-manger"
}

# Modifier stock
PUT /api/admin/inventory/:id
{
  "currentStock": 45
}
```

### Gestion financière
```http
# Résumé financier
GET /api/admin/finances/summary?period=month

# Transactions
GET /api/admin/finances/transactions?period=week&type=income

# Ajouter transaction
POST /api/admin/finances/transactions
{
  "type": "expense",
  "category": "ingredients",
  "amount": "150.00",
  "description": "Achat légumes frais",
  "date": "2024-02-15",
  "paymentMethod": "card"
}
```

### Gestion du calendrier
```http
# Événements par date
GET /api/admin/calendar/events?date=2024-02-15&type=shift

# Créer événement
POST /api/admin/calendar/events
{
  "title": "Équipe du soir",
  "description": "Service de 17h à 23h",
  "eventType": "shift",
  "startTime": "2024-02-15T17:00:00Z",
  "endTime": "2024-02-15T23:00:00Z",
  "location": "Restaurant",
  "attendees": [1, 2, 3],
  "priority": "normal"
}
```

### Statistiques et tableaux de bord
```http
# Stats tableau de bord
GET /api/admin/dashboard/stats

# Données analytics
GET /api/admin/analytics?period=month&metric=revenue
```

## Gestion des erreurs

### Codes de statut HTTP
- **200** : Succès
- **201** : Créé avec succès
- **400** : Erreur de validation
- **401** : Non authentifié
- **403** : Non autorisé
- **404** : Non trouvé
- **500** : Erreur serveur

### Format des erreurs
```json
{
  "error": true,
  "message": "Description de l'erreur",
  "details": {
    "field": "Détail spécifique"
  }
}
```

### Erreurs communes
```json
// Validation échouée
{
  "error": true,
  "message": "Validation failed",
  "details": {
    "email": "Email is required",
    "price": "Price must be a positive number"
  }
}

// Non autorisé
{
  "error": true,
  "message": "Access denied. Admin role required."
}

// Ressource non trouvée
{
  "error": true,
  "message": "Menu item not found"
}
```

## Authentification et autorisation

### Niveaux d'accès
- **Public** : Accès libre (menu, thèmes, annonces)
- **Client** : Réservations personnelles
- **Staff** : Commandes et service
- **Manager** : Gestion équipe et opérations
- **Admin** : Accès complet

### Headers requis
```http
# Pour les requêtes authentifiées
Cookie: connect.sid=session_id_value

# Type de contenu
Content-Type: application/json
```

## Intégration site public

### Récupération du menu
```javascript
// Exemple JavaScript pour site public
async function loadMenu() {
  try {
    const response = await fetch('/api/menu');
    const menu = await response.json();
    
    // Filtrer par catégorie
    const entrees = menu.filter(item => item.category === 'entrees');
    const plats = menu.filter(item => item.category === 'plats');
    
    return { entrees, plats };
  } catch (error) {
    console.error('Erreur chargement menu:', error);
  }
}
```

### Création de réservation
```javascript
async function createReservation(reservationData) {
  try {
    const response = await fetch('/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reservationData)
    });
    
    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Erreur création réservation:', error);
    throw error;
  }
}
```

## Intégration administration

### Authentification admin
```javascript
async function adminLogin(username, password) {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    if (response.ok) {
      const user = await response.json();
      
      // Vérifier les permissions admin
      if (user.role === 'admin' || user.role === 'manager') {
        return user;
      } else {
        throw new Error('Accès administrateur requis');
      }
    } else {
      throw new Error('Identifiants incorrects');
    }
  } catch (error) {
    console.error('Erreur connexion admin:', error);
    throw error;
  }
}
```

### Gestion des données admin
```javascript
// Hook React pour données administrateur
function useAdminData(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/admin/${endpoint}`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [endpoint]);
  
  return { data, loading, error };
}
```

## Validation des données

### Schémas de validation (côté client)
```javascript
// Validation réservation
const reservationSchema = {
  guestName: { required: true, minLength: 2 },
  guestEmail: { required: true, type: 'email' },
  guestPhone: { required: true, pattern: /^[\+]?[1-9][\d]{0,15}$/ },
  partySize: { required: true, min: 1, max: 20 },
  dateTime: { required: true, type: 'datetime' }
};

// Validation menu item
const menuItemSchema = {
  name: { required: true, minLength: 2 },
  description: { required: true, minLength: 10 },
  category: { required: true, enum: ['entrees', 'plats', 'desserts', 'boissons'] },
  price: { required: true, type: 'number', min: 0 }
};
```

## Performance et cache

### Stratégies de cache
- **Menu** : Cache 5 minutes (données statiques)
- **Thèmes** : Cache 1 heure
- **Stats** : Cache 1 minute
- **Inventaire** : Pas de cache (temps réel)

### Pagination
```http
# Requêtes paginées
GET /api/admin/orders?page=1&limit=20&sort=createdAt&order=desc
```

**Réponse paginée** :
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

## WebSockets (temps réel)

### Connexion
```javascript
const socket = io('/admin', {
  auth: {
    token: sessionToken
  }
});

// Écouter nouvelles commandes
socket.on('new-order', (order) => {
  console.log('Nouvelle commande:', order);
  // Mettre à jour l'interface
});

// Écouter changements stock
socket.on('stock-update', (item) => {
  console.log('Stock mis à jour:', item);
});
```

## Tests API

### Tests d'authentification
```bash
# Test connexion admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  -c cookies.txt

# Test endpoint protégé
curl -X GET http://localhost:5000/api/admin/employees \
  -b cookies.txt
```

### Tests de validation
```bash
# Test création réservation invalide
curl -X POST http://localhost:5000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{"guestName":""}' # Devrait retourner erreur 400
```

Cette documentation API permet une intégration complète avec les applications frontend et garantit une utilisation sécurisée et efficace de tous les services Dounie Cuisine.
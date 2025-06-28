# 🌐 Application Publique - Dounie Cuisine

## Vue d'ensemble

L'application publique de Dounie Cuisine est l'interface client construite avec **React 18 + Vite + Tailwind CSS**. Elle offre une expérience utilisateur moderne et responsive pour découvrir le menu, passer des commandes et réserver des événements.

## 🎨 Design et Fonctionnalités

### 🏠 Page d'Accueil
- **Hero section** avec images attrayantes de plats haïtiens
- **Menu highlights** avec les spécialités du restaurant
- **Témoignages clients** avec photos et avis
- **Informations contact** et heures d'ouverture
- **Call-to-actions** optimisés pour conversions

### 🍽️ Menu Interactif
- **Catégories** organisées (Entrées, Plats, Desserts, Boissons)
- **Photos haute qualité** pour chaque plat
- **Descriptions détaillées** avec ingrédients
- **Prix clairement affichés** en gourdes haïtiennes
- **Filtres** par catégorie et préférences alimentaires
- **Recherche** instantanée dans le menu

### 🛒 Système de Commande
- **Panier intelligent** avec calcul automatique
- **Quantités modifiables** en temps réel
- **Options de livraison** et récupération
- **Sélection date/heure** avec disponibilités
- **Formulaire de contact** complet
- **Confirmation** avec récapitulatif détaillé

### 🎉 Réservation d'Événements
- **Types d'événements** (Mariage, Anniversaire, Corporate)
- **Calendrier interactif** avec disponibilités
- **Calculateur de budget** automatique
- **Services additionnels** (DJ, Animation, Décoration)
- **Galerie d'inspiration** avec événements précédents
- **Devis personnalisé** en ligne

## 🏗️ Architecture Technique

```
public/
├── 📁 src/
│   ├── 📁 components/          # Composants React réutilisables
│   │   ├── ui/                 # Composants UI de base
│   │   ├── layout/             # Layout et navigation
│   │   ├── forms/              # Formulaires spécialisés
│   │   └── sections/           # Sections de pages
│   ├── 📁 pages/               # Pages principales
│   │   ├── Home.tsx            # Page d'accueil
│   │   ├── Menu.tsx            # Page menu
│   │   ├── Order.tsx           # Système de commande
│   │   ├── Events.tsx          # Réservation événements
│   │   └── Contact.tsx         # Page contact
│   ├── 📁 hooks/               # Hooks React personnalisés
│   ├── 📁 services/            # Services API
│   ├── 📁 utils/               # Utilitaires
│   ├── 📁 types/               # Types TypeScript
│   ├── 📄 App.tsx              # Composant principal
│   ├── 📄 main.tsx             # Point d'entrée
│   └── 📄 index.css            # Styles globaux
├── 📁 public/                  # Assets statiques
├── 📁 dist/                    # Build de production
├── 📄 package.json             # Dépendances et scripts
├── 📄 vite.config.ts           # Configuration Vite
├── 📄 tailwind.config.js       # Configuration Tailwind
└── 📄 tsconfig.json            # Configuration TypeScript
```

## 🚀 Démarrage Rapide

### Installation
```bash
cd public
npm install
```

### Scripts de Développement
```bash
# Serveur de développement (port 3000)
npm run dev

# Build de production
npm run build

# Aperçu du build de production
npm run preview

# Linting et vérifications
npm run lint
npm run type-check
```

### Configuration Environnement
```bash
# Variables d'environnement (.env)
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Dounie Cuisine
VITE_CONTACT_EMAIL=contact@dounie-cuisine.com
VITE_CONTACT_PHONE=+509-XX-XX-XX-XX
```

## 🎨 Design System

### Couleurs Principales (Palette Professionnelle)
Les couleurs sont définies via des variables CSS dans `src/index.css` pour un theming facile et la gestion du mode sombre. Les thèmes festifs (`haitian-theme.css`, `caribbean-theme.css`) peuvent surcharger ces variables s'ils sont actifs.
```css
/* Palette principale (Mode Clair) */
:root {
  --background: 220 30% 96%; /* Gris très clair bleuté */
  --foreground: 220 25% 20%; /* Gris foncé */
  --card: 0 0% 100%; /* Blanc */
  --card-foreground: 220 25% 20%;
  --popover: 0 0% 100%;
  --popover-foreground: 220 25% 20%;
  --primary: 205 70% 45%; /* Bleu professionnel */
  --primary-foreground: 0 0% 100%;
  --secondary: 195 60% 40%; /* Bleu sarcelle */
  --secondary-foreground: 0 0% 100%;
  --muted: 220 20% 88%; /* Gris clair */
  --muted-foreground: 220 20% 55%;
  --accent: 170 60% 40%; /* Vert d'eau/turquoise sobre */
  --accent-foreground: 0 0% 100%;
  --destructive: 0 75% 55%; /* Rouge pour erreurs */
  --destructive-foreground: 0 0% 100%;
  --border: 220 25% 88%;
  --input: 220 25% 92%;
  --ring: 205 80% 60%;
  --radius: 0.5rem;
}

/* Mode Sombre */
.dark {
  --background: 220 25% 10%; /* Gris foncé bleuté */
  --foreground: 220 15% 88%; /* Gris clair */
  --card: 220 25% 15%;
  --card-foreground: 220 15% 88%;
  --popover: 220 25% 12%;
  --popover-foreground: 220 15% 88%;
  --primary: 205 75% 55%; /* Bleu plus clair */
  --primary-foreground: 0 0% 100%;
  --secondary: 195 65% 50%; /* Bleu sarcelle plus clair */
  --secondary-foreground: 0 0% 100%;
  --muted: 220 15% 30%;
  --muted-foreground: 220 15% 65%;
  --accent: 170 65% 50%; /* Vert d'eau/turquoise plus clair */
  --accent-foreground: 0 0% 100%;
  --destructive: 0 70% 60%;
  --destructive-foreground: 0 0% 100%;
  --border: 220 15% 25%;
  --input: 220 15% 20%;
  --ring: 205 85% 70%;
}
```

### Typographie
```css
/* Fonts principales */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Échelle typographique */
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */
```

### Composants UI de Base

#### Boutons
```tsx
// Bouton principal
<Button variant="primary" size="lg">
  Commander maintenant
</Button>

// Bouton secondaire
<Button variant="secondary" size="md">
  Voir le menu
</Button>

// Bouton d'action
<Button variant="accent" size="sm" icon={<ShoppingCart />}>
  Ajouter au panier
</Button>
```

#### Cards
```tsx
// Card de plat
<MenuItemCard
  image="/images/griot.jpg"
  title="Griot Traditionnel"
  description="Porc mariné et frit, servi avec bananes plantains et pikliz"
  price="450 HTG"
  onAddToCart={handleAddToCart}
/>

// Card d'événement
<EventCard
  type="Mariage"
  image="/images/wedding.jpg"
  title="Mariage de Rêve"
  description="Service traiteur complet pour votre jour spécial"
  startingPrice="15000 HTG"
/>
```

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
/* xs: 0px - 640px (mobile) */
/* sm: 640px+ (tablet portrait) */
/* md: 768px+ (tablet landscape) */
/* lg: 1024px+ (desktop) */
/* xl: 1280px+ (large desktop) */
/* 2xl: 1536px+ (extra large) */
```

### Composants Responsifs
```tsx
// Navigation responsive
<nav className="fixed top-0 w-full bg-white shadow-lg z-50">
  <div className="container mx-auto px-4">
    <div className="flex justify-between items-center h-16">
      <Logo />
      
      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-8">
        <NavLinks />
      </div>
      
      {/* Mobile Menu Button */}
      <button className="md:hidden" onClick={toggleMobileMenu}>
        <MenuIcon />
      </button>
    </div>
  </div>
</nav>

// Grid responsive pour le menu
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {menuItems.map(item => (
    <MenuItemCard key={item.id} {...item} />
  ))}
</div>
```

## 🛒 Gestion d'État

### React Query pour les Données
```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Hook pour récupérer le menu
export const useMenu = () => {
  return useQuery({
    queryKey: ['menu'],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/menu`);
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook pour passer commande
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderData) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
```

### Context pour le Panier
```tsx
// Context du panier
interface CartContextType {
  items: CartItem[];
  addItem: (item: MenuItem, quantity: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  
  const addItem = useCallback((item: MenuItem, quantity: number) => {
    setItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity }];
    });
  }, []);

  const total = useMemo(() => 
    items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    [items]
  );

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount: items.length }}>
      {children}
    </CartContext.Provider>
  );
};
```

## 🎭 Animations et Interactions

### Framer Motion
```tsx
import { motion } from 'framer-motion';

// Animation d'entrée pour les cards
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// Animation au scroll
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
  variants={cardVariants}
>
  <MenuItemCard {...item} />
</motion.div>

// Animation du panier
<motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  exit={{ scale: 0 }}
  className="fixed bottom-4 right-4 bg-primary text-white p-4 rounded-full shadow-lg"
>
  <ShoppingCart />
  {itemCount > 0 && (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
    >
      {itemCount}
    </motion.span>
  )}
</motion.div>
```

### Micro-interactions
```tsx
// Hover effects avec Tailwind
<button className="bg-primary hover:bg-primary-dark transform hover:scale-105 transition-all duration-200 ease-in-out">
  Ajouter au panier
</button>

// Loading states
<button disabled={isLoading} className="bg-primary disabled:bg-gray-400 disabled:cursor-not-allowed">
  {isLoading ? (
    <span className="flex items-center">
      <Spinner className="animate-spin mr-2" />
      Ajout en cours...
    </span>
  ) : (
    'Ajouter au panier'
  )}
</button>
```

## 📊 Performance et Optimisations

### Optimisations Vite
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-popover'],
          animations: ['framer-motion']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@tanstack/react-query']
  }
});
```

### Lazy Loading
```tsx
import { Suspense, lazy } from 'react';

// Lazy loading des pages
const Menu = lazy(() => import('./pages/Menu'));
const Events = lazy(() => import('./pages/Events'));
const Contact = lazy(() => import('./pages/Contact'));

// Utilisation avec Suspense
<Suspense fallback={<PageLoader />}>
  <Routes>
    <Route path="/menu" element={<Menu />} />
    <Route path="/events" element={<Events />} />
    <Route path="/contact" element={<Contact />} />
  </Routes>
</Suspense>
```

### Optimisation des Images
```tsx
// Composant Image optimisé
const OptimizedImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}> = ({ src, alt, className = '', loading = 'lazy' }) => {
  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      className={`${className} transition-opacity duration-300`}
      onLoad={(e) => e.currentTarget.classList.add('opacity-100')}
      style={{ opacity: 0 }}
    />
  );
};
```

## 🔧 Configuration Build

### Tailwind CSS Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          900: '#7f1d1d',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 2s infinite',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
```

### PostCSS Configuration
```javascript
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    cssnano: process.env.NODE_ENV === 'production' ? {} : false,
  },
}
```

## 🧪 Tests

### Tests Unitaires avec Vitest
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MenuItemCard from '../components/MenuItemCard';

describe('MenuItemCard', () => {
  const mockItem = {
    id: '1',
    name: 'Griot Traditionnel',
    description: 'Porc mariné et frit',
    price: 450,
    image: '/images/griot.jpg'
  };

  it('renders menu item information correctly', () => {
    render(<MenuItemCard item={mockItem} onAddToCart={() => {}} />);
    
    expect(screen.getByText('Griot Traditionnel')).toBeInTheDocument();
    expect(screen.getByText('Porc mariné et frit')).toBeInTheDocument();
    expect(screen.getByText('450 HTG')).toBeInTheDocument();
  });

  it('calls onAddToCart when button is clicked', async () => {
    const mockAddToCart = vi.fn();
    render(<MenuItemCard item={mockItem} onAddToCart={mockAddToCart} />);
    
    const addButton = screen.getByText('Ajouter au panier');
    await userEvent.click(addButton);
    
    expect(mockAddToCart).toHaveBeenCalledWith(mockItem, 1);
  });
});
```

### Tests d'Intégration
```tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Menu from '../pages/Menu';

describe('Menu Page Integration', () => {
  it('loads and displays menu items', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } }
    });

    render(
      <QueryClientProvider client={queryClient}>
        <Menu />
      </QueryClientProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Notre Menu')).toBeInTheDocument();
    });

    expect(screen.getByText('Griot Traditionnel')).toBeInTheDocument();
  });
});
```

## 📱 PWA et Fonctionnalités Modernes

### Service Worker
```typescript
// Service worker pour cache et offline
self.addEventListener('fetch', (event) => {
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.open('images').then(cache => {
        return cache.match(event.request).then(response => {
          return response || fetch(event.request).then(fetchResponse => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  }
});
```

### Manifest PWA
```json
{
  "name": "Dounie Cuisine",
  "short_name": "Dounie",
  "description": "Restaurant haïtien - Commandes et réservations en ligne",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#1e40af",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 🔐 Sécurité et Bonnes Pratiques

### Protection XSS
```tsx
// Sanitization des données utilisateur
import DOMPurify from 'dompurify';

const SafeHTML: React.FC<{ content: string }> = ({ content }) => {
  const sanitizedContent = DOMPurify.sanitize(content);
  return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
};
```

### Validation des Formulaires
```tsx
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const orderSchema = z.object({
  customerName: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().regex(/^\+509\d{8}$/, 'Numéro haïtien requis'),
  deliveryDate: z.string().min(1, 'Date de livraison requise'),
  specialInstructions: z.string().optional()
});

const OrderForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(orderSchema)
  });

  const onSubmit = (data) => {
    // Données validées et sécurisées
    submitOrder(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('customerName')} />
      {errors.customerName && <span>{errors.customerName.message}</span>}
      {/* Autres champs */}
    </form>
  );
};
```

## 🚀 Déploiement

### Build de Production
```bash
# Build optimisé
npm run build

# Vérification du build
npm run preview

# Analyse du bundle
npm run build -- --analyze
```

### Variables d'Environnement Production
```bash
# .env.production
VITE_API_URL=https://api.dounie-cuisine.com
VITE_APP_NAME=Dounie Cuisine
VITE_CONTACT_EMAIL=contact@dounie-cuisine.com
VITE_CONTACT_PHONE=+509-3234-5678
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

### Optimisations de Performance
- **Tree shaking** automatique avec Vite
- **Code splitting** par routes
- **Compression gzip** via Nginx
- **Cache Headers** optimisés
- **Images lazy loading**
- **Bundle analysis** pour monitoring

---

**Application Publique Dounie Cuisine v2.0** - Interface moderne et performante pour une expérience client exceptionnelle 🌐🍽️
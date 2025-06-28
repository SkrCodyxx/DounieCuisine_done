# ⚙️ Interface d'Administration - Dounie Cuisine

## Vue d'ensemble

L'interface d'administration de Dounie Cuisine est une application React avancée construite avec **React 18 + TypeScript + Tailwind CSS**. Elle intègre un système de messagerie temps réel, monitoring système et toutes les fonctionnalités de gestion du restaurant.

## 🎯 Fonctionnalités Principales

### 📊 Tableau de Bord Intelligent
- **Métriques temps réel** (ventes, commandes, événements)
- **Graphiques interactifs** avec Recharts
- **Alertes système** intégrées
- **Indicateurs de performance** (KPI)
- **Vue d'ensemble** des opérations quotidiennes

### 💬 Système de Messagerie Intégré
- **Panneau flottant** avec 3 onglets
- **Communication temps réel** via WebSocket
- **Messages privés** et diffusions générales
- **Notifications push** avec badges
- **Monitoring système** intégré

### 🍽️ Gestion Complète du Restaurant
- **Menu dynamique** avec upload d'images
- **Commandes** avec suivi de statut
- **Événements** et calendrier
- **Utilisateurs** et permissions
- **Rapports** et statistiques avancées

### 📱 Design Responsive et Moderne
- **Interface adaptative** mobile/tablet/desktop
- **Thème professionnel** avec mode sombre
- **Composants réutilisables** avec Radix UI
- **Animations fluides** avec Framer Motion

## 🏗️ Architecture Technique

```
administration/
├── 📁 src/
│   ├── 📁 components/              # Composants React
│   │   ├── ui/                     # Composants UI de base (Radix)
│   │   ├── layout/                 # Layout et navigation
│   │   ├── forms/                  # Formulaires spécialisés
│   │   ├── charts/                 # Graphiques et visualisations
│   │   ├── MessagingPanel.tsx      # 💬 Panneau de messagerie
│   │   └── sections/               # Sections spécialisées
│   ├── 📁 pages/                   # Pages principales
│   │   ├── Dashboard.tsx           # Tableau de bord principal
│   │   ├── Menu/                   # Gestion du menu
│   │   ├── Orders/                 # Gestion des commandes
│   │   ├── Events/                 # Gestion des événements
│   │   ├── Users/                  # Gestion des utilisateurs
│   │   ├── Reports/                # Rapports et analytics
│   │   └── Settings/               # Paramètres système
│   ├── 📁 hooks/                   # Hooks React personnalisés
│   │   ├── useWebSocket.ts         # Hook WebSocket pour messagerie
│   │   ├── useSystemMonitoring.ts  # Hook monitoring système
│   │   └── useAuth.ts              # Hook authentification
│   ├── 📁 services/                # Services API
│   ├── 📁 utils/                   # Utilitaires
│   ├── 📁 types/                   # Types TypeScript
│   ├── 📄 App.tsx                  # Composant principal
│   ├── 📄 main.tsx                 # Point d'entrée
│   └── 📄 index.css                # Styles globaux
├── 📁 public/                      # Assets statiques
├── 📁 dist/                        # Build de production
├── 📄 package.json                 # Dépendances et scripts
├── 📄 vite.config.ts               # Configuration Vite
├── 📄 tailwind.config.js           # Configuration Tailwind
└── 📄 tsconfig.json                # Configuration TypeScript
```

## 🚀 Démarrage Rapide

### Installation
```bash
cd administration
npm install
```

### Scripts de Développement
```bash
# Serveur de développement (port 3001)
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
VITE_WS_URL=ws://localhost:5000/ws
VITE_APP_NAME=Dounie Cuisine Admin
VITE_MONITORING_ENABLED=true
VITE_MESSAGING_ENABLED=true
```

## 💬 Système de Messagerie Temps Réel

### Composant Principal
```tsx
// MessagingPanel.tsx - Panneau de messagerie intégré
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Bell, Users, Send, X } from 'lucide-react';

interface MessagingPanelProps {
  userId: string;
  userRole: 'admin' | 'manager' | 'staff';
}

const MessagingPanel: React.FC<MessagingPanelProps> = ({ userId, userRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'messages' | 'notifications' | 'system'>('messages');
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [ws, setWs] = useState<WebSocket | null>(null);

  // Connexion WebSocket
  useEffect(() => {
    const websocket = new WebSocket(`${import.meta.env.VITE_WS_URL}?userId=${userId}`);
    
    websocket.onopen = () => {
      setWs(websocket);
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleWebSocketMessage(data);
    };

    return () => websocket.close();
  }, [userId]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Bouton flottant avec badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-200 relative"
      >
        <MessageCircle size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panneau de messagerie */}
      {isOpen && (
        <MessagingWindow
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          messages={messages}
          notifications={notifications}
          onSendMessage={sendMessage}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
```

### Hook WebSocket
```tsx
// hooks/useWebSocket.ts
import { useState, useEffect, useCallback } from 'react';

interface UseWebSocketProps {
  url: string;
  userId: string;
  onMessage?: (data: any) => void;
}

export const useWebSocket = ({ url, userId, onMessage }: UseWebSocketProps) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  useEffect(() => {
    const websocket = new WebSocket(`${url}?userId=${userId}`);
    
    websocket.onopen = () => {
      setConnectionStatus('connected');
      setWs(websocket);
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage?.(data);
    };

    websocket.onclose = () => {
      setConnectionStatus('disconnected');
      // Reconnexion automatique après 5 secondes
      setTimeout(() => {
        setConnectionStatus('connecting');
      }, 5000);
    };

    websocket.onerror = () => {
      setConnectionStatus('disconnected');
    };

    return () => {
      websocket.close();
    };
  }, [url, userId, onMessage]);

  const sendMessage = useCallback((message: any) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }, [ws]);

  return { sendMessage, connectionStatus };
};
```

## 📊 Monitoring Système Intégré

### Hook de Monitoring
```tsx
// hooks/useSystemMonitoring.ts
import { useState, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';

interface SystemMetrics {
  timestamp: Date;
  memoryUsage: number;
  diskUsage: number;
  loadAverage: number;
  uptime: number;
  connectedUsers: number;
  apiResponseTime: number;
}

export const useSystemMonitoring = (userId: string) => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);

  const handleSystemMessage = useCallback((data: any) => {
    switch (data.type) {
      case 'system_status':
        setMetrics(data.data);
        break;
      case 'system_notification':
        setAlerts(prev => [...prev, data.data]);
        break;
    }
  }, []);

  const { sendMessage, connectionStatus } = useWebSocket({
    url: import.meta.env.VITE_WS_URL,
    userId,
    onMessage: handleSystemMessage
  });

  return {
    metrics,
    alerts,
    connectionStatus,
    resolveAlert: (alertId: string) => {
      sendMessage({ type: 'resolve_alert', alertId });
    }
  };
};
```

### Composant de Monitoring
```tsx
// components/SystemMonitoringWidget.tsx
import React from 'react';
import { useSystemMonitoring } from '../hooks/useSystemMonitoring';
import { AlertTriangle, CheckCircle, Activity } from 'lucide-react';

interface SystemMonitoringWidgetProps {
  userId: string;
}

const SystemMonitoringWidget: React.FC<SystemMonitoringWidgetProps> = ({ userId }) => {
  const { metrics, alerts, connectionStatus } = useSystemMonitoring(userId);

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'text-red-500';
    if (value >= thresholds.warning) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Monitoring Système</h3>
        <div className={`flex items-center ${
          connectionStatus === 'connected' ? 'text-green-500' : 'text-red-500'
        }`}>
          <Activity size={16} className="mr-1" />
          {connectionStatus === 'connected' ? 'Connecté' : 'Déconnecté'}
        </div>
      </div>

      {metrics && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 p-3 rounded">
            <div className="text-sm font-medium text-blue-800">Mémoire</div>
            <div className={`text-lg font-bold ${getStatusColor(metrics.memoryUsage, { warning: 75, critical: 90 })}`}>
              {metrics.memoryUsage}%
            </div>
          </div>
          
          <div className="bg-green-50 p-3 rounded">
            <div className="text-sm font-medium text-green-800">Disque</div>
            <div className={`text-lg font-bold ${getStatusColor(metrics.diskUsage, { warning: 80, critical: 90 })}`}>
              {metrics.diskUsage}%
            </div>
          </div>
          
          <div className="bg-purple-50 p-3 rounded">
            <div className="text-sm font-medium text-purple-800">Charge CPU</div>
            <div className="text-lg font-bold text-purple-600">
              {metrics.loadAverage.toFixed(2)}
            </div>
          </div>
          
          <div className="bg-orange-50 p-3 rounded">
            <div className="text-sm font-medium text-orange-800">Utilisateurs</div>
            <div className="text-lg font-bold text-orange-600">
              {metrics.connectedUsers}
            </div>
          </div>
        </div>
      )}

      {/* Alertes récentes */}
      {alerts.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Alertes Récentes</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {alerts.slice(-3).map(alert => (
              <div key={alert.id} className={`flex items-center p-2 rounded text-sm ${
                alert.type === 'error' ? 'bg-red-50 text-red-700' :
                alert.type === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                'bg-blue-50 text-blue-700'
              }`}>
                {alert.type === 'error' ? <AlertTriangle size={14} className="mr-2" /> :
                 alert.type === 'warning' ? <AlertTriangle size={14} className="mr-2" /> :
                 <CheckCircle size={14} className="mr-2" />}
                {alert.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
```

## 🎨 Design System et UI

### Composants UI de Base (Radix)
```tsx
// components/ui/Button.tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
```

### Thème et Couleurs (Palette Professionnelle)
Les couleurs sont définies via des variables CSS dans `src/index.css` pour un theming facile et la gestion du mode sombre.
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

## 📊 Tableaux de Bord et Analytics

### Composant Dashboard Principal
```tsx
// pages/Dashboard.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, LineChart, PieChart, ResponsiveContainer } from 'recharts';
import SystemMonitoringWidget from '../components/SystemMonitoringWidget';
import MessagingPanel from '../components/MessagingPanel';

const Dashboard: React.FC = () => {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/stats`);
      return response.json();
    },
    refetchInterval: 30000, // Actualisation toutes les 30 secondes
  });

  return (
    <div className="p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Ventes du Jour"
          value={`${stats?.dailySales || 0} HTG`}
          change={stats?.salesChange || 0}
          icon={<DollarSign />}
        />
        <KPICard
          title="Commandes Actives"
          value={stats?.activeOrders || 0}
          change={stats?.ordersChange || 0}
          icon={<ShoppingCart />}
        />
        <KPICard
          title="Événements ce Mois"
          value={stats?.monthlyEvents || 0}
          change={stats?.eventsChange || 0}
          icon={<Calendar />}
        />
        <KPICard
          title="Clients Nouveaux"
          value={stats?.newCustomers || 0}
          change={stats?.customersChange || 0}
          icon={<Users />}
        />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ventes par Jour</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats?.salesData || []}>
                <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plats Populaires</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats?.popularDishes || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="orders"
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monitoring Système */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrdersWidget />
        </div>
        <SystemMonitoringWidget userId="current-user-id" />
      </div>

      {/* Panneau de messagerie flottant */}
      <MessagingPanel userId="current-user-id" userRole="admin" />
    </div>
  );
};
```

### Composants de Données
```tsx
// components/KPICard.tsx
interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, icon }) => {
  const isPositive = change >= 0;
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              {icon}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          </div>
          <div className={`flex items-center text-sm ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span className="ml-1">{Math.abs(change)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
```

## 🔐 Authentification et Autorisation

### Hook d'Authentification
```tsx
// hooks/useAuth.ts
import { useState, useEffect, createContext, useContext } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier le token au démarrage
    const token = localStorage.getItem('auth_token');
    if (token) {
      validateToken(token).then(setUser).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) throw new Error('Connexion échouée');

    const { user, token } = await response.json();
    localStorage.setItem('auth_token', token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const hasPermission = (permission: string) => {
    return user?.permissions.includes(permission) || user?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

### Composant de Protection de Route
```tsx
// components/ProtectedRoute.tsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: 'admin' | 'manager' | 'staff';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPermission, 
  requiredRole 
}) => {
  const { user, loading, hasPermission } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
    return <div className="p-8 text-center">Accès non autorisé</div>;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <div className="p-8 text-center">Permission insuffisante</div>;
  }

  return <>{children}</>;
};
```

## 📱 Responsive Design et Accessibilité

### Design Adaptatif
```tsx
// components/layout/ResponsiveLayout.tsx
const ResponsiveLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <Sidebar />
      </div>

      {/* Sidebar Mobile */}
      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header avec bouton menu mobile */}
        <header className="bg-white shadow-sm border-b md:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-semibold">Dounie Cuisine Admin</h1>
            <UserMenu />
          </div>
        </header>

        {/* Contenu principal responsive */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
```

### Accessibilité
```tsx
// Composants accessibles avec ARIA
const AccessibleButton: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  ariaLabel?: string;
  disabled?: boolean;
}> = ({ children, onClick, ariaLabel, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      tabIndex={disabled ? -1 : 0}
    >
      {children}
    </button>
  );
};

// Navigation clavier
const useKeyboardNavigation = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape pour fermer les modals
      if (e.key === 'Escape') {
        // Fermer modal ouvert
      }
      
      // Ctrl+K pour la recherche
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        // Ouvrir recherche
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
};
```

## 🧪 Tests et Qualité

### Tests Unitaires
```tsx
// __tests__/MessagingPanel.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import MessagingPanel from '../components/MessagingPanel';

// Mock WebSocket
global.WebSocket = vi.fn(() => ({
  send: vi.fn(),
  close: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}));

describe('MessagingPanel', () => {
  it('renders messaging button', () => {
    render(<MessagingPanel userId="test-user" userRole="admin" />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('opens panel when button is clicked', async () => {
    render(<MessagingPanel userId="test-user" userRole="admin" />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Messages')).toBeInTheDocument();
    });
  });

  it('displays unread count badge', () => {
    render(<MessagingPanel userId="test-user" userRole="admin" />);
    
    // Simuler réception de message
    // ... test de badge
  });
});
```

### Tests d'Intégration
```tsx
// __tests__/Dashboard.integration.test.tsx
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import { AuthProvider } from '../hooks/useAuth';

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });

  return render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {component}
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

describe('Dashboard Integration', () => {
  it('loads dashboard with all widgets', async () => {
    renderWithProviders(<Dashboard />);
    
    // Vérifier présence des KPI
    expect(screen.getByText('Ventes du Jour')).toBeInTheDocument();
    expect(screen.getByText('Commandes Actives')).toBeInTheDocument();
    
    // Vérifier graphiques
    expect(screen.getByText('Ventes par Jour')).toBeInTheDocument();
    expect(screen.getByText('Plats Populaires')).toBeInTheDocument();
  });
});
```

## 🚀 Déploiement et Performance

### Configuration Vite Optimisée
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-popover', '@radix-ui/react-select'],
          charts: ['recharts'],
          forms: ['react-hook-form', '@hookform/resolvers'],
          query: ['@tanstack/react-query']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 3001,
    host: '0.0.0.0'
  },
  preview: {
    port: 3001,
    host: '0.0.0.0'
  }
});
```

### Optimisations de Performance
```tsx
// Lazy loading des pages
const LazyDashboard = lazy(() => import('./pages/Dashboard'));
const LazyOrders = lazy(() => import('./pages/Orders'));
const LazyMenu = lazy(() => import('./pages/Menu'));

// Mémorisation des composants coûteux
const MemoizedChart = React.memo(ChartComponent);

// Optimisation des re-renders
const useStableCallback = (callback: Function) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  
  return useCallback((...args: any[]) => {
    return callbackRef.current(...args);
  }, []);
};
```

---

**Interface d'Administration Dounie Cuisine v2.0** - Solution complète et moderne pour la gestion de restaurant avec messagerie intégrée et monitoring temps réel ⚙️🍽️
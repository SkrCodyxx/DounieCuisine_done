import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Users, ShoppingCart, Calendar, Package, DollarSign, Settings,
  Menu, X, Bell, MessageSquare, FileText, Image, MessageCircle,
  UserCheck, BarChart, Camera, BookOpen, Megaphone, Quote
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

const navigationItems = [
  {
    title: "Tableau de Bord",
    icon: BarChart,
    path: "/",
    permission: "view_dashboard"
  },
  {
    title: "Gestion Clients",
    icon: Users,
    path: "/clients",
    permission: "view_clients"
  },
  {
    title: "Système de Devis",
    icon: Quote,
    path: "/quotes",
    permission: "view_quotes"
  },
  {
    title: "Commandes",
    icon: ShoppingCart,
    path: "/orders",
    permission: "view_orders"
  },
  {
    title: "Réservations",
    icon: Calendar,
    path: "/reservations",
    permission: "view_reservations"
  },
  {
    title: "Gestion Menu",
    icon: Package,
    path: "/menu",
    permission: "view_menu"
  },
  {
    title: "Galeries Photos",
    icon: Camera,
    path: "/galleries",
    permission: "view_galleries"
  },
  {
    title: "Pages de Contenu",
    icon: BookOpen,
    path: "/content-pages",
    permission: "view_content"
  },
  {
    title: "Annonces",
    icon: Megaphone,
    path: "/announcements",
    permission: "view_announcements"
  },
  {
    title: "Messages Clients",
    icon: MessageSquare,
    path: "/customer-messages",
    permission: "view_customer_messages"
  },
  {
    title: "Messagerie Interne",
    icon: MessageCircle,
    path: "/internal-messages",
    permission: "manage_internal_messaging"
  },
  {
    title: "Messagerie Clients",
    icon: MessageSquare,
    path: "/client-messages",
    permission: "send_client_messages"
  },
  {
    title: "Personnel",
    icon: UserCheck,
    path: "/staff",
    permission: "view_staff"
  },
  {
    title: "Calendrier",
    icon: Calendar,
    path: "/calendar",
    permission: "view_calendar"
  },
  {
    title: "Inventaire",
    icon: Package,
    path: "/inventory",
    permission: "view_inventory"
  },
  {
    title: "Finances",
    icon: DollarSign,
    path: "/finance",
    permission: "view_financial_reports"
  },
  {
    title: "Paramètres",
    icon: Settings,
    path: "/settings",
    permission: "manage_company_settings"
  }
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useAuth();

  // Récupérer les notifications non lues
  const { data: unreadNotifications = 0 } = useQuery({
    queryKey: ["unread-notifications"],
    queryFn: async () => {
      const response = await fetch("/api/customer-messages?unread=true");
      if (response.ok) {
        const data = await response.json();
        return data.length;
      }
      return 0;
    },
    refetchInterval: 30000, // Vérifier toutes les 30 secondes
  });

  // Fonction pour vérifier les permissions
  const hasPermission = (permission: string) => {
    // Pour l'instant, vérification simple par rôle
    // TODO: Implémenter la vérification par permissions spécifiques
    if (user?.role === 'admin') return true;
    if (user?.role === 'manager') {
      const managerPermissions = [
        'view_dashboard', 'view_clients', 'view_quotes', 'view_orders',
        'view_reservations', 'view_menu', 'view_galleries', 'view_announcements',
        'view_customer_messages', 'manage_internal_messaging', 'send_client_messages',
        'view_staff', 'view_calendar', 'view_inventory', 'view_financial_reports'
      ];
      return managerPermissions.includes(permission);
    }
    if (user?.role === 'staff') {
      const staffPermissions = [
        'view_dashboard', 'view_clients', 'view_quotes', 'view_orders',
        'view_reservations', 'view_menu', 'view_galleries', 'view_customer_messages',
        'manage_internal_messaging', 'view_calendar', 'view_inventory'
      ];
      return staffPermissions.includes(permission);
    }
    return false;
  };

  // Filtrer les éléments de navigation selon les permissions
  const filteredNavItems = navigationItems.filter(item => hasPermission(item.permission));

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card shadow-lg transform border-r border-border ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          {/* TODO: Remplacer par un logo Dounie Cuisine Admin si disponible */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Settings className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold text-primary">Dounie Admin</h1>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Fermer le menu</span>
          </Button>
        </div>
        
        <nav className="mt-6 px-4 space-y-1"> {/* Padding ajusté et space-y */}
          {filteredNavItems.map((item) => {
            const isActive = location === item.path || (item.path !== "/" && location.startsWith(item.path));
            return (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={isActive ? "secondary" : "ghost"} // Utilise variant secondary pour l'état actif
                  className={`w-full justify-start text-sm font-medium h-10 ${
                    isActive ? 'text-primary font-semibold' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
                  {item.title}
                  {item.path === "/customer-messages" && unreadNotifications > 0 && (
                    <Badge variant="destructive" className="ml-auto px-2 py-0.5 text-xs">
                      {unreadNotifications}
                    </Badge>
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 w-full p-4 border-t border-border bg-card">
          <div className="flex items-center space-x-3">
            {/* Placeholder pour avatar utilisateur */}
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <User className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {user?.role === 'admin' ? 'Administrateur' :
                 user?.role === 'manager' ? 'Gestionnaire' :
                 user?.role === 'staff' ? 'Employé' :
                 user?.role}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground hover:text-destructive" title="Déconnexion">
              <LogOut className="h-5 w-5" /> {/* Remplacé par LogOut pour la cohérence */}
              <span className="sr-only">Déconnexion</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-x-hidden"> {/* lg:ml-64 retiré car la sidebar est statique sur lg */}
        {/* Top bar */}
        <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-16 px-4 bg-card border-b border-border shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Ouvrir le menu</span>
          </Button>
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
              <Settings className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-semibold text-primary">Dounie Admin</h1>
          </Link>
          <div className="relative">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            {unreadNotifications > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute top-1 right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs pointer-events-none"
              >
                {unreadNotifications}
              </Badge>
            )}
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">Dounie Admin</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {filteredNavItems.map((item) => {
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <div className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}>
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.title}
                    {item.path === "/customer-messages" && unreadNotifications > 0 && (
                      <Badge variant="destructive" className="ml-auto">
                        {unreadNotifications}
                      </Badge>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 w-full p-4 border-t bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top bar */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white border-b">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Dounie Admin</h1>
          <div className="relative">
            <Bell className="h-5 w-5 text-gray-600" />
            {unreadNotifications > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {unreadNotifications}
              </Badge>
            )}
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6">
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
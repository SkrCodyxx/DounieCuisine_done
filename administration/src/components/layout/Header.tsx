import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Plus,
  CalendarPlus,
  Menu,
  LogOut,
  TreePine,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  title: string;
  showMobileMenu?: boolean;
  onMobileMenuToggle?: () => void;
}

export function Header({ title, showMobileMenu, onMobileMenuToggle }: HeaderProps) {
  const { logout } = useAuth();
  const { currentTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b-2 border-red-600 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showMobileMenu && (
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={onMobileMenuToggle}
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}
          
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          
          {currentTheme && (
            <div className="flex items-center space-x-2 text-green-600 animate-float">
              <TreePine className="w-5 h-5" />
              <span className="text-sm font-medium">
                Ambiance {currentTheme.name} Active
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-4">
                <h3 className="font-semibold mb-2">Notifications</h3>
                <div className="space-y-2">
                  <div className="p-2 bg-red-50 rounded text-sm">
                    <p className="font-medium">Alerte Stock</p>
                    <p className="text-gray-600">Canneberges - Stock faible</p>
                  </div>
                  <div className="p-2 bg-yellow-50 rounded text-sm">
                    <p className="font-medium">Réservation Spéciale</p>
                    <p className="text-gray-600">35 personnes - 24 décembre</p>
                  </div>
                  <div className="p-2 bg-green-50 rounded text-sm">
                    <p className="font-medium">Paie Traitée</p>
                    <p className="text-gray-600">Paie de décembre complétée</p>
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Quick Actions */}
          <div className="flex space-x-2">
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Commande
            </Button>
            <Button className="bg-red-600 hover:bg-red-700">
              <CalendarPlus className="w-4 h-4 mr-2" />
              Réservation
            </Button>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <span className="text-sm">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

import React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/theme/ThemeProvider";
import { RoleSwitcher } from "./RoleSwitcher";
import {
  BarChart3,
  Calculator,
  Calendar,
  Utensils,
  Bookmark,
  Palette,
  Globe,
  User,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navigationItems = [
  {
    href: "/admin",
    label: "Tableau de Bord",
    icon: BarChart3,
  },
  {
    href: "/admin/accounting",
    label: "Comptabilité CAD",
    icon: Calculator,
  },
  {
    href: "/admin/calendar",
    label: "Calendrier Employés",
    icon: Calendar,
  },
  {
    href: "/admin/menu",
    label: "Gestion Menu",
    icon: Utensils,
  },
  {
    href: "/admin/reservations",
    label: "Réservations",
    icon: Bookmark,
  },
  {
    href: "/admin/themes",
    label: "Thèmes Festifs",
    icon: Palette,
  },
  {
    href: "/public",
    label: "Site Public",
    icon: Globe,
  },
];

export function AdminSidebar() {
  const [location] = useLocation();
  const { user } = useAuth();
  const { currentTheme } = useTheme();

  if (!user) return null;

  return (
    <aside className="w-64 admin-nav text-white flex-shrink-0 hidden lg:block">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
            <Utensils className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Dounie Cuisine</h1>
            <p className="text-sm text-gray-300">Montréal, QC</p>
          </div>
        </div>

        {/* Role Switcher */}
        {user.isEmployeeClient && <RoleSwitcher />}

        {/* Theme Indicator */}
        {currentTheme && (
          <div className="mb-6 p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm">Thème {currentTheme.name} Actif</span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = location === item.href || 
              (item.href !== "/admin" && location.startsWith(item.href));
            
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-white hover:bg-gray-700",
                    isActive && "bg-red-600 hover:bg-red-700"
                  )}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10 bg-amber-600">
              <AvatarFallback className="text-white">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.firstName} {user.lastName}</p>
              <p className="text-sm text-gray-300 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

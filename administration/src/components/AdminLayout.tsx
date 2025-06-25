import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useUser } from "@/hooks/use-user";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Menu as MenuIcon,
  ShoppingCart,
  Calendar,
  Package,
  DollarSign,
  Settings,
  TestTube,
  LogOut,
  Menu,
  Utensils
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

const navigation = [
  {
    name: "Tableau de bord",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Gestion du personnel",
    href: "/staff",
    icon: Users,
  },
  {
    name: "Gestion du menu",
    href: "/menu",
    icon: Utensils,
  },
  {
    name: "Commandes",
    href: "/orders",
    icon: ShoppingCart,
  },
  {
    name: "Réservations",
    href: "/reservations",
    icon: Calendar,
  },
  {
    name: "Inventaire",
    href: "/inventory",
    icon: Package,
  },
  {
    name: "Finances",
    href: "/finances",
    icon: DollarSign,
  },
  {
    name: "Calendrier",
    href: "/calendar",
    icon: Calendar,
  },
  {
    name: "Paramètres",
    href: "/settings",
    icon: Settings,
  },
  {
    name: "Tests système",
    href: "/tests",
    icon: TestTube,
  },
];

function SidebarContent() {
  const [location] = useLocation();
  const { user } = useUser();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <Utensils className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg">Dounie Admin</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-4">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href}>
              <Button
                variant={location === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  location === item.href && "bg-muted font-medium"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.role === "admin" ? "Administrateur" : "Gestionnaire"}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden w-64 bg-muted/40 lg:block">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-4 z-40 lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
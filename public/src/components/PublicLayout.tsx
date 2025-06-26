import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { cn } from "@/lib/utils";
import {
  Utensils,
  Menu,
  Calendar,
  ShoppingCart,
  User,
  LogOut,
  Home,
  Phone,
  Mail,
  MapPin
} from "lucide-react";

interface PublicLayoutProps {
  children: ReactNode;
}

const navigation = [
  {
    name: "Accueil",
    href: "/",
    icon: Home,
  },
  {
    name: "Menu",
    href: "/menu",
    icon: Utensils,
  },
  {
    name: "Réservations",
    href: "/reservations",
    icon: Calendar,
  },
  {
    name: "Commander",
    href: "/order",
    icon: ShoppingCart,
  },
];

function Header() {
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <Utensils className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl">Dounie Cuisine</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 ml-6">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href}>
              <Button
                variant={location === item.href ? "secondary" : "ghost"}
                className={cn(
                  "flex items-center space-x-2",
                  location === item.href && "bg-muted font-medium"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Button>
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-2">
              <Link href="/profile">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user.firstName}</span>
                </Button>
              </Link>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost">Connexion</Button>
              </Link>
              <Link href="/register">
                <Button>S'inscrire</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        <div className="md:hidden ml-4">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Utensils className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">Dounie Cuisine</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Découvrez l'authenticité de la cuisine haïtienne dans une ambiance chaleureuse et familiale.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link href={item.href}>
                    <span className="text-muted-foreground hover:text-foreground transition-colors">
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>(514) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@dounie-cuisine.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>123 Rue de la Gastronomie, Montréal</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Heures d'Ouverture</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>Lun-Jeu: 11h00 - 22h00</li>
              <li>Ven-Sam: 11h00 - 23h00</li>
              <li>Dimanche: 12h00 - 21h00</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Dounie Cuisine. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}
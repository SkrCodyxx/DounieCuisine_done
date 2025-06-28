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
  MapPin,
  ChefHat,
  Facebook, // Placeholder, remplacer par la vraie icône si disponible ou utiliser du SVG
  Instagram, // Placeholder
  Twitter // Placeholder
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"; // Import du composant Sheet

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
    name: "Nos Menus",
    href: "/menu",
    icon: Utensils,
  },
  {
    name: "Vos Événements",
    href: "/reservations",
    icon: Calendar,
  },
  {
    name: "Commander", // Raccourci
    href: "/order",
    icon: ShoppingCart,
  },
  {
    name: "Contact", // Raccourci
    href: "/contact",
    icon: Phone,
  },
];

function Header() {
  const [location] = useLocation();
  const { user, logout } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setIsMobileMenuOpen(false); // Fermer le menu mobile après déconnexion
      // Optionnel: rediriger
      // setLocation("/");
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
    }
  };

  const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
    navigation.map((item) => (
      <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
        <Button
          variant="ghost"
          className={cn(
            "font-medium w-full justify-start text-base md:text-sm", // Taille de texte ajustée
            location === item.href
              ? "text-primary border-b-2 border-primary rounded-none" // Style actif plus marqué
              : "text-muted-foreground hover:text-primary",
            isMobile ? "py-3 px-4" : "py-2 px-3" // Padding différent pour mobile
          )}
        >
          <item.icon className={cn("h-4 w-4", isMobile ? "mr-3" : "mr-2")} />
          <span>{item.name}</span>
        </Button>
      </Link>
    ))
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2 mr-6">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-md">
            <ChefHat className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-bold text-2xl text-primary hover:text-primary/90 transition-colors">Dounie Cuisine</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-2 ml-auto"> {/* Espacement augmenté */}
          <NavLinks />
        </nav>

        <div className="hidden md:flex items-center space-x-2 ml-4">
          {user ? (
            <>
              <Link href="/mon-compte"> {/* Lien vers une page profil client dédiée */}
                <Button variant="outline" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {user.firstName || "Mon Compte"}
                  </span>
                </Button>
              </Link>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="flex items-center space-x-2 text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Connexion</Button>
              </Link>
              <Link href="/register">
                <Button variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground">S'inscrire</Button> {/* Style plus proéminent */}
              </Link>
            </>
          )}
        </div>

        {/* Menu Mobile */}
        <div className="md:hidden flex items-center ml-auto">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs sm:max-w-sm">
              <SheetHeader className="mb-6">
                <SheetTitle>
                  <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <ChefHat className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-xl text-primary">Dounie Cuisine</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-2 mb-6">
                <NavLinks isMobile={true} />
              </nav>
              <div className="border-t pt-6 space-y-3">
                {user ? (
                  <>
                    <Link href="/mon-compte" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start">
                        <User className="h-4 w-4 mr-2" />
                        {user.firstName || "Mon Compte"}
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="w-full justify-start text-muted-foreground hover:text-destructive"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">Connexion</Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="default" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">S'inscrire</Button>
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t bg-background text-foreground/80">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-10">
          {/* Section Logo et Description */}
          <div className="md:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-md">
                <ChefHat className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-primary">Dounie Cuisine</span>
            </Link>
            <p className="text-sm leading-relaxed">
              L'authenticité de la cuisine haïtienne à Montréal. Service traiteur et organisation d'événements sur mesure pour toutes vos occasions.
            </p>
          </div>

          {/* Section Navigation */}
          <div>
            <h3 className="font-semibold text-lg text-foreground mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link href={item.href}>
                    <span className="hover:text-primary transition-colors">
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
               <li>
                  <Link href="/politique-confidentialite">
                    <span className="hover:text-primary transition-colors">
                      Politique de Confidentialité
                    </span>
                  </Link>
                </li>
                 <li>
                  <Link href="/conditions-utilisation"> {/* Exemple */}
                    <span className="hover:text-primary transition-colors">
                      Conditions d'Utilisation
                    </span>
                  </Link>
                </li>
            </ul>
          </div>

          {/* Section Contact */}
          <div>
            <h3 className="font-semibold text-lg text-foreground mb-4">Contactez-Nous</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                <span>123 Rue de la Gastronomie, Montréal, QC H2X 2S9</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <span>(514) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <span>info@dounie-cuisine.ca</span>
              </li>
            </ul>
          </div>

          {/* Section Heures et Réseaux Sociaux */}
           <div>
            <h3 className="font-semibold text-lg text-foreground mb-4">Heures de Service</h3>
            <ul className="space-y-1 text-sm mb-6">
              <li>Lundi - Jeudi : 11h00 - 22h00</li>
              <li>Vendredi - Samedi : 11h00 - 23h00</li>
              <li>Dimanche : 12h00 - 21h00</li>
              <li className="mt-2"><em>Événements sur réservation.</em></li>
            </ul>
            <h3 className="font-semibold text-lg text-foreground mb-3">Suivez-Nous</h3>
            <div className="flex space-x-3">
              <Link href="#" aria-label="Facebook Dounie Cuisine">
                <Facebook className="h-6 w-6 hover:text-primary transition-colors" />
              </Link>
              <Link href="#" aria-label="Instagram Dounie Cuisine">
                <Instagram className="h-6 w-6 hover:text-primary transition-colors" />
              </Link>
              <Link href="#" aria-label="Twitter Dounie Cuisine">
                <Twitter className="h-6 w-6 hover:text-primary transition-colors" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} Dounie Cuisine. Tous droits réservés. Conçu avec passion à Montréal.</p>
        </div>
      </div>
    </footer>
  );
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4 sm:px-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}
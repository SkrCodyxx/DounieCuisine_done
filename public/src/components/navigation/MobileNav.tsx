import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "wouter";
import { Menu, X, Home, UtensilsCrossed, Camera, Phone, Calendar, LogIn, UserPlus } from "lucide-react";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const closeSheet = () => setIsOpen(false);

  const navItems = [
    { href: "/", label: "Accueil • Home", icon: Home },
    { href: "/menu", label: "Menu • Meni", icon: UtensilsCrossed },
    { href: "/gallery", label: "Galerie • Galri", icon: Camera },
    { href: "/reservations", label: "Réservations • Rezèvasyon", icon: Calendar },
    { href: "/contact", label: "Contact • Kontak", icon: Phone }
  ];

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80 bg-gradient-to-b from-red-600 to-blue-600 text-white border-none">
          <SheetHeader className="border-b border-white/20 pb-4">
            <SheetTitle className="text-white text-xl font-bold">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-300 rounded-full"></div>
                <span>Dounie Cuisine</span>
                <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
              </div>
            </SheetTitle>
          </SheetHeader>
          
          <div className="mt-6 space-y-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} onClick={closeSheet}>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-white hover:bg-white/20 h-12 text-lg"
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
            
            <div className="border-t border-white/20 pt-4 space-y-3">
              <Link href="/login" onClick={closeSheet}>
                <Button 
                  variant="outline" 
                  className="w-full border-white text-white hover:bg-white hover:text-blue-600"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Konekte • Connexion
                </Button>
              </Link>
              
              <Link href="/register" onClick={closeSheet}>
                <Button 
                  variant="outline" 
                  className="w-full border-green-300 text-green-200 hover:bg-green-100 hover:text-green-700"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Kreye Kont • S'inscrire
                </Button>
              </Link>
            </div>
            
            <div className="mt-6 p-4 bg-white/10 rounded-lg">
              <p className="text-sm text-blue-100 mb-2">Enfòmasyon • Contact</p>
              <p className="text-xs text-white">(514) 555-DOUNIE</p>
              <p className="text-xs text-blue-200">info@dounie-cuisine.com</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
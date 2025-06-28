import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "../../components/theme/ThemeProvider";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Utensils,
  Star,
  Clock,
  MapPin,
  Phone,
  Mail,
  Gift,
} from "lucide-react";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  isFestive: boolean;
  imageUrl?: string;
}

export function PublicSite() {
  const { currentTheme } = useTheme();
  const { data: menuItems = [] } = useQuery<MenuItem[]>({ queryKey: ["/api/menu"] });
  const festiveItems = menuItems.filter(item => item.isFestive).slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-yellow-50 font-sans">
      {/* Header sticky */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Dounie Cuisine" className="h-10 w-10 rounded-full shadow" />
            <span className="text-2xl font-extrabold text-red-700 tracking-tight">Dounie Cuisine</span>
            <Badge className="bg-yellow-400 text-black ml-2">TRAITEUR & ÉVÉNEMENTS</Badge>
          </div>
          <nav className="hidden md:flex gap-8 text-lg font-medium">
            <a href="#menu" className="hover:text-red-600 transition">Menu</a>
            <a href="#events" className="hover:text-red-600 transition">Événements</a>
            <a href="#gallery" className="hover:text-red-600 transition">Galerie</a>
            <a href="#contact" className="hover:text-red-600 transition">Contact</a>
          </nav>
          <div className="flex gap-2">
            <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow">Commander</Button>
            <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50 font-semibold">Réserver</Button>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="relative flex flex-col items-center justify-center text-center py-20 md:py-32 bg-gradient-to-br from-red-600 via-yellow-400 to-blue-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg animate-fade-in">Goûtez l'authenticité d'Haïti à Montréal</h1>
          <p className="text-xl md:text-2xl mb-8 font-light text-white/90 animate-fade-in delay-100">Cuisine haïtienne raffinée, ambiance festive, service traiteur & événements privés.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-200">
            <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-4 text-lg shadow-lg">Voir le menu</Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-700 font-bold px-8 py-4 text-lg shadow-lg">Réserver une table</Button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-4 animate-bounce">
          <span className="w-12 h-1 bg-white rounded-full opacity-60" />
        </div>
      </section>

      {/* Menu section */}
      <section id="menu" className="max-w-7xl mx-auto py-16 px-6">
        <h2 className="text-4xl font-bold text-center mb-10 text-gray-900">Menu Festif</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {festiveItems.length > 0 ? (
            festiveItems.map((item) => (
              <Card key={item.id} className="rounded-xl shadow-lg hover:scale-105 transition-transform bg-white/90">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="h-48 w-full object-cover rounded-t-xl" />
                ) : (
                  <div className="h-48 flex items-center justify-center bg-gradient-to-br from-red-100 to-yellow-100 rounded-t-xl">
                    <Utensils className="w-16 h-16 text-red-300" />
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                    {item.isFestive && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">Festif</Badge>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-red-600 font-bold text-lg">{item.price} CAD$</span>
                    <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold">Commander</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="rounded-xl shadow-lg bg-white/90">
                <div className="h-48 flex items-center justify-center bg-gradient-to-br from-red-100 to-yellow-100 rounded-t-xl">
                  <Utensils className="w-16 h-16 text-red-300" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Plat Traditionnel Haïtien</h3>
                  <p className="text-gray-600 text-sm mb-3">Découvrez nos délicieux plats authentiques préparés avec amour</p>
                  <div className="flex justify-between items-center">
                    <span className="text-red-600 font-bold text-lg">--.- CAD$</span>
                    <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold">Commander</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* Contact & infos */}
      <section id="contact" className="bg-white py-16 border-t border-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center text-center">
            <MapPin className="w-10 h-10 text-red-600 mb-2" />
            <h4 className="font-semibold mb-2 text-lg">Adresse</h4>
            <p className="text-gray-600">1234 Rue Sainte-Catherine<br />Montréal, QC H3G 1P1</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Clock className="w-10 h-10 text-green-600 mb-2" />
            <h4 className="font-semibold mb-2 text-lg">Heures d'ouverture</h4>
            <p className="text-gray-600">Lun-Sam: 11h00 - 22h00<br />Dim: 12h00 - 21h00</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Phone className="w-10 h-10 text-blue-600 mb-2" />
            <h4 className="font-semibold mb-2 text-lg">Contact</h4>
            <p className="text-gray-600">+1 (514) 555-0100<br />info@dounieculisine.ca</p>
          </div>
        </div>
      </section>

      {/* Footer moderne */}
      <footer className="bg-gradient-to-r from-red-700 via-yellow-500 to-blue-700 text-white py-10 mt-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Dounie Cuisine" className="h-8 w-8 rounded-full shadow" />
            <span className="font-bold text-lg tracking-tight">Dounie Cuisine</span>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#menu" className="hover:underline">Menu</a>
            <a href="#events" className="hover:underline">Événements</a>
            <a href="#gallery" className="hover:underline">Galerie</a>
            <a href="#contact" className="hover:underline">Contact</a>
          </div>
          <div className="text-xs text-white/80">© {new Date().getFullYear()} Dounie Cuisine. Tous droits réservés.</div>
        </div>
      </footer>
    </div>
  );
}

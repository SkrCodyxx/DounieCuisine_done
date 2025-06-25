import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  
  const { data: menuItems = [] } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu"],
  });

  const festiveItems = menuItems.filter(item => item.isFestive).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="festive-gradient text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Utensils className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Dounie Cuisine</h1>
                <p className="text-white text-opacity-90">
                  Restaurant Haïtien Authentique - Montréal
                </p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex space-x-6">
            <a href="#" className="text-white border-b-2 border-white pb-1">
              Accueil
            </a>
            <a href="#" className="text-white text-opacity-80 hover:text-opacity-100">
              Menu
            </a>
            <a href="#" className="text-white text-opacity-80 hover:text-opacity-100">
              Réservations
            </a>
            <a href="#" className="text-white text-opacity-80 hover:text-opacity-100">
              Commandes
            </a>
            <a href="#" className="text-white text-opacity-80 hover:text-opacity-100">
              À Propos
            </a>
            <a href="#" className="text-white text-opacity-80 hover:text-opacity-100">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Hero Section */}
        {currentTheme && (
          <div className="relative bg-gradient-to-r from-red-600 to-green-600 rounded-lg p-8 text-white mb-8 overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">
                🎄 Menu Spécial de {currentTheme.name} 2024 🎄
              </h2>
              <p className="text-xl mb-6">
                Découvrez nos plats traditionnels haïtiens revisités pour les fêtes
              </p>
              <div className="flex space-x-4">
                <Button className="bg-white text-red-600 hover:bg-gray-100">
                  Voir le Menu Festif
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
                  Réserver une Table
                </Button>
              </div>
            </div>
            <div className="absolute top-0 right-0 text-6xl opacity-20">
              <Utensils />
            </div>
          </div>
        )}

        {/* Featured Dishes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {festiveItems.length > 0 ? (
            festiveItems.map((item) => (
              <Card key={item.id} className="overflow-hidden christmas-border">
                <div className="h-48 bg-gradient-to-br from-red-100 to-green-100 flex items-center justify-center">
                  <Utensils className="w-16 h-16 text-gray-400" />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    {item.isFestive && (
                      <Badge variant="secondary" className="text-xs">
                        Festif
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-red-600 font-bold text-lg">
                      {item.price} CAD$
                    </span>
                    <Button className="bg-green-600 hover:bg-green-700">
                      Commander
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="overflow-hidden christmas-border">
                <div className="h-48 bg-gradient-to-br from-red-100 to-green-100 flex items-center justify-center">
                  <Utensils className="w-16 h-16 text-gray-400" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Plat Traditionnel Haïtien
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Découvrez nos délicieux plats authentiques préparés avec amour
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-red-600 font-bold text-lg">--.- CAD$</span>
                    <Button className="bg-green-600 hover:bg-green-700">
                      Commander
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Loyalty Program */}
        <Card className="bg-purple-50 christmas-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-purple-900 mb-2">
                  🎁 Programme Fidélité - Spécial {currentTheme?.name || "Fêtes"}
                </h3>
                <p className="text-purple-700">
                  Gagnez des points doubles sur toutes vos commandes pendant les fêtes!
                </p>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Gift className="w-4 h-4 mr-2" />
                S'inscrire
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <MapPin className="w-8 h-8 mx-auto text-red-600 mb-2" />
              <h4 className="font-semibold mb-2">Adresse</h4>
              <p className="text-gray-600">1234 Rue Sainte-Catherine</p>
              <p className="text-gray-600">Montréal, QC H3G 1P1</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 mx-auto text-green-600 mb-2" />
              <h4 className="font-semibold mb-2">Heures d'ouverture</h4>
              <p className="text-gray-600">Lun-Sam: 11h00 - 22h00</p>
              <p className="text-gray-600">Dim: 12h00 - 21h00</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Phone className="w-8 h-8 mx-auto text-blue-600 mb-2" />
              <h4 className="font-semibold mb-2">Contact</h4>
              <p className="text-gray-600">+1 (514) 555-0100</p>
              <p className="text-gray-600">info@dounieculisine.ca</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

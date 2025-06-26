import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  ChefHat,
  Award,
  Music,
  UtensilsCrossed,
  Calendar,
  MapPin,
  Phone,
  Clock,
  Star,
  ArrowRight,
  Play,
  Heart
} from "lucide-react";

export function HomePage() {
  const { toast } = useToast();

  const { data: announcements } = useQuery({
    queryKey: ["/api/announcements/active"],
    queryFn: () => apiRequest("/api/announcements/active")
  });

  // Plats vedettes pour l'aperçu
  const featuredDishes = [
    {
      name: "Diri ak Djon Djon",
      nameEn: "Black Mushroom Rice",
      description: "Notre spécialité signature aux champignons noirs haïtiens",
      price: "24.95",
      image: "/api/placeholder/300/200",
      isSignature: true
    },
    {
      name: "Griot ak Bannann",
      nameEn: "Fried Pork with Plantain", 
      description: "Porc mariné traditionnel avec bananes plantains",
      price: "26.50",
      image: "/api/placeholder/300/200",
      isSignature: true
    },
    {
      name: "Soup Joumou",
      nameEn: "Pumpkin Soup",
      description: "Soupe traditionnelle symbole de l'indépendance",
      price: "14.50",
      image: "/api/placeholder/300/200",
      isSignature: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-blue-50">
      {/* En-tête Hero */}
      <header className="relative overflow-hidden bg-gradient-to-r from-red-600 via-blue-600 to-red-600 min-h-screen">
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Navigation */}
        <nav className="relative z-20 p-6">
          <div className="container mx-auto flex items-center justify-between">
            <div className="text-white font-bold text-2xl">
              Dounie Cuisine
            </div>
            <div className="hidden md:flex items-center gap-6 text-white">
              <Link href="/" className="hover:text-yellow-300 transition-colors">Accueil</Link>
              <Link href="/menu" className="hover:text-yellow-300 transition-colors">Menu</Link>
              <Link href="/gallery" className="hover:text-yellow-300 transition-colors">Galerie</Link>
              <Link href="/contact" className="hover:text-yellow-300 transition-colors">Contact</Link>
              <Link href="/reservations" className="hover:text-yellow-300 transition-colors">Réservations</Link>
              <Link href="/login">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Connexion
                </Button>
              </Link>
            </div>
          </div>
        </nav>
        
        {/* Contenu Hero */}
        <div className="relative z-10 flex items-center justify-center min-h-[80vh] text-center text-white px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl md:text-7xl font-bold mb-4 tracking-tight">
                Dounie Cuisine
              </h1>
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-8 h-1 bg-red-500"></div>
                <div className="w-8 h-1 bg-blue-500"></div>
                <div className="w-8 h-1 bg-red-500"></div>
              </div>
              <p className="text-xl md:text-2xl text-yellow-100 mb-2">
                Goûtez l'authenticité de la cuisine haïtienne
              </p>
              <p className="text-lg text-blue-100">
                Taste the authenticity of Haitian cuisine
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/reservations">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold text-lg px-8 py-4">
                  <Calendar className="mr-2 h-5 w-5" />
                  Fè Rezèvasyon • Réserver
                </Button>
              </Link>
              
              <Link href="/menu">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4">
                  <UtensilsCrossed className="mr-2 h-5 w-5" />
                  Wè Meni • Voir Menu
                </Button>
              </Link>
            </div>

            {/* Caractéristiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <ChefHat className="h-8 w-8 mx-auto mb-3 text-yellow-300" />
                <h3 className="font-semibold mb-2">Chef Authentique</h3>
                <p className="text-sm text-blue-100">Recettes traditionnelles transmises de génération en génération</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <Award className="h-8 w-8 mx-auto mb-3 text-yellow-300" />
                <h3 className="font-semibold mb-2">Ingrédients Authentiques</h3>
                <p className="text-sm text-blue-100">Épices et produits importés directement d'Haïti</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <Music className="h-8 w-8 mx-auto mb-3 text-yellow-300" />
                <h3 className="font-semibold mb-2">Ambiance Kulturelle</h3>
                <p className="text-sm text-blue-100">Musique kompa et événements culturels haïtiens</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Annonces spéciales */}
      {announcements && announcements.length > 0 && (
        <section className="py-12 bg-yellow-100">
          <div className="container mx-auto px-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-yellow-800 mb-4">Nouvel ak Pwomosyon • Actualités</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {announcements.slice(0, 2).map((announcement: any) => (
                  <Card key={announcement.id} className="border-yellow-200">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-yellow-800 mb-2">{announcement.title}</h3>
                      <p className="text-yellow-700">{announcement.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Plats vedettes */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-1 bg-red-500"></div>
              <h2 className="text-4xl font-bold text-gray-800">Manje Popilè • Nos Spécialités</h2>
              <div className="w-8 h-1 bg-blue-500"></div>
            </div>
            <p className="text-lg text-gray-600">Découvrez nos plats signature haïtiens</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {featuredDishes.map((dish, index) => (
              <Card key={index} className="border-red-100 hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="relative">
                  <img 
                    src={dish.image} 
                    alt={dish.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 left-3 bg-yellow-500 text-black">
                    Spécialité
                  </Badge>
                  <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full font-bold">
                    ${dish.price}
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{dish.name}</h3>
                  <p className="text-sm text-gray-500 italic mb-3">{dish.nameEn}</p>
                  <p className="text-gray-600 mb-4">{dish.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/menu">
              <Button className="bg-red-600 hover:bg-red-700 text-lg px-8 py-3">
                Wè Tout Meni • Voir Tout le Menu
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Avis clients */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Sa Kliyen Yo Di • Avis Clients</h2>
            <div className="flex items-center justify-center gap-1 mb-4">
              {[1,2,3,4,5].map((star) => (
                <Star key={star} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 text-lg font-semibold text-gray-700">4.8/5</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-red-100">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"Diri ak Djon Djon a te yon eksperyans enkyoyab! Manje a te gen gou Ayiti vre."</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                    M
                  </div>
                  <div>
                    <p className="font-semibold">Marie Dubois</p>
                    <p className="text-sm text-gray-600">Cliente fidèle</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"Authentic Haitian flavors! The griot was perfectly seasoned and the atmosphere felt like home."</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    J
                  </div>
                  <div>
                    <p className="font-semibold">Jean-Luc Martin</p>
                    <p className="text-sm text-gray-600">Food critic</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-yellow-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"Parfait pour une soirée spéciale! L'équipe est adorable et les plats sont préparés avec amour."</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-semibold">
                    S
                  </div>
                  <div>
                    <p className="font-semibold">Sophie Laval</p>
                    <p className="text-sm text-gray-600">Amatrice de cuisine</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Informations essentielles */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-red-100 text-center">
              <CardContent className="p-8">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-red-600" />
                <h3 className="text-xl font-semibold mb-3 text-red-600">Kote Nou Ye • Adresse</h3>
                <p className="text-gray-700">
                  123 Rue des Épices<br />
                  Montréal, QC H2X 1Y7
                </p>
                <Link href="/contact">
                  <Button variant="outline" className="mt-4 border-red-200 text-red-600 hover:bg-red-50">
                    Wè Plan • Voir Plan
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-blue-100 text-center">
              <CardContent className="p-8">
                <Clock className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-xl font-semibold mb-3 text-blue-600">Lè Nou Ouvè • Horaires</h3>
                <div className="text-gray-700 space-y-1">
                  <p>Lun-Jeu: 11h-22h</p>
                  <p>Ven-Sam: 11h-23h</p>
                  <p>Dim: 12h-21h</p>
                </div>
                <Link href="/reservations">
                  <Button variant="outline" className="mt-4 border-blue-200 text-blue-600 hover:bg-blue-50">
                    Rezève • Réserver
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 text-center">
              <CardContent className="p-8">
                <Phone className="h-12 w-12 mx-auto mb-4 text-yellow-600" />
                <h3 className="text-xl font-semibold mb-3 text-yellow-600">Rele Nou • Appelez-nous</h3>
                <p className="text-gray-700 text-lg font-semibold">
                  (514) 555-DOUNIE
                </p>
                <p className="text-gray-600 text-sm mb-4">
                  info@dounie-cuisine.com
                </p>
                <Link href="/contact">
                  <Button variant="outline" className="mt-2 border-yellow-200 text-yellow-600 hover:bg-yellow-50">
                    Kontak • Contact
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to action final */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Prêt pour une expérience culinaire unique?</h2>
          <p className="text-xl text-blue-100 mb-8">Venez découvrir les saveurs authentiques d'Haïti</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/reservations">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4">
                <Calendar className="mr-2 h-5 w-5" />
                Réserver Maintenant
              </Button>
            </Link>
            <Link href="/menu">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4">
                <UtensilsCrossed className="mr-2 h-5 w-5" />
                Explorer le Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
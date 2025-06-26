import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { 
  Search,
  Filter,
  ShoppingCart,
  Clock,
  Star,
  ChefHat,
  ArrowLeft,
  Heart,
  Info,
  Users,
  Utensils,
  Camera,
  PartyPopper,
  Gift,
  Truck,
  Phone
} from "lucide-react";

export function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Menu traiteur complet avec menus événements
  const cateringMenu = [
    // PLATS INDIVIDUELS
    {
      id: 1,
      name: "Diri ak Djon Djon",
      nameEn: "Black Mushroom Rice",
      description: "Riz parfumé aux champignons noirs haïtiens, accompagné de légumes créoles et viande de choix. Plat traditionnel préparé selon la recette ancestrale. Minimum 10 portions.",
      category: "Plats Individuels",
      price: "24.95",
      priceUnit: "par portion",
      image: "https://images.unsplash.com/photo-1647998270792-69ac80570183",
      isSignature: true,
      preparationTime: 35,
      calories: 450,
      spiceLevel: 2,
      allergies: [],
      minOrder: 10
    },
    {
      id: 2,
      name: "Griot ak Bannann",
      nameEn: "Fried Pork with Plantain",
      description: "Porc mariné et frit selon la tradition, accompagné de bananes plantains dorées et de notre pikliz maison. Un classique incontournable pour vos événements.",
      category: "Plats Individuels", 
      price: "26.50",
      priceUnit: "par portion",
      image: "https://images.unsplash.com/photo-1610592309005-0f92c8e39cec",
      isSignature: true,
      preparationTime: 40,
      calories: 520,
      spiceLevel: 3,
      allergies: [],
      minOrder: 10
    },
    {
      id: 3,
      name: "Soup Joumou",
      nameEn: "Pumpkin Soup",
      description: "Soupe traditionnelle à la citrouille, symbole de l'indépendance haïtienne. Riche en légumes et épices créoles. Parfaite pour commencer vos événements.",
      category: "Plats Individuels",
      price: "14.50",
      priceUnit: "par portion",
      image: "https://images.unsplash.com/photo-1741026079032-7cb660e44bad",
      isSignature: true,
      preparationTime: 20,
      calories: 180,
      spiceLevel: 1,
      allergies: [],
      minOrder: 15
    },
    
    // MENUS ÉVÉNEMENTS COMPLETS
    {
      id: 10,
      name: "Menu Mariage Traditionnel",
      nameEn: "Traditional Wedding Menu",
      description: "Menu complet pour mariage: Cocktail de bienvenue, entrées (Accras + Soup Joumou), plats principaux (Griot + Diri Djon Djon + Legim), desserts traditionnels, service complet avec notre équipe.",
      category: "Menus Événements",
      price: "45.00",
      priceUnit: "par personne (min. 50)",
      image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a",
      isSignature: true,
      preparationTime: 180,
      calories: 850,
      spiceLevel: 2,
      allergies: ["poisson", "gluten"],
      minOrder: 50,
      includes: ["Service complet", "Équipe de 4 serveurs", "Vaisselle", "Installation/nettoyage"]
    },
    {
      id: 11,
      name: "Menu Graduation Festif",
      nameEn: "Graduation Celebration Menu",
      description: "Menu spécial graduation: Buffet haïtien complet avec 6 plats principaux, accompagnements, desserts, boissons, DJ inclus pour 4h, décoration de base.",
      category: "Menus Événements",
      price: "38.00",
      priceUnit: "par personne (min. 30)",
      image: "https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg",
      preparationTime: 150,
      calories: 750,
      spiceLevel: 2,
      allergies: [],
      minOrder: 30,
      includes: ["DJ 4h inclus", "Décoration de base", "Buffet complet", "Service"]
    },
    {
      id: 12,
      name: "Menu Anniversaire Famille",
      nameEn: "Family Birthday Menu",
      description: "Menu familial pour anniversaires: Plats traditionnels, gâteau personnalisé, animation pour enfants disponible, formule conviviale et chaleureuse.",
      category: "Menus Événements",
      price: "32.00",
      priceUnit: "par personne (min. 20)",
      image: "https://images.pexels.com/photos/50675/banquet-wedding-society-deco-50675.jpeg",
      preparationTime: 120,
      calories: 650,
      spiceLevel: 1,
      allergies: ["lait", "gluten"],
      minOrder: 20,
      includes: ["Gâteau personnalisé", "Animation enfants", "Décoration", "Photos souvenirs"]
    },
    {
      id: 13,
      name: "Menu Entreprise Professionnel",
      nameEn: "Corporate Professional Menu",
      description: "Menu entreprise élégant: Cuisine raffinée haïtienne adaptée au milieu professionnel, service impeccable, présentation soignée, options végétariennes incluses.",
      category: "Menus Événements",
      price: "42.00",
      priceUnit: "par personne (min. 25)",
      image: "https://images.unsplash.com/photo-1653821355736-0c2598d0a63e",
      preparationTime: 90,
      calories: 600,
      spiceLevel: 1,
      allergies: [],
      minOrder: 25,
      includes: ["Service professionnel", "Options végétariennes", "Présentation soignée", "Nappage premium"]
    },

    // PLATS SPÉCIAUX ET ACCOMPAGNEMENTS
    {
      id: 20,
      name: "Lambi nan Sos Kreyol",
      nameEn: "Conch in Creole Sauce",
      description: "Lambi tendre mijoté dans une sauce créole authentique aux tomates fraîches et épices des îles. Spécialité de la maison pour événements spéciaux.",
      category: "Plats Spéciaux",
      price: "28.95",
      priceUnit: "par portion",
      image: "https://images.unsplash.com/photo-1610592309005-0f92c8e39cec",
      preparationTime: 45,
      calories: 300,
      spiceLevel: 3,
      allergies: ["fruits de mer"],
      minOrder: 8
    },
    {
      id: 21,
      name: "Buffet Complet Traiteur",
      nameEn: "Complete Catering Buffet",
      description: "Buffet traiteur complet avec 8 plats chauds, salades, accompagnements, desserts, installation complète, service pendant 4h, équipe de 3 personnes incluse.",
      category: "Formules Traiteur",
      price: "35.00",
      priceUnit: "par personne (min. 40)",
      image: "https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg",
      isSignature: true,
      preparationTime: 240,
      calories: 800,
      spiceLevel: 2,
      allergies: [],
      minOrder: 40,
      includes: ["8 plats chauds", "Installation complète", "Service 4h", "Équipe de 3"]
    }
  ];

  const categories = ["all", "Plats Individuels", "Menus Événements", "Plats Spéciaux", "Formules Traiteur"];

  // Filtrer les éléments du menu
  const filteredMenu = cateringMenu.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = searchTerm === "" || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getSpiceLevelText = (level: number) => {
    switch(level) {
      case 0: return "Doux";
      case 1: return "Léger";
      case 2: return "Modéré";
      case 3: return "Épicé";
      case 4: return "Très Épicé";
      default: return "Doux";
    }
  };

  const getSpiceColor = (level: number) => {
    switch(level) {
      case 0: return "text-green-600";
      case 1: return "text-yellow-600";
      case 2: return "text-orange-600";
      case 3: return "text-red-600";
      case 4: return "text-red-800";
      default: return "text-green-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-blue-50">
      {/* Bannière promotion */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-3 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <Gift className="h-4 w-4" />
            <span>🎉 PROMOTION: 15% de réduction sur les événements de plus de 50 personnes ce mois! 🎉</span>
            <Gift className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* En-tête */}
      <header className="bg-gradient-to-r from-red-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center mb-6">
            <Link href="/">
              <Button variant="ghost" className="text-white hover:bg-white/20 mr-4">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Retour Accueil
              </Button>
            </Link>
            <div className="flex gap-2">
              <Link href="/contact">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Phone className="h-4 w-4 mr-2" />
                  Devis Gratuit
                </Button>
              </Link>
              <Link href="/reservations">
                <Button variant="outline" className="border-green-300 text-green-200 hover:bg-green-100 hover:text-green-700">
                  <PartyPopper className="h-4 w-4 mr-2" />
                  Réserver Événement
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <ChefHat className="h-8 w-8 text-yellow-300" />
              <h1 className="text-5xl font-bold">Menu Traiteur & Événements</h1>
              <Utensils className="h-8 w-8 text-yellow-300" />
            </div>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Découvrez nos menus authentiques haïtiens pour tous vos événements - Livraison, installation et service complets inclus
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              <Badge className="bg-red-500 text-white">🚚 LIVRAISON INCLUSE</Badge>
              <Badge className="bg-blue-500 text-white">👥 ÉQUIPE DE SERVICE</Badge>
              <Badge className="bg-green-500 text-white">🍽️ MATÉRIEL FOURNI</Badge>
              <Badge className="bg-purple-500 text-white">🎵 DJ DISPONIBLE</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Recherche et filtres */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Chèche menu... • Rechercher un menu ou plat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-red-200 focus:border-red-500"
              />
            </div>
          </div>

          {/* Filtres de catégories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-red-600 hover:bg-red-700" : "border-red-200 hover:bg-red-50"}
              >
                <Filter className="mr-2 h-4 w-4" />
                {category === "all" ? "Tout • All" : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Annonce services */}
        <Card className="mb-8 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <Truck className="h-8 w-8 text-blue-600" />
                <Users className="h-8 w-8 text-purple-600" />
                <PartyPopper className="h-8 w-8 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2 text-blue-800">Service Traiteur Complet Inclus</h3>
                <p className="text-blue-700">
                  ✓ Livraison et installation ✓ Équipe de service professionnel ✓ Vaisselle et matériel fournis 
                  ✓ Nettoyage inclus ✓ DJ et animation disponibles ✓ Devis gratuit sous 24h
                </p>
              </div>
              <div className="text-right">
                <Link href="/contact">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Phone className="h-4 w-4 mr-2" />
                    Devis Gratuit
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Légende */}
        <Card className="mb-8 border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Info className="h-5 w-5 text-yellow-600" />
              Informations Menu Traiteur • Catering Menu Info
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Spécialité signature</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>Temps de préparation</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-500" />
                <span>Commande minimum</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-purple-500" />
                <span>Livraison incluse</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grille du menu */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenu.map((item) => (
            <Card key={item.id} className="border-red-100 hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="relative">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {item.isSignature && (
                  <Badge className="absolute top-3 left-3 bg-yellow-500 text-black">
                    <Star className="w-3 h-3 mr-1" />
                    Spécialité
                  </Badge>
                )}
                <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full font-bold text-sm">
                  ${item.price}
                </div>
                
                {/* Niveau d'épices */}
                {item.spiceLevel > 0 && (
                  <div className={`absolute bottom-3 left-3 bg-white/90 px-2 py-1 rounded-full text-xs font-medium ${getSpiceColor(item.spiceLevel)}`}>
                    🌶️ {getSpiceLevelText(item.spiceLevel)}
                  </div>
                )}

                {/* Badge catégorie */}
                <div className="absolute bottom-3 right-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                  {item.category}
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="mb-3">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-500 italic">{item.nameEn}</p>
                  <p className="text-lg font-semibold text-green-600">{item.priceUnit}</p>
                </div>
                
                <p className="text-gray-600 mb-4 leading-relaxed text-sm">{item.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{item.preparationTime} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>Min. {item.minOrder}</span>
                    </div>
                  </div>
                  
                  {item.includes && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h4 className="text-sm font-semibold text-green-800 mb-1">Inclus dans le service:</h4>
                      <ul className="text-xs text-green-700 space-y-1">
                        {item.includes.map((include: string, index: number) => (
                          <li key={index}>✓ {include}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {item.allergies && item.allergies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs text-gray-500">Allergènes:</span>
                      {item.allergies.map((allergy: string) => (
                        <Badge key={allergy} variant="outline" className="text-xs border-orange-200 text-orange-700">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1 bg-red-600 hover:bg-red-700 text-sm">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Commander
                  </Button>
                  <Link href="/contact">
                    <Button variant="outline" className="px-3">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMenu.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucun menu trouvé pour votre recherche.</p>
            <Button 
              onClick={() => {setSearchTerm(""); setSelectedCategory("all");}}
              variant="outline" 
              className="mt-4"
            >
              Réinitialiser les filtres
            </Button>
          </div>
        )}

        {/* Galerie d'événements récents */}
        <Card className="mt-12 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-purple-800 flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Evènman Nou Resèlman Fè • Événements Récents
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: "Mariage 200 pers.", image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a", date: "Samedi dernier" },
                { title: "Graduation 150 pers.", image: "https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg", date: "Dimanche" },
                { title: "Anniversaire 80 pers.", image: "https://images.pexels.com/photos/50675/banquet-wedding-society-deco-50675.jpeg", date: "Cette semaine" },
                { title: "Entreprise 120 pers.", image: "https://images.unsplash.com/photo-1653821355736-0c2598d0a63e", date: "Lundi" }
              ].map((event, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-24 object-cover rounded-lg group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-white text-center text-xs">
                      <p className="font-semibold">{event.title}</p>
                      <p>{event.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              <Link href="/gallery">
                <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-100">
                  <Camera className="h-4 w-4 mr-2" />
                  Voir Toute la Galerie
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Information nutritionnelle et services */}
        <Card className="mt-8 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-800">Sèvis ak Enfòmasyon • Services & Informations</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-blue-700">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Livraison & Installation
                </h4>
                <ul className="space-y-1">
                  <li>• Livraison dans tout Montréal</li>
                  <li>• Installation complète sur site</li>
                  <li>• Équipe de service professionnelle</li>
                  <li>• Nettoyage et ramassage inclus</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Services Additionnels
                </h4>
                <ul className="space-y-1">
                  <li>• DJ et animation musicale</li>
                  <li>• Décoration et mise en place</li>
                  <li>• Service bar professionnel</li>
                  <li>• Photographie d'événements</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Nos Engagements
                </h4>
                <ul className="space-y-1">
                  <li>• Ingrédients frais importés d'Haïti</li>
                  <li>• Cuisine sans conservateurs artificiels</li>
                  <li>• Recettes traditionnelles authentiques</li>
                  <li>• Service client 24/7 pendant événements</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to action */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Prêt à organiser votre événement?</h3>
          <p className="text-gray-600 mb-6">Devis gratuit sous 24h • Service professionnel garanti • Satisfaction 100%</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/reservations">
              <Button size="lg" className="bg-red-600 hover:bg-red-700">
                <PartyPopper className="h-5 w-5 mr-2" />
                Réserver un Événement
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
                <Phone className="h-5 w-5 mr-2" />
                Devis Gratuit
              </Button>
            </Link>
            <Link href="tel:+15145553686">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <Phone className="h-5 w-5 mr-2" />
                Appeler Maintenant
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
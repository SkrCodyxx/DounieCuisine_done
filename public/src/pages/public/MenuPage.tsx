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
  // Heart, // Non utilisé directement ici, peut-être pour des favoris futurs
  Info,
  Users,
  Utensils,
  // Camera, // Non utilisé ici
  PartyPopper,
  Gift,
  Truck,
  Phone
} from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout"; // Import du Layout

export function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Menu traiteur complet avec menus événements
  // TODO: Ces données devraient provenir de l'API /api/menu
  const cateringMenu = [
    // PLATS INDIVIDUELS
    {
      id: 1,
      name: "Diri ak Djon Djon",
      description: "Riz parfumé aux champignons noirs haïtiens, accompagné de légumes créoles et viande de choix. Plat traditionnel préparé selon la recette ancestrale. Minimum 10 portions.",
      category: "Plats Individuels",
      price: "24.95",
      priceUnit: "par portion",
      image: "/placeholder-images/diri-djon-djon.jpg", // Remplacer par une image réelle
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
      description: "Porc mariné et frit selon la tradition, accompagné de bananes plantains dorées et de notre pikliz maison. Un classique incontournable pour vos événements.",
      category: "Plats Individuels", 
      price: "26.50",
      priceUnit: "par portion",
      image: "/placeholder-images/griot.jpg", // Remplacer par une image réelle
      isSignature: true,
      preparationTime: 40,
      calories: 520,
      spiceLevel: 3,
      allergies: [],
      minOrder: 10
    },
    {
      id: 3,
      name: "Soupe Joumou",
      description: "Soupe traditionnelle à la citrouille, symbole de l'indépendance haïtienne. Riche en légumes et épices créoles. Parfaite pour commencer vos événements.",
      category: "Plats Individuels",
      price: "14.50",
      priceUnit: "par portion",
      image: "/placeholder-images/soup-joumou-authentic.jpg", // Remplacer
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
      description: "Menu complet pour mariage: Cocktail de bienvenue, entrées (Accras + Soupe Joumou), plats principaux (Griot + Diri Djon Djon + Legim), desserts traditionnels, service complet avec notre équipe.",
      category: "Menus Événements",
      price: "45.00",
      priceUnit: "par personne (min. 50)",
      image: "/placeholder-images/mariage-haitien-buffet.jpg", // Remplacer
      isSignature: true,
      preparationTime: 180,
      calories: 850,
      spiceLevel: 2,
      allergies: ["poisson", "gluten"], // Exemple, à vérifier
      minOrder: 50,
      includes: ["Service complet", "Équipe de 4 serveurs", "Vaisselle", "Installation/nettoyage"]
    },
    {
      id: 11,
      name: "Menu Graduation Festif",
      description: "Menu spécial graduation: Buffet haïtien complet avec 6 plats principaux, accompagnements, desserts, boissons, DJ inclus pour 4h, décoration de base.",
      category: "Menus Événements",
      price: "38.00",
      priceUnit: "par personne (min. 30)",
      image: "/placeholder-images/graduation-party-food.jpg", // Remplacer
      preparationTime: 150,
      calories: 750,
      spiceLevel: 2,
      allergies: [],
      minOrder: 30,
      includes: ["DJ 4h inclus", "Décoration de base", "Buffet complet", "Service"]
    },
    // ... (autres menus à vérifier pour nameEn et images)
    {
      id: 12,
      name: "Menu Anniversaire Famille",
      description: "Menu familial pour anniversaires: Plats traditionnels, gâteau personnalisé, animation pour enfants disponible, formule conviviale et chaleureuse.",
      category: "Menus Événements",
      price: "32.00",
      priceUnit: "par personne (min. 20)",
      image: "/placeholder-images/anniversaire-famille-gateau.jpg",
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
      description: "Menu entreprise élégant: Cuisine raffinée haïtienne adaptée au milieu professionnel, service impeccable, présentation soignée, options végétariennes incluses.",
      category: "Menus Événements",
      price: "42.00",
      priceUnit: "par personne (min. 25)",
      image: "/placeholder-images/evenement-entreprise-chic.jpg",
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
      name: "Lambi Kreyòl", // Nom créole conservé
      description: "Lambi tendre mijoté dans une sauce créole authentique aux tomates fraîches et épices des îles. Spécialité de la maison pour événements spéciaux.",
      category: "Plats Spéciaux",
      price: "28.95",
      priceUnit: "par portion",
      image: "/placeholder-images/lambi-kreyol.jpg", // Remplacer
      preparationTime: 45,
      calories: 300,
      spiceLevel: 3,
      allergies: ["fruits de mer"],
      minOrder: 8
    },
    {
      id: 21,
      name: "Buffet Traiteur Complet",
      description: "Buffet traiteur complet avec 8 plats chauds, salades, accompagnements, desserts, installation complète, service pendant 4h, équipe de 3 personnes incluse.",
      category: "Formules Traiteur",
      price: "35.00",
      priceUnit: "par personne (min. 40)",
      image: "/placeholder-images/buffet-traiteur-varié.jpg", // Remplacer
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
      // item.nameEn && item.nameEn.toLowerCase().includes(searchTerm.toLowerCase())) || // nameEn a été supprimé
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getSpiceLevelText = (level: number) => {
    switch(level) {
      case 0: return "Doux";
      case 1: return "Léger";
      case 2: return "Modéré";
      case 3: return "Relevé"; // Changé pour plus de clarté
      case 4: return "Très Relevé"; // Changé
      default: return "Doux";
    }
  };

  const getSpiceColor = (level: number) => {
    switch(level) {
      case 0: return "text-green-600";
      case 1: return "text-yellow-600";
      case 2: return "text-orange-600";
      case 3: return "text-red-600"; // Gardé
      case 4: return "text-red-700"; // Assombri pour plus d'intensité
      default: return "text-green-600";
    }
  };

  return (
    <PublicLayout> {/* Utilisation du Layout Public */}
      {/* Bannière promotionnelle - Style cohérent */}
      <div className="bg-accent text-accent-foreground py-3 px-4 sm:px-6 shadow-md">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-semibold">
            <Gift className="h-5 w-5" />
            <span>PROMOTION : -15% sur les services traiteur pour événements de plus de 50 convives ce mois-ci !</span>
            <Gift className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Titre de la Page et Description */}
      <section className="py-12 md:py-16 text-center bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ChefHat className="h-10 w-10 md:h-12 md:w-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">Menu Traiteur & Événements</h1>
            <Utensils className="h-10 w-10 md:h-12 md:w-12 text-primary" />
          </div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Découvrez nos menus authentiques haïtiens conçus pour tous vos événements. Nous offrons la livraison, l'installation et un service complet pour une expérience inoubliable.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-6 text-sm">
            <Badge variant="secondary" className="px-3 py-1"><Truck className="h-4 w-4 mr-1.5" />LIVRAISON INCLUSE</Badge>
            <Badge variant="secondary" className="px-3 py-1"><Users className="h-4 w-4 mr-1.5" />ÉQUIPE DE SERVICE</Badge>
            <Badge variant="secondary" className="px-3 py-1"><ChefHat className="h-4 w-4 mr-1.5" />MATÉRIEL FOURNI</Badge>
            <Badge variant="secondary" className="px-3 py-1"><Music className="h-4 w-4 mr-1.5" />DJ DISPONIBLE</Badge>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Recherche et filtres */}
        <div className="mb-10 p-6 bg-card rounded-xl shadow-lg">
          <div className="flex flex-col md:flex-row gap-6 items-center mb-6">
            <div className="relative flex-grow w-full md:w-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Rechercher un plat, un menu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 text-base border-border focus:ring-2 focus:ring-primary rounded-lg"
              />
            </div>
             <Link href="/contact" className="w-full md:w-auto">
                <Button size="lg" className="w-full bg-primary hover:bg-primary/90">
                  <Phone className="h-5 w-5 mr-2" />
                  Demander un Devis Gratuit
                </Button>
              </Link>
          </div>

          {/* Filtres de catégories */}
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150",
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-foreground bg-card hover:bg-muted/50 border-border"
                )}
              >
                <Filter className="mr-2 h-4 w-4 opacity-70" />
                {category === "all" ? "Tous nos délices" : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Section d'Information sur les Services */}
        <section className="py-12 bg-card border-t border-b border-border/80">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
              <div className="flex flex-col items-center text-center p-4">
                <div className="p-3 bg-primary/10 rounded-full mb-3">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-lg text-foreground mb-1">Livraison Fiable</h4>
                <p className="text-sm text-muted-foreground">Partout à Montréal et ses environs.</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="p-3 bg-primary/10 rounded-full mb-3">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-lg text-foreground mb-1">Service Professionnel</h4>
                <p className="text-sm text-muted-foreground">Notre équipe expérimentée à votre service.</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="p-3 bg-primary/10 rounded-full mb-3">
                 <PartyPopper className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-lg text-foreground mb-1">Événements sur Mesure</h4>
                <p className="text-sm text-muted-foreground">Adaptés à vos besoins et votre budget.</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="p-3 bg-primary/10 rounded-full mb-3">
                  <Info className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-lg text-foreground mb-1">Devis Gratuit 24h</h4>
                <p className="text-sm text-muted-foreground">Contactez-nous pour une soumission rapide.</p>
              </div>
            </div>
          </div>
        </section>


        {/* Grille du menu */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
          {filteredMenu.map((item) => (
            <Card key={item.id} className="bg-card shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl flex flex-col group overflow-hidden transform hover:-translate-y-1">
              <div className="relative h-64"> {/* Hauteur d'image standardisée */}
                <img 
                  src={item.image || "/placeholder-images/placeholder-plat-alt.jpg"} // Placeholder alternatif
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-4 flex flex-col justify-end">
                  <h3 className="text-2xl font-bold text-white mb-1 shadow-text">{item.name}</h3>
                  <p className="text-sm text-yellow-300 font-semibold shadow-text">{item.priceUnit}</p>
                </div>
                {item.isSignature && (
                  <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground shadow-lg text-sm px-3 py-1">
                    <Star className="w-4 h-4 mr-1.5" />
                    Signature Dounie
                  </Badge>
                )}
                 <div className="absolute top-4 right-4 bg-card text-primary px-3 py-1.5 rounded-full font-bold text-md shadow-lg">
                  {item.price} $CA
                </div>
              </div>
              
              <CardContent className="p-6 flex-grow flex flex-col">
                <p className="text-muted-foreground mb-4 leading-relaxed text-base flex-grow">{item.description}</p>
                
                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>Préparation : {item.preparationTime} min</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-primary" />
                      <span>Min. {item.minOrder} portions</span>
                    </div>
                  </div>
                  
                  {item.spiceLevel > 0 && (
                    <div className={`flex items-center gap-1.5 font-medium ${getSpiceColor(item.spiceLevel)}`}>
                      🌶️ Niveau d'épice : {getSpiceLevelText(item.spiceLevel)}
                    </div>
                  )}

                  {item.includes && item.includes.length > 0 && (
                    <div className="pt-2">
                      <h4 className="text-xs font-semibold text-foreground mb-1 uppercase tracking-wider">Inclus dans ce menu :</h4>
                      <ul className="text-xs text-muted-foreground list-disc list-inside space-y-0.5">
                        {item.includes.map((include: string, index: number) => (
                          <li key={index}>{include}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {item.allergies && item.allergies.length > 0 && (
                     <div className="pt-2">
                      <h4 className="text-xs font-semibold text-destructive mb-1 uppercase tracking-wider">Allergènes :</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {item.allergies.map((allergy: string) => (
                          <Badge key={allergy} variant="destructive" className="text-xs opacity-80">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                  <Button className="flex-1 bg-primary hover:bg-primary/90 text-base py-3">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Ajouter au Devis
                  </Button>
                  <Link href={`/menu/${item.id}`} className="flex-1"> {/* Supposant une page détail par plat */}
                    <Button variant="outline" className="w-full text-base py-3">
                      Détails
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMenu.length === 0 && (
          <div className="text-center py-20">
            <Utensils className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-50" />
            <p className="text-muted-foreground text-xl mb-4">Aucun plat ou menu ne correspond à votre recherche.</p>
            <Button 
              onClick={() => {setSearchTerm(""); setSelectedCategory("all");}}
              variant="outline" 
              className="text-lg px-6 py-3"
            >
              Réinitialiser les filtres
            </Button>
          </div>
        )}

        {/* Galerie d'événements récents - Section améliorée */}
        <section className="py-16 mt-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight flex items-center justify-center gap-3">
              <Camera className="h-8 w-8 text-primary" />
              Nos Événements en Images
            </h3>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Un aperçu de la magie Dounie Cuisine lors de récents événements.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "Mariage Élégant", image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a", date: "Juin 2024" },
              { title: "Fête de Graduation", image: "https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg", date: "Juin 2024" },
              { title: "Anniversaire Mémorable", image: "https://images.pexels.com/photos/50675/banquet-wedding-society-deco-50675.jpeg", date: "Mai 2024" },
              { title: "Cocktail d'Entreprise", image: "https://images.unsplash.com/photo-1653821355736-0c2598d0a63e", date: "Mai 2024" }
            ].map((event, index) => (
              <Link href="/galerie" key={index} className="block relative group rounded-xl overflow-hidden shadow-lg aspect-square">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent p-4 flex flex-col justify-end">
                  <h4 className="font-semibold text-white text-lg mb-0.5 shadow-text">{event.title}</h4>
                  <p className="text-xs text-white/80 shadow-text">{event.date}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/galerie">
              <Button size="lg" variant="default" className="text-lg px-8 py-3 bg-accent hover:bg-accent/90 text-accent-foreground">
                <Camera className="h-5 w-5 mr-2" />
                Explorer Toute la Galerie
              </Button>
            </Link>
          </div>
        </section>

        {/* Information nutritionnelle et services - Section améliorée */}
        <section className="py-16 bg-card rounded-xl shadow-lg">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
                Qualité & Engagement Dounie Cuisine
              </h3>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Plus qu'un repas, une expérience culinaire authentique et un service attentionné.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-foreground">
              <div className="flex flex-col items-center text-center p-4">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <ChefHat className="h-10 w-10 text-primary" />
                </div>
                <h4 className="font-semibold text-xl mb-2">Ingrédients Frais & Authentiques</h4>
                <p className="text-sm text-muted-foreground">Nous sélectionnons les meilleurs ingrédients, certains importés directement d'Haïti, pour garantir des saveurs authentiques et une qualité irréprochable.</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <Heart className="h-10 w-10 text-primary" />
                </div>
                <h4 className="font-semibold text-xl mb-2">Passion & Savoir-Faire</h4>
                <p className="text-sm text-muted-foreground">Chaque plat est préparé avec amour, en respectant les recettes traditionnelles haïtiennes transmises de génération en génération.</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                 <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <h4 className="font-semibold text-xl mb-2">Service Client Dédié</h4>
                <p className="text-sm text-muted-foreground">Notre équipe est à votre écoute 24/7 durant vos événements pour assurer une expérience parfaite et sans tracas.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to action final - Style cohérent */}
        <section className="text-center mt-16 mb-8 py-12 bg-gradient-to-r from-primary to-secondary rounded-xl text-primary-foreground shadow-2xl">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Prêt à Célébrer avec Dounie Cuisine ?</h3>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
            Devis gratuit sous 24h • Service professionnel garanti • Satisfaction 100%
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/reservations">
              <Button size="xl" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-3 transform hover:scale-105 transition-transform">
                <PartyPopper className="h-6 w-6 mr-2" />
                Réserver Votre Événement
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="xl" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-3 transform hover:scale-105 transition-transform">
                <Phone className="h-6 w-6 mr-2" />
                Obtenir un Devis Gratuit
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
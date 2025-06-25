import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertReservationSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Heart, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Users,
  ChefHat,
  Utensils,
  Award,
  Music,
  Camera,
  Coffee,
  Truck,
  ShoppingCart,
  Gift,
  PartyPopper,
  Calendar,
  Filter,
  X,
  Play,
  Facebook,
  Instagram,
  MessageCircle
} from "lucide-react";

export function HaitianHome() {
  const { toast } = useToast();
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);

  // Données du menu haïtien authentique
  const haitianMenu = [
    {
      id: 1,
      name: "Diri ak Djon Djon",
      nameEn: "Black Mushroom Rice",
      description: "Riz parfumé aux champignons noirs haïtiens, accompagné de légumes créoles et viande de choix",
      category: "Plats Principaux",
      price: "24.95",
      image: "/api/placeholder/300/200",
      isSignature: true
    },
    {
      id: 2,
      name: "Griot ak Bannann",
      nameEn: "Fried Pork with Plantain",
      description: "Porc mariné et frit accompagné de bananes plantains et pikliz maison",
      category: "Plats Principaux", 
      price: "26.50",
      image: "/api/placeholder/300/200",
      isSignature: true
    },
    {
      id: 3,
      name: "Accras de Morue",
      nameEn: "Cod Fritters",
      description: "Beignets de morue épicés, croustillants à l'extérieur, moelleux à l'intérieur",
      category: "Entrées",
      price: "12.95",
      image: "/api/placeholder/300/200"
    },
    {
      id: 4,
      name: "Soup Joumou",
      nameEn: "Pumpkin Soup",
      description: "Soupe traditionnelle à la citrouille, symbole de l'indépendance haïtienne",
      category: "Entrées",
      price: "14.50",
      image: "/api/placeholder/300/200",
      isSignature: true
    },
    {
      id: 5,
      name: "Poul ak nwa",
      nameEn: "Chicken in Cashew Sauce",
      description: "Poulet mijoté dans une sauce aux noix de cajou et épices créoles",
      category: "Plats Principaux",
      price: "23.95",
      image: "/api/placeholder/300/200"
    },
    {
      id: 6,
      name: "Lambi nan Sos Kreyol",
      nameEn: "Conch in Creole Sauce",
      description: "Lambi tendre mijoté dans une sauce créole aux tomates et épices",
      category: "Fruits de Mer",
      price: "28.95",
      image: "/api/placeholder/300/200"
    },
    {
      id: 7,
      name: "Pwason Boukannen",
      nameEn: "Grilled Fish",
      description: "Poisson grillé aux épices haïtiennes, servi avec légumes de saison",
      category: "Fruits de Mer",
      price: "25.50",
      image: "/api/placeholder/300/200"
    },
    {
      id: 8,
      name: "Pikliz",
      nameEn: "Spicy Pickled Vegetables",
      description: "Condiment traditionnel haïtien aux légumes marinés et piments",
      category: "Accompagnements",
      price: "6.95",
      image: "/api/placeholder/300/200"
    },
    {
      id: 9,
      name: "Legim ak Vyann",
      nameEn: "Vegetable Stew with Meat",
      description: "Ragoût de légumes haïtiens avec viande, plat réconfortant traditionnel",
      category: "Plats Principaux",
      price: "22.95",
      image: "/api/placeholder/300/200"
    },
    {
      id: 10,
      name: "Akasan",
      nameEn: "Corn Drink",
      description: "Boisson traditionnelle à base de maïs, cannelle et lait condensé",
      category: "Boissons",
      price: "8.50",
      image: "/api/placeholder/300/200"
    },
    {
      id: 11,
      name: "Doukounou",
      nameEn: "Corn Pudding",
      description: "Dessert traditionnel haïtien à base de maïs et lait de coco",
      category: "Desserts",
      price: "9.95",
      image: "/api/placeholder/300/200"
    },
    {
      id: 12,
      name: "Ti Punch Kreyol",
      nameEn: "Creole Rum Punch",
      description: "Rhum blanc haïtien, lime fraîche et sirop de canne",
      category: "Boissons",
      price: "12.50",
      image: "/api/placeholder/300/200"
    }
  ];

  // Galerie photos avec catégories
  const galleryImages = [
    { id: 1, title: "Diri ak Djon Djon", category: "Plats", image: "/api/placeholder/400/300" },
    { id: 2, title: "Griot traditionnel", category: "Plats", image: "/api/placeholder/400/300" },
    { id: 3, title: "Ambiance restaurant", category: "Restaurant", image: "/api/placeholder/400/300" },
    { id: 4, title: "Chef en action", category: "Équipe", image: "/api/placeholder/400/300" },
    { id: 5, title: "Soirée kulturelle", category: "Événements", image: "/api/placeholder/400/300" },
    { id: 6, title: "Accras fraîchement préparés", category: "Plats", image: "/api/placeholder/400/300" },
    { id: 7, title: "Salle principale", category: "Restaurant", image: "/api/placeholder/400/300" },
    { id: 8, title: "Équipe de cuisine", category: "Équipe", image: "/api/placeholder/400/300" }
  ];

  const categories = ["all", "Entrées", "Plats Principaux", "Fruits de Mer", "Accompagnements", "Desserts", "Boissons"];
  const galleryCategories = ["all", "Plats", "Restaurant", "Équipe", "Événements"];

  // Filtrer les éléments
  const filteredMenu = haitianMenu.filter(item => 
    selectedCategory === "all" || item.category === selectedCategory
  );

  const filteredGallery = galleryImages.filter(item =>
    selectedGalleryCategory === "all" || item.category === selectedGalleryCategory
  );

  // Formulaire de réservation
  const reservationForm = useForm({
    resolver: zodResolver(insertReservationSchema.extend({
      dateTime: insertReservationSchema.shape.dateTime.transform((val) => new Date(val))
    })),
    defaultValues: {
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      partySize: 2,
      dateTime: new Date(),
      specialRequests: ""
    }
  });

  // Formulaire de contact
  const contactForm = useForm({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  const reservationMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/reservations", { method: "POST", body: data }),
    onSuccess: () => {
      toast({ 
        title: "Réservation confirmée!", 
        description: "Mèsi anpil! Nous vous contacterons bientôt pour confirmer." 
      });
      setIsReservationOpen(false);
      reservationForm.reset();
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-blue-50">
      {/* En-tête Hero avec couleurs haïtiennes */}
      <header className="relative overflow-hidden bg-gradient-to-r from-red-600 via-blue-600 to-red-600 min-h-screen">
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Contenu Hero */}
        <div className="relative z-10 flex items-center justify-center min-h-screen text-center text-white px-6">
          <div className="max-w-4xl mx-auto">
            {/* Logo/Titre principal */}
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-bold mb-4 tracking-tight">
                Dounie Cuisine
              </h1>
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-8 h-1 bg-red-500"></div>
                <div className="w-8 h-1 bg-blue-500"></div>
                <div className="w-8 h-1 bg-red-500"></div>
              </div>
              <p className="text-xl md:text-2xl text-yellow-100">
                Goûtez l'authenticité de la cuisine haïtienne
              </p>
              <p className="text-lg text-blue-100 mt-2">
                Taste the authenticity of Haitian cuisine
              </p>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Dialog open={isReservationOpen} onOpenChange={setIsReservationOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold text-lg px-8 py-4">
                    <Calendar className="mr-2 h-5 w-5" />
                    Fè Rezèvasyon • Réserver
                  </Button>
                </DialogTrigger>
              </Dialog>
              
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4">
                <Utensils className="mr-2 h-5 w-5" />
                Wè Meni • Voir Menu
              </Button>
            </div>

            {/* Caractéristiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <ChefHat className="h-8 w-8 mx-auto mb-3 text-yellow-300" />
                <h3 className="font-semibold mb-2">Chef Haïtien Authentique</h3>
                <p className="text-sm text-blue-100">Recettes traditionnelles transmises de génération en génération</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <Award className="h-8 w-8 mx-auto mb-3 text-yellow-300" />
                <h3 className="font-semibold mb-2">Ingrédients Authentiques</h3>
                <p className="text-sm text-blue-100">Épices et produits importés directement d'Haïti</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <Music className="h-8 w-8 mx-auto mb-3 text-yellow-300" />
                <h3 className="font-semibold mb-2">Ambiance Culturelle</h3>
                <p className="text-sm text-blue-100">Musique kompa et événements culturels haïtiens</p>
              </div>
            </div>
          </div>
        </div>

        {/* Indicateur de scroll */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </header>

      {/* Section Menu Authentique */}
      <section id="menu" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-1 bg-red-500"></div>
              <h2 className="text-4xl font-bold text-gray-800">Meni Tradisyonèl • Menu Traditionnel</h2>
              <div className="w-8 h-1 bg-blue-500"></div>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez les saveurs authentiques d'Haïti avec nos plats traditionnels préparés selon les recettes ancestrales
            </p>
          </div>

          {/* Filtres de catégories */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-red-600 hover:bg-red-700" : "border-red-200 hover:bg-red-50"}
              >
                {category === "all" ? "Tout • All" : category}
              </Button>
            ))}
          </div>

          {/* Grille du menu */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                      Spécialité
                    </Badge>
                  )}
                  <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full font-bold">
                    ${item.price}
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-500 italic">{item.nameEn}</p>
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="border-red-200 text-red-700">
                      {item.category}
                    </Badge>
                    <Button className="bg-red-600 hover:bg-red-700">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Kòmande • Commander
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section Galerie Interactive */}
      <section id="gallery" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Camera className="h-8 w-8 text-red-600" />
              <h2 className="text-4xl font-bold text-gray-800">Galri Foto • Galerie Photos</h2>
              <Camera className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-lg text-gray-600">Plongez dans l'univers visuel de Dounie Cuisine</p>
          </div>

          {/* Filtres galerie */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {galleryCategories.map((category) => (
              <Button
                key={category}
                variant={selectedGalleryCategory === category ? "default" : "outline"}
                onClick={() => setSelectedGalleryCategory(category)}
                className={selectedGalleryCategory === category ? "bg-blue-600 hover:bg-blue-700" : "border-blue-200 hover:bg-blue-50"}
              >
                <Filter className="mr-2 h-4 w-4" />
                {category === "all" ? "Tout" : category}
              </Button>
            ))}
          </div>

          {/* Grille photos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredGallery.map((image) => (
              <div 
                key={image.id}
                className="relative group cursor-pointer overflow-hidden rounded-lg"
                onClick={() => setSelectedImage(image)}
              >
                <img 
                  src={image.image} 
                  alt={image.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-white text-center">
                    <Camera className="h-8 w-8 mx-auto mb-2" />
                    <p className="font-medium">{image.title}</p>
                    <Badge variant="secondary" className="mt-1">{image.category}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Services */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-blue-600 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Sèvis Nou Yo • Nos Services</h2>
            <p className="text-xl text-blue-100">Une expérience complète pour tous vos événements</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-white/20 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <Utensils className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Restaurant</h3>
              <p className="text-blue-100">Ambiance authentique haïtienne avec service chaleureux</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-white/20 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <Truck className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Livraison</h3>
              <p className="text-blue-100">Savourez nos plats chez vous avec notre service de livraison</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-white/20 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <PartyPopper className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Traiteur</h3>
              <p className="text-blue-100">Service traiteur pour vos événements et célébrations</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-white/20 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <Music className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Événements</h3>
              <p className="text-blue-100">Organisation d'événements culturels et soirées kompa</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Contact */}
      <section id="contact" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Kontak • Contact</h2>
            <p className="text-lg text-gray-600">N ap tann nou • Nous vous attendons</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Informations de contact */}
            <div className="space-y-8">
              <Card className="border-red-100">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-600">
                    <MapPin className="h-5 w-5" />
                    Kote Nou Ye • Notre Adresse
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    123 Rue des Épices<br />
                    Montréal, QC H2X 1Y7<br />
                    Canada
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-blue-100">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-600">
                    <Clock className="h-5 w-5" />
                    Lè Nou Ouvè • Horaires
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    <div className="flex justify-between">
                      <span>Lundi - Jeudi:</span>
                      <span>11h00 - 22h00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vendredi - Samedi:</span>
                      <span>11h00 - 23h00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dimanche:</span>
                      <span>12h00 - 21h00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-yellow-200">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Jwenn Nou • Nous Joindre</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-red-600" />
                      <span className="text-gray-700">(514) 555-DOUNIE</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <span className="text-gray-700">info@douniequisine.com</span>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <Button size="sm" variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-50">
                        <Facebook className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
                        <Instagram className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-green-500 text-green-500 hover:bg-green-50">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Formulaire de contact */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Voye Yon Mesaj • Envoyez un Message</CardTitle>
                <CardDescription>
                  Nous répondons rapidement à tous vos messages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Non • Nom</Label>
                      <Input placeholder="Votre nom" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input type="email" placeholder="votre@email.com" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="subject">Sijè • Sujet</Label>
                    <Input placeholder="Sujet de votre message" />
                  </div>
                  <div>
                    <Label htmlFor="message">Mesaj • Message</Label>
                    <Textarea 
                      placeholder="Votre message..." 
                      rows={5}
                    />
                  </div>
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    <Mail className="mr-2 h-4 w-4" />
                    Voye Mesaj • Envoyer
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer haïtien */}
      <footer className="bg-gradient-to-r from-red-800 via-blue-800 to-red-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Dounie Cuisine</h3>
              <p className="text-red-100 mb-4">
                Goûtez l'authenticité de la cuisine haïtienne au cœur de Montréal.
              </p>
              <p className="text-blue-100 text-sm">
                "Manje ak kè kontan" • "Mangez avec le cœur content"
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Meni • Menu</h4>
              <ul className="space-y-2 text-red-100">
                <li><a href="#" className="hover:text-white">Entrées</a></li>
                <li><a href="#" className="hover:text-white">Plats Principaux</a></li>
                <li><a href="#" className="hover:text-white">Desserts</a></li>
                <li><a href="#" className="hover:text-white">Boissons</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Sèvis • Services</h4>
              <ul className="space-y-2 text-blue-100">
                <li><a href="#" className="hover:text-white">Réservations</a></li>
                <li><a href="#" className="hover:text-white">Livraison</a></li>
                <li><a href="#" className="hover:text-white">Traiteur</a></li>
                <li><a href="#" className="hover:text-white">Événements</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Nouvel • Newsletter</h4>
              <p className="text-blue-100 mb-4">Restez informé de nos nouveautés</p>
              <div className="space-y-2">
                <Input 
                  placeholder="Votre email" 
                  className="bg-white/20 border-white/30 text-white placeholder:text-blue-200"
                />
                <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
                  <Gift className="mr-2 h-4 w-4" />
                  Abòne • S'abonner
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-6 h-1 bg-red-500"></div>
              <div className="w-6 h-1 bg-blue-500"></div>
              <div className="w-6 h-1 bg-red-500"></div>
            </div>
            <p className="text-blue-100">&copy; 2024 Dounie Cuisine. Tout dwa yo rezève • Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      {/* Modal Galerie */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedImage.title}</DialogTitle>
            </DialogHeader>
            <div className="relative">
              <img 
                src={selectedImage.image} 
                alt={selectedImage.title}
                className="w-full h-96 object-cover rounded-lg"
              />
              <Badge className="absolute top-3 right-3">{selectedImage.category}</Badge>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog de Réservation */}
      <Dialog open={isReservationOpen} onOpenChange={setIsReservationOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Calendar className="h-5 w-5" />
              Fè Rezèvasyon • Réservation
            </DialogTitle>
            <DialogDescription>
              Réservez votre table pour une expérience culinaire haïtienne authentique
            </DialogDescription>
          </DialogHeader>
          <Form {...reservationForm}>
            <form onSubmit={reservationForm.handleSubmit((data) => reservationMutation.mutate(data))} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={reservationForm.control}
                  name="guestName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Non • Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre nom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={reservationForm.control}
                  name="partySize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Moun • Personnes</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Nb" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[1,2,3,4,5,6,7,8].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? 'personne' : 'personnes'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={reservationForm.control}
                name="guestEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="votre@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={reservationForm.control}
                name="guestPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefòn • Téléphone</FormLabel>
                    <FormControl>
                      <Input placeholder="(514) 555-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={reservationForm.control}
                name="dateTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dat ak Lè • Date & Heure</FormLabel>
                    <FormControl>
                      <Input 
                        type="datetime-local" 
                        value={field.value ? new Date(field.value.getTime() - field.value.getTimezoneOffset() * 60000).toISOString().slice(0, -8) : ''}
                        onChange={(e) => field.onChange(new Date(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={reservationForm.control}
                name="specialRequests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Demann Espesyal • Demandes Spéciales</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Allergies, célébration, préférences..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={reservationMutation.isPending}>
                  {reservationMutation.isPending ? "Rezèvasyon..." : "Konfime Rezèvasyon • Confirmer"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
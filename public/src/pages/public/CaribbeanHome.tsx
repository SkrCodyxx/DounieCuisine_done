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
  Sun, 
  Waves, 
  Palmtree, 
  UtensilsCrossed, 
  Calendar, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Users,
  ChefHat,
  Utensils,
  Heart,
  Award,
  Music,
  Camera,
  Coffee,
  Truck,
  ShoppingCart,
  Gift,
  PartyPopper
} from "lucide-react";

export function CaribbeanHome() {
  const { toast } = useToast();
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Récupérer le menu et les thèmes
  const { data: menuItems, isLoading: menuLoading } = useQuery({
    queryKey: ["/api/menu"],
    queryFn: () => apiRequest("/api/menu")
  });

  const { data: currentTheme } = useQuery({
    queryKey: ["/api/themes/active"],
    queryFn: () => apiRequest("/api/themes/active")
  });

  const { data: announcements } = useQuery({
    queryKey: ["/api/announcements/active"],
    queryFn: () => apiRequest("/api/announcements/active")
  });

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

  const reservationMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/reservations", { method: "POST", body: data }),
    onSuccess: () => {
      toast({ 
        title: "Réservation confirmée!", 
        description: "Vous recevrez un email de confirmation sous peu." 
      });
      setIsReservationOpen(false);
      reservationForm.reset();
    },
    onError: () => {
      toast({ 
        title: "Erreur", 
        description: "Impossible de créer la réservation. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  });

  // Filtrer les éléments du menu
  const filteredMenuItems = menuItems?.filter((item: any) => 
    selectedCategory === "all" || item.category === selectedCategory
  );

  const categories = ["all", "Entrées", "Plats Principaux", "Accompagnements", "Desserts", "Boissons"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 caribbean-theme">
      {/* En-tête Hero avec animations caribéennes */}
      <header className="relative overflow-hidden">
        <div className="caribbean-gradient min-h-screen flex items-center justify-center relative">
          {/* Éléments décoratifs animés */}
          <div className="absolute top-10 left-10">
            <Sun className="h-16 w-16 text-yellow-300 sunshine-glow" />
          </div>
          <div className="absolute top-20 right-20">
            <Palmtree className="h-20 w-20 text-green-300 tropical-breeze" />
          </div>
          <div className="absolute bottom-20 left-1/4">
            <Waves className="h-12 w-12 text-blue-300 wave-animation" />
          </div>
          
          <div className="text-center text-white z-10 max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Sun className="h-12 w-12 text-yellow-300 sunshine-glow" />
              <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
                Saveurs des Caraïbes
              </h1>
              <Palmtree className="h-12 w-12 text-green-300 tropical-breeze" />
            </div>
            
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Découvrez l'authenticité de la cuisine caribéenne dans une ambiance tropicale
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Dialog open={isReservationOpen} onOpenChange={setIsReservationOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="caribbean-button text-lg px-8 py-4">
                    <Calendar className="mr-2 h-5 w-5" />
                    Réserver une Table
                  </Button>
                </DialogTrigger>
              </Dialog>
              
              <Button size="lg" variant="outline" className="bg-white/20 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4">
                <UtensilsCrossed className="mr-2 h-5 w-5" />
                Voir le Menu
              </Button>
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="tropical-card text-gray-800 p-6">
                <ChefHat className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                <h3 className="font-semibold mb-2">Chef Authentique</h3>
                <p className="text-sm">Cuisine traditionnelle par des chefs caribéens expérimentés</p>
              </div>
              <div className="tropical-card text-gray-800 p-6">
                <Award className="h-8 w-8 mx-auto mb-3 text-green-600" />
                <h3 className="font-semibold mb-2">Ingrédients Frais</h3>
                <p className="text-sm">Produits importés directement des Caraïbes pour une saveur authentique</p>
              </div>
              <div className="tropical-card text-gray-800 p-6">
                <Music className="h-8 w-8 mx-auto mb-3 text-orange-600" />
                <h3 className="font-semibold mb-2">Ambiance Festive</h3>
                <p className="text-sm">Musique live et animations pour une expérience complète</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Annonces spéciales */}
      {announcements && announcements.length > 0 && (
        <section className="py-8 bg-orange-100">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <PartyPopper className="h-8 w-8 mx-auto mb-4 text-orange-600" />
              <h2 className="text-2xl font-bold text-orange-800 mb-4">Actualités & Promotions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {announcements.map((announcement: any) => (
                  <Card key={announcement.id} className="border-orange-200">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-orange-800 mb-2">{announcement.title}</h3>
                      <p className="text-sm text-orange-700">{announcement.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Menu Section */}
      <section id="menu" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <UtensilsCrossed className="h-8 w-8 text-blue-600" />
              <h2 className="text-4xl font-bold text-gray-800">Notre Menu Caribéen</h2>
              <ChefHat className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Savourez nos spécialités authentiques préparées avec passion et les meilleurs ingrédients des Caraïbes
            </p>
          </div>

          {/* Filtres de catégories */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "caribbean-button" : ""}
              >
                {category === "all" ? "Tout" : category}
              </Button>
            ))}
          </div>

          {/* Grille du menu */}
          {menuLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement du menu...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenuItems?.map((item: any) => (
                <Card key={item.id} className="tropical-card overflow-hidden hover:scale-105 transition-transform">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-gray-800">{item.name}</CardTitle>
                        <p className="text-sm text-gray-500 italic">{item.nameEn}</p>
                      </div>
                      <Badge className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold">
                        ${item.price}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{item.preparationTime} min</span>
                        {item.calories && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-600">{item.calories} cal</span>
                          </>
                        )}
                      </div>
                      
                      {item.isFestive && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                          Spécialité Caribéenne
                        </Badge>
                      )}
                      
                      {item.allergies && item.allergies.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.allergies.map((allergy: string) => (
                            <Badge key={allergy} variant="outline" className="text-xs">
                              {allergy}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <Button className="w-full mt-4 caribbean-button">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Commander
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 ocean-gradient text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Nos Services</h2>
            <p className="text-xl text-blue-100">Une expérience complète pour tous vos événements</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white/20 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Utensils className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sur Place</h3>
              <p className="text-blue-100">Ambiance tropicale authentique avec service attentionné</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/20 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Truck className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Livraison</h3>
              <p className="text-blue-100">Livraison rapide pour savourer nos plats chez vous</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/20 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Coffee className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">À Emporter</h3>
              <p className="text-blue-100">Commandez à l'avance et récupérez rapidement</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/20 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <PartyPopper className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Événements</h3>
              <p className="text-blue-100">Traiteur pour vos fêtes et célébrations spéciales</p>
            </div>
          </div>
        </div>
      </section>

      {/* Avis Clients */}
      <section className="py-16 bg-yellow-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Ce que disent nos clients</h2>
            <div className="flex items-center justify-center gap-1 mb-4">
              {[1,2,3,4,5].map((star) => (
                <Star key={star} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 text-lg font-semibold text-gray-700">4.8/5</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="tropical-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"Une explosion de saveurs! Le Diri ak Djon Djon était absolument délicieux. L'ambiance nous transporte directement aux Caraïbes."</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    M
                  </div>
                  <div>
                    <p className="font-semibold">Marie Dubois</p>
                    <p className="text-sm text-gray-600">Cliente fidèle</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="tropical-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"Service exceptionnel et cuisine authentique. Les accras de morue sont les meilleurs que j'ai goûtés! Recommandé à 100%."</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                    J
                  </div>
                  <div>
                    <p className="font-semibold">Jean-Luc Martin</p>
                    <p className="text-sm text-gray-600">Critique culinaire</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="tropical-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"Parfait pour une soirée spéciale! L'équipe est adorable et les plats sont préparés avec amour. Une vraie découverte culinaire."</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
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

      {/* Contact & Localisation */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Nous Trouver</h2>
            <p className="text-lg text-gray-600">Venez découvrir notre petit coin des Caraïbes au cœur de la ville</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <Card className="tropical-card">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    Adresse
                  </h3>
                  <p className="text-gray-700">
                    123 Rue des Palmiers<br />
                    Montréal, QC H2X 1Y7<br />
                    Canada
                  </p>
                </CardContent>
              </Card>
              
              <Card className="tropical-card">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    Heures d'Ouverture
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    <div className="flex justify-between">
                      <span>Lun - Jeu:</span>
                      <span>11h00 - 22h00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ven - Sam:</span>
                      <span>11h00 - 23h00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dimanche:</span>
                      <span>12h00 - 21h00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="tropical-card">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Contact</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-orange-600" />
                      <span className="text-gray-700">(514) 555-CARIBBEAN</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-orange-600" />
                      <span className="text-gray-700">info@saveurs-caraibes.com</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center text-gray-600">
                <MapPin className="h-12 w-12 mx-auto mb-4" />
                <p>Carte interactive</p>
                <p className="text-sm">Intégration Google Maps</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="caribbean-footer py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sun className="h-8 w-8 text-yellow-300" />
                <h3 className="text-xl font-bold">Saveurs des Caraïbes</h3>
              </div>
              <p className="text-blue-100 mb-4">
                Votre destination authentique pour la cuisine caribéenne au cœur de Montréal.
              </p>
              <div className="flex gap-4">
                <Button size="sm" variant="outline" className="bg-white/20 border-white text-white hover:bg-white hover:text-blue-600">
                  <Camera className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="bg-white/20 border-white text-white hover:bg-white hover:text-blue-600">
                  <Music className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="bg-white/20 border-white text-white hover:bg-white hover:text-blue-600">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Menu</h4>
              <ul className="space-y-2 text-blue-100">
                <li><a href="#" className="hover:text-white">Entrées</a></li>
                <li><a href="#" className="hover:text-white">Plats Principaux</a></li>
                <li><a href="#" className="hover:text-white">Desserts</a></li>
                <li><a href="#" className="hover:text-white">Boissons</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-blue-100">
                <li><a href="#" className="hover:text-white">Réservations</a></li>
                <li><a href="#" className="hover:text-white">Livraison</a></li>
                <li><a href="#" className="hover:text-white">Traiteur</a></li>
                <li><a href="#" className="hover:text-white">Événements Privés</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Newsletter</h4>
              <p className="text-blue-100 mb-4">Restez informé de nos nouveautés et événements spéciaux</p>
              <div className="space-y-2">
                <Input 
                  placeholder="Votre email" 
                  className="bg-white/20 border-white text-white placeholder:text-blue-200"
                />
                <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">
                  <Gift className="mr-2 h-4 w-4" />
                  S'abonner
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-blue-100">
            <p>&copy; 2024 Saveurs des Caraïbes. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      {/* Dialog de Réservation */}
      <Dialog open={isReservationOpen} onOpenChange={setIsReservationOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Réservation de Table
            </DialogTitle>
            <DialogDescription>
              Réservez votre table pour une expérience caribéenne inoubliable
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
                      <FormLabel>Nom</FormLabel>
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
                      <FormLabel>Personnes</FormLabel>
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
                    <FormLabel>Téléphone</FormLabel>
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
                    <FormLabel>Date & Heure</FormLabel>
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
                    <FormLabel>Demandes Spéciales</FormLabel>
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
                <Button type="submit" className="caribbean-button w-full" disabled={reservationMutation.isPending}>
                  {reservationMutation.isPending ? "Réservation..." : "Confirmer la Réservation"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
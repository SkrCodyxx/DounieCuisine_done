import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "wouter";
import { 
  Camera,
  Filter,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Download,
  PartyPopper,
  Users,
  Calendar,
  Star,
  Phone,
  Utensils
} from "lucide-react";

function GalleryPage() {
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Galerie d'événements traiteur avec photos réelles
  const eventGallery = [
    // MARIAGES
    { 
      id: 1, 
      title: "Mariage Traditionnel Haïtien - 200 personnes", 
      category: "Mariages", 
      image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a", 
      description: "Service traiteur complet avec menu traditionnel, DJ live et décoration aux couleurs d'Haïti",
      date: "Juin 2025",
      guests: 200,
      services: ["Traiteur", "DJ", "Décoration", "Service complet"]
    },
    { 
      id: 2, 
      title: "Mariage Élégant - 150 personnes", 
      category: "Mariages", 
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622", 
      description: "Cérémonie raffinée avec buffet haïtien gastronomique et animation musicale",
      date: "Mai 2025",
      guests: 150,
      services: ["Buffet gastronomique", "Animation", "Photos", "Coordination"]
    },
    { 
      id: 3, 
      title: "Mariage Intime - 80 personnes", 
      category: "Mariages", 
      image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92", 
      description: "Célébration familiale avec nos spécialités authentiques dans un cadre chaleureux",
      date: "Avril 2025",
      guests: 80,
      services: ["Menu famille", "Service personnalisé", "Ambiance intimiste"]
    },

    // GRADUATIONS
    { 
      id: 4, 
      title: "Graduation Universitaire - 120 personnes", 
      category: "Graduations", 
      image: "https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg", 
      description: "Buffet festif pour célébrer le succès académique avec famille et amis",
      date: "Juin 2025",
      guests: 120,
      services: ["Buffet festif", "Animation DJ", "Espace photos", "Gâteau personnalisé"]
    },
    { 
      id: 5, 
      title: "Graduation Lycée - 200 personnes", 
      category: "Graduations", 
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1", 
      description: "Grande célébration avec menu traditionnel complet et animations pour tous les âges",
      date: "Mai 2025",
      guests: 200,
      services: ["Menu complet", "Animations jeunes", "DJ professionnel", "Décoration festive"]
    },

    // ANNIVERSAIRES
    { 
      id: 6, 
      title: "50ème Anniversaire - 100 personnes", 
      category: "Anniversaires", 
      image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3", 
      description: "Fête d'anniversaire mémorable avec nos meilleurs plats et ambiance caribéenne",
      date: "Mars 2025",
      guests: 100,
      services: ["Menu spécial", "Musique live", "Gâteau sur mesure", "Décoration thématique"]
    },
    { 
      id: 7, 
      title: "Anniversaire Enfant - 50 personnes", 
      category: "Anniversaires", 
      image: "https://images.pexels.com/photos/1729797/pexels-photo-1729797.jpeg", 
      description: "Fête d'anniversaire colorée avec menu adapté aux enfants et animations",
      date: "Avril 2025",
      guests: 50,
      services: ["Menu enfants", "Animations", "Décoration colorée", "Jeux"]
    },

    // ÉVÉNEMENTS ENTREPRISE
    { 
      id: 8, 
      title: "Événement Corporatif - 300 personnes", 
      category: "Entreprise", 
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865", 
      description: "Service traiteur professionnel pour événement d'entreprise avec présentation soignée",
      date: "Février 2025",
      guests: 300,
      services: ["Service corporate", "Présentation premium", "Équipe professionnelle", "Logistique complète"]
    },
    { 
      id: 9, 
      title: "Lancement de Produit - 150 personnes", 
      category: "Entreprise", 
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30", 
      description: "Cocktail dînatoire élégant pour lancement avec canapés haïtiens revisités",
      date: "Janvier 2025",
      guests: 150,
      services: ["Cocktail dînatoire", "Canapés gastronomiques", "Service discret", "Présentation moderne"]
    },

    // BAPTÊMES
    { 
      id: 10, 
      title: "Baptême Traditionnel - 80 personnes", 
      category: "Baptêmes", 
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3", 
      description: "Célébration religieuse avec repas traditionnel familial et ambiance conviviale",
      date: "Mars 2025",
      guests: 80,
      services: ["Menu familial", "Ambiance conviviale", "Service respectueux", "Gâteau de baptême"]
    },

    // ÉVÉNEMENTS COMMUNAUTAIRES
    { 
      id: 11, 
      title: "Fête Communautaire - 500 personnes", 
      category: "Communautaire", 
      image: "https://images.unsplash.com/photo-1517263904808-5dc91e3e7044", 
      description: "Grand événement communautaire avec service traiteur complet et animations haïtiennes",
      date: "Juillet 2024",
      guests: 500,
      services: ["Service grande capacité", "Animations culturelles", "Équipe étendue", "Logistique majeure"]
    },

    // BUFFETS & MENU SETUP
    { 
      id: 12, 
      title: "Setup Buffet Mariage", 
      category: "Installations", 
      image: "https://images.unsplash.com/photo-1555244162-803834f70033", 
      description: "Notre équipe professionnelle en action lors de l'installation d'un buffet complet",
      date: "Service type",
      guests: 0,
      services: ["Installation professionnelle", "Présentation soignée", "Équipe expérimentée"]
    }
  ];

  const galleryCategories = ["all", "Mariages", "Graduations", "Anniversaires", "Entreprise", "Baptêmes", "Communautaire", "Installations"];

  const filteredGallery = eventGallery.filter(item =>
    selectedGalleryCategory === "all" || item.category === selectedGalleryCategory
  );

  const openImageModal = (image: any) => {
    setSelectedImage(image);
    setCurrentImageIndex(filteredGallery.findIndex(img => img.id === image.id));
  };

  const nextImage = () => {
    const nextIndex = (currentImageIndex + 1) % filteredGallery.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(filteredGallery[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = (currentImageIndex - 1 + filteredGallery.length) % filteredGallery.length;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(filteredGallery[prevIndex]);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Mariages": return "bg-red-100 text-red-800";
      case "Graduations": return "bg-blue-100 text-blue-800";
      case "Anniversaires": return "bg-yellow-100 text-yellow-800";
      case "Entreprise": return "bg-purple-100 text-purple-800";
      case "Baptêmes": return "bg-green-100 text-green-800";
      case "Communautaire": return "bg-orange-100 text-orange-800";
      case "Installations": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-blue-50">
      {/* Bannière promotion */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-3 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <Camera className="h-4 w-4" />
            <span>📸 NOUVELLE GALERIE: Photos de nos derniers événements traiteur ! 📸</span>
            <Camera className="h-4 w-4" />
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
              <Camera className="h-8 w-8 text-yellow-300" />
              <h1 className="text-5xl font-bold">Galerie Événements Traiteur</h1>
              <PartyPopper className="h-8 w-8 text-yellow-300" />
            </div>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Découvrez nos réalisations d'événements - Service traiteur complet avec livraison, installation et équipe professionnelle
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              <Badge className="bg-red-500 text-white">🍽️ SERVICE TRAITEUR</Badge>
              <Badge className="bg-blue-500 text-white">🎵 DJ INCLUS</Badge>
              <Badge className="bg-green-500 text-white">🚚 LIVRAISON & INSTALLATION</Badge>
              <Badge className="bg-purple-500 text-white">👥 ÉQUIPE COMPLÈTE</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Statistiques des événements */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-red-100 text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{eventGallery.filter(img => img.category === "Mariages").length}</div>
              <div className="text-sm text-gray-600">Mariages Réalisés</div>
            </CardContent>
          </Card>
          <Card className="border-blue-100 text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{eventGallery.filter(img => img.category === "Graduations").length}</div>
              <div className="text-sm text-gray-600">Graduations</div>
            </CardContent>
          </Card>
          <Card className="border-green-100 text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{eventGallery.filter(img => img.category === "Entreprise").length}</div>
              <div className="text-sm text-gray-600">Événements Entreprise</div>
            </CardContent>
          </Card>
          <Card className="border-yellow-200 text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">2500+</div>
              <div className="text-sm text-gray-600">Personnes Servies</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres par type d'événement */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {galleryCategories.map((category) => (
            <Button
              key={category}
              variant={selectedGalleryCategory === category ? "default" : "outline"}
              onClick={() => setSelectedGalleryCategory(category)}
              className={selectedGalleryCategory === category ? "bg-red-600 hover:bg-red-700" : "border-red-200 hover:bg-red-50"}
            >
              <Filter className="mr-2 h-4 w-4" />
              {category === "all" ? "Tous Événements" : category}
            </Button>
          ))}
        </div>

        {/* Grille photos d'événements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((event) => (
            <div 
              key={event.id}
              className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
              onClick={() => openImageModal(event)}
            >
              <img 
                src={event.image} 
                alt={event.title}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-200 mb-2">{event.description}</p>
                  {event.guests > 0 && (
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{event.guests} personnes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{event.date}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute top-3 right-3">
                <Badge className={`text-xs ${getCategoryColor(event.category)}`}>
                  {event.category}
                </Badge>
              </div>
              {event.services && event.services.length > 0 && (
                <div className="absolute top-3 left-3">
                  <Badge className="bg-blue-600 text-white text-xs">
                    {event.services.length} services
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredGallery.length === 0 && (
          <div className="text-center py-12">
            <Camera className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">Aucun événement dans cette catégorie pour le moment.</p>
          </div>
        )}

        {/* Services inclus dans nos événements */}
        <Card className="mt-12 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-8">
            <h3 className="text-2xl font-semibold mb-6 text-blue-800 text-center">Services Inclus dans Tous nos Événements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Utensils className="h-8 w-8 text-red-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Service Traiteur Complet</h4>
                <p className="text-sm text-gray-600">Menu traditionnel haïtien, installation, service à l'assiette ou buffet</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <PartyPopper className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Animation & DJ</h4>
                <p className="text-sm text-gray-600">DJ professionnel, système son, musique haïtienne et internationale</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Équipe Professionnelle</h4>
                <p className="text-sm text-gray-600">Serveurs, coordinateur, équipe cuisine, service impeccable</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Service Clé en Main</h4>
                <p className="text-sm text-gray-600">Livraison, installation, service, nettoyage, tout inclus</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to action */}
        <div className="text-center mt-12">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">Prêt pour Votre Événement?</h3>
          <p className="text-lg text-gray-600 mb-8">Contactez-nous pour un devis gratuit personnalisé</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/reservations">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 px-8 py-4">
                <PartyPopper className="mr-2 h-5 w-5" />
                Réserver Votre Événement
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-4">
                <Phone className="mr-2 h-5 w-5" />
                Devis Gratuit Personnalisé
              </Button>
            </Link>
            <Link href="/menu">
              <Button size="lg" variant="outline" className="border-green-500 text-green-600 hover:bg-green-50 px-8 py-4">
                <Utensils className="mr-2 h-5 w-5" />
                Voir Menu Traiteur
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Modal image avec détails événement */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-5xl max-h-[90vh] p-0">
            <div className="relative">
              <img 
                src={selectedImage.image} 
                alt={selectedImage.title}
                className="w-full h-96 md:h-[500px] object-cover"
              />
              
              {/* Navigation */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                onClick={prevImage}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                onClick={nextImage}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>

              {/* Actions */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button variant="ghost" size="sm" className="bg-white/20 text-white hover:bg-white/30">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="bg-white/20 text-white hover:bg-white/30">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="bg-white/20 text-white hover:bg-white/30">
                  <Download className="h-4 w-4" />
                </Button>
              </div>

              <Badge className={`absolute top-4 left-4 ${getCategoryColor(selectedImage.category)}`}>
                {selectedImage.category}
              </Badge>
            </div>
            
            {/* Informations détaillées */}
            <div className="p-8">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-800 mb-4">{selectedImage.title}</DialogTitle>
              </DialogHeader>
              <p className="text-gray-600 mb-4">{selectedImage.description}</p>
              
              {selectedImage.guests > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Users className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                    <div className="font-semibold text-blue-800">{selectedImage.guests}</div>
                    <div className="text-xs text-blue-600">Personnes</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <Calendar className="h-6 w-6 mx-auto mb-1 text-green-600" />
                    <div className="font-semibold text-green-800">{selectedImage.date}</div>
                    <div className="text-xs text-green-600">Date</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <Star className="h-6 w-6 mx-auto mb-1 text-purple-600" />
                    <div className="font-semibold text-purple-800">{selectedImage.services?.length || 0}</div>
                    <div className="text-xs text-purple-600">Services</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <Camera className="h-6 w-6 mx-auto mb-1 text-yellow-600" />
                    <div className="font-semibold text-yellow-800">{currentImageIndex + 1}/{filteredGallery.length}</div>
                    <div className="text-xs text-yellow-600">Photo</div>
                  </div>
                </div>
              )}

              {selectedImage.services && selectedImage.services.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Services Fournis:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedImage.services.map((service: string, index: number) => (
                      <Badge key={index} variant="outline" className="border-blue-200 text-blue-700">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default GalleryPage;
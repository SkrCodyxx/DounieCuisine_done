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
    <PublicLayout>
      {/* Bannière promotionnelle */}
      <div className="bg-accent text-accent-foreground py-3 px-4 sm:px-6 shadow-md">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-semibold">
            <Camera className="h-5 w-5" />
            <span>NOUVELLE GALERIE : Découvrez les photos de nos derniers événements traiteur !</span>
            <Camera className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* En-tête de Page */}
      <section className="py-12 md:py-16 text-center bg-card border-b border-border">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Camera className="h-10 w-10 md:h-12 md:w-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">Notre Galerie d'Événements</h1>
            <PartyPopper className="h-10 w-10 md:h-12 md:w-12 text-primary" />
          </div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Découvrez nos réalisations et l'ambiance unique de Dounie Cuisine. Service traiteur complet avec livraison, installation et équipe professionnelle.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Statistiques des événements - Amélioré */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10 md:mb-12">
          {[
            { label: "Mariages Réalisés", value: eventGallery.filter(img => img.category === "Mariages").length, color: "text-pink-600", bgColor: "bg-pink-100" },
            { label: "Graduations Célébrées", value: eventGallery.filter(img => img.category === "Graduations").length, color: "text-blue-600", bgColor: "bg-blue-100" },
            { label: "Événements d'Entreprise", value: eventGallery.filter(img => img.category === "Entreprise").length, color: "text-indigo-600", bgColor: "bg-indigo-100" },
            { label: "Clients Satisfaits", value: "2500+", color: "text-green-600", bgColor: "bg-green-100" }
          ].map(stat => (
            <Card key={stat.label} className={`shadow-lg border-border ${stat.bgColor}`}>
              <CardContent className="p-4 md:p-6 text-center">
                <div className={`text-3xl md:text-4xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filtres par type d'événement - Amélioré */}
        <div className="mb-10 p-4 md:p-6 bg-card rounded-xl shadow-lg">
          <div className="flex flex-wrap justify-center gap-3">
            {galleryCategories.map((category) => (
              <Button
                key={category}
                variant={selectedGalleryCategory === category ? "default" : "outline"}
                onClick={() => setSelectedGalleryCategory(category)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150",
                  selectedGalleryCategory === category
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-foreground bg-card hover:bg-muted/50 border-border"
                )}
              >
                <Filter className="mr-2 h-4 w-4 opacity-70" />
                {category === "all" ? "Tous les Événements" : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Grille photos d'événements - Améliorée */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredGallery.map((event) => (
            <Card
              key={event.id}
              className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 aspect-[4/3] transform hover:-translate-y-1"
              onClick={() => openImageModal(event)}
            >
              <img 
                src={event.image || '/placeholder-images/placeholder-event.jpg'}
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4 md:p-5">
                <h3 className="font-bold text-lg md:text-xl text-white mb-1 shadow-text leading-tight">{event.title}</h3>
                <Badge className={`text-xs px-2 py-0.5 mb-1 self-start ${getCategoryColor(event.category)}`}>
                  {event.category}
                </Badge>
                <div className="flex items-center gap-3 text-xs text-white/80 shadow-text">
                  {event.guests > 0 && (
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {event.guests} pers.
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {event.date}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredGallery.length === 0 && (
          <div className="text-center py-20">
            <Camera className="h-16 w-16 mx-auto text-muted-foreground opacity-50 mb-6" />
            <p className="text-muted-foreground text-xl">Aucun événement à afficher dans cette catégorie pour le moment.</p>
            <p className="text-sm text-muted-foreground mt-2">Essayez de sélectionner une autre catégorie ou revenez bientôt !</p>
          </div>
        )}

        {/* Section "Services Inclus" - Améliorée et stylisée */}
        <section className="mt-16 md:mt-20 py-12 bg-card rounded-xl shadow-xl border border-border/80">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight flex items-center justify-center gap-3">
                <Star className="h-8 w-8 text-primary" />
                Nos Engagements pour Votre Succès
              </h3>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mt-4">
                Chaque événement avec Dounie Cuisine est une promesse de qualité, de saveur et de service impeccable.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Utensils, title: "Traiteur Authentique", description: "Menu traditionnel haïtien, buffet ou service à l'assiette." },
                { icon: Music, title: "Animation & DJ", description: "DJ professionnel, sonorisation, ambiance musicale sur mesure." },
                { icon: Users, title: "Équipe Professionnelle", description: "Serveurs, coordinateurs, cuisiniers expérimentés et courtois." },
                { icon: PartyPopper, title: "Organisation Complète", description: "De la planification à la réalisation, nous gérons tout pour vous." }
              ].map(service => (
                <div key={service.title} className="flex flex-col items-center text-center p-4">
                  <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <service.icon className="h-10 w-10 text-primary" />
                  </div>
                  <h4 className="font-semibold text-lg text-foreground mb-2">{service.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to action final - harmonisé */}
        <section className="text-center mt-16 mb-8 py-16 bg-gradient-to-r from-primary via-secondary to-accent rounded-xl text-white shadow-2xl">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Prêt à Immortaliser Votre Événement ?</h3>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
            Confiez-nous vos plus beaux moments. Contactez Dounie Cuisine dès aujourd'hui.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/reservations">
              <Button size="xl" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-3 transform hover:scale-105 transition-transform">
                <Calendar className="mr-2 h-5 w-5" />
                Réserver Votre Événement
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="xl" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-3 transform hover:scale-105 transition-transform">
                <Phone className="mr-2 h-5 w-5" />
                Demander un Devis
              </Button>
            </Link>
          </div>
        </section>
      </div>

      {/* Modal image avec détails événement - Amélioré */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-6xl max-h-[95vh] p-0 flex flex-col sm:flex-row">
            {/* Colonne Image */}
            <div className="w-full sm:w-2/3 h-64 sm:h-auto relative">
              <img 
                src={selectedImage.image || '/placeholder-images/placeholder-event-large.jpg'}
                alt={selectedImage.title}
                className="w-full h-full object-cover"
              />
              {/* Navigation dans le modal */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full h-10 w-10 sm:h-12 sm:w-12"
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                aria-label="Image précédente"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full h-10 w-10 sm:h-12 sm:w-12"
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                aria-label="Image suivante"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
            
            {/* Colonne Informations */}
            <div className="w-full sm:w-1/3 p-6 md:p-8 space-y-6 overflow-y-auto">
              <DialogHeader className="mb-2">
                <DialogTitle className="text-3xl font-bold text-foreground">{selectedImage.title}</DialogTitle>
                <Badge className={`mt-2 self-start ${getCategoryColor(selectedImage.category)}`}>
                  {selectedImage.category}
                </Badge>
              </DialogHeader>

              <p className="text-base text-muted-foreground leading-relaxed">{selectedImage.description}</p>
              
              {selectedImage.guests > 0 && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                    <Users className="h-7 w-7 mb-1 text-primary" />
                    <span className="font-semibold text-foreground text-lg">{selectedImage.guests}</span>
                    <span className="text-xs text-muted-foreground">Personnes</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                    <Calendar className="h-7 w-7 mb-1 text-primary" />
                    <span className="font-semibold text-foreground text-lg">{selectedImage.date}</span>
                    <span className="text-xs text-muted-foreground">Date</span>
                  </div>
                </div>
              )}

              {selectedImage.services && selectedImage.services.length > 0 && (
                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-foreground mb-3 text-lg">Services Fournis :</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedImage.services.map((service: string, index: number) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                {/* Les actions comme Like, Share, Download peuvent être réactivées si la fonctionnalité existe */}
                {/*
                <Button variant="outline" size="lg" className="flex-1">
                  <Heart className="h-5 w-5 mr-2" /> J'aime
                </Button>
                <Button variant="outline" size="lg" className="flex-1">
                  <Share2 className="h-5 w-5 mr-2" /> Partager
                </Button>
                */}
                <a href={selectedImage.image} download target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="default" size="lg" className="w-full bg-primary hover:bg-primary/90">
                    <Download className="h-5 w-5 mr-2" /> Télécharger
                  </Button>
                </a>
              </div>
               <p className="text-xs text-muted-foreground text-center pt-2">Photo {currentImageIndex + 1} sur {filteredGallery.length}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </PublicLayout>
  );
}

export default GalleryPage;
import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth"; // Assurez-vous que useAuth est adapté si nécessaire
import { 
  Utensils, 
  Calendar, 
  Star, 
  MapPin, 
  Phone, 
  Clock,
  Heart, // Utilisé pour les points de fidélité
  Gift,
  Music,
  Palmtree, // Peut-être pour un thème tropical ou un événement en extérieur
  Mic, // Pour DJ/Animation
  ChefHat,
  Users, // Pour événements de groupe ou témoignages
  PartyPopper, // Pour événements festifs
  Camera, // Pour la galerie
  Truck, // Pour la livraison
  Award, // Pour types d'événements ou reconnaissances
  CheckCircle // Pour listes de fonctionnalités ou succès
} from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout"; // Import du Layout

export default function HomePage() {
  const { user } = useAuth(); // user peut être null si non connecté

  // Données pour la section des plats populaires (à remplacer par des données API si nécessaire)
  const popularDishes = [
    {
      name: "Diri ak Djon Djon",
      description: "Riz parfumé aux champignons noirs haïtiens, un classique incontournable.",
      price: "24.95",
      image: "/placeholder-images/diri-djon-djon.jpg", // Remplacer par une image réelle
      badge: "Spécialité Nationale"
    },
    {
      name: "Griot Complet",
      description: "Morceaux de porc marinés et frits, servis avec bananes pesées et pikliz.",
      price: "26.50",
      image: "/placeholder-images/griot.jpg", // Remplacer par une image réelle
      badge: "Très Populaire"
    },
    {
      name: "Menu Événementiel Complet",
      description: "Solution traiteur tout-en-un pour vos grands événements (minimum 25 personnes).",
      price: "À partir de 35.00/pers.",
      image: "/placeholder-images/buffet-haitien.jpg", // Remplacer par une image réelle
      badge: "Pour Groupes"
    }
  ];

  const eventTypes = [
    { icon: Heart, title: "Mariages", subtitle: "Célébrations Inoubliables" },
    { icon: Gift, title: "Anniversaires", subtitle: "Fêtes Mémorables" },
    { icon: Award, title: "Graduations", subtitle: "Succès à Célébrer" },
    { icon: Users, title: "Événements d'Entreprise", subtitle: "Professionnel et Convivial" },
    { icon: Palmtree, title: "Baptêmes et Communions", subtitle: "Moments Sacrés" },
    { icon: PartyPopper, title: "Fêtes Privées", subtitle: "Ambiance sur Mesure" },
    { icon: Star, title: "Festivals & Événements Culturels", subtitle: "Saveurs Authentiques" },
    { icon: CheckCircle, title: "Tout Autre Événement Spécial", subtitle: "Nous Sommes Là Pour Vous" }
  ];

  return (
    <PublicLayout>
      {/* Bannière d'annonce promotionnelle - Design amélioré */}
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-3 px-4 sm:px-6 shadow-md">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-semibold">
            <Gift className="h-5 w-5" />
            <span>🎉 PROMOTION : -15% sur les services traiteur pour événements de plus de 50 convives ce mois-ci ! 🎉</span>
            <Gift className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Hero Section - Design amélioré */}
      <section className="relative text-center text-white py-20 md:py-32 lg:py-40 bg-gradient-to-br from-primary via-secondary to-accent">
        {/* Image de fond avec overlay */}
        <div
          className="absolute inset-0 bg-no-repeat bg-cover bg-center opacity-30" // Opacité réduite pour l'effet
          style={{ backgroundImage: `url('/placeholder-images/hero-background-haitian-food.jpg')` }} // Image placeholder, à remplacer
        ></div>
        <div className="absolute inset-0 bg-black/50"></div> {/* Overlay plus sombre */}

        <div className="container mx-auto relative z-10 px-4">
          <Badge variant="outline" className="mb-6 border-white/50 text-white text-base px-6 py-2 font-semibold tracking-wider">
            Votre Partenaire Culinaire Haïtien à Montréal
          </Badge>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 tracking-tight shadow-lg">
            Dounie Cuisine
          </h1>
          <h2 className="text-3xl sm:text-4xl font-semibold mb-8 opacity-90">
            Saveurs Authentiques, Événements Inoubliables
          </h2>
          
          <p className="text-xl md:text-2xl opacity-80 mb-12 max-w-3xl mx-auto leading-relaxed">
            Plongez au cœur des saveurs créoles. Nous apportons l'authenticité et la chaleur d'Haïti à vos tables, de la planification minutieuse à la réalisation impeccable de vos événements.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/menu">
              <Button size="lg" className="text-lg px-10 py-4 w-full sm:w-auto bg-white text-primary hover:bg-white/90 shadow-lg transform hover:scale-105 transition-transform duration-200">
                <Utensils className="h-5 w-5 mr-3" />
                Découvrir Nos Menus
              </Button>
            </Link>
            <Link href="/reservations">
              <Button size="lg" variant="outline" className="text-lg px-10 py-4 w-full sm:w-auto border-white text-white hover:bg-white/10 hover:text-white shadow-lg transform hover:scale-105 transition-transform duration-200">
                <Calendar className="h-5 w-5 mr-3" />
                Planifier Votre Événement
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-4 justify-center text-lg opacity-90">
            <span className="flex items-center"><ChefHat className="h-6 w-6 mr-2" /> Traiteur Expert</span>
            <span className="flex items-center"><Music className="h-6 w-6 mr-2" /> DJ & Animation</span>
            <span className="flex items-center"><PartyPopper className="h-6 w-6 mr-2" /> Organisation Complète</span>
            <span className="flex items-center"><Truck className="h-6 w-6 mr-2" /> Livraison Fiable</span>
          </div>
        </div>
      </section>

      {/* Services Section - Design amélioré */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-b from-background via-slate-50 to-background">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground tracking-tight">
              Nos Services Clés en Main
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              De la conception de votre menu à l'animation de votre soirée, Dounie Cuisine s'occupe de tout pour faire de votre événement un succès mémorable et authentiquement haïtien.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                title: "Service Traiteur Exquis",
                description: "Une cuisine haïtienne authentique préparée avec passion et des ingrédients frais. Menus personnalisables pour 10 à 500+ convives.",
                icon: Utensils,
                image: "/placeholder-images/traiteur-haitien-moderne.jpg", // Remplacer
                alt: "Service Traiteur Haïtien Dounie Cuisine",
                features: [
                  "Livraison et installation complètes",
                  "Options buffet ou service à l'assiette",
                  "Personnel de service professionnel",
                  "Location de matériel de réception"
                ]
              },
              {
                title: "DJ & Animation Rythmée",
                description: "Mettez l'ambiance avec nos DJs expérimentés. Un vaste répertoire musical adapté à tous les goûts : Kompa, Zouk, Afrobeats, et plus.",
                icon: Music,
                image: "/placeholder-images/dj-ambiance-caraibes.jpg", // Remplacer
                alt: "DJ et Animation pour événements par Dounie Cuisine",
                features: [
                  "Système de son et éclairage de qualité",
                  "Animateur et maître de cérémonie",
                  "Playlists personnalisées selon vos préférences",
                  "Ambiance garantie pour tous vos invités"
                ]
              },
              {
                title: "Organisation d'Événements Complets",
                description: "Confiez-nous l'organisation de A à Z. Nous gérons chaque détail pour une expérience sans stress et inoubliable.",
                icon: PartyPopper,
                image: "/placeholder-images/evenement-organise-dounie.jpg", // Remplacer
                alt: "Organisation complète d'événements par Dounie Cuisine",
                features: [
                  "Planification et coordination complètes",
                  "Décoration thématique et personnalisée",
                  "Gestion des fournisseurs et logistique",
                  "Suivi post-événement et nettoyage"
                ]
              }
            ].map((service, index) => (
              <Card key={index} className="bg-card shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl flex flex-col overflow-hidden group transform hover:-translate-y-2">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-3 border-4 border-background shadow-lg">
                      <service.icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-white">{service.title}</CardTitle>
                  </div>
                </div>
                <CardContent className="p-6 flex-grow flex flex-col">
                  <p className="text-muted-foreground mb-6 text-base leading-relaxed flex-grow">{service.description}</p>
                  <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact" className="mt-auto">
                    <Button variant="outline" className="w-full text-primary border-primary hover:bg-primary/10">
                      En savoir plus
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bannière événements à venir - Design amélioré */}
      <section className="py-16 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 sm:px-6">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 tracking-tight">Nos Prochains Événements & Annonces</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Exemple d'événement/annonce - Remplacer par des données dynamiques si possible */}
            <div className="bg-background/10 backdrop-blur-md text-secondary-foreground rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <Calendar className="h-10 w-10 mx-auto mb-4 text-white/80" />
              <h4 className="font-semibold text-xl mb-2">Mariage Somptueux</h4>
              <p className="text-base mb-1">Samedi 29 Juin</p>
              <p className="text-sm opacity-80">Service traiteur complet & animation DJ pour 200 convives. Une soirée inoubliable en perspective !</p>
            </div>
            <div className="bg-background/10 backdrop-blur-md text-secondary-foreground rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <Award className="h-10 w-10 mx-auto mb-4 text-white/80" />
              <h4 className="font-semibold text-xl mb-2">Célébration de Graduation</h4>
              <p className="text-base mb-1">Dimanche 30 Juin</p>
              <p className="text-sm opacity-80">Buffet haïtien authentique et ambiance festive pour 150 invités. Félicitations aux diplômés !</p>
            </div>
            <div className="bg-background/10 backdrop-blur-md text-secondary-foreground rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <Gift className="h-10 w-10 mx-auto mb-4 text-white/80" />
              <h4 className="font-semibold text-xl mb-2">Réservez Votre Date !</h4>
              <p className="text-base mb-1">Nouvelles disponibilités</p>
              <p className="text-sm opacity-80 mb-3">Contactez-nous pour planifier votre prochain événement spécial avec Dounie Cuisine.</p>
              <Link href="/contact">
                <Button variant="outline" className="text-white border-white/50 hover:bg-white/10">Nous Contacter</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Types d'événements - Design amélioré */}
      <section className="py-20 px-4 sm:px-6 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground tracking-tight">
              Pour Toutes Vos Occasions Spéciales
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Nous adaptons nos services pour créer l'atmosphère parfaite, quelle que soit la nature de votre célébration.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {eventTypes.map((event, index) => (
              <Card key={index} className="bg-card shadow-lg hover:shadow-xl transition-all duration-300 text-center group rounded-xl overflow-hidden transform hover:-translate-y-1 hover:scale-105">
                <CardContent className="p-6 flex flex-col items-center justify-center aspect-square"> {/* Aspect carré */}
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                    <event.icon className="h-10 w-10 text-primary transition-colors duration-300 group-hover:text-primary/80" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">{event.subtitle}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Menu populaire - Design amélioré */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-b from-slate-50 via-background to-slate-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground tracking-tight">
              Goûtez à Nos Incontournables
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Une sélection de nos plats les plus appréciés, parfaits pour découvrir la richesse et l'authenticité de la cuisine Dounie.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {popularDishes.map((item, index) => (
              <Card key={index} className="bg-card overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl flex flex-col group transform hover:-translate-y-2">
                <div className="relative h-72"> {/* Hauteur d'image augmentée */}
                  <img 
                    src={item.image || "/placeholder-images/placeholder-plat.jpg"}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  {item.badge && (
                    <Badge variant="default" className="absolute top-4 left-4 bg-primary text-primary-foreground shadow-md text-sm px-3 py-1">
                      {item.badge}
                    </Badge>
                  )}
                  <div className="absolute bottom-4 right-4 bg-card text-primary px-4 py-2 rounded-full font-bold text-lg shadow-md">
                    {item.price.includes("/pers") ? item.price : `${item.price} $CA`}
                  </div>
                </div>
                <CardHeader className="flex-grow pb-4">
                  <CardTitle className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{item.name}</CardTitle>
                  <p className="text-base text-muted-foreground leading-relaxed">{item.description}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <Link href="/menu">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-lg py-3">
                       <Utensils className="h-5 w-5 mr-2" />
                      Voir les détails du menu
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link href="/menu">
              <Button size="xl" variant="outline" className="text-xl px-12 py-6 border-2 border-primary text-primary hover:bg-primary/10 hover:text-primary transform hover:scale-105 transition-transform duration-200">
                <ChefHat className="h-6 w-6 mr-3" />
                Consulter le Menu Traiteur Complet
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Info Section - Intégrée et stylisée */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-accent via-primary to-secondary text-white">
        <div className="container mx-auto text-center">
          <PartyPopper className="h-16 w-16 mx-auto mb-6 text-white/80" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Prêt à Organiser Votre Événement Parfait ?
          </h2>
          <p className="text-xl md:text-2xl opacity-90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Contactez Dounie Cuisine dès aujourd'hui pour un devis personnalisé et laissez-nous transformer votre vision en une réalité savoureuse et mémorable.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/contact">
              <Button size="xl" className="text-lg px-10 py-4 w-full sm:w-auto bg-white text-primary hover:bg-white/90 shadow-xl transform hover:scale-105 transition-transform duration-200">
                <Phone className="h-6 w-6 mr-3" />
                Demander Votre Devis Gratuit
              </Button>
            </Link>
            <Link href="/reservations">
              <Button size="xl" variant="outline" className="text-lg px-10 py-4 w-full sm:w-auto border-white text-white hover:bg-white/10 hover:text-white shadow-xl transform hover:scale-105 transition-transform duration-200">
                <Calendar className="h-6 w-6 mr-3" />
                Réserver Votre Date Spéciale
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
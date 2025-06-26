import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { 
  Utensils, 
  Calendar, 
  Star, 
  MapPin, 
  Phone, 
  Clock,
  Heart,
  Gift,
  Music,
  Palmtree,
  Mic,
  ChefHat,
  Users,
  PartyPopper,
  Camera,
  Truck,
  Award,
  CheckCircle
} from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-blue-50">
      {/* Navigation */}
      <nav className="p-6 bg-white/80 backdrop-blur-sm border-b border-red-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            <h1 className="text-2xl font-bold text-red-600">Dounie Cuisine</h1>
            <Badge className="bg-yellow-500 text-black text-xs">TRAITEUR & ÉVÉNEMENTS</Badge>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <Link href="/menu">
              <Button variant="ghost" className="text-gray-700 hover:text-red-600">
                <Utensils className="h-4 w-4 mr-2" />
                Menu Traiteur
              </Button>
            </Link>
            <Link href="/reservations">
              <Button variant="ghost" className="text-gray-700 hover:text-red-600">
                <Calendar className="h-4 w-4 mr-2" />
                Événements
              </Button>
            </Link>
            <Link href="/gallery">
              <Button variant="ghost" className="text-gray-700 hover:text-red-600">
                <Camera className="h-4 w-4 mr-2" />
                Galerie
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost" className="text-gray-700 hover:text-red-600">
                Contact
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <Heart className="h-3 w-3 mr-1" />
                  {user.loyaltyPoints} points
                </Badge>
                <Link href="/dashboard">
                  <Button className="bg-red-600 hover:bg-red-700">
                    Bonjour {user.firstName}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="outline" className="border-red-500 text-red-600 hover:bg-red-50">
                    Connexion
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-red-600 hover:bg-red-700">
                    S'inscrire
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Bannière d'annonce promotionnelle */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-3 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <Gift className="h-4 w-4" />
            <span>🎉 PROMOTION SPÉCIALE: 15% de réduction sur les événements de plus de 50 personnes ce mois! 🎉</span>
            <Gift className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-blue-600/20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1530023367847-a683933f4172)`
          }}
        ></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 text-yellow-600">
              <ChefHat className="h-8 w-8" />
              <Music className="h-6 w-6" />
              <Palmtree className="h-8 w-8" />
              <Mic className="h-6 w-6" />
              <Users className="h-8 w-8" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-red-600">Dounie Cuisine</span><br />
            <span className="text-blue-600">Service Traiteur & Événements</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto">
            <strong>Traiteur Professionnel • DJ • Organisation d'Événements</strong><br />
            Kijan nou ye! Nou se yon konpayi konplè pou tout evènman ou yo - manje tradisyonèl Ayisyen, DJ ak ekip nou an!
            <br />
            <em>Nous sommes une entreprise complète pour tous vos événements - cuisine traditionnelle haïtienne, DJ et notre équipe!</em>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/menu">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-lg px-8 py-3">
                <Utensils className="h-5 w-5 mr-2" />
                Menu Traiteur
              </Button>
            </Link>
            <Link href="/reservations">
              <Button size="lg" variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50 text-lg px-8 py-3">
                <Calendar className="h-5 w-5 mr-2" />
                Réserver un Événement
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3">
                <Phone className="h-5 w-5 mr-2" />
                Devis Gratuit
              </Button>
            </Link>
          </div>

          {/* Badges de service */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Badge className="bg-red-500 text-white px-4 py-2">🍽️ TRAITEUR</Badge>
            <Badge className="bg-blue-500 text-white px-4 py-2">🎵 DJ SERVICES</Badge>
            <Badge className="bg-green-500 text-white px-4 py-2">🎉 ORGANISATION ÉVÉNEMENTS</Badge>
            <Badge className="bg-purple-500 text-white px-4 py-2">🚚 LIVRAISON</Badge>
            <Badge className="bg-orange-500 text-white px-4 py-2">👥 ÉQUIPE COMPLÈTE</Badge>
          </div>
        </div>
      </section>

      {/* Bannière d'annonce services */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <PartyPopper className="h-6 w-6" />
              <span className="font-semibold">CETTE SEMAINE: Mariage de 200 personnes samedi • Graduation dimanche • Disponible pour vos événements!</span>
            </div>
            <Link href="/reservations">
              <Button variant="secondary" size="sm">
                Réserver Maintenant
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section className="py-16 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Sèvis Nou Yo • Nos Services
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-red-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img 
                  src="https://images.unsplash.com/photo-1610592309005-0f92c8e39cec" 
                  alt="Service Traiteur" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-red-500 text-white">SERVICE PRINCIPAL</Badge>
                </div>
              </div>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Utensils className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-red-600">Service Traiteur • Catering</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Manje tradisyonèl Ayisyen ak engrèdyan fre yo. Menu konplè pou 10-500+ moun.
                  <br />
                  <strong>Cuisine traditionnelle haïtienne avec ingrédients frais. Menus complets pour 10-500+ personnes.</strong>
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✓ Livraison et installation</li>
                  <li>✓ Service à l'assiette ou buffet</li>
                  <li>✓ Équipe de service incluse</li>
                  <li>✓ Matériel fourni</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img 
                  src="https://images.pexels.com/photos/6864501/pexels-photo-6864501.jpeg" 
                  alt="DJ Services" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-blue-500 text-white">ANIMATION</Badge>
                </div>
              </div>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-blue-600">DJ & Animation • DJ Services</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  DJ pwofesyonèl ak sistèm son konplè. Mizik Ayisyen, Karayib ak entènasyonal.
                  <br />
                  <strong>DJ professionnel avec système son complet. Musique haïtienne, caribéenne et internationale.</strong>
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✓ Équipement son professionnel</li>
                  <li>✓ Éclairage et effets</li>
                  <li>✓ Micro et animateur</li>
                  <li>✓ Playlist personnalisée</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img 
                  src="https://images.pexels.com/photos/50675/banquet-wedding-society-deco-50675.jpeg" 
                  alt="Organisation d'événements" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-yellow-500 text-black">ORGANISATION</Badge>
                </div>
              </div>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PartyPopper className="h-8 w-8 text-yellow-600" />
                </div>
                <CardTitle className="text-yellow-600">Organisation Événements • Event Planning</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Òganizasyon konplè pou tout evènman yo. Depi planifikasyon rive nan egzekisyon.
                  <br />
                  <strong>Organisation complète pour tous événements. De la planification à l'exécution.</strong>
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✓ Coordination complète</li>
                  <li>✓ Décoration et mise en place</li>
                  <li>✓ Gestion des invités</li>
                  <li>✓ Suivi et nettoyage</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Bannière événements à venir */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-4">Evènman ki Vini • Événements à Venir</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <Calendar className="h-6 w-6 mx-auto mb-2" />
              <h4 className="font-semibold">Samedi 29 Juin</h4>
              <p className="text-sm">Mariage - 200 personnes</p>
              <p className="text-xs opacity-75">Disponible pour autres événements</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <Users className="h-6 w-6 mx-auto mb-2" />
              <h4 className="font-semibold">Dimanche 30 Juin</h4>
              <p className="text-sm">Graduation - 150 personnes</p>
              <p className="text-xs opacity-75">Service traiteur + DJ</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <Gift className="h-6 w-6 mx-auto mb-2" />
              <h4 className="font-semibold">Semaine prochaine</h4>
              <p className="text-sm">Disponibilités ouvertes</p>
              <p className="text-xs opacity-75">Réservez maintenant!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Types d'événements */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Tip Evènman • Types d'Événements
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: "Mariages", subtitle: "Maryaj", color: "text-red-600", bg: "bg-red-50" },
              { icon: Gift, title: "Anniversaires", subtitle: "Anivèsè", color: "text-blue-600", bg: "bg-blue-50" },
              { icon: Award, title: "Graduations", subtitle: "Gradyasyon", color: "text-green-600", bg: "bg-green-50" },
              { icon: Users, title: "Entreprises", subtitle: "Biznis", color: "text-purple-600", bg: "bg-purple-50" },
              { icon: Palmtree, title: "Baptêmes", subtitle: "Batèm", color: "text-yellow-600", bg: "bg-yellow-50" },
              { icon: PartyPopper, title: "Fêtes privées", subtitle: "Fèt prive", color: "text-pink-600", bg: "bg-pink-50" },
              { icon: Star, title: "Festivals", subtitle: "Festival", color: "text-indigo-600", bg: "bg-indigo-50" },
              { icon: CheckCircle, title: "Événements d'entreprise", subtitle: "Evènman kominote", color: "text-teal-600", bg: "bg-teal-50" }
            ].map((event, index) => (
              <Card key={index} className="border-gray-200 shadow-md hover:shadow-lg transition-shadow text-center">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 ${event.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <event.icon className={`h-8 w-8 ${event.color}`} />
                  </div>
                  <h3 className={`text-lg font-bold ${event.color}`}>{event.title}</h3>
                  <p className="text-sm text-gray-600">{event.subtitle}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Menu populaire */}
      <section className="py-16 px-6 bg-gradient-to-br from-red-50 to-yellow-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Manje Popilè • Plats Populaires
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Diri ak Djon Djon",
                nameEn: "Black Mushroom Rice",
                description: "Riz parfumé aux champignons noirs haïtiens",
                price: "24.95",
                image: "https://images.unsplash.com/photo-1647998270792-69ac80570183",
                badge: "Spécialité"
              },
              {
                name: "Griot ak Bannann", 
                nameEn: "Fried Pork with Plantain",
                description: "Porc mariné et frit avec plantains dorés",
                price: "26.50",
                image: "https://images.unsplash.com/photo-1610592309005-0f92c8e39cec",
                badge: "Populaire"
              },
              {
                name: "Menu Complet Événement",
                nameEn: "Complete Event Menu",
                description: "Menu complet pour événements (min. 25 personnes)",
                price: "À partir de 35.00/pers",
                image: "https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg",
                badge: "Événements"
              }
            ].map((item, index) => (
              <Card key={index} className="overflow-hidden border-red-200 shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-yellow-500 text-black">
                    {item.badge}
                  </Badge>
                  <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full font-bold text-sm">
                    ${item.price}
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-red-600 mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-500 italic mb-2">{item.nameEn}</p>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    Commander
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link href="/menu">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Utensils className="h-5 w-5 mr-2" />
                Voir Menu Complet Traiteur
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 px-6 bg-gradient-to-r from-red-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Kontakte Nou • Contactez-Nous</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col items-center">
              <MapPin className="h-8 w-8 mb-4" />
              <h3 className="text-xl font-bold mb-2">Adrès • Adresse</h3>
              <p>1234 Rue Saint-Laurent<br />Montréal, QC H2X 2S9</p>
            </div>
            
            <div className="flex flex-col items-center">
              <Phone className="h-8 w-8 mb-4" />
              <h3 className="text-xl font-bold mb-2">Telefòn • Téléphone</h3>
              <p>(514) 555-DOUNIE<br />(514) 555-3686</p>
              <p className="text-sm mt-1">24/7 pour urgences événements</p>
            </div>
            
            <div className="flex flex-col items-center">
              <Clock className="h-8 w-8 mb-4" />
              <h3 className="text-xl font-bold mb-2">Sèvis • Services</h3>
              <p>Lun-Dim • 7 jours/7<br />Livraison & Événements</p>
              <p className="text-sm mt-1">Consultations gratuites</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="bg-white text-red-600 hover:bg-gray-100">
                <Phone className="h-5 w-5 mr-2" />
                Devis Gratuit
              </Button>
            </Link>
            <Link href="/reservations">
              <Button size="lg" variant="secondary" className="bg-yellow-500 text-black hover:bg-yellow-400">
                <Calendar className="h-5 w-5 mr-2" />
                Réserver Événement
              </Button>
            </Link>
            <Link href="/menu">
              <Button size="lg" variant="secondary" className="bg-green-500 text-white hover:bg-green-400">
                <Utensils className="h-5 w-5 mr-2" />
                Commander Traiteur
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer avec annonces */}
      <footer className="bg-gray-900 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <h4 className="font-bold mb-3">Dounie Cuisine</h4>
              <p className="text-sm text-gray-400">Service traiteur professionnel et organisation d'événements haïtiens au Canada.</p>
            </div>
            <div>
              <h4 className="font-bold mb-3">Services</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Traiteur & Livraison</li>
                <li>• DJ & Animation</li>
                <li>• Organisation événements</li>
                <li>• Équipe complète</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Cette Semaine</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Mariage 200 pers. - Sam</li>
                <li>• Graduation 150 pers. - Dim</li>
                <li>• Disponibilités ouvertes</li>
                <li>• Promotion 15% groupes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Contact Rapide</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>📞 (514) 555-DOUNIE</li>
                <li>📧 events@dounie-cuisine.com</li>
                <li>🕐 24/7 urgences événements</li>
                <li>💬 Devis gratuit sous 24h</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 pt-6 text-center text-sm text-gray-400">
            <p>&copy; 2025 Dounie Cuisine - Service Traiteur & Événements. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
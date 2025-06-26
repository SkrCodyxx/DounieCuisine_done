import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowLeft,
  Send,
  Facebook,
  Instagram,
  MessageCircle,
  Star,
  Navigation,
  Calendar,
  Truck,
  Coffee,
  PartyPopper
} from "lucide-react";

function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation d'envoi
    toast({
      title: "Mesaj voye! • Message envoyé!",
      description: "N ap reponn ou nan kèk minit. • Nous vous répondrons dans quelques minutes."
    });
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-blue-50">
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
              <Link href="/login">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Connexion Staff
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" className="border-green-300 text-green-200 hover:bg-green-100 hover:text-green-700">
                  S'inscrire
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Mail className="h-8 w-8 text-yellow-300" />
              <h1 className="text-5xl font-bold">Kontak • Contact</h1>
              <Phone className="h-8 w-8 text-yellow-300" />
            </div>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              N ap tann nou • Nous vous attendons les bras ouverts
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Informations de contact */}
          <div className="space-y-8">
            {/* Adresse */}
            <Card className="border-red-100 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-red-100 rounded-full">
                    <MapPin className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-red-600">Kote Nou Ye • Notre Adresse</h3>
                    <p className="text-gray-600">Venez nous rendre visite</p>
                  </div>
                </div>
                <div className="pl-16">
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Dounie Cuisine</strong><br />
                    123 Rue des Épices<br />
                    Montréal, QC H2X 1Y7<br />
                    Canada
                  </p>
                  <Button variant="outline" className="mt-4 border-red-200 text-red-600 hover:bg-red-50">
                    <Navigation className="mr-2 h-4 w-4" />
                    Itinéraire GPS
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Horaires */}
            <Card className="border-blue-100 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-blue-600">Lè Nou Ouvè • Horaires</h3>
                    <p className="text-gray-600">Toujours ouverts pour vous</p>
                  </div>
                </div>
                <div className="pl-16 space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700 font-medium">Lundi - Jeudi</span>
                    <span className="text-gray-900 font-semibold">11h00 - 22h00</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700 font-medium">Vendredi - Samedi</span>
                    <span className="text-gray-900 font-semibold">11h00 - 23h00</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700 font-medium">Dimanche</span>
                    <span className="text-gray-900 font-semibold">12h00 - 21h00</span>
                  </div>
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Horaires étendus pendant les fêtes haïtiennes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact direct */}
            <Card className="border-green-100 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-green-600">Jwenn Nou • Nous Joindre</h3>
                    <p className="text-gray-600">Contact direct et rapide</p>
                  </div>
                </div>
                <div className="pl-16 space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-gray-900">(514) 555-DOUNIE</p>
                      <p className="text-sm text-gray-600">Réservations et commandes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-gray-900">info@dounie-cuisine.com</p>
                      <p className="text-sm text-gray-600">Questions générales</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <PartyPopper className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-gray-900">events@dounie-cuisine.com</p>
                      <p className="text-sm text-gray-600">Événements privés</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Réseaux sociaux */}
            <Card className="border-yellow-200 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-6 text-yellow-800">Suivez-nous • Follow Us</h3>
                <div className="grid grid-cols-3 gap-4">
                  <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-50 h-16 flex-col">
                    <Facebook className="h-6 w-6 mb-1" />
                    <span className="text-xs">Facebook</span>
                  </Button>
                  <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50 h-16 flex-col">
                    <Instagram className="h-6 w-6 mb-1" />
                    <span className="text-xs">Instagram</span>
                  </Button>
                  <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-50 h-16 flex-col">
                    <MessageCircle className="h-6 w-6 mb-1" />
                    <span className="text-xs">WhatsApp</span>
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-4 text-center">
                  Découvrez nos photos, événements et promotions!
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Formulaire de contact */}
          <div className="space-y-8">
            <Card className="border-red-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-red-50 to-blue-50">
                <CardTitle className="text-2xl text-red-600 flex items-center gap-2">
                  <Send className="h-6 w-6" />
                  Voye Yon Mesaj • Envoyez un Message
                </CardTitle>
                <p className="text-gray-600">
                  Nous répondons rapidement à tous vos messages
                </p>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-700 font-medium">
                        Non • Nom *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Votre nom complet"
                        className="mt-1 border-gray-300 focus:border-red-500"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-gray-700 font-medium">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="votre@email.com"
                        className="mt-1 border-gray-300 focus:border-red-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-gray-700 font-medium">
                      Telefòn • Téléphone
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(514) 555-0000"
                      className="mt-1 border-gray-300 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-gray-700 font-medium">
                      Sijè • Sujet *
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Sujet de votre message"
                      className="mt-1 border-gray-300 focus:border-red-500"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-gray-700 font-medium">
                      Mesaj • Message *
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Écrivez votre message ici..."
                      rows={6}
                      className="mt-1 border-gray-300 focus:border-red-500"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 py-3 text-lg">
                    <Send className="mr-2 h-5 w-5" />
                    Voye Mesaj • Envoyer le Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Services disponibles */}
            <Card className="border-blue-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">Nos Services</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <Coffee className="h-8 w-8 mx-auto mb-2 text-red-600" />
                    <h4 className="font-semibold text-gray-800">Sur Place</h4>
                    <p className="text-sm text-gray-600">Ambiance authentique</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Truck className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <h4 className="font-semibold text-gray-800">Livraison</h4>
                    <p className="text-sm text-gray-600">À domicile</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <PartyPopper className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <h4 className="font-semibold text-gray-800">Traiteur</h4>
                    <p className="text-sm text-gray-600">Événements</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                    <h4 className="font-semibold text-gray-800">Réservations</h4>
                    <p className="text-sm text-gray-600">Tables privées</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Avis clients */}
            <Card className="border-yellow-200 shadow-lg bg-yellow-50">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-3">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <h3 className="font-semibold text-yellow-800 mb-2">Plus de 500 avis 5 étoiles</h3>
                  <p className="text-sm text-yellow-700">
                    "Meilleur restaurant haïtien de Montréal selon nos clients!"
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Carte (simulation) */}
        <Card className="mt-12 border-gray-200 shadow-lg">
          <CardContent className="p-0">
            <div className="bg-gray-200 h-96 flex items-center justify-center text-gray-600 rounded-lg">
              <div className="text-center">
                <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">Carte Interactive</h3>
                <p className="text-gray-600 mb-4">123 Rue des Épices, Montréal</p>
                <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
                  <Navigation className="mr-2 h-4 w-4" />
                  Ouvrir dans Google Maps
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to action final */}
        <div className="text-center mt-12 py-12 bg-gradient-to-r from-red-600 to-blue-600 rounded-lg text-white">
          <h3 className="text-3xl font-bold mb-4">Prêt à nous rendre visite?</h3>
          <p className="text-xl text-blue-100 mb-8">Découvrez l'hospitalité haïtienne chez Dounie Cuisine</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/reservations">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4">
                <Calendar className="mr-2 h-5 w-5" />
                Réserver Maintenant
              </Button>
            </Link>
            <Link href="/menu">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4">
                Voir le Menu
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
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
    // TODO: Remplacer par un appel API réel pour envoyer le message
    console.log("Formulaire de contact soumis:", formData);
    toast({
      title: "Message Envoyé !",
      description: "Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais."
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
    <PublicLayout>
      {/* En-tête de Page */}
      <section className="py-16 md:py-20 text-center bg-card border-b border-border">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mail className="h-10 w-10 md:h-12 md:w-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">Contactez-Nous</h1>
            <Phone className="h-10 w-10 md:h-12 md:w-12 text-primary" />
          </div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Nous sommes à votre écoute pour toute question, demande de devis ou réservation. N'hésitez pas à nous joindre !
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Colonne d'Informations */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="shadow-lg border-border">
              <CardHeader>
                <CardTitle className="text-xl text-primary flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Notre Adresse
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p><strong>Dounie Cuisine</strong></p>
                <p>123 Rue des Épices</p>
                <p>Montréal, QC H2X 1Y7, Canada</p>
                <Button variant="outline" size="sm" className="mt-3 w-full">
                  <Navigation className="mr-2 h-4 w-4" />
                  Obtenir l'Itinéraire
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-border">
              <CardHeader>
                <CardTitle className="text-xl text-primary flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Heures d'Ouverture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between"><span>Lundi - Jeudi :</span> <span className="font-medium text-foreground">11h00 - 22h00</span></div>
                <div className="flex justify-between"><span>Vendredi - Samedi :</span> <span className="font-medium text-foreground">11h00 - 23h00</span></div>
                <div className="flex justify-between"><span>Dimanche :</span> <span className="font-medium text-foreground">12h00 - 21h00</span></div>
                <p className="italic mt-2">Événements sur réservation en dehors de ces heures.</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-border">
              <CardHeader>
                <CardTitle className="text-xl text-primary flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Informations de Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                  <a href="tel:+15141234567" className="hover:text-primary"><strong>Réservations/Commandes :</strong> (514) 123-4567</a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                  <a href="mailto:info@dounie-cuisine.ca" className="hover:text-primary"><strong>Questions Générales :</strong> info@dounie-cuisine.ca</a>
                </div>
                <div className="flex items-center gap-2">
                  <PartyPopper className="h-4 w-4 text-primary flex-shrink-0" />
                   <a href="mailto:events@dounie-cuisine.ca" className="hover:text-primary"><strong>Événements Privés :</strong> events@dounie-cuisine.ca</a>
                </div>
              </CardContent>
            </Card>
             <Card className="shadow-lg border-border">
              <CardHeader>
                <CardTitle className="text-xl text-primary flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Suivez-Nous
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-around items-center pt-4">
                <Link href="#" aria-label="Facebook Dounie Cuisine"><Facebook className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors" /></Link>
                <Link href="#" aria-label="Instagram Dounie Cuisine"><Instagram className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors" /></Link>
                <Link href="#" aria-label="Message WhatsApp Dounie Cuisine"><MessageCircle className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors" /></Link>
              </CardContent>
            </Card>
          </div>

          {/* Formulaire de contact */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-primary/30">
              <CardHeader className="bg-primary/10">
                <CardTitle className="text-2xl text-primary flex items-center gap-3">
                  <Send className="h-6 w-6" />
                  Envoyez-Nous un Message
                </CardTitle>
                <p className="text-muted-foreground">
                  Nous répondons rapidement à toutes vos questions et demandes de devis.
                </p>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="font-medium">Nom complet *</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Votre nom complet" className="mt-1 py-3 px-4" required />
                    </div>
                    <div>
                      <Label htmlFor="email" className="font-medium">Adresse e-mail *</Label>
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Ex: nom@exemple.com" className="mt-1 py-3 px-4" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone" className="font-medium">Téléphone (optionnel)</Label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Ex: (514) 123-4567" className="mt-1 py-3 px-4" />
                  </div>
                  <div>
                    <Label htmlFor="subject" className="font-medium">Sujet de votre message *</Label>
                    <Input id="subject" name="subject" value={formData.subject} onChange={handleInputChange} placeholder="Ex: Demande de devis pour mariage" className="mt-1 py-3 px-4" required />
                  </div>
                  <div>
                    <Label htmlFor="message" className="font-medium">Votre message *</Label>
                    <Textarea id="message" name="message" value={formData.message} onChange={handleInputChange} placeholder="Écrivez votre message détaillé ici..." rows={6} className="mt-1 py-3 px-4" required />
                  </div>
                  <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-lg py-3">
                    <Send className="mr-2 h-5 w-5" />
                    Envoyer le Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Section Services et Avis (commentée pour l'instant) */}
            {/*
            <Card className="mt-8 border-blue-200 shadow-lg">
              <CardHeader><CardTitle className="text-xl text-blue-600">Nos Services</CardTitle></CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <Coffee className="h-8 w-8 mx-auto mb-2 text-red-600" /><h4 className="font-semibold text-gray-800">Sur Place</h4><p className="text-sm text-gray-600">Ambiance authentique</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Truck className="h-8 w-8 mx-auto mb-2 text-blue-600" /><h4 className="font-semibold text-gray-800">Livraison</h4><p className="text-sm text-gray-600">À domicile</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <PartyPopper className="h-8 w-8 mx-auto mb-2 text-green-600" /><h4 className="font-semibold text-gray-800">Traiteur</h4><p className="text-sm text-gray-600">Événements</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-yellow-600" /><h4 className="font-semibold text-gray-800">Réservations</h4><p className="text-sm text-gray-600">Tables privées</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="mt-8 border-yellow-200 shadow-lg bg-yellow-50">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-3">
                    {[1,2,3,4,5].map((star) => (<Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />))}
                  </div>
                  <h3 className="font-semibold text-yellow-800 mb-2">Plus de 500 avis 5 étoiles</h3>
                  <p className="text-sm text-yellow-700">"Meilleur restaurant haïtien de Montréal selon nos clients!"</p>
                </div>
              </CardContent>
            </Card>
            */}
          </div>
        </div>

        {/* Carte Interactive (Placeholder amélioré) */}
        <Card className="mt-12 md:mt-16 shadow-xl border-border overflow-hidden">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-2xl text-foreground flex items-center gap-3">
              <MapPin className="h-6 w-6 text-primary"/>
              Retrouvez-Nous à Montréal
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Remplacer par une vraie carte interactive si possible */}
            <div className="bg-gray-200 h-[400px] md:h-[500px] flex flex-col items-center justify-center text-center p-8">
              <MapPin className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Dounie Cuisine</h3>
              <p className="text-muted-foreground mb-4">123 Rue des Épices, Montréal, QC H2X 1Y7</p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Dounie+Cuisine+123+Rue+des+Epices+Montreal"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="default" size="lg">
                  <Navigation className="mr-2 h-5 w-5" />
                  Ouvrir dans Google Maps
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* CTA final - harmonisé */}
        <section className="text-center mt-16 mb-8 py-16 bg-gradient-to-r from-primary via-secondary to-accent rounded-xl text-white shadow-2xl">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Une Question ? Un Événement à Planifier ?</h3>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
            L'équipe Dounie Cuisine est prête à vous accompagner.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/reservations">
              <Button size="xl" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-3 transform hover:scale-105 transition-transform">
                <Calendar className="mr-2 h-5 w-5" />
                Réserver Votre Événement
              </Button>
            </Link>
            <Link href="/menu">
              <Button size="xl" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-3 transform hover:scale-105 transition-transform">
                 <Utensils className="mr-2 h-5 w-5" />
                Voir Nos Menus
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}

export default ContactPage;
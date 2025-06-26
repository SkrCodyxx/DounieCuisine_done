import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Calendar,
  Users,
  Clock,
  ArrowLeft,
  Check,
  Phone,
  Mail,
  PartyPopper,
  Heart,
  Gift,
  Star,
  Info,
  MapPin,
  Utensils,
  Music,
  Camera,
  Truck,
  ChefHat,
  Mic,
  Award,
  Palmtree
} from "lucide-react";

export function ReservationsPage() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);

  const form = useForm({
    defaultValues: {
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      partySize: "",
      eventDate: "",
      eventTime: "",
      serviceType: "",
      eventType: "",
      customService: "",
      location: "",
      address: "",
      duration: "",
      budget: "",
      specialRequests: "",
      additionalServices: [],
      cateringType: "",
      musicPreferences: "",
      decorationNeeds: "",
      setupTime: ""
    }
  });

  const reservationMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/reservations", { method: "POST", body: data }),
    onSuccess: () => {
      toast({ 
        title: "Evènman Rezève! • Événement Réservé!", 
        description: "Mèsi anpil! N ap rele ou nan 1 èdtan pou konfime tout detay yo. • Merci! Nous vous appellerons dans 1h pour confirmer tous les détails." 
      });
      setStep(3);
    },
    onError: () => {
      toast({ 
        title: "Pwoblèm • Erreur", 
        description: "Pwoblèm nan rezèvasyon an. Tanpri eseye ankò. • Problème avec la réservation. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  });

  const serviceTypes = [
    "Traiteur Complet • Complete Catering",
    "Traiteur + DJ • Catering + DJ", 
    "Traiteur + DJ + Organisation • Full Service",
    "DJ Seulement • DJ Only",
    "Organisation d'Événement • Event Planning Only",
    "Service Partiel • Partial Service",
    "Consultation • Consultation Only"
  ];

  const eventTypes = [
    "Mariage • Wedding",
    "Anniversaire • Birthday",
    "Graduation • Graduation",
    "Baptême • Baptism", 
    "Fête d'Entreprise • Corporate Event",
    "Réunion de Famille • Family Reunion",
    "Soirée Privée • Private Party",
    "Festival Culturel • Cultural Festival",
    "Inauguration • Grand Opening",
    "Fête de Quartier • Community Event",
    "Celebration Religieuse • Religious Celebration",
    "Autre • Other"
  ];

  const cateringOptions = [
    "Buffet Traditionnel Haïtien • Traditional Haitian Buffet",
    "Service à l'Assiette • Plated Service",
    "Cocktail et Amuse-Bouches • Cocktail & Appetizers",
    "Brunch Créole • Creole Brunch",
    "Menu Dégustation • Tasting Menu",
    "Barbecue Caribéen • Caribbean BBQ",
    "Service Mixte • Mixed Service"
  ];

  const handleSubmit = (data: any) => {
    const reservationData = {
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestPhone: data.guestPhone,
      partySize: parseInt(data.partySize) || 1,
      dateTime: new Date(`${data.eventDate}T${data.eventTime || '19:00'}`),
      specialRequests: `
=== DÉTAILS ÉVÉNEMENT ===
Type d'événement: ${data.eventType}
Service demandé: ${data.serviceType}
${data.customService ? `Service personnalisé: ${data.customService}` : ''}

=== LIEU ET LOGISTIQUE ===
Lieu: ${data.location || 'À préciser'}
Adresse complète: ${data.address || 'À fournir'}
Nombre de personnes: ${data.partySize || 'À confirmer'}
Durée: ${data.duration || 'À discuter'}
Heure d'installation: ${data.setupTime || 'À définir'}

=== SERVICES TRAITEUR ===
Type de service traiteur: ${data.cateringType || 'À discuter'}

=== ANIMATION ET DÉCORATION ===
Préférences musicales: ${data.musicPreferences || 'Standard'}
Besoins décoration: ${data.decorationNeeds || 'Minimal'}

=== BUDGET ET SERVICES ADDITIONNELS ===
Budget estimé: ${data.budget || 'À discuter lors de l\'appel'}
Services additionnels: ${data.additionalServices.join(', ') || 'Aucun'}

=== DEMANDES SPÉCIALES ===
${data.specialRequests || 'Aucune demande spéciale'}

=== NOTE IMPORTANTE ===
Devis détaillé sera envoyé sous 24h après confirmation téléphonique.
      `.trim(),
      status: "pending"
    };
    reservationMutation.mutate(reservationData);
  };

  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-blue-50 flex items-center justify-center px-6">
        <Card className="w-full max-w-lg border-green-200 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-green-800 mb-4">
              Evènman Rezève! • Événement Réservé!
            </h2>
            <p className="text-gray-600 mb-6">
              Mèsi anpil pou rezèvasyon ou an! N ap rele ou nan 1 èdtan pou konfime tout detay yo ak voye devis la.<br />
              <strong>Merci beaucoup pour votre réservation! Nous vous appellerons dans 1 heure pour confirmer tous les détails et envoyer le devis.</strong>
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="space-y-2 text-sm text-blue-800">
                <p><strong>Kòd Evènman:</strong> #{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                <p><strong>Tip Evènman:</strong> {form.getValues('eventType')}</p>
                <p><strong>Sèvis:</strong> {form.getValues('serviceType')}</p>
                <p><strong>Dat:</strong> {form.getValues('eventDate')} à {form.getValues('eventTime') || '19h00'}</p>
                <p><strong>Moun:</strong> {form.getValues('partySize') || 'À confirmer'}</p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-gray-600 mb-6">
              <p>📞 Nous vous appellerons sous 1 heure</p>
              <p>📧 Devis détaillé envoyé sous 24h</p>
              <p>✅ Confirmation finale par téléphone</p>
              <p>🎉 Votre événement sera mémorable!</p>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  Retounen Lakay • Retour Accueil
                </Button>
              </Link>
              <Link href="/menu">
                <Button variant="outline" className="w-full">
                  Wè Menu Traiteur • Voir Menu
                </Button>
              </Link>
              <Link href="tel:+15145553686">
                <Button variant="outline" className="w-full border-green-500 text-green-600">
                  <Phone className="h-4 w-4 mr-2" />
                  Rele Nou Kounye a • Appelez Maintenant
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-blue-50">
      {/* Bannière promotion */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-3 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <Gift className="h-4 w-4" />
            <span>🎉 PROMOTION SPÉCIALE: 15% de réduction sur les événements de plus de 50 personnes ce mois! 🎉</span>
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
              <Link href="/menu">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Utensils className="h-4 w-4 mr-2" />
                  Menu Traiteur
                </Button>
              </Link>
              <Link href="tel:+15145553686">
                <Button variant="outline" className="border-green-300 text-green-200 hover:bg-green-100 hover:text-green-700">
                  <Phone className="h-4 w-4 mr-2" />
                  Rele Nou • Appelez
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <PartyPopper className="h-8 w-8 text-yellow-300" />
              <h1 className="text-5xl font-bold">Rezève Evènman Ou • Réservez Votre Événement</h1>
              <Calendar className="h-8 w-8 text-yellow-300" />
            </div>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Service traiteur professionnel, DJ, organisation complète - Faites de votre événement un moment inoubliable!
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">🍽️ TRAITEUR</span>
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">🎵 DJ</span>
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">🎉 ORGANISATION</span>
              <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm">📞 DEVIS GRATUIT</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Indicateur de progression */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'} font-bold`}>
                1
              </div>
              <div className={`w-20 h-1 ${step >= 2 ? 'bg-red-600' : 'bg-gray-200'}`}></div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'} font-bold`}>
                2
              </div>
              <div className={`w-20 h-1 ${step >= 3 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'} font-bold`}>
                ✓
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Formulaire principal */}
            <div className="lg:col-span-3">
              <Card className="border-red-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-red-50 to-blue-50">
                  <CardTitle className="text-2xl text-red-600 flex items-center gap-2">
                    <Calendar className="h-6 w-6" />
                    {step === 1 ? "Enfòmasyon Evènman • Informations Événement" : "Finalise Evènman • Finaliser l'Événement"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                      {step === 1 && (
                        <>
                          {/* Informations personnelles */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                              <Users className="h-5 w-5" />
                              Enfòmasyon Pèsonèl • Informations Personnelles
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="guestName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Non konplè • Nom complet *</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Jean-Baptiste Pétion" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="guestPhone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Telefòn • Téléphone *</FormLabel>
                                    <FormControl>
                                      <Input placeholder="(514) 555-0000" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name="guestEmail"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email *</FormLabel>
                                  <FormControl>
                                    <Input type="email" placeholder="jean.baptiste@example.com" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* Type d'événement */}
                          <div className="space-y-4 border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                              <PartyPopper className="h-5 w-5" />
                              Tip ak Detay Evènman • Type et Détails de l'Événement
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="eventType"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Tip Evènman • Type d'événement *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Chwazi tip evènman an • Choisir le type" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {eventTypes.map((type, index) => (
                                          <SelectItem key={index} value={type}>
                                            {type}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="serviceType"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Tip Sèvis • Type de service *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Chwazi sèvis la • Choisir le service" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {serviceTypes.map((service, index) => (
                                          <SelectItem key={index} value={service}>
                                            {service}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <FormField
                                control={form.control}
                                name="eventDate"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Dat Evènman • Date de l'événement *</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="date" 
                                        {...field}
                                        min={new Date().toISOString().split('T')[0]}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="eventTime"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Lè Kòmanse • Heure de début</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="time" 
                                        placeholder="Ex: 18:00"
                                        {...field}
                                      />
                                    </FormControl>
                                    <p className="text-xs text-gray-500">Heure souhaitée pour l'événement</p>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="partySize"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Kantite Moun • Nombre de personnes *</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="Ex: 50, 100, 200..."
                                        {...field}
                                      />
                                    </FormControl>
                                    <p className="text-xs text-gray-500">Nombre approximatif d'invités</p>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>

                          {/* Lieu et logistique */}
                          <div className="space-y-4 border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                              <MapPin className="h-5 w-5" />
                              Kote ak Òganizasyon • Lieu et Organisation
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Kote Evènman • Lieu de l'événement *</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="Ex: Salle communautaire, domicile, parc..."
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="duration"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Dire Evènman • Durée</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="Ex: 4h, 6h, toute la journée..."
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name="address"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Adrès Konplè • Adresse complète</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="123 Rue des Événements, Montréal, QC H1A 1A1"
                                      {...field}
                                    />
                                  </FormControl>
                                  <p className="text-xs text-gray-500">Pour la livraison et l'installation</p>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="setupTime"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Lè Enstalasyon • Heure d'installation</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="Ex: 15h00, 2h avant l'événement..."
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="budget"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Bidjè Estime • Budget estimé</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="Ex: 2000$, 3000-5000$, à discuter..."
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>

                          <Button 
                            type="button" 
                            onClick={() => setStep(2)} 
                            className="w-full bg-red-600 hover:bg-red-700 py-3"
                            disabled={!form.watch('guestName') || !form.watch('guestPhone') || !form.watch('eventDate')}
                          >
                            Kontinye ak Detay yo • Continuer avec les Détails
                            <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
                          </Button>
                        </>
                      )}

                      {step === 2 && (
                        <>
                          {/* Services spécialisés */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                              <ChefHat className="h-5 w-5" />
                              Sèvis Espesyalize • Services Spécialisés
                            </h3>
                            
                            <FormField
                              control={form.control}
                              name="cateringType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Tip Sèvis Traiteur • Type de service traiteur</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Chwazi tip traiteur la • Choisir le type de traiteur" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {cateringOptions.map((option, index) => (
                                        <SelectItem key={index} value={option}>
                                          {option}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="musicPreferences"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Preferans Mizik • Préférences musicales</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="Ex: Kompa, Zouk, Mix international..."
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="decorationNeeds"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Bezwen Dekorasyon • Besoins décoration</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="Ex: Couleurs spécifiques, thème..."
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name="customService"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Sèvis Pèsonalize • Services personnalisés</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Dekri sèvis espesyal ou bezwen yo... • Décrivez les services spéciaux dont vous avez besoin..."
                                      rows={3}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Services additionnels */}
                            <div>
                              <Label className="text-base font-medium">Sèvis Adisyonèl • Services additionnels</Label>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                                {[
                                  '🎵 DJ Professionnel • Professional DJ', 
                                  '🎨 Décoration Complète • Full Decoration', 
                                  '📸 Photographe • Photographer', 
                                  '🍸 Service Bar • Bar Service',
                                  '🎭 Animation Enfants • Kids Entertainment',
                                  '🚚 Transport Invités • Guest Transportation',
                                  '🏨 Coordination Hébergement • Lodging Coordination',
                                  '🔊 Sonorisation Premium • Premium Sound',
                                  '💐 Arrangements Floraux • Floral Arrangements',
                                  '🎂 Gâteau Personnalisé • Custom Cake',
                                  '🎪 Tente/Chapiteau • Tent/Marquee',
                                  '✨ Éclairage Spécial • Special Lighting'
                                ].map((service) => (
                                  <div key={service} className="flex items-center space-x-2">
                                    <Checkbox 
                                      id={service}
                                      onCheckedChange={(checked) => {
                                        const current = form.getValues('additionalServices') || [];
                                        if (checked) {
                                          form.setValue('additionalServices', [...current, service]);
                                        } else {
                                          form.setValue('additionalServices', current.filter(s => s !== service));
                                        }
                                      }}
                                    />
                                    <Label htmlFor={service} className="text-xs">{service}</Label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <FormField
                              control={form.control}
                              name="specialRequests"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Demann Espesyal • Demandes spéciales</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Alèji, selebrasyon, preferans, oswa lòt demann espesyal... • Allergies, célébrations, préférences, ou autres demandes spéciales..." 
                                      rows={4}
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* Résumé détaillé */}
                          <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                              <Check className="h-5 w-5" />
                              Rezime Konplè • Résumé Complet
                            </h3>
                            <div className="bg-gray-50 p-6 rounded-lg space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold text-gray-800 mb-2">Enfòmasyon Kliyan • Client</h4>
                                  <p><strong>Non:</strong> {form.getValues('guestName')}</p>
                                  <p><strong>Telefòn:</strong> {form.getValues('guestPhone')}</p>
                                  <p><strong>Email:</strong> {form.getValues('guestEmail')}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-800 mb-2">Detay Evènman • Événement</h4>
                                  <p><strong>Tip:</strong> {form.getValues('eventType')}</p>
                                  <p><strong>Dat:</strong> {form.getValues('eventDate')}</p>
                                  <p><strong>Lè:</strong> {form.getValues('eventTime') || 'À préciser'}</p>
                                  <p><strong>Moun:</strong> {form.getValues('partySize') || 'À confirmer'}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-800 mb-2">Sèvis • Services</h4>
                                  <p><strong>Sèvis:</strong> {form.getValues('serviceType')}</p>
                                  <p><strong>Traiteur:</strong> {form.getValues('cateringType') || 'Standard'}</p>
                                  <p><strong>Dire:</strong> {form.getValues('duration') || 'À discuter'}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-800 mb-2">Kote • Lieu</h4>
                                  <p><strong>Kote:</strong> {form.getValues('location') || 'À préciser'}</p>
                                  <p><strong>Enstalasyon:</strong> {form.getValues('setupTime') || 'À définir'}</p>
                                  <p><strong>Bidjè:</strong> {form.getValues('budget') || 'À discuter'}</p>
                                </div>
                              </div>
                              {form.getValues('additionalServices')?.length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-gray-800 mb-2">Sèvis Adisyonèl • Services additionnels:</h4>
                                  <p className="text-sm text-gray-600">{form.getValues('additionalServices').join(', ')}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-4">
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => setStep(1)}
                              className="flex-1"
                            >
                              <ArrowLeft className="mr-2 h-4 w-4" />
                              Retounen • Retour
                            </Button>
                            <Button 
                              type="submit" 
                              className="flex-1 bg-green-600 hover:bg-green-700 py-3"
                              disabled={reservationMutation.isPending}
                            >
                              {reservationMutation.isPending ? "Ap konfime..." : "Konfime Evènman • Confirmer l'Événement"}
                              <Check className="ml-2 h-5 w-5" />
                            </Button>
                          </div>
                        </>
                      )}
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar avec informations */}
            <div className="space-y-6">
              {/* Contact rapide */}
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-600 flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Kontak Rapid • Contact Rapide
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-semibold">(514) 555-DOUNIE</p>
                      <p className="text-sm text-gray-600">24/7 pou evènman yo • pour événements</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-semibold">events@dounie-cuisine.com</p>
                      <p className="text-sm text-gray-600">Devis nan 24h • sous 24h</p>
                    </div>
                  </div>
                  <Link href="tel:+15145553686">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Phone className="h-4 w-4 mr-2" />
                      Rele Kounye a • Appelez Maintenant
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Services inclus */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center gap-2">
                    <Check className="h-5 w-5" />
                    Sèvis Yo Inklui • Services Inclus
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-green-800">
                  <div className="flex items-start gap-2">
                    <Truck className="h-4 w-4 mt-0.5" />
                    <div>
                      <p className="font-medium">Livraison & Installation:</p>
                      <p>Livraison complète, installation sur site, nettoyage inclus</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Users className="h-4 w-4 mt-0.5" />
                    <div>
                      <p className="font-medium">Équipe Professionnelle:</p>
                      <p>Serveurs, DJ, coordinateur événement</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Utensils className="h-4 w-4 mt-0.5" />
                    <div>
                      <p className="font-medium">Matériel Fourni:</p>
                      <p>Vaisselle, nappage, matériel service</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Événements cette semaine */}
              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="text-purple-600 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Semèn sa a • Cette Semaine
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <div>
                      <span className="font-medium">Samedi: Mariage 200 pers.</span>
                      <p className="text-xs text-gray-600">Service complet + DJ</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-blue-500" />
                    <div>
                      <span className="font-medium">Dimanche: Graduation 150 pers.</span>
                      <p className="text-xs text-gray-600">Buffet traditionnel</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-green-500" />
                    <div>
                      <span className="font-medium">Disponibilités ouvertes</span>
                      <p className="text-xs text-gray-600">Réservez dès maintenant!</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Promotion */}
              <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
                <CardHeader>
                  <CardTitle className="text-orange-800 flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    Promosyon • Promotion
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-2">15% OFF</div>
                  <p className="text-sm text-orange-800 mb-3">
                    Evenman ak 50+ moun yo nan mwa sa a • Événements de 50+ personnes ce mois
                  </p>
                  <Badge className="bg-orange-500 text-white">PROMOTION ACTIVE</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
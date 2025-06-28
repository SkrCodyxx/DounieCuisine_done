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
        title: "Événement Réservé !",
        description: "Merci beaucoup ! Nous vous appellerons dans l'heure pour confirmer tous les détails et vous envoyer un devis."
      });
      setStep(3);
    },
    onError: (error: Error) => { // Ajout du type Error
      toast({ 
        title: "Erreur de Réservation",
        description: error.message || "Un problème est survenu lors de votre demande de réservation. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  });

  const serviceTypes = [
    "Service Traiteur Complet",
    "Traiteur + DJ",
    "Traiteur + DJ + Organisation Complète",
    "DJ Seulement",
    "Organisation d'Événement Seulement",
    "Service Partiel (selon besoins)",
    "Consultation Événementielle"
  ];

  const eventTypes = [
    "Mariage",
    "Anniversaire",
    "Graduation",
    "Baptême",
    "Fête d'Entreprise",
    "Réunion de Famille",
    "Soirée Privée",
    "Festival Culturel",
    "Inauguration",
    "Fête de Quartier",
    "Célébration Religieuse",
    "Autre (à préciser)"
  ];

  const cateringOptions = [
    "Buffet Traditionnel Haïtien",
    "Service à l'Assiette",
    "Cocktail Dînatoire et Amuse-Bouches",
    "Brunch Créole Authentique",
    "Menu Dégustation Personnalisé",
    "Barbecue Caribéen Festif",
    "Service Mixte (Buffet et Assiette)"
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
      <PublicLayout> {/* Utilisation du Layout Public */}
        {/* Bannière promotionnelle - Style cohérent */}
        <div className="bg-accent text-accent-foreground py-3 px-4 sm:px-6 shadow-md">
          <div className="container mx-auto text-center">
            <div className="flex items-center justify-center gap-2 text-sm font-semibold">
              <Gift className="h-5 w-5" />
              <span>PROMOTION SPÉCIALE : -15% sur les événements de plus de 50 personnes ce mois-ci !</span>
              <Gift className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* En-tête de Page */}
        <section className="py-12 md:py-16 text-center bg-card border-b border-border">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <PartyPopper className="h-10 w-10 md:h-12 md:w-12 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">Réservez Votre Événement</h1>
              <Calendar className="h-10 w-10 md:h-12 md:w-12 text-primary" />
            </div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Service traiteur professionnel, DJ, organisation complète - Faites de votre événement un moment inoubliable avec Dounie Cuisine !
            </p>
          </div>
        </section>

        {/* Contenu Principal (Formulaire et Sidebar) */}
        <div className="container mx-auto px-4 sm:px-6 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Indicateur de progression stylisé */}
            <div className="flex items-center justify-center mb-10 space-x-2 sm:space-x-4">
              {[1, 2, 3].map((num) => (
                <React.Fragment key={num}>
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all duration-300",
                    step >= num ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border"
                  )}>
                    {step > num ? <Check className="w-5 h-5" /> : num}
                  </div>
                  {num < 3 && (
                    <div className={cn(
                      "h-1 flex-1 transition-all duration-300",
                      step > num ? "bg-primary" : "bg-border"
                    )}></div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Formulaire ou Message de Succès */}
            {step === 3 ? (
              <Card className="w-full max-w-lg mx-auto border-green-500 bg-green-50 shadow-xl">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="h-12 w-12" />
                  </div>
                  <h2 className="text-3xl font-bold text-green-700 mb-4">
                    Demande de Réservation Envoyée !
                  </h2>
                  <p className="text-gray-700 mb-6 text-lg">
                    Merci beaucoup pour votre demande ! Notre équipe vous contactera par téléphone dans l'heure qui suit pour confirmer tous les détails et vous fournir un devis personnalisé.
                  </p>
                  <div className="bg-primary/10 p-4 rounded-lg mb-6 text-left">
                    <div className="space-y-2 text-sm text-primary-foreground/80 bg-primary p-3 rounded-md">
                       <p><strong>Récapitulatif de votre demande :</strong></p>
                       <p><strong>Code Événement (temporaire) :</strong> #{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                       <p><strong>Type d'Événement :</strong> {form.getValues('eventType')}</p>
                       <p><strong>Service Demandé :</strong> {form.getValues('serviceType')}</p>
                       <p><strong>Date :</strong> {form.getValues('eventDate')} à {form.getValues('eventTime') || '19h00'}</p>
                       <p><strong>Nombre d'invités :</strong> {form.getValues('partySize') || 'À confirmer'}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground mb-6">
                    <p className="flex items-center justify-center"><Phone className="h-4 w-4 mr-2 text-primary"/>Nous vous appellerons sous 1 heure.</p>
                    <p className="flex items-center justify-center"><Mail className="h-4 w-4 mr-2 text-primary"/>Devis détaillé envoyé sous 24h.</p>
                    <p className="flex items-center justify-center"><CheckCircle className="h-4 w-4 mr-2 text-green-600"/>Confirmation finale par téléphone.</p>
                    <p className="font-semibold text-primary">🎉 Votre événement sera mémorable !</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/" className="flex-1">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-lg py-3">
                        Retour à l'Accueil
                      </Button>
                    </Link>
                    <Link href="/menu" className="flex-1">
                      <Button variant="outline" className="w-full text-lg py-3">
                        Voir le Menu Traiteur
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2">
                  <Card className="border-border shadow-xl">
                    <CardHeader className="bg-muted/30">
                      <CardTitle className="text-2xl text-foreground flex items-center gap-3">
                        <Calendar className="h-6 w-6 text-primary" />
                        {step === 1 ? "1. Informations sur l'Événement" : "2. Services et Détails"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8">
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                          {step === 1 && (
                            <>
                              <section className="space-y-6">
                                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2 border-b pb-3 mb-6">
                                  <Users className="h-5 w-5 text-primary" />
                                  Vos Coordonnées
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <FormField control={form.control} name="guestName" render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Nom complet *</FormLabel>
                                      <FormControl><Input placeholder="Ex: Jean Dupont" {...field} /></FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}/>
                                  <FormField control={form.control} name="guestPhone" render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Téléphone *</FormLabel>
                                      <FormControl><Input placeholder="Ex: (514) 123-4567" {...field} /></FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}/>
                                </div>
                                <FormField control={form.control} name="guestEmail" render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Adresse e-mail *</FormLabel>
                                    <FormControl><Input type="email" placeholder="Ex: jean.dupont@example.com" {...field} /></FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}/>
                              </section>

                              <section className="space-y-6 border-t pt-8">
                                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2 border-b pb-3 mb-6">
                                  <PartyPopper className="h-5 w-5 text-primary" />
                                  Détails de l'Événement
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <FormField control={form.control} name="eventType" render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Type d'événement *</FormLabel>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Choisir le type" /></SelectTrigger></FormControl>
                                        <SelectContent>{eventTypes.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}</SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}/>
                                  <FormField control={form.control} name="serviceType" render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Type de service désiré *</FormLabel>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Choisir le service" /></SelectTrigger></FormControl>
                                        <SelectContent>{serviceTypes.map((service) => (<SelectItem key={service} value={service}>{service}</SelectItem>))}</SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}/>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <FormField control={form.control} name="eventDate" render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Date de l'événement *</FormLabel>
                                      <FormControl><Input type="date" {...field} min={new Date().toISOString().split('T')[0]}/></FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}/>
                                  <FormField control={form.control} name="eventTime" render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Heure de début souhaitée</FormLabel>
                                      <FormControl><Input type="time" {...field} /></FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}/>
                                  <FormField control={form.control} name="partySize" render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Nombre d'invités (approx.) *</FormLabel>
                                      <FormControl><Input type="number" placeholder="Ex: 50" {...field} /></FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}/>
                                </div>
                              </section>

                              <section className="space-y-6 border-t pt-8">
                                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2 border-b pb-3 mb-6">
                                  <MapPin className="h-5 w-5 text-primary" />
                                  Lieu et Logistique
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <FormField control={form.control} name="location" render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Lieu de l'événement *</FormLabel>
                                      <FormControl><Input placeholder="Ex: Salle XYZ, Domicile, Parc ABC" {...field} /></FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}/>
                                   <FormField control={form.control} name="duration" render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Durée estimée de l'événement</FormLabel>
                                      <FormControl><Input placeholder="Ex: 4 heures, soirée complète" {...field} /></FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}/>
                                </div>
                                <FormField control={form.control} name="address" render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Adresse complète (si applicable)</FormLabel>
                                    <FormControl><Input placeholder="Pour livraison et installation" {...field} /></FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}/>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <FormField control={form.control} name="setupTime" render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Heure d'installation souhaitée</FormLabel>
                                      <FormControl><Input placeholder="Ex: 15h00, 2h avant" {...field} /></FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}/>
                                  <FormField control={form.control} name="budget" render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Budget estimé (optionnel)</FormLabel>
                                      <FormControl><Input placeholder="Ex: 2000 $CA, à discuter" {...field} /></FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}/>
                                </div>
                              </section>

                              <Button
                                type="button"
                                onClick={() => setStep(2)}
                                className="w-full bg-primary hover:bg-primary/90 py-3 text-lg"
                                disabled={!form.watch('guestName') || !form.watch('guestPhone') || !form.watch('eventDate') || !form.watch('eventType') || !form.watch('serviceType') || !form.watch('partySize') || !form.watch('location')}
                              >
                                Continuer vers les Détails du Service
                                <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
                              </Button>
                            </>
                          )}

                          {step === 2 && (
                            <>
                              <section className="space-y-6">
                                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2 border-b pb-3 mb-6">
                                  <ChefHat className="h-5 w-5 text-primary" />
                                  Préférences Culinaires et Services
                                </h3>
                                <FormField control={form.control} name="cateringType" render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Type de service traiteur souhaité</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl><SelectTrigger><SelectValue placeholder="Choisissez une option" /></SelectTrigger></FormControl>
                                      <SelectContent>{cateringOptions.map((option) => (<SelectItem key={option} value={option}>{option}</SelectItem>))}</SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}/>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <FormField control={form.control} name="musicPreferences" render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Préférences musicales (si DJ)</FormLabel>
                                      <FormControl><Input placeholder="Ex: Kompa, Zouk, Afrobeats, Populaire" {...field} /></FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}/>
                                  <FormField control={form.control} name="decorationNeeds" render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Besoins en décoration</FormLabel>
                                      <FormControl><Input placeholder="Ex: Thème tropical, couleurs spécifiques" {...field} /></FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}/>
                                </div>
                                 <FormField control={form.control} name="customService" render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Autres services personnalisés envisagés</FormLabel>
                                    <FormControl><Textarea placeholder="Décrivez tout autre service ou besoin spécifique..." rows={3} {...field} /></FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}/>
                              </section>
                              
                              <section className="space-y-6 border-t pt-8">
                                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2 border-b pb-3 mb-6">
                                  <Gift className="h-5 w-5 text-primary" />
                                  Services Additionnels & Demandes Spéciales
                                </h3>
                                <div>
                                  <FormLabel className="text-base font-medium">Services additionnels souhaités :</FormLabel>
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 mt-3">
                                    {[
                                      'DJ Professionnel', 'Animation et MC', 'Décoration Thématique Complète',
                                      'Photographe/Vidéaste', 'Service Bar Complet', 'Location de Tente/Chapiteau',
                                      'Éclairage d\'Ambiance', 'Arrangements Floraux Personnalisés', 'Gâteau d\'Événement Personnalisé',
                                      'Transport pour Invités', 'Coordination d\'Hébergement'
                                    ].map((service) => (
                                      <FormField key={service} control={form.control} name="additionalServices" render={({ field }) => (
                                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(service)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...(field.value || []), service])
                                                  : field.onChange(field.value?.filter((value) => value !== service))
                                              }}
                                            />
                                          </FormControl>
                                          <FormLabel className="font-normal text-sm">{service}</FormLabel>
                                        </FormItem>
                                      )}/>
                                    ))}
                                  </div>
                                </div>
                                <FormField control={form.control} name="specialRequests" render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Autres demandes spéciales ou informations importantes</FormLabel>
                                    <FormControl><Textarea placeholder="Allergies alimentaires, restrictions, célébration particulière, surprises, etc." rows={4} {...field} /></FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}/>
                              </section>

                              <div className="border-t pt-8 mt-8">
                                <h3 className="text-xl font-semibold text-foreground mb-4">Récapitulatif de votre demande</h3>
                                <div className="bg-muted/50 p-6 rounded-lg space-y-3 text-sm">
                                  <p><strong>Nom :</strong> {form.getValues('guestName')}</p>
                                  <p><strong>Type d'événement :</strong> {form.getValues('eventType')}</p>
                                  <p><strong>Date :</strong> {form.getValues('eventDate')} {form.getValues('eventTime')}</p>
                                  <p><strong>Invités :</strong> {form.getValues('partySize')}</p>
                                  <p><strong>Lieu :</strong> {form.getValues('location')}</p>
                                  <p><strong>Service principal :</strong> {form.getValues('serviceType')}</p>
                                  {form.getValues('additionalServices')?.length > 0 && <p><strong>Services additionnels :</strong> {form.getValues('additionalServices').join(', ')}</p>}
                                  <p className="mt-2 italic">Un devis détaillé vous sera envoyé après confirmation téléphonique.</p>
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 py-3 text-lg">
                                  <ArrowLeft className="mr-2 h-5 w-5" />
                                  Précédent
                                </Button>
                                <Button
                                  type="submit"
                                  className="flex-1 bg-green-600 hover:bg-green-700 py-3 text-lg"
                                  disabled={reservationMutation.isPending}
                                >
                                  {reservationMutation.isPending ? "Envoi en cours..." : "Envoyer ma Demande de Réservation"}
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

                {/* Sidebar d'informations contextuelles */}
                <aside className="space-y-6 lg:sticky lg:top-24">
                  <Card className="border-primary/50 shadow-lg">
                    <CardHeader className="bg-primary/10">
                      <CardTitle className="text-primary flex items-center gap-2">
                        <Phone className="h-6 w-6" />
                        Contactez-Nous Directement
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-3">
                      <p className="text-sm text-muted-foreground">Pour une assistance immédiate ou des questions spécifiques :</p>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-foreground">(514) 123-DOUNIE (3686)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-foreground">info@dounie-cuisine.ca</span>
                      </div>
                       <Link href="tel:+15141233686">
                        <Button className="w-full bg-primary hover:bg-primary/90 mt-2">
                          <Phone className="h-4 w-4 mr-2" />
                          Appeler Maintenant
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card className="border-secondary/50 shadow-lg">
                    <CardHeader className="bg-secondary/10">
                      <CardTitle className="text-secondary flex items-center gap-2">
                        <ChefHat className="h-6 w-6" />
                        Nos Services Inclus
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-secondary flex-shrink-0"/>Livraison et installation complètes sur site.</li>
                      <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-secondary flex-shrink-0"/>Équipe de service professionnelle et attentionnée.</li>
                      <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-secondary flex-shrink-0"/>Vaisselle, couverts, et matériel de service fournis.</li>
                      <li className="flex items-start"><CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-secondary flex-shrink-0"/>Nettoyage après l'événement pour votre tranquillité.</li>
                    </CardContent>
                  </Card>
                   <Card className="border-accent/50 shadow-lg">
                    <CardHeader className="bg-accent/10">
                      <CardTitle className="text-accent flex items-center gap-2">
                        <Gift className="h-6 w-6" />
                        Promotion Actuelle
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 text-center">
                      <p className="text-2xl font-bold text-accent mb-2">15% de Réduction</p>
                      <p className="text-sm text-muted-foreground mb-3">
                        Sur tous nos services traiteur pour les événements de 50 personnes et plus, réservés ce mois-ci !
                      </p>
                      <Badge className="bg-accent text-accent-foreground">OFFRE LIMITÉE</Badge>
                    </CardContent>
                  </Card>
                </aside>
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Upload, 
  Save, 
  Clock, 
  Image, 
  Type, 
  Palette, 
  Globe,
  Phone,
  MapPin,
  Camera,
  FileText,
  Star,
  Gift,
  Megaphone,
  Trash2,
  Edit,
  Plus,
  Eye
} from "lucide-react";

export function SystemSettings() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");

  // États pour la gestion du contenu
  const [businessInfo, setBusinessInfo] = useState({
    name: "Dounie Cuisine",
    tagline: "Service Traiteur & Événements",
    description: "Service traiteur professionnel et organisation d'événements haïtiens au Canada.",
    phone: "(514) 555-DOUNIE",
    email: "events@dounie-cuisine.com",
    address: "1234 Rue Saint-Laurent, Montréal, QC H2X 2S9",
    website: "www.dounie-cuisine.com"
  });

  const [openingHours, setOpeningHours] = useState({
    monday: { open: "09:00", close: "18:00", closed: false },
    tuesday: { open: "09:00", close: "18:00", closed: false },
    wednesday: { open: "09:00", close: "18:00", closed: false },
    thursday: { open: "09:00", close: "18:00", closed: false },
    friday: { open: "09:00", close: "20:00", closed: false },
    saturday: { open: "10:00", close: "20:00", closed: false },
    sunday: { open: "12:00", close: "18:00", closed: false }
  });

  const [banners, setBanners] = useState([
    {
      id: 1,
      type: "promotion",
      title: "PROMOTION SPÉCIALE",
      content: "15% de réduction sur les événements de plus de 50 personnes ce mois!",
      active: true,
      color: "yellow",
      startDate: "2025-06-01",
      endDate: "2025-06-30"
    },
    {
      id: 2,
      type: "announcement",
      title: "CETTE SEMAINE",
      content: "Mariage de 200 personnes samedi • Graduation dimanche • Disponible pour vos événements!",
      active: true,
      color: "blue",
      startDate: "2025-06-25",
      endDate: "2025-06-30"
    }
  ]);

  const [socialMediaTexts, setSocialMediaTexts] = useState({
    heroTitle: "Dounie Cuisine - Service Traiteur & Événements",
    heroSubtitle: "Traiteur Professionnel • DJ • Organisation d'Événements",
    heroDescription: "Kijan nou ye! Nou se yon konpayi konplè pou tout evènman ou yo - manje tradisyonèl Ayisyen, DJ ak ekip nou an!",
    footerText: "Service traiteur professionnel et organisation d'événements haïtiens au Canada.",
    contactCallToAction: "Devis Gratuit",
    reservationCallToAction: "Réserver un Événement"
  });

  const [menuPhotos, setMenuPhotos] = useState([
    {
      id: 1,
      name: "Diri ak Djon Djon",
      category: "Plats Principaux",
      imageUrl: "https://images.unsplash.com/photo-1647998270792-69ac80570183",
      description: "Riz parfumé aux champignons noirs haïtiens",
      price: "24.95",
      active: true
    },
    {
      id: 2,
      name: "Griot ak Bannann",
      category: "Plats Principaux", 
      imageUrl: "https://images.unsplash.com/photo-1610592309005-0f92c8e39cec",
      description: "Porc mariné et frit avec plantains dorés",
      price: "26.50",
      active: true
    }
  ]);

  const [eventGallery, setEventGallery] = useState([
    {
      id: 1,
      title: "Mariage 200 personnes",
      date: "2025-06-22",
      imageUrl: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a",
      description: "Service traiteur complet avec DJ et décoration",
      category: "Mariages",
      featured: true
    },
    {
      id: 2,
      title: "Graduation 150 personnes",
      date: "2025-06-23",
      imageUrl: "https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg",
      description: "Buffet traditionnel haïtien",
      category: "Graduations", 
      featured: true
    }
  ]);

  const [logo, setLogo] = useState({
    primary: "/logo-dounie-primary.png",
    secondary: "/logo-dounie-white.png",
    favicon: "/favicon.ico"
  });

  const saveSettings = (section: string) => {
    toast({
      title: "Paramètres sauvegardés!",
      description: `Les paramètres ${section} ont été mis à jour avec succès.`
    });
  };

  const handleImageUpload = (type: string, file: File) => {
    // Simulation upload
    const url = URL.createObjectURL(file);
    toast({
      title: "Image téléchargée!",
      description: `L'image ${type} a été mise à jour.`
    });
  };

  const addBanner = () => {
    const newBanner = {
      id: Date.now(),
      type: "announcement",
      title: "NOUVELLE ANNONCE",
      content: "Contenu de la nouvelle annonce...",
      active: false,
      color: "blue",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    setBanners([...banners, newBanner]);
  };

  const updateBanner = (id: number, updates: any) => {
    setBanners(banners.map(banner => 
      banner.id === id ? { ...banner, ...updates } : banner
    ));
  };

  const deleteBanner = (id: number) => {
    setBanners(banners.filter(banner => banner.id !== id));
    toast({
      title: "Bannière supprimée",
      description: "La bannière a été supprimée avec succès."
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paramètres Système</h1>
          <p className="text-gray-600">Gérez tous les aspects de votre site web et de votre entreprise</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-7 w-full">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="hours">Heures</TabsTrigger>
          <TabsTrigger value="banners">Bannières</TabsTrigger>
          <TabsTrigger value="texts">Textes</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="gallery">Galerie</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
        </TabsList>

        {/* Informations Générales */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Informations Générales de l'Entreprise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="businessName">Nom de l'entreprise</Label>
                    <Input
                      id="businessName"
                      value={businessInfo.name}
                      onChange={(e) => setBusinessInfo({...businessInfo, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tagline">Slogan</Label>
                    <Input
                      id="tagline"
                      value={businessInfo.tagline}
                      onChange={(e) => setBusinessInfo({...businessInfo, tagline: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={businessInfo.phone}
                      onChange={(e) => setBusinessInfo({...businessInfo, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={businessInfo.email}
                      onChange={(e) => setBusinessInfo({...businessInfo, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      rows={3}
                      value={businessInfo.description}
                      onChange={(e) => setBusinessInfo({...businessInfo, description: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Adresse complète</Label>
                    <Textarea
                      id="address"
                      rows={2}
                      value={businessInfo.address}
                      onChange={(e) => setBusinessInfo({...businessInfo, address: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Site web</Label>
                    <Input
                      id="website"
                      value={businessInfo.website}
                      onChange={(e) => setBusinessInfo({...businessInfo, website: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <Button onClick={() => saveSettings("généraux")} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder les Informations Générales
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Heures d'Ouverture */}
        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Heures d'Ouverture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(openingHours).map(([day, hours]) => (
                <div key={day} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-24 font-medium capitalize">
                    {day === 'monday' ? 'Lundi' : 
                     day === 'tuesday' ? 'Mardi' :
                     day === 'wednesday' ? 'Mercredi' :
                     day === 'thursday' ? 'Jeudi' :
                     day === 'friday' ? 'Vendredi' :
                     day === 'saturday' ? 'Samedi' : 'Dimanche'}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!hours.closed}
                      onChange={(e) => setOpeningHours({
                        ...openingHours,
                        [day]: { ...hours, closed: !e.target.checked }
                      })}
                    />
                    <span className="text-sm">Ouvert</span>
                  </div>
                  {!hours.closed && (
                    <>
                      <Input
                        type="time"
                        value={hours.open}
                        onChange={(e) => setOpeningHours({
                          ...openingHours,
                          [day]: { ...hours, open: e.target.value }
                        })}
                        className="w-32"
                      />
                      <span>à</span>
                      <Input
                        type="time"
                        value={hours.close}
                        onChange={(e) => setOpeningHours({
                          ...openingHours,
                          [day]: { ...hours, close: e.target.value }
                        })}
                        className="w-32"
                      />
                    </>
                  )}
                  {hours.closed && (
                    <span className="text-gray-500">Fermé</span>
                  )}
                </div>
              ))}
              <Button onClick={() => saveSettings("heures")} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder les Heures d'Ouverture
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bannières et Annonces */}
        <TabsContent value="banners">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Megaphone className="h-5 w-5" />
                    Bannières et Annonces
                  </div>
                  <Button onClick={addBanner}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter Bannière
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {banners.map((banner) => (
                  <div key={banner.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={banner.active ? "default" : "secondary"}>
                          {banner.active ? "Actif" : "Inactif"}
                        </Badge>
                        <Badge variant="outline">
                          {banner.type === "promotion" ? "Promotion" : "Annonce"}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateBanner(banner.id, { active: !banner.active })}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteBanner(banner.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Titre</Label>
                        <Input
                          value={banner.title}
                          onChange={(e) => updateBanner(banner.id, { title: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Couleur</Label>
                        <select
                          value={banner.color}
                          onChange={(e) => updateBanner(banner.id, { color: e.target.value })}
                          className="w-full p-2 border rounded"
                        >
                          <option value="yellow">Jaune</option>
                          <option value="blue">Bleu</option>
                          <option value="red">Rouge</option>
                          <option value="green">Vert</option>
                          <option value="purple">Violet</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Contenu</Label>
                      <Textarea
                        value={banner.content}
                        onChange={(e) => updateBanner(banner.id, { content: e.target.value })}
                        rows={2}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Date de début</Label>
                        <Input
                          type="date"
                          value={banner.startDate}
                          onChange={(e) => updateBanner(banner.id, { startDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Date de fin</Label>
                        <Input
                          type="date"
                          value={banner.endDate}
                          onChange={(e) => updateBanner(banner.id, { endDate: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Textes du Site */}
        <TabsContent value="texts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Textes du Site Web
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="heroTitle">Titre Principal (Hero)</Label>
                  <Input
                    id="heroTitle"
                    value={socialMediaTexts.heroTitle}
                    onChange={(e) => setSocialMediaTexts({...socialMediaTexts, heroTitle: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="heroSubtitle">Sous-titre (Hero)</Label>
                  <Input
                    id="heroSubtitle"
                    value={socialMediaTexts.heroSubtitle}
                    onChange={(e) => setSocialMediaTexts({...socialMediaTexts, heroSubtitle: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="heroDescription">Description Principale</Label>
                  <Textarea
                    id="heroDescription"
                    rows={4}
                    value={socialMediaTexts.heroDescription}
                    onChange={(e) => setSocialMediaTexts({...socialMediaTexts, heroDescription: e.target.value})}
                    placeholder="Décrivez votre service traiteur et événementiel ici..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactCTA">Bouton Contact</Label>
                    <Input
                      id="contactCTA"
                      value={socialMediaTexts.contactCallToAction}
                      onChange={(e) => setSocialMediaTexts({...socialMediaTexts, contactCallToAction: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="reservationCTA">Bouton Réservation</Label>
                    <Input
                      id="reservationCTA"
                      value={socialMediaTexts.reservationCallToAction}
                      onChange={(e) => setSocialMediaTexts({...socialMediaTexts, reservationCallToAction: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="footerText">Texte du Footer</Label>
                  <Textarea
                    id="footerText"
                    rows={2}
                    value={socialMediaTexts.footerText}
                    onChange={(e) => setSocialMediaTexts({...socialMediaTexts, footerText: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={() => saveSettings("textes")} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder les Textes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gestion Menu et Photos */}
        <TabsContent value="menu">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Gestion du Menu et Photos
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter Plat
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menuPhotos.map((item) => (
                    <div key={item.id} className="border rounded-lg overflow-hidden">
                      <div className="relative">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-48 object-cover"
                        />
                        <Badge 
                          className={`absolute top-2 right-2 ${item.active ? 'bg-green-500' : 'bg-gray-500'}`}
                        >
                          {item.active ? 'Actif' : 'Inactif'}
                        </Badge>
                      </div>
                      <div className="p-4 space-y-2">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-green-600">{item.price} $CA</span>
                          <Badge variant="outline">{item.category}</Badge>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Edit className="h-4 w-4 mr-1" />
                            Modifier
                          </Button>
                          <Button size="sm" variant="outline">
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Galerie d'Événements */}
        <TabsContent value="gallery">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Galerie d'Événements
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter Album
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {eventGallery.map((event) => (
                    <div key={event.id} className="border rounded-lg overflow-hidden">
                      <div className="relative">
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="w-full h-48 object-cover"
                        />
                        {event.featured && (
                          <Badge className="absolute top-2 left-2 bg-yellow-500">
                            <Star className="h-3 w-3 mr-1" />
                            Vedette
                          </Badge>
                        )}
                      </div>
                      <div className="p-4 space-y-2">
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-gray-600">{event.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">{event.date}</span>
                          <Badge variant="outline">{event.category}</Badge>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Edit className="h-4 w-4 mr-1" />
                            Modifier
                          </Button>
                          <Button size="sm" variant="outline">
                            <Camera className="h-4 w-4 mr-1" />
                            Photos
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Branding et Logos */}
        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Branding et Logos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Logo Principal</h3>
                  <div className="border rounded-lg p-4 text-center">
                    <img src={logo.primary} alt="Logo principal" className="h-20 mx-auto mb-4" />
                    <Button variant="outline" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Changer Logo
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Logo Blanc</h3>
                  <div className="border rounded-lg p-4 text-center bg-gray-800">
                    <img src={logo.secondary} alt="Logo blanc" className="h-20 mx-auto mb-4" />
                    <Button variant="outline" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Changer Logo
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Favicon</h3>
                  <div className="border rounded-lg p-4 text-center">
                    <img src={logo.favicon} alt="Favicon" className="h-8 mx-auto mb-4" />
                    <Button variant="outline" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Changer Favicon
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold">Couleurs de Marque</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Rouge Principal</Label>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-red-600 rounded border"></div>
                      <Input value="#dc2626" readOnly />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Bleu Secondaire</Label>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-600 rounded border"></div>
                      <Input value="#2563eb" readOnly />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Jaune Accent</Label>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-yellow-500 rounded border"></div>
                      <Input value="#eab308" readOnly />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Vert Success</Label>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-600 rounded border"></div>
                      <Input value="#16a34a" readOnly />
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={() => saveSettings("branding")} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder le Branding
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
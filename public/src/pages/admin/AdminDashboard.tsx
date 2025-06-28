import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { StaffManagement } from "./StaffManagement";
import { ComprehensiveAdminTest } from "./ComprehensiveAdminTest";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Users, 
  UtensilsCrossed, 
  Calendar, 
  Package, 
  DollarSign, 
  BarChart3, 
  Plus, 
  Edit, 
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  ShoppingCart,
  CalendarDays,
  UserCheck,
  Star,
  Sun,
  Waves,
  Palmtree
} from "lucide-react";

export function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  // Queries pour récupérer toutes les données
  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
    queryFn: () => apiRequest("/api/admin/stats")
  });

  const { data: menuItems } = useQuery({
    queryKey: ["/api/menu"],
    queryFn: () => apiRequest("/api/menu")
  });

  const { data: orders } = useQuery({
    queryKey: ["/api/orders"],
    queryFn: () => apiRequest("/api/orders")
  });

  const { data: reservations } = useQuery({
    queryKey: ["/api/reservations"],
    queryFn: () => apiRequest("/api/reservations")
  });

  const { data: employees } = useQuery({
    queryKey: ["/api/employees"],
    queryFn: () => apiRequest("/api/employees")
  });

  const { data: inventory } = useQuery({
    queryKey: ["/api/inventory"],
    queryFn: () => apiRequest("/api/inventory")
  });

  const { data: events } = useQuery({
    queryKey: ["/api/calendar"],
    queryFn: () => apiRequest("/api/calendar")
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 caribbean-theme">
      <div className="container mx-auto p-6">
        {/* En-tête avec thème caribéen */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Sun className="h-8 w-8 text-orange-500 sunshine-glow" />
              <Waves className="h-6 w-6 text-blue-500 wave-animation" />
              <Palmtree className="h-7 w-7 text-green-500 tropical-breeze" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Tableau de Bord Administrateur</h1>
              <p className="text-gray-600">Restaurant Caribéen - Gestion Complète</p>
            </div>
          </div>
          
          {/* Cartes de statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="tropical-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Revenus du Jour</p>
                    <p className="text-2xl font-bold text-blue-600">$2,847</p>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +12% vs hier
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="tropical-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Commandes Aujourd'hui</p>
                    <p className="text-2xl font-bold text-green-600">47</p>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +8% vs hier
                    </p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="tropical-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Réservations</p>
                    <p className="text-2xl font-bold text-orange-600">23</p>
                    <p className="text-xs text-orange-600">Aujourd'hui</p>
                  </div>
                  <CalendarDays className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="tropical-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Note Moyenne</p>
                    <p className="text-2xl font-bold text-yellow-600">4.8</p>
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <UserCheck className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Onglets principaux */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 caribbean-nav">
            <TabsTrigger value="overview">Aperçu</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="orders">Commandes</TabsTrigger>
            <TabsTrigger value="reservations">Réservations</TabsTrigger>
            <TabsTrigger value="staff">Personnel</TabsTrigger>
            <TabsTrigger value="inventory">Inventaire</TabsTrigger>
            <TabsTrigger value="tests">Tests Production</TabsTrigger>
          </TabsList>

          {/* Onglet Aperçu */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Commandes récentes */}
              <Card className="tropical-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Commandes Récentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {orders?.slice(0, 5).map((order: any) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                        <div>
                          <p className="font-medium">Commande #{order.id}</p>
                          <p className="text-sm text-gray-600">${order.totalAmount}</p>
                        </div>
                        <Badge className={
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }>
                          {order.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Inventaire critique */}
              <Card className="tropical-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Stock Critique
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {inventory?.filter((item: any) => item.currentStock <= item.minimumStock).slice(0, 5).map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">{item.currentStock} {item.unit}</p>
                        </div>
                        <Badge variant="destructive">
                          Stock Bas
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Menu */}
          <TabsContent value="menu" className="space-y-6">
            <MenuManagement menuItems={menuItems} />
          </TabsContent>

          {/* Onglet Commandes */}
          <TabsContent value="orders" className="space-y-6">
            <OrdersManagement orders={orders} />
          </TabsContent>

          {/* Onglet Réservations */}
          <TabsContent value="reservations" className="space-y-6">
            <ReservationsManagement reservations={reservations} />
          </TabsContent>

          {/* Onglet Personnel */}
          <TabsContent value="staff" className="space-y-6">
            <StaffManagement employees={employees} />
          </TabsContent>

          {/* Onglet Inventaire */}
          <TabsContent value="inventory" className="space-y-6">
            <InventoryManagement inventory={inventory} />
          </TabsContent>

          {/* Onglet Tests Production */}
          <TabsContent value="tests" className="space-y-6">
            <ComprehensiveAdminTest />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Composants de gestion spécialisés
function MenuManagement({ menuItems }: { menuItems: any[] }) {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(insertMenuItemSchema),
    defaultValues: {
      name: "",
      nameEn: "",
      description: "",
      descriptionEn: "",
      category: "",
      price: "",
      isAvailable: true,
      isFestive: true,
      festiveTheme: "Caraïbes"
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/menu", { method: "POST", body: data }),
    onSuccess: () => {
      toast({ title: "Plat ajouté avec succès!" });
      queryClient.invalidateQueries({ queryKey: ["/api/menu"] });
      setIsAddingItem(false);
      form.reset();
    }
  });

  return (
    <Card className="tropical-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5" />
            Gestion du Menu Caribéen
          </CardTitle>
          <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
            <DialogTrigger asChild>
              <Button className="caribbean-button">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un Plat
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Nouveau Plat Caribéen</DialogTitle>
                <DialogDescription>
                  Ajoutez un nouveau plat à votre menu caribéen
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom du Plat</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Diri ak Djon Djon" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nameEn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom en Anglais</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Black Mushroom Rice" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Description du plat..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Catégorie</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Entrées">Entrées</SelectItem>
                              <SelectItem value="Plats Principaux">Plats Principaux</SelectItem>
                              <SelectItem value="Accompagnements">Accompagnements</SelectItem>
                              <SelectItem value="Desserts">Desserts</SelectItem>
                              <SelectItem value="Boissons">Boissons</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prix ($)</FormLabel>
                          <FormControl>
                            <Input placeholder="24.95" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="caribbean-button" disabled={createMutation.isPending}>
                      {createMutation.isPending ? "Ajout..." : "Ajouter"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems?.map((item: any) => (
            <Card key={item.id} className="border border-blue-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{item.name}</h4>
                    <p className="text-sm text-gray-500">{item.nameEn}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">${item.price}</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function OrdersManagement({ orders }: { orders: any[] }) {
  return (
    <Card className="tropical-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Gestion des Commandes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="caribbean-table">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Commande</th>
                  <th className="text-left p-3">Client</th>
                  <th className="text-left p-3">Montant</th>
                  <th className="text-left p-3">Statut</th>
                  <th className="text-left p-3">Date</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((order: any) => (
                  <tr key={order.id} className="border-b hover:bg-blue-50">
                    <td className="p-3">#{order.id}</td>
                    <td className="p-3">Client #{order.userId}</td>
                    <td className="p-3 font-semibold">${order.totalAmount}</td>
                    <td className="p-3">
                      <Badge className={
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ReservationsManagement({ reservations }: { reservations: any[] }) {
  return (
    <Card className="tropical-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Gestion des Réservations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="caribbean-table">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Client</th>
                  <th className="text-left p-3">Date & Heure</th>
                  <th className="text-left p-3">Personnes</th>
                  <th className="text-left p-3">Statut</th>
                  <th className="text-left p-3">Code</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations?.map((reservation: any) => (
                  <tr key={reservation.id} className="border-b hover:bg-blue-50">
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{reservation.guestName}</p>
                        <p className="text-sm text-gray-600">{reservation.guestEmail}</p>
                      </div>
                    </td>
                    <td className="p-3">{new Date(reservation.dateTime).toLocaleString()}</td>
                    <td className="p-3">{reservation.partySize}</td>
                    <td className="p-3">
                      <Badge className={
                        reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {reservation.status}
                      </Badge>
                    </td>
                    <td className="p-3 font-mono">{reservation.confirmationCode}</td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <XCircle className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}



function InventoryManagement({ inventory }: { inventory: any[] }) {
  return (
    <Card className="tropical-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Gestion de l'Inventaire
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="caribbean-table">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Produit</th>
                  <th className="text-left p-3">Catégorie</th>
                  <th className="text-left p-3">Stock Actuel</th>
                  <th className="text-left p-3">Stock Min.</th>
                  <th className="text-left p-3">Coût/Unité</th>
                  <th className="text-left p-3">Statut</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory?.map((item: any) => (
                  <tr key={item.id} className="border-b hover:bg-blue-50">
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.location}</p>
                      </div>
                    </td>
                    <td className="p-3">{item.category}</td>
                    <td className="p-3">{item.currentStock} {item.unit}</td>
                    <td className="p-3">{item.minimumStock} {item.unit}</td>
                    <td className="p-3">${item.costPerUnit}</td>
                    <td className="p-3">
                      <Badge className={
                        item.currentStock <= item.minimumStock ? 'bg-red-100 text-red-800' :
                        item.currentStock <= item.minimumStock * 2 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }>
                        {item.currentStock <= item.minimumStock ? 'Critique' :
                         item.currentStock <= item.minimumStock * 2 ? 'Bas' : 'OK'}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CalendarManagement({ events }: { events: any[] }) {
  return (
    <Card className="tropical-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Gestion du Calendrier
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events?.map((event: any) => (
            <Card key={event.id} className="border border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{event.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(event.startTime).toLocaleString()}
                      </span>
                      <Badge variant="outline">{event.eventType}</Badge>
                      <Badge className={
                        event.priority === 'high' ? 'bg-red-100 text-red-800' :
                        event.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {event.priority}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
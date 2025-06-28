import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Eye, Clock, DollarSign, User, MapPin } from "lucide-react";

interface Order {
  id: number;
  userId: number;
  status: string;
  items: any[];
  totalAmount: string;
  gstAmount: string;
  qstAmount: string;
  orderType: string;
  specialRequests: string;
  estimatedReadyTime: string;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export function OrderManagement() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await fetch("/api/admin/orders");
      if (!response.ok) throw new Error("Échec de la récupération des commandes");
      return response.json();
    },
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await fetch(`/api/admin/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Échec de la mise à jour du statut de la commande");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast({ title: "Statut de la commande mis à jour" });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur de Mise à Jour",
        description: error.message || "Une erreur est survenue lors de la mise à jour du statut.",
        variant: "destructive",
      });
    },
  });

  const statusOptions = [
    { value: "all", label: "Tous les statuts", color: "gray" },
    { value: "pending", label: "En attente", color: "yellow" },
    { value: "confirmed", label: "Confirmée", color: "blue" },
    { value: "preparing", label: "En préparation", color: "orange" },
    { value: "ready", label: "Prête", color: "green" },
    { value: "delivered", label: "Livrée", color: "emerald" },
    { value: "cancelled", label: "Annulée", color: "red" },
  ];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending": return "secondary";
      case "confirmed": return "default";
      case "preparing": return "outline";
      case "ready": return "default";
      case "delivered": return "default";
      case "cancelled": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    return statusOptions.find(opt => opt.value === status)?.label || status;
  };

  const filteredOrders = orders?.filter((order: Order) => 
    selectedStatus === "all" || order.status === selectedStatus
  );

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Chargement des commandes...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestion des commandes</h1>
            <p className="text-muted-foreground">
              Gérez et suivez toutes les commandes
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredOrders?.map((order: Order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>Commande #{order.id}</span>
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-4 mt-1">
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {order.user ? `${order.user.firstName} ${order.user.lastName}` : "Client anonyme"}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {order.orderType === "dine-in" ? "Sur place" : 
                           order.orderType === "takeout" ? "À emporter" : "Livraison"}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {new Date(order.createdAt).toLocaleString()}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p className="text-lg font-bold flex items-center">
                        <DollarSign className="w-4 h-4" />
                        {order.totalAmount} $CA
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} article{order.items.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-2">Articles:</p>
                    <div className="flex flex-wrap gap-2">
                      {order.items.slice(0, 3).map((item: any, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {item.quantity}x {item.name || `Article ${item.menuItemId}`}
                        </Badge>
                      ))}
                      {order.items.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{order.items.length - 3} autres
                        </Badge>
                      )}
                    </div>
                    {order.specialRequests && (
                      <p className="text-sm text-muted-foreground mt-2">
                        <strong>Demandes spéciales:</strong> {order.specialRequests}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Dialog open={viewingOrder?.id === order.id} onOpenChange={(open) => !open && setViewingOrder(null)}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setViewingOrder(order)}>
                          <Eye className="w-4 h-4 mr-1" />
                          Voir détails
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Détails de la commande #{order.id}</DialogTitle>
                          <DialogDescription>
                            Informations complètes sur la commande
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Informations client</h4>
                              <p>{order.user ? `${order.user.firstName} ${order.user.lastName}` : "Client anonyme"}</p>
                              {order.user?.email && <p className="text-sm text-muted-foreground">{order.user.email}</p>}
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Détails commande</h4>
                              <p>Type: {order.orderType === "dine-in" ? "Sur place" : 
                                       order.orderType === "takeout" ? "À emporter" : "Livraison"}</p>
                              <p>Créée: {new Date(order.createdAt).toLocaleString()}</p>
                              {order.estimatedReadyTime && (
                                <p>Prêt vers: {new Date(order.estimatedReadyTime).toLocaleString()}</p>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Articles commandés</h4>
                            <div className="space-y-2">
                              {order.items.map((item: any, index: number) => (
                                <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                                  <span>{item.quantity}x {item.name || `Article ${item.menuItemId}`}</span>
                                  <span>{item.price} $CA</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="border-t pt-4">
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span>Sous-total:</span>
                                <span>{(parseFloat(order.totalAmount) - parseFloat(order.gstAmount) - parseFloat(order.qstAmount)).toFixed(2)} $CA</span>
                              </div>
                              <div className="flex justify-between text-sm text-muted-foreground">
                                <span>TPS:</span>
                                <span>{order.gstAmount} $CA</span>
                              </div>
                              <div className="flex justify-between text-sm text-muted-foreground">
                                <span>TVQ:</span>
                                <span>{order.qstAmount} $CA</span>
                              </div>
                              <div className="flex justify-between font-bold text-lg border-t pt-2">
                                <span>Total:</span>
                                <span>{order.totalAmount} $CA</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    {order.status !== "delivered" && order.status !== "cancelled" && (
                      <Select 
                        value={order.status} 
                        onValueChange={(status) => updateOrderStatusMutation.mutate({ id: order.id, status })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">En attente</SelectItem>
                          <SelectItem value="confirmed">Confirmée</SelectItem>
                          <SelectItem value="preparing">En préparation</SelectItem>
                          <SelectItem value="ready">Prête</SelectItem>
                          <SelectItem value="delivered">Livrée</SelectItem>
                          <SelectItem value="cancelled">Annulée</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOrders?.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {selectedStatus === "all" ? "Aucune commande" : `Aucune commande ${getStatusLabel(selectedStatus).toLowerCase()}`}
                </h3>
                <p className="text-muted-foreground">
                  Les nouvelles commandes apparaîtront ici
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
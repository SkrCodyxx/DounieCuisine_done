import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Users, Clock, Phone, Mail, Plus, Edit } from "lucide-react";

interface Reservation {
  id: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  partySize: number;
  dateTime: string;
  tableNumber: number;
  status: string;
  specialRequests: string;
  occasion: string;
  confirmationCode: string;
  reminderSent: boolean;
  createdAt: string;
}

export function ReservationManagement() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reservations, isLoading } = useQuery({
    queryKey: ["reservations", selectedDate],
    queryFn: async () => {
      const response = await fetch(`/api/admin/reservations?date=${selectedDate}`);
      if (!response.ok) throw new Error("Échec de la récupération des réservations");
      return response.json();
    },
  });

  const createReservationMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/admin/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Échec de la création de la réservation");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      setIsCreateDialogOpen(false);
      toast({ title: "Réservation créée avec succès" });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur de Création",
        description: error.message || "Une erreur est survenue lors de la création de la réservation.",
        variant: "destructive",
      });
    },
  });

  const updateReservationMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await fetch(`/api/admin/reservations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Échec de la mise à jour de la réservation" }));
        throw new Error(errorData.message || "Échec de la mise à jour de la réservation");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      setEditingReservation(null);
      toast({ title: "Réservation mise à jour avec succès" });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur de Modification",
        description: error.message || "Une erreur est survenue lors de la modification de la réservation.",
        variant: "destructive",
      });
    },
  });

  const updateReservationStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await fetch(`/api/admin/reservations/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Échec de la mise à jour du statut de la réservation" }));
        throw new Error(errorData.message || "Échec de la mise à jour du statut de la réservation");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast({ title: "Statut de la réservation mis à jour" });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur de Mise à Jour du Statut",
        description: error.message || "Une erreur est survenue lors de la mise à jour du statut.",
        variant: "destructive",
      });
    },
  });

  const statusOptions = [
    { value: "all", label: "Tous les statuts" },
    { value: "pending", label: "En attente" },
    { value: "confirmed", label: "Confirmée" },
    { value: "seated", label: "Installée" },
    { value: "completed", label: "Terminée" },
    { value: "cancelled", label: "Annulée" },
    { value: "no-show", label: "Absence" },
  ];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending": return "secondary";
      case "confirmed": return "default";
      case "seated": return "default";
      case "completed": return "default";
      case "cancelled": return "destructive";
      case "no-show": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    return statusOptions.find(opt => opt.value === status)?.label || status;
  };

  const ReservationForm = ({ reservation, onSubmit, onCancel }: any) => {
    const [formData, setFormData] = useState({
      guestName: reservation?.guestName || "",
      guestEmail: reservation?.guestEmail || "",
      guestPhone: reservation?.guestPhone || "",
      partySize: reservation?.partySize || 2,
      dateTime: reservation?.dateTime ? reservation.dateTime.slice(0, 16) : "",
      tableNumber: reservation?.tableNumber || "",
      specialRequests: reservation?.specialRequests || "",
      occasion: reservation?.occasion || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="guestName">Nom du client</Label>
            <Input
              id="guestName"
              value={formData.guestName}
              onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guestEmail">Email</Label>
            <Input
              id="guestEmail"
              type="email"
              value={formData.guestEmail}
              onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="guestPhone">Téléphone</Label>
            <Input
              id="guestPhone"
              value={formData.guestPhone}
              onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="partySize">Nombre de personnes</Label>
            <Input
              id="partySize"
              type="number"
              min="1"
              max="20"
              value={formData.partySize}
              onChange={(e) => setFormData({ ...formData, partySize: parseInt(e.target.value) })}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dateTime">Date et heure</Label>
            <Input
              id="dateTime"
              type="datetime-local"
              value={formData.dateTime}
              onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tableNumber">Numéro de table</Label>
            <Input
              id="tableNumber"
              type="number"
              min="1"
              value={formData.tableNumber}
              onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="occasion">Occasion</Label>
          <Select value={formData.occasion} onValueChange={(value) => setFormData({ ...formData, occasion: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une occasion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Aucune occasion spéciale</SelectItem>
              <SelectItem value="birthday">Anniversaire</SelectItem>
              <SelectItem value="anniversary">Anniversaire de mariage</SelectItem>
              <SelectItem value="business">Repas d'affaires</SelectItem>
              <SelectItem value="festive">Événement festif</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="specialRequests">Demandes spéciales</Label>
          <Textarea
            id="specialRequests"
            value={formData.specialRequests}
            onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
            placeholder="Allergies, préférences de table, etc."
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            {reservation ? "Mettre à jour" : "Créer"}
          </Button>
        </div>
      </form>
    );
  };

  const filteredReservations = reservations?.filter((reservation: Reservation) => 
    selectedStatus === "all" || reservation.status === selectedStatus
  );

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Chargement des réservations...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Gestion des réservations</h1>
            <p className="text-muted-foreground">
              Gérez les réservations de tables
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle réservation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Créer une nouvelle réservation</DialogTitle>
                <DialogDescription>
                  Ajoutez une réservation pour un client
                </DialogDescription>
              </DialogHeader>
              <ReservationForm
                onSubmit={(data: any) => createReservationMutation.mutate(data)}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="date-filter">Date:</Label>
            <Input
              id="date-filter"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-40"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="status-filter">Statut:</Label>
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
          {filteredReservations?.map((reservation: Reservation) => (
            <Card key={reservation.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{reservation.guestName}</span>
                        <Badge variant={getStatusBadgeVariant(reservation.status)}>
                          {getStatusLabel(reservation.status)}
                        </Badge>
                        {reservation.occasion && (
                          <Badge variant="outline" className="text-purple-600">
                            {reservation.occasion === "birthday" ? "Anniversaire" :
                             reservation.occasion === "anniversary" ? "Anniversaire mariage" :
                             reservation.occasion === "business" ? "Affaires" :
                             reservation.occasion === "festive" ? "Festif" : reservation.occasion}
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-4 mt-1">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(reservation.dateTime).toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {reservation.partySize} personne{reservation.partySize > 1 ? 's' : ''}
                        </span>
                        {reservation.tableNumber && (
                          <span>Table {reservation.tableNumber}</span>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Code: {reservation.confirmationCode}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1 text-blue-600" />
                        <span>{reservation.guestEmail}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1 text-green-600" />
                        <span>{reservation.guestPhone}</span>
                      </div>
                    </div>
                    {reservation.specialRequests && (
                      <p className="text-sm text-muted-foreground mt-2">
                        <strong>Demandes spéciales:</strong> {reservation.specialRequests}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Dialog open={editingReservation?.id === reservation.id} onOpenChange={(open) => !open && setEditingReservation(null)}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setEditingReservation(reservation)}>
                          <Edit className="w-4 h-4 mr-1" />
                          Modifier
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Modifier la réservation</DialogTitle>
                          <DialogDescription>
                            Modifiez les détails de la réservation de {reservation.guestName}
                          </DialogDescription>
                        </DialogHeader>
                        <ReservationForm
                          reservation={reservation}
                          onSubmit={(data: any) => updateReservationMutation.mutate({ id: reservation.id, data })}
                          onCancel={() => setEditingReservation(null)}
                        />
                      </DialogContent>
                    </Dialog>
                    
                    {reservation.status !== "completed" && reservation.status !== "cancelled" && (
                      <Select 
                        value={reservation.status} 
                        onValueChange={(status) => updateReservationStatusMutation.mutate({ id: reservation.id, status })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">En attente</SelectItem>
                          <SelectItem value="confirmed">Confirmée</SelectItem>
                          <SelectItem value="seated">Installée</SelectItem>
                          <SelectItem value="completed">Terminée</SelectItem>
                          <SelectItem value="cancelled">Annulée</SelectItem>
                          <SelectItem value="no-show">Absence</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredReservations?.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Aucune réservation pour cette date
                </h3>
                <p className="text-muted-foreground mb-4">
                  Créez une nouvelle réservation ou sélectionnez une autre date
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle réservation
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
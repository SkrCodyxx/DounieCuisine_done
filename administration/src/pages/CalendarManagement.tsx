import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Calendar, Clock, Users, MapPin, Edit, Trash2 } from "lucide-react";

interface CalendarEvent {
  id: number;
  title: string;
  description: string;
  eventType: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  location: string;
  attendees: number[];
  priority: string;
  status: string;
  isPublic: boolean;
  createdBy: number;
  createdAt: string;
}

export function CalendarManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedType, setSelectedType] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: events, isLoading } = useQuery({
    queryKey: ["calendar-events", selectedDate, selectedType],
    queryFn: async () => {
      const response = await fetch(`/api/admin/calendar/events?date=${selectedDate}&type=${selectedType}`);
      if (!response.ok) throw new Error("Failed to fetch events");
      return response.json();
    },
  });

  const { data: employees } = useQuery({
    queryKey: ["employees-list"],
    queryFn: async () => {
      const response = await fetch("/api/admin/employees");
      if (!response.ok) throw new Error("Failed to fetch employees");
      return response.json();
    },
  });

  const createEventMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/admin/calendar/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create event");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar-events"] });
      setIsCreateDialogOpen(false);
      toast({ title: "Événement créé avec succès" });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await fetch(`/api/admin/calendar/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update event");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar-events"] });
      setEditingEvent(null);
      toast({ title: "Événement mis à jour avec succès" });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/calendar/events/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete event");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar-events"] });
      toast({ title: "Événement supprimé avec succès" });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const eventTypes = [
    { value: "all", label: "Tous les types" },
    { value: "shift", label: "Équipe de travail" },
    { value: "payroll", label: "Paie" },
    { value: "meeting", label: "Réunion" },
    { value: "training", label: "Formation" },
    { value: "special_event", label: "Événement spécial" },
    { value: "reservation", label: "Réservation" },
  ];

  const EventForm = ({ event, onSubmit, onCancel }: any) => {
    const [formData, setFormData] = useState({
      title: event?.title || "",
      description: event?.description || "",
      eventType: event?.eventType || "",
      startTime: event?.startTime ? event.startTime.slice(0, 16) : "",
      endTime: event?.endTime ? event.endTime.slice(0, 16) : "",
      allDay: event?.allDay || false,
      location: event?.location || "",
      attendees: event?.attendees || [],
      priority: event?.priority || "normal",
      status: event?.status || "scheduled",
      isPublic: event?.isPublic || false,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="eventType">Type d'événement</Label>
            <Select value={formData.eventType} onValueChange={(value) => setFormData({ ...formData, eventType: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.slice(1).map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startTime">Heure de début</Label>
            <Input
              id="startTime"
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              required={!formData.allDay}
              disabled={formData.allDay}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endTime">Heure de fin</Label>
            <Input
              id="endTime"
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              required={!formData.allDay}
              disabled={formData.allDay}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Lieu</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priorité</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Faible</SelectItem>
                <SelectItem value="normal">Normale</SelectItem>
                <SelectItem value="high">Élevée</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="allDay"
              checked={formData.allDay}
              onCheckedChange={(checked) => setFormData({ ...formData, allDay: checked })}
            />
            <Label htmlFor="allDay">Toute la journée</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isPublic"
              checked={formData.isPublic}
              onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
            />
            <Label htmlFor="isPublic">Public</Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Planifié</SelectItem>
                <SelectItem value="confirmed">Confirmé</SelectItem>
                <SelectItem value="cancelled">Annulé</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            {event ? "Mettre à jour" : "Créer"}
          </Button>
        </div>
      </form>
    );
  };

  const getEventTypeLabel = (type: string) => {
    return eventTypes.find(t => t.value === type)?.label || type;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "text-gray-600";
      case "normal": return "text-blue-600";
      case "high": return "text-orange-600";
      case "urgent": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "scheduled": return "secondary";
      case "confirmed": return "default";
      case "cancelled": return "destructive";
      case "completed": return "default";
      default: return "secondary";
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Chargement du calendrier...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Gestion du calendrier</h1>
            <p className="text-muted-foreground">
              Planifiez les équipes, réunions et événements
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvel événement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Créer un nouvel événement</DialogTitle>
                <DialogDescription>
                  Ajoutez un événement au calendrier
                </DialogDescription>
              </DialogHeader>
              <EventForm
                onSubmit={(data: any) => createEventMutation.mutate(data)}
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
            <Label htmlFor="type-filter">Type:</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4">
          {events?.map((event: CalendarEvent) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      event.eventType === "shift" ? "bg-blue-100" :
                      event.eventType === "meeting" ? "bg-purple-100" :
                      event.eventType === "training" ? "bg-green-100" :
                      event.eventType === "special_event" ? "bg-orange-100" :
                      event.eventType === "payroll" ? "bg-yellow-100" : "bg-gray-100"
                    }`}>
                      <Calendar className={`w-6 h-6 ${
                        event.eventType === "shift" ? "text-blue-600" :
                        event.eventType === "meeting" ? "text-purple-600" :
                        event.eventType === "training" ? "text-green-600" :
                        event.eventType === "special_event" ? "text-orange-600" :
                        event.eventType === "payroll" ? "text-yellow-600" : "text-gray-600"
                      }`} />
                    </div>
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{event.title}</span>
                        <Badge variant={getStatusBadgeVariant(event.status)}>
                          {event.status === "scheduled" ? "Planifié" :
                           event.status === "confirmed" ? "Confirmé" :
                           event.status === "cancelled" ? "Annulé" :
                           event.status === "completed" ? "Terminé" : event.status}
                        </Badge>
                        <Badge variant="outline">
                          {getEventTypeLabel(event.eventType)}
                        </Badge>
                        {event.isPublic && (
                          <Badge variant="outline" className="text-green-600">
                            Public
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-4 mt-1">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {event.allDay ? "Toute la journée" : 
                           `${new Date(event.startTime).toLocaleTimeString()} - ${new Date(event.endTime).toLocaleTimeString()}`}
                        </span>
                        {event.location && (
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {event.location}
                          </span>
                        )}
                        <span className={`flex items-center font-medium ${getPriorityColor(event.priority)}`}>
                          Priorité: {event.priority === "low" ? "Faible" :
                                    event.priority === "normal" ? "Normale" :
                                    event.priority === "high" ? "Élevée" : "Urgente"}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {event.description && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {event.description}
                      </p>
                    )}
                    {event.attendees.length > 0 && (
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1 text-blue-600" />
                        <span className="text-sm text-muted-foreground">
                          {event.attendees.length} participant{event.attendees.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Dialog open={editingEvent?.id === event.id} onOpenChange={(open) => !open && setEditingEvent(null)}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setEditingEvent(event)}>
                          <Edit className="w-4 h-4 mr-1" />
                          Modifier
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Modifier l'événement</DialogTitle>
                          <DialogDescription>
                            Modifiez les détails de {event.title}
                          </DialogDescription>
                        </DialogHeader>
                        <EventForm
                          event={event}
                          onSubmit={(data: any) => updateEventMutation.mutate({ id: event.id, data })}
                          onCancel={() => setEditingEvent(null)}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteEventMutation.mutate(event.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {events?.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Aucun événement pour cette date
                </h3>
                <p className="text-muted-foreground mb-4">
                  Créez un nouvel événement pour cette date
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvel événement
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
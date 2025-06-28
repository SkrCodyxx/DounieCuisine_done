import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Plus, Search, Edit, Trash2, Mail, Phone, Building,
  MapPin, FileText, Eye, MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Client {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  company?: string;
  notes?: string;
  source: string;
  createdAt: string;
  updatedAt: string;
}

interface ClientFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  company: string;
  notes: string;
}

export function ClientManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<ClientFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    company: "",
    notes: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Récupérer les clients
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients", searchTerm],
    queryFn: async () => {
      const url = searchTerm 
        ? `/api/clients?search=${encodeURIComponent(searchTerm)}`
        : '/api/clients';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Échec du chargement des clients');
      }
      return response.json();
    },
  });

  // Récupérer les devis d'un client
  const { data: clientQuotes = [] } = useQuery({
    queryKey: ["client-quotes", selectedClient?.id],
    queryFn: async () => {
      if (!selectedClient?.id) return [];
      const response = await fetch(`/api/quotes?clientId=${selectedClient.id}`);
      if (!response.ok) throw new Error('Échec du chargement des devis du client');
      return response.json();
    },
    enabled: !!selectedClient?.id,
  });

  // Créer un client
  const createClientMutation = useMutation({
    mutationFn: async (clientData: ClientFormData) => {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData),
      });
      if (!response.ok) {
        throw new Error('Échec de la création du client');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Client créé avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      setIsCreateDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur de Création",
        description: error.message || "Une erreur est survenue lors de la création du client.",
        variant: "destructive",
      });
    },
  });

  // Modifier un client
  const updateClientMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<ClientFormData> }) => {
      const response = await fetch(`/api/clients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Échec de la modification du client' }));
        throw new Error(errorData.message || 'Échec de la modification du client');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Client modifié avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      setIsEditDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur de Modification",
        description: error.message || "Une erreur est survenue lors de la modification du client.",
        variant: "destructive",
      });
    },
  });

  // Supprimer un client
  const deleteClientMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/clients/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Échec de la suppression du client' }));
        throw new Error(errorData.message || 'Échec de la suppression du client');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Client supprimé avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur de Suppression",
        description: error.message || "Une erreur est survenue lors de la suppression du client.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
      company: "",
      notes: ""
    });
    setSelectedClient(null);
  };

  const handleCreateClient = () => {
    createClientMutation.mutate(formData);
  };

  const handleUpdateClient = () => {
    if (!selectedClient) return;
    updateClientMutation.mutate({ id: selectedClient.id, data: formData });
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setFormData({
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phoneNumber: client.phoneNumber || "",
      address: client.address || "",
      company: client.company || "",
      notes: client.notes || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClient = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      deleteClientMutation.mutate(id);
    }
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'website': return 'bg-blue-100 text-blue-800';
      case 'registration': return 'bg-green-100 text-green-800';
      case 'contact_form': return 'bg-orange-100 text-orange-800';
      case 'phone': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const ClientForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">Prénom *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            placeholder="Prénom du client"
          />
        </div>
        <div>
          <Label htmlFor="lastName">Nom *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            placeholder="Nom du client"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="email@exemple.com"
        />
      </div>

      <div>
        <Label htmlFor="phoneNumber">Téléphone</Label>
        <Input
          id="phoneNumber"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          placeholder="+1 (514) 123-4567"
        />
      </div>

      <div>
        <Label htmlFor="company">Entreprise</Label>
        <Input
          id="company"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          placeholder="Nom de l'entreprise"
        />
      </div>

      <div>
        <Label htmlFor="address">Adresse</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Adresse complète"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Notes internes sur le client"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => {
            if (isEdit) {
              setIsEditDialogOpen(false);
            } else {
              setIsCreateDialogOpen(false);
            }
            resetForm();
          }}
        >
          Annuler
        </Button>
        <Button
          onClick={isEdit ? handleUpdateClient : handleCreateClient}
          disabled={!formData.firstName || !formData.lastName || !formData.email}
        >
          {isEdit ? "Modifier" : "Créer"}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des Clients</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer un nouveau client</DialogTitle>
            </DialogHeader>
            <ClientForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Barre de recherche */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Rechercher par nom, email ou entreprise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tableau des clients */}
      <Card>
        <CardHeader>
          <CardTitle>
            Liste des Clients ({clients.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Chargement...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Entreprise</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Créé le</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client: Client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {client.firstName} {client.lastName}
                          </div>
                          {client.notes && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {client.notes}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="mr-1 h-3 w-3" />
                            {client.email}
                          </div>
                          {client.phoneNumber && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="mr-1 h-3 w-3" />
                              {client.phoneNumber}
                            </div>
                          )}
                          {client.address && (
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="mr-1 h-3 w-3" />
                              <span className="truncate max-w-xs">{client.address}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {client.company && (
                          <div className="flex items-center text-sm">
                            <Building className="mr-1 h-3 w-3" />
                            {client.company}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getSourceBadgeColor(client.source)}>
                          {client.source}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(client.createdAt), "dd/MM/yyyy", { locale: fr })}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedClient(client)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClient(client)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClient(client.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog d'édition */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier le client</DialogTitle>
          </DialogHeader>
          <ClientForm isEdit />
        </DialogContent>
      </Dialog>

      {/* Dialog de détails client */}
      {selectedClient && (
        <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                Détails du client - {selectedClient.firstName} {selectedClient.lastName}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label>Nom complet</Label>
                    <p>{selectedClient.firstName} {selectedClient.lastName}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p>{selectedClient.email}</p>
                  </div>
                  {selectedClient.phoneNumber && (
                    <div>
                      <Label>Téléphone</Label>
                      <p>{selectedClient.phoneNumber}</p>
                    </div>
                  )}
                  {selectedClient.company && (
                    <div>
                      <Label>Entreprise</Label>
                      <p>{selectedClient.company}</p>
                    </div>
                  )}
                  {selectedClient.address && (
                    <div>
                      <Label>Adresse</Label>
                      <p>{selectedClient.address}</p>
                    </div>
                  )}
                  {selectedClient.notes && (
                    <div>
                      <Label>Notes</Label>
                      <p className="text-sm text-gray-600">{selectedClient.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Historique des devis ({clientQuotes.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {clientQuotes.length > 0 ? (
                    <div className="space-y-3">
                      {clientQuotes.slice(0, 5).map((quote: any) => (
                        <div key={quote.id} className="flex justify-between items-center p-3 border rounded">
                          <div>
                            <div className="font-medium">Devis #{quote.quoteNumber}</div>
                            <div className="text-sm text-gray-600">
                              {format(new Date(quote.createdAt), "dd/MM/yyyy", { locale: fr })}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{quote.totalTTC} $CA</div>
                            <Badge variant={
                              quote.status === 'accepted' ? 'default' :
                              quote.status === 'sent' ? 'secondary' :
                              quote.status === 'rejected' ? 'destructive' : 'outline'
                            }>
                              {quote.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      {clientQuotes.length > 5 && (
                        <p className="text-sm text-gray-500">
                          et {clientQuotes.length - 5} devis de plus...
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500">Aucun devis pour ce client</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
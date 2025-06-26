import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Plus, Search, Edit, Trash2, FileText, Send, Eye,
  Calculator, User, Calendar, DollarSign, MapPin, Users
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
  company?: string;
}

interface Quote {
  id: number;
  quoteNumber: string;
  clientId?: number;
  userId?: number;
  status: string;
  validityDate: string;
  eventDate?: string;
  eventLocation?: string;
  guestCount?: number;
  budget?: string;
  items: QuoteItem[];
  subtotalHT: string;
  discountAmount: string;
  taxAmount: string;
  totalTTC: string;
  notes?: string;
  internalNotes?: string;
  createdAt: string;
  sentAt?: string;
  acceptedAt?: string;
}

interface QuoteItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface QuoteFormData {
  clientId: string;
  eventDate: string;
  eventLocation: string;
  guestCount: string;
  budget: string;
  validityDate: string;
  items: QuoteItem[];
  discountAmount: string;
  notes: string;
  internalNotes: string;
}

export function QuoteManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [formData, setFormData] = useState<QuoteFormData>({
    clientId: "",
    eventDate: "",
    eventLocation: "",
    guestCount: "",
    budget: "",
    validityDate: "",
    items: [{ description: "", quantity: 1, unitPrice: 0, total: 0 }],
    discountAmount: "0",
    notes: "",
    internalNotes: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Récupérer les devis
  const { data: quotes = [], isLoading } = useQuery({
    queryKey: ["quotes", searchTerm, statusFilter],
    queryFn: async () => {
      let url = '/api/quotes';
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des devis');
      }
      return response.json();
    },
  });

  // Récupérer les clients pour la sélection
  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const response = await fetch('/api/clients');
      if (!response.ok) return [];
      return response.json();
    },
  });

  // Récupérer les paramètres de l'entreprise
  const { data: companySettings } = useQuery({
    queryKey: ["company-settings"],
    queryFn: async () => {
      const response = await fetch('/api/company-settings');
      if (!response.ok) return null;
      return response.json();
    },
  });

  // Créer un devis
  const createQuoteMutation = useMutation({
    mutationFn: async (quoteData: any) => {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteData),
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la création du devis');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Devis créé avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      setIsCreateDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la création du devis",
        variant: "destructive",
      });
    },
  });

  // Modifier un devis
  const updateQuoteMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await fetch(`/api/quotes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la modification du devis');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Devis modifié avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      setIsEditDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la modification du devis",
        variant: "destructive",
      });
    },
  });

  // Envoyer un devis
  const sendQuoteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/quotes/${id}/send`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du devis');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Devis envoyé avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'envoi du devis",
        variant: "destructive",
      });
    },
  });

  // Supprimer un devis
  const deleteQuoteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/quotes/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du devis');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Devis supprimé avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression du devis",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      clientId: "",
      eventDate: "",
      eventLocation: "",
      guestCount: "",
      budget: "",
      validityDate: "",
      items: [{ description: "", quantity: 1, unitPrice: 0, total: 0 }],
      discountAmount: "0",
      notes: "",
      internalNotes: ""
    });
    setSelectedQuote(null);
  };

  const addQuoteItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: "", quantity: 1, unitPrice: 0, total: 0 }]
    });
  };

  const removeQuoteItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData({
        ...formData,
        items: formData.items.filter((_, i) => i !== index)
      });
    }
  };

  const updateQuoteItem = (index: number, field: keyof QuoteItem, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Recalculer le total de la ligne
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }
    
    setFormData({ ...formData, items: newItems });
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = parseFloat(formData.discountAmount) || 0;
    const subtotalAfterDiscount = subtotal - discount;
    const tax = subtotalAfterDiscount * 0.14975; // TPS + TVQ Québec
    return subtotalAfterDiscount + tax;
  };

  const handleCreateQuote = () => {
    const subtotal = calculateSubtotal();
    const discount = parseFloat(formData.discountAmount) || 0;
    const validityDate = formData.validityDate || 
      new Date(Date.now() + (companySettings?.defaultQuoteValidity || 30) * 24 * 60 * 60 * 1000)
        .toISOString().split('T')[0];

    const quoteData = {
      clientId: parseInt(formData.clientId),
      eventDate: formData.eventDate || null,
      eventLocation: formData.eventLocation || null,
      guestCount: parseInt(formData.guestCount) || null,
      budget: formData.budget || null,
      validityDate,
      items: formData.items,
      subtotalHT: subtotal.toFixed(2),
      discountAmount: discount.toFixed(2),
      notes: formData.notes || null,
      internalNotes: formData.internalNotes || null,
    };

    createQuoteMutation.mutate(quoteData);
  };

  const handleEditQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    setFormData({
      clientId: quote.clientId?.toString() || "",
      eventDate: quote.eventDate || "",
      eventLocation: quote.eventLocation || "",
      guestCount: quote.guestCount?.toString() || "",
      budget: quote.budget || "",
      validityDate: quote.validityDate,
      items: quote.items || [{ description: "", quantity: 1, unitPrice: 0, total: 0 }],
      discountAmount: quote.discountAmount,
      notes: quote.notes || "",
      internalNotes: quote.internalNotes || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateQuote = () => {
    if (!selectedQuote) return;
    
    const subtotal = calculateSubtotal();
    const discount = parseFloat(formData.discountAmount) || 0;

    const quoteData = {
      clientId: parseInt(formData.clientId),
      eventDate: formData.eventDate || null,
      eventLocation: formData.eventLocation || null,
      guestCount: parseInt(formData.guestCount) || null,
      budget: formData.budget || null,
      validityDate: formData.validityDate,
      items: formData.items,
      subtotalHT: subtotal.toFixed(2),
      discountAmount: discount.toFixed(2),
      notes: formData.notes || null,
      internalNotes: formData.internalNotes || null,
    };

    updateQuoteMutation.mutate({ id: selectedQuote.id, data: quoteData });
  };

  const handleDeleteQuote = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce devis ?")) {
      deleteQuoteMutation.mutate(id);
    }
  };

  const handleSendQuote = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir envoyer ce devis au client ?")) {
      sendQuoteMutation.mutate(id);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getClientName = (clientId?: number) => {
    const client = clients.find((c: Client) => c.id === clientId);
    return client ? `${client.firstName} ${client.lastName}` : 'Client non trouvé';
  };

  const QuoteForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
      {/* Informations client et événement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="clientId">Client *</Label>
          <Select value={formData.clientId} onValueChange={(value) => setFormData({ ...formData, clientId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client: Client) => (
                <SelectItem key={client.id} value={client.id.toString()}>
                  {client.firstName} {client.lastName}
                  {client.company && ` - ${client.company}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="validityDate">Date de validité *</Label>
          <Input
            id="validityDate"
            type="date"
            value={formData.validityDate}
            onChange={(e) => setFormData({ ...formData, validityDate: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="eventDate">Date de l'événement</Label>
          <Input
            id="eventDate"
            type="date"
            value={formData.eventDate}
            onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="guestCount">Nombre d'invités</Label>
          <Input
            id="guestCount"
            type="number"
            value={formData.guestCount}
            onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
            placeholder="50"
          />
        </div>

        <div>
          <Label htmlFor="eventLocation">Lieu de l'événement</Label>
          <Input
            id="eventLocation"
            value={formData.eventLocation}
            onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })}
            placeholder="Adresse de l'événement"
          />
        </div>

        <div>
          <Label htmlFor="budget">Budget estimé (optionnel)</Label>
          <Input
            id="budget"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            placeholder="1500 CAD"
          />
        </div>
      </div>

      {/* Articles du devis */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <Label className="text-lg font-semibold">Articles du devis</Label>
          <Button type="button" variant="outline" size="sm" onClick={addQuoteItem}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un article
          </Button>
        </div>

        <div className="space-y-3">
          {formData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-end p-3 border rounded">
              <div className="col-span-5">
                <Label>Description</Label>
                <Input
                  value={item.description}
                  onChange={(e) => updateQuoteItem(index, 'description', e.target.value)}
                  placeholder="Description de l'article"
                />
              </div>
              <div className="col-span-2">
                <Label>Quantité</Label>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateQuoteItem(index, 'quantity', parseInt(e.target.value) || 0)}
                  min="1"
                />
              </div>
              <div className="col-span-2">
                <Label>Prix unitaire</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) => updateQuoteItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="col-span-2">
                <Label>Total</Label>
                <Input
                  value={item.total.toFixed(2)}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              <div className="col-span-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeQuoteItem(index)}
                  disabled={formData.items.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Calculs */}
        <div className="mt-4 p-4 bg-gray-50 rounded space-y-2">
          <div className="flex justify-between">
            <span>Sous-total HT:</span>
            <span className="font-medium">{calculateSubtotal().toFixed(2)} CAD</span>
          </div>
          <div className="flex justify-between items-center">
            <Label htmlFor="discount">Remise:</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="discount"
                type="number"
                step="0.01"
                value={formData.discountAmount}
                onChange={(e) => setFormData({ ...formData, discountAmount: e.target.value })}
                className="w-24"
              />
              <span>CAD</span>
            </div>
          </div>
          <div className="flex justify-between">
            <span>Taxes (TPS + TVQ):</span>
            <span className="font-medium">
              {((calculateSubtotal() - parseFloat(formData.discountAmount || "0")) * 0.14975).toFixed(2)} CAD
            </span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>Total TTC:</span>
            <span>{calculateTotal().toFixed(2)} CAD</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="notes">Notes pour le client</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Informations complémentaires pour le client"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="internalNotes">Notes internes</Label>
          <Textarea
            id="internalNotes"
            value={formData.internalNotes}
            onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
            placeholder="Notes internes (non visibles par le client)"
            rows={3}
          />
        </div>
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
          onClick={isEdit ? handleUpdateQuote : handleCreateQuote}
          disabled={!formData.clientId || formData.items.length === 0}
        >
          {isEdit ? "Modifier" : "Créer"}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des Devis</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Devis
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl">
            <DialogHeader>
              <DialogTitle>Créer un nouveau devis</DialogTitle>
            </DialogHeader>
            <QuoteForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Rechercher par numéro ou client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="draft">Brouillon</SelectItem>
                <SelectItem value="sent">Envoyé</SelectItem>
                <SelectItem value="accepted">Accepté</SelectItem>
                <SelectItem value="rejected">Rejeté</SelectItem>
                <SelectItem value="expired">Expiré</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des devis */}
      <Card>
        <CardHeader>
          <CardTitle>
            Liste des Devis ({quotes.length})
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
                    <TableHead>Numéro</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Événement</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Validité</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotes.map((quote: Quote) => (
                    <TableRow key={quote.id}>
                      <TableCell>
                        <div className="font-medium">{quote.quoteNumber}</div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(quote.createdAt), "dd/MM/yyyy", { locale: fr })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          {getClientName(quote.clientId)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {quote.eventDate && (
                            <div className="flex items-center text-sm">
                              <Calendar className="mr-1 h-3 w-3" />
                              {format(new Date(quote.eventDate), "dd/MM/yyyy", { locale: fr })}
                            </div>
                          )}
                          {quote.guestCount && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Users className="mr-1 h-3 w-3" />
                              {quote.guestCount} invités
                            </div>
                          )}
                          {quote.eventLocation && (
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="mr-1 h-3 w-3" />
                              <span className="truncate max-w-xs">{quote.eventLocation}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{quote.totalTTC} CAD</div>
                        <div className="text-sm text-gray-500">HT: {quote.subtotalHT} CAD</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(quote.status)}>
                          {quote.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className={`text-sm ${
                          new Date(quote.validityDate) < new Date() ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {format(new Date(quote.validityDate), "dd/MM/yyyy", { locale: fr })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedQuote(quote)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditQuote(quote)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {quote.status === 'draft' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSendQuote(quote.id)}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteQuote(quote.id)}
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
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>Modifier le devis</DialogTitle>
          </DialogHeader>
          <QuoteForm isEdit />
        </DialogContent>
      </Dialog>

      {/* Dialog de prévisualisation */}
      {selectedQuote && (
        <Dialog open={!!selectedQuote} onOpenChange={() => setSelectedQuote(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                Devis #{selectedQuote.quoteNumber}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* En-tête du devis */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Informations client</h3>
                  <p>{getClientName(selectedQuote.clientId)}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Informations devis</h3>
                  <p>Numéro: {selectedQuote.quoteNumber}</p>
                  <p>Créé le: {format(new Date(selectedQuote.createdAt), "dd/MM/yyyy", { locale: fr })}</p>
                  <p>Valable jusqu'au: {format(new Date(selectedQuote.validityDate), "dd/MM/yyyy", { locale: fr })}</p>
                </div>
              </div>

              {/* Détails de l'événement */}
              {(selectedQuote.eventDate || selectedQuote.eventLocation || selectedQuote.guestCount) && (
                <div>
                  <h3 className="font-semibold mb-2">Détails de l'événement</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {selectedQuote.eventDate && (
                      <div>
                        <Label>Date</Label>
                        <p>{format(new Date(selectedQuote.eventDate), "dd/MM/yyyy", { locale: fr })}</p>
                      </div>
                    )}
                    {selectedQuote.guestCount && (
                      <div>
                        <Label>Nombre d'invités</Label>
                        <p>{selectedQuote.guestCount}</p>
                      </div>
                    )}
                    {selectedQuote.eventLocation && (
                      <div>
                        <Label>Lieu</Label>
                        <p>{selectedQuote.eventLocation}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Articles */}
              <div>
                <h3 className="font-semibold mb-2">Articles</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Quantité</TableHead>
                      <TableHead>Prix unitaire</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedQuote.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.unitPrice.toFixed(2)} CAD</TableCell>
                        <TableCell>{item.total.toFixed(2)} CAD</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Totaux */}
              <div className="border-t pt-4">
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between">
                      <span>Sous-total HT:</span>
                      <span>{selectedQuote.subtotalHT} CAD</span>
                    </div>
                    {parseFloat(selectedQuote.discountAmount) > 0 && (
                      <div className="flex justify-between">
                        <span>Remise:</span>
                        <span>-{selectedQuote.discountAmount} CAD</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Taxes:</span>
                      <span>{selectedQuote.taxAmount} CAD</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total TTC:</span>
                      <span>{selectedQuote.totalTTC} CAD</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedQuote.notes && (
                <div>
                  <h3 className="font-semibold mb-2">Notes</h3>
                  <p className="text-sm text-gray-600">{selectedQuote.notes}</p>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Générer PDF
                </Button>
                {selectedQuote.status === 'draft' && (
                  <Button onClick={() => handleSendQuote(selectedQuote.id)}>
                    <Send className="mr-2 h-4 w-4" />
                    Envoyer au client
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
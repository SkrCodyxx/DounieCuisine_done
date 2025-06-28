import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Package, AlertTriangle, TrendingDown } from "lucide-react";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
  costPerUnit: string;
  supplier: string;
  lastOrderDate: string;
  expirationDate: string;
  location: string;
  isCritical: boolean;
}

export function InventoryManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: inventoryItems, isLoading } = useQuery({
    queryKey: ["inventory"],
    queryFn: async () => {
      const response = await fetch("/api/admin/inventory");
      if (!response.ok) throw new Error("Échec de la récupération de l'inventaire");
      return response.json();
    },
  });

  const createItemMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Échec de la création de l'article d'inventaire");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      setIsCreateDialogOpen(false);
      toast({ title: "Article d'inventaire créé avec succès" });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur de Création",
        description: error.message || "Une erreur est survenue lors de la création de l'article.",
        variant: "destructive",
      });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await fetch(`/api/admin/inventory/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Échec de la mise à jour de l'article d'inventaire" }));
        throw new Error(errorData.message || "Échec de la mise à jour de l'article d'inventaire");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      setEditingItem(null);
      toast({ title: "Article d'inventaire mis à jour avec succès" });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur de Modification",
        description: error.message || "Une erreur est survenue lors de la modification de l'article.",
        variant: "destructive",
      });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/inventory/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Échec de la suppression de l'article d'inventaire" }));
        throw new Error(errorData.message || "Échec de la suppression de l'article d'inventaire");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast({ title: "Article d'inventaire supprimé avec succès" });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur de Suppression",
        description: error.message || "Une erreur est survenue lors de la suppression de l'article.",
        variant: "destructive",
      });
    },
  });

  const categories = [
    { value: "all", label: "Toutes les catégories" },
    { value: "ingredients", label: "Ingrédients" },
    { value: "meat", label: "Viandes" },
    { value: "vegetables", label: "Légumes" },
    { value: "spices", label: "Épices" },
    { value: "beverages", label: "Boissons" },
    { value: "supplies", label: "Fournitures" },
  ];

  const InventoryItemForm = ({ item, onSubmit, onCancel }: any) => {
    const [formData, setFormData] = useState({
      name: item?.name || "",
      category: item?.category || "",
      currentStock: item?.currentStock || 0,
      minimumStock: item?.minimumStock || 0,
      unit: item?.unit || "",
      costPerUnit: item?.costPerUnit || "",
      supplier: item?.supplier || "",
      lastOrderDate: item?.lastOrderDate || "",
      expirationDate: item?.expirationDate || "",
      location: item?.location || "",
      isCritical: item?.isCritical || false,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom de l'article</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.slice(1).map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="currentStock">Stock actuel</Label>
            <Input
              id="currentStock"
              type="number"
              min="0"
              value={formData.currentStock}
              onChange={(e) => setFormData({ ...formData, currentStock: parseInt(e.target.value) || 0 })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minimumStock">Stock minimum</Label>
            <Input
              id="minimumStock"
              type="number"
              min="0"
              value={formData.minimumStock}
              onChange={(e) => setFormData({ ...formData, minimumStock: parseInt(e.target.value) || 0 })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit">Unité</Label>
            <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">Kilogrammes</SelectItem>
                <SelectItem value="lbs">Livres</SelectItem>
                <SelectItem value="pieces">Pièces</SelectItem>
                <SelectItem value="bottles">Bouteilles</SelectItem>
                <SelectItem value="liters">Litres</SelectItem>
                <SelectItem value="boxes">Boîtes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="costPerUnit">Coût par unité ($)</Label>
            <Input
              id="costPerUnit"
              type="number"
              step="0.01"
              min="0"
              value={formData.costPerUnit}
              onChange={(e) => setFormData({ ...formData, costPerUnit: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="supplier">Fournisseur</Label>
            <Input
              id="supplier"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="lastOrderDate">Dernière commande</Label>
            <Input
              id="lastOrderDate"
              type="date"
              value={formData.lastOrderDate}
              onChange={(e) => setFormData({ ...formData, lastOrderDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expirationDate">Date d'expiration</Label>
            <Input
              id="expirationDate"
              type="date"
              value={formData.expirationDate}
              onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Emplacement</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Réfrigérateur, garde-manger, etc."
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isCritical"
              checked={formData.isCritical}
              onCheckedChange={(checked) => setFormData({ ...formData, isCritical: checked })}
            />
            <Label htmlFor="isCritical">Article critique</Label>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            {item ? "Mettre à jour" : "Créer"}
          </Button>
        </div>
      </form>
    );
  };

  const isLowStock = (item: InventoryItem) => item.currentStock <= item.minimumStock;
  const isExpiringSoon = (item: InventoryItem) => {
    if (!item.expirationDate) return false;
    const today = new Date();
    const expDate = new Date(item.expirationDate);
    const daysUntilExpiry = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
  };

  const filteredItems = inventoryItems?.filter((item: InventoryItem) => {
    const categoryMatch = selectedCategory === "all" || item.category === selectedCategory;
    const criticalMatch = !showCriticalOnly || item.isCritical || isLowStock(item) || isExpiringSoon(item);
    return categoryMatch && criticalMatch;
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Chargement de l'inventaire...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Gestion de l'inventaire</h1>
            <p className="text-muted-foreground">
              Gérez le stock et les fournitures
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvel article
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Créer un nouvel article</DialogTitle>
                <DialogDescription>
                  Ajoutez un article à l'inventaire
                </DialogDescription>
              </DialogHeader>
              <InventoryItemForm
                onSubmit={(data: any) => createItemMutation.mutate(data)}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="category-filter">Catégorie:</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="critical-filter"
              checked={showCriticalOnly}
              onCheckedChange={setShowCriticalOnly}
            />
            <Label htmlFor="critical-filter">Montrer seulement les articles critiques</Label>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems?.map((item: InventoryItem) => (
            <Card key={item.id} className={`hover:shadow-md transition-shadow ${isLowStock(item) ? 'border-red-200 bg-red-50' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <CardDescription className="capitalize">{item.category}</CardDescription>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    {isLowStock(item) && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Stock bas
                      </Badge>
                    )}
                    {isExpiringSoon(item) && (
                      <Badge variant="outline" className="text-amber-600 text-xs">
                        Expire bientôt
                      </Badge>
                    )}
                    {item.isCritical && (
                      <Badge variant="outline" className="text-purple-600 text-xs">
                        Critique
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="font-medium text-muted-foreground">Stock actuel</p>
                      <p className={`text-lg font-bold ${isLowStock(item) ? 'text-red-600' : 'text-green-600'}`}>
                        {item.currentStock} {item.unit}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Stock minimum</p>
                      <p className="text-lg">{item.minimumStock} {item.unit}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="font-medium text-muted-foreground">Coût/unité</p>
                      <p>{item.costPerUnit} $CA</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Valeur totale</p>
                      <p>{(parseFloat(item.costPerUnit) * item.currentStock).toFixed(2)} $CA</p>
                    </div>
                  </div>

                  {item.supplier && (
                    <div>
                      <p className="font-medium text-muted-foreground text-sm">Fournisseur</p>
                      <p className="text-sm">{item.supplier}</p>
                    </div>
                  )}

                  {item.location && (
                    <div>
                      <p className="font-medium text-muted-foreground text-sm">Emplacement</p>
                      <p className="text-sm">{item.location}</p>
                    </div>
                  )}

                  {item.expirationDate && (
                    <div>
                      <p className="font-medium text-muted-foreground text-sm">Expiration</p>
                      <p className={`text-sm ${isExpiringSoon(item) ? 'text-amber-600 font-medium' : ''}`}>
                        {new Date(item.expirationDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2 pt-2">
                    <Dialog open={editingItem?.id === item.id} onOpenChange={(open) => !open && setEditingItem(null)}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setEditingItem(item)}>
                          <Edit className="w-4 h-4 mr-1" />
                          Modifier
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Modifier l'article</DialogTitle>
                          <DialogDescription>
                            Modifiez les détails de {item.name}
                          </DialogDescription>
                        </DialogHeader>
                        <InventoryItemForm
                          item={item}
                          onSubmit={(data: any) => updateItemMutation.mutate({ id: item.id, data })}
                          onCancel={() => setEditingItem(null)}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteItemMutation.mutate(item.id)}
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

        {filteredItems?.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {showCriticalOnly ? "Aucun article critique" : "Aucun article en inventaire"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {showCriticalOnly 
                    ? "Tous vos articles sont en bon état" 
                    : "Commencez par ajouter des articles à votre inventaire"
                  }
                </p>
                {!showCriticalOnly && (
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un article
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
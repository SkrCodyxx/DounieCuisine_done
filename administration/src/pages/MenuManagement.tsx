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
import { Plus, Edit, Trash2, Utensils, DollarSign, Clock } from "lucide-react";

interface MenuItem {
  id: number;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  category: string;
  price: string;
  isAvailable: boolean;
  isFestive: boolean;
  festiveTheme: string;
  allergies: string[];
  ingredients: string[];
  preparationTime: number;
  calories: number;
}

export function MenuManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: menuItems, isLoading } = useQuery({
    queryKey: ["menu-items"],
    queryFn: async () => {
      const response = await fetch("/api/menu");
      if (!response.ok) throw new Error("Failed to fetch menu items");
      return response.json();
    },
  });

  const createItemMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/admin/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create menu item");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      setIsCreateDialogOpen(false);
      toast({ title: "Article du menu créé avec succès" });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await fetch(`/api/admin/menu/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update menu item");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      setEditingItem(null);
      toast({ title: "Article du menu mis à jour avec succès" });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/menu/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete menu item");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      toast({ title: "Article du menu supprimé avec succès" });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const categories = [
    { value: "all", label: "Toutes les catégories" },
    { value: "entrees", label: "Entrées" },
    { value: "plats", label: "Plats principaux" },
    { value: "desserts", label: "Desserts" },
    { value: "boissons", label: "Boissons" },
    { value: "cocktails", label: "Cocktails" },
  ];

  const MenuItemForm = ({ item, onSubmit, onCancel }: any) => {
    const [formData, setFormData] = useState({
      name: item?.name || "",
      nameEn: item?.nameEn || "",
      description: item?.description || "",
      descriptionEn: item?.descriptionEn || "",
      category: item?.category || "",
      price: item?.price || "",
      isAvailable: item?.isAvailable ?? true,
      isFestive: item?.isFestive ?? false,
      festiveTheme: item?.festiveTheme || "",
      allergies: item?.allergies?.join(", ") || "",
      ingredients: item?.ingredients?.join(", ") || "",
      preparationTime: item?.preparationTime || "",
      calories: item?.calories || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const submitData = {
        ...formData,
        allergies: formData.allergies.split(",").map(s => s.trim()).filter(Boolean),
        ingredients: formData.ingredients.split(",").map(s => s.trim()).filter(Boolean),
        preparationTime: formData.preparationTime ? parseInt(formData.preparationTime) : null,
        calories: formData.calories ? parseInt(formData.calories) : null,
      };
      onSubmit(submitData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom (Français)</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nameEn">Nom (Anglais)</Label>
            <Input
              id="nameEn"
              value={formData.nameEn}
              onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description (Français)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descriptionEn">Description (Anglais)</Label>
            <Textarea
              id="descriptionEn"
              value={formData.descriptionEn}
              onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entrees">Entrées</SelectItem>
                <SelectItem value="plats">Plats principaux</SelectItem>
                <SelectItem value="desserts">Desserts</SelectItem>
                <SelectItem value="boissons">Boissons</SelectItem>
                <SelectItem value="cocktails">Cocktails</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Prix ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preparationTime">Temps de préparation (min)</Label>
            <Input
              id="preparationTime"
              type="number"
              value={formData.preparationTime}
              onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="allergies">Allergènes (séparés par des virgules)</Label>
            <Input
              id="allergies"
              value={formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              placeholder="Gluten, Lactose, Noix..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ingredients">Ingrédients (séparés par des virgules)</Label>
            <Input
              id="ingredients"
              value={formData.ingredients}
              onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
              placeholder="Poulet, Riz, Épices..."
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="calories">Calories</Label>
            <Input
              id="calories"
              type="number"
              value={formData.calories}
              onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isAvailable"
              checked={formData.isAvailable}
              onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked })}
            />
            <Label htmlFor="isAvailable">Disponible</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isFestive"
              checked={formData.isFestive}
              onCheckedChange={(checked) => setFormData({ ...formData, isFestive: checked })}
            />
            <Label htmlFor="isFestive">Article festif</Label>
          </div>
        </div>

        {formData.isFestive && (
          <div className="space-y-2">
            <Label htmlFor="festiveTheme">Thème festif</Label>
            <Input
              id="festiveTheme"
              value={formData.festiveTheme}
              onChange={(e) => setFormData({ ...formData, festiveTheme: e.target.value })}
              placeholder="Noël, Carnaval, Fête nationale..."
            />
          </div>
        )}

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

  const filteredItems = menuItems?.filter((item: MenuItem) => 
    selectedCategory === "all" || item.category === selectedCategory
  );

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Chargement du menu...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Gestion du menu</h1>
            <p className="text-muted-foreground">
              Gérez les articles du menu et leurs détails
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvel article
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Créer un nouvel article</DialogTitle>
                <DialogDescription>
                  Ajoutez un nouveau plat au menu
                </DialogDescription>
              </DialogHeader>
              <MenuItemForm
                onSubmit={(data: any) => createItemMutation.mutate(data)}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center space-x-4">
          <Label htmlFor="category-filter">Filtrer par catégorie:</Label>
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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems?.map((item: MenuItem) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    {item.nameEn && (
                      <CardDescription className="italic">{item.nameEn}</CardDescription>
                    )}
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge variant={item.isAvailable ? "default" : "secondary"}>
                      {item.isAvailable ? "Disponible" : "Indisponible"}
                    </Badge>
                    {item.isFestive && (
                      <Badge variant="outline" className="text-purple-600">
                        Festif
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                    <span className="font-semibold">{item.price}$</span>
                  </div>
                  {item.preparationTime && (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-blue-600" />
                      <span>{item.preparationTime} min</span>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-muted-foreground">Catégorie:</span>
                    <span className="ml-1 capitalize">{item.category}</span>
                  </div>
                  {item.calories && (
                    <div>
                      <span className="font-medium text-muted-foreground">Calories:</span>
                      <span className="ml-1">{item.calories}</span>
                    </div>
                  )}
                </div>

                {item.allergies?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Allergènes:</p>
                    <div className="flex flex-wrap gap-1">
                      {item.allergies.map((allergy, index) => (
                        <Badge key={index} variant="outline" className="text-xs text-red-600">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <Dialog open={editingItem?.id === item.id} onOpenChange={(open) => !open && setEditingItem(null)}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setEditingItem(item)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Modifier
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Modifier l'article</DialogTitle>
                        <DialogDescription>
                          Modifiez les détails de {item.name}
                        </DialogDescription>
                      </DialogHeader>
                      <MenuItemForm
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
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems?.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Utensils className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {selectedCategory === "all" ? "Aucun article au menu" : "Aucun article dans cette catégorie"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  Commencez par ajouter des plats à votre menu
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un article
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
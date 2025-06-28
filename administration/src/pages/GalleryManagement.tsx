import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  Plus, Search, Edit, Trash2, Upload, Eye, Image as ImageIcon,
  FolderPlus, Move, ArrowUp, ArrowDown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Gallery {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface GalleryImage {
  id: number;
  galleryId?: number;
  title?: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  sortOrder: number;
  isActive: boolean;
  uploadedBy: number;
  createdAt: string;
  updatedAt: string;
}

interface GalleryFormData {
  name: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
}

interface ImageFormData {
  galleryId: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  isActive: boolean;
  sortOrder: number;
}

export function GalleryManagement() {
  const [activeTab, setActiveTab] = useState("galleries");
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isGalleryDialogOpen, setIsGalleryDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [galleryFormData, setGalleryFormData] = useState<GalleryFormData>({
    name: "",
    description: "",
    isActive: true,
    sortOrder: 0
  });
  const [imageFormData, setImageFormData] = useState<ImageFormData>({
    galleryId: "",
    title: "",
    description: "",
    imageUrl: "",
    thumbnailUrl: "",
    isActive: true,
    sortOrder: 0
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Récupérer les galeries
  const { data: galleries = [], isLoading: isLoadingGalleries } = useQuery({
    queryKey: ["galleries"],
    queryFn: async () => {
      const response = await fetch('/api/galleries');
      if (!response.ok) {
        throw new Error('Échec du chargement des galeries');
      }
      return response.json();
    },
  });

  // Récupérer les images
  const { data: images = [], isLoading: isLoadingImages } = useQuery({
    queryKey: ["gallery-images", selectedGallery?.id],
    queryFn: async () => {
      const url = selectedGallery?.id 
        ? `/api/gallery-images?galleryId=${selectedGallery.id}`
        : '/api/gallery-images';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Échec du chargement des images de la galerie');
      }
      return response.json();
    },
  });

  // Créer une galerie
  const createGalleryMutation = useMutation({
    mutationFn: async (galleryData: GalleryFormData) => {
      const response = await fetch('/api/galleries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(galleryData),
      });
      if (!response.ok) {
        throw new Error('Échec de la création de la galerie');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Galerie créée avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
      setIsGalleryDialogOpen(false);
      resetGalleryForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur de Création de Galerie",
        description: error.message || "Une erreur est survenue lors de la création de la galerie.",
        variant: "destructive",
      });
    },
  });

  // Modifier une galerie
  const updateGalleryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<GalleryFormData> }) => {
      const response = await fetch(`/api/galleries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Échec de la modification de la galerie" }));
        throw new Error(errorData.message || "Échec de la modification de la galerie");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Galerie modifiée avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
      setIsGalleryDialogOpen(false);
      resetGalleryForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur de Modification de Galerie",
        description: error.message || "Une erreur est survenue lors de la modification de la galerie.",
        variant: "destructive",
      });
    },
  });

  // Supprimer une galerie
  const deleteGalleryMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/galleries/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Échec de la suppression de la galerie" }));
        throw new Error(errorData.message || "Échec de la suppression de la galerie");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Galerie supprimée avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur de Suppression de Galerie",
        description: error.message || "Une erreur est survenue lors de la suppression de la galerie.",
        variant: "destructive",
      });
    },
  });

  // Créer une image
  const createImageMutation = useMutation({
    mutationFn: async (imageData: Omit<ImageFormData, 'galleryId'> & { galleryId: number }) => {
      const response = await fetch('/api/gallery-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(imageData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Échec de l'ajout de l'image" }));
        throw new Error(errorData.message || "Échec de l'ajout de l'image");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Image ajoutée avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["gallery-images"] });
      setIsImageDialogOpen(false);
      resetImageForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur d'Ajout d'Image",
        description: error.message || "Une erreur est survenue lors de l'ajout de l'image.",
        variant: "destructive",
      });
    },
  });

  // Modifier une image
  const updateImageMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<ImageFormData> }) => {
      const response = await fetch(`/api/gallery-images/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Échec de la modification de l'image" }));
        throw new Error(errorData.message || "Échec de la modification de l'image");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Image modifiée avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["gallery-images"] });
      setIsImageDialogOpen(false);
      resetImageForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur de Modification d'Image",
        description: error.message || "Une erreur est survenue lors de la modification de l'image.",
        variant: "destructive",
      });
    },
  });

  // Supprimer une image
  const deleteImageMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/gallery-images/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Échec de la suppression de l'image" }));
        throw new Error(errorData.message || "Échec de la suppression de l'image");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Image supprimée avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["gallery-images"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur de Suppression d'Image",
        description: error.message || "Une erreur est survenue lors de la suppression de l'image.",
        variant: "destructive",
      });
    },
  });

  const resetGalleryForm = () => {
    setGalleryFormData({
      name: "",
      description: "",
      isActive: true,
      sortOrder: 0
    });
    setSelectedGallery(null);
    setIsEditMode(false);
  };

  const resetImageForm = () => {
    setImageFormData({
      galleryId: "",
      title: "",
      description: "",
      imageUrl: "",
      thumbnailUrl: "",
      isActive: true,
      sortOrder: 0
    });
    setSelectedImage(null);
    setIsEditMode(false);
  };

  const handleCreateGallery = () => {
    createGalleryMutation.mutate(galleryFormData);
  };

  const handleUpdateGallery = () => {
    if (!selectedGallery) return;
    updateGalleryMutation.mutate({ id: selectedGallery.id, data: galleryFormData });
  };

  const handleEditGallery = (gallery: Gallery) => {
    setSelectedGallery(gallery);
    setGalleryFormData({
      name: gallery.name,
      description: gallery.description || "",
      isActive: gallery.isActive,
      sortOrder: gallery.sortOrder
    });
    setIsEditMode(true);
    setIsGalleryDialogOpen(true);
  };

  const handleDeleteGallery = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette galerie ? Toutes les images associées seront également supprimées.")) {
      deleteGalleryMutation.mutate(id);
    }
  };

  const handleCreateImage = () => {
    if (!imageFormData.galleryId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une galerie",
        variant: "destructive",
      });
      return;
    }
    
    createImageMutation.mutate({
      ...imageFormData,
      galleryId: parseInt(imageFormData.galleryId)
    });
  };

  const handleUpdateImage = () => {
    if (!selectedImage) return;
    const updateData = { ...imageFormData };
    if (updateData.galleryId) {
      updateData.galleryId = parseInt(updateData.galleryId);
    }
    updateImageMutation.mutate({ id: selectedImage.id, data: updateData });
  };

  const handleEditImage = (image: GalleryImage) => {
    setSelectedImage(image);
    setImageFormData({
      galleryId: image.galleryId?.toString() || "",
      title: image.title || "",
      description: image.description || "",
      imageUrl: image.imageUrl,
      thumbnailUrl: image.thumbnailUrl || "",
      isActive: image.isActive,
      sortOrder: image.sortOrder
    });
    setIsEditMode(true);
    setIsImageDialogOpen(true);
  };

  const handleDeleteImage = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) {
      deleteImageMutation.mutate(id);
    }
  };

  const GalleryForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="galleryName">Nom de la galerie *</Label>
        <Input
          id="galleryName"
          value={galleryFormData.name}
          onChange={(e) => setGalleryFormData({ ...galleryFormData, name: e.target.value })}
          placeholder="Nom de la galerie"
        />
      </div>

      <div>
        <Label htmlFor="galleryDescription">Description</Label>
        <Textarea
          id="galleryDescription"
          value={galleryFormData.description}
          onChange={(e) => setGalleryFormData({ ...galleryFormData, description: e.target.value })}
          placeholder="Description de la galerie"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="gallerySortOrder">Ordre d'affichage</Label>
          <Input
            id="gallerySortOrder"
            type="number"
            value={galleryFormData.sortOrder}
            onChange={(e) => setGalleryFormData({ ...galleryFormData, sortOrder: parseInt(e.target.value) || 0 })}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="galleryActive"
            checked={galleryFormData.isActive}
            onCheckedChange={(checked) => setGalleryFormData({ ...galleryFormData, isActive: checked })}
          />
          <Label htmlFor="galleryActive">Galerie active</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => {
            setIsGalleryDialogOpen(false);
            resetGalleryForm();
          }}
        >
          Annuler
        </Button>
        <Button
          onClick={isEditMode ? handleUpdateGallery : handleCreateGallery}
          disabled={!galleryFormData.name}
        >
          {isEditMode ? "Modifier" : "Créer"}
        </Button>
      </div>
    </div>
  );

  const ImageForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="imageGallery">Galerie *</Label>
        <Select 
          value={imageFormData.galleryId} 
          onValueChange={(value) => setImageFormData({ ...imageFormData, galleryId: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une galerie" />
          </SelectTrigger>
          <SelectContent>
            {galleries.map((gallery: Gallery) => (
              <SelectItem key={gallery.id} value={gallery.id.toString()}>
                {gallery.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="imageUrl">URL de l'image *</Label>
        <Input
          id="imageUrl"
          value={imageFormData.imageUrl}
          onChange={(e) => setImageFormData({ ...imageFormData, imageUrl: e.target.value })}
          placeholder="https://exemple.com/image.jpg"
        />
      </div>

      <div>
        <Label htmlFor="thumbnailUrl">URL de la miniature</Label>
        <Input
          id="thumbnailUrl"
          value={imageFormData.thumbnailUrl}
          onChange={(e) => setImageFormData({ ...imageFormData, thumbnailUrl: e.target.value })}
          placeholder="https://exemple.com/thumbnail.jpg"
        />
      </div>

      <div>
        <Label htmlFor="imageTitle">Titre</Label>
        <Input
          id="imageTitle"
          value={imageFormData.title}
          onChange={(e) => setImageFormData({ ...imageFormData, title: e.target.value })}
          placeholder="Titre de l'image"
        />
      </div>

      <div>
        <Label htmlFor="imageDescription">Description</Label>
        <Textarea
          id="imageDescription"
          value={imageFormData.description}
          onChange={(e) => setImageFormData({ ...imageFormData, description: e.target.value })}
          placeholder="Description de l'image"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="imageSortOrder">Ordre d'affichage</Label>
          <Input
            id="imageSortOrder"
            type="number"
            value={imageFormData.sortOrder}
            onChange={(e) => setImageFormData({ ...imageFormData, sortOrder: parseInt(e.target.value) || 0 })}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="imageActive"
            checked={imageFormData.isActive}
            onCheckedChange={(checked) => setImageFormData({ ...imageFormData, isActive: checked })}
          />
          <Label htmlFor="imageActive">Image active</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => {
            setIsImageDialogOpen(false);
            resetImageForm();
          }}
        >
          Annuler
        </Button>
        <Button
          onClick={isEditMode ? handleUpdateImage : handleCreateImage}
          disabled={!imageFormData.imageUrl || !imageFormData.galleryId}
        >
          {isEditMode ? "Modifier" : "Ajouter"}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des Galeries</h1>
        <div className="flex space-x-2">
          <Dialog open={isGalleryDialogOpen} onOpenChange={setIsGalleryDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={resetGalleryForm}>
                <FolderPlus className="mr-2 h-4 w-4" />
                Nouvelle Galerie
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {isEditMode ? "Modifier la galerie" : "Créer une nouvelle galerie"}
                </DialogTitle>
              </DialogHeader>
              <GalleryForm />
            </DialogContent>
          </Dialog>

          <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetImageForm}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une Image
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {isEditMode ? "Modifier l'image" : "Ajouter une nouvelle image"}
                </DialogTitle>
              </DialogHeader>
              <ImageForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Onglets */}
      <div className="border-b">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("galleries")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "galleries"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Galeries ({galleries.length})
          </button>
          <button
            onClick={() => setActiveTab("images")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "images"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Images ({images.length})
          </button>
        </nav>
      </div>

      {/* Contenu des onglets */}
      {activeTab === "galleries" && (
        <Card>
          <CardHeader>
            <CardTitle>Liste des Galeries</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingGalleries ? (
              <div className="text-center py-4">Chargement...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Ordre</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {galleries.map((gallery: Gallery) => (
                    <TableRow key={gallery.id}>
                      <TableCell>
                        <div className="font-medium">{gallery.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">
                          {gallery.description || "Aucune description"}
                        </div>
                      </TableCell>
                      <TableCell>{gallery.sortOrder}</TableCell>
                      <TableCell>
                        <Badge variant={gallery.isActive ? "default" : "secondary"}>
                          {gallery.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedGallery(gallery);
                              setActiveTab("images");
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditGallery(gallery)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteGallery(gallery.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "images" && (
        <div className="space-y-4">
          {selectedGallery && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Galerie sélectionnée: {selectedGallery.name}
                </CardTitle>
              </CardHeader>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>
                Images {selectedGallery ? `de "${selectedGallery.name}"` : "toutes galeries"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingImages ? (
                <div className="text-center py-4">Chargement...</div>
              ) : images.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {images.map((image: GalleryImage) => (
                    <div key={image.id} className="border rounded-lg overflow-hidden">
                      <div className="aspect-square bg-gray-100 flex items-center justify-center">
                        {image.imageUrl ? (
                          <img
                            src={image.thumbnailUrl || image.imageUrl}
                            alt={image.title || "Image"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder-image.jpg";
                            }}
                          />
                        ) : (
                          <ImageIcon className="h-12 w-12 text-gray-400" />
                        )}
                      </div>
                      <div className="p-3">
                        <div className="font-medium truncate">
                          {image.title || "Sans titre"}
                        </div>
                        {image.description && (
                          <div className="text-sm text-gray-600 truncate">
                            {image.description}
                          </div>
                        )}
                        <div className="flex justify-between items-center mt-2">
                          <Badge variant={image.isActive ? "default" : "secondary"}>
                            {image.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditImage(image)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteImage(image.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ImageIcon className="mx-auto h-12 w-12 mb-4" />
                  <p>Aucune image trouvée</p>
                  <p className="text-sm">Ajoutez des images pour commencer</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  Plus, Search, Edit, Trash2, Eye, FileText, Globe,
  Navigation, ArrowUpDown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ContentPage {
  id: number;
  slug: string;
  title: string;
  content: string;
  metaDescription?: string;
  isActive: boolean;
  showInNavigation: boolean;
  sortOrder: number;
  lastEditedBy: number;
  createdAt: string;
  updatedAt: string;
}

interface ContentFormData {
  slug: string;
  title: string;
  content: string;
  metaDescription: string;
  isActive: boolean;
  showInNavigation: boolean;
  sortOrder: number;
}

export function ContentManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPage, setSelectedPage] = useState<ContentPage | null>(null);
  const [previewPage, setPreviewPage] = useState<ContentPage | null>(null);
  const [formData, setFormData] = useState<ContentFormData>({
    slug: "",
    title: "",
    content: "",
    metaDescription: "",
    isActive: true,
    showInNavigation: false,
    sortOrder: 0
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Récupérer les pages de contenu
  const { data: pages = [], isLoading } = useQuery({
    queryKey: ["content-pages", searchTerm],
    queryFn: async () => {
      const response = await fetch('/api/content-pages');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des pages');
      }
      return response.json();
    },
  });

  // Créer une page
  const createPageMutation = useMutation({
    mutationFn: async (pageData: ContentFormData) => {
      const response = await fetch('/api/content-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageData),
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la création de la page');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Page créée avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["content-pages"] });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la création de la page",
        variant: "destructive",
      });
    },
  });

  // Modifier une page
  const updatePageMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<ContentFormData> }) => {
      const response = await fetch(`/api/content-pages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la modification de la page');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Page modifiée avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["content-pages"] });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la modification de la page",
        variant: "destructive",
      });
    },
  });

  // Supprimer une page
  const deletePageMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/content-pages/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la page');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Page supprimée avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["content-pages"] });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de la page",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      slug: "",
      title: "",
      content: "",
      metaDescription: "",
      isActive: true,
      showInNavigation: false,
      sortOrder: 0
    });
    setSelectedPage(null);
    setIsEditMode(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
      .replace(/[^a-z0-9\s-]/g, "") // Supprime les caractères spéciaux
      .replace(/\s+/g, "-") // Remplace les espaces par des tirets
      .replace(/-+/g, "-") // Supprime les tirets multiples
      .trim();
  };

  const handleCreatePage = () => {
    // Générer le slug automatiquement si vide
    if (!formData.slug && formData.title) {
      setFormData(prev => ({ ...prev, slug: generateSlug(formData.title) }));
    }
    createPageMutation.mutate(formData);
  };

  const handleUpdatePage = () => {
    if (!selectedPage) return;
    updatePageMutation.mutate({ id: selectedPage.id, data: formData });
  };

  const handleEditPage = (page: ContentPage) => {
    setSelectedPage(page);
    setFormData({
      slug: page.slug,
      title: page.title,
      content: page.content,
      metaDescription: page.metaDescription || "",
      isActive: page.isActive,
      showInNavigation: page.showInNavigation,
      sortOrder: page.sortOrder
    });
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleDeletePage = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette page ?")) {
      deletePageMutation.mutate(id);
    }
  };

  const filteredPages = pages.filter((page: ContentPage) =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ContentForm = () => (
    <div className="space-y-4 max-h-[80vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Titre de la page *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
              // Générer automatiquement le slug
              if (!isEditMode) {
                setFormData(prev => ({ 
                  ...prev, 
                  title: e.target.value,
                  slug: generateSlug(e.target.value) 
                }));
              }
            }}
            placeholder="Titre de la page"
          />
        </div>

        <div>
          <Label htmlFor="slug">Slug (URL) *</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="slug-de-la-page"
          />
          <p className="text-xs text-gray-500 mt-1">
            URL de la page: /pages/{formData.slug}
          </p>
        </div>
      </div>

      <div>
        <Label htmlFor="metaDescription">Meta description (SEO)</Label>
        <Textarea
          id="metaDescription"
          value={formData.metaDescription}
          onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
          placeholder="Description courte pour les moteurs de recherche (160 caractères max)"
          rows={2}
          maxLength={160}
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.metaDescription.length}/160 caractères
        </p>
      </div>

      <div>
        <Label htmlFor="content">Contenu de la page *</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Contenu de la page en Markdown..."
          rows={15}
          className="font-mono text-sm"
        />
        <p className="text-xs text-gray-500 mt-1">
          Vous pouvez utiliser Markdown pour formater le contenu
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="sortOrder">Ordre d'affichage</Label>
          <Input
            id="sortOrder"
            type="number"
            value={formData.sortOrder}
            onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
          />
          <Label htmlFor="isActive">Page active</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="showInNavigation"
            checked={formData.showInNavigation}
            onCheckedChange={(checked) => setFormData({ ...formData, showInNavigation: checked })}
          />
          <Label htmlFor="showInNavigation">Afficher dans la navigation</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => {
            setIsDialogOpen(false);
            resetForm();
          }}
        >
          Annuler
        </Button>
        <Button
          onClick={isEditMode ? handleUpdatePage : handleCreatePage}
          disabled={!formData.title || !formData.slug || !formData.content}
        >
          {isEditMode ? "Modifier" : "Créer"}
        </Button>
      </div>
    </div>
  );

  const MarkdownPreview = ({ content }: { content: string }) => {
    // Simple conversion Markdown vers HTML (basique)
    const convertMarkdown = (text: string) => {
      return text
        .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mb-3">$1</h2>')
        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-medium mb-2">$1</h3>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/\n\n/gim, '</p><p class="mb-4">')
        .replace(/\n/gim, '<br>');
    };

    return (
      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ 
          __html: `<p class="mb-4">${convertMarkdown(content)}</p>` 
        }}
      />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion du Contenu</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Page
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? "Modifier la page" : "Créer une nouvelle page"}
              </DialogTitle>
            </DialogHeader>
            <ContentForm />
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
              placeholder="Rechercher dans les pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tableau des pages */}
      <Card>
        <CardHeader>
          <CardTitle>
            Pages de Contenu ({filteredPages.length})
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
                    <TableHead>Page</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Navigation</TableHead>
                    <TableHead>Ordre</TableHead>
                    <TableHead>Dernière modification</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPages.map((page: ContentPage) => (
                    <TableRow key={page.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{page.title}</div>
                          {page.metaDescription && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {page.metaDescription}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Globe className="mr-1 h-3 w-3" />
                          /pages/{page.slug}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={page.isActive ? "default" : "secondary"}>
                          {page.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {page.showInNavigation && (
                          <Badge variant="outline">
                            <Navigation className="mr-1 h-3 w-3" />
                            Navigation
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <ArrowUpDown className="mr-1 h-3 w-3" />
                          {page.sortOrder}
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(page.updatedAt), "dd/MM/yyyy HH:mm", { locale: fr })}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPreviewPage(page)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditPage(page)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePage(page.id)}
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

      {/* Dialog de prévisualisation */}
      {previewPage && (
        <Dialog open={!!previewPage} onOpenChange={() => setPreviewPage(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Aperçu: {previewPage.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>URL: /pages/{previewPage.slug}</span>
                  <Badge variant={previewPage.isActive ? "default" : "secondary"}>
                    {previewPage.isActive ? "Active" : "Inactive"}
                  </Badge>
                  {previewPage.showInNavigation && (
                    <Badge variant="outline">Dans la navigation</Badge>
                  )}
                </div>
                {previewPage.metaDescription && (
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Meta description:</strong> {previewPage.metaDescription}
                  </p>
                )}
              </div>
              
              <div className="bg-white border rounded p-6">
                <MarkdownPreview content={previewPage.content} />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
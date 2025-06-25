import React from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  TreePine,
  Heart,
  Rabbit,
  Ghost,
  TableProperties,
  Flag,
  Flower,
  Sun,
  Eye,
  Palette,
  Clock,
} from "lucide-react";

const themeIcons: Record<string, React.ComponentType<any>> = {
  "Noël": TreePine,
  "Christmas": TreePine,
  "Saint-Valentin": Heart,
  "Valentine's Day": Heart,
  "Pâques": Rabbit,
  "Easter": Rabbit,
  "Halloween": Ghost,
  "Fête du Canada": TableProperties,
  "Canada Day": TableProperties,
  "Indépendance Haïti": Flag,
  "Haiti Independence": Flag,
  "Printemps": Flower,
  "Spring": Flower,
  "Été": Sun,
  "Summer": Sun,
};

export function ThemeManager() {
  const { themes, currentTheme, activateTheme, isLoading } = useTheme();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const activateThemeMutation = useMutation({
    mutationFn: (themeId: number) => activateTheme(themeId),
    onSuccess: () => {
      toast({
        title: "Thème activé",
        description: "Le thème a été activé avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/themes/active"] });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'activer le thème",
        variant: "destructive",
      });
    },
  });

  const handleThemeActivation = (themeId: number) => {
    activateThemeMutation.mutate(themeId);
  };

  if (isLoading) {
    return (
      <Card className="christmas-border">
        <CardHeader>
          <CardTitle>Gestionnaire de Thèmes Festifs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="christmas-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Gestionnaire de Thèmes Festifs
          </CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Activation Automatique:</span>
            <Switch defaultChecked disabled />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
          {themes.map((theme) => {
            const IconComponent = themeIcons[theme.name] || TreePine;
            const isActive = currentTheme?.id === theme.id;
            
            return (
              <button
                key={theme.id}
                onClick={() => handleThemeActivation(theme.id)}
                disabled={activateThemeMutation.isPending}
                className={`relative p-4 border-2 rounded-lg text-center transition-all hover:scale-105 ${
                  isActive
                    ? "border-red-600 bg-red-50"
                    : "border-gray-200 bg-gray-50 hover:border-gray-300"
                }`}
              >
                <IconComponent 
                  className={`w-8 h-8 mx-auto mb-2 ${
                    isActive ? "text-red-600" : "text-gray-500"
                  }`} 
                />
                <p className="text-xs font-medium">{theme.name}</p>
                <p className="text-xs text-gray-500">
                  {theme.startDate && theme.endDate 
                    ? `${new Date(theme.startDate).toLocaleDateString("fr-CA", { day: "numeric", month: "short" })} - ${new Date(theme.endDate).toLocaleDateString("fr-CA", { day: "numeric", month: "short" })}`
                    : "Personnalisé"
                  }
                </p>
                {isActive && (
                  <div className="absolute top-1 right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-4">
          <Button 
            className="bg-red-600 hover:bg-red-700"
            onClick={() => window.open("/public", "_blank")}
          >
            <Eye className="w-4 h-4 mr-2" />
            Prévisualiser Site Public
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <Palette className="w-4 h-4 mr-2" />
            Créer Thème Personnalisé
          </Button>
          <Button variant="outline">
            <Clock className="w-4 h-4 mr-2" />
            Programmer Thème
          </Button>
        </div>

        {currentTheme && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Thème Actuel</h4>
            <div className="flex items-center space-x-4">
              <Badge variant="default" className="bg-green-600">
                {currentTheme.name}
              </Badge>
              {currentTheme.description && (
                <span className="text-sm text-gray-600">{currentTheme.description}</span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

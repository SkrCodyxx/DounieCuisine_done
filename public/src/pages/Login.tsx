import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Lock, User, Shield } from "lucide-react";
import { Link, useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

const loginSchema = z.object({
  username: z.string().min(1, "Nom d'utilisateur requis"),
  password: z.string().min(1, "Mot de passe requis"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      return apiRequest("/api/auth/login", { method: "POST", body: data });
    },
    onSuccess: async (response) => {
      const data = await response.json();
      localStorage.setItem('user', JSON.stringify(data.user));
      toast({
        title: "Koneksyon reyisi! • Connexion réussie!",
        description: `Byenveni ${data.user.firstName} ${data.user.lastName}`,
      });
      
      // Redirection automatique selon le rôle de l'utilisateur dans la base de données
      if (['admin', 'manager', 'staff'].includes(data.user.role)) {
        setLocation('/admin');
      } else if (data.user.role === 'client') {
        setLocation('/public');
      } else {
        // Sécurité - rôle non reconnu
        toast({
          title: "Erreur de sécurité",
          description: "Rôle utilisateur non valide",
          variant: "destructive"
        });
        localStorage.removeItem('user');
      }
    },
    onError: (error: any) => {
      toast({
        title: "Erè koneksyon • Erreur de connexion",
        description: error.message || "Non itilizatè oswa mo de pas pa bon • Nom d'utilisateur ou mot de passe incorrect",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-blue-50">
      {/* Navigation retour */}
      <nav className="p-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-800">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Retour Accueil
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
              Pas de compte? • S'inscrire
            </Button>
          </Link>
        </div>
      </nav>

      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md mx-4 border-red-200 shadow-xl">
          <CardHeader className="space-y-4 bg-gradient-to-r from-red-50 to-blue-50">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
              <h1 className="text-2xl font-bold text-red-600">Dounie Cuisine</h1>
              <p className="text-blue-600">Koneksyon Otomatik • Connexion Sécurisée</p>
            </div>
            <CardTitle className="text-xl font-bold text-center text-gray-800">Konekte • Connexion</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Redirection otomatik selon vos accès • Redirection automatique selon vos permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => loginMutation.mutate(data))} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Non Itilizatè • Nom d'utilisateur</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Antre non itilizatè ou • Entrez votre nom d'utilisateur" 
                          className="border-red-200 focus:border-red-500"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Mo de Pas • Mot de passe</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Antre mo de pas ou • Entrez votre mot de passe" 
                          className="border-red-200 focus:border-red-500"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />



                <Button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700 py-3 text-lg"
                  disabled={loginMutation.isPending}
                >
                  <Lock className="mr-2 h-5 w-5" />
                  {loginMutation.isPending ? "Ap konekte..." : "Konekte • Se Connecter"}
                </Button>
              </form>
            </Form>
            
            {/* Aide pour les employés */}
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">Èd pou Travayè • Aide pour le Personnel</h4>
              <div className="text-sm text-yellow-700 space-y-1">
                <p><strong>Admin:</strong> admin / admin123</p>
                <p><strong>Pwoblèm ak koneksyon?</strong> Rele jeran an</p>
                <p><strong>Problème de connexion?</strong> Appelez le gérant</p>
              </div>
            </div>
            
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Pa gen aksè? • Pas d'accès?{" "}
                <Link href="/register" className="text-green-600 hover:text-green-700 font-medium">
                  Kreye kont • Créer un compte
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-4 text-center">
          <Button
            variant="outline"
            onClick={() => window.open("/public", "_blank")}
            className="text-sm"
          >
            Voir le site public
          </Button>
        </div>
      </div>
    </div>
  );
}

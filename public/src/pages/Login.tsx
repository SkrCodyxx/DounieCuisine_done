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
        title: "Connexion réussie !",
        description: `Bienvenue ${data.user.firstName} ${data.user.lastName} !`,
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
        title: "Erreur de connexion",
        description: error.message || "Nom d'utilisateur ou mot de passe incorrect.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  return (
    <PublicLayout>
      <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-var(--header-height,8rem))]"> {/* Ajuster la hauteur min si besoin */}
        <Card className="w-full max-w-md shadow-2xl border-border rounded-xl">
          <CardHeader className="space-y-3 text-center bg-muted/30 p-6 md:p-8 rounded-t-xl">
            <Shield className="h-16 w-16 mx-auto text-primary" />
            <CardTitle className="text-3xl font-bold text-foreground">Connexion Sécurisée</CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              Accédez à votre espace Dounie Cuisine.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Nom d'utilisateur ou E-mail</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Votre nom d'utilisateur ou e-mail"
                          className="py-3 px-4 text-base rounded-md border-border focus:ring-2 focus:ring-primary"
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
                      <FormLabel className="text-base">Mot de passe</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Votre mot de passe"
                          className="py-3 px-4 text-base rounded-md border-border focus:ring-2 focus:ring-primary"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  size="lg" // Utilisation de la prop size pour un bouton plus grand
                  className="w-full bg-primary hover:bg-primary/90 text-lg py-3 rounded-md"
                  disabled={loginMutation.isPending}
                >
                  <Lock className="mr-2 h-5 w-5" />
                  {loginMutation.isPending ? "Connexion en cours..." : "Se Connecter"}
                </Button>
              </form>
            </Form>
            
            <div className="mt-8 text-center">
              <p className="text-base text-muted-foreground">
                Pas encore de compte ?{" "}
                <Link href="/register" className="font-semibold text-primary hover:underline">
                  Créer un compte
                </Link>
              </p>
            </div>
             {/* La section "Aide pour le Personnel" n'est pas appropriée ici, car c'est une page publique client.
                 Elle pourrait être sur une page de login admin séparée.
            <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
              <h4 className="font-semibold text-foreground mb-2">Aide pour le Personnel</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Identifiants Admin (test):</strong> admin / admin123</p>
                <p><strong>Problème de connexion ?</strong> Appelez le gérant.</p>
              </div>
            </div>
            */}
          </CardContent>
        </Card>
        
        {/* Le bouton "Voir le site public" n'a pas de sens ici car nous sommes sur le site public */}
        {/* <div className="mt-4 text-center">
          <Button
            variant="outline"
            onClick={() => window.open("/public", "_blank")}
            className="text-sm"
          >
            Voir le site public
          </Button>
        </div> */}
      </div>
    </PublicLayout>
  );
}

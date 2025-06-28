import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Lock,
  UserPlus,
  Check,
  AlertCircle
} from "lucide-react";

const registerSchema = z.object({
  username: z.string().min(3, "Nom d'utilisateur doit avoir au moins 3 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe doit avoir au moins 6 caractères"),
  confirmPassword: z.string(),
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
  phoneNumber: z.string().optional(),
  role: z.enum(["client"]).default("client")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"]
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      role: "client"
    }
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterForm) => {
      const { confirmPassword, ...registerData } = data;
      return apiRequest("/api/auth/register", { method: "POST", body: registerData });
    },
    onSuccess: () => {
      setStep(3);
      toast({
        title: "Compte créé avec succès !",
        description: "Vous pouvez maintenant vous connecter avec vos identifiants."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur lors de la création du compte",
        description: error.message || "Un problème est survenu. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (data: RegisterForm) => {
    registerMutation.mutate(data);
  };

  if (step === 3) {
    return (
      <PublicLayout>
        <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-var(--header-height,8rem))]">
          <Card className="w-full max-w-md shadow-2xl border-green-500 bg-green-50/50 rounded-xl">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Check className="h-12 w-12" />
              </div>
              <h2 className="text-3xl font-bold text-green-700 mb-4">
                Compte Créé avec Succès !
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Bienvenue dans la famille Dounie Cuisine ! Vous pouvez maintenant vous connecter avec vos nouveaux identifiants.
              </p>
              <div className="flex flex-col gap-4">
                <Link href="/login">
                  <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-lg py-3">
                    Se Connecter
                  </Button>
                </Link>
                <Link href="/">
                  <Button size="lg" variant="outline" className="w-full text-lg py-3">
                    Retour à l'Accueil
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-var(--header-height,8rem))]">
        <Card className="w-full max-w-lg shadow-2xl border-border rounded-xl">
          <CardHeader className="space-y-3 text-center bg-muted/30 p-6 md:p-8 rounded-t-xl">
             <UserPlus className="h-16 w-16 mx-auto text-primary" />
            <CardTitle className="text-3xl font-bold text-foreground">Créer Votre Compte</CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              Rejoignez Dounie Cuisine pour une expérience culinaire unique.
            </CardDescription>
            <div className="flex items-center justify-center pt-4 space-x-2 sm:space-x-4">
              {[
                { num: 1, label: "Infos Perso." },
                { num: 2, label: "Identifiants" },
                { num: 3, label: "Terminé" }
              ].map((s, index, arr) => (
                <React.Fragment key={s.num}>
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all duration-300",
                      step >= s.num ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border"
                    )}>
                      {step > s.num ? <Check className="w-5 h-5" /> : s.num}
                    </div>
                    <span className={cn(
                      "text-xs mt-1.5",
                      step >= s.num ? "text-primary font-semibold" : "text-muted-foreground"
                    )}>{s.label}</span>
                  </div>
                  {index < arr.length - 1 && (
                    <div className={cn(
                      "h-1 flex-1 transition-all duration-300 mt-[-1.25rem]", // Ajustement pour aligner avec le centre des cercles
                      step > s.num ? "bg-primary" : "bg-border"
                    )}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </CardHeader>

          <CardContent className="p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                {step === 1 && (
                  <>
                    <section className="space-y-6">
                       <h3 className="text-xl font-semibold text-foreground flex items-center gap-2 border-b pb-3 mb-6">
                        <User className="h-5 w-5 text-primary" />
                        Informations Personnelles
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="firstName" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Prénom *</FormLabel>
                            <FormControl><Input placeholder="Ex: Jean" {...field} className="py-3 px-4 text-base rounded-md border-border focus:ring-2 focus:ring-primary"/></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}/>
                        <FormField control={form.control} name="lastName" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Nom *</FormLabel>
                            <FormControl><Input placeholder="Ex: Dupont" {...field} className="py-3 px-4 text-base rounded-md border-border focus:ring-2 focus:ring-primary"/></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}/>
                      </div>
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Adresse e-mail *</FormLabel>
                          <FormControl><Input type="email" placeholder="Ex: jean.dupont@exemple.com" {...field} className="py-3 px-4 text-base rounded-md border-border focus:ring-2 focus:ring-primary"/></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}/>
                      <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Téléphone (Optionnel)</FormLabel>
                          <FormControl><Input placeholder="Ex: (514) 123-4567" {...field} className="py-3 px-4 text-base rounded-md border-border focus:ring-2 focus:ring-primary"/></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}/>
                       {/* Le rôle est client par défaut, donc pas besoin de le montrer ici pour l'inscription publique simple */}
                    </section>
                    <Button type="button" onClick={() => setStep(2)} size="lg" className="w-full bg-primary hover:bg-primary/90 text-lg py-3 mt-8 rounded-md">
                      Continuer
                      <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
                    </Button>
                  </>
                )}

                {step === 2 && (
                  <>
                    <section className="space-y-6">
                      <h3 className="text-xl font-semibold text-foreground flex items-center gap-2 border-b pb-3 mb-6">
                        <Lock className="h-5 w-5 text-primary" />
                        Informations de Connexion
                      </h3>
                      <FormField control={form.control} name="username" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Nom d'utilisateur *</FormLabel>
                          <FormControl><Input placeholder="Ex: jeandupont123" {...field} className="py-3 px-4 text-base rounded-md border-border focus:ring-2 focus:ring-primary"/></FormControl>
                          <FormMessage />
                          <p className="text-xs text-muted-foreground mt-1">Au moins 3 caractères.</p>
                        </FormItem>
                      )}/>
                      <FormField control={form.control} name="password" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Mot de passe *</FormLabel>
                          <FormControl><Input type="password" placeholder="••••••••" {...field} className="py-3 px-4 text-base rounded-md border-border focus:ring-2 focus:ring-primary"/></FormControl>
                           <FormMessage />
                          <p className="text-xs text-muted-foreground mt-1">Au moins 6 caractères.</p>
                        </FormItem>
                      )}/>
                      <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Confirmer le mot de passe *</FormLabel>
                          <FormControl><Input type="password" placeholder="••••••••" {...field} className="py-3 px-4 text-base rounded-md border-border focus:ring-2 focus:ring-primary"/></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}/>
                    </section>

                    <div className="mt-8 space-y-2 bg-muted/30 p-4 rounded-lg border border-border">
                      <h4 className="font-semibold text-foreground text-sm">Récapitulatif :</h4>
                      <p className="text-sm text-muted-foreground"><strong>Nom :</strong> {form.getValues('firstName')} {form.getValues('lastName')}</p>
                      <p className="text-sm text-muted-foreground"><strong>E-mail :</strong> {form.getValues('email')}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                      <Button type="button" variant="outline" onClick={() => setStep(1)} size="lg" className="flex-1 py-3 text-lg rounded-md">
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Précédent
                      </Button>
                      <Button type="submit" size="lg" className="flex-1 bg-green-600 hover:bg-green-700 text-lg py-3 rounded-md" disabled={registerMutation.isPending}>
                        {registerMutation.isPending ? "Création en cours..." : "Créer le Compte"}
                        <Check className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </>
                )}
              </form>
            </Form>

            <div className="mt-8 text-center">
              <p className="text-base text-muted-foreground">
                Déjà un compte ?{" "}
                <Link href="/login" className="font-semibold text-primary hover:underline">
                  Se connecter
                </Link>
              </p>
            </div>
             {/* Section d'aide commentée car moins pertinente pour l'inscription client publique */}
            {/* <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
              <h4 className="font-semibold text-foreground mb-2">Information sur les types de compte</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Client :</strong> Accès aux réservations, commandes et à votre profil personnel.</p>
              </div>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
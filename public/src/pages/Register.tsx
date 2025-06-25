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
        title: "Kont yo kreye! • Compte créé!",
        description: "Ou kapab konekte kounye a • Vous pouvez vous connecter maintenant"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erè nan kreyasyon kont lan • Erreur création compte",
        description: error.message || "Yon pwoblèm rive • Un problème est survenu",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (data: RegisterForm) => {
    registerMutation.mutate(data);
  };

  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-blue-50 flex items-center justify-center px-6">
        <Card className="w-full max-w-md border-green-200 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-4">
              Kont yo kreye! • Compte créé!
            </h2>
            <p className="text-gray-600 mb-6">
              Byenveni nan fanmi Dounie Cuisine! Ou kapab konekte kounye a.<br />
              <strong>Bienvenue dans la famille Dounie Cuisine! Vous pouvez vous connecter maintenant.</strong>
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/login">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  Konekte • Se Connecter
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Retounen Lakay • Retour Accueil
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-blue-50">
      {/* Navigation */}
      <nav className="p-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-800">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Retour Accueil
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
              Déjà un compte? • Se connecter
            </Button>
          </Link>
        </div>
      </nav>

      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-lg mx-4 border-red-200 shadow-xl">
          <CardHeader className="space-y-4 bg-gradient-to-r from-red-50 to-blue-50">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
              <h1 className="text-2xl font-bold text-red-600">Dounie Cuisine</h1>
              <p className="text-blue-600">Kreye Kont • Créer un Compte</p>
            </div>

            {/* Indicateur de progression */}
            <div className="flex items-center justify-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step >= 1 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                1
              </div>
              <div className={`w-12 h-1 ${step >= 2 ? 'bg-red-600' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step >= 2 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                2
              </div>
              <div className={`w-12 h-1 ${step >= 3 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                ✓
              </div>
            </div>

            <CardTitle className="text-xl font-bold text-center text-gray-800">
              {step === 1 ? "Enfòmasyon Pèsonèl • Informations Personnelles" : "Enfòmasyon Koneksyon • Informations de Connexion"}
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              {step === 1 
                ? "Kòmanse ak enfòmasyon yo • Commencez par vos informations" 
                : "Kreye kòd koneksyon ou • Créez vos identifiants de connexion"
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {step === 1 && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Prenon • Prénom *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Jan"
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
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Non Fanmi • Nom *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Durand"
                                className="border-red-200 focus:border-red-500"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Email *</FormLabel>
                          <FormControl>
                            <Input 
                              type="email"
                              placeholder="jan.durand@email.com"
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
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Telefòn • Téléphone</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="(514) 555-0000"
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
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Tip Kont • Type de Compte</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-red-200 focus:border-red-500">
                                <SelectValue placeholder="Chwazi tip kont ou" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="client">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  <span>Kliyen • Client</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="button" 
                      onClick={() => setStep(2)} 
                      className="w-full bg-red-600 hover:bg-red-700 py-3"
                    >
                      Kontinye • Continuer
                      <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
                    </Button>
                  </>
                )}

                {step === 2 && (
                  <>
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Non Itilizatè • Nom d'utilisateur *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="jandurand123"
                              className="border-red-200 focus:border-red-500"
                              {...field} 
                            />
                          </FormControl>
                          <p className="text-xs text-gray-500">Au moins 3 caractères, uniquement lettres et chiffres</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Mo de Pas • Mot de passe *</FormLabel>
                          <FormControl>
                            <Input 
                              type="password"
                              placeholder="••••••••"
                              className="border-red-200 focus:border-red-500"
                              {...field} 
                            />
                          </FormControl>
                          <p className="text-xs text-gray-500">Au moins 6 caractères</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Konfime Mo de Pas • Confirmer le mot de passe *</FormLabel>
                          <FormControl>
                            <Input 
                              type="password"
                              placeholder="••••••••"
                              className="border-red-200 focus:border-red-500"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Résumé */}
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Rezime • Résumé</h4>
                      <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-1">
                        <p><strong>Non:</strong> {form.getValues('firstName')} {form.getValues('lastName')}</p>
                        <p><strong>Email:</strong> {form.getValues('email')}</p>
                        <p><strong>Tip:</strong> {form.getValues('role')}</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setStep(1)}
                        className="flex-1"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retounen • Retour
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? "Ap kreye..." : "Kreye Kont • Créer le Compte"}
                        <Check className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </>
                )}
              </form>
            </Form>

            {/* Aide */}
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">Èd • Aide</h4>
              <div className="text-sm text-yellow-700 space-y-1">
                <p><strong>Kliyen:</strong> Aksè rezèvasyon ak pwofil • Accès réservations et profil</p>
                <p><strong>Travayè:</strong> Aksè pa sistèm lan • Accès partiel au système</p>
                <p><strong>Jeran:</strong> Aksè konplè • Accès complet</p>
              </div>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Deja gen kont? • Déjà un compte?{" "}
                <Link href="/login" className="text-red-600 hover:text-red-700 font-medium">
                  Konekte • Se connecter
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
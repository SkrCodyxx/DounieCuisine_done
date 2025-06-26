import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Play, CheckCircle, XCircle, AlertCircle, Activity, Database, Users, ShoppingCart } from "lucide-react";

interface TestResult {
  name: string;
  status: "passed" | "failed" | "running" | "pending";
  duration?: number;
  error?: string;
  details?: string;
}

interface TestSuite {
  name: string;
  tests: TestResult[];
  status: "passed" | "failed" | "running" | "pending";
}

export function TestSuite() {
  const [testResults, setTestResults] = useState<TestSuite[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const runTestsMutation = useMutation({
    mutationFn: async (suiteType: string) => {
      setIsRunning(true);
      setProgress(0);
      
      const response = await fetch(`/api/admin/tests/${suiteType}`, {
        method: "POST",
      });
      
      if (!response.ok) throw new Error("Failed to run tests");
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (reader) {
        let results: TestSuite[] = [];
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.trim());
          
          for (const line of lines) {
            try {
              const data = JSON.parse(line);
              if (data.type === 'progress') {
                setProgress(data.progress);
              } else if (data.type === 'result') {
                results = data.results;
                setTestResults(results);
              }
            } catch (e) {
              // Ignore invalid JSON
            }
          }
        }
        
        return results;
      }
      
      return [];
    },
    onSuccess: (results) => {
      setIsRunning(false);
      setProgress(100);
      
      const totalTests = results.reduce((acc, suite) => acc + suite.tests.length, 0);
      const passedTests = results.reduce((acc, suite) => 
        acc + suite.tests.filter(test => test.status === "passed").length, 0
      );
      
      toast({
        title: "Tests terminés",
        description: `${passedTests}/${totalTests} tests réussis`,
        variant: passedTests === totalTests ? "default" : "destructive",
      });
    },
    onError: (error: any) => {
      setIsRunning(false);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const testSuites = [
    {
      id: "auth",
      name: "Authentification",
      description: "Tests de connexion, sécurité et permissions",
      icon: Users,
      color: "text-blue-600",
    },
    {
      id: "api",
      name: "API",
      description: "Tests des endpoints REST et validation des données",
      icon: Activity,
      color: "text-green-600",
    },
    {
      id: "database",
      name: "Base de données",
      description: "Tests d'intégrité et de performance de la DB",
      icon: Database,
      color: "text-purple-600",
    },
    {
      id: "orders",
      name: "Commandes",
      description: "Tests du système de commandes et paiements",
      icon: ShoppingCart,
      color: "text-orange-600",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "running":
        return <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "passed": return "default";
      case "failed": return "destructive";
      case "running": return "secondary";
      case "pending": return "outline";
      default: return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "passed": return "Réussi";
      case "failed": return "Échoué";
      case "running": return "En cours";
      case "pending": return "En attente";
      default: return status;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Suite de tests</h1>
            <p className="text-muted-foreground">
              Exécutez des tests automatisés pour valider le système
            </p>
          </div>
          <Button
            onClick={() => runTestsMutation.mutate("all")}
            disabled={isRunning}
            className="min-w-32"
          >
            <Play className="mr-2 h-4 w-4" />
            {isRunning ? "Exécution..." : "Tout tester"}
          </Button>
        </div>

        {isRunning && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span>Tests en cours...</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground mt-2">
                {Math.round(progress)}% terminé
              </p>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="suites" className="space-y-4">
          <TabsList>
            <TabsTrigger value="suites">Suites de tests</TabsTrigger>
            <TabsTrigger value="results">Résultats détaillés</TabsTrigger>
          </TabsList>

          <TabsContent value="suites">
            <div className="grid gap-4 md:grid-cols-2">
              {testSuites.map((suite) => (
                <Card key={suite.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center`}>
                          <suite.icon className={`w-5 h-5 ${suite.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{suite.name}</CardTitle>
                          <CardDescription>{suite.description}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        {testResults.find(r => r.name.toLowerCase().includes(suite.id))?.tests.length || 0} tests
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => runTestsMutation.mutate(suite.id)}
                        disabled={isRunning}
                      >
                        <Play className="mr-1 h-3 w-3" />
                        Exécuter
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="results">
            <div className="space-y-6">
              {testResults.map((suite, suiteIndex) => (
                <Card key={suiteIndex}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        {getStatusIcon(suite.status)}
                        <span>{suite.name}</span>
                      </CardTitle>
                      <Badge variant={getStatusBadgeVariant(suite.status)}>
                        {getStatusLabel(suite.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64">
                      <div className="space-y-2">
                        {suite.tests.map((test, testIndex) => (
                          <div
                            key={testIndex}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              {getStatusIcon(test.status)}
                              <div>
                                <p className="font-medium">{test.name}</p>
                                {test.details && (
                                  <p className="text-sm text-muted-foreground">{test.details}</p>
                                )}
                                {test.error && (
                                  <p className="text-sm text-red-600">{test.error}</p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant={getStatusBadgeVariant(test.status)} className="text-xs">
                                {getStatusLabel(test.status)}
                              </Badge>
                              {test.duration && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {test.duration}ms
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              ))}

              {testResults.length === 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Aucun test exécuté</h3>
                      <p className="text-muted-foreground mb-4">
                        Lancez une suite de tests pour voir les résultats ici
                      </p>
                      <Button onClick={() => runTestsMutation.mutate("all")}>
                        <Play className="mr-2 h-4 w-4" />
                        Exécuter tous les tests
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
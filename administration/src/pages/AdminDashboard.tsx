import { useUser } from "@/hooks/use-user";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  ShoppingCart, 
  Calendar, 
  Package, 
  DollarSign, 
  TrendingUp,
  AlertTriangle,
  Clock
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

export function AdminDashboard() {
  const { user } = useUser();

  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard/stats");
      if (!response.ok) throw new Error("Échec de la récupération des statistiques");
      return response.json();
    },
  });

  const dashboardCards = [
    {
      title: "Commandes du jour",
      value: stats?.todayOrders || 0,
      description: "Nouvelles commandes aujourd'hui",
      icon: ShoppingCart,
      color: "text-blue-600",
      href: "/orders"
    },
    {
      title: "Réservations",
      value: stats?.todayReservations || 0,
      description: "Réservations pour aujourd'hui",
      icon: Calendar,
      color: "text-green-600",
      href: "/reservations"
    },
    {
      title: "Revenus du jour",
      value: `${stats?.todayRevenue || 0} $CA`,
      description: "Chiffre d'affaires aujourd'hui",
      icon: DollarSign,
      color: "text-emerald-600",
      href: "/finances"
    },
    {
      title: "Stock critique",
      value: stats?.criticalStock || 0,
      description: "Articles en rupture",
      icon: Package,
      color: "text-red-600",
      href: "/inventory"
    },
    {
      title: "Employés actifs",
      value: stats?.activeEmployees || 0,
      description: "Équipe en service",
      icon: Users,
      color: "text-purple-600",
      href: "/staff"
    },
    {
      title: "Croissance",
      value: `+${stats?.growthRate || 0}%`,
      description: "Par rapport au mois dernier",
      icon: TrendingUp,
      color: "text-indigo-600",
      href: "/finances"
    }
  ];

  const quickActions = [
    { title: "Nouvelle commande", href: "/orders", color: "bg-blue-500" },
    { title: "Ajouter réservation", href: "/reservations", color: "bg-green-500" },
    { title: "Gérer le menu", href: "/menu", color: "bg-orange-500" },
    { title: "Voir les finances", href: "/finances", color: "bg-emerald-500" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
            <p className="text-muted-foreground">
              Bienvenue, {user?.firstName} {user?.lastName}
            </p>
          </div>
          <Badge variant="outline" className="text-sm">
            {user?.role === "admin" ? "Administrateur" : "Gestionnaire"}
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {dashboardCards.map((card, index) => (
            <Link key={index} href={card.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {card.title}
                  </CardTitle>
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>
              Accès direct aux fonctions principales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <div className={`w-3 h-3 rounded-full ${action.color} mr-2`} />
                    {action.title}
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Activité récente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats?.recentActivity?.map((activity: any, index: number) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="text-sm">
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-muted-foreground text-xs">{activity.time}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {activity.type}
                    </Badge>
                  </div>
                )) || (
                  <p className="text-muted-foreground text-sm">Aucune activité récente</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                Alertes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats?.alerts?.map((alert: any, index: number) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-amber-50 rounded-md">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <div className="text-sm">
                      <p className="font-medium">{alert.title}</p>
                      <p className="text-muted-foreground text-xs">{alert.description}</p>
                    </div>
                  </div>
                )) || (
                  <p className="text-muted-foreground text-sm">Aucune alerte</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
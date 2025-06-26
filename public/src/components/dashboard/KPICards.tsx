import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DollarSign,
  ShoppingCart,
  Calendar,
  Gift,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface DashboardStats {
  todayRevenue: number;
  activeOrders: number;
  tomorrowReservations: number;
  totalLoyaltyPoints: number;
}

export function KPICards() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="christmas-border">
            <CardContent className="p-6">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const kpiData = [
    {
      title: "Revenus Aujourd'hui",
      value: `${stats?.todayRevenue?.toFixed(2) || "0.00"} CAD$`,
      change: "+12% vs hier",
      changeType: "increase" as const,
      icon: DollarSign,
      bgColor: "bg-green-600",
      textColor: "text-green-600",
    },
    {
      title: "Commandes Actives",
      value: stats?.activeOrders?.toString() || "0",
      change: "8 en préparation",
      changeType: "neutral" as const,
      icon: ShoppingCart,
      bgColor: "bg-red-600",
      textColor: "text-red-600",
    },
    {
      title: "Réservations Demain",
      value: stats?.tomorrowReservations?.toString() || "0",
      change: "85% complet",
      changeType: "increase" as const,
      icon: Calendar,
      bgColor: "bg-amber-600",
      textColor: "text-amber-600",
    },
    {
      title: "Points Fidélité Distribués",
      value: stats?.totalLoyaltyPoints?.toLocaleString() || "0",
      change: "Spécial Noël 2x",
      changeType: "increase" as const,
      icon: Gift,
      bgColor: "bg-purple-600",
      textColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpiData.map((kpi, index) => (
        <Card key={index} className="christmas-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{kpi.title}</p>
                <p className={`text-2xl font-bold ${kpi.textColor} mt-1`}>
                  {kpi.value}
                </p>
                <div className="flex items-center mt-1">
                  {kpi.changeType === "increase" ? (
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  ) : kpi.changeType === "decrease" ? (
                    <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                  ) : null}
                  <p className={`text-sm ${
                    kpi.changeType === "increase" ? "text-green-600" : 
                    kpi.changeType === "decrease" ? "text-red-600" : 
                    "text-gray-500"
                  }`}>
                    {kpi.change}
                  </p>
                </div>
              </div>
              <div className={`w-12 h-12 ${kpi.bgColor} rounded-lg flex items-center justify-center`}>
                <kpi.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

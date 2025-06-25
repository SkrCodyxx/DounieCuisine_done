import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, FileText, FileSpreadsheet } from "lucide-react";

interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  totalGST: number;
  totalQST: number;
  netProfit: number;
}

export function FinancialSummary() {
  const { data: summary, isLoading } = useQuery<FinancialSummary>({
    queryKey: ["/api/finance/summary"],
  });

  if (isLoading) {
    return (
      <Card className="christmas-border">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} CAD$`;
  };

  return (
    <Card className="christmas-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Résumé Financier Canadien
          </CardTitle>
          <Button variant="ghost" size="sm">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span className="text-gray-600">Revenus Bruts</span>
            <span className="font-semibold text-green-600">
              {formatCurrency(summary?.totalRevenue || 0)}
            </span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span className="text-gray-600">TPS (5%)</span>
            <span className="font-semibold text-blue-600">
              {formatCurrency(summary?.totalGST || 0)}
            </span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span className="text-gray-600">TVQ Québec (9.975%)</span>
            <span className="font-semibold text-blue-600">
              {formatCurrency(summary?.totalQST || 0)}
            </span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-green-50 rounded">
            <span className="text-gray-900 font-medium">Profit Net</span>
            <span className="font-bold text-green-600 text-lg">
              {formatCurrency(summary?.netProfit || 0)}
            </span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="flex space-x-2">
            <Button 
              className="flex-1 bg-red-600 hover:bg-red-700"
              size="sm"
            >
              <FileText className="w-4 h-4 mr-2" />
              Rapport PDF
            </Button>
            <Button 
              className="flex-1 bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

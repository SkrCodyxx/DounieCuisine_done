import React, { useState } from "react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Header } from "@/components/layout/Header";
import { KPICards } from "@/components/dashboard/KPICards";
import { FinancialSummary } from "@/components/dashboard/FinancialSummary";
import { EmployeeCalendar } from "@/components/dashboard/EmployeeCalendar";
import { ThemeManager } from "@/components/dashboard/ThemeManager";
import { useTheme } from "@/components/theme/ThemeProvider";

export default function Dashboard() {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const { currentTheme } = useTheme();

  const dashboardTitle = currentTheme 
    ? `Tableau de Bord - ${currentTheme.name} 2024`
    : "Tableau de Bord";

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      {/* Mobile sidebar overlay */}
      {showMobileSidebar && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setShowMobileSidebar(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800">
            <AdminSidebar />
          </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto">
        <Header 
          title={dashboardTitle}
          showMobileMenu={true}
          onMobileMenuToggle={() => setShowMobileSidebar(!showMobileSidebar)}
        />

        <div className="p-6 space-y-6">
          {/* KPI Cards */}
          <KPICards />

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FinancialSummary />
            <EmployeeCalendar />
          </div>

          {/* Theme Manager */}
          <ThemeManager />

          {/* Additional Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Menu Performance */}
            <div className="bg-white rounded-lg shadow-lg christmas-border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Plats Populaires - Saison Festive
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Diri ak Djon Djon</span>
                  <span className="font-semibold text-green-600">47 commandes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Griot Festif</span>
                  <span className="font-semibold text-red-600">39 commandes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pain Patate de Noël</span>
                  <span className="font-semibold text-amber-600">31 commandes</span>
                </div>
              </div>
            </div>

            {/* Inventory Alerts */}
            <div className="bg-white rounded-lg shadow-lg christmas-border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Alertes Inventaire
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r">
                  <p className="text-sm font-medium text-yellow-800">Canneberges</p>
                  <p className="text-xs text-yellow-600">Stock faible - 12 unités</p>
                </div>
                <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded-r">
                  <p className="text-sm font-medium text-red-800">Foie Gras</p>
                  <p className="text-xs text-red-600">Rupture - 0 unités</p>
                </div>
                <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded-r">
                  <p className="text-sm font-medium text-green-800">Champagne</p>
                  <p className="text-xs text-green-600">Stock normal - 45 bouteilles</p>
                </div>
              </div>
            </div>

            {/* Customer Rewards */}
            <div className="bg-white rounded-lg shadow-lg christmas-border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Programme Fidélité
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Clients Actifs</span>
                  <span className="font-semibold text-purple-600">1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Points Distribués (Décembre)</span>
                  <span className="font-semibold text-amber-600">12,459</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Récompenses Échangées</span>
                  <span className="font-semibold text-green-600">89</span>
                </div>
                <div className="mt-4 p-3 bg-purple-50 rounded">
                  <p className="text-sm font-medium text-purple-800">
                    Promotion Spéciale {currentTheme?.name || "Fêtes"}
                  </p>
                  <p className="text-xs text-purple-600">
                    Double points jusqu'au 31 décembre
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

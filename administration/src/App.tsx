import React, { useState, useEffect } from "react";
import { Switch as Routes, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminLayout } from "@/components/AdminLayout";
import { AuthProvider } from "@/hooks/useAuth";

// Import pages
import { AdminDashboard } from "@/pages/AdminDashboard";
import { LoginPage } from "@/pages/LoginPage";
import { MenuManagement } from "@/pages/MenuManagement";
import { OrderManagement } from "@/pages/OrderManagement";
import { ReservationManagement } from "@/pages/ReservationManagement";
import { StaffManagement } from "@/pages/StaffManagement";
import { CalendarManagement } from "@/pages/CalendarManagement";
import { InventoryManagement } from "@/pages/InventoryManagement";
import { FinancialManagement } from "@/pages/FinancialManagement";
import { SystemSettings } from "@/pages/SystemSettings";
import { TestSuite } from "@/pages/TestSuite";

const queryClient = new QueryClient();

// Composant de protection pour les routes admin
function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          if (['admin', 'manager', 'staff'].includes(userData.role)) {
            setUser(userData);
          } else {
            // Rediriger les clients vers l'app publique
            window.location.href = '/public';
          }
        }
      } catch (error) {
        console.error('Erreur auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return <AdminLayout>{children}</AdminLayout>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <TooltipProvider>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/login" component={LoginPage} />
                <Route path="/" component={() => (
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                )} />
                <Route path="/menu" component={() => (
                  <AdminProtectedRoute>
                    <MenuManagement />
                  </AdminProtectedRoute>
                )} />
                <Route path="/orders" component={() => (
                  <AdminProtectedRoute>
                    <OrderManagement />
                  </AdminProtectedRoute>
                )} />
                <Route path="/reservations" component={() => (
                  <AdminProtectedRoute>
                    <ReservationManagement />
                  </AdminProtectedRoute>
                )} />
                <Route path="/staff" component={() => (
                  <AdminProtectedRoute>
                    <StaffManagement />
                  </AdminProtectedRoute>
                )} />
                <Route path="/calendar" component={() => (
                  <AdminProtectedRoute>
                    <CalendarManagement />
                  </AdminProtectedRoute>
                )} />
                <Route path="/inventory" component={() => (
                  <AdminProtectedRoute>
                    <InventoryManagement />
                  </AdminProtectedRoute>
                )} />
                <Route path="/finance" component={() => (
                  <AdminProtectedRoute>
                    <FinancialManagement />
                  </AdminProtectedRoute>
                )} />
                <Route path="/settings" component={() => (
                  <AdminProtectedRoute>
                    <SystemSettings />
                  </AdminProtectedRoute>
                )} />
                <Route path="/tests" component={() => (
                  <AdminProtectedRoute>
                    <TestSuite />
                  </AdminProtectedRoute>
                )} />
              </Routes>
              <Toaster />
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
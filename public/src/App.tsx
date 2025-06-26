import { Switch as Routes, Route, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";

import HomePage from "@/pages/HomePage";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import { MenuPage } from "@/pages/public/MenuPage";
import { ReservationsPage } from "@/pages/public/ReservationsPage";
import ContactPage from "@/pages/public/ContactPage";
import GalleryPage from "@/pages/public/GalleryPage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

// Composant de protection pour les routes clients
function ClientProtectedRoute({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // Rediriger les admins/staff vers l'interface d'administration
  if (user && ['admin', 'manager', 'staff'].includes(user.role)) {
    window.location.href = '/admin';
    return null;
  }

  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <TooltipProvider>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" component={HomePage} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/menu" component={() => <ClientProtectedRoute><MenuPage /></ClientProtectedRoute>} />
                <Route path="/reservations" component={() => <ClientProtectedRoute><ReservationsPage /></ClientProtectedRoute>} />
                <Route path="/gallery" component={() => <ClientProtectedRoute><GalleryPage /></ClientProtectedRoute>} />
                <Route path="/contact" component={() => <ClientProtectedRoute><ContactPage /></ClientProtectedRoute>} />
                <Route path="/dashboard" component={() => <ClientProtectedRoute><Dashboard /></ClientProtectedRoute>} />
                <Route component={NotFound} />
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
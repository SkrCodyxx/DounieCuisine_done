import { useAuth } from "./useAuth";

export function useUser() {
  try {
    const { user, isLoading } = useAuth();
    
    return {
      user,
      isLoading,
    };
  } catch (error) {
    // Si useAuth échoue (pas dans un AuthProvider), retourner des valeurs par défaut
    console.warn("useUser called outside AuthProvider:", error);
    return {
      user: null,
      isLoading: false,
    };
  }
}
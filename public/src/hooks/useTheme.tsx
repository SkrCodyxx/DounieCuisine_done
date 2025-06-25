import { useTheme as useThemeProvider } from "@/components/theme/ThemeProvider";

// Re-export the theme hook for consistency
export const useTheme = useThemeProvider;

// Additional theme utilities
export function useThemeColors() {
  const { currentTheme } = useThemeProvider();
  
  const getThemeColors = () => {
    if (!currentTheme?.colors) {
      return {
        primary: "hsl(207, 90%, 54%)",
        secondary: "hsl(60, 4.8%, 95.9%)",
        accent: "hsl(60, 4.8%, 95.9%)",
        background: "hsl(0, 0%, 100%)",
      };
    }
    
    return currentTheme.colors;
  };

  const getThemeClass = () => {
    if (!currentTheme) return "";
    
    const themeMap: Record<string, string> = {
      "Noël": "festive-christmas",
      "Christmas": "festive-christmas",
      "Saint-Valentin": "festive-valentine",
      "Valentine's Day": "festive-valentine",
      "Pâques": "festive-easter",
      "Easter": "festive-easter",
      "Halloween": "festive-halloween",
      "Fête du Canada": "festive-canada",
      "Canada Day": "festive-canada",
      "Indépendance Haïti": "festive-haiti",
      "Haiti Independence": "festive-haiti",
      "Printemps": "festive-spring",
      "Spring": "festive-spring",
      "Été": "festive-summer",
      "Summer": "festive-summer",
    };
    
    return themeMap[currentTheme.name] || "";
  };

  return {
    currentTheme,
    getThemeColors,
    getThemeClass,
  };
}

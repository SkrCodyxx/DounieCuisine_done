import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface FestiveTheme {
  id: number;
  name: string;
  nameEn: string;
  description?: string;
  isActive: boolean;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  animations?: Record<string, boolean>;
  icons?: Record<string, string>;
}

interface ThemeContextType {
  currentTheme: FestiveTheme | null;
  themes: FestiveTheme[];
  isLoading: boolean;
  activateTheme: (themeId: number) => Promise<void>;
  getThemeClass: () => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<FestiveTheme | null>(null);
  
  // Fetch active theme
  const { data: activeTheme, isLoading: activeThemeLoading } = useQuery({
    queryKey: ["/api/themes/active"],
    refetchInterval: 60000, // Check for theme changes every minute
  });
  
  // Fetch all themes
  const { data: themes = [], isLoading: themesLoading } = useQuery({
    queryKey: ["/api/themes"],
  });
  
  const isLoading = activeThemeLoading || themesLoading;
  
  useEffect(() => {
    if (activeTheme) {
      setCurrentTheme(activeTheme);
      applyThemeToDOM(activeTheme);
    } else {
      // Reset to default theme
      setCurrentTheme(null);
      resetThemeToDefault();
    }
  }, [activeTheme]);
  
  const activateTheme = async (themeId: number) => {
    try {
      const response = await fetch(`/api/themes/${themeId}/activate`, {
        method: "PUT",
        credentials: "include",
      });
      
      if (response.ok) {
        const theme = await response.json();
        setCurrentTheme(theme);
        applyThemeToDOM(theme);
      }
    } catch (error) {
      console.error("Failed to activate theme:", error);
    }
  };
  
  const applyThemeToDOM = (theme: FestiveTheme) => {
    const root = document.documentElement;
    
    // Apply theme colors as CSS variables
    if (theme.colors) {
      root.style.setProperty("--primary", theme.colors.primary);
      root.style.setProperty("--secondary", theme.colors.secondary);
      root.style.setProperty("--accent", theme.colors.accent);
      
      // Update festive color variables
      root.style.setProperty("--festive-primary", theme.colors.primary);
      root.style.setProperty("--festive-secondary", theme.colors.secondary);
      root.style.setProperty("--festive-accent", theme.colors.accent);
    }
    
    // Apply theme class to body
    document.body.className = document.body.className.replace(/festive-\w+/g, "");
    if (theme.name) {
      const themeClass = getThemeClassName(theme.name);
      document.body.classList.add(themeClass);
    }
  };
  
  const resetThemeToDefault = () => {
    const root = document.documentElement;
    
    // Reset to default values
    root.style.setProperty("--primary", "hsl(207, 90%, 54%)");
    root.style.setProperty("--secondary", "hsl(60, 4.8%, 95.9%)");
    root.style.setProperty("--accent", "hsl(60, 4.8%, 95.9%)");
    
    // Remove festive classes
    document.body.className = document.body.className.replace(/festive-\w+/g, "");
  };
  
  const getThemeClassName = (themeName: string): string => {
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
    
    return themeMap[themeName] || "";
  };
  
  const getThemeClass = (): string => {
    if (!currentTheme) return "";
    return getThemeClassName(currentTheme.name);
  };
  
  const value: ThemeContextType = {
    currentTheme,
    themes,
    isLoading,
    activateTheme,
    getThemeClass,
  };
  
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

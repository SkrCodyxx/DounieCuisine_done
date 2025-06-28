// Theme utility functions

export interface ThemeConfig {
  name: string;
  nameEn: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  animations?: Record<string, boolean>;
  icons?: Record<string, string>;
}

export const THEME_CONFIGS: Record<string, ThemeConfig> = {
  christmas: {
    name: "Noël",
    nameEn: "Christmas",
    colors: {
      primary: "hsl(0, 84%, 55%)", // festive red
      secondary: "hsl(140, 70%, 45%)", // festive green
      accent: "hsl(45, 85%, 50%)", // festive gold
      background: "hsl(0, 0%, 100%)",
    },
    animations: {
      snowfall: true,
      sparkles: true,
    },
    icons: {
      tree: "fas fa-tree",
      gift: "fas fa-gift",
      star: "fas fa-star",
    },
  },
  valentine: {
    name: "Saint-Valentin",
    nameEn: "Valentine's Day",
    colors: {
      primary: "hsl(330, 75%, 60%)", // pink
      secondary: "hsl(0, 70%, 50%)", // red
      accent: "hsl(320, 85%, 70%)", // light pink
      background: "hsl(350, 100%, 98%)",
    },
    animations: {
      hearts: true,
      sparkles: true,
    },
    icons: {
      heart: "fas fa-heart",
      rose: "fas fa-rose",
      kiss: "fas fa-kiss",
    },
  },
  easter: {
    name: "Pâques",
    nameEn: "Easter",
    colors: {
      primary: "hsl(55, 85%, 65%)", // yellow
      secondary: "hsl(110, 60%, 55%)", // spring green
      accent: "hsl(280, 70%, 70%)", // lavender
      background: "hsl(120, 40%, 98%)",
    },
    animations: {
      butterflies: true,
      flowers: true,
    },
    icons: {
      egg: "fas fa-egg",
      rabbit: "fas fa-rabbit",
      flower: "fas fa-seedling",
    },
  },
  halloween: {
    name: "Halloween",
    nameEn: "Halloween",
    colors: {
      primary: "hsl(25, 85%, 55%)", // orange
      secondary: "hsl(0, 0%, 10%)", // black
      accent: "hsl(280, 85%, 45%)", // purple
      background: "hsl(25, 30%, 5%)",
    },
    animations: {
      bats: true,
      spiders: true,
      fog: true,
    },
    icons: {
      pumpkin: "fas fa-pumpkin",
      ghost: "fas fa-ghost",
      spider: "fas fa-spider",
    },
  },
  canada: {
    name: "Fête du Canada",
    nameEn: "Canada Day",
    colors: {
      primary: "hsl(0, 75%, 50%)", // red
      secondary: "hsl(0, 0%, 100%)", // white
      accent: "hsl(0, 75%, 40%)", // dark red
      background: "hsl(0, 50%, 98%)",
    },
    animations: {
      fireworks: true,
      flags: true,
    },
    icons: {
      maple: "fas fa-maple-leaf",
      flag: "fas fa-flag",
      firework: "fas fa-sparkles",
    },
  },
  haiti: {
    name: "Indépendance Haïti",
    nameEn: "Haiti Independence",
    colors: {
      primary: "hsl(220, 85%, 50%)", // blue
      secondary: "hsl(0, 85%, 50%)", // red
      accent: "hsl(45, 85%, 50%)", // gold
      background: "hsl(220, 30%, 98%)",
    },
    animations: {
      flags: true,
      stars: true,
    },
    icons: {
      flag: "fas fa-flag",
      star: "fas fa-star",
      heart: "fas fa-heart",
    },
  },
  spring: {
    name: "Printemps",
    nameEn: "Spring",
    colors: {
      primary: "hsl(110, 60%, 50%)", // green
      secondary: "hsl(340, 75%, 65%)", // pink
      accent: "hsl(55, 85%, 60%)", // yellow
      background: "hsl(110, 40%, 98%)",
    },
    animations: {
      flowers: true,
      butterflies: true,
      leaves: true,
    },
    icons: {
      flower: "fas fa-seedling",
      butterfly: "fas fa-spa",
      sun: "fas fa-sun",
    },
  },
  summer: {
    name: "Été",
    nameEn: "Summer",
    colors: {
      primary: "hsl(200, 85%, 55%)", // blue
      secondary: "hsl(55, 85%, 60%)", // yellow
      accent: "hsl(25, 85%, 55%)", // orange
      background: "hsl(200, 60%, 98%)",
    },
    animations: {
      waves: true,
      sunshine: true,
    },
    icons: {
      sun: "fas fa-sun",
      umbrella: "fas fa-umbrella-beach",
      wave: "fas fa-water",
    },
  },
};

/**
 * Get theme configuration by name
 */
export function getThemeConfig(themeName: string): ThemeConfig | null {
  const normalizedName = themeName.toLowerCase();
  
  for (const [key, config] of Object.entries(THEME_CONFIGS)) {
    if (config.name.toLowerCase() === normalizedName || 
        config.nameEn.toLowerCase() === normalizedName ||
        key === normalizedName) {
      return config;
    }
  }
  
  return null;
}

/**
 * Apply theme to DOM
 */
export function applyThemeToDOM(theme: ThemeConfig): void {
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
  
  // Apply theme class to html (not body)
  document.documentElement.className = document.documentElement.className.replace(/festive-\w+/g, "");
  const themeClass = getThemeClassName(theme.name);
  if (themeClass) {
    document.documentElement.classList.add(themeClass);
  }
}

/**
 * Get CSS class name for theme
 */
export function getThemeClassName(themeName: string): string {
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
}

/**
 * Check if date falls within theme date range
 */
export function isDateInThemeRange(
  date: Date,
  startMonth: number,
  startDay: number,
  endMonth: number,
  endDay: number
): boolean {
  const month = date.getMonth() + 1; // JavaScript months are 0-indexed
  const day = date.getDate();
  
  const currentDate = month * 100 + day; // MMDD format
  const startDate = startMonth * 100 + startDay;
  const endDate = endMonth * 100 + endDay;
  
  // Handle year-crossing themes (like Christmas: Dec 15 - Jan 7)
  if (startDate > endDate) {
    return currentDate >= startDate || currentDate <= endDate;
  }
  
  return currentDate >= startDate && currentDate <= endDate;
}

/**
 * Get current active theme based on date
 */
export function getCurrentThemeByDate(): ThemeConfig | null {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();
  
  // Christmas: Dec 15 - Jan 7
  if (isDateInThemeRange(now, 12, 15, 1, 7)) {
    return THEME_CONFIGS.christmas;
  }
  
  // Valentine's Day: Feb 10-17
  if (isDateInThemeRange(now, 2, 10, 2, 17)) {
    return THEME_CONFIGS.valentine;
  }
  
  // Easter: Mar 20 - Apr 20 (simplified)
  if (isDateInThemeRange(now, 3, 20, 4, 20)) {
    return THEME_CONFIGS.easter;
  }
  
  // Halloween: Oct 25-31
  if (isDateInThemeRange(now, 10, 25, 10, 31)) {
    return THEME_CONFIGS.halloween;
  }
  
  // Canada Day: Jun 28 - Jul 3
  if (isDateInThemeRange(now, 6, 28, 7, 3)) {
    return THEME_CONFIGS.canada;
  }
  
  // Haiti Independence: Jan 1
  if (currentMonth === 1 && currentDay === 1) {
    return THEME_CONFIGS.haiti;
  }
  
  // Spring: Mar 20 - Jun 20
  if (isDateInThemeRange(now, 3, 20, 6, 20)) {
    return THEME_CONFIGS.spring;
  }
  
  // Summer: Jun 21 - Sep 22
  if (isDateInThemeRange(now, 6, 21, 9, 22)) {
    return THEME_CONFIGS.summer;
  }
  
  return null;
}

import type { IStorage } from "../storage";
import type { FestiveTheme } from "../shared/schema";

export interface ThemeConfig {
  name: string;
  nameEn: string;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  animations: Record<string, boolean>;
  icons: Record<string, string>;
}

const THEME_CONFIGS: ThemeConfig[] = [
  {
    name: "Noël",
    nameEn: "Christmas",
    startMonth: 12,
    startDay: 15,
    endMonth: 1,
    endDay: 7,
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
  {
    name: "Saint-Valentin",
    nameEn: "Valentine's Day",
    startMonth: 2,
    startDay: 10,
    endMonth: 2,
    endDay: 17,
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
  {
    name: "Pâques",
    nameEn: "Easter",
    startMonth: 3, // Will be calculated dynamically
    startDay: 20,
    endMonth: 4,
    endDay: 20,
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
  {
    name: "Halloween",
    nameEn: "Halloween",
    startMonth: 10,
    startDay: 25,
    endMonth: 10,
    endDay: 31,
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
  {
    name: "Fête du Canada",
    nameEn: "Canada Day",
    startMonth: 6,
    startDay: 28,
    endMonth: 7,
    endDay: 3,
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
  {
    name: "Indépendance Haïti",
    nameEn: "Haiti Independence",
    startMonth: 1,
    startDay: 1,
    endMonth: 1,
    endDay: 1,
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
  {
    name: "Printemps",
    nameEn: "Spring",
    startMonth: 3,
    startDay: 20,
    endMonth: 6,
    endDay: 20,
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
  {
    name: "Été",
    nameEn: "Summer",
    startMonth: 6,
    startDay: 21,
    endMonth: 9,
    endDay: 22,
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
];

/**
 * Get the current theme based on today's date
 */
export function getCurrentTheme(): ThemeConfig | null {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
  const currentDay = now.getDate();
  
  for (const theme of THEME_CONFIGS) {
    if (isDateInThemeRange(currentMonth, currentDay, theme)) {
      return theme;
    }
  }
  
  return null; // No theme active
}

/**
 * Check if a date falls within a theme's date range
 */
function isDateInThemeRange(month: number, day: number, theme: ThemeConfig): boolean {
  const currentDate = month * 100 + day; // MMDD format
  const startDate = theme.startMonth * 100 + theme.startDay;
  const endDate = theme.endMonth * 100 + theme.endDay;
  
  // Handle year-crossing themes (like Christmas: Dec 15 - Jan 7)
  if (startDate > endDate) {
    return currentDate >= startDate || currentDate <= endDate;
  }
  
  return currentDate >= startDate && currentDate <= endDate;
}

/**
 * Update the active theme automatically based on current date
 */
export async function updateThemeAutomatically(storage: IStorage): Promise<void> {
  const currentThemeConfig = getCurrentTheme();
  const activeTheme = await storage.getActiveFestiveTheme();
  
  // If no theme should be active
  if (!currentThemeConfig) {
    if (activeTheme) {
      await storage.updateFestiveTheme(activeTheme.id, { isActive: false });
    }
    return;
  }
  
  // If the correct theme is already active
  if (activeTheme && activeTheme.name === currentThemeConfig.name) {
    return;
  }
  
  // Find or create the theme that should be active
  const allThemes = await storage.getFestiveThemes();
  let targetTheme = allThemes.find(theme => theme.name === currentThemeConfig.name);
  
  // Create theme if it doesn't exist
  if (!targetTheme) {
    targetTheme = await storage.createFestiveTheme({
      name: currentThemeConfig.name,
      nameEn: currentThemeConfig.nameEn,
      description: `Thème automatique pour ${currentThemeConfig.name}`,
      isActive: false,
      isAutomatic: true,
      startDate: `2024-${currentThemeConfig.startMonth.toString().padStart(2, '0')}-${currentThemeConfig.startDay.toString().padStart(2, '0')}`,
      endDate: `2024-${currentThemeConfig.endMonth.toString().padStart(2, '0')}-${currentThemeConfig.endDay.toString().padStart(2, '0')}`,
      colors: currentThemeConfig.colors,
      animations: currentThemeConfig.animations,
      icons: currentThemeConfig.icons,
      priority: 1,
      recurringYearly: true,
    });
  }
  
  // Deactivate all themes
  for (const theme of allThemes) {
    if (theme.isActive) {
      await storage.updateFestiveTheme(theme.id, { isActive: false });
    }
  }
  
  // Activate the target theme
  await storage.updateFestiveTheme(targetTheme.id, { isActive: true });
}

/**
 * Get all available themes with their date ranges
 */
export function getAllThemeConfigs(): ThemeConfig[] {
  return THEME_CONFIGS;
}

/**
 * Check if a specific date would activate a theme
 */
export function getThemeForDate(date: Date): ThemeConfig | null {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  for (const theme of THEME_CONFIGS) {
    if (isDateInThemeRange(month, day, theme)) {
      return theme;
    }
  }
  
  return null;
}

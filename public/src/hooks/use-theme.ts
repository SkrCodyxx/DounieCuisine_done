import { useQuery } from "@tanstack/react-query";

export function useTheme() {
  const { data: activeTheme } = useQuery({
    queryKey: ["active-theme"],
    queryFn: async () => {
      const response = await fetch("/api/themes/active");
      if (!response.ok) throw new Error("Failed to fetch active theme");
      return response.json();
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const applyTheme = () => {
    if (!activeTheme) return;

    // Supprimer les classes de thème existantes
    document.documentElement.classList.remove("theme-haiti", "theme-summer", "theme-christmas", "theme-carnival");

    // Ajouter la nouvelle classe de thème
    if (activeTheme.name === "Haïti") {
      document.documentElement.classList.add("theme-haiti");
    } else if (activeTheme.name === "Été") {
      document.documentElement.classList.add("theme-summer");
    } else if (activeTheme.name === "Noël") {
      document.documentElement.classList.add("theme-christmas");
    } else if (activeTheme.name === "Carnaval") {
      document.documentElement.classList.add("theme-carnival");
    }

    // Appliquer les couleurs personnalisées si disponibles
    if (activeTheme.colors) {
      const root = document.documentElement;
      if (activeTheme.colors.primary) {
        root.style.setProperty("--primary", activeTheme.colors.primary);
      }
      if (activeTheme.colors.secondary) {
        root.style.setProperty("--secondary", activeTheme.colors.secondary);
      }
      if (activeTheme.colors.accent) {
        root.style.setProperty("--accent", activeTheme.colors.accent);
      }
    }

    // Ajouter des animations si disponibles
    if (activeTheme.animations) {
      addThemeAnimations(activeTheme.animations);
    }
  };

  const addThemeAnimations = (animations: any) => {
    // Supprimer les animations existantes
    const existingAnimations = document.querySelectorAll('.theme-animation');
    existingAnimations.forEach(el => el.remove());

    // Ajouter les nouvelles animations
    if (animations.snowfall) {
      addSnowfall();
    }
    if (animations.hearts) {
      addHearts();
    }
    if (animations.confetti) {
      addConfetti();
    }
  };

  const addSnowfall = () => {
    for (let i = 0; i < 50; i++) {
      const snowflake = document.createElement('div');
      snowflake.innerHTML = '❄️';
      snowflake.className = 'snowflake theme-animation';
      snowflake.style.left = Math.random() * 100 + 'vw';
      snowflake.style.animationDuration = Math.random() * 3 + 2 + 's';
      snowflake.style.opacity = Math.random().toString();
      snowflake.style.fontSize = Math.random() * 10 + 10 + 'px';
      document.body.appendChild(snowflake);
    }
  };

  const addHearts = () => {
    for (let i = 0; i < 30; i++) {
      const heart = document.createElement('div');
      heart.innerHTML = '💖';
      heart.className = 'heart theme-animation';
      heart.style.left = Math.random() * 100 + 'vw';
      heart.style.animationDuration = Math.random() * 4 + 3 + 's';
      heart.style.opacity = Math.random().toString();
      heart.style.fontSize = Math.random() * 15 + 15 + 'px';
      document.body.appendChild(heart);
    }
  };

  const addConfetti = () => {
    for (let i = 0; i < 40; i++) {
      const confetti = document.createElement('div');
      const colors = ['🎊', '🎉', '🎈', '🎁'];
      confetti.innerHTML = colors[Math.floor(Math.random() * colors.length)];
      confetti.className = 'heart theme-animation'; // Réutilise l'animation heart
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.animationDuration = Math.random() * 4 + 2 + 's';
      confetti.style.opacity = Math.random().toString();
      confetti.style.fontSize = Math.random() * 12 + 12 + 'px';
      document.body.appendChild(confetti);
    }
  };

  return {
    activeTheme,
    applyTheme,
  };
}
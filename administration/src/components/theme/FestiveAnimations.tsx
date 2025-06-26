import React, { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

interface AnimationElement {
  id: string;
  type: string;
  x: number;
  y: number;
  size: number;
  speed: number;
  rotation: number;
}

export function FestiveAnimations() {
  const { currentTheme } = useTheme();
  const [elements, setElements] = useState<AnimationElement[]>([]);
  const [animationId, setAnimationId] = useState<number | null>(null);

  useEffect(() => {
    // Clear existing animations
    if (animationId) {
      cancelAnimationFrame(animationId);
      setAnimationId(null);
    }
    setElements([]);

    if (!currentTheme?.animations) return;

    // Start animations based on theme
    const animations = currentTheme.animations;
    
    if (animations.snowfall) {
      startSnowfall();
    } else if (animations.hearts) {
      startHearts();
    } else if (animations.butterflies) {
      startButterflies();
    } else if (animations.sparkles) {
      startSparkles();
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [currentTheme]);

  const startSnowfall = () => {
    const snowflakes: AnimationElement[] = [];
    
    const createSnowflake = () => ({
      id: Math.random().toString(36).substr(2, 9),
      type: "snowflake",
      x: Math.random() * window.innerWidth,
      y: -10,
      size: Math.random() * 20 + 10,
      speed: Math.random() * 2 + 1,
      rotation: 0,
    });

    // Create initial snowflakes
    for (let i = 0; i < 50; i++) {
      snowflakes.push({
        ...createSnowflake(),
        y: Math.random() * window.innerHeight,
      });
    }

    const animate = () => {
      setElements(prev => {
        const updated = prev.map(flake => ({
          ...flake,
          y: flake.y + flake.speed,
          rotation: flake.rotation + 1,
        })).filter(flake => flake.y < window.innerHeight + 20);

        // Add new snowflakes occasionally
        if (Math.random() < 0.3 && updated.length < 100) {
          updated.push(createSnowflake());
        }

        return updated;
      });

      setAnimationId(requestAnimationFrame(animate));
    };

    setElements(snowflakes);
    setAnimationId(requestAnimationFrame(animate));
  };

  const startHearts = () => {
    const hearts: AnimationElement[] = [];
    
    const createHeart = () => ({
      id: Math.random().toString(36).substr(2, 9),
      type: "heart",
      x: Math.random() * window.innerWidth,
      y: window.innerHeight + 10,
      size: Math.random() * 15 + 15,
      speed: Math.random() * 1.5 + 0.5,
      rotation: Math.random() * 360,
    });

    const animate = () => {
      setElements(prev => {
        const updated = prev.map(heart => ({
          ...heart,
          y: heart.y - heart.speed,
          x: heart.x + Math.sin(heart.y * 0.01) * 2,
          rotation: heart.rotation + 2,
        })).filter(heart => heart.y > -50);

        // Add new hearts occasionally
        if (Math.random() < 0.1 && updated.length < 30) {
          updated.push(createHeart());
        }

        return updated;
      });

      setAnimationId(requestAnimationFrame(animate));
    };

    setAnimationId(requestAnimationFrame(animate));
  };

  const startButterflies = () => {
    const butterflies: AnimationElement[] = [];
    
    const createButterfly = () => ({
      id: Math.random().toString(36).substr(2, 9),
      type: "butterfly",
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 10 + 20,
      speed: Math.random() * 0.5 + 0.3,
      rotation: Math.random() * 360,
    });

    // Create initial butterflies
    for (let i = 0; i < 8; i++) {
      butterflies.push(createButterfly());
    }

    const animate = () => {
      setElements(prev => prev.map(butterfly => ({
        ...butterfly,
        x: butterfly.x + Math.sin(Date.now() * 0.001 + butterfly.id.charCodeAt(0)) * butterfly.speed,
        y: butterfly.y + Math.cos(Date.now() * 0.001 + butterfly.id.charCodeAt(0)) * butterfly.speed,
        rotation: butterfly.rotation + 0.5,
      })));

      setAnimationId(requestAnimationFrame(animate));
    };

    setElements(butterflies);
    setAnimationId(requestAnimationFrame(animate));
  };

  const startSparkles = () => {
    const sparkles: AnimationElement[] = [];
    
    const createSparkle = () => ({
      id: Math.random().toString(36).substr(2, 9),
      type: "sparkle",
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 8 + 5,
      speed: 0,
      rotation: 0,
    });

    const animate = () => {
      setElements(prev => {
        // Remove old sparkles
        const filtered = prev.filter(sparkle => Date.now() - parseInt(sparkle.id, 36) < 2000);
        
        // Add new sparkles occasionally
        if (Math.random() < 0.1 && filtered.length < 20) {
          filtered.push(createSparkle());
        }

        return filtered;
      });

      setAnimationId(requestAnimationFrame(animate));
    };

    setAnimationId(requestAnimationFrame(animate));
  };

  const getElementSymbol = (type: string): string => {
    switch (type) {
      case "snowflake": return "❄";
      case "heart": return "💖";
      case "butterfly": return "🦋";
      case "sparkle": return "✨";
      default: return "•";
    }
  };

  const getElementColor = (type: string): string => {
    switch (type) {
      case "snowflake": return "text-white";
      case "heart": return "text-pink-500";
      case "butterfly": return "text-yellow-400";
      case "sparkle": return "text-yellow-300";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {elements.map(element => (
        <div
          key={element.id}
          className={`absolute festive-element ${getElementColor(element.type)} transition-opacity duration-1000`}
          style={{
            left: `${element.x}px`,
            top: `${element.y}px`,
            fontSize: `${element.size}px`,
            transform: `rotate(${element.rotation}deg)`,
            opacity: element.type === "sparkle" ? Math.sin(Date.now() * 0.005) * 0.5 + 0.5 : 1,
          }}
        >
          {getElementSymbol(element.type)}
        </div>
      ))}
    </div>
  );
}

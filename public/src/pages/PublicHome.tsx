import React from "react";
import { PublicSite } from "@/components/public/PublicSite";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Settings, ArrowRight } from "lucide-react";

export default function PublicHome() {
  const { currentTheme } = useTheme();

  return (
    <div className="min-h-screen">
      {/* Admin Access Banner (only show if not in iframe) */}
      {window.self === window.top && (
        <div className="bg-gray-900 text-white p-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                Mode Prévisualisation
              </Badge>
              {currentTheme && (
                <span className="text-sm">
                  Thème {currentTheme.name} actif
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                onClick={() => window.open("/admin", "_blank")}
              >
                <Settings className="w-4 h-4 mr-1" />
                Administration
              </Button>
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700"
                onClick={() => window.open("/login", "_self")}
              >
                <ArrowRight className="w-4 h-4 mr-1" />
                Se connecter
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Public Site Content */}
      <PublicSite />
    </div>
  );
}

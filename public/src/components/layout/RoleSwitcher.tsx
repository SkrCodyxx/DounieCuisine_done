import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  UserCheck, 
  Users, 
  ArrowLeftRight,
  Shield,
  User,
} from "lucide-react";

export function RoleSwitcher() {
  const { user } = useAuth();
  const [currentMode, setCurrentMode] = useState<"admin" | "client">("admin");

  if (!user?.isEmployeeClient) return null;

  const toggleMode = () => {
    setCurrentMode(prev => prev === "admin" ? "client" : "admin");
  };

  return (
    <div className="mb-6 p-3 bg-gray-800 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm">
            Mode {currentMode === "admin" ? "Administrateur" : "Client"}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4" />
          <Switch
            checked={currentMode === "admin"}
            onCheckedChange={toggleMode}
            className="data-[state=checked]:bg-red-600"
          />
          <Shield className="w-4 h-4" />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <Badge variant="secondary" className="text-xs">
          <UserCheck className="w-3 h-3 mr-1" />
          Employé-Client
        </Badge>
        
        <Button
          size="sm"
          variant="outline"
          onClick={toggleMode}
          className="text-xs border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <ArrowLeftRight className="w-3 h-3 mr-1" />
          Basculer
        </Button>
      </div>
      
      <div className="mt-2 text-xs text-gray-400">
        {currentMode === "admin" ? (
          <div className="flex items-center">
            <Shield className="w-3 h-3 mr-1" />
            Accès complet administration
          </div>
        ) : (
          <div className="flex items-center">
            <User className="w-3 h-3 mr-1" />
            Vue client avec fidélité
          </div>
        )}
      </div>
    </div>
  );
}

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Plus, 
  RefreshCw, 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  eventType: string;
  startTime: string;
  endTime: string;
  location?: string;
  priority: string;
  status: string;
}

export function EmployeeCalendar() {
  const { data: events = [], isLoading } = useQuery<CalendarEvent[]>({
    queryKey: ["/api/calendar/events"],
  });

  if (isLoading) {
    return (
      <Card className="christmas-border">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getEventTypeColor = (eventType: string) => {
    const colors: Record<string, string> = {
      special_event: "border-red-500 bg-red-50",
      payroll: "border-green-500 bg-green-50",
      reservation: "border-orange-500 bg-orange-50",
      shift: "border-blue-500 bg-blue-50",
      meeting: "border-purple-500 bg-purple-50",
    };
    return colors[eventType] || "border-gray-500 bg-gray-50";
  };

  const getEventTypeBadge = (eventType: string) => {
    const badges: Record<string, { label: string; variant: any }> = {
      special_event: { label: "Événement", variant: "destructive" },
      payroll: { label: "Paie", variant: "default" },
      reservation: { label: "Réservation", variant: "secondary" },
      shift: { label: "Service", variant: "outline" },
      meeting: { label: "Réunion", variant: "secondary" },
    };
    const badge = badges[eventType] || { label: "Autre", variant: "outline" };
    return <Badge variant={badge.variant} className="text-xs">{badge.label}</Badge>;
  };

  const upcomingEvents = events
    .filter(event => new Date(event.startTime) >= new Date())
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 3);

  return (
    <Card className="christmas-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Calendrier Employés
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" className="text-green-600">
              <Plus className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-red-600">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CalendarIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Aucun événement à venir</p>
            </div>
          ) : (
            upcomingEvents.map((event) => (
              <div
                key={event.id}
                className={`p-3 border-l-4 rounded-r ${getEventTypeColor(event.eventType)}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Clock className="w-4 h-4 mr-1" />
                      {format(new Date(event.startTime), "d MMMM, HH:mm", { locale: fr })}
                    </div>
                    {event.description && (
                      <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                    )}
                    {event.location && (
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {event.location}
                      </div>
                    )}
                  </div>
                  {getEventTypeBadge(event.eventType)}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 pt-4 border-t">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.open("/admin/calendar", "_blank")}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Voir Calendrier Complet
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

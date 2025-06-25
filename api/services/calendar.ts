import type { CalendarEvent, InsertCalendarEvent } from "../shared/schema";
import type { IStorage } from "../storage";

export interface PayrollEvent {
  employeeId: number;
  grossPay: number;
  netPay: number;
  payPeriodStart: string;
  payPeriodEnd: string;
}

export interface SpecialEvent {
  title: string;
  description: string;
  type: "staff_party" | "training" | "special_reservation" | "maintenance";
  priority: "low" | "normal" | "high" | "urgent";
  requiredStaff?: number[];
  customData?: Record<string, any>;
}

/**
 * Generate automatic payroll events for employees
 */
export async function generatePayrollEvents(
  storage: IStorage,
  year: number = new Date().getFullYear()
): Promise<CalendarEvent[]> {
  const employees = await storage.getEmployees();
  const payrollEvents: CalendarEvent[] = [];
  
  // Generate bi-weekly payroll events
  const payrollDates = generateBiWeeklyPayrollDates(year);
  
  for (const payDate of payrollDates) {
    const payrollEvent: InsertCalendarEvent = {
      title: "Paie des Employés",
      description: "Traitement automatique de la paie pour tous les employés",
      eventType: "payroll",
      startTime: new Date(`${payDate}T17:00:00`),
      endTime: new Date(`${payDate}T18:00:00`),
      allDay: false,
      location: "Bureau Administration",
      attendees: employees.map(emp => emp.userId),
      priority: "high",
      status: "scheduled",
      isPublic: false,
      createdBy: 1, // Admin user
    };
    
    const event = await storage.createCalendarEvent(payrollEvent);
    payrollEvents.push(event);
  }
  
  return payrollEvents;
}

/**
 * Generate bi-weekly payroll dates for a year
 */
function generateBiWeeklyPayrollDates(year: number): string[] {
  const dates: string[] = [];
  
  // Start from first Friday of January
  let currentDate = new Date(year, 0, 1);
  while (currentDate.getDay() !== 5) { // Find first Friday
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Generate bi-weekly dates
  while (currentDate.getFullYear() === year) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 14); // Add 2 weeks
  }
  
  return dates;
}

/**
 * Create special restaurant events
 */
export async function createSpecialEvents(
  storage: IStorage,
  year: number = new Date().getFullYear()
): Promise<CalendarEvent[]> {
  const specialEvents: SpecialEvent[] = [
    {
      title: "Party de Noël - Staff",
      description: "Célébration de Noël pour tous les employés. Restaurant fermé pour les clients.",
      type: "staff_party",
      priority: "high",
      customData: {
        restaurantClosed: true,
        cateringProvided: true,
        dresscode: "festive",
      },
    },
    {
      title: "Formation Sécurité Alimentaire",
      description: "Formation obligatoire sur les normes de sécurité alimentaire HACCP",
      type: "training",
      priority: "high",
      customData: {
        mandatory: true,
        certificateProvided: true,
        duration: "4 heures",
      },
    },
    {
      title: "Réveillon du Nouvel An - Service Spécial",
      description: "Service spécial pour le réveillon avec menu dégustation",
      type: "special_reservation",
      priority: "urgent",
      customData: {
        specialMenu: true,
        advancedReservation: true,
        staffBonus: true,
      },
    },
    {
      title: "Maintenance Équipement Cuisine",
      description: "Maintenance préventive de tous les équipements de cuisine",
      type: "maintenance",
      priority: "normal",
      customData: {
        kitchenClosed: true,
        vendorRequired: true,
        estimatedDuration: "6 heures",
      },
    },
  ];
  
  const events: CalendarEvent[] = [];
  
  for (const specialEvent of specialEvents) {
    const eventDate = getEventDate(specialEvent, year);
    
    const calendarEvent: InsertCalendarEvent = {
      title: specialEvent.title,
      description: specialEvent.description,
      eventType: "special_event",
      startTime: eventDate.start,
      endTime: eventDate.end,
      allDay: specialEvent.type === "maintenance",
      location: "Restaurant Dounie Cuisine",
      attendees: await getAllStaffIds(storage),
      priority: specialEvent.priority,
      status: "scheduled",
      isPublic: false,
      createdBy: 1, // Admin user
    };
    
    const event = await storage.createCalendarEvent(calendarEvent);
    events.push(event);
  }
  
  return events;
}

/**
 * Get event dates based on type and year
 */
function getEventDate(event: SpecialEvent, year: number): { start: Date; end: Date } {
  switch (event.title) {
    case "Party de Noël - Staff":
      return {
        start: new Date(year, 11, 23, 19, 0), // Dec 23, 7 PM
        end: new Date(year, 11, 23, 23, 0),   // Dec 23, 11 PM
      };
    case "Formation Sécurité Alimentaire":
      return {
        start: new Date(year, 2, 15, 9, 0),   // Mar 15, 9 AM
        end: new Date(year, 2, 15, 13, 0),    // Mar 15, 1 PM
      };
    case "Réveillon du Nouvel An - Service Spécial":
      return {
        start: new Date(year, 11, 31, 18, 0), // Dec 31, 6 PM
        end: new Date(year + 1, 0, 1, 2, 0),  // Jan 1, 2 AM
      };
    case "Maintenance Équipement Cuisine":
      return {
        start: new Date(year, 6, 15, 8, 0),   // Jul 15, 8 AM
        end: new Date(year, 6, 15, 14, 0),    // Jul 15, 2 PM
      };
    default:
      return {
        start: new Date(year, 0, 1, 9, 0),
        end: new Date(year, 0, 1, 17, 0),
      };
  }
}

/**
 * Get all staff user IDs
 */
async function getAllStaffIds(storage: IStorage): Promise<number[]> {
  const employees = await storage.getEmployees();
  return employees.map(emp => emp.userId);
}

/**
 * Create reminder events for important dates
 */
export async function createReminderEvents(
  storage: IStorage,
  year: number = new Date().getFullYear()
): Promise<CalendarEvent[]> {
  const reminders = [
    {
      title: "Déclaration Taxes Trimestrielle",
      description: "Rappel: Déposer la déclaration de TPS/TVQ",
      date: new Date(year, 3, 30), // April 30
      priority: "urgent" as const,
    },
    {
      title: "Renouvellement Permis Restaurant",
      description: "Renouveler le permis d'exploitation du restaurant",
      date: new Date(year, 11, 1), // December 1
      priority: "high" as const,
    },
    {
      title: "Révision Menu Saisonnier",
      description: "Planifier les changements de menu pour la nouvelle saison",
      date: new Date(year, 2, 1), // March 1
      priority: "normal" as const,
    },
  ];
  
  const events: CalendarEvent[] = [];
  
  for (const reminder of reminders) {
    const reminderEvent: InsertCalendarEvent = {
      title: reminder.title,
      description: reminder.description,
      eventType: "meeting",
      startTime: reminder.date,
      endTime: new Date(reminder.date.getTime() + 60 * 60 * 1000), // 1 hour
      allDay: false,
      location: "Bureau Administration",
      attendees: [1], // Admin only
      priority: reminder.priority,
      status: "scheduled",
      isPublic: false,
      createdBy: 1,
    };
    
    const event = await storage.createCalendarEvent(reminderEvent);
    events.push(event);
  }
  
  return events;
}

/**
 * Get upcoming events for dashboard
 */
export async function getUpcomingEvents(
  storage: IStorage,
  days: number = 7
): Promise<CalendarEvent[]> {
  const startDate = new Date().toISOString().split('T')[0];
  const endDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000)
    .toISOString().split('T')[0];
  
  const events = await storage.getCalendarEventsByDateRange(startDate, endDate);
  
  // Sort by start time
  return events.sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );
}

/**
 * Check for scheduling conflicts
 */
export async function checkSchedulingConflicts(
  storage: IStorage,
  newEvent: InsertCalendarEvent
): Promise<CalendarEvent[]> {
  const startDate = new Date(newEvent.startTime).toISOString().split('T')[0];
  const endDate = new Date(newEvent.endTime).toISOString().split('T')[0];
  
  const existingEvents = await storage.getCalendarEventsByDateRange(startDate, endDate);
  
  const conflicts = existingEvents.filter(event => {
    const eventStart = new Date(event.startTime);
    const eventEnd = new Date(event.endTime);
    const newStart = new Date(newEvent.startTime);
    const newEnd = new Date(newEvent.endTime);
    
    // Check for time overlap
    return (newStart < eventEnd && newEnd > eventStart);
  });
  
  return conflicts;
}

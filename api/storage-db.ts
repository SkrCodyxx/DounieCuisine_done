import {
  users, menuItems, orders, reservations, employees, calendarEvents,
  inventory, financialTransactions, loyaltyRewards, festiveThemes,
  announcements,
  type User, type InsertUser, type MenuItem, type InsertMenuItem,
  type Order, type InsertOrder, type Reservation, type InsertReservation,
  type Employee, type InsertEmployee, type CalendarEvent, type InsertCalendarEvent,
  type InventoryItem, type InsertInventoryItem, type FinancialTransaction,
  type InsertFinancialTransaction, type LoyaltyReward, type InsertLoyaltyReward,
  type FestiveTheme, type InsertFestiveTheme, type Announcement, type InsertAnnouncement
} from "./shared/schema";
import { db } from "./db";
import { eq, and, gte, lte } from "drizzle-orm";
import { nanoid } from "nanoid";
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // Users
  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUserById(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0] || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0] || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0] || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return result[0] || undefined;
  }

  // Menu Items
  async getMenuItems(): Promise<MenuItem[]> {
    return await db.select().from(menuItems);
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    const result = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return result[0] || undefined;
  }

  async createMenuItem(insertItem: InsertMenuItem): Promise<MenuItem> {
    const result = await db.insert(menuItems).values(insertItem).returning();
    return result[0];
  }

  async updateMenuItem(id: number, updates: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const result = await db.update(menuItems).set(updates).where(eq(menuItems.id, id)).returning();
    return result[0] || undefined;
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    const result = await db.delete(menuItems).where(eq(menuItems.id, id));
    return result.rowCount > 0;
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id));
    return result[0] || undefined;
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const result = await db.insert(orders).values(insertOrder).returning();
    return result[0];
  }

  async updateOrder(id: number, updates: Partial<InsertOrder>): Promise<Order | undefined> {
    const result = await db.update(orders).set(updates).where(eq(orders.id, id)).returning();
    return result[0] || undefined;
  }

  // Reservations
  async getReservations(): Promise<Reservation[]> {
    return await db.select().from(reservations);
  }

  async getReservation(id: number): Promise<Reservation | undefined> {
    const result = await db.select().from(reservations).where(eq(reservations.id, id));
    return result[0] || undefined;
  }

  async getReservationsByUser(userId: number): Promise<Reservation[]> {
    return await db.select().from(reservations).where(eq(reservations.userId, userId));
  }

  async getReservationsByDate(date: string): Promise<Reservation[]> {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);
    
    return await db.select().from(reservations).where(
      and(
        gte(reservations.dateTime, startDate),
        lte(reservations.dateTime, endDate)
      )
    );
  }

  async createReservation(insertReservation: InsertReservation): Promise<Reservation> {
    const confirmationCode = nanoid(8).toUpperCase();
    const result = await db.insert(reservations).values({
      ...insertReservation,
      confirmationCode
    }).returning();
    return result[0];
  }

  async updateReservation(id: number, updates: Partial<InsertReservation>): Promise<Reservation | undefined> {
    const result = await db.update(reservations).set(updates).where(eq(reservations.id, id)).returning();
    return result[0] || undefined;
  }

  // Employees
  async getEmployees(): Promise<Employee[]> {
    return await db.select().from(employees);
  }

  async getEmployee(id: number): Promise<Employee | undefined> {
    const result = await db.select().from(employees).where(eq(employees.id, id));
    return result[0] || undefined;
  }

  async getEmployeeByUserId(userId: number): Promise<Employee | undefined> {
    const result = await db.select().from(employees).where(eq(employees.userId, userId));
    return result[0] || undefined;
  }

  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    const result = await db.insert(employees).values(insertEmployee).returning();
    return result[0];
  }

  async updateEmployee(id: number, updates: Partial<InsertEmployee>): Promise<Employee | undefined> {
    const result = await db.update(employees).set(updates).where(eq(employees.id, id)).returning();
    return result[0] || undefined;
  }

  // Calendar Events
  async getCalendarEvents(): Promise<CalendarEvent[]> {
    return await db.select().from(calendarEvents);
  }

  async getCalendarEvent(id: number): Promise<CalendarEvent | undefined> {
    const result = await db.select().from(calendarEvents).where(eq(calendarEvents.id, id));
    return result[0] || undefined;
  }

  async getCalendarEventsByDateRange(start: string, end: string): Promise<CalendarEvent[]> {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    return await db.select().from(calendarEvents).where(
      and(
        gte(calendarEvents.startTime, startDate),
        lte(calendarEvents.endTime, endDate)
      )
    );
  }

  async createCalendarEvent(insertEvent: InsertCalendarEvent): Promise<CalendarEvent> {
    const result = await db.insert(calendarEvents).values(insertEvent).returning();
    return result[0];
  }

  async updateCalendarEvent(id: number, updates: Partial<InsertCalendarEvent>): Promise<CalendarEvent | undefined> {
    const result = await db.update(calendarEvents).set(updates).where(eq(calendarEvents.id, id)).returning();
    return result[0] || undefined;
  }

  async deleteCalendarEvent(id: number): Promise<boolean> {
    const result = await db.delete(calendarEvents).where(eq(calendarEvents.id, id));
    return result.rowCount > 0;
  }

  // Inventory
  async getInventoryItems(): Promise<InventoryItem[]> {
    return await db.select().from(inventory);
  }

  async getInventoryItem(id: number): Promise<InventoryItem | undefined> {
    const result = await db.select().from(inventory).where(eq(inventory.id, id));
    return result[0] || undefined;
  }

  async createInventoryItem(insertItem: InsertInventoryItem): Promise<InventoryItem> {
    const result = await db.insert(inventory).values(insertItem).returning();
    return result[0];
  }

  async updateInventoryItem(id: number, updates: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined> {
    const result = await db.update(inventory).set(updates).where(eq(inventory.id, id)).returning();
    return result[0] || undefined;
  }

  async deleteInventoryItem(id: number): Promise<boolean> {
    const result = await db.delete(inventory).where(eq(inventory.id, id));
    return result.rowCount > 0;
  }

  // Financial Transactions
  async getFinancialTransactions(): Promise<FinancialTransaction[]> {
    return await db.select().from(financialTransactions);
  }

  async getFinancialTransaction(id: number): Promise<FinancialTransaction | undefined> {
    const result = await db.select().from(financialTransactions).where(eq(financialTransactions.id, id));
    return result[0] || undefined;
  }

  async getFinancialTransactionsByDateRange(start: string, end: string): Promise<FinancialTransaction[]> {
    const startDate = start;
    const endDate = end;
    
    return await db.select().from(financialTransactions).where(
      and(
        gte(financialTransactions.date, startDate),
        lte(financialTransactions.date, endDate)
      )
    );
  }

  async createFinancialTransaction(insertTransaction: InsertFinancialTransaction): Promise<FinancialTransaction> {
    const result = await db.insert(financialTransactions).values(insertTransaction).returning();
    return result[0];
  }

  // Loyalty Rewards
  async getLoyaltyRewards(): Promise<LoyaltyReward[]> {
    return await db.select().from(loyaltyRewards);
  }

  async getLoyaltyReward(id: number): Promise<LoyaltyReward | undefined> {
    const result = await db.select().from(loyaltyRewards).where(eq(loyaltyRewards.id, id));
    return result[0] || undefined;
  }

  async createLoyaltyReward(insertReward: InsertLoyaltyReward): Promise<LoyaltyReward> {
    const result = await db.insert(loyaltyRewards).values(insertReward).returning();
    return result[0];
  }

  async updateLoyaltyReward(id: number, updates: Partial<InsertLoyaltyReward>): Promise<LoyaltyReward | undefined> {
    const result = await db.update(loyaltyRewards).set(updates).where(eq(loyaltyRewards.id, id)).returning();
    return result[0] || undefined;
  }

  // Festive Themes
  async getFestiveThemes(): Promise<FestiveTheme[]> {
    return await db.select().from(festiveThemes);
  }

  async getActiveFestiveTheme(): Promise<FestiveTheme | undefined> {
    const result = await db.select().from(festiveThemes).where(eq(festiveThemes.isActive, true));
    return result[0] || undefined;
  }

  async getFestiveTheme(id: number): Promise<FestiveTheme | undefined> {
    const result = await db.select().from(festiveThemes).where(eq(festiveThemes.id, id));
    return result[0] || undefined;
  }

  async createFestiveTheme(insertTheme: InsertFestiveTheme): Promise<FestiveTheme> {
    const result = await db.insert(festiveThemes).values(insertTheme).returning();
    return result[0];
  }

  async updateFestiveTheme(id: number, updates: Partial<InsertFestiveTheme>): Promise<FestiveTheme | undefined> {
    const result = await db.update(festiveThemes).set(updates).where(eq(festiveThemes.id, id)).returning();
    return result[0] || undefined;
  }

  // Announcements
  async getAnnouncements(): Promise<Announcement[]> {
    return await db.select().from(announcements);
  }

  async getActiveAnnouncements(): Promise<Announcement[]> {
    return await db.select().from(announcements).where(eq(announcements.isActive, true));
  }

  async getAnnouncement(id: number): Promise<Announcement | undefined> {
    const result = await db.select().from(announcements).where(eq(announcements.id, id));
    return result[0] || undefined;
  }

  async createAnnouncement(insertAnnouncement: InsertAnnouncement): Promise<Announcement> {
    const result = await db.insert(announcements).values(insertAnnouncement).returning();
    return result[0];
  }

  async updateAnnouncement(id: number, updates: Partial<InsertAnnouncement>): Promise<Announcement | undefined> {
    const result = await db.update(announcements).set(updates).where(eq(announcements.id, id)).returning();
    return result[0] || undefined;
  }
}
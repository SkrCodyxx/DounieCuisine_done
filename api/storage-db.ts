import {
  users, menuItems, orders, reservations, employees, calendarEvents,
  inventory, financialTransactions, loyaltyRewards, festiveThemes,
  announcements, clients, companySettings, quotes, galleries, galleryImages,
  contentPages, customerMessages, internalMessages, clientMessages, rolePermissions,
  type User, type InsertUser, type MenuItem, type InsertMenuItem,
  type Order, type InsertOrder, type Reservation, type InsertReservation,
  type Employee, type InsertEmployee, type CalendarEvent, type InsertCalendarEvent,
  type InventoryItem, type InsertInventoryItem, type FinancialTransaction,
  type InsertFinancialTransaction, type LoyaltyReward, type InsertLoyaltyReward,
  type FestiveTheme, type InsertFestiveTheme, type Announcement, type InsertAnnouncement,
  type Client, type InsertClient, type CompanySettings, type InsertCompanySettings,
  type Quote, type InsertQuote, type Gallery, type InsertGallery,
  type GalleryImage, type InsertGalleryImage, type ContentPage, type InsertContentPage,
  type CustomerMessage, type InsertCustomerMessage, type InternalMessage, type InsertInternalMessage,
  type ClientMessage, type InsertClientMessage, type RolePermission, type InsertRolePermission
} from "./shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, like, or, desc, asc } from "drizzle-orm";
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

  // Role Permissions
  async getRolePermissions(): Promise<RolePermission[]> {
    return await db.select().from(rolePermissions);
  }

  async getRolePermission(id: number): Promise<RolePermission | undefined> {
    const result = await db.select().from(rolePermissions).where(eq(rolePermissions.id, id));
    return result[0] || undefined;
  }

  async getRolePermissionByName(roleName: string): Promise<RolePermission | undefined> {
    const result = await db.select().from(rolePermissions).where(eq(rolePermissions.roleName, roleName));
    return result[0] || undefined;
  }

  async createRolePermission(insertRole: InsertRolePermission): Promise<RolePermission> {
    const result = await db.insert(rolePermissions).values(insertRole).returning();
    return result[0];
  }

  async updateRolePermission(id: number, updates: Partial<InsertRolePermission>): Promise<RolePermission | undefined> {
    const result = await db.update(rolePermissions).set(updates).where(eq(rolePermissions.id, id)).returning();
    return result[0] || undefined;
  }

  // Clients
  async getClients(): Promise<Client[]> {
    return await db.select().from(clients).orderBy(desc(clients.createdAt));
  }

  async getClient(id: number): Promise<Client | undefined> {
    const result = await db.select().from(clients).where(eq(clients.id, id));
    return result[0] || undefined;
  }

  async getClientByEmail(email: string): Promise<Client | undefined> {
    const result = await db.select().from(clients).where(eq(clients.email, email));
    return result[0] || undefined;
  }

  async searchClients(searchTerm: string): Promise<Client[]> {
    return await db.select().from(clients).where(
      or(
        like(clients.firstName, `%${searchTerm}%`),
        like(clients.lastName, `%${searchTerm}%`),
        like(clients.email, `%${searchTerm}%`),
        like(clients.company, `%${searchTerm}%`)
      )
    ).orderBy(desc(clients.createdAt));
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const result = await db.insert(clients).values(insertClient).returning();
    return result[0];
  }

  async updateClient(id: number, updates: Partial<InsertClient>): Promise<Client | undefined> {
    const result = await db.update(clients).set(updates).where(eq(clients.id, id)).returning();
    return result[0] || undefined;
  }

  async deleteClient(id: number): Promise<boolean> {
    const result = await db.delete(clients).where(eq(clients.id, id));
    return result.rowCount > 0;
  }

  // Company Settings
  async getCompanySettings(): Promise<CompanySettings | undefined> {
    const result = await db.select().from(companySettings).limit(1);
    return result[0] || undefined;
  }

  async createCompanySettings(insertSettings: InsertCompanySettings): Promise<CompanySettings> {
    const result = await db.insert(companySettings).values(insertSettings).returning();
    return result[0];
  }

  async updateCompanySettings(id: number, updates: Partial<InsertCompanySettings>): Promise<CompanySettings | undefined> {
    const result = await db.update(companySettings).set(updates).where(eq(companySettings.id, id)).returning();
    return result[0] || undefined;
  }

  // Quotes
  async getQuotes(): Promise<Quote[]> {
    return await db.select().from(quotes).orderBy(desc(quotes.createdAt));
  }

  async getQuote(id: number): Promise<Quote | undefined> {
    const result = await db.select().from(quotes).where(eq(quotes.id, id));
    return result[0] || undefined;
  }

  async getQuoteByNumber(quoteNumber: string): Promise<Quote | undefined> {
    const result = await db.select().from(quotes).where(eq(quotes.quoteNumber, quoteNumber));
    return result[0] || undefined;
  }

  async getQuotesByClient(clientId: number): Promise<Quote[]> {
    return await db.select().from(quotes).where(eq(quotes.clientId, clientId)).orderBy(desc(quotes.createdAt));
  }

  async createQuote(insertQuote: InsertQuote): Promise<Quote> {
    const result = await db.insert(quotes).values(insertQuote).returning();
    return result[0];
  }

  async updateQuote(id: number, updates: Partial<InsertQuote>): Promise<Quote | undefined> {
    const result = await db.update(quotes).set(updates).where(eq(quotes.id, id)).returning();
    return result[0] || undefined;
  }

  async deleteQuote(id: number): Promise<boolean> {
    const result = await db.delete(quotes).where(eq(quotes.id, id));
    return result.rowCount > 0;
  }

  // Galleries
  async getGalleries(): Promise<Gallery[]> {
    return await db.select().from(galleries).where(eq(galleries.isActive, true)).orderBy(asc(galleries.sortOrder));
  }

  async getGallery(id: number): Promise<Gallery | undefined> {
    const result = await db.select().from(galleries).where(eq(galleries.id, id));
    return result[0] || undefined;
  }

  async createGallery(insertGallery: InsertGallery): Promise<Gallery> {
    const result = await db.insert(galleries).values(insertGallery).returning();
    return result[0];
  }

  async updateGallery(id: number, updates: Partial<InsertGallery>): Promise<Gallery | undefined> {
    const result = await db.update(galleries).set(updates).where(eq(galleries.id, id)).returning();
    return result[0] || undefined;
  }

  async deleteGallery(id: number): Promise<boolean> {
    const result = await db.delete(galleries).where(eq(galleries.id, id));
    return result.rowCount > 0;
  }

  // Gallery Images
  async getGalleryImages(galleryId?: number): Promise<GalleryImage[]> {
    const query = db.select().from(galleryImages).where(eq(galleryImages.isActive, true));
    if (galleryId) {
      return await query.where(eq(galleryImages.galleryId, galleryId)).orderBy(asc(galleryImages.sortOrder));
    }
    return await query.orderBy(asc(galleryImages.sortOrder));
  }

  async getGalleryImage(id: number): Promise<GalleryImage | undefined> {
    const result = await db.select().from(galleryImages).where(eq(galleryImages.id, id));
    return result[0] || undefined;
  }

  async createGalleryImage(insertImage: InsertGalleryImage): Promise<GalleryImage> {
    const result = await db.insert(galleryImages).values(insertImage).returning();
    return result[0];
  }

  async updateGalleryImage(id: number, updates: Partial<InsertGalleryImage>): Promise<GalleryImage | undefined> {
    const result = await db.update(galleryImages).set(updates).where(eq(galleryImages.id, id)).returning();
    return result[0] || undefined;
  }

  async deleteGalleryImage(id: number): Promise<boolean> {
    const result = await db.delete(galleryImages).where(eq(galleryImages.id, id));
    return result.rowCount > 0;
  }

  // Content Pages
  async getContentPages(): Promise<ContentPage[]> {
    return await db.select().from(contentPages).where(eq(contentPages.isActive, true)).orderBy(asc(contentPages.sortOrder));
  }

  async getContentPage(id: number): Promise<ContentPage | undefined> {
    const result = await db.select().from(contentPages).where(eq(contentPages.id, id));
    return result[0] || undefined;
  }

  async getContentPageBySlug(slug: string): Promise<ContentPage | undefined> {
    const result = await db.select().from(contentPages).where(eq(contentPages.slug, slug));
    return result[0] || undefined;
  }

  async createContentPage(insertPage: InsertContentPage): Promise<ContentPage> {
    const result = await db.insert(contentPages).values(insertPage).returning();
    return result[0];
  }

  async updateContentPage(id: number, updates: Partial<InsertContentPage>): Promise<ContentPage | undefined> {
    const result = await db.update(contentPages).set(updates).where(eq(contentPages.id, id)).returning();
    return result[0] || undefined;
  }

  async deleteContentPage(id: number): Promise<boolean> {
    const result = await db.delete(contentPages).where(eq(contentPages.id, id));
    return result.rowCount > 0;
  }

  // Customer Messages
  async getCustomerMessages(): Promise<CustomerMessage[]> {
    return await db.select().from(customerMessages).orderBy(desc(customerMessages.createdAt));
  }

  async getCustomerMessage(id: number): Promise<CustomerMessage | undefined> {
    const result = await db.select().from(customerMessages).where(eq(customerMessages.id, id));
    return result[0] || undefined;
  }

  async getUnreadCustomerMessages(): Promise<CustomerMessage[]> {
    return await db.select().from(customerMessages).where(eq(customerMessages.isRead, false)).orderBy(desc(customerMessages.createdAt));
  }

  async createCustomerMessage(insertMessage: InsertCustomerMessage): Promise<CustomerMessage> {
    const result = await db.insert(customerMessages).values(insertMessage).returning();
    return result[0];
  }

  async updateCustomerMessage(id: number, updates: Partial<InsertCustomerMessage>): Promise<CustomerMessage | undefined> {
    const result = await db.update(customerMessages).set(updates).where(eq(customerMessages.id, id)).returning();
    return result[0] || undefined;
  }

  async deleteCustomerMessage(id: number): Promise<boolean> {
    const result = await db.delete(customerMessages).where(eq(customerMessages.id, id));
    return result.rowCount > 0;
  }

  // Internal Messages
  async getInternalMessages(userId: number): Promise<InternalMessage[]> {
    return await db.select().from(internalMessages).where(
      and(
        eq(internalMessages.recipientId, userId),
        eq(internalMessages.deletedByRecipient, false)
      )
    ).orderBy(desc(internalMessages.createdAt));
  }

  async getSentInternalMessages(userId: number): Promise<InternalMessage[]> {
    return await db.select().from(internalMessages).where(
      and(
        eq(internalMessages.senderId, userId),
        eq(internalMessages.deletedBySender, false)
      )
    ).orderBy(desc(internalMessages.createdAt));
  }

  async getInternalMessage(id: number): Promise<InternalMessage | undefined> {
    const result = await db.select().from(internalMessages).where(eq(internalMessages.id, id));
    return result[0] || undefined;
  }

  async createInternalMessage(insertMessage: InsertInternalMessage): Promise<InternalMessage> {
    const result = await db.insert(internalMessages).values(insertMessage).returning();
    return result[0];
  }

  async updateInternalMessage(id: number, updates: Partial<InsertInternalMessage>): Promise<InternalMessage | undefined> {
    const result = await db.update(internalMessages).set(updates).where(eq(internalMessages.id, id)).returning();
    return result[0] || undefined;
  }

  async deleteInternalMessage(id: number, userId: number, isRecipient: boolean): Promise<boolean> {
    const updates = isRecipient 
      ? { deletedByRecipient: true }
      : { deletedBySender: true };
    
    const result = await db.update(internalMessages).set(updates).where(eq(internalMessages.id, id)).returning();
    return result.length > 0;
  }

  // Client Messages
  async getClientMessages(): Promise<ClientMessage[]> {
    return await db.select().from(clientMessages).orderBy(desc(clientMessages.createdAt));
  }

  async getClientMessage(id: number): Promise<ClientMessage | undefined> {
    const result = await db.select().from(clientMessages).where(eq(clientMessages.id, id));
    return result[0] || undefined;
  }

  async getClientMessagesByClient(clientId: number): Promise<ClientMessage[]> {
    return await db.select().from(clientMessages).where(eq(clientMessages.clientId, clientId)).orderBy(desc(clientMessages.createdAt));
  }

  async createClientMessage(insertMessage: InsertClientMessage): Promise<ClientMessage> {
    const result = await db.insert(clientMessages).values(insertMessage).returning();
    return result[0];
  }

  async updateClientMessage(id: number, updates: Partial<InsertClientMessage>): Promise<ClientMessage | undefined> {
    const result = await db.update(clientMessages).set(updates).where(eq(clientMessages.id, id)).returning();
    return result[0] || undefined;
  }

  async deleteClientMessage(id: number): Promise<boolean> {
    const result = await db.delete(clientMessages).where(eq(clientMessages.id, id));
    return result.rowCount > 0;
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

  async getOrdersByClient(clientId: number): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.clientId, clientId));
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

  async getAnnouncementsByPosition(position: string): Promise<Announcement[]> {
    return await db.select().from(announcements).where(
      and(
        eq(announcements.isActive, true),
        eq(announcements.position, position)
      )
    );
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
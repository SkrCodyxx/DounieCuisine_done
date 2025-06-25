var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// index.ts
import express from "express";
import cors from "cors";
import session from "express-session";

// routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  announcements: () => announcements,
  calendarEvents: () => calendarEvents,
  clientMessages: () => clientMessages,
  clients: () => clients,
  companySettings: () => companySettings,
  contentPages: () => contentPages,
  customerMessages: () => customerMessages,
  employees: () => employees,
  festiveThemes: () => festiveThemes,
  financialTransactions: () => financialTransactions,
  galleries: () => galleries,
  galleryImages: () => galleryImages,
  insertAnnouncementSchema: () => insertAnnouncementSchema,
  insertCalendarEventSchema: () => insertCalendarEventSchema,
  insertClientMessageSchema: () => insertClientMessageSchema,
  insertClientSchema: () => insertClientSchema,
  insertCompanySettingsSchema: () => insertCompanySettingsSchema,
  insertContentPageSchema: () => insertContentPageSchema,
  insertCustomerMessageSchema: () => insertCustomerMessageSchema,
  insertEmployeeSchema: () => insertEmployeeSchema,
  insertFestiveThemeSchema: () => insertFestiveThemeSchema,
  insertFinancialTransactionSchema: () => insertFinancialTransactionSchema,
  insertGalleryImageSchema: () => insertGalleryImageSchema,
  insertGallerySchema: () => insertGallerySchema,
  insertInternalMessageSchema: () => insertInternalMessageSchema,
  insertInventorySchema: () => insertInventorySchema,
  insertLoyaltyRewardSchema: () => insertLoyaltyRewardSchema,
  insertMenuItemSchema: () => insertMenuItemSchema,
  insertOrderSchema: () => insertOrderSchema,
  insertQuoteSchema: () => insertQuoteSchema,
  insertReservationSchema: () => insertReservationSchema,
  insertRolePermissionSchema: () => insertRolePermissionSchema,
  insertUserSchema: () => insertUserSchema,
  internalMessages: () => internalMessages,
  inventory: () => inventory,
  loyaltyRewards: () => loyaltyRewards,
  menuItems: () => menuItems,
  orders: () => orders,
  quotes: () => quotes,
  reservations: () => reservations,
  rolePermissions: () => rolePermissions,
  users: () => users
});
import { pgTable, text, serial, integer, boolean, timestamp, decimal, json, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role").notNull().default("client"),
  // admin, manager, staff, client
  isEmployeeClient: boolean("is_employee_client").default(false),
  phoneNumber: text("phone_number"),
  loyaltyPoints: integer("loyalty_points").default(0),
  preferences: json("preferences").default("{}"),
  allergies: text("allergies").array().default([]),
  address: text("address"),
  company: text("company"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var rolePermissions = pgTable("role_permissions", {
  id: serial("id").primaryKey(),
  roleName: text("role_name").notNull().unique(),
  permissions: json("permissions").notNull(),
  // Object avec toutes les permissions
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number"),
  address: text("address"),
  company: text("company"),
  notes: text("notes"),
  source: text("source").default("website"),
  // website, phone, referral, etc.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var companySettings = pgTable("company_settings", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  address: text("address"),
  phoneNumber: text("phone_number"),
  email: text("email"),
  website: text("website"),
  logoUrl: text("logo_url"),
  siret: text("siret"),
  tvaNumber: text("tva_number"),
  salesPolicy: text("sales_policy"),
  returnPolicy: text("return_policy"),
  cancellationPolicy: text("cancellation_policy"),
  termsOfService: text("terms_of_service"),
  privacyPolicy: text("privacy_policy"),
  bankInfo: json("bank_info"),
  // Infos bancaires pour factures
  defaultQuoteValidity: integer("default_quote_validity").default(30),
  // jours
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  quoteNumber: text("quote_number").notNull().unique(),
  clientId: integer("client_id").references(() => clients.id),
  userId: integer("user_id").references(() => users.id),
  // Si client connecté
  status: text("status").notNull().default("draft"),
  // draft, sent, accepted, rejected, expired
  validityDate: date("validity_date").notNull(),
  eventDate: date("event_date"),
  eventLocation: text("event_location"),
  guestCount: integer("guest_count"),
  budget: decimal("budget", { precision: 10, scale: 2 }),
  items: json("items").notNull(),
  // Détail des lignes du devis
  subtotalHT: decimal("subtotal_ht", { precision: 10, scale: 2 }).notNull(),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).default("0"),
  taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }).notNull(),
  totalTTC: decimal("total_ttc", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
  internalNotes: text("internal_notes"),
  createdBy: integer("created_by").references(() => users.id),
  sentAt: timestamp("sent_at"),
  acceptedAt: timestamp("accepted_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameEn: text("name_en"),
  description: text("description").notNull(),
  descriptionEn: text("description_en"),
  category: text("category").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  isAvailable: boolean("is_available").default(true),
  isFestive: boolean("is_festive").default(false),
  festiveTheme: text("festive_theme"),
  allergies: text("allergies").array().default([]),
  ingredients: text("ingredients").array().default([]),
  imageUrl: text("image_url"),
  preparationTime: integer("preparation_time"),
  // minutes
  calories: integer("calories"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var galleries = pgTable("galleries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  galleryId: integer("gallery_id").references(() => galleries.id),
  title: text("title"),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  uploadedBy: integer("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var contentPages = pgTable("content_pages", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  metaDescription: text("meta_description"),
  isActive: boolean("is_active").default(true),
  showInNavigation: boolean("show_in_navigation").default(false),
  sortOrder: integer("sort_order").default(0),
  lastEditedBy: integer("last_edited_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var customerMessages = pgTable("customer_messages", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  isReplied: boolean("is_replied").default(false),
  priority: text("priority").default("normal"),
  // low, normal, high, urgent
  tags: text("tags").array().default([]),
  internalNotes: text("internal_notes"),
  assignedTo: integer("assigned_to").references(() => users.id),
  repliedAt: timestamp("replied_at"),
  repliedBy: integer("replied_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var internalMessages = pgTable("internal_messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  recipientId: integer("recipient_id").references(() => users.id).notNull(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  isImportant: boolean("is_important").default(false),
  attachments: text("attachments").array().default([]),
  threadId: integer("thread_id"),
  // Pour grouper les réponses
  replyToId: integer("reply_to_id").references(() => internalMessages.id),
  deletedBySender: boolean("deleted_by_sender").default(false),
  deletedByRecipient: boolean("deleted_by_recipient").default(false),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var clientMessages = pgTable("client_messages", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => clients.id),
  userId: integer("user_id").references(() => users.id),
  // Si client connecté
  senderId: integer("sender_id").references(() => users.id).notNull(),
  // Employé qui envoie
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  messageType: text("message_type").notNull(),
  // alert, reminder, notification, promotion, response
  priority: text("priority").default("normal"),
  isRead: boolean("is_read").default(false),
  relatedQuoteId: integer("related_quote_id").references(() => quotes.id),
  relatedOrderId: integer("related_order_id").references(() => orders.id),
  sentVia: text("sent_via").default("internal"),
  // internal, email, sms
  scheduledFor: timestamp("scheduled_for"),
  sentAt: timestamp("sent_at"),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  clientId: integer("client_id").references(() => clients.id),
  quoteId: integer("quote_id").references(() => quotes.id),
  // Si commande depuis devis
  status: text("status").notNull().default("pending"),
  // pending, confirmed, preparing, ready, delivered, cancelled
  items: json("items").notNull(),
  // {menuItemId, quantity, price, customizations}[]
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  gstAmount: decimal("gst_amount", { precision: 10, scale: 2 }).notNull(),
  qstAmount: decimal("qst_amount", { precision: 10, scale: 2 }).notNull(),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).default("0"),
  loyaltyPointsUsed: integer("loyalty_points_used").default(0),
  loyaltyPointsEarned: integer("loyalty_points_earned").default(0),
  paymentMethod: text("payment_method"),
  paymentStatus: text("payment_status").default("pending"),
  orderType: text("order_type").notNull(),
  // dine-in, takeout, delivery, event
  specialRequests: text("special_requests"),
  estimatedReadyTime: timestamp("estimated_ready_time"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  guestName: text("guest_name").notNull(),
  guestEmail: text("guest_email").notNull(),
  guestPhone: text("guest_phone").notNull(),
  partySize: integer("party_size").notNull(),
  dateTime: timestamp("date_time").notNull(),
  tableNumber: integer("table_number"),
  status: text("status").notNull().default("pending"),
  // pending, confirmed, seated, completed, cancelled, no-show
  specialRequests: text("special_requests"),
  occasion: text("occasion"),
  // birthday, anniversary, business, festive
  dietaryRestrictions: text("dietary_restrictions").array().default([]),
  confirmationCode: text("confirmation_code").notNull(),
  reminderSent: boolean("reminder_sent").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  employeeId: text("employee_id").notNull().unique(),
  position: text("position").notNull(),
  department: text("department").notNull(),
  hireDate: date("hire_date").notNull(),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
  socialInsuranceNumber: text("social_insurance_number"),
  bankAccountInfo: json("bank_account_info"),
  // encrypted
  emergencyContact: json("emergency_contact"),
  certifications: text("certifications").array().default([]),
  availability: json("availability").default("{}"),
  permissions: json("permissions").default("{}"),
  // Permissions spécifiques à l'employé
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var calendarEvents = pgTable("calendar_events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  eventType: text("event_type").notNull(),
  // shift, payroll, meeting, training, special_event, reservation
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  allDay: boolean("all_day").default(false),
  location: text("location"),
  attendees: integer("attendees").array().default([]),
  // user IDs
  priority: text("priority").default("normal"),
  // low, normal, high, urgent
  status: text("status").default("scheduled"),
  // scheduled, confirmed, cancelled, completed
  recurrence: json("recurrence"),
  // for recurring events
  reminders: json("reminders"),
  attachments: text("attachments").array().default([]),
  contacts: json("contacts"),
  isPublic: boolean("is_public").default(false),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  currentStock: integer("current_stock").notNull(),
  minimumStock: integer("minimum_stock").notNull(),
  unit: text("unit").notNull(),
  // kg, lbs, pieces, bottles, etc.
  costPerUnit: decimal("cost_per_unit", { precision: 10, scale: 2 }).notNull(),
  supplier: text("supplier"),
  lastOrderDate: date("last_order_date"),
  expirationDate: date("expiration_date"),
  location: text("location"),
  isCritical: boolean("is_critical").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var financialTransactions = pgTable("financial_transactions", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  // income, expense, tax, payroll
  category: text("category").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  description: text("description").notNull(),
  date: date("date").notNull(),
  relatedOrderId: integer("related_order_id").references(() => orders.id),
  relatedEmployeeId: integer("related_employee_id").references(() => employees.id),
  relatedQuoteId: integer("related_quote_id").references(() => quotes.id),
  paymentMethod: text("payment_method"),
  receiptUrl: text("receipt_url"),
  taxDeductible: boolean("tax_deductible").default(false),
  gstAmount: decimal("gst_amount", { precision: 10, scale: 2 }),
  qstAmount: decimal("qst_amount", { precision: 10, scale: 2 }),
  notes: text("notes"),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow()
});
var loyaltyRewards = pgTable("loyalty_rewards", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  pointsCost: integer("points_cost").notNull(),
  rewardType: text("reward_type").notNull(),
  // discount, free_item, special_access
  rewardValue: decimal("reward_value", { precision: 10, scale: 2 }),
  isActive: boolean("is_active").default(true),
  isFestive: boolean("is_festive").default(false),
  festiveTheme: text("festive_theme"),
  validFrom: date("valid_from"),
  validTo: date("valid_to"),
  usageLimit: integer("usage_limit"),
  timesUsed: integer("times_used").default(0),
  conditions: json("conditions"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var festiveThemes = pgTable("festive_themes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameEn: text("name_en").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(false),
  isAutomatic: boolean("is_automatic").default(true),
  startDate: date("start_date"),
  endDate: date("end_date"),
  colors: json("colors").notNull(),
  // primary, secondary, accent colors
  animations: json("animations"),
  // snowfall, hearts, etc.
  icons: json("icons"),
  // theme-specific icons
  customCss: text("custom_css"),
  priority: integer("priority").default(0),
  recurringYearly: boolean("recurring_yearly").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(),
  // info, warning, success, promotion
  priority: text("priority").default("normal"),
  // low, normal, high, urgent
  position: text("position").notNull(),
  // banner, sidebar, modal, footer
  targetAudience: text("target_audience").notNull(),
  // all, customers, employees, vip
  isActive: boolean("is_active").default(true),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  imageUrl: text("image_url"),
  actionUrl: text("action_url"),
  actionText: text("action_text"),
  viewCount: integer("view_count").default(0),
  displayRules: json("display_rules"),
  // Règles d'affichage avancées
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertRolePermissionSchema = createInsertSchema(rolePermissions).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertCompanySettingsSchema = createInsertSchema(companySettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertQuoteSchema = createInsertSchema(quotes).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertGallerySchema = createInsertSchema(galleries).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertGalleryImageSchema = createInsertSchema(galleryImages).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertContentPageSchema = createInsertSchema(contentPages).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertCustomerMessageSchema = createInsertSchema(customerMessages).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertInternalMessageSchema = createInsertSchema(internalMessages).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertClientMessageSchema = createInsertSchema(clientMessages).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertReservationSchema = createInsertSchema(reservations).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertEmployeeSchema = createInsertSchema(employees).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertCalendarEventSchema = createInsertSchema(calendarEvents).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertInventorySchema = createInsertSchema(inventory).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertFinancialTransactionSchema = createInsertSchema(financialTransactions).omit({
  id: true,
  createdAt: true
});
var insertLoyaltyRewardSchema = createInsertSchema(loyaltyRewards).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertFestiveThemeSchema = createInsertSchema(festiveThemes).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// db.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config();
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var client = new Client({
  connectionString: process.env.DATABASE_URL
});
await client.connect();
var db = drizzle(client, { schema: schema_exports });

// storage-db.ts
import { eq, and, gte, lte, like, or, desc, asc } from "drizzle-orm";
import { nanoid } from "nanoid";
var DatabaseStorage = class {
  // Users
  async getUsers() {
    return await db.select().from(users);
  }
  async getUserById(id) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }
  async deleteUser(id) {
    await db.delete(users).where(eq(users.id, id));
  }
  async getUser(id) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0] || void 0;
  }
  async getUserByUsername(username) {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0] || void 0;
  }
  async getUserByEmail(email) {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0] || void 0;
  }
  async createUser(insertUser) {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }
  async updateUser(id, updates) {
    const result = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return result[0] || void 0;
  }
  // Role Permissions
  async getRolePermissions() {
    return await db.select().from(rolePermissions);
  }
  async getRolePermission(id) {
    const result = await db.select().from(rolePermissions).where(eq(rolePermissions.id, id));
    return result[0] || void 0;
  }
  async getRolePermissionByName(roleName) {
    const result = await db.select().from(rolePermissions).where(eq(rolePermissions.roleName, roleName));
    return result[0] || void 0;
  }
  async createRolePermission(insertRole) {
    const result = await db.insert(rolePermissions).values(insertRole).returning();
    return result[0];
  }
  async updateRolePermission(id, updates) {
    const result = await db.update(rolePermissions).set(updates).where(eq(rolePermissions.id, id)).returning();
    return result[0] || void 0;
  }
  // Clients
  async getClients() {
    return await db.select().from(clients).orderBy(desc(clients.createdAt));
  }
  async getClient(id) {
    const result = await db.select().from(clients).where(eq(clients.id, id));
    return result[0] || void 0;
  }
  async getClientByEmail(email) {
    const result = await db.select().from(clients).where(eq(clients.email, email));
    return result[0] || void 0;
  }
  async searchClients(searchTerm) {
    return await db.select().from(clients).where(
      or(
        like(clients.firstName, `%${searchTerm}%`),
        like(clients.lastName, `%${searchTerm}%`),
        like(clients.email, `%${searchTerm}%`),
        like(clients.company, `%${searchTerm}%`)
      )
    ).orderBy(desc(clients.createdAt));
  }
  async createClient(insertClient) {
    const result = await db.insert(clients).values(insertClient).returning();
    return result[0];
  }
  async updateClient(id, updates) {
    const result = await db.update(clients).set(updates).where(eq(clients.id, id)).returning();
    return result[0] || void 0;
  }
  async deleteClient(id) {
    const result = await db.delete(clients).where(eq(clients.id, id));
    return result.rowCount > 0;
  }
  // Company Settings
  async getCompanySettings() {
    const result = await db.select().from(companySettings).limit(1);
    return result[0] || void 0;
  }
  async createCompanySettings(insertSettings) {
    const result = await db.insert(companySettings).values(insertSettings).returning();
    return result[0];
  }
  async updateCompanySettings(id, updates) {
    const result = await db.update(companySettings).set(updates).where(eq(companySettings.id, id)).returning();
    return result[0] || void 0;
  }
  // Quotes
  async getQuotes() {
    return await db.select().from(quotes).orderBy(desc(quotes.createdAt));
  }
  async getQuote(id) {
    const result = await db.select().from(quotes).where(eq(quotes.id, id));
    return result[0] || void 0;
  }
  async getQuoteByNumber(quoteNumber) {
    const result = await db.select().from(quotes).where(eq(quotes.quoteNumber, quoteNumber));
    return result[0] || void 0;
  }
  async getQuotesByClient(clientId) {
    return await db.select().from(quotes).where(eq(quotes.clientId, clientId)).orderBy(desc(quotes.createdAt));
  }
  async createQuote(insertQuote) {
    const result = await db.insert(quotes).values(insertQuote).returning();
    return result[0];
  }
  async updateQuote(id, updates) {
    const result = await db.update(quotes).set(updates).where(eq(quotes.id, id)).returning();
    return result[0] || void 0;
  }
  async deleteQuote(id) {
    const result = await db.delete(quotes).where(eq(quotes.id, id));
    return result.rowCount > 0;
  }
  // Galleries
  async getGalleries() {
    return await db.select().from(galleries).where(eq(galleries.isActive, true)).orderBy(asc(galleries.sortOrder));
  }
  async getGallery(id) {
    const result = await db.select().from(galleries).where(eq(galleries.id, id));
    return result[0] || void 0;
  }
  async createGallery(insertGallery) {
    const result = await db.insert(galleries).values(insertGallery).returning();
    return result[0];
  }
  async updateGallery(id, updates) {
    const result = await db.update(galleries).set(updates).where(eq(galleries.id, id)).returning();
    return result[0] || void 0;
  }
  async deleteGallery(id) {
    const result = await db.delete(galleries).where(eq(galleries.id, id));
    return result.rowCount > 0;
  }
  // Gallery Images
  async getGalleryImages(galleryId) {
    const query = db.select().from(galleryImages).where(eq(galleryImages.isActive, true));
    if (galleryId) {
      return await query.where(eq(galleryImages.galleryId, galleryId)).orderBy(asc(galleryImages.sortOrder));
    }
    return await query.orderBy(asc(galleryImages.sortOrder));
  }
  async getGalleryImage(id) {
    const result = await db.select().from(galleryImages).where(eq(galleryImages.id, id));
    return result[0] || void 0;
  }
  async createGalleryImage(insertImage) {
    const result = await db.insert(galleryImages).values(insertImage).returning();
    return result[0];
  }
  async updateGalleryImage(id, updates) {
    const result = await db.update(galleryImages).set(updates).where(eq(galleryImages.id, id)).returning();
    return result[0] || void 0;
  }
  async deleteGalleryImage(id) {
    const result = await db.delete(galleryImages).where(eq(galleryImages.id, id));
    return result.rowCount > 0;
  }
  // Content Pages
  async getContentPages() {
    return await db.select().from(contentPages).where(eq(contentPages.isActive, true)).orderBy(asc(contentPages.sortOrder));
  }
  async getContentPage(id) {
    const result = await db.select().from(contentPages).where(eq(contentPages.id, id));
    return result[0] || void 0;
  }
  async getContentPageBySlug(slug) {
    const result = await db.select().from(contentPages).where(eq(contentPages.slug, slug));
    return result[0] || void 0;
  }
  async createContentPage(insertPage) {
    const result = await db.insert(contentPages).values(insertPage).returning();
    return result[0];
  }
  async updateContentPage(id, updates) {
    const result = await db.update(contentPages).set(updates).where(eq(contentPages.id, id)).returning();
    return result[0] || void 0;
  }
  async deleteContentPage(id) {
    const result = await db.delete(contentPages).where(eq(contentPages.id, id));
    return result.rowCount > 0;
  }
  // Customer Messages
  async getCustomerMessages() {
    return await db.select().from(customerMessages).orderBy(desc(customerMessages.createdAt));
  }
  async getCustomerMessage(id) {
    const result = await db.select().from(customerMessages).where(eq(customerMessages.id, id));
    return result[0] || void 0;
  }
  async getUnreadCustomerMessages() {
    return await db.select().from(customerMessages).where(eq(customerMessages.isRead, false)).orderBy(desc(customerMessages.createdAt));
  }
  async createCustomerMessage(insertMessage) {
    const result = await db.insert(customerMessages).values(insertMessage).returning();
    return result[0];
  }
  async updateCustomerMessage(id, updates) {
    const result = await db.update(customerMessages).set(updates).where(eq(customerMessages.id, id)).returning();
    return result[0] || void 0;
  }
  async deleteCustomerMessage(id) {
    const result = await db.delete(customerMessages).where(eq(customerMessages.id, id));
    return result.rowCount > 0;
  }
  // Internal Messages
  async getInternalMessages(userId) {
    return await db.select().from(internalMessages).where(
      and(
        eq(internalMessages.recipientId, userId),
        eq(internalMessages.deletedByRecipient, false)
      )
    ).orderBy(desc(internalMessages.createdAt));
  }
  async getSentInternalMessages(userId) {
    return await db.select().from(internalMessages).where(
      and(
        eq(internalMessages.senderId, userId),
        eq(internalMessages.deletedBySender, false)
      )
    ).orderBy(desc(internalMessages.createdAt));
  }
  async getInternalMessage(id) {
    const result = await db.select().from(internalMessages).where(eq(internalMessages.id, id));
    return result[0] || void 0;
  }
  async createInternalMessage(insertMessage) {
    const result = await db.insert(internalMessages).values(insertMessage).returning();
    return result[0];
  }
  async updateInternalMessage(id, updates) {
    const result = await db.update(internalMessages).set(updates).where(eq(internalMessages.id, id)).returning();
    return result[0] || void 0;
  }
  async deleteInternalMessage(id, userId, isRecipient) {
    const updates = isRecipient ? { deletedByRecipient: true } : { deletedBySender: true };
    const result = await db.update(internalMessages).set(updates).where(eq(internalMessages.id, id)).returning();
    return result.length > 0;
  }
  // Client Messages
  async getClientMessages() {
    return await db.select().from(clientMessages).orderBy(desc(clientMessages.createdAt));
  }
  async getClientMessage(id) {
    const result = await db.select().from(clientMessages).where(eq(clientMessages.id, id));
    return result[0] || void 0;
  }
  async getClientMessagesByClient(clientId) {
    return await db.select().from(clientMessages).where(eq(clientMessages.clientId, clientId)).orderBy(desc(clientMessages.createdAt));
  }
  async createClientMessage(insertMessage) {
    const result = await db.insert(clientMessages).values(insertMessage).returning();
    return result[0];
  }
  async updateClientMessage(id, updates) {
    const result = await db.update(clientMessages).set(updates).where(eq(clientMessages.id, id)).returning();
    return result[0] || void 0;
  }
  async deleteClientMessage(id) {
    const result = await db.delete(clientMessages).where(eq(clientMessages.id, id));
    return result.rowCount > 0;
  }
  // Menu Items
  async getMenuItems() {
    return await db.select().from(menuItems);
  }
  async getMenuItem(id) {
    const result = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return result[0] || void 0;
  }
  async createMenuItem(insertItem) {
    const result = await db.insert(menuItems).values(insertItem).returning();
    return result[0];
  }
  async updateMenuItem(id, updates) {
    const result = await db.update(menuItems).set(updates).where(eq(menuItems.id, id)).returning();
    return result[0] || void 0;
  }
  async deleteMenuItem(id) {
    const result = await db.delete(menuItems).where(eq(menuItems.id, id));
    return result.rowCount > 0;
  }
  // Orders
  async getOrders() {
    return await db.select().from(orders);
  }
  async getOrder(id) {
    const result = await db.select().from(orders).where(eq(orders.id, id));
    return result[0] || void 0;
  }
  async getOrdersByUser(userId) {
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }
  async getOrdersByClient(clientId) {
    return await db.select().from(orders).where(eq(orders.clientId, clientId));
  }
  async createOrder(insertOrder) {
    const result = await db.insert(orders).values(insertOrder).returning();
    return result[0];
  }
  async updateOrder(id, updates) {
    const result = await db.update(orders).set(updates).where(eq(orders.id, id)).returning();
    return result[0] || void 0;
  }
  // Reservations
  async getReservations() {
    return await db.select().from(reservations);
  }
  async getReservation(id) {
    const result = await db.select().from(reservations).where(eq(reservations.id, id));
    return result[0] || void 0;
  }
  async getReservationsByUser(userId) {
    return await db.select().from(reservations).where(eq(reservations.userId, userId));
  }
  async getReservationsByDate(date2) {
    const startDate = new Date(date2);
    const endDate = new Date(date2);
    endDate.setDate(endDate.getDate() + 1);
    return await db.select().from(reservations).where(
      and(
        gte(reservations.dateTime, startDate),
        lte(reservations.dateTime, endDate)
      )
    );
  }
  async createReservation(insertReservation) {
    const confirmationCode = nanoid(8).toUpperCase();
    const result = await db.insert(reservations).values({
      ...insertReservation,
      confirmationCode
    }).returning();
    return result[0];
  }
  async updateReservation(id, updates) {
    const result = await db.update(reservations).set(updates).where(eq(reservations.id, id)).returning();
    return result[0] || void 0;
  }
  // Employees
  async getEmployees() {
    return await db.select().from(employees);
  }
  async getEmployee(id) {
    const result = await db.select().from(employees).where(eq(employees.id, id));
    return result[0] || void 0;
  }
  async getEmployeeByUserId(userId) {
    const result = await db.select().from(employees).where(eq(employees.userId, userId));
    return result[0] || void 0;
  }
  async createEmployee(insertEmployee) {
    const result = await db.insert(employees).values(insertEmployee).returning();
    return result[0];
  }
  async updateEmployee(id, updates) {
    const result = await db.update(employees).set(updates).where(eq(employees.id, id)).returning();
    return result[0] || void 0;
  }
  // Calendar Events
  async getCalendarEvents() {
    return await db.select().from(calendarEvents);
  }
  async getCalendarEvent(id) {
    const result = await db.select().from(calendarEvents).where(eq(calendarEvents.id, id));
    return result[0] || void 0;
  }
  async getCalendarEventsByDateRange(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return await db.select().from(calendarEvents).where(
      and(
        gte(calendarEvents.startTime, startDate),
        lte(calendarEvents.endTime, endDate)
      )
    );
  }
  async createCalendarEvent(insertEvent) {
    const result = await db.insert(calendarEvents).values(insertEvent).returning();
    return result[0];
  }
  async updateCalendarEvent(id, updates) {
    const result = await db.update(calendarEvents).set(updates).where(eq(calendarEvents.id, id)).returning();
    return result[0] || void 0;
  }
  async deleteCalendarEvent(id) {
    const result = await db.delete(calendarEvents).where(eq(calendarEvents.id, id));
    return result.rowCount > 0;
  }
  // Inventory
  async getInventoryItems() {
    return await db.select().from(inventory);
  }
  async getInventoryItem(id) {
    const result = await db.select().from(inventory).where(eq(inventory.id, id));
    return result[0] || void 0;
  }
  async createInventoryItem(insertItem) {
    const result = await db.insert(inventory).values(insertItem).returning();
    return result[0];
  }
  async updateInventoryItem(id, updates) {
    const result = await db.update(inventory).set(updates).where(eq(inventory.id, id)).returning();
    return result[0] || void 0;
  }
  async deleteInventoryItem(id) {
    const result = await db.delete(inventory).where(eq(inventory.id, id));
    return result.rowCount > 0;
  }
  // Financial Transactions
  async getFinancialTransactions() {
    return await db.select().from(financialTransactions);
  }
  async getFinancialTransaction(id) {
    const result = await db.select().from(financialTransactions).where(eq(financialTransactions.id, id));
    return result[0] || void 0;
  }
  async getFinancialTransactionsByDateRange(start, end) {
    const startDate = start;
    const endDate = end;
    return await db.select().from(financialTransactions).where(
      and(
        gte(financialTransactions.date, startDate),
        lte(financialTransactions.date, endDate)
      )
    );
  }
  async createFinancialTransaction(insertTransaction) {
    const result = await db.insert(financialTransactions).values(insertTransaction).returning();
    return result[0];
  }
  // Loyalty Rewards
  async getLoyaltyRewards() {
    return await db.select().from(loyaltyRewards);
  }
  async getLoyaltyReward(id) {
    const result = await db.select().from(loyaltyRewards).where(eq(loyaltyRewards.id, id));
    return result[0] || void 0;
  }
  async createLoyaltyReward(insertReward) {
    const result = await db.insert(loyaltyRewards).values(insertReward).returning();
    return result[0];
  }
  async updateLoyaltyReward(id, updates) {
    const result = await db.update(loyaltyRewards).set(updates).where(eq(loyaltyRewards.id, id)).returning();
    return result[0] || void 0;
  }
  // Festive Themes
  async getFestiveThemes() {
    return await db.select().from(festiveThemes);
  }
  async getActiveFestiveTheme() {
    const result = await db.select().from(festiveThemes).where(eq(festiveThemes.isActive, true));
    return result[0] || void 0;
  }
  async getFestiveTheme(id) {
    const result = await db.select().from(festiveThemes).where(eq(festiveThemes.id, id));
    return result[0] || void 0;
  }
  async createFestiveTheme(insertTheme) {
    const result = await db.insert(festiveThemes).values(insertTheme).returning();
    return result[0];
  }
  async updateFestiveTheme(id, updates) {
    const result = await db.update(festiveThemes).set(updates).where(eq(festiveThemes.id, id)).returning();
    return result[0] || void 0;
  }
  // Announcements
  async getAnnouncements() {
    return await db.select().from(announcements);
  }
  async getActiveAnnouncements() {
    return await db.select().from(announcements).where(eq(announcements.isActive, true));
  }
  async getAnnouncementsByPosition(position) {
    return await db.select().from(announcements).where(
      and(
        eq(announcements.isActive, true),
        eq(announcements.position, position)
      )
    );
  }
  async getAnnouncement(id) {
    const result = await db.select().from(announcements).where(eq(announcements.id, id));
    return result[0] || void 0;
  }
  async createAnnouncement(insertAnnouncement) {
    const result = await db.insert(announcements).values(insertAnnouncement).returning();
    return result[0];
  }
  async updateAnnouncement(id, updates) {
    const result = await db.update(announcements).set(updates).where(eq(announcements.id, id)).returning();
    return result[0] || void 0;
  }
};

// storage.ts
var storage = new DatabaseStorage();

// services/accounting.ts
var GST_RATE = 0.05;
var QST_RATE = 0.09975;
function calculateCanadianTaxes(subtotal) {
  const gstAmount = subtotal * GST_RATE;
  const qstAmount = subtotal * QST_RATE;
  const total = subtotal + gstAmount + qstAmount;
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    gstAmount: Math.round(gstAmount * 100) / 100,
    qstAmount: Math.round(qstAmount * 100) / 100,
    total: Math.round(total * 100) / 100
  };
}

// services/themes.ts
var THEME_CONFIGS = [
  {
    name: "No\xEBl",
    nameEn: "Christmas",
    startMonth: 12,
    startDay: 15,
    endMonth: 1,
    endDay: 7,
    colors: {
      primary: "hsl(0, 84%, 55%)",
      // festive red
      secondary: "hsl(140, 70%, 45%)",
      // festive green
      accent: "hsl(45, 85%, 50%)",
      // festive gold
      background: "hsl(0, 0%, 100%)"
    },
    animations: {
      snowfall: true,
      sparkles: true
    },
    icons: {
      tree: "fas fa-tree",
      gift: "fas fa-gift",
      star: "fas fa-star"
    }
  },
  {
    name: "Saint-Valentin",
    nameEn: "Valentine's Day",
    startMonth: 2,
    startDay: 10,
    endMonth: 2,
    endDay: 17,
    colors: {
      primary: "hsl(330, 75%, 60%)",
      // pink
      secondary: "hsl(0, 70%, 50%)",
      // red
      accent: "hsl(320, 85%, 70%)",
      // light pink
      background: "hsl(350, 100%, 98%)"
    },
    animations: {
      hearts: true,
      sparkles: true
    },
    icons: {
      heart: "fas fa-heart",
      rose: "fas fa-rose",
      kiss: "fas fa-kiss"
    }
  },
  {
    name: "P\xE2ques",
    nameEn: "Easter",
    startMonth: 3,
    // Will be calculated dynamically
    startDay: 20,
    endMonth: 4,
    endDay: 20,
    colors: {
      primary: "hsl(55, 85%, 65%)",
      // yellow
      secondary: "hsl(110, 60%, 55%)",
      // spring green
      accent: "hsl(280, 70%, 70%)",
      // lavender
      background: "hsl(120, 40%, 98%)"
    },
    animations: {
      butterflies: true,
      flowers: true
    },
    icons: {
      egg: "fas fa-egg",
      rabbit: "fas fa-rabbit",
      flower: "fas fa-seedling"
    }
  },
  {
    name: "Halloween",
    nameEn: "Halloween",
    startMonth: 10,
    startDay: 25,
    endMonth: 10,
    endDay: 31,
    colors: {
      primary: "hsl(25, 85%, 55%)",
      // orange
      secondary: "hsl(0, 0%, 10%)",
      // black
      accent: "hsl(280, 85%, 45%)",
      // purple
      background: "hsl(25, 30%, 5%)"
    },
    animations: {
      bats: true,
      spiders: true,
      fog: true
    },
    icons: {
      pumpkin: "fas fa-pumpkin",
      ghost: "fas fa-ghost",
      spider: "fas fa-spider"
    }
  },
  {
    name: "F\xEAte du Canada",
    nameEn: "Canada Day",
    startMonth: 6,
    startDay: 28,
    endMonth: 7,
    endDay: 3,
    colors: {
      primary: "hsl(0, 75%, 50%)",
      // red
      secondary: "hsl(0, 0%, 100%)",
      // white
      accent: "hsl(0, 75%, 40%)",
      // dark red
      background: "hsl(0, 50%, 98%)"
    },
    animations: {
      fireworks: true,
      flags: true
    },
    icons: {
      maple: "fas fa-maple-leaf",
      flag: "fas fa-flag",
      firework: "fas fa-sparkles"
    }
  },
  {
    name: "Ind\xE9pendance Ha\xEFti",
    nameEn: "Haiti Independence",
    startMonth: 1,
    startDay: 1,
    endMonth: 1,
    endDay: 1,
    colors: {
      primary: "hsl(220, 85%, 50%)",
      // blue
      secondary: "hsl(0, 85%, 50%)",
      // red
      accent: "hsl(45, 85%, 50%)",
      // gold
      background: "hsl(220, 30%, 98%)"
    },
    animations: {
      flags: true,
      stars: true
    },
    icons: {
      flag: "fas fa-flag",
      star: "fas fa-star",
      heart: "fas fa-heart"
    }
  },
  {
    name: "Printemps",
    nameEn: "Spring",
    startMonth: 3,
    startDay: 20,
    endMonth: 6,
    endDay: 20,
    colors: {
      primary: "hsl(110, 60%, 50%)",
      // green
      secondary: "hsl(340, 75%, 65%)",
      // pink
      accent: "hsl(55, 85%, 60%)",
      // yellow
      background: "hsl(110, 40%, 98%)"
    },
    animations: {
      flowers: true,
      butterflies: true,
      leaves: true
    },
    icons: {
      flower: "fas fa-seedling",
      butterfly: "fas fa-spa",
      sun: "fas fa-sun"
    }
  },
  {
    name: "\xC9t\xE9",
    nameEn: "Summer",
    startMonth: 6,
    startDay: 21,
    endMonth: 9,
    endDay: 22,
    colors: {
      primary: "hsl(200, 85%, 55%)",
      // blue
      secondary: "hsl(55, 85%, 60%)",
      // yellow
      accent: "hsl(25, 85%, 55%)",
      // orange
      background: "hsl(200, 60%, 98%)"
    },
    animations: {
      waves: true,
      sunshine: true
    },
    icons: {
      sun: "fas fa-sun",
      umbrella: "fas fa-umbrella-beach",
      wave: "fas fa-water"
    }
  }
];
function getCurrentTheme() {
  const now = /* @__PURE__ */ new Date();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();
  for (const theme of THEME_CONFIGS) {
    if (isDateInThemeRange(currentMonth, currentDay, theme)) {
      return theme;
    }
  }
  return null;
}
function isDateInThemeRange(month, day, theme) {
  const currentDate = month * 100 + day;
  const startDate = theme.startMonth * 100 + theme.startDay;
  const endDate = theme.endMonth * 100 + theme.endDay;
  if (startDate > endDate) {
    return currentDate >= startDate || currentDate <= endDate;
  }
  return currentDate >= startDate && currentDate <= endDate;
}
async function updateThemeAutomatically(storage2) {
  const currentThemeConfig = getCurrentTheme();
  const activeTheme = await storage2.getActiveFestiveTheme();
  if (!currentThemeConfig) {
    if (activeTheme) {
      await storage2.updateFestiveTheme(activeTheme.id, { isActive: false });
    }
    return;
  }
  if (activeTheme && activeTheme.name === currentThemeConfig.name) {
    return;
  }
  const allThemes = await storage2.getFestiveThemes();
  let targetTheme = allThemes.find((theme) => theme.name === currentThemeConfig.name);
  if (!targetTheme) {
    targetTheme = await storage2.createFestiveTheme({
      name: currentThemeConfig.name,
      nameEn: currentThemeConfig.nameEn,
      description: `Th\xE8me automatique pour ${currentThemeConfig.name}`,
      isActive: false,
      isAutomatic: true,
      startDate: `2024-${currentThemeConfig.startMonth.toString().padStart(2, "0")}-${currentThemeConfig.startDay.toString().padStart(2, "0")}`,
      endDate: `2024-${currentThemeConfig.endMonth.toString().padStart(2, "0")}-${currentThemeConfig.endDay.toString().padStart(2, "0")}`,
      colors: currentThemeConfig.colors,
      animations: currentThemeConfig.animations,
      icons: currentThemeConfig.icons,
      priority: 1,
      recurringYearly: true
    });
  }
  for (const theme of allThemes) {
    if (theme.isActive) {
      await storage2.updateFestiveTheme(theme.id, { isActive: false });
    }
  }
  await storage2.updateFestiveTheme(targetTheme.id, { isActive: true });
}

// routes.ts
import bcrypt from "bcrypt";
import { nanoid as nanoid2 } from "nanoid";
async function registerRoutes(app2) {
  const requireAuth = (req, res, next) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Non autoris\xE9" });
    }
    next();
  };
  const requireAdmin = (req, res, next) => {
    if (!req.session?.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    if (!["admin", "manager"].includes(req.session.user.role)) {
      console.error(`Security alert: Unauthorized admin access attempt by ${req.session.user.username}`);
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  };
  const requireStaff = (req, res, next) => {
    if (!req.session?.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    if (!["admin", "manager", "staff"].includes(req.session.user.role)) {
      return res.status(403).json({ message: "Staff access required" });
    }
    next();
  };
  const requirePermission = (permission) => {
    return async (req, res, next) => {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      try {
        const employee = await storage.getEmployeeByUserId(req.session.user.id);
        const rolePermissions2 = await storage.getRolePermissionByName(req.session.user.role);
        const hasRolePermission = rolePermissions2?.permissions?.[permission] === true;
        const hasEmployeePermission = employee?.permissions?.[permission] === true;
        if (!hasRolePermission && !hasEmployeePermission) {
          return res.status(403).json({ message: `Permission required: ${permission}` });
        }
        next();
      } catch (error) {
        console.error("Permission check error:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    };
  };
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password || typeof username !== "string" || typeof password !== "string") {
        return res.status(400).json({ message: "Invalid input format" });
      }
      let user = await storage.getUserByUsername(username.trim().toLowerCase());
      if (!user) {
        user = await storage.getUserByEmail(username.trim().toLowerCase());
      }
      if (!user) {
        await new Promise((resolve) => setTimeout(resolve, 1e3));
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        await new Promise((resolve) => setTimeout(resolve, 1e3));
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const validRoles = ["admin", "manager", "staff", "client"];
      if (!validRoles.includes(user.role)) {
        console.error(`Security alert: Invalid role ${user.role} for user ${user.username}`);
        return res.status(403).json({ message: "Access denied - invalid role" });
      }
      if (req.session) {
        req.session.userId = user.id;
        req.session.user = {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isEmployeeClient: user.isEmployeeClient || false,
          phoneNumber: user.phoneNumber,
          loyaltyPoints: user.loyaltyPoints || 0
        };
      }
      const { password: _, ...userResponse } = user;
      res.json({
        message: "Login successful",
        user: userResponse
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, password, firstName, lastName, phoneNumber, role, company, address } = req.body;
      if (!username || !email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: "Required fields missing" });
      }
      const existingUserByUsername = await storage.getUserByUsername(username);
      if (existingUserByUsername) {
        return res.status(409).json({ message: "Username already exists" });
      }
      const existingUserByEmail = await storage.getUserByEmail(email);
      if (existingUserByEmail) {
        return res.status(409).json({ message: "Email already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phoneNumber: phoneNumber || null,
        role: role || "client",
        loyaltyPoints: 0,
        company: company || null,
        address: address || null,
        preferences: {
          language: "fr",
          notifications: true,
          theme: "haitian"
        },
        allergies: []
      });
      if ((role || "client") === "client") {
        await storage.createClient({
          firstName,
          lastName,
          email,
          phoneNumber: phoneNumber || null,
          company: company || null,
          address: address || null,
          source: "registration"
        });
      }
      const { password: _, ...userResponse } = newUser;
      res.status(201).json({
        message: "User created successfully",
        user: userResponse
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/auth/logout", (req, res) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "Could not log out" });
        }
        res.clearCookie("connect.sid");
        res.json({ message: "Logged out successfully" });
      });
    } else {
      res.json({ message: "Already logged out" });
    }
  });
  app2.get("/api/auth/me", (req, res) => {
    if (req.session?.user) {
      res.json(req.session.user);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });
  const passwordResetCodes = /* @__PURE__ */ new Map();
  app2.post("/api/admin/generate-password-reset", requireAdmin, async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email requis" });
      }
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouv\xE9" });
      }
      const resetCode = nanoid2(12).toUpperCase();
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1e3);
      passwordResetCodes.set(resetCode, {
        userId: user.id,
        expires,
        used: false
      });
      res.json({
        message: "Code de r\xE9cup\xE9ration g\xE9n\xE9r\xE9",
        resetCode,
        expiresAt: expires,
        instructions: `Transmettez ce code au client ${user.firstName} ${user.lastName} (${user.email}). Le code expire dans 24 heures.`,
        resetUrl: `http://localhost/reset-password?code=${resetCode}`
      });
    } catch (error) {
      console.error("Password reset generation error:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.get("/api/admin/password-reset-codes", requireAdmin, async (req, res) => {
    try {
      const activeCodes = [];
      const now = /* @__PURE__ */ new Date();
      for (const [code, data] of passwordResetCodes.entries()) {
        if (!data.used && data.expires > now) {
          const user = await storage.getUser(data.userId);
          activeCodes.push({
            code,
            user: user ? { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } : null,
            expires: data.expires,
            timeRemaining: Math.round((data.expires.getTime() - now.getTime()) / (1e3 * 60 * 60)) + " heures"
          });
        }
      }
      res.json(activeCodes);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.post("/api/auth/verify-reset-code", async (req, res) => {
    try {
      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ message: "Code requis" });
      }
      const resetData = passwordResetCodes.get(code);
      if (!resetData) {
        return res.status(400).json({ message: "Code invalide" });
      }
      if (resetData.used) {
        return res.status(400).json({ message: "Code d\xE9j\xE0 utilis\xE9" });
      }
      if (resetData.expires < /* @__PURE__ */ new Date()) {
        passwordResetCodes.delete(code);
        return res.status(400).json({ message: "Code expir\xE9" });
      }
      const user = await storage.getUser(resetData.userId);
      if (!user) {
        return res.status(400).json({ message: "Utilisateur non trouv\xE9" });
      }
      res.json({
        valid: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { code, newPassword } = req.body;
      if (!code || !newPassword) {
        return res.status(400).json({ message: "Code et nouveau mot de passe requis" });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caract\xE8res" });
      }
      const resetData = passwordResetCodes.get(code);
      if (!resetData) {
        return res.status(400).json({ message: "Code invalide" });
      }
      if (resetData.used) {
        return res.status(400).json({ message: "Code d\xE9j\xE0 utilis\xE9" });
      }
      if (resetData.expires < /* @__PURE__ */ new Date()) {
        passwordResetCodes.delete(code);
        return res.status(400).json({ message: "Code expir\xE9" });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await storage.updateUser(resetData.userId, { password: hashedPassword });
      resetData.used = true;
      setTimeout(() => {
        passwordResetCodes.delete(code);
      }, 60 * 60 * 1e3);
      res.json({
        message: "Mot de passe r\xE9initialis\xE9 avec succ\xE8s"
      });
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  setInterval(() => {
    const now = /* @__PURE__ */ new Date();
    for (const [code, data] of passwordResetCodes.entries()) {
      if (data.expires < now) {
        passwordResetCodes.delete(code);
      }
    }
  }, 60 * 60 * 1e3);
  app2.get("/api/admin/role-permissions", requireAdmin, async (req, res) => {
    try {
      const roles = await storage.getRolePermissions();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.post("/api/admin/role-permissions", requireAdmin, async (req, res) => {
    try {
      const roleData = insertRolePermissionSchema.parse(req.body);
      const role = await storage.createRolePermission(roleData);
      res.status(201).json(role);
    } catch (error) {
      res.status(400).json({ message: "Donn\xE9es invalides" });
    }
  });
  app2.put("/api/admin/role-permissions/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertRolePermissionSchema.partial().parse(req.body);
      const role = await storage.updateRolePermission(id, updates);
      if (!role) {
        return res.status(404).json({ message: "R\xF4le non trouv\xE9" });
      }
      res.json(role);
    } catch (error) {
      res.status(400).json({ message: "Donn\xE9es invalides" });
    }
  });
  app2.get("/api/clients", requireStaff, async (req, res) => {
    try {
      const { search } = req.query;
      let clients2;
      if (search) {
        clients2 = await storage.searchClients(search);
      } else {
        clients2 = await storage.getClients();
      }
      res.json(clients2);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.get("/api/clients/:id", requireStaff, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const client2 = await storage.getClient(id);
      if (!client2) {
        return res.status(404).json({ message: "Client non trouv\xE9" });
      }
      res.json(client2);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.post("/api/clients", requireStaff, async (req, res) => {
    try {
      const clientData = insertClientSchema.parse(req.body);
      const client2 = await storage.createClient(clientData);
      res.status(201).json(client2);
    } catch (error) {
      res.status(400).json({ message: "Donn\xE9es invalides" });
    }
  });
  app2.put("/api/clients/:id", requireStaff, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertClientSchema.partial().parse(req.body);
      const client2 = await storage.updateClient(id, updates);
      if (!client2) {
        return res.status(404).json({ message: "Client non trouv\xE9" });
      }
      res.json(client2);
    } catch (error) {
      res.status(400).json({ message: "Donn\xE9es invalides" });
    }
  });
  app2.delete("/api/clients/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteClient(id);
      if (!deleted) {
        return res.status(404).json({ message: "Client non trouv\xE9" });
      }
      res.json({ message: "Client supprim\xE9" });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.get("/api/company-settings", async (req, res) => {
    try {
      const settings = await storage.getCompanySettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.put("/api/company-settings", requireAdmin, async (req, res) => {
    try {
      const settingsData = insertCompanySettingsSchema.parse(req.body);
      const existingSettings = await storage.getCompanySettings();
      let settings;
      if (existingSettings) {
        settings = await storage.updateCompanySettings(existingSettings.id, settingsData);
      } else {
        settings = await storage.createCompanySettings(settingsData);
      }
      res.json(settings);
    } catch (error) {
      res.status(400).json({ message: "Donn\xE9es invalides" });
    }
  });
  app2.get("/api/quotes", requireStaff, async (req, res) => {
    try {
      const { clientId } = req.query;
      let quotes2;
      if (clientId) {
        quotes2 = await storage.getQuotesByClient(parseInt(clientId));
      } else {
        quotes2 = await storage.getQuotes();
      }
      res.json(quotes2);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.get("/api/quotes/:id", requireStaff, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const quote = await storage.getQuote(id);
      if (!quote) {
        return res.status(404).json({ message: "Devis non trouv\xE9" });
      }
      res.json(quote);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.post("/api/quotes", requireStaff, async (req, res) => {
    try {
      const quoteData = insertQuoteSchema.parse(req.body);
      const quoteNumber = `DV${(/* @__PURE__ */ new Date()).getFullYear()}${String(Date.now()).slice(-6)}`;
      const subtotal = parseFloat(quoteData.subtotalHT);
      const { gstAmount, qstAmount, total } = calculateCanadianTaxes(subtotal);
      const quote = await storage.createQuote({
        ...quoteData,
        quoteNumber,
        taxAmount: (gstAmount + qstAmount).toFixed(2),
        totalTTC: total.toFixed(2),
        createdBy: req.session.userId
      });
      res.status(201).json(quote);
    } catch (error) {
      res.status(400).json({ message: "Donn\xE9es invalides" });
    }
  });
  app2.put("/api/quotes/:id", requireStaff, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertQuoteSchema.partial().parse(req.body);
      if (updates.subtotalHT) {
        const subtotal = parseFloat(updates.subtotalHT);
        const { gstAmount, qstAmount, total } = calculateCanadianTaxes(subtotal);
        updates.taxAmount = (gstAmount + qstAmount).toFixed(2);
        updates.totalTTC = total.toFixed(2);
      }
      const quote = await storage.updateQuote(id, updates);
      if (!quote) {
        return res.status(404).json({ message: "Devis non trouv\xE9" });
      }
      res.json(quote);
    } catch (error) {
      res.status(400).json({ message: "Donn\xE9es invalides" });
    }
  });
  app2.post("/api/quotes/:id/send", requireStaff, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const quote = await storage.updateQuote(id, {
        status: "sent",
        sentAt: /* @__PURE__ */ new Date()
      });
      if (!quote) {
        return res.status(404).json({ message: "Devis non trouv\xE9" });
      }
      res.json({
        message: "Devis marqu\xE9 comme envoy\xE9 (notification manuelle requise)",
        quote,
        note: "Veuillez contacter le client manuellement pour lui transmettre le devis"
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.delete("/api/quotes/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteQuote(id);
      if (!deleted) {
        return res.status(404).json({ message: "Devis non trouv\xE9" });
      }
      res.json({ message: "Devis supprim\xE9" });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.get("/api/galleries", async (req, res) => {
    try {
      const galleries2 = await storage.getGalleries();
      res.json(galleries2);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.post("/api/galleries", requirePermission("manage_galleries"), async (req, res) => {
    try {
      const galleryData = insertGallerySchema.parse(req.body);
      const gallery = await storage.createGallery(galleryData);
      res.status(201).json(gallery);
    } catch (error) {
      res.status(400).json({ message: "Donn\xE9es invalides" });
    }
  });
  app2.put("/api/galleries/:id", requirePermission("manage_galleries"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertGallerySchema.partial().parse(req.body);
      const gallery = await storage.updateGallery(id, updates);
      if (!gallery) {
        return res.status(404).json({ message: "Galerie non trouv\xE9e" });
      }
      res.json(gallery);
    } catch (error) {
      res.status(400).json({ message: "Donn\xE9es invalides" });
    }
  });
  app2.delete("/api/galleries/:id", requirePermission("manage_galleries"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteGallery(id);
      if (!deleted) {
        return res.status(404).json({ message: "Galerie non trouv\xE9e" });
      }
      res.json({ message: "Galerie supprim\xE9e" });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.get("/api/gallery-images", async (req, res) => {
    try {
      const { galleryId } = req.query;
      const images = await storage.getGalleryImages(galleryId ? parseInt(galleryId) : void 0);
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.post("/api/gallery-images", requirePermission("manage_galleries"), async (req, res) => {
    try {
      const imageData = insertGalleryImageSchema.parse(req.body);
      const image = await storage.createGalleryImage({
        ...imageData,
        uploadedBy: req.session.userId
      });
      res.status(201).json(image);
    } catch (error) {
      res.status(400).json({ message: "Donn\xE9es invalides" });
    }
  });
  app2.put("/api/gallery-images/:id", requirePermission("manage_galleries"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertGalleryImageSchema.partial().parse(req.body);
      const image = await storage.updateGalleryImage(id, updates);
      if (!image) {
        return res.status(404).json({ message: "Image non trouv\xE9e" });
      }
      res.json(image);
    } catch (error) {
      res.status(400).json({ message: "Donn\xE9es invalides" });
    }
  });
  app2.delete("/api/gallery-images/:id", requirePermission("manage_galleries"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteGalleryImage(id);
      if (!deleted) {
        return res.status(404).json({ message: "Image non trouv\xE9e" });
      }
      res.json({ message: "Image supprim\xE9e" });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.get("/api/content-pages", async (req, res) => {
    try {
      const pages = await storage.getContentPages();
      res.json(pages);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.get("/api/content-pages/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const page = await storage.getContentPageBySlug(slug);
      if (!page) {
        return res.status(404).json({ message: "Page non trouv\xE9e" });
      }
      res.json(page);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.post("/api/content-pages", requirePermission("manage_content"), async (req, res) => {
    try {
      const pageData = insertContentPageSchema.parse(req.body);
      const page = await storage.createContentPage({
        ...pageData,
        lastEditedBy: req.session.userId
      });
      res.status(201).json(page);
    } catch (error) {
      res.status(400).json({ message: "Donn\xE9es invalides" });
    }
  });
  app2.put("/api/content-pages/:id", requirePermission("manage_content"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertContentPageSchema.partial().parse(req.body);
      const page = await storage.updateContentPage(id, {
        ...updates,
        lastEditedBy: req.session.userId
      });
      if (!page) {
        return res.status(404).json({ message: "Page non trouv\xE9e" });
      }
      res.json(page);
    } catch (error) {
      res.status(400).json({ message: "Donn\xE9es invalides" });
    }
  });
  app2.delete("/api/content-pages/:id", requirePermission("manage_content"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteContentPage(id);
      if (!deleted) {
        return res.status(404).json({ message: "Page non trouv\xE9e" });
      }
      res.json({ message: "Page supprim\xE9e" });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.get("/api/customer-messages", requireStaff, async (req, res) => {
    try {
      const { unread } = req.query;
      let messages;
      if (unread === "true") {
        messages = await storage.getUnreadCustomerMessages();
      } else {
        messages = await storage.getCustomerMessages();
      }
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.post("/api/customer-messages", async (req, res) => {
    try {
      const messageData = insertCustomerMessageSchema.parse(req.body);
      const message = await storage.createCustomerMessage(messageData);
      const existingClient = await storage.getClientByEmail(messageData.email);
      if (!existingClient) {
        await storage.createClient({
          firstName: messageData.firstName,
          lastName: messageData.lastName,
          email: messageData.email,
          phoneNumber: messageData.phoneNumber,
          source: "contact_form"
        });
      }
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: "Donn\xE9es invalides" });
    }
  });
  app2.put("/api/customer-messages/:id", requireStaff, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertCustomerMessageSchema.partial().parse(req.body);
      const message = await storage.updateCustomerMessage(id, updates);
      if (!message) {
        return res.status(404).json({ message: "Message non trouv\xE9" });
      }
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: "Donn\xE9es invalides" });
    }
  });
  app2.get("/api/internal-messages", requireAuth, async (req, res) => {
    try {
      const { type = "received" } = req.query;
      let messages;
      if (type === "sent") {
        messages = await storage.getSentInternalMessages(req.session.userId);
      } else {
        messages = await storage.getInternalMessages(req.session.userId);
      }
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.post("/api/internal-messages", requireAuth, async (req, res) => {
    try {
      const messageData = insertInternalMessageSchema.parse(req.body);
      const message = await storage.createInternalMessage({
        ...messageData,
        senderId: req.session.userId,
        threadId: messageData.threadId || Date.now()
      });
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: "Donn\xE9es invalides" });
    }
  });
  app2.put("/api/internal-messages/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertInternalMessageSchema.partial().parse(req.body);
      const message = await storage.updateInternalMessage(id, updates);
      if (!message) {
        return res.status(404).json({ message: "Message non trouv\xE9" });
      }
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: "Donn\xE9es invalides" });
    }
  });
  app2.delete("/api/internal-messages/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { isRecipient } = req.query;
      const deleted = await storage.deleteInternalMessage(
        id,
        req.session.userId,
        isRecipient === "true"
      );
      if (!deleted) {
        return res.status(404).json({ message: "Message non trouv\xE9" });
      }
      res.json({ message: "Message supprim\xE9" });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.get("/api/client-messages", requireStaff, async (req, res) => {
    try {
      const { clientId } = req.query;
      let messages;
      if (clientId) {
        messages = await storage.getClientMessagesByClient(parseInt(clientId));
      } else {
        messages = await storage.getClientMessages();
      }
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.post("/api/client-messages", requireStaff, async (req, res) => {
    try {
      const messageData = insertClientMessageSchema.parse(req.body);
      const message = await storage.createClientMessage({
        ...messageData,
        senderId: req.session.userId,
        sentAt: /* @__PURE__ */ new Date()
      });
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: "Donn\xE9es invalides" });
    }
  });
  app2.get("/api/menu", async (req, res) => {
    try {
      const items = await storage.getMenuItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.post("/api/menu", requirePermission("manage_menu"), async (req, res) => {
    try {
      const itemData = insertMenuItemSchema.parse(req.body);
      const item = await storage.createMenuItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ message: "Donn\xE9es invalides" });
    }
  });
  app2.put("/api/menu/:id", requirePermission("manage_menu"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertMenuItemSchema.partial().parse(req.body);
      const item = await storage.updateMenuItem(id, updates);
      if (!item) {
        return res.status(404).json({ message: "Article non trouv\xE9" });
      }
      res.json(item);
    } catch (error) {
      res.status(400).json({ message: "Donn\xE9es invalides" });
    }
  });
  app2.put("/api/menu/:id/price", requirePermission("manage_menu"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { price } = req.body;
      if (!price || isNaN(parseFloat(price))) {
        return res.status(400).json({ message: "Prix invalide" });
      }
      const item = await storage.updateMenuItem(id, { price });
      if (!item) {
        return res.status(404).json({ message: "Article non trouv\xE9" });
      }
      res.json(item);
    } catch (error) {
      res.status(400).json({ message: "Donn\xE9es invalides" });
    }
  });
  app2.put("/api/menu/:id/photo", requirePermission("manage_menu"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { imageUrl } = req.body;
      if (!imageUrl) {
        return res.status(400).json({ message: "URL de l'image requise" });
      }
      const item = await storage.updateMenuItem(id, { imageUrl });
      if (!item) {
        return res.status(404).json({ message: "Article non trouv\xE9" });
      }
      res.json(item);
    } catch (error) {
      res.status(400).json({ message: "Donn\xE9es invalides" });
    }
  });
  app2.delete("/api/menu/:id", requirePermission("manage_menu"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteMenuItem(id);
      if (!deleted) {
        return res.status(404).json({ message: "Article non trouv\xE9" });
      }
      res.json({ message: "Article supprim\xE9" });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.get("/api/announcements", async (req, res) => {
    try {
      const { position, active } = req.query;
      let announcements2;
      if (position) {
        announcements2 = await storage.getAnnouncementsByPosition(position);
      } else if (active === "true") {
        announcements2 = await storage.getActiveAnnouncements();
      } else {
        announcements2 = await storage.getAnnouncements();
      }
      res.json(announcements2);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.post("/api/announcements", requirePermission("manage_announcements"), async (req, res) => {
    try {
      const announcementData = insertAnnouncementSchema.parse(req.body);
      const announcement = await storage.createAnnouncement({
        ...announcementData,
        createdBy: req.session.userId
      });
      res.status(201).json(announcement);
    } catch (error) {
      res.status(400).json({ message: "Donn\xE9es invalides" });
    }
  });
  app2.put("/api/announcements/:id", requirePermission("manage_announcements"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertAnnouncementSchema.partial().parse(req.body);
      const announcement = await storage.updateAnnouncement(id, updates);
      if (!announcement) {
        return res.status(404).json({ message: "Annonce non trouv\xE9e" });
      }
      res.json(announcement);
    } catch (error) {
      res.status(400).json({ message: "Donn\xE9es invalides" });
    }
  });
  app2.get("/api/admin/stats", requireStaff, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouv\xE9" });
      }
      res.json({ ...user, password: void 0 });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.get("/api/users", requireAuth, async (req, res) => {
    try {
      const currentUser = await storage.getUser(req.session.userId);
      if (currentUser?.role !== "admin") {
        return res.status(403).json({ message: "Acc\xE8s refus\xE9" });
      }
      const users2 = await storage.getUsers();
      res.json(users2.map((u) => ({ ...u, password: void 0 })));
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.post("/api/users", requireAdmin, async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      res.status(201).json({ ...user, password: void 0 });
    } catch (error) {
      res.status(400).json({ message: "Donn\xE9es invalides" });
    }
  });
  app2.get("/api/orders", requireAuth, async (req, res) => {
    try {
      const orders2 = await storage.getOrders();
      res.json(orders2);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.post("/api/orders", requireAuth, async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const subtotal = parseFloat(orderData.totalAmount);
      const { gstAmount, qstAmount, total } = calculateCanadianTaxes(subtotal);
      const order = await storage.createOrder({
        ...orderData,
        gstAmount: gstAmount.toString(),
        qstAmount: qstAmount.toString(),
        totalAmount: total.toString()
      });
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: "Donn\xE9es invalides" });
    }
  });
  app2.put("/api/orders/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertOrderSchema.partial().parse(req.body);
      const order = await storage.updateOrder(id, updates);
      if (!order) {
        return res.status(404).json({ message: "Commande non trouv\xE9e" });
      }
      res.json(order);
    } catch (error) {
      res.status(400).json({ message: "Donn\xE9es invalides" });
    }
  });
  app2.get("/api/reservations", requireAuth, async (req, res) => {
    try {
      const reservations2 = await storage.getReservations();
      res.json(reservations2);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.get("/api/reservations/date/:date", async (req, res) => {
    try {
      const date2 = req.params.date;
      const reservations2 = await storage.getReservationsByDate(date2);
      res.json(reservations2);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.post("/api/reservations", async (req, res) => {
    try {
      const reservationData = insertReservationSchema.parse(req.body);
      const confirmationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const reservation = await storage.createReservation({
        ...reservationData,
        confirmationCode
      });
      res.status(201).json(reservation);
    } catch (error) {
      res.status(400).json({ message: "Donn\xE9es invalides" });
    }
  });
  app2.put("/api/reservations/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertReservationSchema.partial().parse(req.body);
      const reservation = await storage.updateReservation(id, updates);
      if (!reservation) {
        return res.status(404).json({ message: "R\xE9servation non trouv\xE9e" });
      }
      res.json(reservation);
    } catch (error) {
      res.status(400).json({ message: "Donn\xE9es invalides" });
    }
  });
  app2.get("/api/calendar/events", requireAuth, async (req, res) => {
    try {
      const { start, end } = req.query;
      if (start && end) {
        const events = await storage.getCalendarEventsByDateRange(start, end);
        res.json(events);
      } else {
        const events = await storage.getCalendarEvents();
        res.json(events);
      }
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.post("/api/calendar/events", requireAuth, async (req, res) => {
    try {
      const eventData = insertCalendarEventSchema.parse(req.body);
      const event = await storage.createCalendarEvent({
        ...eventData,
        createdBy: req.session.userId
      });
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ message: "Donn\xE9es invalides" });
    }
  });
  app2.put("/api/calendar/events/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertCalendarEventSchema.partial().parse(req.body);
      const event = await storage.updateCalendarEvent(id, updates);
      if (!event) {
        return res.status(404).json({ message: "\xC9v\xE9nement non trouv\xE9" });
      }
      res.json(event);
    } catch (error) {
      res.status(400).json({ message: "Donn\xE9es invalides" });
    }
  });
  app2.delete("/api/calendar/events/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteCalendarEvent(id);
      if (!deleted) {
        return res.status(404).json({ message: "\xC9v\xE9nement non trouv\xE9" });
      }
      res.json({ message: "\xC9v\xE9nement supprim\xE9" });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.get("/api/finance/transactions", requireAuth, async (req, res) => {
    try {
      const { start, end } = req.query;
      if (start && end) {
        const transactions = await storage.getFinancialTransactionsByDateRange(start, end);
        res.json(transactions);
      } else {
        const transactions = await storage.getFinancialTransactions();
        res.json(transactions);
      }
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.post("/api/finance/transactions", requireAuth, async (req, res) => {
    try {
      const transactionData = insertFinancialTransactionSchema.parse(req.body);
      const transaction = await storage.createFinancialTransaction({
        ...transactionData,
        createdBy: req.session.userId
      });
      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ message: "Donn\xE9es invalides" });
    }
  });
  app2.get("/api/finance/summary", requireAuth, async (req, res) => {
    try {
      const transactions = await storage.getFinancialTransactions();
      const totalRevenue = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + parseFloat(t.amount), 0);
      const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + parseFloat(t.amount), 0);
      const totalGST = transactions.reduce((sum, t) => sum + parseFloat(t.gstAmount || "0"), 0);
      const totalQST = transactions.reduce((sum, t) => sum + parseFloat(t.qstAmount || "0"), 0);
      const netProfit = totalRevenue - totalExpenses;
      res.json({
        totalRevenue,
        totalExpenses,
        totalGST,
        totalQST,
        netProfit
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.post("/api/finance/calculate-taxes", requireAuth, async (req, res) => {
    try {
      const { amount } = req.body;
      const taxes = calculateCanadianTaxes(parseFloat(amount));
      res.json(taxes);
    } catch (error) {
      res.status(400).json({ message: "Montant invalide" });
    }
  });
  app2.get("/api/themes", async (req, res) => {
    try {
      const themes = await storage.getFestiveThemes();
      res.json(themes);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.get("/api/themes/active", async (req, res) => {
    try {
      await updateThemeAutomatically(storage);
      const theme = await storage.getActiveFestiveTheme();
      res.json(theme);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.put("/api/themes/:id/activate", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const allThemes = await storage.getFestiveThemes();
      for (const theme2 of allThemes) {
        await storage.updateFestiveTheme(theme2.id, { isActive: false });
      }
      const theme = await storage.updateFestiveTheme(id, { isActive: true });
      if (!theme) {
        return res.status(404).json({ message: "Th\xE8me non trouv\xE9" });
      }
      res.json(theme);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.post("/api/themes", requireAuth, async (req, res) => {
    try {
      const themeData = insertFestiveThemeSchema.parse(req.body);
      const theme = await storage.createFestiveTheme(themeData);
      res.status(201).json(theme);
    } catch (error) {
      res.status(400).json({ message: "Donn\xE9es invalides" });
    }
  });
  app2.get("/api/loyalty/rewards", async (req, res) => {
    try {
      const rewards = await storage.getLoyaltyRewards();
      res.json(rewards);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.post("/api/loyalty/rewards", requireAuth, async (req, res) => {
    try {
      const rewardData = insertLoyaltyRewardSchema.parse(req.body);
      const reward = await storage.createLoyaltyReward(rewardData);
      res.status(201).json(reward);
    } catch (error) {
      res.status(400).json({ message: "Donn\xE9es invalides" });
    }
  });
  app2.get("/api/inventory", requireAuth, async (req, res) => {
    try {
      const items = await storage.getInventoryItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.post("/api/inventory", requireAuth, async (req, res) => {
    try {
      const itemData = insertInventorySchema.parse(req.body);
      const item = await storage.createInventoryItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ message: "Donn\xE9es invalides" });
    }
  });
  app2.get("/api/health", async (req, res) => {
    try {
      const users2 = await storage.getUsers();
      const dbStatus = users2 ? "connected" : "disconnected";
      res.json({
        status: "healthy",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        version: "1.0.0",
        database: dbStatus,
        services: {
          auth: "running",
          quotes: "running",
          orders: "running",
          reservations: "running",
          messaging: "running",
          inventory: "running",
          finance: "running"
        },
        uptime: process.uptime(),
        memory: process.memoryUsage()
      });
    } catch (error) {
      res.status(503).json({
        status: "unhealthy",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        error: "Database connection failed"
      });
    }
  });
  app2.get("/api/dashboard/stats", requireAuth, async (req, res) => {
    try {
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1e3).toISOString().split("T")[0];
      const orders2 = await storage.getOrders();
      const todayOrders = orders2.filter(
        (order) => order.createdAt.toISOString().split("T")[0] === today
      );
      const todayRevenue = todayOrders.reduce(
        (sum, order) => sum + parseFloat(order.totalAmount),
        0
      );
      const activeOrders = orders2.filter(
        (order) => ["pending", "confirmed", "preparing"].includes(order.status)
      ).length;
      const tomorrowReservations = await storage.getReservationsByDate(tomorrow);
      const users2 = await storage.getUsers?.() || [];
      const totalLoyaltyPoints = users2.reduce((sum, user) => sum + (user.loyaltyPoints || 0), 0);
      const unreadCustomerMessages = await storage.getUnreadCustomerMessages();
      const totalClients = (await storage.getClients()).length;
      const recentQuotes = (await storage.getQuotes()).slice(0, 5);
      res.json({
        todayRevenue,
        activeOrders,
        tomorrowReservations: tomorrowReservations.length,
        totalLoyaltyPoints,
        unreadMessages: unreadCustomerMessages.length,
        totalClients,
        recentQuotes: recentQuotes.length
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// init-data.ts
import bcrypt2 from "bcrypt";
async function initializeData() {
  console.log("\u{1F680} Initialisation des donn\xE9es Dounie Cuisine...");
  try {
    await initializeRolePermissions();
    await initializeCompanySettings();
    await initializeDefaultUsers();
    await initializeDefaultGalleries();
    await initializeContentPages();
    await initializeMenuData();
    await initializeFestiveThemes();
    await initializeDefaultAnnouncements();
    console.log("\u2705 Initialisation termin\xE9e avec succ\xE8s!");
  } catch (error) {
    console.error("\u274C Erreur lors de l'initialisation:", error);
    throw error;
  }
}
async function initializeRolePermissions() {
  console.log("\u{1F510} Initialisation des permissions par r\xF4le...");
  const roles = [
    {
      roleName: "admin",
      description: "Administrateur syst\xE8me - Acc\xE8s complet",
      permissions: {
        // Gestion utilisateurs
        manage_users: true,
        view_users: true,
        create_users: true,
        edit_users: true,
        delete_users: true,
        // Gestion clients
        manage_clients: true,
        view_clients: true,
        create_clients: true,
        edit_clients: true,
        delete_clients: true,
        // Gestion menu
        manage_menu: true,
        view_menu: true,
        create_menu_items: true,
        edit_menu_items: true,
        delete_menu_items: true,
        // Gestion devis
        manage_quotes: true,
        view_quotes: true,
        create_quotes: true,
        edit_quotes: true,
        delete_quotes: true,
        send_quotes: true,
        // Gestion commandes
        manage_orders: true,
        view_orders: true,
        edit_orders: true,
        cancel_orders: true,
        // Gestion réservations
        manage_reservations: true,
        view_reservations: true,
        edit_reservations: true,
        cancel_reservations: true,
        // Gestion galeries
        manage_galleries: true,
        view_galleries: true,
        create_galleries: true,
        edit_galleries: true,
        delete_galleries: true,
        upload_images: true,
        // Gestion contenu
        manage_content: true,
        view_content: true,
        create_content: true,
        edit_content: true,
        delete_content: true,
        // Gestion annonces
        manage_announcements: true,
        view_announcements: true,
        create_announcements: true,
        edit_announcements: true,
        delete_announcements: true,
        // Messagerie
        manage_internal_messaging: true,
        view_customer_messages: true,
        respond_customer_messages: true,
        send_client_messages: true,
        // Finances
        manage_finances: true,
        view_financial_reports: true,
        create_transactions: true,
        // Paramètres système
        manage_company_settings: true,
        manage_permissions: true,
        view_system_logs: true,
        // Inventaire
        manage_inventory: true,
        view_inventory: true,
        // Calendrier
        manage_calendar: true,
        view_calendar: true,
        // Personnel
        manage_staff: true,
        view_staff: true
      }
    },
    {
      roleName: "manager",
      description: "Manager - Gestion op\xE9rationnelle",
      permissions: {
        // Gestion clients
        manage_clients: true,
        view_clients: true,
        create_clients: true,
        edit_clients: true,
        delete_clients: false,
        // Gestion menu
        manage_menu: true,
        view_menu: true,
        create_menu_items: true,
        edit_menu_items: true,
        delete_menu_items: false,
        // Gestion devis
        manage_quotes: true,
        view_quotes: true,
        create_quotes: true,
        edit_quotes: true,
        delete_quotes: false,
        send_quotes: true,
        // Gestion commandes
        manage_orders: true,
        view_orders: true,
        edit_orders: true,
        cancel_orders: true,
        // Gestion réservations
        manage_reservations: true,
        view_reservations: true,
        edit_reservations: true,
        cancel_reservations: true,
        // Gestion galeries
        manage_galleries: true,
        view_galleries: true,
        create_galleries: false,
        edit_galleries: true,
        delete_galleries: false,
        upload_images: true,
        // Gestion contenu
        manage_content: false,
        view_content: true,
        edit_content: false,
        // Gestion annonces
        manage_announcements: true,
        view_announcements: true,
        create_announcements: true,
        edit_announcements: true,
        delete_announcements: false,
        // Messagerie
        manage_internal_messaging: true,
        view_customer_messages: true,
        respond_customer_messages: true,
        send_client_messages: true,
        // Finances
        view_financial_reports: true,
        create_transactions: true,
        // Inventaire
        manage_inventory: true,
        view_inventory: true,
        // Calendrier
        manage_calendar: true,
        view_calendar: true,
        // Personnel
        view_staff: true
      }
    },
    {
      roleName: "staff",
      description: "Personnel - Op\xE9rations de base",
      permissions: {
        // Gestion clients
        view_clients: true,
        create_clients: true,
        edit_clients: true,
        // Menu
        view_menu: true,
        edit_menu_items: false,
        // Gestion devis
        view_quotes: true,
        create_quotes: true,
        edit_quotes: true,
        send_quotes: false,
        // Gestion commandes
        view_orders: true,
        edit_orders: true,
        // Gestion réservations
        view_reservations: true,
        edit_reservations: true,
        // Galeries
        view_galleries: true,
        upload_images: false,
        // Messagerie
        manage_internal_messaging: true,
        view_customer_messages: true,
        respond_customer_messages: true,
        // Inventaire
        view_inventory: true,
        // Calendrier
        view_calendar: true
      }
    },
    {
      roleName: "client",
      description: "Client - Acc\xE8s limit\xE9",
      permissions: {
        // Commandes personnelles
        view_own_orders: true,
        create_orders: true,
        // Réservations personnelles
        view_own_reservations: true,
        create_reservations: true,
        // Menu public
        view_menu: true,
        // Galeries publiques
        view_galleries: true,
        // Messages
        send_customer_messages: true
      }
    }
  ];
  for (const role of roles) {
    const existingRole = await storage.getRolePermissionByName(role.roleName);
    if (!existingRole) {
      await storage.createRolePermission(role);
      console.log(`\u2705 R\xF4le cr\xE9\xE9: ${role.roleName}`);
    }
  }
}
async function initializeCompanySettings() {
  console.log("\u{1F3E2} Initialisation des param\xE8tres de l'entreprise...");
  const existingSettings = await storage.getCompanySettings();
  if (!existingSettings) {
    await storage.createCompanySettings({
      companyName: "Dounie Cuisine",
      address: "Montr\xE9al, QC, Canada",
      phoneNumber: "+1 (514) 123-4567",
      email: "contact@dounie-cuisine.ca",
      website: "https://dounie-cuisine.ca",
      logoUrl: "/images/logo-dounie.png",
      siret: "12345678901234",
      tvaNumber: "FR12345678901",
      salesPolicy: `## Politique de Vente - Dounie Cuisine

### Conditions G\xE9n\xE9rales
- Toutes nos prestations sont soumises aux pr\xE9sentes conditions g\xE9n\xE9rales de vente
- Les prix sont indiqu\xE9s en CAD, taxes comprises (TPS/TVQ)
- Un acompte de 30% est demand\xE9 \xE0 la confirmation de commande

### Modalit\xE9s de Paiement
- Esp\xE8ces, carte bancaire, virement bancaire accept\xE9s
- Paiement de l'acompte \xE0 la commande
- Solde \xE0 r\xE9gler le jour de la prestation

### D\xE9lais
- Commande minimale de 48h pour les prestations traiteur
- Commande minimale de 7 jours pour les \xE9v\xE9nements importants (+ de 50 personnes)`,
      returnPolicy: `## Politique de Retour - Dounie Cuisine

### Produits Alimentaires
- Aucun retour possible sur les produits alimentaires frais pour des raisons sanitaires
- En cas de probl\xE8me qualit\xE9, nous nous engageons \xE0 remplacer ou rembourser

### Annulation
- Annulation gratuite jusqu'\xE0 24h avant la prestation
- Annulation entre 24h et 12h : 50% de l'acompte retenu
- Annulation moins de 12h avant : acompte non remboursable

### R\xE9clamations
- Toute r\xE9clamation doit \xEAtre formul\xE9e dans les 24h suivant la prestation
- Nous nous engageons \xE0 traiter toute r\xE9clamation dans les 48h`,
      cancellationPolicy: `## Politique d'Annulation - Dounie Cuisine

### D\xE9lais d'Annulation
1. **Plus de 7 jours avant** : Annulation gratuite, remboursement int\xE9gral
2. **Entre 7 et 3 jours avant** : Frais d'annulation de 25%
3. **Entre 3 jours et 24h avant** : Frais d'annulation de 50%
4. **Moins de 24h avant** : Frais d'annulation de 100%

### Cas Exceptionnels
- Force majeure (m\xE9t\xE9o, urgence sanitaire) : remboursement int\xE9gral
- Maladie justifi\xE9e par certificat m\xE9dical : remboursement \xE0 75%

### Proc\xE9dure
- Annulation par t\xE9l\xE9phone ou email
- Confirmation \xE9crite de l'annulation envoy\xE9e par nos soins
- Remboursement sous 5 \xE0 10 jours ouvr\xE9s`,
      termsOfService: `## Conditions G\xE9n\xE9rales d'Utilisation - Dounie Cuisine

### Acceptation des Conditions
En utilisant nos services, vous acceptez les pr\xE9sentes conditions g\xE9n\xE9rales.

### Propri\xE9t\xE9 Intellectuelle
Tous les contenus pr\xE9sents sur notre site sont prot\xE9g\xE9s par le droit d'auteur.

### Protection des Donn\xE9es
Nous nous engageons \xE0 prot\xE9ger vos donn\xE9es personnelles conform\xE9ment au RGPD.

### Responsabilit\xE9
Notre responsabilit\xE9 est limit\xE9e au montant de la prestation command\xE9e.`,
      privacyPolicy: `## Politique de Confidentialit\xE9 - Dounie Cuisine

### Collecte des Donn\xE9es
Nous collectons uniquement les donn\xE9es n\xE9cessaires \xE0 la fourniture de nos services.

### Utilisation des Donn\xE9es
- Traitement des commandes et r\xE9servations
- Communication commerciale (avec votre accord)
- Am\xE9lioration de nos services

### Vos Droits
Vous disposez d'un droit d'acc\xE8s, de rectification et de suppression de vos donn\xE9es.

### Conservation
Vos donn\xE9es sont conserv\xE9es 3 ans apr\xE8s votre derni\xE8re commande.

### Contact
Pour toute question : privacy@dounie-cuisine.ca`,
      bankInfo: {
        bankName: "Banque Nationale du Canada",
        accountName: "Dounie Cuisine Inc.",
        accountNumber: "****1234",
        swiftCode: "BNDCCAMMTOR",
        iban: "CA123456789012345678901234"
      },
      defaultQuoteValidity: 30
    });
    console.log("\u2705 Param\xE8tres d'entreprise initialis\xE9s");
  }
}
async function initializeDefaultUsers() {
  console.log("\u{1F465} Initialisation des utilisateurs par d\xE9faut...");
  const defaultUsers = [
    {
      username: "admin",
      email: "admin@dounie-cuisine.ca",
      password: "Admin123!",
      firstName: "Administrateur",
      lastName: "Syst\xE8me",
      role: "admin"
    },
    {
      username: "manager",
      email: "manager@dounie-cuisine.ca",
      password: "Manager123!",
      firstName: "Lucie",
      lastName: "Manager",
      role: "manager"
    },
    {
      username: "staff",
      email: "staff@dounie-cuisine.ca",
      password: "Staff123!",
      firstName: "Marc",
      lastName: "Staff",
      role: "staff"
    }
  ];
  for (const userData of defaultUsers) {
    const existingUser = await storage.getUserByEmail(userData.email);
    if (!existingUser) {
      const hashedPassword = await bcrypt2.hash(userData.password, 10);
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
        phoneNumber: null,
        loyaltyPoints: 0,
        preferences: {
          language: "fr",
          notifications: true,
          theme: "haitian"
        },
        allergies: []
      });
      if (userData.role !== "client") {
        await storage.createEmployee({
          userId: user.id,
          employeeId: `EMP${String(user.id).padStart(4, "0")}`,
          position: userData.role === "admin" ? "Administrateur" : userData.role === "manager" ? "Manager" : "Staff",
          department: "Administration",
          hireDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          hourlyRate: userData.role === "admin" ? "35.00" : userData.role === "manager" ? "25.00" : "18.00",
          isActive: true,
          certifications: [],
          availability: {},
          permissions: {}
        });
      }
      console.log(`\u2705 Utilisateur cr\xE9\xE9: ${userData.username}`);
    }
  }
}
async function initializeDefaultGalleries() {
  console.log("\u{1F5BC}\uFE0F Initialisation des galeries par d\xE9faut...");
  const galleries2 = [
    {
      name: "Plats Signature",
      description: "Nos cr\xE9ations culinaires embl\xE9matiques",
      isActive: true,
      sortOrder: 1
    },
    {
      name: "\xC9v\xE9nements",
      description: "Photos de nos prestations \xE9v\xE9nementielles",
      isActive: true,
      sortOrder: 2
    },
    {
      name: "Cuisine en Action",
      description: "Nos chefs \xE0 l'\u0153uvre",
      isActive: true,
      sortOrder: 3
    },
    {
      name: "Ambiance Restaurant",
      description: "L'atmosph\xE8re de notre \xE9tablissement",
      isActive: true,
      sortOrder: 4
    }
  ];
  for (const gallery of galleries2) {
    const existingGallery = await storage.getGalleries();
    const found = existingGallery.find((g) => g.name === gallery.name);
    if (!found) {
      await storage.createGallery(gallery);
      console.log(`\u2705 Galerie cr\xE9\xE9e: ${gallery.name}`);
    }
  }
}
async function initializeContentPages() {
  console.log("\u{1F4C4} Initialisation des pages de contenu...");
  const pages = [
    {
      slug: "faq",
      title: "Questions Fr\xE9quemment Pos\xE9es",
      content: `# Questions Fr\xE9quemment Pos\xE9es

## Commandes et Livraisons

### Quel est le d\xE9lai minimum pour commander ?
Nous demandons un d\xE9lai minimum de 48h pour les commandes standard et 7 jours pour les \xE9v\xE9nements importants (plus de 50 personnes).

### Livrez-vous ?
Oui, nous livrons dans un rayon de 25km autour de Montr\xE9al. Des frais de livraison peuvent s'appliquer selon la distance.

### Peut-on personnaliser les menus ?
Absolument ! Nous adaptons nos menus selon vos go\xFBts, allergies et restrictions alimentaires.

## Paiement

### Quels moyens de paiement acceptez-vous ?
Nous acceptons les esp\xE8ces, cartes bancaires, virements bancaires et Interac.

### Quand dois-je payer ?
Un acompte de 30% est demand\xE9 \xE0 la confirmation, le solde \xE9tant d\xFB le jour de la prestation.

## Allergies et R\xE9gimes

### Proposez-vous des options v\xE9g\xE9tariennes/v\xE9ganes ?
Oui, nous avons une large gamme de plats v\xE9g\xE9tariens et v\xE9g\xE9taliens. Consultez notre section d\xE9di\xE9e.

### Comment g\xE9rez-vous les allergies alimentaires ?
Nous prenons les allergies tr\xE8s au s\xE9rieux. Informez-nous lors de votre commande et nous adapterons la pr\xE9paration.

## Annulations

### Puis-je annuler ma commande ?
Oui, selon notre politique d'annulation d\xE9taill\xE9e dans nos conditions g\xE9n\xE9rales.

### Que se passe-t-il en cas de force majeure ?
En cas de force majeure (m\xE9t\xE9o, urgence sanitaire), nous remboursons int\xE9gralement.`,
      metaDescription: "Trouvez les r\xE9ponses \xE0 vos questions sur nos services traiteur, livraisons, paiements et plus encore.",
      isActive: true,
      showInNavigation: true,
      sortOrder: 1
    },
    {
      slug: "about",
      title: "\xC0 Propos de Dounie Cuisine",
      content: `# \xC0 Propos de Dounie Cuisine

## Notre Histoire

Dounie Cuisine est n\xE9e de la passion de cr\xE9er des exp\xE9riences culinaires m\xE9morables qui c\xE9l\xE8brent les saveurs authentiques des Cara\xEFbes, avec une touche moderne et raffin\xE9e.

## Notre Mission

Nous nous engageons \xE0 :
- Offrir une cuisine authentique et de qualit\xE9 sup\xE9rieure
- Utiliser des ingr\xE9dients frais et locaux quand possible
- Cr\xE9er des moments de partage et de convivialit\xE9
- Respecter les traditions culinaires carib\xE9ennes

## Notre \xC9quipe

Notre \xE9quipe de chefs passionn\xE9s combine expertise traditionnelle et innovation culinaire pour vous offrir des plats exceptionnels.

## Nos Valeurs

- **Qualit\xE9** : Nous ne transigeons jamais sur la qualit\xE9 de nos ingr\xE9dients et pr\xE9parations
- **Authenticit\xE9** : Respect des recettes traditionnelles
- **Innovation** : Adaptation aux go\xFBts contemporains
- **Service** : Excellence dans l'accueil et le service client

## Certifications

- Certification MAPAQ
- Certification sanitaire AAA
- Formation continue de l'\xE9quipe aux normes d'hygi\xE8ne`,
      metaDescription: "D\xE9couvrez l'histoire, la mission et les valeurs de Dounie Cuisine, votre sp\xE9cialiste de la cuisine carib\xE9enne.",
      isActive: true,
      showInNavigation: true,
      sortOrder: 2
    },
    {
      slug: "contact",
      title: "Nous Contacter",
      content: `# Nous Contacter

## Coordonn\xE9es

**Adresse :** Montr\xE9al, QC, Canada
**T\xE9l\xE9phone :** +1 (514) 123-4567
**Email :** contact@dounie-cuisine.ca

## Horaires d'Ouverture

**Lundi - Vendredi :** 9h00 - 19h00
**Samedi :** 10h00 - 18h00
**Dimanche :** 11h00 - 17h00

## Zone de Livraison

Nous livrons dans un rayon de 25km autour de Montr\xE9al :
- Montr\xE9al et arrondissements
- Laval
- Longueuil
- Brossard
- Saint-Lambert

## Nous Suivre

Restez connect\xE9s pour nos derni\xE8res cr\xE9ations et offres sp\xE9ciales !

**Facebook :** @douinecuisine
**Instagram :** @dounie_cuisine
**Twitter :** @douinecuisine`,
      metaDescription: "Contactez Dounie Cuisine pour vos commandes et renseignements. Coordonn\xE9es, horaires et zone de livraison.",
      isActive: true,
      showInNavigation: true,
      sortOrder: 3
    }
  ];
  const adminUser = await storage.getUserByEmail("admin@dounie-cuisine.ca");
  const adminId = adminUser?.id || 1;
  for (const page of pages) {
    const existingPage = await storage.getContentPageBySlug(page.slug);
    if (!existingPage) {
      await storage.createContentPage({
        ...page,
        lastEditedBy: adminId
      });
      console.log(`\u2705 Page cr\xE9\xE9e: ${page.title}`);
    }
  }
}
async function initializeMenuData() {
  console.log("\u{1F37D}\uFE0F Initialisation des donn\xE9es du menu...");
  const menuCategories = {
    "plats-principaux": [
      {
        name: "Griot Traditionnel",
        nameEn: "Traditional Griot",
        description: "Porc marin\xE9 et frit, accompagn\xE9 de riz coll\xE9 aux pois rouges et de bananes plantains frites",
        descriptionEn: "Marinated and fried pork, served with rice and red beans and fried plantains",
        price: "18.50",
        imageUrl: "/images/menu/griot-traditionnel.jpg",
        preparationTime: 25,
        calories: 680,
        allergies: [],
        ingredients: ["porc", "riz", "pois rouges", "bananes plantains", "\xE9pices cr\xE9oles"]
      },
      {
        name: "Poisson Gros Sel",
        nameEn: "Salt Fish",
        description: "Morue dessal\xE9e saut\xE9e aux l\xE9gumes cr\xE9oles, riz blanc et sauce ti-malice",
        descriptionEn: "Desalted cod saut\xE9ed with Creole vegetables, white rice and ti-malice sauce",
        price: "16.75",
        imageUrl: "/images/menu/poisson-gros-sel.jpg",
        preparationTime: 20,
        calories: 520,
        allergies: ["poisson"],
        ingredients: ["morue", "l\xE9gumes cr\xE9oles", "riz", "sauce ti-malice"]
      },
      {
        name: "Poulet Boucann\xE9",
        nameEn: "Smoked Chicken",
        description: "Poulet marin\xE9 aux \xE9pices et grill\xE9 au feu de bois, accompagn\xE9 de l\xE9gumes racines",
        descriptionEn: "Chicken marinated with spices and grilled over wood fire, served with root vegetables",
        price: "17.25",
        imageUrl: "/images/menu/poulet-boucanne.jpg",
        preparationTime: 30,
        calories: 590,
        allergies: [],
        ingredients: ["poulet", "\xE9pices cr\xE9oles", "l\xE9gumes racines", "marinade"]
      }
    ],
    "entrees": [
      {
        name: "Accras de Morue",
        nameEn: "Cod Fritters",
        description: "Beignets de morue \xE9pic\xE9s, croustillants \xE0 l'ext\xE9rieur et moelleux \xE0 l'int\xE9rieur",
        descriptionEn: "Spiced cod fritters, crispy outside and tender inside",
        price: "8.50",
        imageUrl: "/images/menu/accras-morue.jpg",
        preparationTime: 15,
        calories: 280,
        allergies: ["poisson", "gluten"],
        ingredients: ["morue", "farine", "\xE9pices", "huile"]
      },
      {
        name: "Boudin Cr\xE9ole",
        nameEn: "Creole Blood Sausage",
        description: "Boudin noir aux \xE9pices antillaises, accompagn\xE9 de sauce piment",
        descriptionEn: "Black pudding with West Indian spices, served with hot sauce",
        price: "9.25",
        imageUrl: "/images/menu/boudin-creole.jpg",
        preparationTime: 12,
        calories: 320,
        allergies: [],
        ingredients: ["sang de porc", "\xE9pices cr\xE9oles", "oignons", "piment"]
      }
    ],
    "desserts": [
      {
        name: "Blanc-Manger Coco",
        nameEn: "Coconut Blancmange",
        description: "Dessert cr\xE9meux \xE0 la noix de coco, parfum\xE9 \xE0 la vanille et cannelle",
        descriptionEn: "Creamy coconut dessert, flavored with vanilla and cinnamon",
        price: "6.50",
        imageUrl: "/images/menu/blanc-manger-coco.jpg",
        preparationTime: 10,
        calories: 220,
        allergies: ["lait"],
        ingredients: ["lait de coco", "vanille", "cannelle", "sucre"]
      },
      {
        name: "Tarte \xE0 la Patate Douce",
        nameEn: "Sweet Potato Pie",
        description: "Tarte cr\xE9meuse \xE0 la patate douce \xE9pic\xE9e, p\xE2te sabl\xE9e maison",
        descriptionEn: "Creamy spiced sweet potato pie with homemade shortbread crust",
        price: "7.75",
        imageUrl: "/images/menu/tarte-patate-douce.jpg",
        preparationTime: 15,
        calories: 310,
        allergies: ["gluten", "\u0153ufs", "lait"],
        ingredients: ["patate douce", "\xE9pices", "p\xE2te sabl\xE9e", "\u0153ufs", "cr\xE8me"]
      }
    ],
    "boissons": [
      {
        name: "Jus de Fruit de la Passion",
        nameEn: "Passion Fruit Juice",
        description: "Jus naturel de fruit de la passion, rafra\xEEchissant et vitamin\xE9",
        descriptionEn: "Natural passion fruit juice, refreshing and vitamin-rich",
        price: "4.50",
        imageUrl: "/images/menu/jus-passion.jpg",
        preparationTime: 5,
        calories: 95,
        allergies: [],
        ingredients: ["fruit de la passion", "eau", "sucre de canne"]
      },
      {
        name: "Punch Planteur",
        nameEn: "Planter's Punch",
        description: "Cocktail traditionnel au rhum, jus de fruits tropicaux (sans alcool disponible)",
        descriptionEn: "Traditional rum cocktail with tropical fruit juices (non-alcoholic available)",
        price: "8.25",
        imageUrl: "/images/menu/punch-planteur.jpg",
        preparationTime: 5,
        calories: 180,
        allergies: [],
        ingredients: ["rhum", "jus d'ananas", "jus d'orange", "grenadine", "muscade"]
      }
    ]
  };
  for (const [category, items] of Object.entries(menuCategories)) {
    for (const item of items) {
      const existingItems = await storage.getMenuItems();
      const found = existingItems.find((existing) => existing.name === item.name);
      if (!found) {
        await storage.createMenuItem({
          ...item,
          category,
          isAvailable: true,
          isFestive: false,
          festiveTheme: null
        });
        console.log(`\u2705 Plat ajout\xE9: ${item.name}`);
      }
    }
  }
}
async function initializeFestiveThemes() {
  console.log("\u{1F3AD} Initialisation des th\xE8mes festifs...");
  const themes = [
    {
      name: "Ha\xEFtien Classique",
      nameEn: "Classic Haitian",
      description: "Th\xE8me traditionnel aux couleurs du drapeau ha\xEFtien",
      isActive: true,
      isAutomatic: false,
      colors: {
        primary: "#0072CE",
        secondary: "#CE1126",
        accent: "#FFD100",
        background: "#F8F9FA"
      },
      animations: {},
      icons: {
        flag: "\u{1F1ED}\u{1F1F9}",
        food: "\u{1F37D}\uFE0F",
        celebration: "\u{1F389}"
      },
      priority: 1,
      recurringYearly: false
    },
    {
      name: "Carnaval",
      nameEn: "Carnival",
      description: "Th\xE8me festif pour la p\xE9riode du carnaval",
      isActive: false,
      isAutomatic: true,
      startDate: "2025-02-01",
      endDate: "2025-03-15",
      colors: {
        primary: "#FF6B35",
        secondary: "#F7931E",
        accent: "#FFD23F",
        background: "#FFF8E1"
      },
      animations: {
        confetti: true,
        bounce: true
      },
      icons: {
        mask: "\u{1F3AD}",
        music: "\u{1F3B5}",
        dance: "\u{1F483}"
      },
      priority: 2,
      recurringYearly: true
    },
    {
      name: "F\xEAte des M\xE8res",
      nameEn: "Mother's Day",
      description: "Th\xE8me sp\xE9cial pour la f\xEAte des m\xE8res",
      isActive: false,
      isAutomatic: true,
      startDate: "2025-05-01",
      endDate: "2025-05-31",
      colors: {
        primary: "#E91E63",
        secondary: "#F8BBD9",
        accent: "#FF4081",
        background: "#FCE4EC"
      },
      animations: {
        hearts: true,
        sparkle: true
      },
      icons: {
        heart: "\u{1F49D}",
        flower: "\u{1F338}",
        love: "\u{1F496}"
      },
      priority: 3,
      recurringYearly: true
    }
  ];
  for (const theme of themes) {
    const existingThemes = await storage.getFestiveThemes();
    const found = existingThemes.find((t) => t.name === theme.name);
    if (!found) {
      await storage.createFestiveTheme(theme);
      console.log(`\u2705 Th\xE8me cr\xE9\xE9: ${theme.name}`);
    }
  }
}
async function initializeDefaultAnnouncements() {
  console.log("\u{1F4E2} Initialisation des annonces par d\xE9faut...");
  const adminUser = await storage.getUserByEmail("admin@dounie-cuisine.ca");
  const adminId = adminUser?.id || 1;
  const announcements2 = [
    {
      title: "Bienvenue chez Dounie Cuisine!",
      content: "D\xE9couvrez nos sp\xE9cialit\xE9s carib\xE9ennes authentiques et nos services traiteur pour tous vos \xE9v\xE9nements.",
      type: "info",
      priority: "normal",
      position: "banner",
      targetAudience: "all",
      isActive: true,
      startDate: /* @__PURE__ */ new Date(),
      endDate: null,
      imageUrl: null,
      actionUrl: "/menu",
      actionText: "Voir notre menu",
      viewCount: 0,
      displayRules: {
        showOnHomepage: true,
        showToNewVisitors: true
      },
      createdBy: adminId
    },
    {
      title: "Nouveau: Service de Devis en Ligne",
      content: "Demandez facilement un devis personnalis\xE9 pour vos \xE9v\xE9nements directement depuis notre interface.",
      type: "success",
      priority: "high",
      position: "modal",
      targetAudience: "customers",
      isActive: true,
      startDate: /* @__PURE__ */ new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3),
      // 30 jours
      imageUrl: null,
      actionUrl: "/contact",
      actionText: "Demander un devis",
      viewCount: 0,
      displayRules: {
        showOnce: true,
        requiresLogin: false
      },
      createdBy: adminId
    }
  ];
  for (const announcement of announcements2) {
    const existingAnnouncements = await storage.getAnnouncements();
    const found = existingAnnouncements.find((a) => a.title === announcement.title);
    if (!found) {
      await storage.createAnnouncement(announcement);
      console.log(`\u2705 Annonce cr\xE9\xE9e: ${announcement.title}`);
    }
  }
}

// index.ts
import dotenv2 from "dotenv";
dotenv2.config();
var app = express();
app.use(session({
  secret: process.env.SESSION_SECRET || "dounie-cuisine-session-secret-key-2024",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1e3
    // 24 hours
  }
}));
app.use(cors({
  origin: [
    "http://localhost:5173",
    // Administration
    "http://localhost:5174",
    // Site public
    "http://localhost:3000",
    // Alternative port
    "http://localhost:3001"
    // Alternative port
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      console.log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  try {
    await initializeData();
  } catch (error) {
    console.error("Erreur lors de l'initialisation:", error);
  }
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  const port = process.env.PORT || 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    console.log(`API serving on port ${port}`);
  });
})();

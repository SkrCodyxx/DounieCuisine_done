import { pgTable, text, serial, integer, boolean, timestamp, decimal, json, date, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role").notNull().default("client"), // admin, manager, staff, client
  isEmployeeClient: boolean("is_employee_client").default(false),
  phoneNumber: text("phone_number"),
  loyaltyPoints: integer("loyalty_points").default(0),
  preferences: json("preferences").default("{}"),
  allergies: text("allergies").array().default([]),
  address: text("address"),
  company: text("company"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Configuration des permissions par rôle
export const rolePermissions = pgTable("role_permissions", {
  id: serial("id").primaryKey(),
  roleName: text("role_name").notNull().unique(),
  permissions: json("permissions").notNull(), // Object avec toutes les permissions
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Clients externes (non-utilisateurs)
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number"),
  address: text("address"),
  company: text("company"),
  notes: text("notes"),
  source: text("source").default("website"), // website, phone, referral, etc.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Configuration entreprise
export const companySettings = pgTable("company_settings", {
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
  bankInfo: json("bank_info"), // Infos bancaires pour factures
  defaultQuoteValidity: integer("default_quote_validity").default(30), // jours
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Système de devis
export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  quoteNumber: text("quote_number").notNull().unique(),
  clientId: integer("client_id").references(() => clients.id),
  userId: integer("user_id").references(() => users.id), // Si client connecté
  status: text("status").notNull().default("draft"), // draft, sent, accepted, rejected, expired
  validityDate: date("validity_date").notNull(),
  eventDate: date("event_date"),
  eventLocation: text("event_location"),
  guestCount: integer("guest_count"),
  budget: decimal("budget", { precision: 10, scale: 2 }),
  items: json("items").notNull(), // Détail des lignes du devis
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
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const menuItems = pgTable("menu_items", {
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
  preparationTime: integer("preparation_time"), // minutes
  calories: integer("calories"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Gestion des galeries photos
export const galleries = pgTable("galleries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const galleryImages = pgTable("gallery_images", {
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
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Pages de contenu dynamiques
export const contentPages = pgTable("content_pages", {
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
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Messages clients (formulaire de contact)
export const customerMessages = pgTable("customer_messages", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  isReplied: boolean("is_replied").default(false),
  priority: text("priority").default("normal"), // low, normal, high, urgent
  tags: text("tags").array().default([]),
  internalNotes: text("internal_notes"),
  assignedTo: integer("assigned_to").references(() => users.id),
  repliedAt: timestamp("replied_at"),
  repliedBy: integer("replied_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Messagerie interne entre employés
export const internalMessages = pgTable("internal_messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  recipientId: integer("recipient_id").references(() => users.id).notNull(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  isImportant: boolean("is_important").default(false),
  attachments: text("attachments").array().default([]),
  threadId: integer("thread_id"), // Pour grouper les réponses
  replyToId: integer("reply_to_id").references(() => internalMessages.id),
  deletedBySender: boolean("deleted_by_sender").default(false),
  deletedByRecipient: boolean("deleted_by_recipient").default(false),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Messagerie entreprise vers clients
export const clientMessages = pgTable("client_messages", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => clients.id),
  userId: integer("user_id").references(() => users.id), // Si client connecté
  senderId: integer("sender_id").references(() => users.id).notNull(), // Employé qui envoie
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  messageType: text("message_type").notNull(), // alert, reminder, notification, promotion, response
  priority: text("priority").default("normal"),
  isRead: boolean("is_read").default(false),
  relatedQuoteId: integer("related_quote_id").references(() => quotes.id),
  relatedOrderId: integer("related_order_id").references(() => orders.id),
  sentVia: text("sent_via").default("internal"), // internal, email, sms
  scheduledFor: timestamp("scheduled_for"),
  sentAt: timestamp("sent_at"),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  clientId: integer("client_id").references(() => clients.id),
  quoteId: integer("quote_id").references(() => quotes.id), // Si commande depuis devis
  status: text("status").notNull().default("pending"), // pending, confirmed, preparing, ready, delivered, cancelled
  items: json("items").notNull(), // {menuItemId, quantity, price, customizations}[]
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  gstAmount: decimal("gst_amount", { precision: 10, scale: 2 }).notNull(),
  qstAmount: decimal("qst_amount", { precision: 10, scale: 2 }).notNull(),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).default("0"),
  loyaltyPointsUsed: integer("loyalty_points_used").default(0),
  loyaltyPointsEarned: integer("loyalty_points_earned").default(0),
  paymentMethod: text("payment_method"),
  paymentStatus: text("payment_status").default("pending"),
  orderType: text("order_type").notNull(), // dine-in, takeout, delivery, event
  specialRequests: text("special_requests"),
  estimatedReadyTime: timestamp("estimated_ready_time"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  guestName: text("guest_name").notNull(),
  guestEmail: text("guest_email").notNull(),
  guestPhone: text("guest_phone").notNull(),
  partySize: integer("party_size").notNull(),
  dateTime: timestamp("date_time").notNull(),
  tableNumber: integer("table_number"),
  status: text("status").notNull().default("pending"), // pending, confirmed, seated, completed, cancelled, no-show
  specialRequests: text("special_requests"),
  occasion: text("occasion"), // birthday, anniversary, business, festive
  dietaryRestrictions: text("dietary_restrictions").array().default([]),
  confirmationCode: text("confirmation_code").notNull(),
  reminderSent: boolean("reminder_sent").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  employeeId: text("employee_id").notNull().unique(),
  position: text("position").notNull(),
  department: text("department").notNull(),
  hireDate: date("hire_date").notNull(),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
  socialInsuranceNumber: text("social_insurance_number"),
  bankAccountInfo: json("bank_account_info"), // encrypted
  emergencyContact: json("emergency_contact"),
  certifications: text("certifications").array().default([]),
  availability: json("availability").default("{}"),
  permissions: json("permissions").default("{}"), // Permissions spécifiques à l'employé
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const calendarEvents = pgTable("calendar_events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  eventType: text("event_type").notNull(), // shift, payroll, meeting, training, special_event, reservation
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  allDay: boolean("all_day").default(false),
  location: text("location"),
  attendees: integer("attendees").array().default([]), // user IDs
  priority: text("priority").default("normal"), // low, normal, high, urgent
  status: text("status").default("scheduled"), // scheduled, confirmed, cancelled, completed
  recurrence: json("recurrence"), // for recurring events
  reminders: json("reminders"),
  attachments: text("attachments").array().default([]),
  contacts: json("contacts"),
  isPublic: boolean("is_public").default(false),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  currentStock: integer("current_stock").notNull(),
  minimumStock: integer("minimum_stock").notNull(),
  unit: text("unit").notNull(), // kg, lbs, pieces, bottles, etc.
  costPerUnit: decimal("cost_per_unit", { precision: 10, scale: 2 }).notNull(),
  supplier: text("supplier"),
  lastOrderDate: date("last_order_date"),
  expirationDate: date("expiration_date"),
  location: text("location"),
  isCritical: boolean("is_critical").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const financialTransactions = pgTable("financial_transactions", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // income, expense, tax, payroll
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
  createdAt: timestamp("created_at").defaultNow(),
});

export const loyaltyRewards = pgTable("loyalty_rewards", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  pointsCost: integer("points_cost").notNull(),
  rewardType: text("reward_type").notNull(), // discount, free_item, special_access
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
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const festiveThemes = pgTable("festive_themes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameEn: text("name_en").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(false),
  isAutomatic: boolean("is_automatic").default(true),
  startDate: date("start_date"),
  endDate: date("end_date"),
  colors: json("colors").notNull(), // primary, secondary, accent colors
  animations: json("animations"), // snowfall, hearts, etc.
  icons: json("icons"), // theme-specific icons
  customCss: text("custom_css"),
  priority: integer("priority").default(0),
  recurringYearly: boolean("recurring_yearly").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(), // info, warning, success, promotion
  priority: text("priority").default("normal"), // low, normal, high, urgent
  position: text("position").notNull(), // banner, sidebar, modal, footer
  targetAudience: text("target_audience").notNull(), // all, customers, employees, vip
  isActive: boolean("is_active").default(true),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  imageUrl: text("image_url"),
  actionUrl: text("action_url"),
  actionText: text("action_text"),
  viewCount: integer("view_count").default(0),
  displayRules: json("display_rules"), // Règles d'affichage avancées
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRolePermissionSchema = createInsertSchema(rolePermissions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCompanySettingsSchema = createInsertSchema(companySettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertQuoteSchema = createInsertSchema(quotes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGallerySchema = createInsertSchema(galleries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGalleryImageSchema = createInsertSchema(galleryImages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContentPageSchema = createInsertSchema(contentPages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCustomerMessageSchema = createInsertSchema(customerMessages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInternalMessageSchema = createInsertSchema(internalMessages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertClientMessageSchema = createInsertSchema(clientMessages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReservationSchema = createInsertSchema(reservations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmployeeSchema = createInsertSchema(employees).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCalendarEventSchema = createInsertSchema(calendarEvents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInventorySchema = createInsertSchema(inventory).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFinancialTransactionSchema = createInsertSchema(financialTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertLoyaltyRewardSchema = createInsertSchema(loyaltyRewards).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFestiveThemeSchema = createInsertSchema(festiveThemes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type RolePermission = typeof rolePermissions.$inferSelect;
export type InsertRolePermission = z.infer<typeof insertRolePermissionSchema>;

export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;

export type CompanySettings = typeof companySettings.$inferSelect;
export type InsertCompanySettings = z.infer<typeof insertCompanySettingsSchema>;

export type Quote = typeof quotes.$inferSelect;
export type InsertQuote = z.infer<typeof insertQuoteSchema>;

export type Gallery = typeof galleries.$inferSelect;
export type InsertGallery = z.infer<typeof insertGallerySchema>;

export type GalleryImage = typeof galleryImages.$inferSelect;
export type InsertGalleryImage = z.infer<typeof insertGalleryImageSchema>;

export type ContentPage = typeof contentPages.$inferSelect;
export type InsertContentPage = z.infer<typeof insertContentPageSchema>;

export type CustomerMessage = typeof customerMessages.$inferSelect;
export type InsertCustomerMessage = z.infer<typeof insertCustomerMessageSchema>;

export type InternalMessage = typeof internalMessages.$inferSelect;
export type InsertInternalMessage = z.infer<typeof insertInternalMessageSchema>;

export type ClientMessage = typeof clientMessages.$inferSelect;
export type InsertClientMessage = z.infer<typeof insertClientMessageSchema>;

export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type Reservation = typeof reservations.$inferSelect;
export type InsertReservation = z.infer<typeof insertReservationSchema>;

export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;

export type CalendarEvent = typeof calendarEvents.$inferSelect;
export type InsertCalendarEvent = z.infer<typeof insertCalendarEventSchema>;

export type InventoryItem = typeof inventory.$inferSelect;
export type InsertInventoryItem = z.infer<typeof insertInventorySchema>;

export type FinancialTransaction = typeof financialTransactions.$inferSelect;
export type InsertFinancialTransaction = z.infer<typeof insertFinancialTransactionSchema>;

export type LoyaltyReward = typeof loyaltyRewards.$inferSelect;
export type InsertLoyaltyReward = z.infer<typeof insertLoyaltyRewardSchema>;

export type FestiveTheme = typeof festiveThemes.$inferSelect;
export type InsertFestiveTheme = z.infer<typeof insertFestiveThemeSchema>;

export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
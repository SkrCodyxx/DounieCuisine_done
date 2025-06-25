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
  employees: () => employees,
  festiveThemes: () => festiveThemes,
  financialTransactions: () => financialTransactions,
  insertAnnouncementSchema: () => insertAnnouncementSchema,
  insertCalendarEventSchema: () => insertCalendarEventSchema,
  insertEmployeeSchema: () => insertEmployeeSchema,
  insertFestiveThemeSchema: () => insertFestiveThemeSchema,
  insertFinancialTransactionSchema: () => insertFinancialTransactionSchema,
  insertInventorySchema: () => insertInventorySchema,
  insertLoyaltyRewardSchema: () => insertLoyaltyRewardSchema,
  insertMenuItemSchema: () => insertMenuItemSchema,
  insertOrderSchema: () => insertOrderSchema,
  insertReservationSchema: () => insertReservationSchema,
  insertUserSchema: () => insertUserSchema,
  inventory: () => inventory,
  loyaltyRewards: () => loyaltyRewards,
  menuItems: () => menuItems,
  orders: () => orders,
  reservations: () => reservations,
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
var orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
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
  // dine-in, takeout, delivery
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
  targetAudience: text("target_audience").notNull(),
  // all, customers, employees, vip
  isActive: boolean("is_active").default(true),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  imageUrl: text("image_url"),
  actionUrl: text("action_url"),
  actionText: text("action_text"),
  viewCount: integer("view_count").default(0),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).omit({
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
import { eq, and, gte, lte } from "drizzle-orm";
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
      const { username, email, password, firstName, lastName, phoneNumber, role } = req.body;
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
        preferences: {
          language: "fr",
          notifications: true,
          theme: "haitian"
        },
        allergies: []
      });
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
  app2.post("/api/users", async (req, res) => {
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
  app2.get("/api/menu", async (req, res) => {
    try {
      const items = await storage.getMenuItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.post("/api/menu", requireAuth, async (req, res) => {
    try {
      const itemData = insertMenuItemSchema.parse(req.body);
      const item = await storage.createMenuItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ message: "Donn\xE9es invalides" });
    }
  });
  app2.put("/api/menu/:id", requireAuth, async (req, res) => {
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
  app2.delete("/api/menu/:id", requireAuth, async (req, res) => {
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
  app2.get("/api/announcements", async (req, res) => {
    try {
      const announcements2 = await storage.getActiveAnnouncements();
      res.json(announcements2);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  app2.post("/api/announcements", requireAuth, async (req, res) => {
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
      res.json({
        todayRevenue,
        activeOrders,
        tomorrowReservations: tomorrowReservations.length,
        totalLoyaltyPoints
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
  try {
    const existingThemes = await storage.getFestiveThemes();
    if (existingThemes.length > 0) {
      console.log("\u2713 Donn\xE9es d\xE9j\xE0 initialis\xE9es");
      return;
    }
    const haitianTheme = await storage.createFestiveTheme({
      name: "Ha\xEFti",
      nameEn: "Haiti",
      description: "Th\xE8me authentique ha\xEFtien avec couleurs du drapeau et culture traditionnelle",
      isActive: true,
      priority: 1,
      colors: {
        primary: "hsl(0, 84%, 55%)",
        // Rouge haïtien du drapeau
        secondary: "hsl(220, 100%, 50%)",
        // Bleu haïtien du drapeau
        accent: "hsl(45, 95%, 50%)",
        // Jaune/or des armoiries
        background: "hsl(50, 100%, 98%)",
        // Blanc pur
        surface: "hsl(0, 0%, 97%)",
        // Gris très clair
        text: "hsl(220, 25%, 15%)",
        // Bleu foncé
        muted: "hsl(220, 15%, 75%)"
        // Gris doux
      },
      animations: {
        kompaRhythm: true,
        flagWave: true,
        drumbeat: true
      },
      styles: {
        backgroundImage: "linear-gradient(135deg, hsl(0, 84%, 55%) 0%, hsl(220, 100%, 50%) 100%)",
        borderRadius: "12px",
        shadows: "0 4px 20px rgba(210, 16, 52, 0.2)"
      },
      customCSS: `
        .haitian-theme {
          --primary: 0 84% 55%;
          --secondary: 220 100% 50%;
          --accent: 45 95% 50%;
          --background: 50 100% 98%;
          --surface: 0 0% 97%;
          --text: 220 25% 15%;
          --muted: 220 15% 75%;
        }
        
        .haiti-gradient {
          background: linear-gradient(135deg, hsl(0, 84%, 55%) 0%, hsl(220, 100%, 50%) 100%);
        }
        
        .haitian-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 2px solid transparent;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(210, 16, 52, 0.1);
        }
      `,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      recurringYearly: true
    });
    const hashedPassword = await bcrypt2.hash("admin123", 10);
    const adminUser = await storage.createUser({
      username: "admin",
      email: "admin@dounie-cuisine.com",
      password: hashedPassword,
      firstName: "Administrateur",
      lastName: "Principal",
      role: "admin",
      phoneNumber: "+1-514-555-0001",
      loyaltyPoints: 0,
      preferences: {
        language: "fr",
        notifications: true,
        theme: "haitian"
      },
      allergies: []
    });
    const menuItems2 = [
      {
        name: "Diri ak Djon Djon",
        nameEn: "Black Mushroom Rice",
        description: "Riz parfum\xE9 aux champignons noirs ha\xEFtiens, accompagn\xE9 de l\xE9gumes cr\xE9oles et viande de choix",
        descriptionEn: "Fragrant rice with Haitian black mushrooms, served with Creole vegetables and choice meat",
        category: "Plats Principaux",
        price: "24.95",
        isAvailable: true,
        isFestive: true,
        festiveTheme: "Ha\xEFti",
        allergies: [],
        ingredients: ["riz", "champignons djon djon", "\xE9pices cr\xE9oles", "l\xE9gumes"],
        preparationTime: 35,
        calories: 450
      },
      {
        name: "Poisson Grill\xE9 aux \xC9pices",
        nameEn: "Spiced Grilled Fish",
        description: "Poisson frais grill\xE9 aux \xE9pices carib\xE9ennes, sauce ti-malice",
        descriptionEn: "Fresh grilled fish with Caribbean spices and ti-malice sauce",
        category: "Fruits de Mer",
        price: "28.50",
        isAvailable: true,
        isFestive: true,
        festiveTheme: "Cara\xEFbes",
        allergies: ["poisson"],
        ingredients: ["poisson frais", "\xE9pices carib\xE9ennes", "lime", "piments"],
        preparationTime: 25,
        calories: 380
      },
      {
        name: "Plantain Frit",
        nameEn: "Fried Plantain",
        description: "Banane plantain frite dor\xE9e, accompagn\xE9e de sauce \xE9pic\xE9e",
        descriptionEn: "Golden fried plantain served with spicy sauce",
        category: "Accompagnements",
        price: "8.95",
        isAvailable: true,
        isFestive: true,
        festiveTheme: "Cara\xEFbes",
        allergies: [],
        ingredients: ["banane plantain", "huile", "\xE9pices"],
        preparationTime: 10,
        calories: 180
      },
      {
        name: "Accras de Morue",
        nameEn: "Cod Fritters",
        description: "Beignets de morue \xE9pic\xE9s, frits \xE0 la perfection",
        descriptionEn: "Spiced cod fritters, fried to perfection",
        category: "Entr\xE9es",
        price: "12.95",
        isAvailable: true,
        isFestive: true,
        festiveTheme: "Cara\xEFbes",
        allergies: ["poisson", "gluten"],
        ingredients: ["morue", "farine", "\xE9pices", "piments"],
        preparationTime: 15,
        calories: 220
      },
      {
        name: "Punch au Rhum",
        nameEn: "Rum Punch",
        description: "Cocktail traditionnel des Cara\xEFbes au rhum blanc et fruits tropicaux",
        descriptionEn: "Traditional Caribbean cocktail with white rum and tropical fruits",
        category: "Boissons",
        price: "14.50",
        isAvailable: true,
        isFestive: true,
        festiveTheme: "Cara\xEFbes",
        allergies: [],
        ingredients: ["rhum blanc", "jus d'ananas", "jus de passion", "lime"],
        preparationTime: 5,
        calories: 180
      }
    ];
    for (const item of menuItems2) {
      await storage.createMenuItem(item);
    }
    const now = /* @__PURE__ */ new Date();
    const events = [
      {
        title: "Festival Carib\xE9en",
        description: "Soir\xE9e sp\xE9ciale avec musique live et plats traditionnels",
        eventType: "special_event",
        startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 19, 0),
        endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 23, 0),
        allDay: false,
        location: "Salle principale",
        priority: "high",
        status: "scheduled",
        isPublic: true,
        createdBy: adminUser.id
      },
      {
        title: "Formation Personnel",
        description: "Formation sur les nouveaux plats carib\xE9ens",
        eventType: "training",
        startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 14, 0),
        endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 17, 0),
        allDay: false,
        location: "Cuisine",
        priority: "normal",
        status: "scheduled",
        isPublic: false,
        createdBy: adminUser.id
      }
    ];
    for (const event of events) {
      await storage.createCalendarEvent(event);
    }
    const inventoryItems = [
      {
        name: "Champignons Djon Djon",
        category: "\xC9pices",
        currentStock: 50,
        minimumStock: 10,
        unit: "grammes",
        costPerUnit: "0.85",
        supplier: "\xC9picerie Tropicale Ha\xEFtienne",
        location: "Garde-manger"
      },
      {
        name: "Poisson Frais",
        category: "Prot\xE9ines",
        currentStock: 25,
        minimumStock: 5,
        unit: "kilogrammes",
        costPerUnit: "18.50",
        supplier: "Poissonnerie Atlantique",
        location: "R\xE9frig\xE9rateur"
      },
      {
        name: "Bananes Plantain",
        category: "L\xE9gumes",
        currentStock: 100,
        minimumStock: 20,
        unit: "unit\xE9s",
        costPerUnit: "0.75",
        supplier: "March\xE9 Tropical",
        location: "Garde-manger"
      }
    ];
    for (const item of inventoryItems) {
      await storage.createInventoryItem(item);
    }
    await storage.createLoyaltyReward({
      name: "Repas Ha\xEFtien Gratuit",
      description: "Un plat principal ha\xEFtien traditionnel offert",
      pointsCost: 500,
      rewardType: "free_item",
      value: "25.00",
      isActive: true,
      isFestive: true,
      festiveTheme: "Ha\xEFti",
      maxRedemptions: 100,
      validFrom: (/* @__PURE__ */ new Date()).toISOString(),
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1e3).toISOString(),
      conditions: {
        minimumOrderValue: 50,
        applicableCategories: ["Plats Principaux"]
      }
    });
    await storage.createAnnouncement({
      title: "Bienvenue chez Dounie Cuisine!",
      content: "D\xE9couvrez l'authenticit\xE9 de la cuisine ha\xEFtienne dans notre restaurant. Go\xFBtez nos sp\xE9cialit\xE9s traditionnelles pr\xE9par\xE9es avec amour selon les recettes ancestrales!",
      type: "promotion",
      targetAudience: "public",
      isActive: true,
      priority: "high",
      createdBy: adminUser.id,
      validFrom: (/* @__PURE__ */ new Date()).toISOString(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3).toISOString()
    });
    const clientNames = [
      { firstName: "Marie", lastName: "Delorme", username: "marie.delorme", email: "marie.delorme@email.com" },
      { firstName: "Jean", lastName: "Baptiste", username: "jean.baptiste", email: "jean.baptiste@email.com" },
      { firstName: "Rose", lastName: "Charlot", username: "rose.charlot", email: "rose.charlot@email.com" },
      { firstName: "Pierre", lastName: "Moreau", username: "pierre.moreau", email: "pierre.moreau@email.com" },
      { firstName: "Sophie", lastName: "Dubois", username: "sophie.dubois", email: "sophie.dubois@email.com" },
      { firstName: "Andr\xE9", lastName: "Lafleur", username: "andre.lafleur", email: "andre.lafleur@email.com" },
      { firstName: "Claudine", lastName: "Germain", username: "claudine.germain", email: "claudine.germain@email.com" },
      { firstName: "Michel", lastName: "Vincent", username: "michel.vincent", email: "michel.vincent@email.com" },
      { firstName: "Francine", lastName: "Joseph", username: "francine.joseph", email: "francine.joseph@email.com" },
      { firstName: "Robert", lastName: "Sylvain", username: "robert.sylvain", email: "robert.sylvain@email.com" },
      { firstName: "Carla", lastName: "Denis", username: "carla.denis", email: "carla.denis@email.com" },
      { firstName: "Daniel", lastName: "Etienne", username: "daniel.etienne", email: "daniel.etienne@email.com" },
      { firstName: "Marl\xE8ne", lastName: "Beauvais", username: "marlene.beauvais", email: "marlene.beauvais@email.com" },
      { firstName: "Patrick", lastName: "L\xE9ger", username: "patrick.leger", email: "patrick.leger@email.com" },
      { firstName: "Nicole", lastName: "Philippe", username: "nicole.philippe", email: "nicole.philippe@email.com" },
      { firstName: "Emmanuel", lastName: "C\xE9sar", username: "emmanuel.cesar", email: "emmanuel.cesar@email.com" },
      { firstName: "Vanessa", lastName: "Augustin", username: "vanessa.augustin", email: "vanessa.augustin@email.com" },
      { firstName: "Fran\xE7ois", lastName: "Mo\xEFse", username: "francois.moise", email: "francois.moise@email.com" },
      { firstName: "Diane", lastName: "Th\xE9odore", username: "diane.theodore", email: "diane.theodore@email.com" },
      { firstName: "Alain", lastName: "Guerrier", username: "alain.guerrier", email: "alain.guerrier@email.com" }
    ];
    const clientPassword = await bcrypt2.hash("client123", 10);
    const createdClients = [];
    for (const client2 of clientNames) {
      const newClient = await storage.createUser({
        username: client2.username,
        email: client2.email,
        password: clientPassword,
        firstName: client2.firstName,
        lastName: client2.lastName,
        role: "client",
        phoneNumber: `+1-514-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9e3) + 1e3}`,
        loyaltyPoints: Math.floor(Math.random() * 1e3),
        preferences: {
          language: Math.random() > 0.5 ? "fr" : "en",
          notifications: true,
          theme: "haitian"
        },
        allergies: Math.random() > 0.7 ? ["gluten"] : []
      });
      createdClients.push(newClient);
    }
    const orderStatuses = ["completed", "pending", "confirmed", "preparing", "ready"];
    const orderTypes = ["dine-in", "takeout", "delivery"];
    for (let i = 0; i < 150; i++) {
      const randomClient = createdClients[Math.floor(Math.random() * createdClients.length)];
      const orderDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1e3);
      const orderItems = [
        { menuItemId: 1, quantity: Math.floor(Math.random() * 3) + 1, price: "24.95", customizations: [] },
        { menuItemId: 2, quantity: Math.floor(Math.random() * 2) + 1, price: "28.50", customizations: [] }
      ];
      const subtotal = orderItems.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
      const gst = subtotal * 0.05;
      const qst = subtotal * 0.09975;
      const total = subtotal + gst + qst;
      await storage.createOrder({
        userId: randomClient.id,
        status: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
        items: orderItems,
        totalAmount: total.toFixed(2),
        gstAmount: gst.toFixed(2),
        qstAmount: qst.toFixed(2),
        discountAmount: "0",
        loyaltyPointsUsed: Math.random() > 0.8 ? Math.floor(Math.random() * 100) : 0,
        loyaltyPointsEarned: Math.floor(total / 10),
        paymentMethod: Math.random() > 0.5 ? "carte" : "comptant",
        paymentStatus: "completed",
        orderType: orderTypes[Math.floor(Math.random() * orderTypes.length)],
        specialRequests: Math.random() > 0.7 ? "Pas \xE9pic\xE9" : null,
        estimatedReadyTime: new Date(orderDate.getTime() + 30 * 60 * 1e3)
      });
    }
    for (let i = 0; i < 50; i++) {
      const randomClient = createdClients[Math.floor(Math.random() * createdClients.length)];
      const reservationDate = new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1e3);
      await storage.createReservation({
        userId: randomClient.id,
        guestName: `${randomClient.firstName} ${randomClient.lastName}`,
        guestEmail: randomClient.email,
        guestPhone: randomClient.phoneNumber || "+1-514-555-0000",
        partySize: Math.floor(Math.random() * 8) + 1,
        dateTime: reservationDate,
        tableNumber: Math.floor(Math.random() * 20) + 1,
        status: Math.random() > 0.8 ? "pending" : "confirmed",
        specialRequests: Math.random() > 0.6 ? "Anniversaire" : null,
        occasion: Math.random() > 0.5 ? "birthday" : null,
        dietaryRestrictions: Math.random() > 0.8 ? ["vegetarian"] : [],
        confirmationCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        reminderSent: false
      });
    }
    const staffMembers = [
      { firstName: "Lucie", lastName: "Gervais", username: "lucie.manager", role: "manager" },
      { firstName: "Marc", lastName: "Dupont", username: "marc.staff", role: "staff" },
      { firstName: "Sarah", lastName: "Lapointe", username: "sarah.staff", role: "staff" },
      { firstName: "David", lastName: "Tremblay", username: "david.staff", role: "staff" }
    ];
    const staffPassword = await bcrypt2.hash("staff123", 10);
    for (const staff of staffMembers) {
      await storage.createUser({
        username: staff.username,
        email: `${staff.username}@dounie-cuisine.com`,
        password: staffPassword,
        firstName: staff.firstName,
        lastName: staff.lastName,
        role: staff.role,
        phoneNumber: `+1-514-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9e3) + 1e3}`,
        loyaltyPoints: 0,
        preferences: {
          language: "fr",
          notifications: true,
          theme: "haitian"
        },
        allergies: []
      });
    }
    console.log("\u2713 Donn\xE9es ha\xEFtiennes initialis\xE9es avec succ\xE8s!");
    console.log("\u2713 Th\xE8me Ha\xEFti activ\xE9 par d\xE9faut");
    console.log("\u2713 Utilisateur admin cr\xE9\xE9: admin / admin123");
    console.log(`\u2713 ${createdClients.length} clients de test cr\xE9\xE9s (mot de passe: client123)`);
    console.log(`\u2713 ${staffMembers.length} employ\xE9s cr\xE9\xE9s (mot de passe: staff123)`);
    console.log("\u2713 150 commandes de test cr\xE9\xE9es");
    console.log("\u2713 50 r\xE9servations de test cr\xE9\xE9es");
    console.log("\u2713 Menu ha\xEFtien authentique ajout\xE9");
    console.log("\u2713 \xC9v\xE9nements et inventaire initialis\xE9s");
  } catch (error) {
    console.error("\u274C Erreur lors de l'initialisation des donn\xE9es:", error);
    throw error;
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

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

export interface IStorage {
  // Users
  getUsers(): Promise<User[]>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;
  
  // Menu Items
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, updates: Partial<InsertMenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: number): Promise<boolean>;
  
  // Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrdersByUser(userId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, updates: Partial<InsertOrder>): Promise<Order | undefined>;
  
  // Reservations
  getReservations(): Promise<Reservation[]>;
  getReservation(id: number): Promise<Reservation | undefined>;
  getReservationsByUser(userId: number): Promise<Reservation[]>;
  getReservationsByDate(date: string): Promise<Reservation[]>;
  createReservation(reservation: InsertReservation): Promise<Reservation>;
  updateReservation(id: number, updates: Partial<InsertReservation>): Promise<Reservation | undefined>;
  
  // Employees
  getEmployees(): Promise<Employee[]>;
  getEmployee(id: number): Promise<Employee | undefined>;
  getEmployeeByUserId(userId: number): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: number, updates: Partial<InsertEmployee>): Promise<Employee | undefined>;
  
  // Calendar Events
  getCalendarEvents(): Promise<CalendarEvent[]>;
  getCalendarEvent(id: number): Promise<CalendarEvent | undefined>;
  getCalendarEventsByDateRange(start: string, end: string): Promise<CalendarEvent[]>;
  createCalendarEvent(event: InsertCalendarEvent): Promise<CalendarEvent>;
  updateCalendarEvent(id: number, updates: Partial<InsertCalendarEvent>): Promise<CalendarEvent | undefined>;
  deleteCalendarEvent(id: number): Promise<boolean>;
  
  // Inventory
  getInventoryItems(): Promise<InventoryItem[]>;
  getInventoryItem(id: number): Promise<InventoryItem | undefined>;
  createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  updateInventoryItem(id: number, updates: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined>;
  deleteInventoryItem(id: number): Promise<boolean>;
  
  // Financial Transactions
  getFinancialTransactions(): Promise<FinancialTransaction[]>;
  getFinancialTransaction(id: number): Promise<FinancialTransaction | undefined>;
  getFinancialTransactionsByDateRange(start: string, end: string): Promise<FinancialTransaction[]>;
  createFinancialTransaction(transaction: InsertFinancialTransaction): Promise<FinancialTransaction>;
  
  // Loyalty Rewards
  getLoyaltyRewards(): Promise<LoyaltyReward[]>;
  getLoyaltyReward(id: number): Promise<LoyaltyReward | undefined>;
  createLoyaltyReward(reward: InsertLoyaltyReward): Promise<LoyaltyReward>;
  updateLoyaltyReward(id: number, updates: Partial<InsertLoyaltyReward>): Promise<LoyaltyReward | undefined>;
  
  // Festive Themes
  getFestiveThemes(): Promise<FestiveTheme[]>;
  getActiveFestiveTheme(): Promise<FestiveTheme | undefined>;
  getFestiveTheme(id: number): Promise<FestiveTheme | undefined>;
  createFestiveTheme(theme: InsertFestiveTheme): Promise<FestiveTheme>;
  updateFestiveTheme(id: number, updates: Partial<InsertFestiveTheme>): Promise<FestiveTheme | undefined>;
  
  // Announcements
  getAnnouncements(): Promise<Announcement[]>;
  getActiveAnnouncements(): Promise<Announcement[]>;
  getAnnouncement(id: number): Promise<Announcement | undefined>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  updateAnnouncement(id: number, updates: Partial<InsertAnnouncement>): Promise<Announcement | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private menuItems: Map<number, MenuItem> = new Map();
  private orders: Map<number, Order> = new Map();
  private reservations: Map<number, Reservation> = new Map();
  private employees: Map<number, Employee> = new Map();
  private calendarEvents: Map<number, CalendarEvent> = new Map();
  private inventoryItems: Map<number, InventoryItem> = new Map();
  private financialTransactions: Map<number, FinancialTransaction> = new Map();
  private loyaltyRewards: Map<number, LoyaltyReward> = new Map();
  private festiveThemes: Map<number, FestiveTheme> = new Map();
  private announcements: Map<number, Announcement> = new Map();
  
  private currentId = 1;

  constructor() {
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize admin user
    const adminUser: User = {
      id: this.currentId++,
      username: "admin",
      password: "$2b$10$rHHT5DXPC8Ut2FLm0wY5AeOYwF5p9qKU1eBnAVKNe.TjAJR4sYf.u", // password: admin123
      email: "admin@dounieculisine.ca",
      firstName: "Marie",
      lastName: "Dubois",
      role: "admin",
      isEmployeeClient: true,
      phoneNumber: "+1-514-555-0100",
      loyaltyPoints: 0,
      preferences: {},
      allergies: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);

    // Initialize Christmas theme
    const christmasTheme: FestiveTheme = {
      id: this.currentId++,
      name: "Noël",
      nameEn: "Christmas",
      description: "Thème festif de Noël avec couleurs rouge et vert",
      isActive: true,
      isAutomatic: true,
      startDate: "2024-12-15",
      endDate: "2025-01-07",
      colors: {
        primary: "hsl(0, 84%, 55%)", // festive red
        secondary: "hsl(140, 70%, 45%)", // festive green
        accent: "hsl(45, 85%, 50%)", // festive gold
        background: "hsl(0, 0%, 100%)",
      },
      animations: {
        snowfall: true,
        sparkles: true,
      },
      icons: {
        tree: "fas fa-tree",
        gift: "fas fa-gift",
        star: "fas fa-star",
      },
      customCss: ".christmas-snow { animation: snowfall 3s linear infinite; }",
      priority: 1,
      recurringYearly: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.festiveThemes.set(christmasTheme.id, christmasTheme);

    // Initialize sample menu items
    const menuItem1: MenuItem = {
      id: this.currentId++,
      name: "Diri ak Djon Djon de Noël",
      nameEn: "Christmas Black Mushroom Rice",
      description: "Riz traditionnel aux champignons noirs, sauce spéciale festive",
      descriptionEn: "Traditional black mushroom rice with special festive sauce",
      category: "Plats Principaux",
      price: "24.99",
      isAvailable: true,
      isFestive: true,
      festiveTheme: "christmas",
      allergies: [],
      ingredients: ["riz", "champignons djon djon", "épices", "bouillon"],
      imageUrl: "",
      preparationTime: 25,
      calories: 450,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.menuItems.set(menuItem1.id, menuItem1);

    const menuItem2: MenuItem = {
      id: this.currentId++,
      name: "Griot Festif aux Épices",
      nameEn: "Festive Spiced Griot",
      description: "Porc mariné et frit, accompagné de bananes plantain",
      descriptionEn: "Marinated and fried pork, served with plantain bananas",
      category: "Plats Principaux",
      price: "28.99",
      isAvailable: true,
      isFestive: true,
      festiveTheme: "christmas",
      allergies: [],
      ingredients: ["porc", "épices", "bananes plantain", "ail"],
      imageUrl: "",
      preparationTime: 35,
      calories: 620,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.menuItems.set(menuItem2.id, menuItem2);

    const menuItem3: MenuItem = {
      id: this.currentId++,
      name: "Pain Patate de Noël",
      nameEn: "Christmas Sweet Potato Bread",
      description: "Dessert traditionnel aux patates douces et épices festives",
      descriptionEn: "Traditional sweet potato dessert with festive spices",
      category: "Desserts",
      price: "12.99",
      isAvailable: true,
      isFestive: true,
      festiveTheme: "christmas",
      allergies: ["gluten", "œufs"],
      ingredients: ["patates douces", "farine", "épices", "sucre"],
      imageUrl: "",
      preparationTime: 15,
      calories: 280,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.menuItems.set(menuItem3.id, menuItem3);

    // Initialize sample calendar events
    const christmasParty: CalendarEvent = {
      id: this.currentId++,
      title: "Party de Noël - Staff",
      description: "Célébration de Noël pour tous les employés",
      eventType: "special_event",
      startTime: new Date("2024-12-23T19:00:00"),
      endTime: new Date("2024-12-23T23:00:00"),
      allDay: false,
      location: "Restaurant Dounie Cuisine",
      attendees: [adminUser.id],
      priority: "high",
      status: "confirmed",
      recurrence: null,
      reminders: null,
      attachments: [],
      contacts: null,
      isPublic: false,
      createdBy: adminUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.calendarEvents.set(christmasParty.id, christmasParty);

    const payrollEvent: CalendarEvent = {
      id: this.currentId++,
      title: "Paie de Noël",
      description: "Traitement de la paie de décembre avec bonus festif",
      eventType: "payroll",
      startTime: new Date("2024-12-20T17:00:00"),
      endTime: new Date("2024-12-20T18:00:00"),
      allDay: false,
      location: "Bureau Administration",
      attendees: [adminUser.id],
      priority: "high",
      status: "scheduled",
      recurrence: null,
      reminders: null,
      attachments: [],
      contacts: null,
      isPublic: false,
      createdBy: adminUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.calendarEvents.set(payrollEvent.id, payrollEvent);

    // Initialize sample financial transactions
    const sampleRevenue: FinancialTransaction = {
      id: this.currentId++,
      type: "income",
      category: "ventes",
      amount: "2847.50",
      description: "Revenus du jour - commandes restaurant",
      date: new Date().toISOString().split('T')[0],
      relatedOrderId: null,
      relatedEmployeeId: null,
      paymentMethod: "carte",
      receiptUrl: null,
      taxDeductible: false,
      gstAmount: "142.38",
      qstAmount: "284.03",
      notes: null,
      createdBy: adminUser.id,
      createdAt: new Date(),
    };
    this.financialTransactions.set(sampleRevenue.id, sampleRevenue);

    // Initialize sample inventory items
    const inventoryItem1: InventoryItem = {
      id: this.currentId++,
      name: "Canneberges",
      category: "Fruits",
      currentStock: 12,
      minimumStock: 25,
      unit: "kg",
      costPerUnit: "4.50",
      supplier: "Fruits Québec Inc.",
      lastOrderDate: "2024-12-15",
      expirationDate: "2024-12-31",
      location: "Réfrigérateur A",
      isCritical: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.inventoryItems.set(inventoryItem1.id, inventoryItem1);

    const inventoryItem2: InventoryItem = {
      id: this.currentId++,
      name: "Champagne",
      category: "Boissons",
      currentStock: 45,
      minimumStock: 20,
      unit: "bouteilles",
      costPerUnit: "35.00",
      supplier: "Vins & Spiritueux Montréal",
      lastOrderDate: "2024-12-10",
      expirationDate: "2025-06-30",
      location: "Cave à vin",
      isCritical: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.inventoryItems.set(inventoryItem2.id, inventoryItem2);

    // Initialize loyalty rewards
    const christmasReward: LoyaltyReward = {
      id: this.currentId++,
      name: "Repas Gratuit de Noël",
      description: "Un repas principal gratuit pour les fêtes",
      pointsCost: 500,
      rewardType: "free_item",
      rewardValue: "25.00",
      isActive: true,
      isFestive: true,
      festiveTheme: "christmas",
      validFrom: "2024-12-15",
      validTo: "2025-01-07",
      usageLimit: 100,
      timesUsed: 23,
      conditions: { minimumOrder: 50 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.loyaltyRewards.set(christmasReward.id, christmasReward);
  }

  // User methods
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = {
      ...insertUser,
      id,
      role: insertUser.role || "client",
      isEmployeeClient: insertUser.isEmployeeClient || false,
      phoneNumber: insertUser.phoneNumber || null,
      loyaltyPoints: insertUser.loyaltyPoints || 0,
      preferences: insertUser.preferences || {},
      allergies: insertUser.allergies || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Menu item methods
  async getMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values());
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async createMenuItem(insertItem: InsertMenuItem): Promise<MenuItem> {
    const id = this.currentId++;
    const item: MenuItem = {
      ...insertItem,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      allergies: insertItem.allergies || null,
      nameEn: insertItem.nameEn || null,
      descriptionEn: insertItem.descriptionEn || null,
      imageUrl: insertItem.imageUrl || null,
      isAvailable: insertItem.isAvailable ?? true,
      isFestive: insertItem.isFestive ?? null,
      festiveTheme: insertItem.festiveTheme || null,
      ingredients: insertItem.ingredients || null,
      preparationTime: insertItem.preparationTime || null,
      calories: insertItem.calories || null
    };
    this.menuItems.set(id, item);
    return item;
  }

  async updateMenuItem(id: number, updates: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const item = this.menuItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...updates, updatedAt: new Date() };
    this.menuItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    return this.menuItems.delete(id);
  }

  // Order methods
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentId++;
    const order: Order = {
      ...insertOrder,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: insertOrder.userId || null,
      status: insertOrder.status || "pending",
      discountAmount: insertOrder.discountAmount || null,
      paymentMethod: insertOrder.paymentMethod || null,
      notes: insertOrder.notes || null,
      estimatedReadyTime: insertOrder.estimatedReadyTime || null
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrder(id: number, updates: Partial<InsertOrder>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, ...updates, updatedAt: new Date() };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Reservation methods
  async getReservations(): Promise<Reservation[]> {
    return Array.from(this.reservations.values());
  }

  async getReservation(id: number): Promise<Reservation | undefined> {
    return this.reservations.get(id);
  }

  async getReservationsByUser(userId: number): Promise<Reservation[]> {
    return Array.from(this.reservations.values()).filter(res => res.userId === userId);
  }

  async getReservationsByDate(date: string): Promise<Reservation[]> {
    const targetDate = new Date(date);
    return Array.from(this.reservations.values()).filter(res => {
      const resDate = new Date(res.dateTime);
      return resDate.toDateString() === targetDate.toDateString();
    });
  }

  async createReservation(insertReservation: InsertReservation): Promise<Reservation> {
    const id = this.currentId++;
    const reservation: Reservation = {
      ...insertReservation,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: insertReservation.userId || null,
      status: insertReservation.status || "pending",
      specialRequests: insertReservation.specialRequests || null,
      tableNumber: insertReservation.tableNumber || null,
      confirmationCode: insertReservation.confirmationCode || `RES-${Date.now()}`,
      reminderSent: insertReservation.reminderSent ?? null
    };
    this.reservations.set(id, reservation);
    return reservation;
  }

  async updateReservation(id: number, updates: Partial<InsertReservation>): Promise<Reservation | undefined> {
    const reservation = this.reservations.get(id);
    if (!reservation) return undefined;
    
    const updatedReservation = { ...reservation, ...updates, updatedAt: new Date() };
    this.reservations.set(id, updatedReservation);
    return updatedReservation;
  }

  // Employee methods
  async getEmployees(): Promise<Employee[]> {
    return Array.from(this.employees.values());
  }

  async getEmployee(id: number): Promise<Employee | undefined> {
    return this.employees.get(id);
  }

  async getEmployeeByUserId(userId: number): Promise<Employee | undefined> {
    return Array.from(this.employees.values()).find(emp => emp.userId === userId);
  }

  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    const id = this.currentId++;
    const employee: Employee = {
      ...insertEmployee,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: insertEmployee.isActive ?? null,
      phoneNumber: insertEmployee.phoneNumber || null,
      emergencyContact: insertEmployee.emergencyContact || null,
      permissions: insertEmployee.permissions || null,
      availability: insertEmployee.availability || null
    };
    this.employees.set(id, employee);
    return employee;
  }

  async updateEmployee(id: number, updates: Partial<InsertEmployee>): Promise<Employee | undefined> {
    const employee = this.employees.get(id);
    if (!employee) return undefined;
    
    const updatedEmployee = { ...employee, ...updates, updatedAt: new Date() };
    this.employees.set(id, updatedEmployee);
    return updatedEmployee;
  }

  // Calendar event methods
  async getCalendarEvents(): Promise<CalendarEvent[]> {
    return Array.from(this.calendarEvents.values());
  }

  async getCalendarEvent(id: number): Promise<CalendarEvent | undefined> {
    return this.calendarEvents.get(id);
  }

  async getCalendarEventsByDateRange(start: string, end: string): Promise<CalendarEvent[]> {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    return Array.from(this.calendarEvents.values()).filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate >= startDate && eventDate <= endDate;
    });
  }

  async createCalendarEvent(insertEvent: InsertCalendarEvent): Promise<CalendarEvent> {
    const id = this.currentId++;
    const event: CalendarEvent = {
      ...insertEvent,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      description: insertEvent.description || null,
      status: insertEvent.status || null,
      location: insertEvent.location || null,
      attendees: insertEvent.attendees || null,
      reminder: insertEvent.reminder || null,
      isRecurring: insertEvent.isRecurring ?? null,
      recurringPattern: insertEvent.recurringPattern || null,
      color: insertEvent.color || null,
      createdBy: insertEvent.createdBy || null
    };
    this.calendarEvents.set(id, event);
    return event;
  }

  async updateCalendarEvent(id: number, updates: Partial<InsertCalendarEvent>): Promise<CalendarEvent | undefined> {
    const event = this.calendarEvents.get(id);
    if (!event) return undefined;
    
    const updatedEvent = { ...event, ...updates, updatedAt: new Date() };
    this.calendarEvents.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteCalendarEvent(id: number): Promise<boolean> {
    return this.calendarEvents.delete(id);
  }

  // Inventory methods
  async getInventoryItems(): Promise<InventoryItem[]> {
    return Array.from(this.inventoryItems.values());
  }

  async getInventoryItem(id: number): Promise<InventoryItem | undefined> {
    return this.inventoryItems.get(id);
  }

  async createInventoryItem(insertItem: InsertInventoryItem): Promise<InventoryItem> {
    const id = this.currentId++;
    const item: InventoryItem = {
      ...insertItem,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      location: insertItem.location || null,
      supplier: insertItem.supplier || null,
      lastOrderDate: insertItem.lastOrderDate || null,
      expirationDate: insertItem.expirationDate || null,
      isCritical: insertItem.isCritical ?? null
    };
    this.inventoryItems.set(id, item);
    return item;
  }

  async updateInventoryItem(id: number, updates: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined> {
    const item = this.inventoryItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...updates, updatedAt: new Date() };
    this.inventoryItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteInventoryItem(id: number): Promise<boolean> {
    return this.inventoryItems.delete(id);
  }

  // Financial transaction methods
  async getFinancialTransactions(): Promise<FinancialTransaction[]> {
    return Array.from(this.financialTransactions.values());
  }

  async getFinancialTransaction(id: number): Promise<FinancialTransaction | undefined> {
    return this.financialTransactions.get(id);
  }

  async getFinancialTransactionsByDateRange(start: string, end: string): Promise<FinancialTransaction[]> {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    return Array.from(this.financialTransactions.values()).filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  }

  async createFinancialTransaction(insertTransaction: InsertFinancialTransaction): Promise<FinancialTransaction> {
    const id = this.currentId++;
    const transaction: FinancialTransaction = {
      ...insertTransaction,
      id,
      createdAt: new Date(),
      gstAmount: insertTransaction.gstAmount || null,
      qstAmount: insertTransaction.qstAmount || null,
      paymentMethod: insertTransaction.paymentMethod || null,
      createdBy: insertTransaction.createdBy || null,
      orderId: insertTransaction.orderId || null,
      notes: insertTransaction.notes || null
    };
    this.financialTransactions.set(id, transaction);
    return transaction;
  }

  // Loyalty reward methods
  async getLoyaltyRewards(): Promise<LoyaltyReward[]> {
    return Array.from(this.loyaltyRewards.values());
  }

  async getLoyaltyReward(id: number): Promise<LoyaltyReward | undefined> {
    return this.loyaltyRewards.get(id);
  }

  async createLoyaltyReward(insertReward: InsertLoyaltyReward): Promise<LoyaltyReward> {
    const id = this.currentId++;
    const reward: LoyaltyReward = {
      ...insertReward,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      isFestive: insertReward.isFestive ?? null,
      festiveTheme: insertReward.festiveTheme || null,
      isActive: insertReward.isActive ?? null,
      maxRedemptions: insertReward.maxRedemptions || null,
      currentRedemptions: insertReward.currentRedemptions || null,
      validFrom: insertReward.validFrom || null,
      validUntil: insertReward.validUntil || null,
      conditions: insertReward.conditions || null
    };
    this.loyaltyRewards.set(id, reward);
    return reward;
  }

  async updateLoyaltyReward(id: number, updates: Partial<InsertLoyaltyReward>): Promise<LoyaltyReward | undefined> {
    const reward = this.loyaltyRewards.get(id);
    if (!reward) return undefined;
    
    const updatedReward = { ...reward, ...updates, updatedAt: new Date() };
    this.loyaltyRewards.set(id, updatedReward);
    return updatedReward;
  }

  // Festive theme methods
  async getFestiveThemes(): Promise<FestiveTheme[]> {
    return Array.from(this.festiveThemes.values());
  }

  async getActiveFestiveTheme(): Promise<FestiveTheme | undefined> {
    return Array.from(this.festiveThemes.values()).find(theme => theme.isActive);
  }

  async getFestiveTheme(id: number): Promise<FestiveTheme | undefined> {
    return this.festiveThemes.get(id);
  }

  async createFestiveTheme(insertTheme: InsertFestiveTheme): Promise<FestiveTheme> {
    const id = this.currentId++;
    const theme: FestiveTheme = {
      ...insertTheme,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      description: insertTheme.description || null,
      isActive: insertTheme.isActive ?? null,
      priority: insertTheme.priority || null,
      startDate: insertTheme.startDate || null,
      endDate: insertTheme.endDate || null,
      animations: insertTheme.animations || null,
      styles: insertTheme.styles || null,
      customCSS: insertTheme.customCSS || null,
      recurringYearly: insertTheme.recurringYearly ?? null
    };
    this.festiveThemes.set(id, theme);
    return theme;
  }

  async updateFestiveTheme(id: number, updates: Partial<InsertFestiveTheme>): Promise<FestiveTheme | undefined> {
    const theme = this.festiveThemes.get(id);
    if (!theme) return undefined;
    
    const updatedTheme = { ...theme, ...updates, updatedAt: new Date() };
    this.festiveThemes.set(id, updatedTheme);
    return updatedTheme;
  }

  // Announcement methods
  async getAnnouncements(): Promise<Announcement[]> {
    return Array.from(this.announcements.values());
  }

  async getActiveAnnouncements(): Promise<Announcement[]> {
    const now = new Date();
    return Array.from(this.announcements.values()).filter(announcement => {
      if (!announcement.isActive) return false;
      if (announcement.startDate && new Date(announcement.startDate) > now) return false;
      if (announcement.endDate && new Date(announcement.endDate) < now) return false;
      return true;
    });
  }

  async getAnnouncement(id: number): Promise<Announcement | undefined> {
    return this.announcements.get(id);
  }

  async createAnnouncement(insertAnnouncement: InsertAnnouncement): Promise<Announcement> {
    const id = this.currentId++;
    const announcement: Announcement = {
      ...insertAnnouncement,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      imageUrl: insertAnnouncement.imageUrl || null,
      isActive: insertAnnouncement.isActive ?? null,
      priority: insertAnnouncement.priority || null,
      createdBy: insertAnnouncement.createdBy || null,
      startDate: insertAnnouncement.startDate || null,
      endDate: insertAnnouncement.endDate || null,
      viewCount: insertAnnouncement.viewCount || null
    };
    this.announcements.set(id, announcement);
    return announcement;
  }

  async updateAnnouncement(id: number, updates: Partial<InsertAnnouncement>): Promise<Announcement | undefined> {
    const announcement = this.announcements.get(id);
    if (!announcement) return undefined;
    
    const updatedAnnouncement = { ...announcement, ...updates, updatedAt: new Date() };
    this.announcements.set(id, updatedAnnouncement);
    return updatedAnnouncement;
  }
}

// Import the database storage implementation
import { DatabaseStorage } from "./storage-db";

// Use database storage instead of memory storage
export const storage = new DatabaseStorage();

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, insertMenuItemSchema, insertOrderSchema, 
  insertReservationSchema, insertCalendarEventSchema, insertInventorySchema,
  insertFinancialTransactionSchema, insertLoyaltyRewardSchema,
  insertFestiveThemeSchema, insertAnnouncementSchema 
} from "./shared/schema";
import { calculateCanadianTaxes, generatePayrollCalculation } from "./services/accounting";
import { getCurrentTheme, updateThemeAutomatically } from "./services/themes";
import bcrypt from "bcrypt";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Non autorisé" });
    }
    next();
  };

  // Middleware pour vérifier les permissions administrateur
  const requireAdmin = (req: any, res: any, next: any) => {
    if (!req.session?.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    if (!['admin', 'manager'].includes(req.session.user.role)) {
      console.error(`Security alert: Unauthorized admin access attempt by ${req.session.user.username}`);
      return res.status(403).json({ message: "Admin access required" });
    }
    
    next();
  };

  // Middleware pour vérifier les permissions staff
  const requireStaff = (req: any, res: any, next: any) => {
    if (!req.session?.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    if (!['admin', 'manager', 'staff'].includes(req.session.user.role)) {
      return res.status(403).json({ message: "Staff access required" });
    }
    
    next();
  };

  // User Authentication - Sécurisé
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Validation stricte des entrées
      if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ message: "Invalid input format" });
      }

      // Recherche utilisateur avec protection
      let user = await storage.getUserByUsername(username.trim().toLowerCase());
      
      if (!user) {
        user = await storage.getUserByEmail(username.trim().toLowerCase());
      }

      if (!user) {
        // Délai pour éviter les attaques de timing
        await new Promise(resolve => setTimeout(resolve, 1000));
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Vérification du mot de passe
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        // Délai pour éviter les attaques de timing
        await new Promise(resolve => setTimeout(resolve, 1000));
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Validation du rôle de sécurité
      const validRoles = ['admin', 'manager', 'staff', 'client'];
      if (!validRoles.includes(user.role)) {
        console.error(`Security alert: Invalid role ${user.role} for user ${user.username}`);
        return res.status(403).json({ message: "Access denied - invalid role" });
      }

      // Session sécurisée
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
          loyaltyPoints: user.loyaltyPoints || 0,
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

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, password, firstName, lastName, phoneNumber, role } = req.body;
      
      if (!username || !email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: "Required fields missing" });
      }

      // Check if user already exists
      const existingUserByUsername = await storage.getUserByUsername(username);
      if (existingUserByUsername) {
        return res.status(409).json({ message: "Username already exists" });
      }

      const existingUserByEmail = await storage.getUserByEmail(email);
      if (existingUserByEmail) {
        return res.status(409).json({ message: "Email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const newUser = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phoneNumber: phoneNumber || null,
        role: role || 'client',
        loyaltyPoints: 0,
        preferences: {
          language: 'fr',
          notifications: true,
          theme: 'haitian'
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

  app.post("/api/auth/logout", (req, res) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "Could not log out" });
        }
        res.clearCookie('connect.sid');
        res.json({ message: "Logged out successfully" });
      });
    } else {
      res.json({ message: "Already logged out" });
    }
  });

  app.get("/api/auth/me", (req, res) => {
    if (req.session?.user) {
      res.json(req.session.user);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  app.get("/api/admin/stats", requireStaff, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      res.json({ ...user, password: undefined });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // User Management
  app.get("/api/users", requireAuth, async (req, res) => {
    try {
      // Only admins can see all users
      const currentUser = await storage.getUser(req.session.userId);
      if (currentUser?.role !== "admin") {
        return res.status(403).json({ message: "Accès refusé" });
      }
      
      const users = await storage.getUsers();
      res.json(users.map(u => ({ ...u, password: undefined })));
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });
      
      res.status(201).json({ ...user, password: undefined });
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  // Menu Items
  app.get("/api/menu", async (req, res) => {
    try {
      const items = await storage.getMenuItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.post("/api/menu", requireAuth, async (req, res) => {
    try {
      const itemData = insertMenuItemSchema.parse(req.body);
      const item = await storage.createMenuItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  app.put("/api/menu/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertMenuItemSchema.partial().parse(req.body);
      const item = await storage.updateMenuItem(id, updates);
      
      if (!item) {
        return res.status(404).json({ message: "Article non trouvé" });
      }
      
      res.json(item);
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  app.delete("/api/menu/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteMenuItem(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Article non trouvé" });
      }
      
      res.json({ message: "Article supprimé" });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // Orders
  app.get("/api/orders", requireAuth, async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.post("/api/orders", requireAuth, async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      
      // Calculate Canadian taxes
      const subtotal = parseFloat(orderData.totalAmount);
      const { gstAmount, qstAmount, total } = calculateCanadianTaxes(subtotal);
      
      const order = await storage.createOrder({
        ...orderData,
        gstAmount: gstAmount.toString(),
        qstAmount: qstAmount.toString(),
        totalAmount: total.toString(),
      });
      
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  app.put("/api/orders/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertOrderSchema.partial().parse(req.body);
      const order = await storage.updateOrder(id, updates);
      
      if (!order) {
        return res.status(404).json({ message: "Commande non trouvée" });
      }
      
      res.json(order);
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  // Reservations
  app.get("/api/reservations", requireAuth, async (req, res) => {
    try {
      const reservations = await storage.getReservations();
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.get("/api/reservations/date/:date", async (req, res) => {
    try {
      const date = req.params.date;
      const reservations = await storage.getReservationsByDate(date);
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.post("/api/reservations", async (req, res) => {
    try {
      const reservationData = insertReservationSchema.parse(req.body);
      
      // Generate confirmation code
      const confirmationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const reservation = await storage.createReservation({
        ...reservationData,
        confirmationCode,
      });
      
      res.status(201).json(reservation);
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  app.put("/api/reservations/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertReservationSchema.partial().parse(req.body);
      const reservation = await storage.updateReservation(id, updates);
      
      if (!reservation) {
        return res.status(404).json({ message: "Réservation non trouvée" });
      }
      
      res.json(reservation);
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  // Calendar Events
  app.get("/api/calendar/events", requireAuth, async (req, res) => {
    try {
      const { start, end } = req.query;
      
      if (start && end) {
        const events = await storage.getCalendarEventsByDateRange(start as string, end as string);
        res.json(events);
      } else {
        const events = await storage.getCalendarEvents();
        res.json(events);
      }
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.post("/api/calendar/events", requireAuth, async (req, res) => {
    try {
      const eventData = insertCalendarEventSchema.parse(req.body);
      const event = await storage.createCalendarEvent({
        ...eventData,
        createdBy: req.session.userId,
      });
      
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  app.put("/api/calendar/events/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertCalendarEventSchema.partial().parse(req.body);
      const event = await storage.updateCalendarEvent(id, updates);
      
      if (!event) {
        return res.status(404).json({ message: "Événement non trouvé" });
      }
      
      res.json(event);
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  app.delete("/api/calendar/events/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteCalendarEvent(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Événement non trouvé" });
      }
      
      res.json({ message: "Événement supprimé" });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // Financial Transactions
  app.get("/api/finance/transactions", requireAuth, async (req, res) => {
    try {
      const { start, end } = req.query;
      
      if (start && end) {
        const transactions = await storage.getFinancialTransactionsByDateRange(start as string, end as string);
        res.json(transactions);
      } else {
        const transactions = await storage.getFinancialTransactions();
        res.json(transactions);
      }
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.post("/api/finance/transactions", requireAuth, async (req, res) => {
    try {
      const transactionData = insertFinancialTransactionSchema.parse(req.body);
      const transaction = await storage.createFinancialTransaction({
        ...transactionData,
        createdBy: req.session.userId,
      });
      
      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  // Canadian Accounting Endpoints
  app.get("/api/finance/summary", requireAuth, async (req, res) => {
    try {
      const transactions = await storage.getFinancialTransactions();
      
      const totalRevenue = transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      const totalExpenses = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      const totalGST = transactions
        .reduce((sum, t) => sum + (parseFloat(t.gstAmount || "0")), 0);
      
      const totalQST = transactions
        .reduce((sum, t) => sum + (parseFloat(t.qstAmount || "0")), 0);
      
      const netProfit = totalRevenue - totalExpenses;
      
      res.json({
        totalRevenue,
        totalExpenses,
        totalGST,
        totalQST,
        netProfit,
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.post("/api/finance/calculate-taxes", requireAuth, async (req, res) => {
    try {
      const { amount } = req.body;
      const taxes = calculateCanadianTaxes(parseFloat(amount));
      res.json(taxes);
    } catch (error) {
      res.status(400).json({ message: "Montant invalide" });
    }
  });

  // Festive Themes
  app.get("/api/themes", async (req, res) => {
    try {
      const themes = await storage.getFestiveThemes();
      res.json(themes);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.get("/api/themes/active", async (req, res) => {
    try {
      // Update automatic theme first
      await updateThemeAutomatically(storage);
      
      const theme = await storage.getActiveFestiveTheme();
      res.json(theme);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.put("/api/themes/:id/activate", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Deactivate all themes
      const allThemes = await storage.getFestiveThemes();
      for (const theme of allThemes) {
        await storage.updateFestiveTheme(theme.id, { isActive: false });
      }
      
      // Activate selected theme
      const theme = await storage.updateFestiveTheme(id, { isActive: true });
      
      if (!theme) {
        return res.status(404).json({ message: "Thème non trouvé" });
      }
      
      res.json(theme);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.post("/api/themes", requireAuth, async (req, res) => {
    try {
      const themeData = insertFestiveThemeSchema.parse(req.body);
      const theme = await storage.createFestiveTheme(themeData);
      res.status(201).json(theme);
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  // Loyalty Rewards
  app.get("/api/loyalty/rewards", async (req, res) => {
    try {
      const rewards = await storage.getLoyaltyRewards();
      res.json(rewards);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.post("/api/loyalty/rewards", requireAuth, async (req, res) => {
    try {
      const rewardData = insertLoyaltyRewardSchema.parse(req.body);
      const reward = await storage.createLoyaltyReward(rewardData);
      res.status(201).json(reward);
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  // Inventory
  app.get("/api/inventory", requireAuth, async (req, res) => {
    try {
      const items = await storage.getInventoryItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.post("/api/inventory", requireAuth, async (req, res) => {
    try {
      const itemData = insertInventorySchema.parse(req.body);
      const item = await storage.createInventoryItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  // Announcements
  app.get("/api/announcements", async (req, res) => {
    try {
      const announcements = await storage.getActiveAnnouncements();
      res.json(announcements);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.post("/api/announcements", requireAuth, async (req, res) => {
    try {
      const announcementData = insertAnnouncementSchema.parse(req.body);
      const announcement = await storage.createAnnouncement({
        ...announcementData,
        createdBy: req.session.userId,
      });
      
      res.status(201).json(announcement);
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  // Dashboard Statistics
  app.get("/api/dashboard/stats", requireAuth, async (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      // Get today's orders
      const orders = await storage.getOrders();
      const todayOrders = orders.filter(order => 
        order.createdAt.toISOString().split('T')[0] === today
      );
      
      const todayRevenue = todayOrders.reduce((sum, order) => 
        sum + parseFloat(order.totalAmount), 0
      );
      
      const activeOrders = orders.filter(order => 
        ['pending', 'confirmed', 'preparing'].includes(order.status)
      ).length;
      
      // Get tomorrow's reservations
      const tomorrowReservations = await storage.getReservationsByDate(tomorrow);
      
      // Get recent loyalty points
      const users = await storage.getUsers?.() || [];
      const totalLoyaltyPoints = users.reduce((sum, user) => sum + (user.loyaltyPoints || 0), 0);
      
      res.json({
        todayRevenue,
        activeOrders,
        tomorrowReservations: tomorrowReservations.length,
        totalLoyaltyPoints,
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

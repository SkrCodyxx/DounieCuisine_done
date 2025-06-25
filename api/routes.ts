import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, insertMenuItemSchema, insertOrderSchema, 
  insertReservationSchema, insertCalendarEventSchema, insertInventorySchema,
  insertFinancialTransactionSchema, insertLoyaltyRewardSchema,
  insertFestiveThemeSchema, insertAnnouncementSchema, insertClientSchema,
  insertCompanySettingsSchema, insertQuoteSchema, insertGallerySchema,
  insertGalleryImageSchema, insertContentPageSchema, insertCustomerMessageSchema,
  insertInternalMessageSchema, insertClientMessageSchema, insertRolePermissionSchema
} from "./shared/schema";
import { calculateCanadianTaxes, generatePayrollCalculation } from "./services/accounting";
import { getCurrentTheme, updateThemeAutomatically } from "./services/themes";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";

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

  // Middleware pour vérifier les permissions spécifiques
  const requirePermission = (permission: string) => {
    return async (req: any, res: any, next: any) => {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      try {
        const employee = await storage.getEmployeeByUserId(req.session.user.id);
        const rolePermissions = await storage.getRolePermissionByName(req.session.user.role);
        
        // Vérifier les permissions du rôle
        const hasRolePermission = rolePermissions?.permissions?.[permission] === true;
        
        // Vérifier les permissions spécifiques de l'employé
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
      const { username, email, password, firstName, lastName, phoneNumber, role, company, address } = req.body;
      
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
        company: company || null,
        address: address || null,
        preferences: {
          language: 'fr',
          notifications: true,
          theme: 'haitian'
        },
        allergies: []
      });

      // Si c'est un client, créer aussi une entrée dans la table clients
      if ((role || 'client') === 'client') {
        await storage.createClient({
          firstName,
          lastName,
          email,
          phoneNumber: phoneNumber || null,
          company: company || null,
          address: address || null,
          source: 'registration'
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

  // =============================================================================
  // PASSWORD RECOVERY SYSTEM (Manual - No Email)
  // =============================================================================
  
  // Temporary storage for password reset codes (in production, use Redis or DB)
  const passwordResetCodes = new Map<string, { userId: number, expires: Date, used: boolean }>();
  
  app.post("/api/admin/generate-password-reset", requireAdmin, async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email requis" });
      }
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      
      // Générer un code de récupération sécurisé
      const resetCode = nanoid(12).toUpperCase();
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures
      
      // Stocker le code temporairement
      passwordResetCodes.set(resetCode, {
        userId: user.id,
        expires,
        used: false
      });
      
      res.json({
        message: "Code de récupération généré",
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
  
  app.get("/api/admin/password-reset-codes", requireAdmin, async (req, res) => {
    try {
      const activeCodes: any[] = [];
      const now = new Date();
      
      for (const [code, data] of passwordResetCodes.entries()) {
        if (!data.used && data.expires > now) {
          const user = await storage.getUser(data.userId);
          activeCodes.push({
            code,
            user: user ? { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } : null,
            expires: data.expires,
            timeRemaining: Math.round((data.expires.getTime() - now.getTime()) / (1000 * 60 * 60)) + " heures"
          });
        }
      }
      
      res.json(activeCodes);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  
  app.post("/api/auth/verify-reset-code", async (req, res) => {
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
        return res.status(400).json({ message: "Code déjà utilisé" });
      }
      
      if (resetData.expires < new Date()) {
        passwordResetCodes.delete(code);
        return res.status(400).json({ message: "Code expiré" });
      }
      
      const user = await storage.getUser(resetData.userId);
      if (!user) {
        return res.status(400).json({ message: "Utilisateur non trouvé" });
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
  
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { code, newPassword } = req.body;
      
      if (!code || !newPassword) {
        return res.status(400).json({ message: "Code et nouveau mot de passe requis" });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caractères" });
      }
      
      const resetData = passwordResetCodes.get(code);
      if (!resetData) {
        return res.status(400).json({ message: "Code invalide" });
      }
      
      if (resetData.used) {
        return res.status(400).json({ message: "Code déjà utilisé" });
      }
      
      if (resetData.expires < new Date()) {
        passwordResetCodes.delete(code);
        return res.status(400).json({ message: "Code expiré" });
      }
      
      // Hasher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Mettre à jour le mot de passe
      await storage.updateUser(resetData.userId, { password: hashedPassword });
      
      // Marquer le code comme utilisé
      resetData.used = true;
      
      // Supprimer le code après 1 heure pour nettoyage
      setTimeout(() => {
        passwordResetCodes.delete(code);
      }, 60 * 60 * 1000);
      
      res.json({ 
        message: "Mot de passe réinitialisé avec succès" 
      });
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  
  // Nettoyage automatique des codes expirés (toutes les heures)
  setInterval(() => {
    const now = new Date();
    for (const [code, data] of passwordResetCodes.entries()) {
      if (data.expires < now) {
        passwordResetCodes.delete(code);
      }
    }
  }, 60 * 60 * 1000);

  // =============================================================================
  // ROLE PERMISSIONS MANAGEMENT
  // =============================================================================

  app.get("/api/admin/role-permissions", requireAdmin, async (req, res) => {
    try {
      const roles = await storage.getRolePermissions();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.post("/api/admin/role-permissions", requireAdmin, async (req, res) => {
    try {
      const roleData = insertRolePermissionSchema.parse(req.body);
      const role = await storage.createRolePermission(roleData);
      res.status(201).json(role);
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  app.put("/api/admin/role-permissions/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertRolePermissionSchema.partial().parse(req.body);
      const role = await storage.updateRolePermission(id, updates);
      
      if (!role) {
        return res.status(404).json({ message: "Rôle non trouvé" });
      }
      
      res.json(role);
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  // =============================================================================
  // CLIENT MANAGEMENT
  // =============================================================================

  app.get("/api/clients", requireStaff, async (req, res) => {
    try {
      const { search } = req.query;
      
      let clients;
      if (search) {
        clients = await storage.searchClients(search as string);
      } else {
        clients = await storage.getClients();
      }
      
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.get("/api/clients/:id", requireStaff, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const client = await storage.getClient(id);
      
      if (!client) {
        return res.status(404).json({ message: "Client non trouvé" });
      }
      
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.post("/api/clients", requireStaff, async (req, res) => {
    try {
      const clientData = insertClientSchema.parse(req.body);
      const client = await storage.createClient(clientData);
      res.status(201).json(client);
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  app.put("/api/clients/:id", requireStaff, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertClientSchema.partial().parse(req.body);
      const client = await storage.updateClient(id, updates);
      
      if (!client) {
        return res.status(404).json({ message: "Client non trouvé" });
      }
      
      res.json(client);
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  app.delete("/api/clients/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteClient(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Client non trouvé" });
      }
      
      res.json({ message: "Client supprimé" });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // =============================================================================
  // COMPANY SETTINGS
  // =============================================================================

  app.get("/api/company-settings", async (req, res) => {
    try {
      const settings = await storage.getCompanySettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.put("/api/company-settings", requireAdmin, async (req, res) => {
    try {
      const settingsData = insertCompanySettingsSchema.parse(req.body);
      
      // Vérifier si des paramètres existent déjà
      const existingSettings = await storage.getCompanySettings();
      
      let settings;
      if (existingSettings) {
        settings = await storage.updateCompanySettings(existingSettings.id, settingsData);
      } else {
        settings = await storage.createCompanySettings(settingsData);
      }
      
      res.json(settings);
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  // =============================================================================
  // QUOTE MANAGEMENT
  // =============================================================================

  app.get("/api/quotes", requireStaff, async (req, res) => {
    try {
      const { clientId } = req.query;
      
      let quotes;
      if (clientId) {
        quotes = await storage.getQuotesByClient(parseInt(clientId as string));
      } else {
        quotes = await storage.getQuotes();
      }
      
      res.json(quotes);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.get("/api/quotes/:id", requireStaff, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const quote = await storage.getQuote(id);
      
      if (!quote) {
        return res.status(404).json({ message: "Devis non trouvé" });
      }
      
      res.json(quote);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.post("/api/quotes", requireStaff, async (req, res) => {
    try {
      const quoteData = insertQuoteSchema.parse(req.body);
      
      // Générer un numéro de devis unique
      const quoteNumber = `DV${new Date().getFullYear()}${String(Date.now()).slice(-6)}`;
      
      // Calculer les taxes canadiennes
      const subtotal = parseFloat(quoteData.subtotalHT);
      const { gstAmount, qstAmount, total } = calculateCanadianTaxes(subtotal);
      
      const quote = await storage.createQuote({
        ...quoteData,
        quoteNumber,
        taxAmount: (gstAmount + qstAmount).toFixed(2),
        totalTTC: total.toFixed(2),
        createdBy: req.session.userId,
      });
      
      res.status(201).json(quote);
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  app.put("/api/quotes/:id", requireStaff, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertQuoteSchema.partial().parse(req.body);
      
      // Recalculer les taxes si le sous-total change
      if (updates.subtotalHT) {
        const subtotal = parseFloat(updates.subtotalHT);
        const { gstAmount, qstAmount, total } = calculateCanadianTaxes(subtotal);
        updates.taxAmount = (gstAmount + qstAmount).toFixed(2);
        updates.totalTTC = total.toFixed(2);
      }
      
      const quote = await storage.updateQuote(id, updates);
      
      if (!quote) {
        return res.status(404).json({ message: "Devis non trouvé" });
      }
      
      res.json(quote);
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  app.post("/api/quotes/:id/send", requireStaff, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const quote = await storage.updateQuote(id, {
        status: 'sent',
        sentAt: new Date()
      });
      
      if (!quote) {
        return res.status(404).json({ message: "Devis non trouvé" });
      }
      
      // Note: Envoi d'email désactivé - gestion manuelle recommandée
      res.json({ 
        message: "Devis marqué comme envoyé (notification manuelle requise)", 
        quote,
        note: "Veuillez contacter le client manuellement pour lui transmettre le devis"
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.delete("/api/quotes/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteQuote(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Devis non trouvé" });
      }
      
      res.json({ message: "Devis supprimé" });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // =============================================================================
  // GALLERY MANAGEMENT
  // =============================================================================

  app.get("/api/galleries", async (req, res) => {
    try {
      const galleries = await storage.getGalleries();
      res.json(galleries);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.post("/api/galleries", requirePermission('manage_galleries'), async (req, res) => {
    try {
      const galleryData = insertGallerySchema.parse(req.body);
      const gallery = await storage.createGallery(galleryData);
      res.status(201).json(gallery);
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  app.put("/api/galleries/:id", requirePermission('manage_galleries'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertGallerySchema.partial().parse(req.body);
      const gallery = await storage.updateGallery(id, updates);
      
      if (!gallery) {
        return res.status(404).json({ message: "Galerie non trouvée" });
      }
      
      res.json(gallery);
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  app.delete("/api/galleries/:id", requirePermission('manage_galleries'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteGallery(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Galerie non trouvée" });
      }
      
      res.json({ message: "Galerie supprimée" });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // Gallery Images
  app.get("/api/gallery-images", async (req, res) => {
    try {
      const { galleryId } = req.query;
      const images = await storage.getGalleryImages(galleryId ? parseInt(galleryId as string) : undefined);
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.post("/api/gallery-images", requirePermission('manage_galleries'), async (req, res) => {
    try {
      const imageData = insertGalleryImageSchema.parse(req.body);
      const image = await storage.createGalleryImage({
        ...imageData,
        uploadedBy: req.session.userId,
      });
      res.status(201).json(image);
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  app.put("/api/gallery-images/:id", requirePermission('manage_galleries'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertGalleryImageSchema.partial().parse(req.body);
      const image = await storage.updateGalleryImage(id, updates);
      
      if (!image) {
        return res.status(404).json({ message: "Image non trouvée" });
      }
      
      res.json(image);
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  app.delete("/api/gallery-images/:id", requirePermission('manage_galleries'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteGalleryImage(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Image non trouvée" });
      }
      
      res.json({ message: "Image supprimée" });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // =============================================================================
  // CONTENT PAGES MANAGEMENT
  // =============================================================================

  app.get("/api/content-pages", async (req, res) => {
    try {
      const pages = await storage.getContentPages();
      res.json(pages);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.get("/api/content-pages/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const page = await storage.getContentPageBySlug(slug);
      
      if (!page) {
        return res.status(404).json({ message: "Page non trouvée" });
      }
      
      res.json(page);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.post("/api/content-pages", requirePermission('manage_content'), async (req, res) => {
    try {
      const pageData = insertContentPageSchema.parse(req.body);
      const page = await storage.createContentPage({
        ...pageData,
        lastEditedBy: req.session.userId,
      });
      res.status(201).json(page);
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  app.put("/api/content-pages/:id", requirePermission('manage_content'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertContentPageSchema.partial().parse(req.body);
      const page = await storage.updateContentPage(id, {
        ...updates,
        lastEditedBy: req.session.userId,
      });
      
      if (!page) {
        return res.status(404).json({ message: "Page non trouvée" });
      }
      
      res.json(page);
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  app.delete("/api/content-pages/:id", requirePermission('manage_content'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteContentPage(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Page non trouvée" });
      }
      
      res.json({ message: "Page supprimée" });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // =============================================================================
  // CUSTOMER MESSAGES
  // =============================================================================

  app.get("/api/customer-messages", requireStaff, async (req, res) => {
    try {
      const { unread } = req.query;
      
      let messages;
      if (unread === 'true') {
        messages = await storage.getUnreadCustomerMessages();
      } else {
        messages = await storage.getCustomerMessages();
      }
      
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.post("/api/customer-messages", async (req, res) => {
    try {
      const messageData = insertCustomerMessageSchema.parse(req.body);
      const message = await storage.createCustomerMessage(messageData);
      
      // Créer automatiquement un client si ça n'existe pas
      const existingClient = await storage.getClientByEmail(messageData.email);
      if (!existingClient) {
        await storage.createClient({
          firstName: messageData.firstName,
          lastName: messageData.lastName,
          email: messageData.email,
          phoneNumber: messageData.phoneNumber,
          source: 'contact_form'
        });
      }
      
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  app.put("/api/customer-messages/:id", requireStaff, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertCustomerMessageSchema.partial().parse(req.body);
      const message = await storage.updateCustomerMessage(id, updates);
      
      if (!message) {
        return res.status(404).json({ message: "Message non trouvé" });
      }
      
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  // =============================================================================
  // INTERNAL MESSAGING SYSTEM
  // =============================================================================

  app.get("/api/internal-messages", requireAuth, async (req, res) => {
    try {
      const { type = 'received' } = req.query;
      
      let messages;
      if (type === 'sent') {
        messages = await storage.getSentInternalMessages(req.session.userId);
      } else {
        messages = await storage.getInternalMessages(req.session.userId);
      }
      
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.post("/api/internal-messages", requireAuth, async (req, res) => {
    try {
      const messageData = insertInternalMessageSchema.parse(req.body);
      const message = await storage.createInternalMessage({
        ...messageData,
        senderId: req.session.userId,
        threadId: messageData.threadId || Date.now(),
      });
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  app.put("/api/internal-messages/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertInternalMessageSchema.partial().parse(req.body);
      const message = await storage.updateInternalMessage(id, updates);
      
      if (!message) {
        return res.status(404).json({ message: "Message non trouvé" });
      }
      
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  app.delete("/api/internal-messages/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { isRecipient } = req.query;
      
      const deleted = await storage.deleteInternalMessage(
        id, 
        req.session.userId, 
        isRecipient === 'true'
      );
      
      if (!deleted) {
        return res.status(404).json({ message: "Message non trouvé" });
      }
      
      res.json({ message: "Message supprimé" });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // =============================================================================
  // CLIENT MESSAGING SYSTEM
  // =============================================================================

  app.get("/api/client-messages", requireStaff, async (req, res) => {
    try {
      const { clientId } = req.query;
      
      let messages;
      if (clientId) {
        messages = await storage.getClientMessagesByClient(parseInt(clientId as string));
      } else {
        messages = await storage.getClientMessages();
      }
      
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.post("/api/client-messages", requireStaff, async (req, res) => {
    try {
      const messageData = insertClientMessageSchema.parse(req.body);
      const message = await storage.createClientMessage({
        ...messageData,
        senderId: req.session.userId,
        sentAt: new Date(),
      });
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  // =============================================================================
  // ENHANCED MENU MANAGEMENT
  // =============================================================================

  app.get("/api/menu", async (req, res) => {
    try {
      const items = await storage.getMenuItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.post("/api/menu", requirePermission('manage_menu'), async (req, res) => {
    try {
      const itemData = insertMenuItemSchema.parse(req.body);
      const item = await storage.createMenuItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  app.put("/api/menu/:id", requirePermission('manage_menu'), async (req, res) => {
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

  app.put("/api/menu/:id/price", requirePermission('manage_menu'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { price } = req.body;
      
      if (!price || isNaN(parseFloat(price))) {
        return res.status(400).json({ message: "Prix invalide" });
      }
      
      const item = await storage.updateMenuItem(id, { price });
      
      if (!item) {
        return res.status(404).json({ message: "Article non trouvé" });
      }
      
      res.json(item);
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  app.put("/api/menu/:id/photo", requirePermission('manage_menu'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { imageUrl } = req.body;
      
      if (!imageUrl) {
        return res.status(400).json({ message: "URL de l'image requise" });
      }
      
      const item = await storage.updateMenuItem(id, { imageUrl });
      
      if (!item) {
        return res.status(404).json({ message: "Article non trouvé" });
      }
      
      res.json(item);
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  app.delete("/api/menu/:id", requirePermission('manage_menu'), async (req, res) => {
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

  // =============================================================================
  // ENHANCED ANNOUNCEMENTS
  // =============================================================================

  app.get("/api/announcements", async (req, res) => {
    try {
      const { position, active } = req.query;
      
      let announcements;
      if (position) {
        announcements = await storage.getAnnouncementsByPosition(position as string);
      } else if (active === 'true') {
        announcements = await storage.getActiveAnnouncements();
      } else {
        announcements = await storage.getAnnouncements();
      }
      
      res.json(announcements);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.post("/api/announcements", requirePermission('manage_announcements'), async (req, res) => {
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

  app.put("/api/announcements/:id", requirePermission('manage_announcements'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertAnnouncementSchema.partial().parse(req.body);
      const announcement = await storage.updateAnnouncement(id, updates);
      
      if (!announcement) {
        return res.status(404).json({ message: "Annonce non trouvée" });
      }
      
      res.json(announcement);
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  // =============================================================================
  // EXISTING ROUTES (UPDATED)
  // =============================================================================

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

  app.post("/api/users", requireAdmin, async (req, res) => {
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

  // Orders (Enhanced)
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
      
      // Get unread messages
      const unreadCustomerMessages = await storage.getUnreadCustomerMessages();
      
      // Get total clients
      const totalClients = (await storage.getClients()).length;
      
      // Get recent quotes
      const recentQuotes = (await storage.getQuotes()).slice(0, 5);
      
      res.json({
        todayRevenue,
        activeOrders,
        tomorrowReservations: tomorrowReservations.length,
        totalLoyaltyPoints,
        unreadMessages: unreadCustomerMessages.length,
        totalClients,
        recentQuotes: recentQuotes.length,
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
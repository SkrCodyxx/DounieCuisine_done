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
  // Add health check endpoint
  app.get("/api/ping", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Authentication middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Authentification requise." }); // Traduit
    }
    next();
  };

  // Middleware pour vérifier les permissions administrateur
  const requireAdmin = (req: any, res: any, next: any) => {
    if (!req.session?.user) {
      return res.status(401).json({ message: "Authentification requise." }); // Traduit
    }
    
    if (!['admin', 'manager'].includes(req.session.user.role)) {
      console.error(`Alerte sécurité : Tentative d'accès administrateur non autorisé par ${req.session.user.username}`); // Log en français
      return res.status(403).json({ message: "Accès administrateur requis." }); // Traduit
    }
    
    next();
  };

  // Middleware pour vérifier les permissions staff
  const requireStaff = (req: any, res: any, next: any) => {
    if (!req.session?.user) {
      return res.status(401).json({ message: "Authentification requise." }); // Traduit
    }
    
    if (!['admin', 'manager', 'staff'].includes(req.session.user.role)) {
      return res.status(403).json({ message: "Accès employé requis." }); // Traduit
    }
    
    next();
  };

  // Middleware pour vérifier les permissions spécifiques
  const requirePermission = (permission: string) => {
    return async (req: any, res: any, next: any) => {
      if (!req.session?.user) {
        return res.status(401).json({ message: "Authentification requise." }); // Traduit
      }

      try {
        // TODO: Optimisation potentielle - Mettre en cache les permissions utilisateur dans la session après la connexion
        // pour éviter les appels DB répétés sur ce middleware.
        const employee = await storage.getEmployeeByUserId(req.session.user.id);
        const rolePermissions = await storage.getRolePermissionByName(req.session.user.role);
        
        // Vérifier les permissions du rôle
        const hasRolePermission = rolePermissions?.permissions?.[permission] === true;
        
        // Vérifier les permissions spécifiques de l'employé
        const hasEmployeePermission = employee?.permissions?.[permission] === true;
        
        if (!hasRolePermission && !hasEmployeePermission) {
          return res.status(403).json({ message: `Permission requise : ${permission}` }); // Traduit
        }
        
        next();
      } catch (error) {
        console.error("Erreur vérification de permission:", error); // Traduit log
        res.status(500).json({ message: "Erreur interne du serveur." }); // Traduit
      }
    };
  };

  // User Authentication - Sécurisé
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ message: "Format de données d'entrée invalide." });
      }

      let user = await storage.getUserByUsername(username.trim().toLowerCase());
      if (!user) {
        user = await storage.getUserByEmail(username.trim().toLowerCase());
      }

      if (!user) {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 500)); // Délai anti-timing
        return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 500)); // Délai anti-timing
        return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
      }

      const validRoles = ['admin', 'manager', 'staff', 'client'];
      if (!validRoles.includes(user.role)) {
        console.error(`Alerte de sécurité : Tentative de connexion avec un rôle invalide (${user.role}) pour l'utilisateur ${user.username}.`);
        return res.status(403).json({ message: "Accès refusé en raison d'un rôle utilisateur non valide." });
      }

      // Régénération de l'ID de session pour prévenir la fixation de session
      req.session.regenerate((err) => {
        if (err) {
          console.error("Erreur lors de la régénération de la session:", err);
          return res.status(500).json({ message: "Erreur interne du serveur lors de la connexion." });
        }

        req.session.userId = user.id;
        // Stocker uniquement les informations utilisateur non sensibles et nécessaires
        req.session.user = {
          id: user.id,
          username: user.username,
          email: user.email, // Email peut être sensible, à évaluer si nécessaire dans la session
          role: user.role,
          // Ne pas stocker d'informations personnelles inutiles dans la session
        };

        // Exclure le mot de passe et autres champs sensibles de la réponse
        const { password: _, company: __, address: ___, preferences: ____, allergies: _____, ...userResponse } = user;
        res.json({
          message: "Connexion réussie.",
          user: userResponse
        });
      });
    } catch (error) {
      console.error("Erreur critique lors de la connexion:", error);
      res.status(500).json({ message: "Une erreur interne est survenue. Veuillez réessayer plus tard." });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      // Utiliser Zod pour valider et parser le corps de la requête
      const parsedBody = insertUserSchema.omit({
        id: true,
        loyaltyPoints: true,
        role: true, // Le rôle sera défini par défaut ou par un admin, pas par l'utilisateur à l'inscription
        isEmployeeClient: true, // Géré séparément
        // Les champs comme company, address, preferences, allergies peuvent être optionnels à l'inscription
        // ou gérés dans une étape de profilage ultérieure.
      }).extend({
        // S'assurer que les champs requis pour l'inscription de base sont présents
        username: insertUserSchema.shape.username,
        email: insertUserSchema.shape.email,
        password: insertUserSchema.shape.password,
        firstName: insertUserSchema.shape.firstName,
        lastName: insertUserSchema.shape.lastName,
      }).safeParse(req.body);

      if (!parsedBody.success) {
        return res.status(400).json({ message: "Données d'inscription invalides.", errors: parsedBody.error.flatten().fieldErrors });
      }
      const userData = parsedBody.data;

      const existingUserByUsername = await storage.getUserByUsername(userData.username);
      if (existingUserByUsername) {
        return res.status(409).json({ message: "Ce nom d'utilisateur est déjà pris. Veuillez en choisir un autre." });
      }

      const existingUserByEmail = await storage.getUserByEmail(userData.email);
      if (existingUserByEmail) {
        return res.status(409).json({ message: "Cette adresse e-mail est déjà associée à un compte." });
      }

      // Validation de la complexité du mot de passe (exemple simple)
      if (userData.password.length < 8) { // Conserver la longueur minimale de 8
          return res.status(400).json({ message: "Le mot de passe doit contenir au moins 8 caractères." });
      }
      // TODO: Ajouter d'autres règles de complexité (majuscules, chiffres, symboles) côté client et serveur.

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const newUser = await storage.createUser({
        ...userData, // Contient username, email, password (non-haché), firstName, lastName
        password: hashedPassword, // Remplacer par le mot de passe haché
        role: 'client', // Rôle par défaut pour les nouvelles inscriptions
        loyaltyPoints: 0,
        // Initialiser les champs optionnels/complexes avec des valeurs par défaut ou null
        phoneNumber: userData.phoneNumber || null,
        company: userData.company || null,
        address: userData.address || null,
        preferences: { language: 'fr', notifications: true, theme: 'haitian' }, // Préférences par défaut
        allergies: [], // Tableau vide par défaut pour les allergies
        isEmployeeClient: false, // Par défaut
      });

      // Si l'inscription concerne un client, on pourrait vouloir créer une entrée client distincte
      // ou enrichir le profil utilisateur. Pour l'instant, la table `users` gère cela.
      // Si `storage.createClient` est nécessaire pour une logique métier spécifique (ex: CRM séparé),
      // il faudrait s'assurer qu'il n'y a pas de redondance ou de conflit de données.
      // Pour ce refactoring, je suppose que la table `users` est la source de vérité principale.

      const { password: _, ...userResponse } = newUser;
      res.status(201).json({ 
        message: "Inscription réussie. Bienvenue !",
        user: userResponse 
      });
    } catch (error: any) {
      console.error("Erreur critique lors de l'inscription:", error);
       if (error.code === '23505') { // Violation d'unicité (par exemple, si une course conditionnelle se produit)
        return res.status(409).json({ message: "Un utilisateur avec ces informations existe déjà." });
      }
      res.status(500).json({ message: "Une erreur interne est survenue lors de l'inscription. Veuillez réessayer." });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error("Erreur lors de la destruction de la session:", err);
          // Ne pas divulguer de détails d'erreur au client pour des raisons de sécurité
          return res.status(500).json({ message: "Déconnexion échouée. Veuillez réessayer." });
        }
        // S'assurer que le cookie de session est bien supprimé côté client
        res.clearCookie('connect.sid', { path: '/' }); // Spécifier le path si nécessaire
        res.status(200).json({ message: "Vous avez été déconnecté avec succès." });
      });
    } else {
      // Si aucune session n'existe, l'utilisateur est techniquement déjà déconnecté
      res.status(200).json({ message: "Aucune session active à déconnecter." });
    }
  });

  // Renommé pour refléter qu'il récupère les informations de l'utilisateur actuellement authentifié
  app.get("/api/auth/current-user", requireAuth, async (req, res) => { // requireAuth est déjà en place
    try {
      // req.session.user est peuplé par le middleware requireAuth ou lors du login
      // Si on veut les données les plus fraîches de la DB :
      const userFromDb = await storage.getUser(req.session.userId);
      if (!userFromDb) {
        // Cela pourrait indiquer une session invalide ou un utilisateur supprimé
        req.session.destroy(() => {}); // Détruire la session invalide
        return res.status(401).json({ message: "Session invalide ou utilisateur non trouvé." });
      }
      // Exclure les informations sensibles
      const { password, ...userResponse } = userFromDb;
      res.json(userResponse);
    } catch (error) {
        console.error("Erreur lors de la récupération des informations de l'utilisateur actuel:", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
  });

  // Ajout d'une route pour la mise à jour du profil utilisateur
  app.put("/api/auth/profile", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      // Définir les champs que l'utilisateur est autorisé à mettre à jour
      const allowedUpdatesSchema = insertUserSchema.pick({
        firstName: true,
        lastName: true,
        email: true, // La mise à jour de l'email nécessite une vérification d'unicité
        phoneNumber: true,
        company: true,
        address: true,
        preferences: true, // S'assurer que le schéma des préférences est bien défini
        allergies: true   // S'assurer que le schéma des allergies est bien défini
      }).partial(); // Tous les champs sont optionnels

      const parsedBody = allowedUpdatesSchema.safeParse(req.body);

      if (!parsedBody.success) {
        return res.status(400).json({ message: "Données de profil invalides.", errors: parsedBody.error.flatten().fieldErrors });
      }
      const updates = parsedBody.data;

      // Si l'email est mis à jour, vérifier son unicité
      if (updates.email) {
        const currentUser = await storage.getUser(userId);
        if (currentUser && updates.email !== currentUser.email) {
          const existingUser = await storage.getUserByEmail(updates.email);
          if (existingUser) {
            return res.status(409).json({ message: "Cette adresse e-mail est déjà utilisée par un autre compte." });
          }
        }
      }

      // TODO: Si le mot de passe peut être mis à jour ici, ajouter une logique séparée
      // (par exemple, une route /api/auth/change-password) qui demanderait l'ancien mot de passe.
      // Ne pas permettre la mise à jour du mot de passe via cette route de profil générique sans vérification supplémentaire.

      const updatedUser = await storage.updateUser(userId, updates);
      if (!updatedUser) {
        return res.status(404).json({ message: "Utilisateur non trouvé pour la mise à jour." });
      }

      // Mettre à jour les informations utilisateur dans la session si nécessaire
      if (req.session.user) {
          if (updates.firstName) req.session.user.firstName = updatedUser.firstName;
          if (updates.lastName) req.session.user.lastName = updatedUser.lastName;
          if (updates.email) req.session.user.email = updatedUser.email;
          // Mettre à jour d'autres champs si stockés dans req.session.user
      }

      const { password, ...userResponse } = updatedUser;
      res.json({ message: "Profil mis à jour avec succès.", user: userResponse });

    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      if (error.code === '23505' && error.constraint === 'users_email_key') { // Spécifique à PostgreSQL
          return res.status(409).json({ message: "Cette adresse e-mail est déjà utilisée." });
      }
      res.status(500).json({ message: "Erreur interne du serveur lors de la mise à jour du profil." });
    }
  });

  // =============================================================================
  // SYSTÈME DE RÉINITIALISATION DE MOT DE PASSE (Manuel - Sans Email)
  // =============================================================================
  
  // Stockage temporaire des codes de réinitialisation.
  // ATTENTION : En production, utiliser une solution persistante (ex: Redis ou base de données)
  // car cette Map en mémoire sera perdue à chaque redémarrage du serveur.
  const passwordResetCodes = new Map<string, { userId: number, expires: Date, used: boolean }>();
  
  app.post("/api/admin/generate-password-reset", requireAdmin, async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "L'adresse email est requise." }); // Traduit
      }
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé avec cet email." }); // Traduit
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
        message: "Code de récupération généré avec succès.", // Traduit
        resetCode,
        expiresAt: expires,
        instructions: `Veuillez transmettre ce code à l'utilisateur : ${user.firstName} ${user.lastName} (${user.email}). Le code expirera dans 24 heures.`, // Traduit
        resetUrl: `/reset-password?code=${resetCode}` // URL relative
      });
    } catch (error) {
      console.error("Erreur de génération du code de réinitialisation:", error); // Traduit log
      res.status(500).json({ message: "Erreur interne du serveur." }); // Traduit
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
            expiresAt: data.expires.toISOString(), // Standardiser le format de date
            timeRemaining: Math.round((data.expires.getTime() - now.getTime()) / (1000 * 60 * 60)) + " heures"
          });
        }
      }
      
      res.json(activeCodes);
    } catch (error) {
      console.error("Erreur de récupération des codes actifs:", error); // Traduit log
      res.status(500).json({ message: "Erreur interne du serveur." }); // Traduit
    }
  });
  
  app.post("/api/auth/verify-reset-code", async (req, res) => {
    try {
      const { code } = req.body;
      
      if (!code) {
        return res.status(400).json({ message: "Le code de réinitialisation est requis." }); // Traduit
      }
      
      const resetData = passwordResetCodes.get(code);
      if (!resetData) {
        return res.status(400).json({ message: "Code de réinitialisation invalide." }); // Traduit
      }
      
      if (resetData.used) {
        return res.status(400).json({ message: "Ce code a déjà été utilisé." }); // Traduit
      }
      
      if (resetData.expires < new Date()) {
        passwordResetCodes.delete(code); // Supprimer le code expiré
        return res.status(400).json({ message: "Ce code a expiré." }); // Traduit
      }
      
      const user = await storage.getUser(resetData.userId);
      if (!user) {
        // Cela ne devrait pas arriver si le code est valide, mais c'est une sécurité
        passwordResetCodes.delete(code);
        return res.status(404).json({ message: "Utilisateur associé au code non trouvé." }); // Traduit
      }
      
      res.json({
        valid: true,
        message: "Code valide.", // Message de succès
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      });
    } catch (error) {
      console.error("Erreur de vérification du code de réinitialisation:", error); // Traduit log
      res.status(500).json({ message: "Erreur interne du serveur." }); // Traduit
    }
  });
  
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { code, newPassword } = req.body;
      
      if (!code || !newPassword) {
        return res.status(400).json({ message: "Le code et le nouveau mot de passe sont requis." }); // Traduit
      }
      
      // TODO: Ajouter une validation plus robuste du mot de passe (ex: complexité) côté client et/ou serveur.
      if (newPassword.length < 8) { // Augmenté à 8 pour plus de sécurité
        return res.status(400).json({ message: "Le nouveau mot de passe doit contenir au moins 8 caractères." }); // Traduit
      }
      
      const resetData = passwordResetCodes.get(code);
      if (!resetData) {
        return res.status(400).json({ message: "Code de réinitialisation invalide." }); // Traduit
      }
      
      if (resetData.used) {
        return res.status(400).json({ message: "Ce code a déjà été utilisé." }); // Traduit
      }
      
      if (resetData.expires < new Date()) {
        passwordResetCodes.delete(code); // Supprimer le code expiré
        return res.status(400).json({ message: "Ce code a expiré." }); // Traduit
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
        message: "Mot de passe réinitialisé avec succès." // Traduit
      });
    } catch (error) {
      console.error("Erreur de réinitialisation du mot de passe:", error); // Traduit log
      res.status(500).json({ message: "Erreur interne du serveur." }); // Traduit
    }
  });
  
  // Nettoyage automatique des codes expirés (toutes les heures)
  // Note: Ce `setInterval` pourrait ne pas être idéal dans un environnement serverless ou avec plusieurs instances.
  // Une tâche cron ou un mécanisme de nettoyage basé sur les requêtes serait plus robuste.
  // Pour l'instant, je le laisse, mais c'est un point d'amélioration pour la production à grande échelle.
  setInterval(() => {
    const now = new Date();
    for (const [code, data] of passwordResetCodes.entries()) {
      if (data.expires < now) {
        passwordResetCodes.delete(code);
      }
    }
  }, 60 * 60 * 1000);

  // =============================================================================
  // GESTION DES RÔLES ET PERMISSIONS
  // =============================================================================

  app.get("/api/admin/role-permissions", requireAdmin, async (req, res) => {
    try {
      const roles = await storage.getRolePermissions();
      res.json(roles);
    } catch (error) {
      console.error("Erreur récupération rôles/permissions:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  });

  app.post("/api/admin/role-permissions", requireAdmin, async (req, res) => {
    try {
      const roleData = insertRolePermissionSchema.parse(req.body);
      const role = await storage.createRolePermission(roleData);
      res.status(201).json(role);
    } catch (error: any) {
      console.error("Erreur création rôle/permission:", error);
      if (error.errors) { // Erreur de validation Zod
        return res.status(400).json({ message: "Données invalides.", details: error.errors });
      }
      res.status(400).json({ message: "Données invalides." });
    }
  });

  app.put("/api/admin/role-permissions/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "ID de rôle invalide." });
      const updates = insertRolePermissionSchema.partial().parse(req.body);
      const role = await storage.updateRolePermission(id, updates);
      
      if (!role) {
        return res.status(404).json({ message: "Rôle non trouvé." });
      }
      
      res.json(role);
    } catch (error: any) {
      console.error("Erreur mise à jour rôle/permission:", error);
       if (error.errors) {
        return res.status(400).json({ message: "Données invalides.", details: error.errors });
      }
      res.status(400).json({ message: "Données invalides." });
    }
  });

  // =============================================================================
  // GESTION DES CLIENTS
  // =============================================================================

  app.get("/api/clients", requireStaff, async (req, res) => {
    try {
      const { search } = req.query;
      
      let clients;
      if (search && typeof search === 'string') {
        clients = await storage.searchClients(search);
      } else {
        clients = await storage.getClients();
      }
      
      res.json(clients);
    } catch (error) {
      console.error("Erreur récupération clients:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  });

  app.get("/api/clients/:id", requireStaff, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "ID client invalide." });
      const client = await storage.getClient(id);
      
      if (!client) {
        return res.status(404).json({ message: "Client non trouvé." });
      }
      
      res.json(client);
    } catch (error) {
      console.error("Erreur récupération client:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  });

  app.post("/api/clients", requireStaff, async (req, res) => {
    try {
      const clientData = insertClientSchema.parse(req.body);
      const client = await storage.createClient(clientData);
      res.status(201).json(client);
    } catch (error: any) {
      console.error("Erreur création client:", error);
       if (error.errors) {
        return res.status(400).json({ message: "Données invalides.", details: error.errors });
      }
      res.status(400).json({ message: "Données invalides." });
    }
  });

  app.put("/api/clients/:id", requireStaff, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "ID client invalide." });
      const updates = insertClientSchema.partial().parse(req.body);
      const client = await storage.updateClient(id, updates);
      
      if (!client) {
        return res.status(404).json({ message: "Client non trouvé." });
      }
      
      res.json(client);
    } catch (error: any) {
      console.error("Erreur mise à jour client:", error);
       if (error.errors) {
        return res.status(400).json({ message: "Données invalides.", details: error.errors });
      }
      res.status(400).json({ message: "Données invalides." });
    }
  });

  app.delete("/api/clients/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "ID client invalide." });
      const deleted = await storage.deleteClient(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Client non trouvé." });
      }
      
      res.json({ message: "Client supprimé avec succès." }); // Traduit
    } catch (error) {
      console.error("Erreur suppression client:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  });

  // =============================================================================
  // PARAMÈTRES DE L'ENTREPRISE
  // =============================================================================

  app.get("/api/company-settings", async (req, res) => { // Devrait peut-être être requireAuth ou requireStaff
    try {
      const settings = await storage.getCompanySettings();
      res.json(settings);
    } catch (error) {
      console.error("Erreur récupération paramètres entreprise:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  });

  app.put("/api/company-settings", requireAdmin, async (req, res) => {
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
    } catch (error: any) {
      console.error("Erreur mise à jour paramètres entreprise:", error);
      if (error.errors) {
        return res.status(400).json({ message: "Données invalides.", details: error.errors });
      }
      res.status(400).json({ message: "Données invalides." });
    }
  });

  // =============================================================================
  // GESTION DES DEVIS
  // =============================================================================

  app.get("/api/quotes", requireStaff, async (req, res) => {
    try {
      const { clientId } = req.query;
      let quotes;
      if (clientId && typeof clientId === 'string') {
        const id = parseInt(clientId);
        if (isNaN(id)) return res.status(400).json({ message: "ID client invalide pour le filtre des devis."});
        quotes = await storage.getQuotesByClient(id);
      } else {
        quotes = await storage.getQuotes();
      }
      res.json(quotes);
    } catch (error) {
      console.error("Erreur récupération devis:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  });

  app.get("/api/quotes/:id", requireStaff, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "ID de devis invalide." });
      const quote = await storage.getQuote(id);
      
      if (!quote) {
        return res.status(404).json({ message: "Devis non trouvé." });
      }
      res.json(quote);
    } catch (error) {
      console.error("Erreur récupération devis:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  });

  app.post("/api/quotes", requireStaff, async (req, res) => {
    try {
      const quoteData = insertQuoteSchema.parse(req.body);
      const quoteNumber = `DV${new Date().getFullYear()}${String(Date.now()).slice(-6)}`;
      const subtotal = parseFloat(quoteData.subtotalHT);
      const { gstAmount, qstAmount, total } = calculateCanadianTaxes(subtotal);
      
      const quote = await storage.createQuote({
        ...quoteData,
        quoteNumber,
        taxAmount: (gstAmount + qstAmount).toFixed(2),
        totalTTC: total.toFixed(2),
        createdBy: req.session.userId, // Assurer que userId est bien un nombre (ID)
      });
      res.status(201).json(quote);
    } catch (error: any) {
      console.error("Erreur création devis:", error);
      if (error.errors) {
        return res.status(400).json({ message: "Données invalides.", details: error.errors });
      }
      res.status(400).json({ message: "Données invalides." });
    }
  });

  app.put("/api/quotes/:id", requireStaff, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "ID de devis invalide." });
      const updates = insertQuoteSchema.partial().parse(req.body);
      
      if (updates.subtotalHT) {
        const subtotal = parseFloat(updates.subtotalHT);
        const { gstAmount, qstAmount, total } = calculateCanadianTaxes(subtotal);
        updates.taxAmount = (gstAmount + qstAmount).toFixed(2);
        updates.totalTTC = total.toFixed(2);
      }
      
      const quote = await storage.updateQuote(id, updates);
      if (!quote) {
        return res.status(404).json({ message: "Devis non trouvé." });
      }
      res.json(quote);
    } catch (error: any) {
      console.error("Erreur mise à jour devis:", error);
      if (error.errors) {
        return res.status(400).json({ message: "Données invalides.", details: error.errors });
      }
      res.status(400).json({ message: "Données invalides." });
    }
  });

  app.post("/api/quotes/:id/send", requireStaff, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "ID de devis invalide." });
      
      const quote = await storage.updateQuote(id, {
        status: 'sent',
        sentAt: new Date()
      });
      
      if (!quote) {
        return res.status(404).json({ message: "Devis non trouvé." });
      }
      
      res.json({ 
        message: "Devis marqué comme envoyé (notification manuelle au client requise).", // Traduit
        quote,
        note: "Veuillez contacter le client manuellement pour lui transmettre le devis." // Traduit
      });
    } catch (error) {
      console.error("Erreur envoi devis:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  });

  app.delete("/api/quotes/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "ID de devis invalide." });
      const deleted = await storage.deleteQuote(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Devis non trouvé." });
      }
      res.json({ message: "Devis supprimé avec succès." }); // Traduit
    } catch (error) {
      console.error("Erreur suppression devis:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  });

  // =============================================================================
  // GESTION DE LA GALERIE
  // =============================================================================

  app.get("/api/galleries", async (req, res) => { // Devrait être requireStaff ou public selon l'usage
    try {
      const galleries = await storage.getGalleries();
      res.json(galleries);
    } catch (error) {
      console.error("Erreur récupération galeries:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  });

  app.post("/api/galleries", requirePermission('manage_galleries'), async (req, res) => {
    try {
      const galleryData = insertGallerySchema.parse(req.body);
      const gallery = await storage.createGallery(galleryData);
      res.status(201).json(gallery);
    } catch (error: any) {
      console.error("Erreur création galerie:", error);
      if (error.errors) {
        return res.status(400).json({ message: "Données invalides.", details: error.errors });
      }
      res.status(400).json({ message: "Données invalides." });
    }
  });

  app.put("/api/galleries/:id", requirePermission('manage_galleries'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "ID de galerie invalide." });
      const updates = insertGallerySchema.partial().parse(req.body);
      const gallery = await storage.updateGallery(id, updates);
      
      if (!gallery) {
        return res.status(404).json({ message: "Galerie non trouvée." });
      }
      res.json(gallery);
    } catch (error: any) {
      console.error("Erreur mise à jour galerie:", error);
      if (error.errors) {
        return res.status(400).json({ message: "Données invalides.", details: error.errors });
      }
      res.status(400).json({ message: "Données invalides." });
    }
  });

  app.delete("/api/galleries/:id", requirePermission('manage_galleries'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "ID de galerie invalide." });
      const deleted = await storage.deleteGallery(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Galerie non trouvée." });
      }
      res.json({ message: "Galerie supprimée avec succès." }); // Traduit
    } catch (error) {
      console.error("Erreur suppression galerie:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  });

  // Gallery Images
  app.get("/api/gallery-images", async (req, res) => { // Devrait être requireStaff ou public
    try {
      const { galleryId } = req.query;
      const images = await storage.getGalleryImages(galleryId ? parseInt(galleryId as string) : undefined);
      res.json(images);
    } catch (error) {
      console.error("Erreur récupération images de galerie:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
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
    } catch (error: any) {
      console.error("Erreur ajout image galerie:", error);
      if (error.errors) {
        return res.status(400).json({ message: "Données invalides.", details: error.errors });
      }
      res.status(400).json({ message: "Données invalides." });
    }
  });

  app.put("/api/gallery-images/:id", requirePermission('manage_galleries'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "ID d'image invalide." });
      const updates = insertGalleryImageSchema.partial().parse(req.body);
      const image = await storage.updateGalleryImage(id, updates);
      
      if (!image) {
        return res.status(404).json({ message: "Image non trouvée." });
      }
      res.json(image);
    } catch (error: any) {
      console.error("Erreur mise à jour image galerie:", error);
      if (error.errors) {
        return res.status(400).json({ message: "Données invalides.", details: error.errors });
      }
      res.status(400).json({ message: "Données invalides." });
    }
  });

  app.delete("/api/gallery-images/:id", requirePermission('manage_galleries'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "ID d'image invalide." });
      const deleted = await storage.deleteGalleryImage(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Image non trouvée." });
      }
      res.json({ message: "Image supprimée avec succès." }); // Traduit
    } catch (error) {
      console.error("Erreur suppression image galerie:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  });

  // =============================================================================
  // GESTION DES PAGES DE CONTENU
  // =============================================================================

  app.get("/api/content-pages", async (req, res) => { // Devrait être public ou requireStaff
    try {
      const pages = await storage.getContentPages();
      res.json(pages);
    } catch (error) {
      console.error("Erreur récupération pages de contenu:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  });

  app.get("/api/content-pages/:slug", async (req, res) => { // Devrait être public ou requireStaff
    try {
      const slug = req.params.slug;
      const page = await storage.getContentPageBySlug(slug);
      
      if (!page) {
        return res.status(404).json({ message: "Page non trouvée." });
      }
      res.json(page);
    } catch (error) {
      console.error("Erreur récupération page de contenu:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
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
    } catch (error: any) {
      console.error("Erreur création page de contenu:", error);
      if (error.errors) {
        return res.status(400).json({ message: "Données invalides.", details: error.errors });
      }
      res.status(400).json({ message: "Données invalides." });
    }
  });

  app.put("/api/content-pages/:id", requirePermission('manage_content'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "ID de page invalide." });
      const updates = insertContentPageSchema.partial().parse(req.body);
      const page = await storage.updateContentPage(id, {
        ...updates,
        lastEditedBy: req.session.userId,
      });
      
      if (!page) {
        return res.status(404).json({ message: "Page non trouvée." });
      }
      res.json(page);
    } catch (error: any) {
      console.error("Erreur mise à jour page de contenu:", error);
      if (error.errors) {
        return res.status(400).json({ message: "Données invalides.", details: error.errors });
      }
      res.status(400).json({ message: "Données invalides." });
    }
  });

  app.delete("/api/content-pages/:id", requirePermission('manage_content'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "ID de page invalide." });
      const deleted = await storage.deleteContentPage(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Page non trouvée." });
      }
      res.json({ message: "Page supprimée avec succès." }); // Traduit
    } catch (error) {
      console.error("Erreur suppression page de contenu:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  });

  // =============================================================================
  // MESSAGES CLIENTS (Formulaire de contact)
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
      console.error("Erreur récupération messages clients:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  });

  app.post("/api/customer-messages", async (req, res) => { // Endpoint public
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
          source: 'contact_form'
        });
      }
      res.status(201).json(message);
    } catch (error: any) {
      console.error("Erreur création message client:", error);
      if (error.errors) {
        return res.status(400).json({ message: "Données invalides.", details: error.errors });
      }
      res.status(400).json({ message: "Données invalides." });
    }
  });

  app.put("/api/customer-messages/:id", requireStaff, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "ID de message invalide." });
      const updates = insertCustomerMessageSchema.partial().parse(req.body); // S'assurer que 'read' est un boolean
      const message = await storage.updateCustomerMessage(id, updates);
      
      if (!message) {
        return res.status(404).json({ message: "Message non trouvé." });
      }
      res.json(message);
    } catch (error: any) {
      console.error("Erreur mise à jour message client:", error);
      if (error.errors) {
        return res.status(400).json({ message: "Données invalides.", details: error.errors });
      }
      res.status(400).json({ message: "Données invalides." });
    }
  });

  // =============================================================================
  // SYSTÈME DE MESSAGERIE INTERNE
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
      console.error("Erreur récupération messages internes:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  });

  app.post("/api/internal-messages", requireAuth, async (req, res) => {
    try {
      const messageData = insertInternalMessageSchema.parse(req.body);
      const message = await storage.createInternalMessage({
        ...messageData,
        senderId: req.session.userId,
        threadId: messageData.threadId || Date.now(), // Simple thread ID generation
      });

      // TODO: Décommenter et utiliser sendWebSocketMessage une fois ws installé et configuré dans api/index.ts
      /*
      if (message.recipientId) {
        const notificationSent = sendWebSocketMessage(message.recipientId.toString(), {
          type: 'new_internal_message',
          data: message,
        });
        if (notificationSent) {
          console.log(`Notification WebSocket pour nouveau message interne envoyée à ${message.recipientId}`);
        }
      }
      */

      res.status(201).json(message);
    } catch (error: any) {
      console.error("Erreur création message interne:", error);
      if (error.errors) {
        return res.status(400).json({ message: "Données invalides.", details: error.errors });
      }
      res.status(400).json({ message: "Données invalides." });
    }
  });

  app.put("/api/internal-messages/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "ID de message invalide." });
      const updates = insertInternalMessageSchema.partial().parse(req.body); // Ex: { read: true }
      const message = await storage.updateInternalMessage(id, updates);
      
      if (!message) {
        return res.status(404).json({ message: "Message non trouvé." });
      }
      res.json(message);
    } catch (error: any) {
      console.error("Erreur mise à jour message interne:", error);
      if (error.errors) {
        return res.status(400).json({ message: "Données invalides.", details: error.errors });
      }
      res.status(400).json({ message: "Données invalides." });
    }
  });

  app.delete("/api/internal-messages/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "ID de message invalide." });
      const { isRecipient } = req.query; // Pour gérer la suppression côté destinataire ou expéditeur
      
      const deleted = await storage.deleteInternalMessage(
        id, 
        req.session.userId, 
        isRecipient === 'true'
      );
      
      if (!deleted) {
        return res.status(404).json({ message: "Message non trouvé ou non autorisé à supprimer." }); // Traduit
      }
      res.json({ message: "Message supprimé avec succès." }); // Traduit
    } catch (error) {
      console.error("Erreur suppression message interne:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  });

  // =============================================================================
  // SYSTÈME DE MESSAGERIE CLIENT (Admin <-> Client)
  // =============================================================================

  app.get("/api/client-messages", requireStaff, async (req, res) => {
    try {
      const { clientId } = req.query;
      let messages;
      if (clientId && typeof clientId === 'string') {
         const id = parseInt(clientId);
         if(isNaN(id)) return res.status(400).json({ message: "ID client invalide."});
        messages = await storage.getClientMessagesByClient(id);
      } else {
        messages = await storage.getClientMessages();
      }
      res.json(messages);
    } catch (error) {
      console.error("Erreur récupération messages client-admin:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  });

  app.post("/api/client-messages", requireStaff, async (req, res) => { // Seul le staff peut initier/répondre
    try {
      const messageData = insertClientMessageSchema.parse(req.body);
      const message = await storage.createClientMessage({
        ...messageData,
        senderId: req.session.userId, // L'employé est l'expéditeur
        sentAt: new Date(),
      });
      // TODO: Notifier le client (si un système de notif client existe un jour)
      res.status(201).json(message);
    } catch (error: any) {
      console.error("Erreur création message client-admin:", error);
      if (error.errors) {
        return res.status(400).json({ message: "Données invalides.", details: error.errors });
      }
      res.status(400).json({ message: "Données invalides." });
    }
  });

  // =============================================================================
  // GESTION AMÉLIORÉE DU MENU
  // =============================================================================

  app.get("/api/menu", async (req, res) => { // Public, pas de requireAuth
    try {
      const items = await storage.getMenuItems();
      res.json(items);
    } catch (error) {
      console.error("Erreur récupération menu:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  });

  app.post("/api/menu", requirePermission('manage_menu'), async (req, res) => {
    try {
      const itemData = insertMenuItemSchema.parse(req.body);
      const item = await storage.createMenuItem(itemData);
      res.status(201).json(item);
    } catch (error: any) {
      console.error("Erreur création article menu:", error);
      if (error.errors) {
        return res.status(400).json({ message: "Données invalides.", details: error.errors });
      }
      res.status(400).json({ message: "Données invalides." });
    }
  });

  app.put("/api/menu/:id", requirePermission('manage_menu'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "ID d'article invalide." });
      const updates = insertMenuItemSchema.partial().parse(req.body);
      const item = await storage.updateMenuItem(id, updates);
      
      if (!item) {
        return res.status(404).json({ message: "Article de menu non trouvé." });
      }
      res.json(item);
    } catch (error: any) {
      console.error("Erreur mise à jour article menu:", error);
      if (error.errors) {
        return res.status(400).json({ message: "Données invalides.", details: error.errors });
      }
      res.status(400).json({ message: "Données invalides." });
    }
  });

  app.put("/api/menu/:id/price", requirePermission('manage_menu'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "ID d'article invalide." });
      const { price } = req.body;
      
      if (price === undefined || isNaN(parseFloat(price))) { // Vérification plus stricte
        return res.status(400).json({ message: "Prix invalide ou manquant." });
      }
      
      const item = await storage.updateMenuItem(id, { price: parseFloat(price) }); // Assurer que le prix est un nombre
      
      if (!item) {
        return res.status(404).json({ message: "Article de menu non trouvé." });
      }
      res.json(item);
    } catch (error: any) {
      console.error("Erreur mise à jour prix article menu:", error);
      if (error.errors) { // Zod error
        return res.status(400).json({ message: "Données invalides pour le prix.", details: error.errors });
      }
      res.status(400).json({ message: "Données invalides pour le prix." });
    }
  });

  app.put("/api/menu/:id/photo", requirePermission('manage_menu'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "ID d'article invalide." });
      const { imageUrl } = req.body;
      
      if (!imageUrl || typeof imageUrl !== 'string') { // Validation de type
        return res.status(400).json({ message: "URL de l'image requise et doit être une chaîne de caractères." });
      }
      
      const item = await storage.updateMenuItem(id, { imageUrl });
      
      if (!item) {
        return res.status(404).json({ message: "Article de menu non trouvé." });
      }
      res.json(item);
    } catch (error: any) {
      console.error("Erreur mise à jour photo article menu:", error);
       if (error.errors) {
        return res.status(400).json({ message: "Données invalides pour l'URL de l'image.", details: error.errors });
      }
      res.status(400).json({ message: "Données invalides pour l'URL de l'image." });
    }
  });

  app.delete("/api/menu/:id", requirePermission('manage_menu'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "ID d'article invalide." });
      const deleted = await storage.deleteMenuItem(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Article de menu non trouvé." });
      }
      res.json({ message: "Article de menu supprimé avec succès." }); // Traduit
    } catch (error) {
      console.error("Erreur suppression article menu:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  });

  // =============================================================================
  // GESTION AMÉLIORÉE DES ANNONCES
  // =============================================================================

  app.get("/api/announcements", async (req, res) => { // Public
    try {
      const { position, active } = req.query;
      let announcements;
      if (position && typeof position === 'string') {
        announcements = await storage.getAnnouncementsByPosition(position);
      } else if (active === 'true') {
        announcements = await storage.getActiveAnnouncements();
      } else {
        announcements = await storage.getAnnouncements();
      }
      res.json(announcements);
    } catch (error) {
      console.error("Erreur récupération annonces:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
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
    } catch (error: any) {
      console.error("Erreur création annonce:", error);
      if (error.errors) {
        return res.status(400).json({ message: "Données invalides.", details: error.errors });
      }
      res.status(400).json({ message: "Données invalides." });
    }
  });

  app.put("/api/announcements/:id", requirePermission('manage_announcements'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "ID d'annonce invalide." });
      const updates = insertAnnouncementSchema.partial().parse(req.body);
      const announcement = await storage.updateAnnouncement(id, updates);
      
      if (!announcement) {
        return res.status(404).json({ message: "Annonce non trouvée." });
      }
      res.json(announcement);
    } catch (error: any) {
      console.error("Erreur mise à jour annonce:", error);
      if (error.errors) {
        return res.status(400).json({ message: "Données invalides.", details: error.errors });
      }
      res.status(400).json({ message: "Données invalides." });
    }
  });

  // =============================================================================
  // ROUTES EXISTANTES (MISES À JOUR)
  // =============================================================================

  app.get("/api/admin/stats", requireStaff, async (req, res) => { // Renommé pour clarté, anciennement /api/auth/profile?
    try {
      const user = await storage.getUser(req.session.userId); // Utiliser l'ID de session
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé." }); // Traduit
      }
      // Exclure le mot de passe de la réponse
      const { password, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      console.error("Erreur récupération statistiques admin/profil utilisateur:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  });

  // User Management
  app.get("/api/users", requireAdmin, async (req, res) => { // Changé de requireAuth à requireAdmin
    try {
      const users = await storage.getUsers();
      res.json(users.map(u => ({ ...u, password: undefined }))); // Exclure les mots de passe
    } catch (error) {
      console.error("Erreur récupération utilisateurs:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
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
      const { password, ...userResponse } = user;
      res.status(201).json(userResponse);
    } catch (error: any) {
      console.error("Erreur création utilisateur:", error);
      if (error.code === '23505') { // Code d'erreur PostgreSQL pour violation d'unicité
        return res.status(409).json({ message: "Nom d'utilisateur ou email déjà existant." });
      }
      if (error.errors) { // Erreur Zod
        return res.status(400).json({ message: "Données invalides.", details: error.errors });
      }
      res.status(400).json({ message: "Données invalides." });
    }
  });

  // Orders (Enhanced)
  app.get("/api/orders", requireStaff, async (req, res) => { // Changé de requireAuth à requireStaff
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      console.error("Erreur récupération commandes:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  });

  app.post("/api/orders", requireAuth, async (req, res) => { // requireAuth pour que les clients puissent commander
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const subtotal = parseFloat(orderData.totalAmount); // Supposant que totalAmount est HT ici
      const { gstAmount, qstAmount, total } = calculateCanadianTaxes(subtotal);
      
      const order = await storage.createOrder({
        ...orderData,
        userId: req.session.userId, // Lier la commande à l'utilisateur connecté
        gstAmount: gstAmount.toString(),
        qstAmount: qstAmount.toString(),
        totalAmount: total.toString(), // totalAmount devient TTC
      });
      res.status(201).json(order);
    } catch (error: any) {
      console.error("Erreur création commande:", error);
      if (error.errors) {
        return res.status(400).json({ message: "Données invalides.", details: error.errors });
      }
      res.status(400).json({ message: "Données invalides." });
    }
  });

  app.put("/api/orders/:id", requireStaff, async (req, res) => { // Seul le staff peut modifier les commandes
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "ID de commande invalide." });
      const updates = insertOrderSchema.partial().parse(req.body);
      // Si totalAmount est mis à jour, recalculer les taxes
      if (updates.totalAmount && !updates.gstAmount && !updates.qstAmount) {
        const subtotal = parseFloat(updates.totalAmount); // Supposant que c'est le nouveau HT
        const { gstAmount, qstAmount, total } = calculateCanadianTaxes(subtotal);
        updates.gstAmount = gstAmount.toString();
        updates.qstAmount = qstAmount.toString();
        updates.totalAmount = total.toString();
      }
      const order = await storage.updateOrder(id, updates);
      
      if (!order) {
        return res.status(404).json({ message: "Commande non trouvée." });
      }
      res.json(order);
    } catch (error: any) {
      console.error("Erreur mise à jour commande:", error);
      if (error.errors) {
        return res.status(400).json({ message: "Données invalides.", details: error.errors });
      }
      res.status(400).json({ message: "Données invalides." });
    }
  });

  // Reservations
  app.get("/api/reservations", requireStaff, async (req, res) => { // Changé de requireAuth à requireStaff
    try {
      const reservations = await storage.getReservations();
      res.json(reservations);
    } catch (error) {
      console.error("Erreur récupération réservations:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  });

  app.get("/api/reservations/date/:date", async (req, res) => { // Endpoint public pour vérifier dispo? Sécuriser si besoin.
    try {
      const date = req.params.date;
      if (!date || isNaN(new Date(date).getTime())) {
        return res.status(400).json({ message: "Format de date invalide." });
      }
      const reservations = await storage.getReservationsByDate(date);
      res.json(reservations);
    } catch (error) {
      console.error("Erreur récupération réservations par date:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  });

  app.post("/api/reservations", async (req, res) => { // Endpoint public pour créer une réservation
    try {
      const reservationData = insertReservationSchema.parse(req.body);
      const confirmationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const reservation = await storage.createReservation({
        ...reservationData,
        userId: req.session?.userId || null, // Lier à l'utilisateur si connecté
        confirmationCode,
      });
      res.status(201).json(reservation);
    } catch (error: any) {
      console.error("Erreur création réservation:", error);
      if (error.errors) {
        return res.status(400).json({ message: "Données invalides.", details: error.errors });
      }
      res.status(400).json({ message: "Données invalides." });
    }
  });

  app.put("/api/reservations/:id", requireStaff, async (req, res) => { // Seul le staff peut modifier
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "ID de réservation invalide." });
      const updates = insertReservationSchema.partial().parse(req.body);
      const reservation = await storage.updateReservation(id, updates);
      
      if (!reservation) {
        return res.status(404).json({ message: "Réservation non trouvée." });
      }
      res.json(reservation);
    } catch (error: any) {
      console.error("Erreur mise à jour réservation:", error);
      if (error.errors) {
        return res.status(400).json({ message: "Données invalides.", details: error.errors });
      }
      res.status(400).json({ message: "Données invalides." });
    }
  });

  // Calendar Events
  app.get("/api/calendar/events", requireStaff, async (req, res) => { // Changé de requireAuth à requireStaff
    try {
      const { start, end } = req.query;
      
      if (start && end && typeof start === 'string' && typeof end === 'string') {
        if (isNaN(new Date(start).getTime()) || isNaN(new Date(end).getTime())) {
          return res.status(400).json({ message: "Format de date invalide pour 'start' ou 'end'." });
        }
        const events = await storage.getCalendarEventsByDateRange(start, end);
        res.json(events);
      } else {
        const events = await storage.getCalendarEvents();
        res.json(events);
      }
    } catch (error) {
      console.error("Erreur récupération événements calendrier:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  });

  app.post("/api/calendar/events", requireStaff, async (req, res) => { // Changé de requireAuth à requireStaff
    try {
      const eventData = insertCalendarEventSchema.parse(req.body);
      const event = await storage.createCalendarEvent({
        ...eventData,
        createdBy: req.session.userId,
      });
      res.status(201).json(event);
    } catch (error: any) {
      console.error("Erreur création événement calendrier:", error);
      if (error.errors) {
        return res.status(400).json({ message: "Données invalides.", details: error.errors });
      }
      res.status(400).json({ message: "Données invalides." });
    }
  });

  app.put("/api/calendar/events/:id", requireStaff, async (req, res) => { // Changé de requireAuth à requireStaff
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "ID d'événement invalide." });
      const updates = insertCalendarEventSchema.partial().parse(req.body);
      const event = await storage.updateCalendarEvent(id, updates);
      
      if (!event) {
        return res.status(404).json({ message: "Événement non trouvé." });
      }
      res.json(event);
    } catch (error: any) {
      console.error("Erreur mise à jour événement calendrier:", error);
      if (error.errors) {
        return res.status(400).json({ message: "Données invalides.", details: error.errors });
      }
      res.status(400).json({ message: "Données invalides." });
    }
  });

  app.delete("/api/calendar/events/:id", requireStaff, async (req, res) => { // Changé de requireAuth à requireStaff
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "ID d'événement invalide." });
      const deleted = await storage.deleteCalendarEvent(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Événement non trouvé." });
      }
      res.json({ message: "Événement supprimé avec succès." }); // Traduit
    } catch (error) {
      console.error("Erreur suppression événement calendrier:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  });

  // Financial Transactions
  app.get("/api/finance/transactions", requirePermission('view_financials'), async (req, res) => { // requirePermission
    try {
      const { start, end } = req.query;
      if (start && end && typeof start === 'string' && typeof end === 'string') {
        if (isNaN(new Date(start).getTime()) || isNaN(new Date(end).getTime())) {
          return res.status(400).json({ message: "Format de date invalide pour 'start' ou 'end'." });
        }
        const transactions = await storage.getFinancialTransactionsByDateRange(start, end);
        res.json(transactions);
      } else {
        const transactions = await storage.getFinancialTransactions();
        res.json(transactions);
      }
    } catch (error) {
      console.error("Erreur récupération transactions financières:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  });

  app.post("/api/finance/transactions", requirePermission('manage_financials'), async (req, res) => { // requirePermission
    try {
      const transactionData = insertFinancialTransactionSchema.parse(req.body);
      const transaction = await storage.createFinancialTransaction({
        ...transactionData,
        createdBy: req.session.userId,
      });
      res.status(201).json(transaction);
    } catch (error: any) {
      console.error("Erreur création transaction financière:", error);
      if (error.errors) {
        return res.status(400).json({ message: "Données invalides.", details: error.errors });
      }
      res.status(400).json({ message: "Données invalides." });
    }
  });

  // Canadian Accounting Endpoints
  app.get("/api/finance/summary", requirePermission('view_financials'), async (req, res) => { // requirePermission
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
      console.error("Erreur récupération sommaire financier:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  });

  app.post("/api/finance/calculate-taxes", requireStaff, async (req, res) => { // requireStaff ou une permission spécifique
    try {
      const { amount } = req.body;
      if (amount === undefined || isNaN(parseFloat(amount))) {
        return res.status(400).json({ message: "Montant invalide ou manquant." });
      }
      const taxes = calculateCanadianTaxes(parseFloat(amount));
      res.json(taxes);
    } catch (error) {
      console.error("Erreur calcul taxes:", error);
      res.status(400).json({ message: "Montant invalide." }); // Traduit
    }
  });

  // Festive Themes
  app.get("/api/themes", async (req, res) => { // Public
    try {
      const themes = await storage.getFestiveThemes();
      res.json(themes);
    } catch (error) {
      console.error("Erreur récupération thèmes:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  });

  app.get("/api/themes/active", async (req, res) => { // Public
    try {
      await updateThemeAutomatically(storage);
      const theme = await storage.getActiveFestiveTheme();
      res.json(theme);
    } catch (error) {
      console.error("Erreur récupération thème actif:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  });

  app.put("/api/themes/:id/activate", requireAdmin, async (req, res) => { // requireAdmin
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "ID de thème invalide." });
      
      const allThemes = await storage.getFestiveThemes();
      for (const theme of allThemes) {
        if (theme.isActive && theme.id !== id) { // Désactiver les autres
          await storage.updateFestiveTheme(theme.id, { isActive: false });
        }
      }
      
      const theme = await storage.updateFestiveTheme(id, { isActive: true });
      if (!theme) {
        return res.status(404).json({ message: "Thème non trouvé." });
      }
      res.json(theme);
    } catch (error) {
      console.error("Erreur activation thème:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  });

  app.post("/api/themes", requireAdmin, async (req, res) => { // requireAdmin
    try {
      const themeData = insertFestiveThemeSchema.parse(req.body);
      const theme = await storage.createFestiveTheme(themeData);
      res.status(201).json(theme);
    } catch (error: any) {
      console.error("Erreur création thème:", error);
      if (error.errors) {
        return res.status(400).json({ message: "Données invalides.", details: error.errors });
      }
      res.status(400).json({ message: "Données invalides." });
    }
  });

  // Loyalty Rewards
  app.get("/api/loyalty/rewards", requireAuth, async (req, res) => { // requireAuth pour que le client voie les récompenses ?
    try {
      const rewards = await storage.getLoyaltyRewards();
      res.json(rewards);
    } catch (error) {
      console.error("Erreur récupération récompenses fidélité:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  });

  app.post("/api/loyalty/rewards", requireAdmin, async (req, res) => { // requireAdmin
    try {
      const rewardData = insertLoyaltyRewardSchema.parse(req.body);
      const reward = await storage.createLoyaltyReward(rewardData);
      res.status(201).json(reward);
    } catch (error: any) {
      console.error("Erreur création récompense fidélité:", error);
      if (error.errors) {
        return res.status(400).json({ message: "Données invalides.", details: error.errors });
      }
      res.status(400).json({ message: "Données invalides." });
    }
  });

  // Inventory
  app.get("/api/inventory", requireStaff, async (req, res) => { // requireStaff
    try {
      const items = await storage.getInventoryItems();
      res.json(items);
    } catch (error) {
      console.error("Erreur récupération inventaire:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  });

  app.post("/api/inventory", requirePermission('manage_inventory'), async (req, res) => { // requirePermission
    try {
      const itemData = insertInventorySchema.parse(req.body);
      const item = await storage.createInventoryItem(itemData);
      res.status(201).json(item);
    } catch (error: any) {
      console.error("Erreur création article inventaire:", error);
      if (error.errors) {
        return res.status(400).json({ message: "Données invalides.", details: error.errors });
      }
      res.status(400).json({ message: "Données invalides." });
    }
  });

  // Dashboard Statistics
  // =============================================================================
  // HEALTH CHECK AND SYSTEM STATUS (déjà défini dans index.ts, mais /api/ping est ici)
  // =============================================================================
  
  // app.get("/api/health", ... ) // Est dans index.ts

  // =============================================================================
  // DASHBOARD STATS (ADMIN) - SÉCURISÉ ET AMÉLIORÉ
  // =============================================================================
  app.get("/api/dashboard/stats", requireStaff, async (req, res) => { // requireStaff pour l'accès au dashboard admin
    try {
      const today = new Date().toISOString().split('T')[0];
      const tomorrowDate = new Date();
      tomorrowDate.setDate(tomorrowDate.getDate() + 1);
      const tomorrow = tomorrowDate.toISOString().split('T')[0];
      
      const orders = await storage.getOrders();
      const todayOrders = orders.filter(order => 
        new Date(order.createdAt).toISOString().split('T')[0] === today
      );
      
      const todayRevenue = todayOrders.reduce((sum, order) => 
        sum + parseFloat(order.totalAmount || "0"), 0 // Utiliser 0 si totalAmount est null/undefined
      );
      
      const activeOrders = orders.filter(order => 
        ['pending', 'confirmed', 'preparing'].includes(order.status)
      ).length;
      
      const tomorrowReservations = await storage.getReservationsByDate(tomorrow);
      
      const users = await storage.getUsers?.() || []; // S'assurer que getUsers existe et retourne un tableau
      const totalLoyaltyPoints = users.reduce((sum, user) => sum + (user.loyaltyPoints || 0), 0);
      
      const unreadCustomerMessages = await storage.getUnreadCustomerMessages();
      
      const clients = await storage.getClients();
      const totalClients = clients.length;
      
      const quotes = await storage.getQuotes();
      const recentQuotes = quotes.slice(0, 5); // Prendre les 5 plus récents (supposant un tri par date décroissante en DB)
      
      res.json({
        todayRevenue: parseFloat(todayRevenue.toFixed(2)),
        activeOrders,
        tomorrowReservations: tomorrowReservations.length,
        totalLoyaltyPoints,
        unreadMessages: unreadCustomerMessages.length,
        totalClients,
        recentQuotesCount: recentQuotes.length, // Renommé pour clarté
      });
    } catch (error) {
      console.error("Erreur récupération statistiques dashboard:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
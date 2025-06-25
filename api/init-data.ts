import { storage } from "./storage";
import bcrypt from "bcrypt";

export async function initializeData() {
  try {
    // Vérifier si les données existent déjà
    const existingThemes = await storage.getFestiveThemes();
    if (existingThemes.length > 0) {
      console.log("✓ Données déjà initialisées");
      return;
    }

    // Créer le thème haïtien par défaut
    const haitianTheme = await storage.createFestiveTheme({
      name: "Haïti",
      nameEn: "Haiti",
      description: "Thème authentique haïtien avec couleurs du drapeau et culture traditionnelle",
      isActive: true,
      priority: 1,
      colors: {
        primary: "hsl(0, 84%, 55%)", // Rouge haïtien du drapeau
        secondary: "hsl(220, 100%, 50%)", // Bleu haïtien du drapeau
        accent: "hsl(45, 95%, 50%)", // Jaune/or des armoiries
        background: "hsl(50, 100%, 98%)", // Blanc pur
        surface: "hsl(0, 0%, 97%)", // Gris très clair
        text: "hsl(220, 25%, 15%)", // Bleu foncé
        muted: "hsl(220, 15%, 75%)" // Gris doux
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

    // Créer l'utilisateur administrateur
    const hashedPassword = await bcrypt.hash("admin123", 10);
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

    // Créer des éléments de menu typiquement haïtiens
    const menuItems = [
      {
        name: "Diri ak Djon Djon",
        nameEn: "Black Mushroom Rice",
        description: "Riz parfumé aux champignons noirs haïtiens, accompagné de légumes créoles et viande de choix",
        descriptionEn: "Fragrant rice with Haitian black mushrooms, served with Creole vegetables and choice meat",
        category: "Plats Principaux",
        price: "24.95",
        isAvailable: true,
        isFestive: true,
        festiveTheme: "Haïti",
        allergies: [],
        ingredients: ["riz", "champignons djon djon", "épices créoles", "légumes"],
        preparationTime: 35,
        calories: 450
      },
      {
        name: "Poisson Grillé aux Épices",
        nameEn: "Spiced Grilled Fish",
        description: "Poisson frais grillé aux épices caribéennes, sauce ti-malice",
        descriptionEn: "Fresh grilled fish with Caribbean spices and ti-malice sauce",
        category: "Fruits de Mer",
        price: "28.50",
        isAvailable: true,
        isFestive: true,
        festiveTheme: "Caraïbes",
        allergies: ["poisson"],
        ingredients: ["poisson frais", "épices caribéennes", "lime", "piments"],
        preparationTime: 25,
        calories: 380
      },
      {
        name: "Plantain Frit",
        nameEn: "Fried Plantain",
        description: "Banane plantain frite dorée, accompagnée de sauce épicée",
        descriptionEn: "Golden fried plantain served with spicy sauce",
        category: "Accompagnements",
        price: "8.95",
        isAvailable: true,
        isFestive: true,
        festiveTheme: "Caraïbes",
        allergies: [],
        ingredients: ["banane plantain", "huile", "épices"],
        preparationTime: 10,
        calories: 180
      },
      {
        name: "Accras de Morue",
        nameEn: "Cod Fritters",
        description: "Beignets de morue épicés, frits à la perfection",
        descriptionEn: "Spiced cod fritters, fried to perfection",
        category: "Entrées",
        price: "12.95",
        isAvailable: true,
        isFestive: true,
        festiveTheme: "Caraïbes",
        allergies: ["poisson", "gluten"],
        ingredients: ["morue", "farine", "épices", "piments"],
        preparationTime: 15,
        calories: 220
      },
      {
        name: "Punch au Rhum",
        nameEn: "Rum Punch",
        description: "Cocktail traditionnel des Caraïbes au rhum blanc et fruits tropicaux",
        descriptionEn: "Traditional Caribbean cocktail with white rum and tropical fruits",
        category: "Boissons",
        price: "14.50",
        isAvailable: true,
        isFestive: true,
        festiveTheme: "Caraïbes",
        allergies: [],
        ingredients: ["rhum blanc", "jus d'ananas", "jus de passion", "lime"],
        preparationTime: 5,
        calories: 180
      }
    ];

    for (const item of menuItems) {
      await storage.createMenuItem(item);
    }

    // Créer des événements de calendrier
    const now = new Date();
    const events = [
      {
        title: "Festival Caribéen",
        description: "Soirée spéciale avec musique live et plats traditionnels",
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
        description: "Formation sur les nouveaux plats caribéens",
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

    // Créer des éléments d'inventaire
    const inventoryItems = [
      {
        name: "Champignons Djon Djon",
        category: "Épices",
        currentStock: 50,
        minimumStock: 10,
        unit: "grammes",
        costPerUnit: "0.85",
        supplier: "Épicerie Tropicale Haïtienne",
        location: "Garde-manger"
      },
      {
        name: "Poisson Frais",
        category: "Protéines",
        currentStock: 25,
        minimumStock: 5,
        unit: "kilogrammes",
        costPerUnit: "18.50",
        supplier: "Poissonnerie Atlantique",
        location: "Réfrigérateur"
      },
      {
        name: "Bananes Plantain",
        category: "Légumes",
        currentStock: 100,
        minimumStock: 20,
        unit: "unités",
        costPerUnit: "0.75",
        supplier: "Marché Tropical",
        location: "Garde-manger"
      }
    ];

    for (const item of inventoryItems) {
      await storage.createInventoryItem(item);
    }

    // Créer une récompense de fidélité
    await storage.createLoyaltyReward({
      name: "Repas Haïtien Gratuit",
      description: "Un plat principal haïtien traditionnel offert",
      pointsCost: 500,
      rewardType: "free_item",
      value: "25.00",
      isActive: true,
      isFestive: true,
      festiveTheme: "Haïti",
      maxRedemptions: 100,
      validFrom: new Date().toISOString(),
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      conditions: {
        minimumOrderValue: 50,
        applicableCategories: ["Plats Principaux"]
      }
    });

    // Créer une annonce
    await storage.createAnnouncement({
      title: "Bienvenue chez Dounie Cuisine!",
      content: "Découvrez l'authenticité de la cuisine haïtienne dans notre restaurant. Goûtez nos spécialités traditionnelles préparées avec amour selon les recettes ancestrales!",
      type: "promotion",
      targetAudience: "public",
      isActive: true,
      priority: "high",
      createdBy: adminUser.id,
      validFrom: new Date().toISOString(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });

    // Créer des clients de test massifs
    const clientNames = [
      { firstName: "Marie", lastName: "Delorme", username: "marie.delorme", email: "marie.delorme@email.com" },
      { firstName: "Jean", lastName: "Baptiste", username: "jean.baptiste", email: "jean.baptiste@email.com" },
      { firstName: "Rose", lastName: "Charlot", username: "rose.charlot", email: "rose.charlot@email.com" },
      { firstName: "Pierre", lastName: "Moreau", username: "pierre.moreau", email: "pierre.moreau@email.com" },
      { firstName: "Sophie", lastName: "Dubois", username: "sophie.dubois", email: "sophie.dubois@email.com" },
      { firstName: "André", lastName: "Lafleur", username: "andre.lafleur", email: "andre.lafleur@email.com" },
      { firstName: "Claudine", lastName: "Germain", username: "claudine.germain", email: "claudine.germain@email.com" },
      { firstName: "Michel", lastName: "Vincent", username: "michel.vincent", email: "michel.vincent@email.com" },
      { firstName: "Francine", lastName: "Joseph", username: "francine.joseph", email: "francine.joseph@email.com" },
      { firstName: "Robert", lastName: "Sylvain", username: "robert.sylvain", email: "robert.sylvain@email.com" },
      { firstName: "Carla", lastName: "Denis", username: "carla.denis", email: "carla.denis@email.com" },
      { firstName: "Daniel", lastName: "Etienne", username: "daniel.etienne", email: "daniel.etienne@email.com" },
      { firstName: "Marlène", lastName: "Beauvais", username: "marlene.beauvais", email: "marlene.beauvais@email.com" },
      { firstName: "Patrick", lastName: "Léger", username: "patrick.leger", email: "patrick.leger@email.com" },
      { firstName: "Nicole", lastName: "Philippe", username: "nicole.philippe", email: "nicole.philippe@email.com" },
      { firstName: "Emmanuel", lastName: "César", username: "emmanuel.cesar", email: "emmanuel.cesar@email.com" },
      { firstName: "Vanessa", lastName: "Augustin", username: "vanessa.augustin", email: "vanessa.augustin@email.com" },
      { firstName: "François", lastName: "Moïse", username: "francois.moise", email: "francois.moise@email.com" },
      { firstName: "Diane", lastName: "Théodore", username: "diane.theodore", email: "diane.theodore@email.com" },
      { firstName: "Alain", lastName: "Guerrier", username: "alain.guerrier", email: "alain.guerrier@email.com" }
    ];

    const clientPassword = await bcrypt.hash("client123", 10);
    const createdClients = [];

    for (const client of clientNames) {
      const newClient = await storage.createUser({
        username: client.username,
        email: client.email,
        password: clientPassword,
        firstName: client.firstName,
        lastName: client.lastName,
        role: "client",
        phoneNumber: `+1-514-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        loyaltyPoints: Math.floor(Math.random() * 1000),
        preferences: {
          language: Math.random() > 0.5 ? "fr" : "en",
          notifications: true,
          theme: "haitian"
        },
        allergies: Math.random() > 0.7 ? ["gluten"] : []
      });
      createdClients.push(newClient);
    }

    // Créer des commandes de test pour simuler l'activité
    const orderStatuses = ["completed", "pending", "confirmed", "preparing", "ready"];
    const orderTypes = ["dine-in", "takeout", "delivery"];

    for (let i = 0; i < 150; i++) {
      const randomClient = createdClients[Math.floor(Math.random() * createdClients.length)];
      const orderDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      
      const orderItems = [
        { menuItemId: 1, quantity: Math.floor(Math.random() * 3) + 1, price: "24.95", customizations: [] },
        { menuItemId: 2, quantity: Math.floor(Math.random() * 2) + 1, price: "28.50", customizations: [] }
      ];

      const subtotal = orderItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
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
        specialRequests: Math.random() > 0.7 ? "Pas épicé" : null,
        estimatedReadyTime: new Date(orderDate.getTime() + 30 * 60 * 1000)
      });
    }

    // Créer des réservations de test
    for (let i = 0; i < 50; i++) {
      const randomClient = createdClients[Math.floor(Math.random() * createdClients.length)];
      const reservationDate = new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000);
      
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

    // Créer des employés supplémentaires
    const staffMembers = [
      { firstName: "Lucie", lastName: "Gervais", username: "lucie.manager", role: "manager" },
      { firstName: "Marc", lastName: "Dupont", username: "marc.staff", role: "staff" },
      { firstName: "Sarah", lastName: "Lapointe", username: "sarah.staff", role: "staff" },
      { firstName: "David", lastName: "Tremblay", username: "david.staff", role: "staff" }
    ];

    const staffPassword = await bcrypt.hash("staff123", 10);

    for (const staff of staffMembers) {
      await storage.createUser({
        username: staff.username,
        email: `${staff.username}@dounie-cuisine.com`,
        password: staffPassword,
        firstName: staff.firstName,
        lastName: staff.lastName,
        role: staff.role,
        phoneNumber: `+1-514-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        loyaltyPoints: 0,
        preferences: {
          language: "fr",
          notifications: true,
          theme: "haitian"
        },
        allergies: []
      });
    }

    console.log("✓ Données haïtiennes initialisées avec succès!");
    console.log("✓ Thème Haïti activé par défaut");
    console.log("✓ Utilisateur admin créé: admin / admin123");
    console.log(`✓ ${createdClients.length} clients de test créés (mot de passe: client123)`);
    console.log(`✓ ${staffMembers.length} employés créés (mot de passe: staff123)`);
    console.log("✓ 150 commandes de test créées");
    console.log("✓ 50 réservations de test créées");
    console.log("✓ Menu haïtien authentique ajouté");
    console.log("✓ Événements et inventaire initialisés");

  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation des données:", error);
    throw error;
  }
}
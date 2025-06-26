import { storage } from "./storage";
import bcrypt from "bcrypt";

export async function initializeData() {
  console.log("🚀 Initialisation des données Dounie Cuisine...");

  try {
    // Initialiser les permissions par rôle
    await initializeRolePermissions();
    
    // Initialiser les paramètres de l'entreprise
    await initializeCompanySettings();
    
    // Initialiser les utilisateurs par défaut
    await initializeDefaultUsers();
    
    // Initialiser les galeries par défaut
    await initializeDefaultGalleries();
    
    // Initialiser les pages de contenu
    await initializeContentPages();
    
    // Initialiser les données du menu (existant)
    await initializeMenuData();
    
    // Initialiser les thèmes festifs (existant)
    await initializeFestiveThemes();
    
    // Initialiser les annonces par défaut
    await initializeDefaultAnnouncements();

    console.log("✅ Initialisation terminée avec succès!");
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation:", error);
    throw error;
  }
}

async function initializeRolePermissions() {
  console.log("🔐 Initialisation des permissions par rôle...");
  
  const roles = [
    {
      roleName: 'admin',
      description: 'Administrateur système - Accès complet',
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
        view_staff: true,
      }
    },
    {
      roleName: 'manager',
      description: 'Manager - Gestion opérationnelle',
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
        view_staff: true,
      }
    },
    {
      roleName: 'staff',
      description: 'Personnel - Opérations de base',
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
        view_calendar: true,
      }
    },
    {
      roleName: 'client',
      description: 'Client - Accès limité',
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
        send_customer_messages: true,
      }
    }
  ];

  for (const role of roles) {
    const existingRole = await storage.getRolePermissionByName(role.roleName);
    if (!existingRole) {
      await storage.createRolePermission(role);
      console.log(`✅ Rôle créé: ${role.roleName}`);
    }
  }
}

async function initializeCompanySettings() {
  console.log("🏢 Initialisation des paramètres de l'entreprise...");
  
  const existingSettings = await storage.getCompanySettings();
  if (!existingSettings) {
    await storage.createCompanySettings({
      companyName: "Dounie Cuisine",
      address: "Montréal, QC, Canada",
      phoneNumber: "+1 (514) 123-4567",
      email: "contact@dounie-cuisine.ca",
      website: "https://dounie-cuisine.ca",
      logoUrl: "/images/logo-dounie.png",
      siret: "12345678901234",
      tvaNumber: "FR12345678901",
      salesPolicy: `## Politique de Vente - Dounie Cuisine

### Conditions Générales
- Toutes nos prestations sont soumises aux présentes conditions générales de vente
- Les prix sont indiqués en CAD, taxes comprises (TPS/TVQ)
- Un acompte de 30% est demandé à la confirmation de commande

### Modalités de Paiement
- Espèces, carte bancaire, virement bancaire acceptés
- Paiement de l'acompte à la commande
- Solde à régler le jour de la prestation

### Délais
- Commande minimale de 48h pour les prestations traiteur
- Commande minimale de 7 jours pour les événements importants (+ de 50 personnes)`,
      
      returnPolicy: `## Politique de Retour - Dounie Cuisine

### Produits Alimentaires
- Aucun retour possible sur les produits alimentaires frais pour des raisons sanitaires
- En cas de problème qualité, nous nous engageons à remplacer ou rembourser

### Annulation
- Annulation gratuite jusqu'à 24h avant la prestation
- Annulation entre 24h et 12h : 50% de l'acompte retenu
- Annulation moins de 12h avant : acompte non remboursable

### Réclamations
- Toute réclamation doit être formulée dans les 24h suivant la prestation
- Nous nous engageons à traiter toute réclamation dans les 48h`,
      
      cancellationPolicy: `## Politique d'Annulation - Dounie Cuisine

### Délais d'Annulation
1. **Plus de 7 jours avant** : Annulation gratuite, remboursement intégral
2. **Entre 7 et 3 jours avant** : Frais d'annulation de 25%
3. **Entre 3 jours et 24h avant** : Frais d'annulation de 50%
4. **Moins de 24h avant** : Frais d'annulation de 100%

### Cas Exceptionnels
- Force majeure (météo, urgence sanitaire) : remboursement intégral
- Maladie justifiée par certificat médical : remboursement à 75%

### Procédure
- Annulation par téléphone ou email
- Confirmation écrite de l'annulation envoyée par nos soins
- Remboursement sous 5 à 10 jours ouvrés`,
      
      termsOfService: `## Conditions Générales d'Utilisation - Dounie Cuisine

### Acceptation des Conditions
En utilisant nos services, vous acceptez les présentes conditions générales.

### Propriété Intellectuelle
Tous les contenus présents sur notre site sont protégés par le droit d'auteur.

### Protection des Données
Nous nous engageons à protéger vos données personnelles conformément au RGPD.

### Responsabilité
Notre responsabilité est limitée au montant de la prestation commandée.`,
      
      privacyPolicy: `## Politique de Confidentialité - Dounie Cuisine

### Collecte des Données
Nous collectons uniquement les données nécessaires à la fourniture de nos services.

### Utilisation des Données
- Traitement des commandes et réservations
- Communication commerciale (avec votre accord)
- Amélioration de nos services

### Vos Droits
Vous disposez d'un droit d'accès, de rectification et de suppression de vos données.

### Conservation
Vos données sont conservées 3 ans après votre dernière commande.

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
    console.log("✅ Paramètres d'entreprise initialisés");
  }
}

async function initializeDefaultUsers() {
  console.log("👥 Initialisation des utilisateurs par défaut...");
  
  const defaultUsers = [
    {
      username: "admin",
      email: "admin@dounie-cuisine.ca",
      password: "Admin123!",
      firstName: "Administrateur",
      lastName: "Système",
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
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
        phoneNumber: null,
        loyaltyPoints: 0,
        preferences: {
          language: 'fr',
          notifications: true,
          theme: 'haitian'
        },
        allergies: []
      });

      // Créer un employé pour les non-clients
      if (userData.role !== 'client') {
        await storage.createEmployee({
          userId: user.id,
          employeeId: `EMP${String(user.id).padStart(4, '0')}`,
          position: userData.role === 'admin' ? 'Administrateur' : 
                   userData.role === 'manager' ? 'Manager' : 'Staff',
          department: 'Administration',
          hireDate: new Date().toISOString().split('T')[0],
          hourlyRate: userData.role === 'admin' ? '35.00' : 
                     userData.role === 'manager' ? '25.00' : '18.00',
          isActive: true,
          certifications: [],
          availability: {},
          permissions: {}
        });
      }
      
      console.log(`✅ Utilisateur créé: ${userData.username}`);
    }
  }
}

async function initializeDefaultGalleries() {
  console.log("🖼️ Initialisation des galeries par défaut...");
  
  const galleries = [
    {
      name: "Plats Signature",
      description: "Nos créations culinaires emblématiques",
      isActive: true,
      sortOrder: 1
    },
    {
      name: "Événements",
      description: "Photos de nos prestations événementielles",
      isActive: true,
      sortOrder: 2
    },
    {
      name: "Cuisine en Action",
      description: "Nos chefs à l'œuvre",
      isActive: true,
      sortOrder: 3
    },
    {
      name: "Ambiance Restaurant",
      description: "L'atmosphère de notre établissement",
      isActive: true,
      sortOrder: 4
    }
  ];

  for (const gallery of galleries) {
    const existingGallery = await storage.getGalleries();
    const found = existingGallery.find(g => g.name === gallery.name);
    if (!found) {
      await storage.createGallery(gallery);
      console.log(`✅ Galerie créée: ${gallery.name}`);
    }
  }
}

async function initializeContentPages() {
  console.log("📄 Initialisation des pages de contenu...");
  
  const pages = [
    {
      slug: "faq",
      title: "Questions Fréquemment Posées",
      content: `# Questions Fréquemment Posées

## Commandes et Livraisons

### Quel est le délai minimum pour commander ?
Nous demandons un délai minimum de 48h pour les commandes standard et 7 jours pour les événements importants (plus de 50 personnes).

### Livrez-vous ?
Oui, nous livrons dans un rayon de 25km autour de Montréal. Des frais de livraison peuvent s'appliquer selon la distance.

### Peut-on personnaliser les menus ?
Absolument ! Nous adaptons nos menus selon vos goûts, allergies et restrictions alimentaires.

## Paiement

### Quels moyens de paiement acceptez-vous ?
Nous acceptons les espèces, cartes bancaires, virements bancaires et Interac.

### Quand dois-je payer ?
Un acompte de 30% est demandé à la confirmation, le solde étant dû le jour de la prestation.

## Allergies et Régimes

### Proposez-vous des options végétariennes/véganes ?
Oui, nous avons une large gamme de plats végétariens et végétaliens. Consultez notre section dédiée.

### Comment gérez-vous les allergies alimentaires ?
Nous prenons les allergies très au sérieux. Informez-nous lors de votre commande et nous adapterons la préparation.

## Annulations

### Puis-je annuler ma commande ?
Oui, selon notre politique d'annulation détaillée dans nos conditions générales.

### Que se passe-t-il en cas de force majeure ?
En cas de force majeure (météo, urgence sanitaire), nous remboursons intégralement.`,
      metaDescription: "Trouvez les réponses à vos questions sur nos services traiteur, livraisons, paiements et plus encore.",
      isActive: true,
      showInNavigation: true,
      sortOrder: 1
    },
    {
      slug: "about",
      title: "À Propos de Dounie Cuisine",
      content: `# À Propos de Dounie Cuisine

## Notre Histoire

Dounie Cuisine est née de la passion de créer des expériences culinaires mémorables qui célèbrent les saveurs authentiques des Caraïbes, avec une touche moderne et raffinée.

## Notre Mission

Nous nous engageons à :
- Offrir une cuisine authentique et de qualité supérieure
- Utiliser des ingrédients frais et locaux quand possible
- Créer des moments de partage et de convivialité
- Respecter les traditions culinaires caribéennes

## Notre Équipe

Notre équipe de chefs passionnés combine expertise traditionnelle et innovation culinaire pour vous offrir des plats exceptionnels.

## Nos Valeurs

- **Qualité** : Nous ne transigeons jamais sur la qualité de nos ingrédients et préparations
- **Authenticité** : Respect des recettes traditionnelles
- **Innovation** : Adaptation aux goûts contemporains
- **Service** : Excellence dans l'accueil et le service client

## Certifications

- Certification MAPAQ
- Certification sanitaire AAA
- Formation continue de l'équipe aux normes d'hygiène`,
      metaDescription: "Découvrez l'histoire, la mission et les valeurs de Dounie Cuisine, votre spécialiste de la cuisine caribéenne.",
      isActive: true,
      showInNavigation: true,
      sortOrder: 2
    },
    {
      slug: "contact",
      title: "Nous Contacter",
      content: `# Nous Contacter

## Coordonnées

**Adresse :** Montréal, QC, Canada
**Téléphone :** +1 (514) 123-4567
**Email :** contact@dounie-cuisine.ca

## Horaires d'Ouverture

**Lundi - Vendredi :** 9h00 - 19h00
**Samedi :** 10h00 - 18h00
**Dimanche :** 11h00 - 17h00

## Zone de Livraison

Nous livrons dans un rayon de 25km autour de Montréal :
- Montréal et arrondissements
- Laval
- Longueuil
- Brossard
- Saint-Lambert

## Nous Suivre

Restez connectés pour nos dernières créations et offres spéciales !

**Facebook :** @douinecuisine
**Instagram :** @dounie_cuisine
**Twitter :** @douinecuisine`,
      metaDescription: "Contactez Dounie Cuisine pour vos commandes et renseignements. Coordonnées, horaires et zone de livraison.",
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
      console.log(`✅ Page créée: ${page.title}`);
    }
  }
}

async function initializeMenuData() {
  console.log("🍽️ Initialisation des données du menu...");
  
  const menuCategories = {
    "plats-principaux": [
      {
        name: "Griot Traditionnel",
        nameEn: "Traditional Griot",
        description: "Porc mariné et frit, accompagné de riz collé aux pois rouges et de bananes plantains frites",
        descriptionEn: "Marinated and fried pork, served with rice and red beans and fried plantains",
        price: "18.50",
        imageUrl: "/images/menu/griot-traditionnel.jpg",
        preparationTime: 25,
        calories: 680,
        allergies: [],
        ingredients: ["porc", "riz", "pois rouges", "bananes plantains", "épices créoles"]
      },
      {
        name: "Poisson Gros Sel",
        nameEn: "Salt Fish",
        description: "Morue dessalée sautée aux légumes créoles, riz blanc et sauce ti-malice",
        descriptionEn: "Desalted cod sautéed with Creole vegetables, white rice and ti-malice sauce",
        price: "16.75",
        imageUrl: "/images/menu/poisson-gros-sel.jpg",
        preparationTime: 20,
        calories: 520,
        allergies: ["poisson"],
        ingredients: ["morue", "légumes créoles", "riz", "sauce ti-malice"]
      },
      {
        name: "Poulet Boucanné",
        nameEn: "Smoked Chicken",
        description: "Poulet mariné aux épices et grillé au feu de bois, accompagné de légumes racines",
        descriptionEn: "Chicken marinated with spices and grilled over wood fire, served with root vegetables",
        price: "17.25",
        imageUrl: "/images/menu/poulet-boucanne.jpg",
        preparationTime: 30,
        calories: 590,
        allergies: [],
        ingredients: ["poulet", "épices créoles", "légumes racines", "marinade"]
      }
    ],
    "entrees": [
      {
        name: "Accras de Morue",
        nameEn: "Cod Fritters",
        description: "Beignets de morue épicés, croustillants à l'extérieur et moelleux à l'intérieur",
        descriptionEn: "Spiced cod fritters, crispy outside and tender inside",
        price: "8.50",
        imageUrl: "/images/menu/accras-morue.jpg",
        preparationTime: 15,
        calories: 280,
        allergies: ["poisson", "gluten"],
        ingredients: ["morue", "farine", "épices", "huile"]
      },
      {
        name: "Boudin Créole",
        nameEn: "Creole Blood Sausage",
        description: "Boudin noir aux épices antillaises, accompagné de sauce piment",
        descriptionEn: "Black pudding with West Indian spices, served with hot sauce",
        price: "9.25",
        imageUrl: "/images/menu/boudin-creole.jpg",
        preparationTime: 12,
        calories: 320,
        allergies: [],
        ingredients: ["sang de porc", "épices créoles", "oignons", "piment"]
      }
    ],
    "desserts": [
      {
        name: "Blanc-Manger Coco",
        nameEn: "Coconut Blancmange",
        description: "Dessert crémeux à la noix de coco, parfumé à la vanille et cannelle",
        descriptionEn: "Creamy coconut dessert, flavored with vanilla and cinnamon",
        price: "6.50",
        imageUrl: "/images/menu/blanc-manger-coco.jpg",
        preparationTime: 10,
        calories: 220,
        allergies: ["lait"],
        ingredients: ["lait de coco", "vanille", "cannelle", "sucre"]
      },
      {
        name: "Tarte à la Patate Douce",
        nameEn: "Sweet Potato Pie",
        description: "Tarte crémeuse à la patate douce épicée, pâte sablée maison",
        descriptionEn: "Creamy spiced sweet potato pie with homemade shortbread crust",
        price: "7.75",
        imageUrl: "/images/menu/tarte-patate-douce.jpg",
        preparationTime: 15,
        calories: 310,
        allergies: ["gluten", "œufs", "lait"],
        ingredients: ["patate douce", "épices", "pâte sablée", "œufs", "crème"]
      }
    ],
    "boissons": [
      {
        name: "Jus de Fruit de la Passion",
        nameEn: "Passion Fruit Juice",
        description: "Jus naturel de fruit de la passion, rafraîchissant et vitaminé",
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
      const found = existingItems.find(existing => existing.name === item.name);
      
      if (!found) {
        await storage.createMenuItem({
          ...item,
          category,
          isAvailable: true,
          isFestive: false,
          festiveTheme: null
        });
        console.log(`✅ Plat ajouté: ${item.name}`);
      }
    }
  }
}

async function initializeFestiveThemes() {
  console.log("🎭 Initialisation des thèmes festifs...");
  
  const themes = [
    {
      name: "Haïtien Classique",
      nameEn: "Classic Haitian",
      description: "Thème traditionnel aux couleurs du drapeau haïtien",
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
        flag: "🇭🇹",
        food: "🍽️",
        celebration: "🎉"
      },
      priority: 1,
      recurringYearly: false
    },
    {
      name: "Carnaval",
      nameEn: "Carnival",
      description: "Thème festif pour la période du carnaval",
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
        mask: "🎭",
        music: "🎵",
        dance: "💃"
      },
      priority: 2,
      recurringYearly: true
    },
    {
      name: "Fête des Mères",
      nameEn: "Mother's Day",
      description: "Thème spécial pour la fête des mères",
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
        heart: "💝",
        flower: "🌸",
        love: "💖"
      },
      priority: 3,
      recurringYearly: true
    }
  ];

  for (const theme of themes) {
    const existingThemes = await storage.getFestiveThemes();
    const found = existingThemes.find(t => t.name === theme.name);
    
    if (!found) {
      await storage.createFestiveTheme(theme);
      console.log(`✅ Thème créé: ${theme.name}`);
    }
  }
}

async function initializeDefaultAnnouncements() {
  console.log("📢 Initialisation des annonces par défaut...");
  
  const adminUser = await storage.getUserByEmail("admin@dounie-cuisine.ca");
  const adminId = adminUser?.id || 1;
  
  const announcements = [
    {
      title: "Bienvenue chez Dounie Cuisine!",
      content: "Découvrez nos spécialités caribéennes authentiques et nos services traiteur pour tous vos événements.",
      type: "info",
      priority: "normal",
      position: "banner",
      targetAudience: "all",
      isActive: true,
      startDate: new Date(),
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
      content: "Demandez facilement un devis personnalisé pour vos événements directement depuis notre interface.",
      type: "success",
      priority: "high",
      position: "modal",
      targetAudience: "customers",
      isActive: true,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
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

  for (const announcement of announcements) {
    const existingAnnouncements = await storage.getAnnouncements();
    const found = existingAnnouncements.find(a => a.title === announcement.title);
    
    if (!found) {
      await storage.createAnnouncement(announcement);
      console.log(`✅ Annonce créée: ${announcement.title}`);
    }
  }
}
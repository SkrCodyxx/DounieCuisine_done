import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import session from "express-session";
import MemoryStore from "memorystore";
import { registerRoutes } from "./routes";
import { initializeData } from "./init-data";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

const MemStore = MemoryStore(session);

// Configuration CORS pour permettre l'accès depuis les apps frontend
app.use(cors({
  origin: [
    'http://localhost:5173', // Administration
    'http://localhost:5174', // Site public
    'http://localhost:3000', // Alternative port
    'http://localhost:3001', // Alternative port
  ],
  credentials: true
}));

// Parse middlewares AVANT session
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session configuration (APRÈS les parsers selon le plan de correction)
app.use(session({
  secret: process.env.SESSION_SECRET || 'dounie-cuisine-session-secret-key-2024',
  resave: false, // Optimisation: false si le store supporte touch() (memorystore le fait)
  saveUninitialized: false, // RGPD: ne pas créer de session/cookie avant interaction significative
  name: 'connect.sid',
  store: new MemStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production', // true en production (HTTPS)
    httpOnly: true, // Empêche l'accès au cookie via JavaScript côté client
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax' // Protection CSRF basique
  }
}));

// Health check endpoint (toujours accessible)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Route /api/status pour les tests système (toujours accessible)
app.get('/api/status', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Ajout d'un endpoint /api/ping pour compatibilité avec les tests
app.get('/api/ping', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
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
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

// Importer WebSocket (ws) - décommenter une fois la dépendance installée
// import WebSocket, { WebSocketServer } from 'ws';
// import { type Server as HttpServer } from 'http';

// Map pour stocker les connexions WebSocket actives par userId
// const activeConnections = new Map<string, WebSocket>(); // Décommenter

(async () => {
  const httpServer = await registerRoutes(app); // registerRoutes retourne maintenant le serveur HTTP

  // Initialisation du serveur WebSocket - décommenter et adapter une fois 'ws' installé
  /*
  const wss = new WebSocketServer({ server: httpServer });

  wss.on('connection', (ws, req) => {
    // Extraire userId de l'URL (ex: /ws?userId=123)
    const urlParams = new URLSearchParams(req.url?.split('?')[1] || '');
    const userId = urlParams.get('userId');

    if (!userId) {
      console.log('Tentative de connexion WebSocket sans userId. Fermeture.');
      ws.terminate();
      return;
    }

    console.log(`Client WebSocket connecté: userId ${userId}`);
    activeConnections.set(userId, ws);

    ws.on('message', (message) => {
      // Gérer les messages entrants du client si nécessaire
      console.log(`Message reçu de ${userId}: ${message}`);
      // Exemple: ws.send(`Message reçu: ${message}`);
    });

    ws.on('close', () => {
      console.log(`Client WebSocket déconnecté: userId ${userId}`);
      activeConnections.delete(userId);
    });

    ws.on('error', (error) => {
      console.error(`Erreur WebSocket pour userId ${userId}:`, error);
      activeConnections.delete(userId); // S'assurer de nettoyer en cas d'erreur
    });
  });
  console.log('Serveur WebSocket initialisé et attaché au serveur HTTP.');
  */

  // Middleware de gestion des erreurs (doit être après les routes)
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Erreur Interne du Serveur"; // Traduit
    console.error("Erreur globale API:", err); // Log de l'erreur serveur
    res.status(status).json({ message });
    // Ne pas utiliser `throw err;` ici car cela peut arrêter le serveur ou causer des problèmes
    // avec certains gestionnaires d'erreurs globaux (ex: PM2) si non géré correctement plus haut.
  });

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = process.env.PORT || 5000;
  httpServer.listen({ // Utiliser httpServer ici
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    console.log(`API et serveur HTTP en écoute sur le port ${port}`); // Message mis à jour
    // Si wss est initialisé: console.log(`Serveur WebSocket également en écoute sur le port ${port}`);
  });
})();

// Fonction pour envoyer un message à un utilisateur spécifique via WebSocket - à exporter/utiliser dans routes.ts
// export function sendWebSocketMessage(userId: string, message: object) { // Décommenter
//   const ws = activeConnections.get(userId.toString()); // Assurer que userId est une chaîne si la clé est une chaîne
//   if (ws && ws.readyState === WebSocket.OPEN) {
//     ws.send(JSON.stringify(message));
//     console.log(`Message WebSocket envoyé à userId ${userId}:`, message);
//     return true;
//   }
//   console.log(`Aucune connexion WebSocket active trouvée pour userId ${userId} ou connexion non ouverte.`);
//   return false;
// }
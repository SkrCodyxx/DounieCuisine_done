# Architecture du Système Dounie Cuisine

## Vue d'Ensemble

Le système Dounie Cuisine est une application web fullstack conçue pour la gestion d'un service traiteur et d'organisation d'événements. Elle se compose de trois principaux composants :

1.  **API Backend**: Un serveur Node.js utilisant Express.js et TypeScript, responsable de la logique métier, de la gestion des données et de la communication avec la base de données.
2.  **Interface d'Administration**: Une application frontend React (buildée avec Vite) permettant au personnel de Dounie Cuisine de gérer tous les aspects de l'activité (clients, commandes, menus, événements, etc.).
3.  **Site Public**: Une application frontend React (buildée avec Vite) destinée aux clients, leur permettant de consulter les menus, demander des devis, faire des réservations et contacter l'entreprise.

## Diagramme d'Architecture (Conceptuel)

```mermaid
graph TD
    UtilisateurClient[Client Web / Mobile] -->|HTTPS| Nginx[Nginx Reverse Proxy / Serveur Statique];
    UtilisateurAdmin[Administrateur / Employé] -->|HTTPS| Nginx;

    Nginx --> AppPublic[Application Publique React];
    Nginx --> AppAdmin[Interface Administration React];
    Nginx -->|/api| APIBackend[API Backend Node.js/Express];

    subgraph "Serveur Applicatif"
        APIBackend -->|TCP/IP| PostgreSQL[Base de Données PostgreSQL];
        APIBackend -->|WebSocket (ws)| MessagingService[Service de Messagerie WebSocket];
    end

    AppPublic -->|HTTP API Calls| APIBackend;
    AppAdmin -->|HTTP API Calls| APIBackend;
    AppAdmin -->|WebSocket (ws)| MessagingService;

    style UtilisateurClient fill:#f9f,stroke:#333,stroke-width:2px;
    style UtilisateurAdmin fill:#f9f,stroke:#333,stroke-width:2px;
    style Nginx fill:#ccf,stroke:#333,stroke-width:2px;
    style AppPublic fill:#9cf,stroke:#333,stroke-width:2px;
    style AppAdmin fill:#9cf,stroke:#333,stroke-width:2px;
    style APIBackend fill:#f69,stroke:#333,stroke-width:2px;
    style MessagingService fill:#f69,stroke:#333,stroke-width:2px;
    style PostgreSQL fill:#99c,stroke:#333,stroke-width:2px;
```

## Composants Détaillés

### 1. API Backend

*   **Framework**: Node.js avec Express.js
*   **Langage**: TypeScript
*   **Base de Données**: PostgreSQL
*   **ORM/Query Builder**: Utilisation de Drizzle ORM ou d'un query builder SQL léger (basé sur les fichiers `storage-db.ts` et `schema.ts`).
*   **Authentification**: Système basé sur les sessions (`express-session`) avec hachage des mots de passe (bcrypt).
*   **Gestion des Rôles/Permissions**: Mécanisme de rôles (admin, manager, staff, client) avec des middlewares pour protéger les routes. Un système de permissions plus granulaire est en place côté API et peut être géré via l'interface d'administration.
*   **Messagerie Temps Réel**: Prévu via WebSockets (bibliothèque `ws`) pour la communication interne et les notifications. Nécessite l'installation de la dépendance `ws`.
*   **Validation des Données**: Utilisation de Zod pour la validation des schémas de données en entrée de l'API.
*   **Structure des Routes**: Organisée dans `api/routes.ts`, couvrant toutes les fonctionnalités de l'application.
*   **Variables d'environnement**: Gérées via un fichier `.env` (voir `docs/deployment_guide.md`).

### 2. Interface d'Administration

*   **Framework**: React 18 avec TypeScript
*   **Outil de Build**: Vite
*   **Styling**: Tailwind CSS, complété par des composants Shadcn/UI.
*   **Gestion d'État Client**: TanStack Query (`@tanstack/react-query`) pour le data fetching et la mise en cache des données serveur. Contexte React pour l'état global (ex: authentification, thème).
*   **Routage**: `wouter`
*   **Fonctionnalités**: Gestion complète des clients, devis, commandes, réservations, menu, galeries, contenu des pages publiques, annonces, personnel, calendrier interne, inventaire, transactions financières, paramètres système, messagerie interne.
*   **Authentification**: Interagit avec l'API pour la connexion/déconnexion.
*   **Variables d'environnement**: Gérées via `.env` avec le préfixe `VITE_` (voir `docs/deployment_guide.md`).

### 3. Site Public

*   **Framework**: React 18 avec TypeScript
*   **Outil de Build**: Vite
*   **Styling**: Tailwind CSS, composants Shadcn/UI, et thèmes personnalisés (`haitian-theme.css`, `caribbean-theme.css` - en cours de refonte pour un style "Caraïbes Pro").
*   **Gestion d'État Client**: TanStack Query, Contexte React.
*   **Routage**: `wouter`
*   **Fonctionnalités**: Consultation du menu, informations sur les services traiteur et événementiels, galerie photos, formulaire de contact, système de réservation d'événements, création de compte et connexion client.
*   **Variables d'environnement**: Gérées via `.env` avec le préfixe `VITE_` (voir `docs/deployment_guide.md`).

## Communication Inter-Composants

*   **Frontend <-> Backend**: Les applications frontend communiquent avec l'API Backend via des appels HTTP RESTful (principalement JSON). TanStack Query est utilisé côté client pour gérer ces interactions.
*   **Temps Réel**: La messagerie interne (et potentiellement d'autres notifications) utilisera des WebSockets pour une communication bidirectionnelle entre le client (interface d'administration) et le serveur API.

## Base de Données

*   **Type**: PostgreSQL
*   **Schéma**: Défini dans `api/shared/schema.ts` (utilisant Drizzle ORM ou un format compatible). Comprend des tables pour les utilisateurs, clients, produits du menu, commandes, réservations, devis, galeries, contenu CMS, messages, etc.
*   **Accès**: Géré par `api/storage-db.ts` qui implémente l'interface `IStorage`.

## Déploiement (Conceptuel)

*   **Reverse Proxy**: Nginx est recommandé pour gérer les requêtes entrantes, servir les applications frontend statiques, et faire le reverse proxy vers l'API Node.js. Il gère également la terminaison SSL.
*   **Process Management (API)**: PM2 ou Supervisor sont recommandés pour gérer le processus Node.js de l'API en production.
*   **Base de Données**: Hébergée sur un serveur PostgreSQL dédié ou un service managé.
*   **Builds Frontend**: Les applications React sont buildées en fichiers statiques (HTML, CSS, JS) et servies par Nginx.

Pour plus de détails sur le déploiement et la configuration, voir `docs/deployment_guide.md`.
Pour la référence API, voir `docs/api_reference.md`.
Pour le guide de développement, voir `docs/development_guide.md`.

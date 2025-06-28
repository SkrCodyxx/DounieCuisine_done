# Guide de Développement Dounie Cuisine

Ce guide fournit les instructions nécessaires pour configurer l'environnement de développement local, builder et lancer les différents modules du projet Dounie Cuisine.

## Prérequis

Avant de commencer, assurez-vous d'avoir les outils suivants installés sur votre système :

*   **Node.js**: Version LTS recommandée (par exemple, 18.x ou 20.x).
*   **npm** (généralement inclus avec Node.js) ou **yarn**. Ce guide utilisera `npm`.
*   **PostgreSQL**: Version 14 ou supérieure.
*   **Git**: Pour cloner le projet.
*   Un éditeur de code (ex: VS Code).

## 1. Configuration Initiale

### a. Cloner le Projet
```bash
git clone <URL_DU_REPOSITORY_GIT> dounie-cuisine
cd dounie-cuisine
```

### b. Base de Données PostgreSQL
Assurez-vous que votre serveur PostgreSQL est en cours d'exécution.
Créez un utilisateur et une base de données pour le projet si ce n'est pas déjà fait. Par exemple, avec psql :
```sql
CREATE USER dounie_dev_user WITH PASSWORD 'votre_mot_de_passe_dev';
CREATE DATABASE dounie_cuisine_dev OWNER dounie_dev_user;
```
**Note:** Adaptez les noms d'utilisateur, mot de passe et base de données selon vos besoins et mettez à jour le fichier `.env` de l'API en conséquence.

## 2. Configuration des Modules

Le projet est divisé en trois modules principaux : `api`, `administration` (frontend admin), et `public` (frontend public). Chacun a ses propres dépendances et scripts.

### a. API Backend (`api/`)

1.  **Navigation**:
    ```bash
    cd api
    ```
2.  **Variables d'Environnement**:
    Copiez le fichier `.env.example` (s'il existe) en `.env` et configurez-le :
    ```bash
    cp .env.example .env
    # Ouvrez .env et modifiez les valeurs
    ```
    Variables clés pour le développement :
    *   `DATABASE_URL=postgresql://dounie_dev_user:votre_mot_de_passe_dev@localhost:5432/dounie_cuisine_dev`
    *   `SESSION_SECRET=un_secret_pour_le_developpement_peut_etre_simple`
    *   `NODE_ENV=development`
    *   `PORT=5000`
    *   `CORS_ORIGIN_ADMIN=http://localhost:5173` (ou le port de votre frontend admin)
    *   `CORS_ORIGIN_PUBLIC=http://localhost:5174` (ou le port de votre frontend public)
    *   `WEBSOCKET_PORT=5000` (ou un port dédié si configuré différemment)
3.  **Installer les Dépendances**:
    ```bash
    npm install
    ```
    *Important : Pour la fonctionnalité de messagerie temps réel, la bibliothèque `ws` est requise. Si elle n'est pas listée dans `package.json` ou si vous rencontrez des erreurs, installez-la :*
    ```bash
    npm install ws
    npm install --save-dev @types/ws
    ```
4.  **Appliquer le Schéma de Base de Données**:
    Si vous utilisez Drizzle ORM (ou un équivalent configuré dans le projet) pour gérer le schéma :
    ```bash
    npm run db:push
    ```
    Cela devrait créer les tables dans votre base de données de développement. Consultez `api/package.json` pour les scripts exacts liés à la base de données.
5.  **Lancer l'API en Mode Développement**:
    ```bash
    npm run dev
    ```
    L'API devrait maintenant être accessible sur `http://localhost:5000` (ou le port configuré).

### b. Frontend Administration (`administration/`)

1.  **Navigation**:
    Depuis la racine du projet :
    ```bash
    cd administration
    ```
2.  **Variables d'Environnement**:
    Créez un fichier `.env` à la racine de `administration/` et configurez-le :
    *   `VITE_API_URL=http://localhost:5000/api`
    *   `VITE_WS_URL=ws://localhost:5000`
    *   `VITE_APP_NAME="Dounie Cuisine Administration (Dev)"`
3.  **Installer les Dépendances**:
    ```bash
    npm install
    ```
4.  **Lancer en Mode Développement**:
    ```bash
    npm run dev
    ```
    L'application d'administration devrait être accessible sur `http://localhost:5173` (port par défaut de Vite, peut varier).

### c. Frontend Public (`public/`)

1.  **Navigation**:
    Depuis la racine du projet :
    ```bash
    cd public
    ```
2.  **Variables d'Environnement**:
    Créez un fichier `.env` à la racine de `public/` et configurez-le :
    *   `VITE_API_URL=http://localhost:5000/api`
    *   `VITE_WS_URL=ws://localhost:5000`
    *   `VITE_APP_NAME="Dounie Cuisine (Dev)"`
3.  **Installer les Dépendances**:
    ```bash
    npm install
    ```
4.  **Lancer en Mode Développement**:
    ```bash
    npm run dev
    ```
    Le site public devrait être accessible sur `http://localhost:5174` (port par défaut de Vite, peut varier).

## 3. Scripts NPM Utiles

Consultez les fichiers `package.json` de chaque module (`api`, `administration`, `public`) pour la liste complète des scripts. Voici les plus courants :

*   **`npm run dev`**: Lance le serveur de développement avec hot-reloading.
*   **`npm run build`**: Compile l'application pour la production (génère un dossier `dist/`).
*   **`npm run start`** (pour l'API) : Démarre l'application buildée (utilisé en production).
*   **`npm run preview`** (pour les frontends Vite) : Permet de prévisualiser le build de production localement.
*   **`npm run lint`** (si configuré) : Lance l'analyse statique du code.
*   **`npm run db:push`** (pour l'API, si Drizzle est utilisé) : Applique les changements de schéma à la base de données.

## 4. Conventions de Code (Suggestions)

Bien que non formellement définies dans les fichiers explorés, voici quelques conventions courantes pour des projets TypeScript/React :

*   **Nommage**:
    *   Composants React : `PascalCase` (ex: `MonComposant.tsx`)
    *   Variables et fonctions : `camelCase` (ex: `maVariable`, `maFonction`)
    *   Types et interfaces : `PascalCase` (ex: `type MonType = ...`)
*   **Structure des Dossiers**: Maintenir une structure logique (ex: `components/`, `pages/`, `hooks/`, `lib/`, `services/`).
*   **Imports**: Utiliser les alias de chemin configurés (`@/components/...`) pour des imports plus propres. Organiser les imports (par exemple, modules React en premier, puis modules npm, puis imports locaux).
*   **Typage**: Utiliser TypeScript de manière rigoureuse. Définir des types et interfaces clairs pour les props, les états, et les données API.
*   **Commentaires**: Commenter le code complexe ou les décisions de conception importantes.
*   **Formatage**: Utiliser un formateur de code comme Prettier pour maintenir un style de code cohérent.

## 5. Débogage

*   **Frontend**: Utilisez les outils de développement de votre navigateur (inspecteur, console, onglet réseau). React Developer Tools est une extension très utile.
*   **API Backend**: Utilisez le debugger de Node.js intégré à votre éditeur de code (VS Code a d'excellentes capacités de débogage Node.js). Les `console.log` peuvent aussi être utiles pour un débogage rapide. Les logs de PM2 ou Supervisor sont essentiels en production.

## 6. Contribuer

(Cette section peut être développée si le projet est destiné à avoir plusieurs contributeurs)
*   Processus de création de branche.
*   Convention de nommage des commits.
*   Processus de Pull Request / Merge Request.
*   Exigences pour les tests (si applicables).

# Référence API Dounie Cuisine

Cette page documente les principaux endpoints de l'API Backend de Dounie Cuisine.
L'URL de base de l'API est typiquement `http://localhost:5000/api` en développement, ou `https://votredomaine.com/api` en production.

## Authentification & Profil

*   `POST /api/auth/login`
    *   **Description**: Connecte un utilisateur existant.
    *   **Corps (JSON)**: `{ "username": "...", "password": "..." }`
    *   **Réponse**: Informations utilisateur (sans mot de passe) et mise en place d'un cookie de session.
*   `POST /api/auth/logout`
    *   **Description**: Déconnecte l'utilisateur actuel (détruit la session).
    *   **Réponse**: Message de succès.
*   `POST /api/auth/register`
    *   **Description**: Inscrit un nouveau client.
    *   **Corps (JSON)**: `{ "username": "...", "email": "...", "password": "...", "firstName": "...", "lastName": "..." }` (et autres champs optionnels)
    *   **Réponse**: Informations du nouvel utilisateur créé.
*   `GET /api/auth/current-user`
    *   **Description**: Récupère le profil de l'utilisateur actuellement authentifié via la session.
    *   **Authentification**: Requise.
    *   **Réponse**: Informations utilisateur.
*   `PUT /api/auth/profile`
    *   **Description**: Permet à l'utilisateur authentifié de mettre à jour son propre profil.
    *   **Authentification**: Requise.
    *   **Corps (JSON)**: Champs partiels de l'utilisateur à mettre à jour (ex: `{ "firstName": "...", "email": "..." }`).
    *   **Réponse**: Informations utilisateur mises à jour.

## Réinitialisation de Mot de Passe

*   `POST /api/admin/generate-password-reset`
    *   **Description**: (Admin) Génère un code de réinitialisation de mot de passe pour un utilisateur spécifié par email.
    *   **Authentification**: Admin requise.
    *   **Corps (JSON)**: `{ "email": "user@example.com" }`
    *   **Réponse**: Code de réinitialisation, date d'expiration, instructions.
*   `GET /api/admin/password-reset-codes`
    *   **Description**: (Admin) Liste les codes de réinitialisation actifs.
    *   **Authentification**: Admin requise.
*   `POST /api/auth/verify-reset-code`
    *   **Description**: Vérifie la validité d'un code de réinitialisation.
    *   **Corps (JSON)**: `{ "code": "XYZ123" }`
    *   **Réponse**: Statut de validité et informations utilisateur associées si valide.
*   `POST /api/auth/reset-password`
    *   **Description**: Réinitialise le mot de passe d'un utilisateur avec un code valide.
    *   **Corps (JSON)**: `{ "code": "XYZ123", "newPassword": "..." }`
    *   **Réponse**: Message de succès.

## Gestion Utilisateurs & Permissions (Admin)

*   `GET /api/users`
    *   **Description**: (Admin) Liste tous les utilisateurs du système.
    *   **Authentification**: Admin requise.
*   `POST /api/users`
    *   **Description**: (Admin) Crée un nouvel utilisateur (employé, manager, etc.).
    *   **Authentification**: Admin requise.
    *   **Corps (JSON)**: Données complètes de l'utilisateur, y compris le rôle.
*   `GET /api/admin/role-permissions`
    *   **Description**: (Admin) Liste tous les rôles et leurs permissions associées.
    *   **Authentification**: Admin requise.
*   `POST /api/admin/role-permissions`
    *   **Description**: (Admin) Crée un nouveau rôle avec ses permissions.
    *   **Authentification**: Admin requise.
    *   **Corps (JSON)**: `{ "roleName": "...", "permissions": { "view_dashboard": true, ... } }`
*   `PUT /api/admin/role-permissions/:id`
    *   **Description**: (Admin) Modifie un rôle existant ou ses permissions.
    *   **Authentification**: Admin requise.

## Gestion des Clients (Staff/Admin)

*   `GET /api/clients`
    *   **Description**: Liste les clients. Peut inclure un query param `search` pour filtrer.
    *   **Authentification**: Staff requise.
*   `POST /api/clients`
    *   **Description**: Crée un nouveau client.
    *   **Authentification**: Staff requise.
*   `GET /api/clients/:id`
    *   **Description**: Récupère les détails d'un client spécifique.
    *   **Authentification**: Staff requise.
*   `PUT /api/clients/:id`
    *   **Description**: Met à jour un client.
    *   **Authentification**: Staff requise.
*   `DELETE /api/clients/:id`
    *   **Description**: (Admin) Supprime un client.
    *   **Authentification**: Admin requise.

## Paramètres de l'Entreprise (Admin)

*   `GET /api/company-settings`
    *   **Description**: Récupère les paramètres de l'entreprise.
    *   **Authentification**: (Devrait être Admin, à vérifier)
*   `PUT /api/company-settings`
    *   **Description**: Met à jour les paramètres de l'entreprise. Crée les paramètres s'ils n'existent pas.
    *   **Authentification**: Admin requise.

## Gestion des Devis (Staff/Admin)

*   `GET /api/quotes`
    *   **Description**: Liste les devis. Peut inclure `clientId` en query param.
    *   **Authentification**: Staff requise.
*   `POST /api/quotes`
    *   **Description**: Crée un nouveau devis.
    *   **Authentification**: Staff requise.
*   `GET /api/quotes/:id`
    *   **Description**: Détails d'un devis.
    *   **Authentification**: Staff requise.
*   `PUT /api/quotes/:id`
    *   **Description**: Modifie un devis.
    *   **Authentification**: Staff requise.
*   `POST /api/quotes/:id/send`
    *   **Description**: Marque un devis comme envoyé et met à jour sa date d'envoi.
    *   **Authentification**: Staff requise.
*   `DELETE /api/quotes/:id`
    *   **Description**: (Admin) Supprime un devis.
    *   **Authentification**: Admin requise.

## Gestion des Galeries (Permission `manage_galleries`)

*   `GET /api/galleries`
    *   **Description**: Liste les galeries (publiques par défaut, accès admin pour toutes).
*   `POST /api/galleries`
    *   **Description**: Crée une galerie.
    *   **Authentification**: Permission `manage_galleries` requise.
*   `PUT /api/galleries/:id`
    *   **Description**: Modifie une galerie.
    *   **Authentification**: Permission `manage_galleries` requise.
*   `DELETE /api/galleries/:id`
    *   **Description**: Supprime une galerie.
    *   **Authentification**: Permission `manage_galleries` requise.
*   `GET /api/gallery-images`
    *   **Description**: Liste les images. Peut être filtré par `galleryId`.
*   `POST /api/gallery-images`
    *   **Description**: Ajoute une image à une galerie.
    *   **Authentification**: Permission `manage_galleries` requise.
*   `PUT /api/gallery-images/:id`
    *   **Description**: Modifie une image.
    *   **Authentification**: Permission `manage_galleries` requise.
*   `DELETE /api/gallery-images/:id`
    *   **Description**: Supprime une image.
    *   **Authentification**: Permission `manage_galleries` requise.

## Gestion des Pages de Contenu (Permission `manage_content`)

*   `GET /api/content-pages`
    *   **Description**: Liste toutes les pages de contenu (publiques par défaut).
*   `POST /api/content-pages`
    *   **Description**: Crée une nouvelle page de contenu.
    *   **Authentification**: Permission `manage_content` requise.
*   `GET /api/content-pages/:slug`
    *   **Description**: Récupère une page par son slug (pour affichage public).
*   `PUT /api/content-pages/:id`
    *   **Description**: Modifie une page de contenu.
    *   **Authentification**: Permission `manage_content` requise.
*   `DELETE /api/content-pages/:id`
    *   **Description**: Supprime une page de contenu.
    *   **Authentification**: Permission `manage_content` requise.

## Messages Clients (Formulaire de Contact)

*   `GET /api/customer-messages`
    *   **Description**: (Staff) Liste les messages reçus. Peut être filtré par `unread=true`.
    *   **Authentification**: Staff requise.
*   `POST /api/customer-messages`
    *   **Description**: (Public) Endpoint pour le formulaire de contact public.
*   `PUT /api/customer-messages/:id`
    *   **Description**: (Staff) Met à jour un message (ex: marquer comme lu).
    *   **Authentification**: Staff requise.

## Messagerie Interne (Employés authentifiés)

*   `GET /api/internal-messages`
    *   **Description**: Liste les messages de l'utilisateur (reçus par défaut, ou envoyés avec `type=sent`).
    *   **Authentification**: Requise.
*   `POST /api/internal-messages`
    *   **Description**: Envoie un message interne à un autre employé ou à tous.
    *   **Authentification**: Requise.
*   `PUT /api/internal-messages/:id`
    *   **Description**: Met à jour un message (ex: marquer comme lu).
    *   **Authentification**: Requise (vérifie que l'utilisateur est le destinataire).
*   `DELETE /api/internal-messages/:id`
    *   **Description**: Marque un message comme supprimé pour l'expéditeur ou le destinataire.
    *   **Authentification**: Requise.

## Messagerie Client (Staff <-> Client)

*   `GET /api/client-messages`
    *   **Description**: (Staff) Liste les conversations. Peut être filtré par `clientId`.
    *   **Authentification**: Staff requise.
*   `POST /api/client-messages`
    *   **Description**: (Staff) Envoie un message à un client spécifique.
    *   **Authentification**: Staff requise.

## Gestion du Menu (Permission `manage_menu`)

*   `GET /api/menu`
    *   **Description**: Récupère tous les articles du menu (pour affichage public et admin).
*   `POST /api/menu`
    *   **Description**: Ajoute un nouvel article au menu.
    *   **Authentification**: Permission `manage_menu` requise.
*   `PUT /api/menu/:id`
    *   **Description**: Modifie un article du menu.
    *   **Authentification**: Permission `manage_menu` requise.
*   `DELETE /api/menu/:id`
    *   **Description**: Supprime un article du menu.
    *   **Authentification**: Permission `manage_menu` requise.
*   `PUT /api/menu/:id/price`
    *   **Description**: Met à jour spécifiquement le prix d'un article.
    *   **Authentification**: Permission `manage_menu` requise.
*   `PUT /api/menu/:id/photo`
    *   **Description**: Met à jour l'URL de l'image d'un article.
    *   **Authentification**: Permission `manage_menu` requise.

## Gestion des Annonces (Permission `manage_announcements`)

*   `GET /api/announcements`
    *   **Description**: Liste les annonces (avec filtres `position`, `active`).
*   `POST /api/announcements`
    *   **Description**: Crée une annonce.
    *   **Authentification**: Permission `manage_announcements` requise.
*   `PUT /api/announcements/:id`
    *   **Description**: Modifie une annonce.
    *   **Authentification**: Permission `manage_announcements` requise.

## Gestion des Commandes

*   `GET /api/orders`
    *   **Description**: (Staff) Liste toutes les commandes.
    *   **Authentification**: Staff requise.
*   `POST /api/orders`
    *   **Description**: (Client Authentifié) Crée une nouvelle commande.
    *   **Authentification**: Requise.
*   `PUT /api/orders/:id`
    *   **Description**: (Staff) Modifie une commande (ex: statut, items).
    *   **Authentification**: Staff requise.

## Gestion des Réservations

*   `GET /api/reservations`
    *   **Description**: (Staff) Liste toutes les réservations.
    *   **Authentification**: Staff requise.
*   `POST /api/reservations`
    *   **Description**: (Public/Client Authentifié) Crée une nouvelle réservation.
*   `GET /api/reservations/date/:date`
    *   **Description**: (Public) Vérifie les réservations pour une date spécifique (pour afficher les disponibilités).
*   `PUT /api/reservations/:id`
    *   **Description**: (Staff) Modifie une réservation.
    *   **Authentification**: Staff requise.

## Gestion du Calendrier des Employés (Staff)

*   `GET /api/calendar/events`
    *   **Description**: Liste les événements du calendrier (avec filtres de date `start`, `end`).
    *   **Authentification**: Staff requise.
*   `POST /api/calendar/events`
    *   **Description**: Crée un événement de calendrier.
    *   **Authentification**: Staff requise.
*   `PUT /api/calendar/events/:id`
    *   **Description**: Modifie un événement de calendrier.
    *   **Authentification**: Staff requise.
*   `DELETE /api/calendar/events/:id`
    *   **Description**: Supprime un événement de calendrier.
    *   **Authentification**: Staff requise.

## Gestion Financière (Permission `view_financials`, `manage_financials`)

*   `GET /api/finance/transactions`
    *   **Description**: Liste les transactions financières (avec filtres de date `start`, `end`).
    *   **Authentification**: Permission `view_financials` requise.
*   `POST /api/finance/transactions`
    *   **Description**: Crée une nouvelle transaction financière.
    *   **Authentification**: Permission `manage_financials` requise.
*   `GET /api/finance/summary`
    *   **Description**: Récupère un résumé financier.
    *   **Authentification**: Permission `view_financials` requise.
*   `POST /api/finance/calculate-taxes`
    *   **Description**: (Staff) Calcule les taxes canadiennes pour un montant donné.
    *   **Authentification**: Staff requise.
    *   **Corps (JSON)**: `{ "amount": 100.00 }`

## Gestion des Thèmes Festifs (Admin)

*   `GET /api/themes`
    *   **Description**: (Public/Admin) Liste tous les thèmes festifs.
*   `POST /api/themes`
    *   **Description**: (Admin) Crée un nouveau thème festif.
    *   **Authentification**: Admin requise.
*   `GET /api/themes/active`
    *   **Description**: (Public) Récupère le thème festif actuellement actif.
*   `PUT /api/themes/:id/activate`
    *   **Description**: (Admin) Active un thème festif spécifique.
    *   **Authentification**: Admin requise.

## Gestion des Récompenses de Fidélité

*   `GET /api/loyalty/rewards`
    *   **Description**: (Client Authentifié/Admin) Liste les récompenses de fidélité disponibles.
    *   **Authentification**: Requise.
*   `POST /api/loyalty/rewards`
    *   **Description**: (Admin) Crée une nouvelle récompense de fidélité.
    *   **Authentification**: Admin requise.

## Gestion de l'Inventaire (Permission `manage_inventory`)

*   `GET /api/inventory`
    *   **Description**: (Staff) Liste tous les articles d'inventaire.
    *   **Authentification**: Staff requise.
*   `POST /api/inventory`
    *   **Description**: Ajoute un nouvel article à l'inventaire.
    *   **Authentification**: Permission `manage_inventory` requise.
    *   *(Les routes PUT/DELETE pour l'inventaire sont à implémenter si nécessaire)*

## Points de Santé et Statistiques

*   `GET /api/ping`
    *   **Description**: Endpoint simple pour vérifier si l'API est en ligne.
    *   **Réponse**: `{ "status": "ok", "timestamp": "..." }`
*   `GET /api/health`
    *   **Description**: Vérification de santé plus détaillée (peut inclure statut DB, etc.).
*   `GET /api/status`
    *   **Description**: Statut basique (utilisé pour des tests initiaux).
*   `GET /api/admin/stats`
    *   **Description**: (Staff) Anciennement `/api/auth/profile`, récupère les informations de l'utilisateur connecté.
    *   **Authentification**: Staff requise.
*   `GET /api/dashboard/stats`
    *   **Description**: (Staff) Récupère les statistiques agrégées pour le tableau de bord d'administration.
    *   **Authentification**: Staff requise.

Cette liste devrait être plus complète. Des détails sur les corps de requête et les réponses exactes peuvent être trouvés en examinant le code source de l'API (en particulier les schémas Zod dans `shared/schema.ts`) et les gestionnaires de routes.

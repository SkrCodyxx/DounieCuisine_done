# Guide de Test Dounie Cuisine

Ce document fournit une série de scénarios de test manuels pour valider les fonctionnalités clés de l'application Dounie Cuisine (Publique et Administration). Des tests automatisés (unitaires, intégration, e2e) devraient idéalement compléter ces tests manuels.

## 1. Tests de l'Application Publique

### 1.1 Navigation et Affichage Général
    *   [ ] **Page d'Accueil (`/`)**:
        *   Vérifier que tous les éléments (Hero, Services, Événements à venir, Types d'événements, Menu populaire, CTA) s'affichent correctement.
        *   Tester tous les liens de la page d'accueil.
        *   Vérifier la réactivité (mobile, tablette, desktop).
    *   [ ] **Header et Footer**:
        *   Vérifier la présence et la fonctionnalité du header et du footer sur toutes les pages publiques.
        *   Tester les liens de navigation du header et du footer.
        *   Tester le menu mobile sur petits écrans.
    *   [ ] **Page Menu (`/menu`)**:
        *   Vérifier l'affichage des plats et des menus événementiels.
        *   Tester les filtres de catégorie.
        *   Tester la barre de recherche.
        *   Vérifier l'affichage des détails (prix, description, portions min, etc.).
        *   Vérifier la section "Services Inclus" et "Galerie d'événements récents".
        *   Tester les boutons "Ajouter au Devis" (vérifier l'action attendue) et "Détails".
    *   [ ] **Page Réservations (`/reservations`)**:
        *   Tester le formulaire de réservation multi-étapes.
        *   Valider chaque champ (requis, format).
        *   Vérifier la progression entre les étapes.
        *   Soumettre un formulaire valide et vérifier le message de succès et les informations affichées.
        *   Vérifier l'affichage de la sidebar d'informations.
    *   [ ] **Page Contact (`/contact`)**:
        *   Vérifier l'affichage des informations de contact (adresse, horaires, téléphone, email, réseaux sociaux).
        *   Tester le formulaire de contact : envoyer un message valide.
        *   Vérifier le message de succès.
        *   Tester la validation des champs du formulaire.
        *   Vérifier le placeholder de la carte interactive et le lien Google Maps.
    *   [ ] **Page Galerie (`/gallery`)**:
        *   Vérifier l'affichage des statistiques, des filtres et de la grille d'images.
        *   Tester les filtres de catégorie.
        *   Cliquer sur une image pour ouvrir le modal.
        *   Tester la navigation (précédent/suivant) dans le modal.
        *   Vérifier l'affichage des informations de l'image dans le modal.
        *   Tester le bouton de téléchargement.
    *   [ ] **Page Non Trouvée (404)**:
        *   Accéder à une URL inexistante et vérifier l'affichage de la page 404.

### 1.2 Authentification Client
    *   [ ] **Inscription (`/register`)**:
        *   Créer un nouveau compte client avec des informations valides.
        *   Vérifier la redirection vers la page de succès/connexion.
        *   Essayer de créer un compte avec un email/username déjà utilisé. Vérifier le message d'erreur.
        *   Tester les validations de champs (mot de passe non concordants, champs requis, format email).
    *   [ ] **Connexion (`/login`)**:
        *   Se connecter avec des identifiants valides. Vérifier la redirection.
        *   Essayer de se connecter avec des identifiants incorrects. Vérifier le message d'erreur.
        *   Vérifier le lien "Créer un compte".
    *   [ ] **Déconnexion**:
        *   Si l'utilisateur est connecté, vérifier la présence et la fonctionnalité du bouton "Déconnexion".
        *   Vérifier que l'utilisateur est bien déconnecté (ex: accès à `/mon-compte` redirige vers login).
    *   [ ] **Accès à `/mon-compte` (ou `/dashboard` client)**:
        *   Vérifier que seuls les clients connectés peuvent y accéder.
        *   (Si la page existe) Vérifier l'affichage des informations du profil.

### 1.3 Fonctionnalités Client Connecté
    *   [ ] **Passer une commande** (si le flux est complètement implémenté côté frontend public).
    *   [ ] **Faire une réservation** en étant connecté (vérifier si les infos sont pré-remplies).
    *   [ ] **Voir ses points de fidélité / récompenses** (si l'interface existe).

## 2. Tests de l'Application d'Administration

### 2.1 Authentification Admin/Staff
    *   [ ] **Page de Connexion (`/admin` ou redirigé vers login admin)**:
        *   Se connecter avec un compte admin. Vérifier l'accès au dashboard admin.
        *   Se connecter avec un compte manager. Vérifier l'accès et les permissions.
        *   Se connecter avec un compte staff. Vérifier l'accès et les permissions.
        *   Essayer de se connecter avec un compte client (doit échouer ou rediriger).
        *   Essayer des identifiants incorrects.
    *   [ ] **Déconnexion**.
    *   [ ] **Réinitialisation de Mot de Passe (via code admin)**:
        *   Générer un code pour un utilisateur.
        *   Utiliser ce code sur la page publique de réinitialisation.
        *   Changer le mot de passe et vérifier la connexion avec le nouveau mot de passe.

### 2.2 Layout et Navigation Admin
    *   [ ] **Sidebar**:
        *   Vérifier que les liens de navigation s'affichent correctement en fonction du rôle/permissions de l'utilisateur connecté.
        *   Tester la navigation vers chaque section.
        *   Vérifier le style du lien actif.
        *   Vérifier l'affichage des informations utilisateur et le bouton de déconnexion.
    *   [ ] **Menu Mobile Admin**:
        *   Tester l'ouverture/fermeture du menu.
        *   Vérifier la navigation depuis le menu mobile.
    *   [ ] **Notifications**:
        *   Vérifier l'affichage du badge de notifications (si des messages clients non lus existent).

### 2.3 Modules de Gestion (CRUD et Fonctionnalités Spécifiques)

Pour chaque module listé ci-dessous (Clients, Devis, Commandes, Menu, etc.) :
    *   [ ] **Affichage de la liste**:
        *   Les données se chargent-elles correctement ?
        *   La pagination fonctionne-t-elle (si applicable) ?
        *   Les filtres et la recherche fonctionnent-ils ?
    *   [ ] **Création**:
        *   Ouvrir le formulaire/modal de création.
        *   Tester la validation des champs (requis, formats).
        *   Créer une nouvelle entrée avec des données valides. Vérifier qu'elle apparaît dans la liste.
        *   Vérifier le message de succès (toast).
    *   [ ] **Modification**:
        *   Ouvrir le formulaire/modal de modification pour une entrée existante.
        *   Les données sont-elles correctement pré-remplies ?
        *   Modifier quelques champs et sauvegarder. Vérifier que les modifications sont prises en compte.
        *   Vérifier le message de succès.
    *   [ ] **Visualisation (Détails)**:
        *   Si un modal ou une page de détails existe, vérifier l'affichage de toutes les informations.
    *   [ ] **Suppression**:
        *   Essayer de supprimer une entrée.
        *   Vérifier la demande de confirmation.
        *   Vérifier que l'entrée est bien supprimée de la liste.
        *   Vérifier le message de succès.
    *   [ ] **Fonctionnalités spécifiques au module**:
        *   **Devis**: Tester l'envoi d'un devis.
        *   **Commandes**: Tester le changement de statut d'une commande.
        *   **Menu**: Tester la mise à jour du prix/photo d'un article.
        *   **Galeries**: Tester l'ajout/suppression d'images à une galerie.
        *   Etc.

**Modules à tester :**
    *   [ ] Tableau de Bord (`AdminDashboard.tsx`)
    *   [ ] Gestion Clients (`ClientManagement.tsx`)
    *   [ ] Système de Devis (`QuoteManagement.tsx`)
    *   [ ] Commandes (`OrderManagement.tsx`)
    *   [ ] Réservations (`ReservationManagement.tsx`)
    *   [ ] Gestion Menu (`MenuManagement.tsx`)
    *   [ ] Galeries Photos (`GalleryManagement.tsx`)
    *   [ ] Pages de Contenu (`ContentManagement.tsx`)
    *   [ ] Annonces (si UI existe, sinon via API)
    *   [ ] Messages Clients (`CustomerMessages` - UI à vérifier, peut-être dans `MessagingPanel.tsx` ou une page dédiée)
    *   [ ] Messagerie Interne (`MessagingPanel.tsx` - nécessite WebSocket fonctionnel)
    *   [ ] Personnel (`StaffManagement.tsx`)
    *   [ ] Calendrier (`CalendarManagement.tsx`)
    *   [ ] Inventaire (`InventoryManagement.tsx`)
    *   [ ] Finances (`FinancialManagement.tsx`)
    *   [ ] Paramètres (`SystemSettings.tsx` - vérifier si les sauvegardes sont maintenant connectées à l'API)
    *   [ ] Gestion des Rôles et Permissions (si une UI dédiée a été créée)

## 3. Tests API (Conceptuels - peuvent être faits avec Postman/Insomnia)

*   Pour chaque endpoint listé dans `docs/api_reference.md` :
    *   [ ] **Succès**: Envoyer une requête valide et vérifier que la réponse est correcte (statut 200/201, données attendues).
    *   [ ] **Erreur de Validation**: Envoyer des données invalides (champs manquants, formats incorrects) et vérifier les réponses d'erreur (statut 400, messages clairs).
    *   [ ] **Authentification/Autorisation**:
        *   Essayer d'accéder à des routes protégées sans être authentifié (s'attendre à un statut 401).
        *   Essayer d'accéder à des routes avec un rôle/permission insuffisant (s'attendre à un statut 403).
    *   [ ] **Cas Limites**: Tester avec des ID inexistants pour GET/PUT/DELETE (s'attendre à un statut 404).

## 4. Tests de Robustesse et Sécurité (Points de vigilance)

*   [ ] **Injection SQL**: Bien que Drizzle ORM offre une protection, vérifier que les entrées utilisateur ne sont jamais directement concaténées dans des requêtes brutes (si des requêtes brutes sont utilisées quelque part).
*   [ ] **XSS (Cross-Site Scripting)**:
    *   Dans tous les champs où l'utilisateur peut entrer du texte qui sera affiché (descriptions, notes, messages), essayer d'entrer des scripts `<script>alert('XSS')</script>`. Le contenu doit être correctement échappé à l'affichage.
    *   Vérifier que React échappe bien les données par défaut, et que `dangerouslySetInnerHTML` est utilisé avec prudence et uniquement avec du contenu sain ou purifié.
*   [ ] **Gestion des Erreurs Inattendues**: Simuler des pannes réseau ou des erreurs 500 de l'API pour voir comment le frontend réagit (devrait afficher un message d'erreur convivial).
*   [ ] **Performance**:
    *   Temps de chargement des pages principales.
    *   Temps de réponse pour les actions courantes (filtrage, sauvegarde de formulaire).
*   [ ] **Validation des Données (Front et Back)**: S'assurer que la validation est présente des deux côtés.

## 5. Tests de la Messagerie Interne (une fois WebSocket fonctionnel)

*   [ ] Envoyer un message direct d'un utilisateur A à un utilisateur B. Vérifier que B le reçoit en temps réel.
*   [ ] Envoyer un message broadcast. Vérifier que tous les utilisateurs connectés (concernés) le reçoivent.
*   [ ] Vérifier le compteur de messages non lus.
*   [ ] Tester l'affichage de l'historique des messages.
*   [ ] Tester la gestion des statuts en ligne/hors ligne des utilisateurs.

Ce guide de test n'est pas exhaustif mais couvre les aspects les plus importants. Il devra être adapté et complété au fur et à mesure des tests réels.

# Manuel d'utilisation - Application d'administration Dounie Cuisine

## Vue d'ensemble

L'application d'administration de Dounie Cuisine est une interface web complète pour gérer tous les aspects du restaurant haïtien. Elle est conçue pour les administrateurs et gestionnaires uniquement.

## Accès à l'application

### Connexion
- URL d'accès : `http://localhost:3001` (développement)
- Comptes par défaut :
  - **Administrateur** : `admin` / `admin123`
  - **Gestionnaire** : Créé via l'interface admin

### Sécurité
- Seuls les comptes avec rôle `admin` ou `manager` peuvent accéder
- Sessions sécurisées avec expiration automatique
- Validation des permissions sur chaque action

## Interface principale

### Tableau de bord
Le tableau de bord affiche :
- **Statistiques du jour** : Commandes, réservations, revenus
- **Alertes système** : Stock critique, problèmes techniques
- **Actions rapides** : Accès direct aux fonctions principales
- **Activité récente** : Dernières transactions et événements

### Navigation
- **Menu latéral** : Navigation principale entre les sections
- **Fil d'ariane** : Position actuelle dans l'application
- **Profil utilisateur** : Informations du compte connecté

## Modules fonctionnels

### 1. Gestion du personnel

#### Fonctionnalités
- **Créer des employés** : Comptes avec rôles (staff, manager, admin)
- **Modifier les informations** : Données personnelles et professionnelles
- **Gérer les salaires** : Taux horaires et avantages
- **Suivre l'activité** : Heures travaillées et performance

#### Utilisation
1. Aller dans "Gestion du personnel"
2. Cliquer "Nouvel employé"
3. Remplir le formulaire complet
4. Définir le rôle et les permissions
5. Sauvegarder

#### Champs obligatoires
- Prénom, nom, email, nom d'utilisateur
- Mot de passe (lors de la création)
- Poste, département, salaire horaire

### 2. Gestion du menu

#### Fonctionnalités
- **Articles du menu** : Plats, boissons, desserts
- **Catégorisation** : Organisation par type
- **Multilingue** : Français et anglais
- **Gestion des prix** : Tarification dynamique
- **Allergènes** : Suivi des restrictions alimentaires

#### Utilisation
1. Accéder "Gestion du menu"
2. Filtrer par catégorie si nécessaire
3. "Nouvel article" pour ajouter
4. Remplir toutes les informations
5. Activer/désactiver selon disponibilité

#### Informations importantes
- **Prix** : Toujours en dollars canadiens
- **Temps de préparation** : En minutes
- **Ingrédients** : Séparés par virgules
- **Allergènes** : Liste complète pour sécurité

### 3. Gestion des commandes

#### Statuts des commandes
- **En attente** : Nouvelle commande reçue
- **Confirmée** : Acceptée par le restaurant
- **En préparation** : Cuisine en cours
- **Prête** : Commande terminée
- **Livrée** : Remise au client
- **Annulée** : Commande annulée

#### Processus de traitement
1. Surveiller les nouvelles commandes
2. Confirmer la disponibilité des articles
3. Passer en "En préparation"
4. Marquer "Prête" quand terminé
5. Finaliser avec "Livrée"

#### Fonctions avancées
- **Détails complets** : Articles, prix, taxes
- **Informations client** : Contact et préférences
- **Demandes spéciales** : Notes du client
- **Historique** : Suivi complet

### 4. Gestion des réservations

#### Types de réservations
- **Table standard** : Réservation normale
- **Événement spécial** : Anniversaire, affaires
- **Grande table** : Groupes importants

#### Processus de réservation
1. Créer ou modifier une réservation
2. Vérifier la disponibilité
3. Assigner une table
4. Confirmer avec le client
5. Gérer l'arrivée et le service

#### États des réservations
- **En attente** : Demande reçue
- **Confirmée** : Réservation validée
- **Installée** : Client arrivé
- **Terminée** : Service complété
- **Annulée** : Réservation annulée
- **Absence** : Client non présenté

### 5. Gestion de l'inventaire

#### Suivi des stocks
- **Stock actuel** : Quantités disponibles
- **Stock minimum** : Seuils d'alerte
- **Coûts** : Prix d'achat par unité
- **Fournisseurs** : Contacts et historique
- **Dates d'expiration** : Gestion de la fraîcheur

#### Alertes automatiques
- **Stock bas** : En dessous du minimum
- **Expiration proche** : Produits à utiliser
- **Articles critiques** : Éléments essentiels

#### Gestion quotidienne
1. Vérifier les alertes au démarrage
2. Mettre à jour les stocks après livraisons
3. Enregistrer les utilisations importantes
4. Planifier les commandes fournisseurs

### 6. Gestion financière

#### Tableau de bord financier
- **Revenus du jour/mois** : Chiffre d'affaires
- **Dépenses** : Coûts opérationnels
- **Profit net** : Bénéfices calculés
- **Taxes** : TPS/TVQ à payer

#### Types de transactions
- **Revenus** : Ventes, services, pourboires
- **Dépenses** : Ingrédients, salaires, loyer
- **Taxes** : TPS, TVQ, impôts
- **Paie** : Salaires et avantages

#### Rapports financiers
- **Graphiques** : Évolution des revenus/dépenses
- **Répartition** : Analyse par catégorie
- **Comparaisons** : Périodes précédentes

### 7. Calendrier et planification

#### Types d'événements
- **Équipes de travail** : Horaires du personnel
- **Réunions** : Meetings d'équipe
- **Formation** : Sessions de formation
- **Événements spéciaux** : Célébrations, promotions

#### Planification
1. Créer un événement
2. Définir date, heure, durée
3. Inviter les participants
4. Ajouter lieu et description
5. Définir priorité et statut

#### Gestion quotidienne
- Consulter le planning du jour
- Confirmer les présences
- Ajuster selon les besoins
- Documenter les changements

### 8. Paramètres système

#### Configuration générale
- **Informations restaurant** : Nom, adresse, contact
- **Heures d'ouverture** : Planning hebdomadaire
- **Limites** : Réservations max, délais
- **Taxes** : Taux TPS/TVQ

#### Thèmes visuels
- **Thème actuel** : Haïti par défaut
- **Thèmes saisonniers** : Été, hiver, fêtes
- **Activation automatique** : Selon calendrier

#### Notifications
- **Email** : Alertes par courriel
- **SMS** : Messages texte urgents
- **Rappels** : Réservations clients
- **Rapports** : Résumés quotidiens

#### Sécurité
- **Sessions** : Durée d'inactivité
- **Mots de passe** : Règles de complexité
- **Tentatives** : Limite de connexion
- **Authentification** : Double facteur optionnel

### 9. Tests système

#### Suites de tests disponibles
- **Authentification** : Connexions et sécurité
- **API** : Endpoints et validation
- **Base de données** : Intégrité des données
- **Commandes** : Processus complet

#### Exécution des tests
1. Sélectionner la suite à tester
2. Lancer l'exécution
3. Suivre le progrès en temps réel
4. Analyser les résultats
5. Corriger les problèmes identifiés

## Bonnes pratiques

### Utilisation quotidienne
1. **Matin** : Vérifier tableau de bord et alertes
2. **Journée** : Traiter commandes et réservations
3. **Soir** : Réviser les ventes et mettre à jour stocks
4. **Fin de semaine** : Analyser rapports et planifier

### Sécurité
- Toujours se déconnecter après utilisation
- Ne jamais partager ses identifiants
- Signaler immédiatement les problèmes
- Effectuer des sauvegardes régulières

### Performance
- Fermer les onglets inutilisés
- Actualiser si l'interface devient lente
- Signaler les bugs ou erreurs
- Utiliser les filtres pour grandes listes

## Support technique

### Problèmes courants
- **Connexion impossible** : Vérifier identifiants et rôle
- **Page qui ne charge pas** : Actualiser le navigateur
- **Erreur de sauvegarde** : Vérifier la connexion réseau
- **Données manquantes** : Contacter l'administrateur

### Contact support
- **Urgent** : Appeler directement le responsable IT
- **Non urgent** : Email avec capture d'écran
- **Demande de formation** : Planifier session d'équipe

## Maintenance

### Sauvegardes
- Automatiques chaque nuit
- Manuelles avant gros changements
- Stockage sécurisé hors site
- Test de restauration mensuel

### Mises à jour
- Notifications des nouvelles versions
- Installation en dehors des heures d'ouverture
- Formation sur nouvelles fonctionnalités
- Documentation des changements

Cette application est l'outil central pour gérer efficacement Dounie Cuisine. Une utilisation correcte garantit un service client optimal et une gestion financière saine.
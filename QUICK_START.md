# ⚡ Guide de Démarrage Rapide - Dounie Cuisine

## 🎯 Installation en 5 Minutes

### Prérequis Minimum
- **Serveur Linux** (Ubuntu 20.04+ ou Debian 11+)
- **Accès root** SSH
- **2GB RAM** et **20GB stockage**

### 🚀 Installation Ultra-Rapide

```bash
# 1. Télécharger et déployer
git clone https://github.com/dounie-cuisine/dounie-cuisine.git
cd dounie-cuisine
sudo ./deploy-smart.sh

# 2. Configuration SSL (optionnel)
sudo ./setup-ssl.sh votre-domaine.com
```

**C'est tout ! Votre restaurant est en ligne !** 🎉

---

## 🌐 Accès Immédiat

### URLs par Défaut
- **📱 Site Public :** `http://votre-serveur`
- **⚙️ Administration :** `http://votre-serveur/admin`  
- **🔗 API :** `http://votre-serveur/api`

### 👤 Connexion Administration

| Rôle | Utilisateur | Mot de passe |
|------|------------|-------------|
| **Admin** | `admin` | `admin123` |
| **Manager** | `lucie.manager` | `staff123` |
| **Staff** | `marc.staff` | `staff123` |

> ⚠️ **Changez immédiatement ces mots de passe en production !**

---

## 🎛️ Première Configuration

### 1. Accès Interface Admin
```
1. Aller sur http://votre-serveur/admin
2. Se connecter avec admin/admin123
3. Changer le mot de passe (Paramètres > Utilisateurs)
```

### 2. Configuration Restaurant
```
1. Aller dans Paramètres > Entreprise
2. Modifier :
   - Nom du restaurant
   - Adresse et téléphone
   - Heures d'ouverture
   - Logo (upload image)
```

### 3. Personnaliser le Menu
```
1. Aller dans Menu > Gestion
2. Ajouter vos catégories (Entrées, Plats, Desserts)
3. Ajouter vos plats avec :
   - Photos de qualité
   - Descriptions en français/créole
   - Prix en gourdes haïtiennes
```

---

## 💬 Test de la Messagerie

### Activation Messagerie Interne
```
1. Dans l'interface admin, chercher le bouton flottant (💬)
2. Cliquer pour ouvrir le panneau
3. Tester l'envoi de messages
4. Vérifier les 3 onglets : Messages, Alertes, Système
```

### Test Communication
```
1. Ouvrir 2 fenêtres admin avec utilisateurs différents
2. Envoyer un message depuis admin vers lucie.manager
3. Vérifier réception instantanée
4. Tester diffusion générale (sélectionner "Tous")
```

---

## 📊 Vérification Monitoring

### Dashboard Système
```
1. Dans l'admin, onglet Système du panneau messagerie
2. Vérifier métriques temps réel :
   - Utilisation mémoire
   - Espace disque
   - Utilisateurs connectés
   - Charge système
```

### Tests Automatiques
```bash
# Vérifier health checks
curl http://localhost:5000/api/health

# Vérifier statut services
pm2 status

# Vérifier logs monitoring
tail -f /var/log/dounie-cuisine/health-monitor.log
```

---

## 🛒 Test Commande Client

### Interface Publique
```
1. Aller sur http://votre-serveur
2. Naviguer dans le menu
3. Ajouter des plats au panier
4. Tester le processus de commande complet
5. Vérifier réception dans l'admin (Commandes)
```

### Workflow Complet
```
1. Client passe commande
2. Notification dans l'admin (messagerie)
3. Manager traite la commande
4. Changement de statut
5. Notification client (si configuré)
```

---

## 🔧 Commandes Utiles

### Gestion Services
```bash
# Statut général
pm2 status

# Redémarrer API
pm2 restart dounie-api

# Logs en temps réel
pm2 logs dounie-api

# Monitoring système
pm2 monit
```

### Diagnostic Rapide
```bash
# Test connectivité
curl -I http://localhost:5000/api/health

# Vérifier base de données
sudo -u postgres psql -d dounie_cuisine -c "\dt"

# Espace disque
df -h

# Mémoire
free -h
```

### Sauvegardes
```bash
# Sauvegarde manuelle
/usr/local/bin/dounie-backup-advanced

# Vérifier sauvegardes
ls -la /backup/dounie-cuisine/

# Test restauration
/usr/local/bin/dounie-restore-test
```

---

## 🚨 Dépannage Express

### API ne répond pas
```bash
# 1. Vérifier statut
pm2 status

# 2. Redémarrer
pm2 restart dounie-api

# 3. Vérifier logs
pm2 logs dounie-api --lines 50
```

### Site web inaccessible
```bash
# 1. Vérifier Nginx
nginx -t
systemctl status nginx

# 2. Redémarrer si nécessaire
systemctl restart nginx

# 3. Vérifier configuration
cat /etc/nginx/sites-available/dounie-cuisine
```

### Base de données problème
```bash
# 1. Vérifier PostgreSQL
systemctl status postgresql

# 2. Test connexion
sudo -u postgres psql -d dounie_cuisine -c "SELECT version();"

# 3. Redémarrer si nécessaire
systemctl restart postgresql
```

### Erreur de déploiement
```bash
# 1. Relancer script intelligent (reprend automatiquement)
./deploy-smart.sh

# 2. Vérifier logs de déploiement
cat /tmp/dounie-deploy-errors.log

# 3. Diagnostic complet
./deploy-smart.sh --diagnose
```

---

## 🔐 Sécurisation Immédiate

### Changement Mots de Passe
```
1. Interface Admin > Paramètres > Utilisateurs
2. Modifier chaque compte :
   - admin → mot de passe complexe
   - lucie.manager → nouveau mot de passe
   - marc.staff → nouveau mot de passe
3. Supprimer compte client test si non nécessaire
```

### Configuration SSL
```bash
# SSL automatique avec Let's Encrypt
./setup-ssl.sh votre-domaine.com admin@votre-domaine.com

# Vérification SSL
curl -I https://votre-domaine.com
```

### Firewall
```bash
# Vérifier firewall (déjà configuré par le script)
ufw status

# Ajouter IP autorisée si nécessaire
ufw allow from VOTRE_IP
```

---

## 📈 Optimisations Recommandées

### Performance
```bash
# Vérifier utilisation ressources
htop

# Optimiser PostgreSQL si nécessaire
# (Configuration automatique déjà appliquée)

# Analyser performance Nginx
tail -f /var/log/nginx/dounie-cuisine.access.log
```

### Maintenance
```bash
# Nettoyer logs anciens (automatique)
find /var/log -name "*.log" -mtime +7 -delete

# Vérifier espace disque
df -h

# Analyser utilisation
du -sh /var/www/html/dounie-cuisine
```

---

## 📞 Support Rapide

### Auto-Diagnostic
```bash
# Script de diagnostic complet
./deploy-smart.sh --diagnose

# Rapport système
/usr/local/bin/dounie-daily-report
```

### Logs Principaux
```bash
# Logs API
tail -f /var/log/dounie-cuisine/api-combined.log

# Logs monitoring
tail -f /var/log/dounie-cuisine/health-monitor.log

# Logs Nginx
tail -f /var/log/nginx/dounie-cuisine.error.log
```

### Contact Support
- **Documentation :** [Guide Complet](GUIDE_UTILISATEUR_COMPLET.md)
- **Administration :** [Manuel Avancé](MANUEL_ADMINISTRATION_AVANCE.md)
- **Déploiement :** [Guide Intelligent](GUIDE_DEPLOIEMENT_INTELLIGENT.md)

---

## 🎉 Félicitations !

Votre système **Dounie Cuisine** est maintenant opérationnel avec :

✅ **Interface client** moderne et responsive  
✅ **Administration complète** avec messagerie temps réel  
✅ **Monitoring automatique** 24/7  
✅ **Sauvegardes quotidiennes** automatiques  
✅ **Sécurité** configurée (firewall, SSL optionnel)  
✅ **Auto-correction** des problèmes  
✅ **Documentation** complète en français  

**Prochaines étapes recommandées :**
1. 📸 **Ajouter vos vraies photos** de plats
2. 📝 **Personnaliser le contenu** et les descriptions
3. 👥 **Former votre équipe** à l'utilisation
4. 📊 **Configurer les rapports** selon vos besoins
5. 🎯 **Tester en conditions réelles** avec de vrais clients

**Bon appétit et bon business ! 🍽️💼**

---

*Temps d'installation : **~15 minutes***  
*Temps de configuration : **~30 minutes***  
*Formation équipe : **~2 heures***

**Total pour être opérationnel : ~3 heures maximum !** ⚡
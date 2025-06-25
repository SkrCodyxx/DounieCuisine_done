#!/usr/bin/env node

/**
 * Générateur de trafic automatisé pour tester l'application Dounie Cuisine
 * Simule des interactions client et administrateur
 */

const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5000/api';
const CLIENTS_COUNT = 20;
const ORDERS_COUNT = 50;
const RESERVATIONS_COUNT = 30;

class TrafficGenerator {
  constructor() {
    this.clients = [];
    this.adminSession = null;
  }

  async log(message) {
    console.log(`[${new Date().toISOString()}] ${message}`);
  }

  async loginAsAdmin() {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'admin',
          password: 'admin123'
        })
      });

      if (response.ok) {
        this.adminSession = response.headers.get('set-cookie');
        await this.log('✓ Connexion admin réussie');
        return true;
      }
    } catch (error) {
      await this.log(`❌ Erreur connexion admin: ${error.message}`);
    }
    return false;
  }

  async createTestClient(index) {
    const client = {
      username: `client_test_${index}`,
      email: `client${index}@test.com`,
      password: 'test123',
      firstName: `Client${index}`,
      lastName: `Test`,
      role: 'client',
      phoneNumber: `+1-514-555-${String(index).padStart(4, '0')}`
    };

    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(client)
      });

      if (response.ok) {
        // Essayer de se connecter
        const loginResponse = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: client.username,
            password: client.password
          })
        });

        if (loginResponse.ok) {
          const userData = await loginResponse.json();
          this.clients.push({
            ...client,
            id: userData.user.id,
            session: loginResponse.headers.get('set-cookie')
          });
          await this.log(`✓ Client ${client.username} créé et connecté`);
          return true;
        }
      }
    } catch (error) {
      await this.log(`❌ Erreur création client ${index}: ${error.message}`);
    }
    return false;
  }

  async createTestOrder(client) {
    const orderItems = [
      { menuItemId: 1, quantity: Math.floor(Math.random() * 3) + 1, price: "24.95" },
      { menuItemId: 2, quantity: Math.floor(Math.random() * 2) + 1, price: "28.50" }
    ];

    const subtotal = orderItems.reduce((sum, item) => 
      sum + (parseFloat(item.price) * item.quantity), 0
    );

    const order = {
      userId: client.id,
      status: 'pending',
      items: orderItems,
      totalAmount: (subtotal * 1.14975).toFixed(2), // Avec taxes
      gstAmount: (subtotal * 0.05).toFixed(2),
      qstAmount: (subtotal * 0.09975).toFixed(2),
      orderType: ['dine-in', 'takeout', 'delivery'][Math.floor(Math.random() * 3)],
      paymentMethod: 'carte',
      paymentStatus: 'completed'
    };

    try {
      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cookie': client.session 
        },
        body: JSON.stringify(order)
      });

      if (response.ok) {
        await this.log(`✓ Commande créée pour ${client.username}`);
        return true;
      }
    } catch (error) {
      await this.log(`❌ Erreur commande pour ${client.username}: ${error.message}`);
    }
    return false;
  }

  async createTestReservation(client) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30) + 1);

    const reservation = {
      userId: client.id,
      guestName: `${client.firstName} ${client.lastName}`,
      guestEmail: client.email,
      guestPhone: client.phoneNumber,
      partySize: Math.floor(Math.random() * 8) + 1,
      dateTime: futureDate.toISOString(),
      status: 'pending',
      confirmationCode: Math.random().toString(36).substring(2, 8).toUpperCase()
    };

    try {
      const response = await fetch(`${API_BASE}/reservations`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cookie': client.session 
        },
        body: JSON.stringify(reservation)
      });

      if (response.ok) {
        await this.log(`✓ Réservation créée pour ${client.username}`);
        return true;
      }
    } catch (error) {
      await this.log(`❌ Erreur réservation pour ${client.username}: ${error.message}`);
    }
    return false;
  }

  async simulateAdminActivity() {
    if (!this.adminSession) return;

    const activities = [
      'Vérification des commandes',
      'Mise à jour du menu',
      'Gestion des réservations',
      'Consultation des finances',
      'Gestion du personnel'
    ];

    for (const activity of activities) {
      await this.log(`🔧 Admin: ${activity}`);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simuler des appels API admin
      try {
        await fetch(`${API_BASE}/dashboard/stats`, {
          headers: { 'Cookie': this.adminSession }
        });
        
        await fetch(`${API_BASE}/orders`, {
          headers: { 'Cookie': this.adminSession }
        });
        
        await this.log(`✓ Admin: ${activity} terminée`);
      } catch (error) {
        await this.log(`❌ Admin erreur ${activity}: ${error.message}`);
      }
    }
  }

  async run() {
    await this.log('🚀 Démarrage du générateur de trafic Dounie Cuisine');

    // Connexion admin
    await this.loginAsAdmin();

    // Création des clients
    await this.log(`📝 Création de ${CLIENTS_COUNT} clients de test...`);
    for (let i = 1; i <= CLIENTS_COUNT; i++) {
      await this.createTestClient(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Génération des commandes
    await this.log(`🛍️ Génération de ${ORDERS_COUNT} commandes...`);
    for (let i = 0; i < ORDERS_COUNT; i++) {
      const randomClient = this.clients[Math.floor(Math.random() * this.clients.length)];
      if (randomClient) {
        await this.createTestOrder(randomClient);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

    // Génération des réservations
    await this.log(`📅 Génération de ${RESERVATIONS_COUNT} réservations...`);
    for (let i = 0; i < RESERVATIONS_COUNT; i++) {
      const randomClient = this.clients[Math.floor(Math.random() * this.clients.length)];
      if (randomClient) {
        await this.createTestReservation(randomClient);
        await new Promise(resolve => setTimeout(resolve, 250));
      }
    }

    // Simulation d'activité admin
    await this.log('🔧 Simulation d\'activité administrateur...');
    await this.simulateAdminActivity();

    await this.log('✅ Génération de trafic terminée!');
    await this.log(`📊 Résumé:`);
    await this.log(`   - ${this.clients.length} clients créés`);
    await this.log(`   - ${ORDERS_COUNT} commandes générées`);
    await this.log(`   - ${RESERVATIONS_COUNT} réservations générées`);
  }
}

// Exécution
if (require.main === module) {
  const generator = new TrafficGenerator();
  generator.run().catch(console.error);
}

module.exports = TrafficGenerator;

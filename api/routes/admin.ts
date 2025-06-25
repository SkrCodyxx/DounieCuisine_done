import { Request, Response } from "express";
import { storage } from "../storage";

export async function getAdminStats(req: Request, res: Response) {
  try {
    // Calculer les statistiques pour le tableau de bord admin
    const [orders, reservations, menuItems, inventory] = await Promise.all([
      storage.getOrders(),
      storage.getReservations(),
      storage.getMenuItems(),
      storage.getInventoryItems()
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Commandes du jour
    const todayOrders = orders.filter(order => 
      new Date(order.createdAt) >= today && new Date(order.createdAt) < tomorrow
    );

    // Revenus du jour
    const todayRevenue = todayOrders.reduce((sum, order) => 
      sum + parseFloat(order.totalAmount), 0
    );

    // Réservations du jour
    const todayReservations = reservations.filter(reservation => {
      const reservationDate = new Date(reservation.dateTime);
      return reservationDate >= today && reservationDate < tomorrow;
    });

    // Stock critique
    const criticalStock = inventory.filter(item => 
      item.currentStock <= item.minimumStock
    );

    // Commandes par statut
    const ordersByStatus = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Plats les plus populaires
    const popularItems = menuItems.map(item => ({
      ...item,
      orderCount: orders.filter(order => {
        const items = Array.isArray(order.items) ? order.items : [];
        return items.some((orderItem: any) => orderItem.menuItemId === item.id);
      }).length
    })).sort((a, b) => b.orderCount - a.orderCount).slice(0, 5);

    const stats = {
      revenue: {
        today: todayRevenue,
        month: todayRevenue * 30, // Simulation
        growth: 12.5
      },
      orders: {
        today: todayOrders.length,
        total: orders.length,
        byStatus: ordersByStatus
      },
      reservations: {
        today: todayReservations.length,
        upcoming: reservations.filter(r => new Date(r.dateTime) > new Date()).length
      },
      inventory: {
        total: inventory.length,
        critical: criticalStock.length,
        criticalItems: criticalStock
      },
      menu: {
        total: menuItems.length,
        popular: popularItems
      },
      customers: {
        total: orders.length, // Simulation
        returning: Math.floor(orders.length * 0.6)
      }
    };

    res.json(stats);
  } catch (error) {
    console.error("Erreur lors du calcul des statistiques:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
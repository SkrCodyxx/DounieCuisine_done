// Système de messagerie interne temps réel pour Dounie Cuisine
import { WebSocket, WebSocketServer } from 'ws';
import { nanoid } from 'nanoid';

interface Message {
  id: string;
  from: string;
  to: string;
  content: string;
  type: 'direct' | 'broadcast' | 'notification';
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

interface User {
  id: string;
  username: string;
  role: 'admin' | 'manager' | 'staff' | 'client';
  isOnline: boolean;
  lastSeen: Date;
}

interface SystemNotification {
  id: string;
  type: 'system' | 'backup' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

class MessagingSystem {
  private wss: WebSocketServer;
  private clients: Map<string, WebSocket> = new Map();
  private users: Map<string, User> = new Map();
  private messages: Message[] = [];
  private systemNotifications: SystemNotification[] = [];

  constructor(server: any) {
    this.wss = new WebSocketServer({ server });
    this.setupWebSocketServer();
    this.startSystemMonitoring();
  }

  private setupWebSocketServer() {
    this.wss.on('connection', (ws: WebSocket, request: any) => {
      const userId = this.extractUserIdFromRequest(request);
      
      if (!userId) {
        ws.close(1008, 'Unauthorized');
        return;
      }

      this.clients.set(userId, ws);
      this.updateUserStatus(userId, true);

      ws.on('message', (data: string) => {
        try {
          const message = JSON.parse(data);
          this.handleMessage(userId, message);
        } catch (error) {
          console.error('Erreur parsing message:', error);
        }
      });

      ws.on('close', () => {
        this.clients.delete(userId);
        this.updateUserStatus(userId, false);
      });

      // Envoyer les messages en attente
      this.sendPendingMessages(userId);
    });
  }

  private extractUserIdFromRequest(request: any): string | null {
    // Extraire l'ID utilisateur depuis la session ou les headers
    const url = new URL(request.url, 'http://localhost');
    return url.searchParams.get('userId');
  }

  private updateUserStatus(userId: string, isOnline: boolean) {
    const user = this.users.get(userId);
    if (user) {
      user.isOnline = isOnline;
      user.lastSeen = new Date();
      this.broadcastUserStatus(user);
    }
  }

  private handleMessage(fromUserId: string, messageData: any) {
    const message: Message = {
      id: nanoid(),
      from: fromUserId,
      to: messageData.to,
      content: messageData.content,
      type: messageData.type || 'direct',
      timestamp: new Date(),
      read: false,
      priority: messageData.priority || 'normal'
    };

    this.messages.push(message);
    this.deliverMessage(message);
  }

  private deliverMessage(message: Message) {
    if (message.type === 'broadcast') {
      // Diffuser à tous les utilisateurs connectés
      this.clients.forEach((ws, userId) => {
        if (userId !== message.from) {
          this.sendMessageToClient(userId, message);
        }
      });
    } else {
      // Message direct
      this.sendMessageToClient(message.to, message);
    }
  }

  private sendMessageToClient(userId: string, message: Message) {
    const client = this.clients.get(userId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'message',
        data: message
      }));
    }
  }

  private sendPendingMessages(userId: string) {
    const pendingMessages = this.messages.filter(
      msg => msg.to === userId && !msg.read
    );

    pendingMessages.forEach(message => {
      this.sendMessageToClient(userId, message);
    });
  }

  private broadcastUserStatus(user: User) {
    const statusMessage = {
      type: 'user_status',
      data: user
    };

    this.clients.forEach((ws, userId) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(statusMessage));
      }
    });
  }

  // Système de monitoring en temps réel
  private startSystemMonitoring() {
    setInterval(() => {
      this.checkSystemHealth();
    }, 30000); // Vérification toutes les 30 secondes
  }

  private async checkSystemHealth() {
    try {
      // Vérifier l'état du système
      const systemStatus = await this.getSystemStatus();
      
      // Créer des notifications si nécessaire
      if (systemStatus.memoryUsage > 90) {
        this.createSystemNotification(
          'warning',
          `Utilisation mémoire élevée: ${systemStatus.memoryUsage}%`
        );
      }

      if (systemStatus.diskUsage > 85) {
        this.createSystemNotification(
          'error',
          `Espace disque critique: ${systemStatus.diskUsage}%`
        );
      }

      // Diffuser le statut système
      this.broadcastSystemStatus(systemStatus);
    } catch (error) {
      this.createSystemNotification('error', 'Erreur de monitoring système');
    }
  }

  private async getSystemStatus() {
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);

    try {
      // Utilisation mémoire
      const memInfo = await execAsync('free | grep Mem');
      const memStats = memInfo.stdout.split(/\s+/);
      const memoryUsage = Math.round((parseInt(memStats[2]) / parseInt(memStats[1])) * 100);

      // Utilisation disque
      const diskInfo = await execAsync('df / | tail -1');
      const diskStats = diskInfo.stdout.split(/\s+/);
      const diskUsage = parseInt(diskStats[4].replace('%', ''));

      // Charge système
      const loadInfo = await execAsync('uptime');
      const loadAvg = loadInfo.stdout.match(/load average: ([\d.]+)/)?.[1] || '0';

      return {
        timestamp: new Date(),
        memoryUsage,
        diskUsage,
        loadAverage: parseFloat(loadAvg),
        uptime: process.uptime(),
        connectedUsers: this.clients.size
      };
    } catch (error) {
      throw new Error('Impossible de récupérer le statut système');
    }
  }

  private createSystemNotification(type: SystemNotification['type'], message: string) {
    const notification: SystemNotification = {
      id: nanoid(),
      type,
      message,
      timestamp: new Date(),
      resolved: false
    };

    this.systemNotifications.push(notification);
    this.broadcastSystemNotification(notification);
  }

  private broadcastSystemNotification(notification: SystemNotification) {
    const message = {
      type: 'system_notification',
      data: notification
    };

    // Envoyer uniquement aux administrateurs
    this.clients.forEach((ws, userId) => {
      const user = this.users.get(userId);
      if (user && (user.role === 'admin' || user.role === 'manager')) {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(message));
        }
      }
    });
  }

  private broadcastSystemStatus(status: any) {
    const message = {
      type: 'system_status',
      data: status
    };

    // Envoyer uniquement aux administrateurs
    this.clients.forEach((ws, userId) => {
      const user = this.users.get(userId);
      if (user && (user.role === 'admin' || user.role === 'manager')) {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(message));
        }
      }
    });
  }

  // API publique pour l'utilisation externe
  public registerUser(user: User) {
    this.users.set(user.id, user);
  }

  public sendDirectMessage(fromId: string, toId: string, content: string, priority: Message['priority'] = 'normal') {
    const message: Message = {
      id: nanoid(),
      from: fromId,
      to: toId,
      content,
      type: 'direct',
      timestamp: new Date(),
      read: false,
      priority
    };

    this.messages.push(message);
    this.deliverMessage(message);
    return message;
  }

  public broadcastMessage(fromId: string, content: string, priority: Message['priority'] = 'normal') {
    const message: Message = {
      id: nanoid(),
      from: fromId,
      to: 'all',
      content,
      type: 'broadcast',
      timestamp: new Date(),
      read: false,
      priority
    };

    this.messages.push(message);
    this.deliverMessage(message);
    return message;
  }

  public getMessages(userId: string, limit: number = 50): Message[] {
    return this.messages
      .filter(msg => msg.to === userId || msg.from === userId || msg.type === 'broadcast')
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  public getSystemNotifications(): SystemNotification[] {
    return this.systemNotifications
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 100);
  }

  public markMessageAsRead(messageId: string, userId: string) {
    const message = this.messages.find(msg => msg.id === messageId);
    if (message && message.to === userId) {
      message.read = true;
    }
  }

  public resolveSystemNotification(notificationId: string) {
    const notification = this.systemNotifications.find(n => n.id === notificationId);
    if (notification) {
      notification.resolved = true;
    }
  }

  public getConnectedUsers(): User[] {
    return Array.from(this.users.values()).filter(user => user.isOnline);
  }

  public getAllUsers(): User[] {
    return Array.from(this.users.values());
  }
}

export default MessagingSystem;
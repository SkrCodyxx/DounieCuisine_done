// Panneau de messagerie interne pour l'interface d'administration
import React, { useState, useEffect, useRef } from 'react';
import { Bell, MessageCircle, Users, AlertTriangle, CheckCircle, X, Send, Minimize2 } from 'lucide-react';

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

interface SystemStatus {
  timestamp: Date;
  memoryUsage: number;
  diskUsage: number;
  loadAverage: number;
  uptime: number;
  connectedUsers: number;
}

const MessagingPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'messages' | 'notifications' | 'system'>('messages');
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Connexion WebSocket
  useEffect(() => {
    const currentUser = getCurrentUser(); // Fonction à implémenter selon votre système d'auth
    if (!currentUser) return;

    const websocket = new WebSocket(`ws://localhost:5000/ws?userId=${currentUser.id}`);
    
    websocket.onopen = () => {
      console.log('Connexion WebSocket établie.'); // Traduit
      setWs(websocket);
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleWebSocketMessage(data);
    };

    websocket.onclose = () => {
      console.log('Connexion WebSocket fermée. Tentative de reconnexion...'); // Traduit
      // Reconnexion automatique après 5 secondes
      setTimeout(() => {
        window.location.reload(); // Peut-être une meilleure stratégie de reconnexion ici
      }, 5000);
    };

    websocket.onerror = (error) => {
      console.error('Erreur WebSocket :', error); // Traduit
    };

    return () => {
      websocket.close();
    };
  }, []);

  // Défilement automatique vers le bas des messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case 'message':
        setMessages(prev => [...prev, data.data]);
        if (!data.data.read) {
          setUnreadCount(prev => prev + 1);
        }
        break;
      
      case 'system_notification':
        setNotifications(prev => [...prev, data.data]);
        break;
      
      case 'system_status':
        setSystemStatus(data.data);
        break;
      
      case 'user_status':
        setUsers(prev => {
          const updated = prev.filter(u => u.id !== data.data.id);
          return [...updated, data.data];
        });
        break;
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !ws) return;

    const messageData = {
      to: selectedUser || 'all',
      content: newMessage,
      type: selectedUser ? 'direct' : 'broadcast',
      priority: 'normal'
    };

    ws.send(JSON.stringify(messageData));
    setNewMessage('');
  };

  const markNotificationAsResolved = (notificationId: string) => {
    // Appel API pour marquer comme résolu
    fetch(`/api/notifications/${notificationId}/resolve`, { method: 'POST' })
      .then(() => {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, resolved: true } : n)
        );
      });
  };

  const getCurrentUser = () => {
    // Implémentation selon votre système d'authentification
    return {
      id: 'current-user-id',
      username: 'Admin',
      role: 'admin' as const
    };
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      case 'info': return 'text-blue-500';
      case 'system': return 'text-gray-500';
      default: return 'text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'normal': return 'border-l-blue-500 bg-blue-50';
      case 'low': return 'border-l-gray-500 bg-gray-50';
      default: return 'border-l-gray-300 bg-white';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Bouton flottant */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-200 relative"
      >
        <MessageCircle size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panneau de messagerie */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
          {/* En-tête */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('messages')}
                className={`text-sm font-medium ${
                  activeTab === 'messages' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                }`}
              >
                <MessageCircle size={16} className="inline mr-1" />
                Messages
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`text-sm font-medium ${
                  activeTab === 'notifications' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                }`}
              >
                <Bell size={16} className="inline mr-1" />
                Alertes
              </button>
              <button
                onClick={() => setActiveTab('system')}
                className={`text-sm font-medium ${
                  activeTab === 'system' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                }`}
              >
                <Users size={16} className="inline mr-1" />
                Système
              </button>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <Minimize2 size={16} />
            </button>
          </div>

          {/* Contenu */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'messages' && (
              <div className="h-full flex flex-col">
                {/* Zone de messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg border-l-4 ${getPriorityColor(message.priority)}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm text-gray-800">
                          {message.from}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{message.content}</p>
                      {message.type === 'broadcast' && (
                        <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          Diffusion générale
                        </span>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Zone de saisie */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2 mb-2">
                    <select
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                      className="text-xs border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="">Tous</option>
                      {users.filter(u => u.isOnline).map(user => (
                        <option key={user.id} value={user.id}>{user.username}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Tapez votre message..."
                      className="flex-1 text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={sendMessage}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-2 transition-colors"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="h-full overflow-y-auto p-4 space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border ${
                      notification.resolved ? 'bg-gray-50 border-gray-200' : 'bg-white border-l-4'
                    } ${!notification.resolved ? 
                      notification.type === 'error' ? 'border-l-red-500' :
                      notification.type === 'warning' ? 'border-l-yellow-500' :
                      'border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          {notification.type === 'error' && <AlertTriangle size={16} className="text-red-500 mr-2" />}
                          {notification.type === 'warning' && <AlertTriangle size={16} className="text-yellow-500 mr-2" />}
                          {notification.type === 'info' && <CheckCircle size={16} className="text-blue-500 mr-2" />}
                          <span className={`text-sm font-medium ${getStatusColor(notification.type)}`}>
                            {notification.type.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{notification.message}</p>
                        <span className="text-xs text-gray-500">
                          {formatTime(notification.timestamp)}
                        </span>
                      </div>
                      {!notification.resolved && (
                        <button
                          onClick={() => markNotificationAsResolved(notification.id)}
                          className="text-gray-400 hover:text-gray-600 ml-2"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'system' && systemStatus && (
              <div className="h-full overflow-y-auto p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-blue-800">Mémoire</div>
                    <div className="text-lg font-bold text-blue-600">{systemStatus.memoryUsage}%</div>
                    <div className="w-full bg-blue-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${systemStatus.memoryUsage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-green-800">Disque</div>
                    <div className="text-lg font-bold text-green-600">{systemStatus.diskUsage}%</div>
                    <div className="w-full bg-green-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${systemStatus.diskUsage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-purple-800">Charge</div>
                    <div className="text-lg font-bold text-purple-600">{systemStatus.loadAverage.toFixed(2)}</div>
                  </div>
                  
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-orange-800">Connectés</div>
                    <div className="text-lg font-bold text-orange-600">{systemStatus.connectedUsers}</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-gray-800 mb-2">Utilisateurs en ligne</div>
                  <div className="space-y-1">
                    {users.filter(u => u.isOnline).map(user => (
                      <div key={user.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{user.username}</span>
                        <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagingPanel;
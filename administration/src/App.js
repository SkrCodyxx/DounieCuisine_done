import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001/api';

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('staff@dounie-cuisine.ca');
  const [resetCodes, setResetCodes] = useState([]);
  const [message, setMessage] = useState('');
  const [health, setHealth] = useState(null);
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    // Test connexion API
    axios.get(`${API_URL}/health`)
      .then(response => setHealth(response.data))
      .catch(error => console.error('API Error:', error));
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { username, password });
      setUser(response.data.user);
      setMessage(`✅ Connexion réussie - ${response.data.user.firstName}`);
      loadResetCodes();
      loadQuotes();
    } catch (error) {
      setMessage('❌ Erreur de connexion');
    }
  };

  const generateResetCode = async () => {
    if (!email) {
      setMessage('❌ Veuillez entrer un email');
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/admin/generate-password-reset`, { email });
      setMessage(`🔑 Code généré: ${response.data.resetCode} (valide 24h)`);
      loadResetCodes();
    } catch (error) {
      setMessage('❌ Erreur lors de la génération');
    }
  };

  const loadResetCodes = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/password-reset-codes`);
      setResetCodes(response.data);
    } catch (error) {
      console.error('Erreur chargement codes');
    }
  };

  const loadQuotes = async () => {
    try {
      const response = await axios.get(`${API_URL}/quotes`);
      setQuotes(response.data);
    } catch (error) {
      console.error('Erreur chargement devis');
    }
  };

  const createTestQuote = async () => {
    try {
      const quoteData = {
        clientId: 1,
        title: "Devis Test Dounie Cuisine",
        description: "Événement spécial cuisine haïtienne",
        subtotalHT: "500.00",
        status: "draft",
        validUntil: "2025-12-31"
      };
      const response = await axios.post(`${API_URL}/quotes`, quoteData);
      setMessage(`📋 Devis créé: ID ${response.data.id}`);
      loadQuotes();
    } catch (error) {
      setMessage('❌ Erreur création devis');
    }
  };

  const sendQuote = async (quoteId) => {
    try {
      const response = await axios.post(`${API_URL}/quotes/${quoteId}/send`);
      setMessage(`📧 ${response.data.message} - ${response.data.note || 'Envoi manuel requis'}`);
    } catch (error) {
      setMessage('❌ Erreur envoi devis');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg w-96">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">🛠️ Administration</h1>
            <p className="text-gray-600 mt-2">Dounie Cuisine</p>
            
            {/* Status API */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              {health ? (
                <span className="text-green-600 text-sm">✅ API: {health.service}</span>
              ) : (
                <span className="text-red-600 text-sm">❌ Connexion API...</span>
              )}
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => login('admin', 'Admin123!')}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              👑 Connexion Admin
            </button>
            <button
              onClick={() => login('staff', 'Staff123!')}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition font-medium"
            >
              👨‍💼 Connexion Staff
            </button>
          </div>
          
          {message && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm">
              {message}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">🍽️ Dounie Cuisine Admin</h1>
              <p className="text-gray-600 text-sm">Système de gestion restaurant</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-800">{user.firstName} {user.lastName}</p>
              <p className="text-sm text-gray-600">Rôle: {user.role}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Dashboard Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">🔑</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Codes Actifs</p>
                <p className="text-2xl font-bold text-gray-800">{resetCodes.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Devis Total</p>
                <p className="text-2xl font-bold text-gray-800">{quotes.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">API Status</p>
                <p className="text-lg font-bold text-green-600">✅ Online</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <span className="text-2xl">🍽️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Restaurant</p>
                <p className="text-lg font-bold text-gray-800">Haïtien</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Gestion Mots de Passe */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                🔑 Récupération Mots de Passe
              </h2>
              <p className="text-gray-600 text-sm mt-1">Générer des codes de récupération pour les utilisateurs</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Utilisateur
                  </label>
                  <select
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="staff@dounie-cuisine.ca">👨‍💼 Staff (staff@dounie-cuisine.ca)</option>
                    <option value="admin@dounie-cuisine.ca">👑 Admin (admin@dounie-cuisine.ca)</option>
                    <option value="client@dounie-cuisine.ca">👤 Client Test</option>
                  </select>
                </div>
                <button
                  onClick={generateResetCode}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition font-medium"
                >
                  🔑 Générer Code de Récupération
                </button>
              </div>
            </div>
          </div>

          {/* Codes Actifs */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-800">📋 Codes Actifs</h2>
                <p className="text-gray-600 text-sm mt-1">Codes de récupération en cours</p>
              </div>
              <button
                onClick={loadResetCodes}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition text-sm"
              >
                🔄 Actualiser
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {resetCodes.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Aucun code actif</p>
                ) : (
                  resetCodes.map((code, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-mono text-lg font-bold text-blue-600">
                            {code.code}
                          </div>
                          <div className="text-sm text-gray-600">📧 {code.email}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            ⏰ Expire: {new Date(code.expiresAt).toLocaleString('fr-CA')}
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          Actif
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Gestion Devis */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">📋 Gestion Devis</h2>
              <p className="text-gray-600 text-sm mt-1">Système de devis avec notification manuelle</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <button
                  onClick={createTestQuote}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition font-medium"
                >
                  ➕ Créer Devis Test
                </button>
                <button
                  onClick={loadQuotes}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  📋 Voir Tous les Devis
                </button>
              </div>
            </div>
          </div>

          {/* Actions Rapides */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">⚡ Actions Rapides</h2>
              <p className="text-gray-600 text-sm mt-1">Raccourcis administration</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3">
                <button className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition text-center">
                  <div className="text-2xl mb-2">🍽️</div>
                  <div className="text-sm font-medium">Menu</div>
                </button>
                <button className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition text-center">
                  <div className="text-2xl mb-2">📅</div>
                  <div className="text-sm font-medium">Réservations</div>
                </button>
                <button className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition text-center">
                  <div className="text-2xl mb-2">👥</div>
                  <div className="text-sm font-medium">Clients</div>
                </button>
                <button className="p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition text-center">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="text-sm font-medium">Rapports</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Message de retour */}
        {message && (
          <div className="mt-8">
            <div className={`p-4 rounded-lg border ${
              message.includes('✅') || message.includes('🔑') || message.includes('📋') || message.includes('📧')
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              {message}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

function App() {
  const [health, setHealth] = useState(null);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Test de connexion API
    axios.get(`${API_URL}/health`)
      .then(response => setHealth(response.data))
      .catch(error => console.error('API Error:', error));
  }, []);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, {
        code: resetCode,
        newPassword: newPassword
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Erreur lors de la réinitialisation');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-red-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-center">🍽️ Dounie Cuisine</h1>
          <p className="text-center text-red-100 mt-2">Restaurant Haïtien Authentique - Montréal</p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            Saveurs Authentiques d'Haïti
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Découvrez les délices de la cuisine haïtienne traditionnelle dans une ambiance chaleureuse et accueillante.
          </p>
          
          {/* Status API */}
          <div className="mb-8 p-4 bg-white rounded-lg shadow-md max-w-md mx-auto">
            <h3 className="font-semibold mb-2">État du système:</h3>
            {health ? (
              <span className="text-green-600">✅ API Connectée ({health.service})</span>
            ) : (
              <span className="text-red-600">❌ Connexion API en cours...</span>
            )}
          </div>
        </div>
      </section>

      {/* Menu Preview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Nos Spécialités</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg shadow-md border">
              <div className="text-4xl mb-4">🍗</div>
              <h3 className="text-xl font-semibold mb-2">Poule nan Sos</h3>
              <p className="text-gray-600">Poulet traditionnel en sauce créole</p>
              <p className="text-red-600 font-bold mt-2">24.99$ CAD</p>
            </div>
            <div className="text-center p-6 rounded-lg shadow-md border">
              <div className="text-4xl mb-4">🍚</div>
              <h3 className="text-xl font-semibold mb-2">Riz Collé aux Pois</h3>
              <p className="text-gray-600">Riz aux haricots rouges, plat national</p>
              <p className="text-red-600 font-bold mt-2">18.99$ CAD</p>
            </div>
            <div className="text-center p-6 rounded-lg shadow-md border">
              <div className="text-4xl mb-4">🐟</div>
              <h3 className="text-xl font-semibold mb-2">Poisson Gros Sel</h3>
              <p className="text-gray-600">Poisson grillé aux épices créoles</p>
              <p className="text-red-600 font-bold mt-2">28.99$ CAD</p>
            </div>
          </div>
        </div>
      </section>

      {/* Récupération Mot de Passe */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-md">
          <h2 className="text-2xl font-bold text-center mb-8">Réinitialiser Mot de Passe</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handlePasswordReset}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Code de Récupération
                </label>
                <input
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                  placeholder="Entrez votre code"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nouveau Mot de Passe
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                  placeholder="Minimum 8 caractères"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-200"
              >
                Réinitialiser
              </button>
            </form>
            {message && (
              <div className={`mt-4 p-3 rounded ${message.includes('succès') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Nous Contacter</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">📍 Adresse</h3>
              <p>1234 Rue Saint-Denis<br />Montréal, QC H2X 3K2</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">📞 Téléphone</h3>
              <p>(514) 123-4567</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">📧 Email</h3>
              <p>info@dounie-cuisine.ca</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Dounie Cuisine. Tous droits réservés.</p>
          <p className="text-gray-400 mt-2">Système de gestion restaurant v1.0</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
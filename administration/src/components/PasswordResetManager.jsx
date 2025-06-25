import React, { useState, useEffect } from 'react';

export function PasswordResetManager() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resetInfo, setResetInfo] = useState(null);
  const [activeCodes, setActiveCodes] = useState([]);

  useEffect(() => {
    loadActiveCodes();
  }, []);

  const loadActiveCodes = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/password-reset-codes`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const codes = await response.json();
        setActiveCodes(codes);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des codes:', err);
    }
  };

  const generateResetCode = async () => {
    if (!email.trim()) {
      setError('Veuillez entrer une adresse email');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/generate-password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResetInfo(data);
        setMessage('Code de récupération généré avec succès!');
        setEmail('');
        loadActiveCodes();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copié dans le presse-papiers!');
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-600 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">
            Gestion de la récupération de mot de passe
          </h2>
          <p className="text-blue-100 text-sm mt-1">
            Générer des codes de récupération pour les clients
          </p>
        </div>

        <div className="p-6">
          {/* Génération de nouveau code */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Générer un nouveau code de récupération
            </h3>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Adresse email du client"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={generateResetCode}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Génération...' : 'Générer le code'}
              </button>
            </div>

            {message && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-4">
                <p className="text-green-700 text-sm">{message}</p>
              </div>
            )}

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {resetInfo && (
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-md p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="text-yellow-600 text-2xl">📋</span>
                  </div>
                  <div className="ml-3 flex-1">
                    <h4 className="text-yellow-800 font-medium mb-3">
                      Code de récupération généré
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-yellow-800">Code:</p>
                        <div className="flex items-center gap-2">
                          <code className="bg-yellow-100 px-2 py-1 rounded font-mono text-lg">
                            {resetInfo.resetCode}
                          </code>
                          <button
                            onClick={() => copyToClipboard(resetInfo.resetCode)}
                            className="text-yellow-600 hover:text-yellow-800"
                            title="Copier le code"
                          >
                            📋
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <p className="font-medium text-yellow-800">Expire le:</p>
                        <p className="text-yellow-700">
                          {new Date(resetInfo.expiresAt).toLocaleString('fr-FR')}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="font-medium text-yellow-800">URL de récupération:</p>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="text"
                          value={resetInfo.resetUrl}
                          readOnly
                          className="flex-1 px-2 py-1 bg-yellow-100 border border-yellow-300 rounded text-sm"
                        />
                        <button
                          onClick={() => copyToClipboard(resetInfo.resetUrl)}
                          className="text-yellow-600 hover:text-yellow-800"
                          title="Copier l'URL"
                        >
                          📋
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-yellow-100 rounded">
                      <p className="text-yellow-800 text-sm">
                        <strong>Instructions:</strong> {resetInfo.instructions}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Codes actifs */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Codes de récupération actifs
              </h3>
              <button
                onClick={loadActiveCodes}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                🔄 Actualiser
              </button>
            </div>

            {activeCodes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Aucun code de récupération actif</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Expire le
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Temps restant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activeCodes.map((codeInfo) => (
                      <tr key={codeInfo.code}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                          {codeInfo.code}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {codeInfo.user ? (
                            <div>
                              <p className="font-medium">{codeInfo.user.firstName} {codeInfo.user.lastName}</p>
                              <p className="text-gray-500">{codeInfo.user.email}</p>
                            </div>
                          ) : (
                            'Utilisateur non trouvé'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(codeInfo.expires).toLocaleString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {codeInfo.timeRemaining}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => copyToClipboard(codeInfo.code)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Copier
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
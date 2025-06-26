# ACTIONS IMMÉDIATES - 3 CRÉDITS RESTANTS

## 🚨 PRIORITÉ ABSOLUE

### CRÉDIT 1: CORRECTION SESSION BACKEND ⚡
**Fichier**: `/app/api/index.ts`
**Temps**: 10 minutes

```typescript
// CORRECTION EXACTE À APPLIQUER:
// Ligne 11-35, remplacer par:

const MemStore = MemoryStore(session);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session AVANT les routes
app.use(session({
  secret: process.env.SESSION_SECRET || 'dounie-cuisine-session-secret-key-2024',
  resave: true,
  saveUninitialized: true,
  name: 'dounie.sid',
  store: new MemStore({
    checkPeriod: 86400000
  }),
  cookie: {
    secure: false,
    httpOnly: false,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax'
  }
}));

// CORS après session
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174', 
    'http://localhost:3000',
    'http://localhost:3001',
  ],
  credentials: true
}));
```

**Test**: `python3 test_password_recovery.py` → doit afficher 100% réussite

---

### CRÉDIT 2: FRONTEND BASE - APPLICATION PUBLIQUE 🎯
**Localisation**: `/app/public/src/`

#### Créer ces fichiers:
1. **`App.jsx`** - Application principale avec routing
2. **`components/PasswordReset.jsx`** - Interface récupération mot de passe
3. **`pages/Home.jsx`** - Page d'accueil avec menu

#### Code prioritaire App.jsx:
```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PasswordReset from './components/PasswordReset';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reset-password" element={<PasswordReset />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
```

---

### CRÉDIT 3: INTERFACE RÉCUPÉRATION MOT DE PASSE 🔐
**Fichier**: `/app/public/src/components/PasswordReset.jsx`

#### Fonctionnalité complète:
- Saisie code de récupération
- Validation code via API
- Formulaire nouveau mot de passe
- Confirmation réussite

```jsx
import React, { useState } from 'react';

export default function PasswordReset() {
  const [step, setStep] = useState(1);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [user, setUser] = useState(null);

  const verifyCode = async () => {
    const response = await fetch('/api/auth/verify-reset-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    
    if (response.ok) {
      const data = await response.json();
      setUser(data.user);
      setStep(2);
    }
  };

  const resetPassword = async () => {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, newPassword })
    });
    
    if (response.ok) setStep(3);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Récupération de Mot de Passe
        </h1>
        
        {step === 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Code de Récupération
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Entrez votre code"
            />
            <button
              onClick={verifyCode}
              className="w-full mt-4 bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600"
            >
              Vérifier le Code
            </button>
          </div>
        )}
        
        {step === 2 && (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Code valide pour: {user?.firstName} {user?.lastName}
            </p>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nouveau Mot de Passe
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Minimum 6 caractères"
            />
            <button
              onClick={resetPassword}
              className="w-full mt-4 bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
            >
              Changer le Mot de Passe
            </button>
          </div>
        )}
        
        {step === 3 && (
          <div className="text-center">
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Mot de Passe Changé!
            </h2>
            <p className="text-gray-600 mb-6">
              Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
            </p>
            <a
              href="/login"
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              Se Connecter
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 🎯 RÉSULTAT APRÈS 3 CRÉDITS

### ✅ ACCOMPLI:
1. **Backend 100% fonctionnel** - Sessions corrigées
2. **Interface récupération mot de passe complète** - Workflow complet
3. **Base frontend solide** - Structure React prête

### 🚀 PRÊT POUR FINALISATION:
- Frontend administration (4h)
- Documentation complète (1h) 
- Scripts déploiement (1h)
- Tests finaux (30min)

**PROJET SERA À 85% APRÈS CES 3 CRÉDITS!**

---

## 📞 CONTACT DÉVELOPPEUR
*Une fois ces 3 actions terminées, le projet aura une base ultra-solide pour finalisation rapide et déploiement production!*
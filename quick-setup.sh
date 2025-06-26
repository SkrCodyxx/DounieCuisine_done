#!/bin/bash

# Script de configuration rapide pour Dounie Cuisine
echo "🚀 Configuration rapide de Dounie Cuisine..."

# Configurer la base de données
echo "🗄️ Configuration de la base de données..."
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'password';" 2>/dev/null || true

# Mettre à jour l'URL de base de données dans .env pour une configuration locale simplifiée
cd /app/api
cat > .env << EOF
# Configuration PostgreSQL locale simplifiée
DATABASE_URL=postgresql://postgres:password@localhost:5432/dounie_cuisine

# Configuration de l'application
NODE_ENV=development
SESSION_SECRET=dounie-cuisine-dev-session-key-${RANDOM}
API_PORT=5000
PUBLIC_PORT=3000
ADMIN_PORT=3001

# Configuration emails (désactivé)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
EOF

# Build de l'API
echo "🏗️ Build de l'API..."
npm run build

# Configuration pour les applications frontend
cd ../public
echo "VITE_API_URL=http://localhost:5000" > .env

cd ../administration  
echo "VITE_API_URL=http://localhost:5000" > .env

echo "✅ Configuration terminée!"
echo "📝 Prochaines étapes:"
echo "   1. Démarrer l'API: cd /app && node api-server.js"
echo "   2. Démarrer le frontend public: cd /app/public && npm run dev"
echo "   3. Démarrer l'admin: cd /app/administration && npm run dev"
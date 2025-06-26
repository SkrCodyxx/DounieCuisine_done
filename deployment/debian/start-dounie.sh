#!/bin/bash

# Script de démarrage pour Dounie Cuisine avec PM2
echo "🚀 Démarrage de Dounie Cuisine avec PM2..."

# Vérifier PostgreSQL
if ! service postgresql status >/dev/null 2>&1; then
    echo "📦 Démarrage de PostgreSQL..."
    service postgresql start
fi

# Arrêter les processus existants
pm2 delete dounie-api 2>/dev/null || true
pm2 delete dounie-public 2>/dev/null || true
pm2 delete dounie-admin 2>/dev/null || true

# Démarrer l'API
echo "🔧 Démarrage de l'API..."
pm2 start api-server.js --name dounie-api

# Attendre que l'API soit prête
echo "⏳ Attente de l'API..."
sleep 10

# Vérifier l'état de l'API
if curl -f http://localhost:5000/api/health >/dev/null 2>&1; then
    echo "✅ API démarrée avec succès!"
else
    echo "❌ Échec du démarrage de l'API"
    pm2 logs dounie-api --lines 20
    exit 1
fi

# Build et démarrage des applications frontend
echo "🎨 Build des applications frontend..."

# Public
cd public
npm run build
pm2 serve dist 3000 --name dounie-public --spa

# Administration  
cd ../administration
npm run build
pm2 serve dist 3001 --name dounie-admin --spa

# Sauvegarde de la configuration PM2
pm2 save

echo ""
echo "🎉 Dounie Cuisine démarré avec succès!"
echo ""
echo "📍 URLs d'accès:"
echo "   🌐 Site Public: http://localhost:3000"
echo "   ⚙️  Administration: http://localhost:3001"
echo "   🔗 API: http://localhost:5000"
echo ""
echo "📊 Gestion:"
echo "   Status: pm2 status"
echo "   Logs: pm2 logs"
echo "   Restart: pm2 restart all"
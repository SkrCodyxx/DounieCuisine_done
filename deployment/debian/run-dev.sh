#!/bin/bash

echo "Starting Dounie Cuisine Restaurant Management System..."

# Start API server in background
cd api
echo "Starting API server on port 5000..."
npx tsx index.ts &
API_PID=$!

# Wait for API to start
sleep 3

# Start public app in background
cd ../public
echo "Starting public app on port 3000..."
npm run dev &
PUBLIC_PID=$!

# Start admin app in background
cd ../administration
echo "Starting admin app on port 3001..."
npm run dev &
ADMIN_PID=$!

cd ..

echo "All services started:"
echo "- API: http://localhost:5000"
echo "- Public: http://localhost:3000" 
echo "- Admin: http://localhost:3001"

# Function to cleanup on exit
cleanup() {
    echo "Stopping all services..."
    kill $API_PID $PUBLIC_PID $ADMIN_PID 2>/dev/null
    exit
}

# Set trap for cleanup
trap cleanup SIGINT SIGTERM

# Keep script running
wait
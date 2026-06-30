#!/bin/bash

# Bash script to start both BookShopAPI and Next.js frontend
# Usage: ./start-dev.sh

echo "🚀 Starting BookShop Development Environment..."

# Check if we're in the correct directory
if [ ! -d "BookShopAPI" ] || [ ! -d "frondbookshop" ]; then
    echo "❌ Error: Please run this script from the root directory containing both BookShopAPI and frondbookshop folders"
    exit 1
fi

# Function to start API
start_api() {
    echo "🔧 Starting BookShop API..."
    cd BookShopAPI
    dotnet run --urls=https://localhost:7000 &
    API_PID=$!
    cd ..
}

# Function to start Frontend
start_frontend() {
    echo "🎨 Starting Next.js Frontend..."
    cd frondbookshop
    npm run dev &
    FRONTEND_PID=$!
    cd ..
}

# Start both services
start_api
sleep 3
start_frontend

echo "✅ Both services are starting..."
echo "📱 Frontend: http://localhost:3000"
echo "🔗 API: https://localhost:7000"
echo "📚 API Docs: https://localhost:7000/swagger"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
trap 'echo "🛑 Stopping services..."; kill $API_PID $FRONTEND_PID 2>/dev/null; exit' INT
wait

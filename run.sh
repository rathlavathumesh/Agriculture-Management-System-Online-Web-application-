#!/bin/bash

echo "🚀 Starting Agriculture Management System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Run: brew install node"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Backend setup
echo "📦 Setting up backend..."
cd backend

# Install dependencies
echo "Installing backend dependencies..."
npm config set registry https://registry.npmmirror.com/
npm install

# Create .env file
echo "Creating .env file..."
cat > .env << 'EOF'
PORT=4000
JWT_SECRET=change_me
EOF

# Create database tables
echo "Creating database tables..."
npm run sync

# Start backend in background
echo "🚀 Starting backend server..."
npm start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Frontend setup
echo "📦 Setting up frontend..."
cd ../frontend

# Install dependencies
echo "Installing frontend dependencies..."
npm config set registry https://registry.npmmirror.com/
npm install

# Create .env file only if missing; allow override via env var VITE_API_URL
if [ ! -f .env ]; then
  echo "Creating frontend .env file..."
  API_URL_VALUE=${VITE_API_URL:-http://localhost:4000/api}
  echo "VITE_API_URL=$API_URL_VALUE" > .env
else
  echo "frontend/.env exists, not overwriting. Current API URL will be used."
fi

# Start frontend
echo "🚀 Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🎉 Agriculture Management System is running!"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://localhost:4000/api"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
trap "echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait

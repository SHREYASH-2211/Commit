#!/bin/bash

echo "🚀 Starting Strategy API Integration Test"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📁 Current directory: $(pwd)"
echo ""

# Start backend
echo "🔧 Starting Backend Server..."
cd backend
if [ ! -f "package.json" ]; then
    echo "❌ Backend directory not found"
    exit 1
fi

echo "📦 Installing backend dependencies..."
npm install

echo "🚀 Starting backend server on port 8000..."
npm start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Go back to root and start frontend
cd ../stratify-trade-craft-main

echo ""
echo "🔧 Starting Frontend Server..."
if [ ! -f "package.json" ]; then
    echo "❌ Frontend directory not found"
    kill $BACKEND_PID
    exit 1
fi

echo "📦 Installing frontend dependencies..."
npm install

echo "🚀 Starting frontend server on port 8080..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers are starting..."
echo ""
echo "🌐 Frontend: http://localhost:8080"
echo "🔧 Backend: http://localhost:8000"
echo ""
echo "📋 Testing Steps:"
echo "1. Open http://localhost:8080 in your browser"
echo "2. Login or create an account"
echo "3. Navigate to Strategy Builder"
echo "4. Create a new strategy"
echo "5. Check Dashboard for your strategy"
echo ""
echo "🛑 To stop servers: Press Ctrl+C"

# Wait for user to stop
wait

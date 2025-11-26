#!/bin/bash
# Start script for Food Evaluator - Unix/Linux/Mac
# This starts both backend and frontend in development mode with hot-reloading

echo "Starting Food Evaluator..."
echo ""

# Start backend in background
echo "Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to initialize
sleep 3

# Start frontend in background
echo "Starting frontend application..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

# Save PIDs to file for stop script
echo $BACKEND_PID > .backend.pid
echo $FRONTEND_PID > .frontend.pid

echo ""
echo "========================================"
echo "Food Evaluator is starting!"
echo "========================================"
echo "Backend:  http://localhost:3001"
echo "Frontend: http://localhost:3000"
echo ""
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Run ./stop.sh to stop both servers"
echo "========================================"

#!/bin/bash
# Stop script for Food Evaluator - Unix/Linux/Mac
# This stops both backend and frontend servers

echo "Stopping Food Evaluator..."
echo ""

# Read PIDs from file and kill processes
if [ -f .backend.pid ]; then
    BACKEND_PID=$(cat .backend.pid)
    echo "Stopping backend server (PID: $BACKEND_PID)..."
    kill $BACKEND_PID 2>/dev/null && echo "Backend stopped" || echo "Backend not running"
    rm .backend.pid
else
    echo "Backend PID file not found, attempting to kill by port..."
    lsof -ti:3001 | xargs kill -9 2>/dev/null && echo "Backend stopped" || echo "Backend not running"
fi

if [ -f .frontend.pid ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    echo "Stopping frontend server (PID: $FRONTEND_PID)..."
    kill $FRONTEND_PID 2>/dev/null && echo "Frontend stopped" || echo "Frontend not running"
    rm .frontend.pid
else
    echo "Frontend PID file not found, attempting to kill by port..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null && echo "Frontend stopped" || echo "Frontend not running"
fi

echo ""
echo "========================================"
echo "Food Evaluator stopped!"
echo "========================================"

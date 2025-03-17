#!/bin/bash
# Script to start the backend services

echo "Starting backend server..."

# Create logs directory if it doesn't exist
mkdir -p /app/logs

# Print Python and dependency information for debugging
echo "Python version:"
python --version
echo "Installed packages:"
pip freeze > /app/logs/pip_packages.log
echo "Package list saved to /app/logs/pip_packages.log"

# Start health check server
python /app/health_check.py > /app/logs/health.log 2>&1 &
HEALTH_PID=$!
echo "Health check server started with PID: $HEALTH_PID"

# Start run_core.py in background with proper logging
echo "Starting core service..."
python -u /app/run_core.py > /app/logs/core.log 2>&1 &
CORE_PID=$!

# Wait and check if core service started correctly
sleep 5
if ! ps -p $CORE_PID > /dev/null; then
    echo "Error: Core service failed to start. Check /app/logs/core.log for details."
    echo "Last 20 lines of core.log:"
    tail -n 20 /app/logs/core.log
    # We'll continue despite the failure to see if other components work
fi

if ps -p $CORE_PID > /dev/null; then
    echo "Core service started with PID: $CORE_PID"
else
    echo "WARNING: Core service is not running!"
fi

# Start deploy.py using llama-run.sh with proper logging
echo "Starting workflow deployment..."
/app/llama-run.sh -f deploy.py > /app/logs/deploy.log 2>&1 &
DEPLOY_PID=$!

# Wait and check if workflow deployment started correctly
sleep 5
if ! ps -p $DEPLOY_PID > /dev/null; then
    echo "Error: Workflow deployment failed to start. Check /app/logs/deploy.log for details."
    echo "Last 20 lines of deploy.log:"
    tail -n 20 /app/logs/deploy.log
    # Don't exit as we may want to continue even if workflow deployment fails
    echo "Continuing despite workflow deployment failure..."
fi

if ps -p $DEPLOY_PID > /dev/null; then
    echo "Workflow deployment started with PID: $DEPLOY_PID"
else
    echo "WARNING: Workflow deployment is not running!"
fi

# Handle SIGTERM and SIGINT to gracefully shutdown services
trap 'echo "Received shutdown signal. Stopping services..."; kill $HEALTH_PID $CORE_PID $DEPLOY_PID 2>/dev/null; exit 0' SIGTERM SIGINT

# Keep container running and display logs
echo "Backend services running. Streaming logs..."
echo "View separate logs with: docker exec kimfe-backend cat /app/logs/core.log"
echo "View package list with: docker exec kimfe-backend cat /app/logs/pip_packages.log"

# Keep the container running
tail -f /app/logs/core.log /app/logs/deploy.log /app/logs/health.log

#!/bin/bash

# Build and Deployment Verification Script
# This script helps verify the project build and deployment steps

echo "Starting verification process..."
echo "==============================="

# Check node and npm versions
echo "Checking Node.js version..."
node -v
echo "Checking pnpm version..."
pnpm --version

# Clean build artifacts
echo "Cleaning previous build artifacts..."
rm -rf .next
rm -rf node_modules/.cache

# Install dependencies
echo "Installing dependencies..."
pnpm install
if [ $? -ne 0 ]; then
  echo "Error: Failed to install dependencies"
  exit 1
fi
echo "Dependencies installed successfully"

# Run TypeScript check
echo "Running TypeScript check..."
pnpm tsc --noEmit
if [ $? -ne 0 ]; then
  echo "Error: TypeScript check failed"
  exit 1
fi
echo "TypeScript check passed"

# Run build
echo "Building project..."
pnpm build
if [ $? -ne 0 ]; then
  echo "Error: Build failed"
  exit 1
fi
echo "Build completed successfully"

# Check if Docker is running
echo "Checking if Docker is running..."
docker info > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "Error: Docker is not running"
  exit 1
fi
echo "Docker is running"

# Ask for confirmation before starting Docker containers
echo "Do you want to start Docker containers? (y/n)"
read response
if [ "$response" = "y" ]; then
  echo "Starting Docker containers..."
  docker compose up -d
  if [ $? -ne 0 ]; then
    echo "Error: Failed to start Docker containers"
    exit 1
  fi
  echo "Docker containers started successfully"

  # Wait for services to be ready
  echo "Waiting for services to be ready..."
  sleep 10

  # Check if Supabase is running
  echo "Checking if Supabase is accessible..."
  curl -s http://localhost:54321/health > /dev/null
  if [ $? -ne 0 ]; then
    echo "Warning: Supabase health check failed"
  else
    echo "Supabase is accessible"
  fi

  # Check if frontend is accessible
  echo "Checking if frontend is accessible..."
  curl -s http://localhost:3000 > /dev/null
  if [ $? -ne 0 ]; then
    echo "Warning: Frontend check failed"
  else
    echo "Frontend is accessible"
  fi
fi

echo "==============================="
echo "Verification process completed!"
echo "Please check the above output for any errors or warnings."

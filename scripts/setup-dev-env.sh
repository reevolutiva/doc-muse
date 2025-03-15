#!/bin/bash

# Doc-Muse Development Environment Setup Script
# This script automates the process of setting up the development environment for Doc-Muse

set -e  # Exit on error

# Color codes for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}===========================================================${NC}"
echo -e "${GREEN}Doc-Muse Development Environment Setup${NC}"
echo -e "${BLUE}===========================================================${NC}"

# Check for required tools
echo -e "\n${YELLOW}Checking for required tools...${NC}"

command -v git >/dev/null 2>&1 || { echo -e "${RED}Error: git is not installed.${NC}" >&2; exit 1; }
echo -e "✓ Git is installed"

command -v node >/dev/null 2>&1 || { echo -e "${RED}Error: Node.js is not installed.${NC}" >&2; exit 1; }
NODE_VERSION=$(node -v | cut -d 'v' -f 2)
echo -e "✓ Node.js ${NODE_VERSION} is installed"

# Check Node.js version
if [ "$(printf '%s\n' "18.0.0" "$NODE_VERSION" | sort -V | head -n1)" != "18.0.0" ]; then
  echo -e "${RED}Error: Node.js version 18.x or higher is required.${NC}" >&2
  exit 1
fi

command -v pnpm >/dev/null 2>&1 || { echo -e "${RED}Error: pnpm is not installed. Please install it with 'npm install -g pnpm'.${NC}" >&2; exit 1; }
echo -e "✓ pnpm is installed"

command -v docker >/dev/null 2>&1 || { echo -e "${YELLOW}Warning: Docker is not installed. It's required for container-based deployment.${NC}" >&2; }
if command -v docker >/dev/null 2>&1; then
  echo -e "✓ Docker is installed"
fi

# Step 1: Clone repository if needed
echo -e "\n${YELLOW}Step 1: Repository Setup${NC}"

REPO_DIR="doc-muse"
if [ -d "$REPO_DIR" ]; then
  echo -e "Repository directory already exists. Skipping clone."
  cd "$REPO_DIR"
  echo -e "Updating repository..."
  git pull
else
  echo -e "Cloning Doc-Muse repository..."
  git clone https://github.com/kimfe/doc-muse.git
  cd "$REPO_DIR"
fi

# Step 2: Supabase Configuration
echo -e "\n${YELLOW}Step 2: Supabase Configuration${NC}"
echo -e "You need to have a Supabase project set up at https://supabase.com/dashboard"
echo -e "Please have your Supabase URL and anon key ready."

read -p "Do you have a Supabase project already? (y/n): " has_supabase

if [ "$has_supabase" != "y" ]; then
  echo -e "${BLUE}Please follow these steps to create a Supabase project:${NC}"
  echo -e "1. Go to https://supabase.com/dashboard"
  echo -e "2. Create a new organization (if you don't have one)"
  echo -e "3. Create a new project within that organization"
  echo -e "4. Once created, find your project URL and anon key in the project settings"
  echo -e "${YELLOW}Press any key when you're ready to continue...${NC}"
  read -n 1
fi

# Set up environment variables
echo -e "\nSetting up environment variables..."
if [ ! -f .env.local ]; then
  cp .env.example .env.local 2>/dev/null || echo -e "NEXT_PUBLIC_SUPABASE_URL=your-supabase-url\nNEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key" > .env.local
  echo -e "Created .env.local file"
fi

read -p "Enter your Supabase URL: " supabase_url
read -p "Enter your Supabase anon key: " supabase_anon_key

# Update the .env.local file
sed -i.bak "s|NEXT_PUBLIC_SUPABASE_URL=.*|NEXT_PUBLIC_SUPABASE_URL=${supabase_url}|g" .env.local
sed -i.bak "s|NEXT_PUBLIC_SUPABASE_ANON_KEY=.*|NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabase_anon_key}|g" .env.local
rm .env.local.bak

echo -e "✓ Environment variables configured"

# Step 3: Initialize Supabase Database
echo -e "\n${YELLOW}Step 3: Initialize Supabase Database${NC}"
echo -e "${BLUE}To initialize your Supabase database:${NC}"
echo -e "1. Go to the SQL Editor in your Supabase dashboard"
echo -e "2. Look for SQL migration files in the supabase/migrations/ directory"
echo -e "3. Run these SQL scripts in the Supabase SQL Editor to set up your database schema"

if [ -d "supabase/migrations" ]; then
  echo -e "\nMigration files found. You should run these SQL scripts in your Supabase project."
  ls -la supabase/migrations
else
  echo -e "\nNo migration files found. Please check the repository structure or documentation."
fi

read -p "Have you run the database migrations? (y/n): " run_migrations
if [ "$run_migrations" != "y" ]; then
  echo -e "${YELLOW}Please run the migrations before continuing.${NC}"
  echo -e "Press any key when you're ready to continue..."
  read -n 1
fi

# Step 4: Install dependencies
echo -e "\n${YELLOW}Step 4: Installing dependencies...${NC}"
pnpm install
echo -e "✓ Dependencies installed"

# Step 5: Docker setup
echo -e "\n${YELLOW}Step 5: Docker Setup${NC}"
if command -v docker >/dev/null 2>&1; then
  read -p "Do you want to build and run with Docker? (y/n): " use_docker
  if [ "$use_docker" = "y" ]; then
    echo -e "Building Docker image..."
    docker build -t doc-muse .
    
    echo -e "Starting Docker container..."
    docker run -p 3000:3000 --env-file .env.local -d --name doc-muse-container doc-muse
    
    echo -e "✓ Docker container started on http://localhost:3000"
  else
    echo -e "Skipping Docker setup"
  fi
else
  echo -e "${YELLOW}Docker not found. Skipping Docker setup.${NC}"
fi

# Step 6: Local development setup
echo -e "\n${YELLOW}Step 6: Local Development Setup${NC}"
if [ "$use_docker" != "y" ] || [ -z "$use_docker" ]; then
  read -p "Do you want to start the local development server? (y/n): " start_local
  if [ "$start_local" = "y" ]; then
    echo -e "Starting development server..."
    pnpm dev &
    DEV_PID=$!
    echo -e "✓ Development server started on http://localhost:3000"
    echo -e "  (Press Ctrl+C to stop)"
  fi
fi

# Final message
echo -e "\n${GREEN}===========================================================${NC}"
echo -e "${GREEN}Doc-Muse development environment setup complete!${NC}"
echo -e "${BLUE}You can access the application at: http://localhost:3000${NC}"
echo -e "${BLUE}===========================================================${NC}"

echo -e "\n${YELLOW}Useful commands:${NC}"
echo -e "- To start the development server: ${BLUE}pnpm dev${NC}"
echo -e "- To check types and linting: ${BLUE}pnpm check${NC}"
echo -e "- To format code: ${BLUE}pnpm format:write${NC}"
echo -e "- To build for production: ${BLUE}pnpm build${NC}"

if [ "$start_local" = "y" ]; then
  # Keep the script running until user interrupts
  trap "kill $DEV_PID 2>/dev/null || true" EXIT
  wait $DEV_PID
fi

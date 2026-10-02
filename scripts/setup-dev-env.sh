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

# Helper function for Git checks
check_git_repo() {
    if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

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

# Step 1: Repository Setup
echo -e "\n${YELLOW}Step 1: Repository Setup${NC}"

# Check if we're already in a git repository
if check_git_repo; then
    REPO_DIR=$(basename $(git rev-parse --show-toplevel))
    echo -e "✓ Already in git repository: ${REPO_DIR}"
else
    # Ask for repository URL
    read -p "Enter the repository URL (e.g., https://github.com/user/repo.git): " REPO_URL
    REPO_DIR=$(basename "${REPO_URL}" .git)
    
    if [ -d "$REPO_DIR" ]; then
        echo -e "Directory ${REPO_DIR} already exists"
        read -p "Do you want to use the existing directory? (y/n): " use_existing
        
        if [ "$use_existing" = "y" ]; then
            cd "$REPO_DIR"
            if ! check_git_repo; then
                echo -e "Initializing git repository..."
                git init
                git remote add origin "$REPO_URL"
            fi
        else
            echo -e "Backing up existing directory..."
            mv "$REPO_DIR" "${REPO_DIR}_backup_$(date +%Y%m%d_%H%M%S)"
            echo -e "Cloning repository..."
            git clone "$REPO_URL"
            cd "$REPO_DIR"
        fi
    else
        echo -e "Cloning repository..."
        git clone "$REPO_URL"
        cd "$REPO_DIR"
    fi
fi

# Step 2: Supabase Project Credentials
echo -e "\n${YELLOW}Step 2: Supabase Project Credentials${NC}"
echo -e "You need to have your own Supabase project set up at https://supabase.com/dashboard"
echo -e "Please have your personal Supabase URL and anon key ready."

read -p "Do you already have your own Supabase project credentials? (y/n): " has_supabase

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
if [ -f .env.local ]; then
  echo -e "✓ .env.local file detected"
  
  # Obtener los valores actuales de las variables
  supabase_url=$(grep NEXT_PUBLIC_SUPABASE_URL .env.local | cut -d '=' -f2)
  supabase_anon_key=$(grep NEXT_PUBLIC_SUPABASE_ANON_KEY .env.local | cut -d '=' -f2)
  
  # Verificar si las variables tienen valores válidos
  if [ -z "$supabase_url" ] || [ "$supabase_url" = "your-supabase-url" ]; then
    read -p "Enter your Supabase URL: " supabase_url
    sed -i.bak "s|NEXT_PUBLIC_SUPABASE_URL=.*|NEXT_PUBLIC_SUPABASE_URL=${supabase_url}|g" .env.local
  else
    echo -e "✓ Supabase URL already configured: $supabase_url"
  fi
  
  if [ -z "$supabase_anon_key" ] || [ "$supabase_anon_key" = "your-supabase-anon-key" ]; then
    read -p "Enter your Supabase anon key: " supabase_anon_key
    sed -i.bak "s|NEXT_PUBLIC_SUPABASE_ANON_KEY=.*|NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabase_anon_key}|g" .env.local
  else
    echo -e "✓ Supabase anon key already configured"
  fi
  
  # Limpiar archivos de respaldo si existen
  rm -f .env.local.bak
else
  cp .env.example .env.local 2>/dev/null || echo -e "NEXT_PUBLIC_SUPABASE_URL=your-supabase-url\nNEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key" > .env.local
  echo -e "Created .env.local file"

  read -p "Enter your Supabase URL: " supabase_url
  read -p "Enter your Supabase anon key: " supabase_anon_key

  # Update the .env.local file
  sed -i.bak "s|NEXT_PUBLIC_SUPABASE_URL=.*|NEXT_PUBLIC_SUPABASE_URL=${supabase_url}|g" .env.local
  sed -i.bak "s|NEXT_PUBLIC_SUPABASE_ANON_KEY=.*|NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabase_anon_key}|g" .env.local
  rm -f .env.local.bak
fi

echo -e "✓ Environment variables configured"

# Step 3: Initialize Supabase Database
echo -e "\n${YELLOW}Step 3: Initialize Supabase Database${NC}"

# Verificar la estructura de Supabase y configuración
echo -e "\n${YELLOW}Verificando configuración de Supabase...${NC}"

# Verificar existencia de archivos clave
if [ -f "supabase/config.toml" ] && [ -d "supabase/migrations" ]; then
    echo -e "✓ Estructura de Supabase encontrada"
    
    # Verificar si existe supabase CLI
    if ! command -v supabase &> /dev/null; then
        echo -e "${YELLOW}Instalando Supabase CLI...${NC}"
        pnpm add -g supabase
    fi
    
    # Verificar migrations
    MIGRATION_COUNT=$(ls -1 supabase/migrations/*.sql 2>/dev/null | wc -l)
    if [ $MIGRATION_COUNT -gt 0 ]; then
        echo -e "✓ Encontradas $MIGRATION_COUNT migraciones"
        echo -e "${BLUE}¿Desea aplicar las migraciones automáticamente? (y/n):${NC}"
        read auto_migrate
        
        if [ "$auto_migrate" = "y" ]; then
            echo -e "Aplicando migraciones..."
            
            echo -e "${BLUE}===========================================================${NC}"
            echo -e "${YELLOW}Configuración de las migraciones de base de datos${NC}"
            echo -e "${BLUE}===========================================================${NC}"
            echo -e "Esta pregunta determina cómo se aplicarán las migraciones de la base de datos:"
            echo -e ""
            echo -e "  ${GREEN}local${NC}: Si estás ejecutando Supabase en Docker localmente."
            echo -e "         • Se iniciará automáticamente una instancia local de Supabase"
            echo -e "         • Las migraciones se aplicarán automáticamente con 'supabase db reset'"
            echo -e ""
            echo -e "  ${GREEN}remoto${NC}: Si estás utilizando un proyecto hospedado en Supabase Cloud."
            echo -e "         • Recibirás instrucciones para aplicar migraciones manualmente"
            echo -e "         • Necesitarás acceder al dashboard de Supabase y usar el SQL Editor"
            echo -e ""
            read -p "¿Estás utilizando Supabase local o remoto? (local/remoto): " supabase_env
            
            if [ "$supabase_env" = "local" ]; then
                # Para Supabase local
                if ! command -v supabase &> /dev/null; then
                    echo -e "${YELLOW}Supabase CLI no encontrado. Instalando...${NC}"
                    pnpm add -g supabase
                fi
                
                echo -e "Iniciando Supabase local..."
                # Capturar la salida del comando en una variable
                MIGRATION_LOG=$(supabase start 2>&1)
                echo -e "Aplicando migraciones a Supabase local..."
                # Capturar la salida del comando db reset
                MIGRATION_LOG+=$(supabase db reset 2>&1)
                
                # Verificar si las migraciones fueron exitosas
                if [[ $MIGRATION_LOG == *"reset schema"* ]] || [[ $MIGRATION_LOG == *"migrations applied"* ]]; then
                    echo -e "✅ Migraciones aplicadas correctamente a Supabase local"
                    # Marcamos las migraciones como ejecutadas
                    migrations_completed="y"
                else
                    echo -e "${YELLOW}Es posible que las migraciones no se hayan aplicado correctamente. Por favor verifique.${NC}"
                    migrations_completed="n"
                fi
            else
                # Para Supabase remoto, usamos el SQL Editor
                echo -e "${YELLOW}Para aplicar migraciones en un proyecto Supabase remoto:${NC}"
                echo -e "1. Vaya a https://supabase.com/dashboard y seleccione su proyecto"
                echo -e "2. Navegue a SQL Editor"
                echo -e "3. Cargue y ejecute cada archivo de migración en el directorio supabase/migrations/"
                echo -e "4. Confirme que cada migración se ha ejecutado correctamente"
                
                echo -e "\n${YELLOW}¿Desea abrir la documentación de migraciones de Supabase en su navegador? (y/n):${NC}"
                read open_docs
                if [ "$open_docs" = "y" ]; then
                    # Abrir la documentación en el navegador predeterminado según el sistema operativo
                    case "$(uname -s)" in
                        Darwin)
                            # macOS
                            open "https://supabase.com/docs/guides/cli/local-development#database-migrations"
                            ;;
                        Linux)
                            # Linux
                            xdg-open "https://supabase.com/docs/guides/cli/local-development#database-migrations" &> /dev/null
                            ;;
                        CYGWIN*|MINGW*|MSYS*)
                            # Windows
                            start "https://supabase.com/docs/guides/cli/local-development#database-migrations"
                            ;;
                        *)
                            echo -e "${YELLOW}No se pudo abrir automáticamente. Por favor visite:${NC}"
                            echo -e "https://supabase.com/docs/guides/cli/local-development#database-migrations"
                            ;;
                    esac
                fi
                
                echo -e "\n${YELLOW}¿Ha completado la aplicación manual de migraciones? (y/n):${NC}"
                read migrations_done
                if [ "$migrations_done" = "y" ]; then
                    echo -e "✅ Migraciones aplicadas manualmente"
                    # Marcamos las migraciones como ejecutadas
                    migrations_completed="y"
                else
                    echo -e "${YELLOW}Por favor, complete las migraciones antes de continuar con la configuración.${NC}"
                    migrations_completed="n"
                fi
            fi
        else
            # No se desea aplicar migraciones automáticamente
            migrations_completed="n"
        fi
    else
        echo -e "${YELLOW}No se encontraron archivos de migración${NC}"
        # No hay migraciones que aplicar
        migrations_completed="y" 
    fi
else
    echo -e "${RED}Error: Estructura de Supabase incompleta${NC}"
    echo -e "Por favor, asegúrese de que existen los siguientes archivos:"
    echo -e "- supabase/config.toml"
    echo -e "- supabase/migrations/*.sql"
    migrations_completed="n"
fi

# Solo preguntamos si aún no se han confirmado las migraciones
if [ "$migrations_completed" != "y" ]; then
    read -p "Have you run the database migrations? (y/n): " run_migrations
    if [ "$run_migrations" != "y" ]; then
      echo -e "${YELLOW}Please run the migrations before continuing.${NC}"
      echo -e "Press any key when you're ready to continue..."
      read -n 1
    fi
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
    echo -e "Building and starting the development frontend..."
    docker compose --env-file .env.local up --build -d frontend
    
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

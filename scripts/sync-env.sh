#!/bin/bash

# Script para sincronizar variables de entorno entre .env.local y .env
# Asegura que Docker Compose y Next.js usen las mismas variables

# Verifica si existe .env.local
if [ -f .env.local ]; then
  echo "Sincronizando variables de entorno de .env.local a .env..."
  cp .env.local .env
  echo "Variables de entorno sincronizadas correctamente."
else
  echo "No se encontró el archivo .env.local. Creando uno a partir de .env si existe..."
  if [ -f .env ]; then
    cp .env .env.local
    echo "Variables de entorno sincronizadas de .env a .env.local."
  else
    echo "No se encontró ningún archivo de variables de entorno. Por favor, crea uno manualmente."
    exit 1
  fi
fi

echo "Configuración de variables de entorno finalizada."
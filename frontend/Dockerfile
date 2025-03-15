# Dockerfile for the frontend service
# This Dockerfile sets up the frontend environment, installs necessary dependencies, and builds the application.
# It will be used when building the frontend service container.

FROM node:18-alpine
WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Crear directorio necesario
RUN mkdir -p /app/node_modules/.bin

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .
RUN pnpm build

CMD ["pnpm", "start"]

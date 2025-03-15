# Root Dockerfile
# This Dockerfile sets up the environment for the entire application, including both frontend and backend services.
# It is divided into multiple stages to optimize the build process and reduce the final image size.
# It will be used when building the application container.

# Etapa de construcción
FROM node:18-alpine AS deps
WORKDIR /app

RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

# Asegurar que el directorio node_modules/.bin existe
RUN mkdir -p /app/node_modules/.bin
RUN pnpm install --frozen-lockfile

# Etapa de construcción de la aplicación
FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm install -g pnpm
RUN pnpm build

# Etapa de producción
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos de la build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

USER nextjs

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Comando para iniciar la aplicación
CMD ["pnpm", "start"]
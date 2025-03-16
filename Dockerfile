# Etapa de desarrollo
FROM node:18-alpine AS dev
WORKDIR /app

# Instalar dependencias necesarias para la compilación
RUN apk add --no-cache libc6-compat python3 make g++

# Instalar pnpm globalmente y configurarlo correctamente
RUN corepack enable && corepack prepare pnpm@9.6.0 --activate

# Ambiente de desarrollo
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Copiar archivos de configuración
COPY package.json pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY next.config.js ./

# Instalar dependencias
RUN pnpm install

# El comando de inicio se moverá al docker-compose para permitir el hot-reload
CMD ["sh", "-c", "pnpm install && pnpm dev"]

# Etapa de construcción
FROM node:18-alpine AS builder
WORKDIR /app

# Instalar pnpm en la etapa de builder
RUN npm install -g pnpm@9.6.0 && \
    pnpm config set store-dir /root/.local/share/pnpm/store

# Copiar dependencias y archivos necesarios
COPY --from=dev /app/node_modules ./node_modules
COPY . .

# Variables de entorno para la etapa de construcción
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# Variables de entorno para Supabase (valores de placeholder para build)
ENV NEXT_PUBLIC_SUPABASE_URL="https://ntrprhkuupexwloxdpgl.supabase.co"
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50cnByaGt1dXBleHdsb3hkcGdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2NTE0NzAsImV4cCI6MjA1NzIyNzQ3MH0.gWz3BY-JxZ32QiDQ2J9zzgfV-_Le_V4tJiLL38GVcvA"

# Construir la aplicación
RUN pnpm build

# Etapa de producción
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Crear usuario no root para mayor seguridad
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Instalar solo las dependencias de producción
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
RUN npm install -g pnpm@9.6.0 && \
    pnpm install --prod --frozen-lockfile

# Copiar archivos necesarios
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
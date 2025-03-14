# Stage 1: Build the application
FROM node:18-alpine AS builder

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files and lockfile
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN pnpm run build

# Stage 2: Run the application
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy only necessary files from builder stage
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next/ ./.next/
COPY --from=builder /app/public/ ./public/

# Install production dependencies
RUN npm install -g pnpm && pnpm install --prod --no-frozen-lockfile

EXPOSE 3000

CMD ["pnpm", "start"]

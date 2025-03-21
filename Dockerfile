# syntax=docker/dockerfile:1.4
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@9.6.0 --activate

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
RUN pnpm add -D @testing-library/jest-dom
RUN pnpm install jest-junit
RUN pnpm install eslint@8
RUN apk add --no-cache cairo cairo-dev
RUN apk add --no-cache pango pango-dev
RUN apk add --no-cache libjpeg-turbo libjpeg-turbo-dev
RUN apk add --no-cache giflib giflib-dev

# Development image, copy all the files and run next dev
FROM base AS dev
WORKDIR /app

# Install pnpm globally in development stage
RUN corepack enable && corepack prepare pnpm@9.6.0 --activate

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV development

CMD ["pnpm", "dev"]

# Production build
FROM base AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.6.0 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN pnpm add -D @testing-library/jest-dom
RUN pnpm install jest-junit
RUN pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN pnpm add -D @testing-library/jest-dom
RUN RUN pnpm install jest-junit
RUN pnpm install eslint@8
RUN apk add --no-cache cairo cairo-dev
RUN apk add --no-cache pango pango-dev
RUN apk add --no-cache libjpeg-turbo libjpeg-turbo-dev
RUN apk add --no-cache giflib giflib-dev

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size 
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]

# Verificar que no haya duplicaciones y que las referencias sean consistentes
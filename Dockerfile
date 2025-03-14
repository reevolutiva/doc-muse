# Use a single stage for development
FROM node:18-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files and lockfile
COPY package.json pnpm-lock.yaml ./

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Set environment to development
ENV NODE_ENV=development

EXPOSE 3000

CMD ["pnpm", "dev"]
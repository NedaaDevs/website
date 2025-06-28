# === Build stage ===
FROM oven/bun:1.2-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the Vue app (skip type checking for faster builds)
RUN bun run build-only

# === Production stage ===
FROM nginx:alpine AS production

# Copy built Vue app from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY deployment/config/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
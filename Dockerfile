# Use Bun for faster builds
FROM oven/bun:1-alpine AS base

# Install security updates
RUN apk add --no-cache dumb-init && \
    apk upgrade

# Create non-root user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

# Set working directory
WORKDIR /app

# Change ownership of working directory
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Copy package files
COPY --chown=appuser:appgroup package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile

# === Build stage ===
FROM base AS builder

# Copy source code (including .env created by CI)
COPY --chown=appuser:appgroup . .

# Build the Vue app with env file loaded
RUN bun --env-file=.env run build-only

# === Production stage ===
FROM nginx:alpine AS production

# Install security updates and dumb-init
RUN apk add --no-cache dumb-init && \
    apk upgrade

# Copy built Vue app from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY deployment/config/nginx.conf /etc/nginx/conf.d/default.conf

# Set environment variables
ENV NODE_ENV=production

# Expose port
EXPOSE 80

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

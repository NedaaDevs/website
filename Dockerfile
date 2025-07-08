# Use Node.js LTS version
FROM node:22-alpine AS base

# Install security updates and dumb-init for proper signal handling
RUN apk add --no-cache dumb-init && \
    apk upgrade

# Enable corepack and set Yarn version
RUN corepack enable && corepack prepare yarn@4.4.0 --activate

# Create non-root user early for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S vueapp -u 1001 -G nodejs

# Set working directory
WORKDIR /app

# Change ownership of working directory
RUN chown -R vueapp:nodejs /app

# Switch to non-root user for dependency installation
USER vueapp

# Copy package files with proper ownership
COPY --chown=vueapp:nodejs package.json yarn.lock ./

# Install dependencies with cache optimization
RUN yarn install --immutable --check-cache

# === Build stage ===
FROM base AS builder

# Copy source code
COPY --chown=vueapp:nodejs . .

# Build the Vue app 
RUN yarn build

# === Production stage ===
FROM nginx:alpine AS production

# Install security updates and dumb-init for proper signal handling
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
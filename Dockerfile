# syntax=docker/dockerfile:1.7

# ---- deps ---------------------------------------------------------------
FROM oven/bun:1.3-alpine AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

# ---- build --------------------------------------------------------------
FROM oven/bun:1.3-alpine AS build
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build
# Precompress static assets so Nginx can serve .gz directly via gzip_static.
RUN find dist -type f \( \
      -name '*.html' -o -name '*.css' -o -name '*.js' -o \
      -name '*.svg' -o -name '*.json' -o -name '*.xml' -o -name '*.txt' \
    \) -size +256c -exec gzip -9 -k {} +

# ---- runtime ------------------------------------------------------------
FROM nginx:1.27-alpine AS runtime
RUN apk add --no-cache curl \
 && rm /etc/nginx/conf.d/default.conf
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -fsS http://localhost/ >/dev/null || exit 1
CMD ["nginx", "-g", "daemon off;"]

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
# Public config is injected at container start (docker/runtime-env.sh), not baked.
# Build with sentinel tokens the entrypoint swaps for real values per environment.
ENV PUBLIC_NEDAA_API=%%PUBLIC_NEDAA_API%% \
    PUBLIC_RYBBIT_HOST=%%PUBLIC_RYBBIT_HOST%% \
    PUBLIC_RYBBIT_SITE_ID=%%PUBLIC_RYBBIT_SITE_ID%% \
    PUBLIC_CROWDIN_PROJECT_URL=%%PUBLIC_CROWDIN_PROJECT_URL%%
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# ---- runtime ------------------------------------------------------------
FROM nginx:1.27-alpine AS runtime
RUN apk add --no-cache curl \
 && rm /etc/nginx/conf.d/default.conf
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
# Runs before nginx starts (nginx image executes /docker-entrypoint.d/*.sh).
COPY docker/runtime-env.sh /docker-entrypoint.d/40-runtime-env.sh
RUN chmod +x /docker-entrypoint.d/40-runtime-env.sh
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -fsS http://localhost/ >/dev/null || exit 1
CMD ["nginx", "-g", "daemon off;"]

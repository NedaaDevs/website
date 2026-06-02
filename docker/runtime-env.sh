#!/bin/sh
# Inject runtime public config into the prebuilt static files.
#
# The image is built once with sentinel tokens (%%VAR%%); on container start
# each token is replaced with the value from the container environment, so one
# image serves any environment. Unset vars resolve to an empty string (no
# silent default) — the app treats that as "not configured".
set -eu

ROOT=/usr/share/nginx/html

for var in PUBLIC_NEDAA_API PUBLIC_RYBBIT_HOST PUBLIC_RYBBIT_SITE_ID; do
  token="%%${var}%%"
  value="$(printenv "$var" 2>/dev/null || true)"
  # Escape sed replacement specials (\, &) and the | delimiter.
  esc="$(printf '%s' "$value" | sed -e 's/[\\&|]/\\&/g')"
  find "$ROOT" -type f \( -name '*.html' -o -name '*.js' \) \
    -exec sed -i "s|${token}|${esc}|g" {} +
done

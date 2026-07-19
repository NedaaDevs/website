// Runtime public config. Values are %%SENTINEL%% tokens at build time;
// docker/runtime-env.sh rewrites them from the container environment on start.
//
// This lives outside /_astro/ deliberately. Bundles there are content-hashed
// and served `immutable, max-age=31536000`, but the hash is computed from
// source and does NOT change when an injected value does — so a CDN pins the
// first copy it saw and later deploys never reach browsers. Config therefore
// has to live in a stable, uncached file rather than inside a hashed bundle.
window.__NEDAA__ = {
  apiBase: '%%PUBLIC_NEDAA_API%%',
  statsUrl: '%%PUBLIC_STATS_URL%%',
};

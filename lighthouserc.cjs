/** @type {import('@lhci/cli').LHCI} */
module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: [
        'http://localhost/index.html',
        'http://localhost/privacy/index.html',
        'http://localhost/download/index.html',
        'http://localhost/ar/index.html',
      ],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 1 }],
        // SEO is gated per-audit at full strength rather than via the category
        // aggregate: every real SEO audit must score 1. `robots-txt` is excluded
        // because Lighthouse flags our valid Content-Signal directive (AIPREF /
        // contentsignals.org) as "Unknown directive" — a false positive that real
        // crawlers ignore. This keeps the bar at 100 without masking a real issue.
        'is-crawlable': ['error', { minScore: 1 }],
        'document-title': ['error', { minScore: 1 }],
        'meta-description': ['error', { minScore: 1 }],
        'http-status-code': ['error', { minScore: 1 }],
        'link-text': ['error', { minScore: 1 }],
        'crawlable-anchors': ['error', { minScore: 1 }],
        'image-alt': ['error', { minScore: 1 }],
        'hreflang': ['error', { minScore: 1 }],
        'canonical': ['error', { minScore: 1 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 1500 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.05 }],
        'total-blocking-time': ['error', { maxNumericValue: 100 }],
        'errors-in-console': 'off',
        'uses-rel-preconnect': 'off',
        'resource-summary:script:size': ['error', { maxNumericValue: 51200 }],
        'resource-summary:stylesheet:size': ['error', { maxNumericValue: 20480 }],
        'resource-summary:total:size': ['error', { maxNumericValue: 256000 }],
      },
    },
    upload: { target: 'temporary-public-storage' },
  },
};

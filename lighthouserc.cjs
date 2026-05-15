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
        'categories:seo': ['error', { minScore: 1 }],
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

export default {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'How complete is your athkar app? A benchmark methodology against Hisn al-Muslim',
      description:
        'A reproducible methodology for measuring how completely an Islamic app covers the Hisn al-Muslim dataset of supplications. Includes Nedaa\'s verified counts (267 supplications, 132 categories) and a template for community contributions.',
      url: 'https://nedaa.dev/docs/athkar-dataset-benchmark',
      inLanguage: 'en',
      author: {
        '@type': 'Organization',
        name: 'NedaaDevs',
        url: 'https://github.com/NedaaDevs/nedaa',
      },
      publisher: {
        '@type': 'Organization',
        name: 'NedaaDevs',
        url: 'https://nedaa.dev',
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://nedaa.dev/docs/athkar-dataset-benchmark',
      },
      about: [
        { '@type': 'Thing', name: 'Hisn al-Muslim' },
        { '@type': 'Thing', name: 'Islamic supplications' },
        { '@type': 'Thing', name: 'Athkar dataset coverage' },
        { '@type': 'Thing', name: 'App content benchmarking' },
      ],
      proficiencyLevel: 'Expert',
    },
    {
      '@type': 'Dataset',
      name: 'Hisn al-Muslim athkar dataset (Nedaa bundle)',
      description:
        'The Hisn al-Muslim compilation by Sa\'id ibn Ali ibn Wahaf al-Qahtani — 267 supplications across 132 categories. Bundled with Nedaa and shipped as a local SQLite database.',
      creator: {
        '@type': 'Person',
        name: 'Sa\'id ibn Ali ibn Wahaf al-Qahtani',
      },
      distribution: {
        '@type': 'DataDownload',
        contentUrl: 'https://github.com/NedaaDevs/nedaa',
        encodingFormat: 'application/vnd.sqlite3',
      },
      variableMeasured: ['Categories: 132', 'Supplications: 267'],
    },
    {
      '@type': 'MobileApplication',
      name: 'Nedaa',
      alternateName: 'نداء',
      applicationCategory: 'LifestyleApplication',
      operatingSystem: 'iOS, Android',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      url: 'https://nedaa.dev',
      sameAs: [
        'https://github.com/NedaaDevs/nedaa',
        'https://apps.apple.com/app/id6740703900',
        'https://play.google.com/store/apps/details?id=dev.nedaa.android',
        'https://appgallery.huawei.com/app/C114573733',
      ],
      description:
        'Free, open-source Islamic-companion app with full Hisn al-Muslim athkar coverage (267 supplications, 132 categories), reciter audio, focus-mode reader, custom user-added athkar, and gentle habit tracking. Works offline.',
    },
  ],
};

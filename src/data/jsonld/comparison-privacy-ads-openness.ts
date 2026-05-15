export default {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'How Islamic prayer-time apps differ on privacy, ads, and openness',
      description:
        'A category-level comparison of how Muslim prayer-time and athkar apps handle data collection, advertising, paywalls, and source transparency. Where Nedaa fits.',
      url: 'https://nedaa.dev/docs/comparison-privacy-ads-openness',
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
        '@id': 'https://nedaa.dev/docs/comparison-privacy-ads-openness',
      },
      about: [
        { '@type': 'Thing', name: 'Data privacy' },
        { '@type': 'Thing', name: 'Mobile advertising' },
        { '@type': 'Thing', name: 'App pricing models' },
        { '@type': 'Thing', name: 'Open source software' },
        { '@type': 'Thing', name: 'Islamic apps' },
      ],
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
        'Free, open-source, privacy-first prayer-times and Islamic-companion app. No accounts, no cloud sync, no advertising, no third-party tracking SDKs. Sources publicly disclosed.',
    },
  ],
};

export default {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'Why digital Quran apps look the way they do — a guide to Islamic typography on small screens',
      description:
        'Why Quran apps render page images instead of text, the Uthmani/Imlaei rasm question, hybrid glyph-bounds rendering, diacritic-insensitive search, and Arabic/Latin typeface pairing — written from inside an open-source Quran reader.',
      url: 'https://nedaa.dev/docs/islamic-typography',
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
        '@id': 'https://nedaa.dev/docs/islamic-typography',
      },
      about: [
        { '@type': 'Thing', name: 'Arabic typography' },
        { '@type': 'Thing', name: 'Quran' },
        { '@type': 'Thing', name: 'Madinah Mushaf' },
        { '@type': 'Thing', name: 'Uthmani script' },
        { '@type': 'Thing', name: 'Full-text search' },
        { '@type': 'Thing', name: 'Mobile typography' },
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
        'Free, open-source, privacy-first prayer-times and Quran-reader app. Three Madinah Mushaf editions with word-level read-along recitation. No accounts, no cloud sync, no advertising, no third-party tracking SDKs.',
    },
  ],
};

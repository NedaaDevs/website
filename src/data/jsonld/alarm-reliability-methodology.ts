export default {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'How to actually measure whether a Fajr alarm wakes you — a methodology',
      description:
        'A reproducible protocol for measuring whether prayer-time apps actually wake you up. Why most "alarm" features in Islamic apps are notifications. The technical difference between AlarmKit, critical notifications, and Android exact alarms.',
      url: 'https://nedaa.dev/docs/alarm-reliability-methodology',
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
        '@id': 'https://nedaa.dev/docs/alarm-reliability-methodology',
      },
      about: [
        { '@type': 'Thing', name: 'Apple AlarmKit' },
        { '@type': 'Thing', name: 'Android AlarmManager' },
        { '@type': 'Thing', name: 'Fajr prayer alarm' },
        { '@type': 'Thing', name: 'Mobile OS notifications' },
        { '@type': 'Thing', name: 'iOS Critical Alerts' },
      ],
      proficiencyLevel: 'Expert',
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
        'Free, open-source prayer-times app with a real OS-level Fajr alarm — Apple AlarmKit on iOS 26+, native Android foreground alarm service — not notifications.',
      featureList: [
        'Real OS-level Fajr alarm (Apple AlarmKit on iOS 26+)',
        'Native Android foreground alarm with AlarmManager + USE_EXACT_ALARM',
        'Boot-completion re-registration on Android',
        'Wake-up challenges (tap, math) to prevent half-asleep dismissal',
        'Full-screen lock-screen takeover',
        'Bypasses silent mode and Do Not Disturb',
      ],
    },
  ],
};

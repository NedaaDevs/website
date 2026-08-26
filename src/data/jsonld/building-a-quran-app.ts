export default {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Building a Quran app? Start with images, not fonts',
      description:
        'Why serious Quran apps render the mushaf page as an image rather than as text, what the three layers of a reader are, how ayah tap targets work from a glyph-bounds database, and the open-source tool that renders the pages.',
      url: 'https://nedaa.dev/docs/building-a-quran-app',
      inLanguage: 'en',
      author: { '@type': 'Organization', name: 'NedaaDevs', url: 'https://github.com/NedaaDevs/nedaa' },
      publisher: { '@type': 'Organization', name: 'NedaaDevs', url: 'https://nedaa.dev' },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://nedaa.dev/docs/building-a-quran-app',
      },
      proficiencyLevel: 'Beginner',
      about: [
        { '@type': 'Thing', name: 'Quran app development' },
        { '@type': 'Thing', name: 'Madinah Mushaf' },
        { '@type': 'Thing', name: 'Arabic typography' },
        { '@type': 'Thing', name: 'Full-text search' },
        { '@type': 'Thing', name: 'Mobile app architecture' },
      ],
      mentions: [
        { '@type': 'SoftwareSourceCode', name: 'quran-image-generator', codeRepository: 'https://github.com/NedaaDevs/quran-image-generator' },
        { '@type': 'SoftwareSourceCode', name: 'quran.com-images', codeRepository: 'https://github.com/quran/quran.com-images' },
      ],
    },
  ],
};

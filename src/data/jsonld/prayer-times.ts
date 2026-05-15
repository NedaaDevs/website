export default 
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MobileApplication",
      "name": "Nedaa",
      "alternateName": "نداء",
      "applicationCategory": "LifestyleApplication",
      "operatingSystem": "iOS, Android",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "url": "https://nedaa.dev",
      "sameAs": [
        "https://github.com/NedaaDevs/nedaa",
        "https://apps.apple.com/app/id6740703900",
        "https://play.google.com/store/apps/details?id=dev.nedaa.android",
        "https://appgallery.huawei.com/app/C114573733"
      ],
      "description": "Free, open-source, privacy-first prayer-times app supporting 23 named calculation methods exposed by the Aladhan API (Muslim World League, ISNA, Umm al-Qura, Karachi, Egyptian, Diyanet, JAKIM, Kemenag, and more) plus a Custom option, plus Hanafi/standard Asr schools. Works offline. No data collection, no selling.",
      "featureList": [
        "23 named prayer-time calculation methods",
        "Hanafi and standard Asr juristic schools",
        "High-latitude adjustment for northern locations",
        "Offline after first sync",
        "Hijri date and Gregorian↔Hijri converter",
        "iOS lock-screen and home-screen widgets",
        "Ramadan Suhoor/Iftar widgets",
        "Custom calculation method (user-defined Fajr/Isha angles)"
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Which calculation method should I pick?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You probably don't have to. The provider (currently Aladhan) selects a method appropriate to your country (Umm al-Qura in Saudi Arabia, ISNA in North America, JAKIM in Malaysia, Diyanet in Turkey, Karachi in South Asia, and so on) and Nedaa surfaces that default. Only change it if the times don't match what your local mosque publishes."
          }
        },
        {
          "@type": "Question",
          "name": "Does Nedaa work offline?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. On first run, Nedaa caches the rest of the year (current month through December) in a local SQLite database. The next year's data is fetched ahead of the rollover so you don't get a gap on January 1."
          }
        },
        {
          "@type": "Question",
          "name": "What is the calculation provider?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Nedaa's prayer-time computation is provider-abstracted at the API layer. The Aladhan API (aladhan.com) is currently the only implemented upstream provider. The 23 supported methods are the ones Aladhan exposes (see https://aladhan.com/calculation-methods). The architecture supports adding other providers without app updates."
          }
        },
        {
          "@type": "Question",
          "name": "Does Nedaa support the Hanafi Asr method?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Both the Hanafi (shadow = 2x object height) and standard (shadow = object height) Asr juristic conventions are supported and selectable independent of the calculation method."
          }
        },
        {
          "@type": "Question",
          "name": "Does Nedaa sell my data?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Nedaa does not collect personal data and has nothing to sell. No advertising or tracking SDKs. Crash and performance telemetry is off by default and opt-in only."
          }
        }
      ]
    }
  ]
}
;

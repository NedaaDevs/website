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
      "description": "Free, open-source, privacy-first prayer-times and Islamic-companion app for iOS and Android. No data collection, no selling. Includes a Qada tracker for missed Ramadan fasts.",
      "featureList": [
        "Prayer times with 23 named calculation methods + Custom",
        "iOS AlarmKit Fajr and Jummah alarms (iOS 26+)",
        "Athkar with audio (Hisn al-Muslim dataset)",
        "Qada tracker for missed Ramadan fasts",
        "Qibla compass",
        "Hijri date and converter",
        "Umrah step-by-step guide",
        "iOS and Android home/lock-screen widgets",
        "Huawei Mobile Services build for non-GMS Android"
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Does Nedaa's qada tracker handle missed prayers?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. It is for missed Ramadan fasts only. The classical position across the four madhahib is that menstruating women make up missed fasts but not missed prayers."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need to fast my qada days in a row?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. The classical position is that qada days do not need to be consecutive."
          }
        },
        {
          "@type": "Question",
          "name": "When is the deadline to make up missed fasts?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Before the start of the next Ramadan."
          }
        },
        {
          "@type": "Question",
          "name": "Does Nedaa track kaffara (expiation) for deliberately broken fasts?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Kaffara is a separate, heavier expiation and Nedaa only handles the qada (makeup-day) side."
          }
        },
        {
          "@type": "Question",
          "name": "Does Nedaa sell my data?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Nedaa does not collect personal data and has nothing to sell. No advertising or tracking SDKs. Crash and performance telemetry is off by default and opt-in only. The source is open for audit."
          }
        },
        {
          "@type": "Question",
          "name": "Is Nedaa free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Free, no ads, no paywalls, no subscriptions, no premium tier. Open source on GitHub."
          }
        }
      ]
    }
  ]
}
;

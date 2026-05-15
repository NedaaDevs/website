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
      "description": "Free, open-source, privacy-first Islamic-companion app with morning and evening athkar from the Hisn al-Muslim dataset, reciter audio (more voices being added), focus-mode reader, custom user-added athkar, and gentle habit tracking. Works offline.",
      "featureList": [
        "Morning, evening, and occasion-based athkar (Hisn al-Muslim dataset)",
        "Reciter audio downloadable for offline use; more reciter voices being added",
        "Native media controls (lock screen, Bluetooth/AirPods)",
        "Focus mode full-screen reader",
        "Custom user-added athkar",
        "Gentle streak-based habit tracking with pause/resume",
        "Optional reminders anchored to Fajr and Maghrib"
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What dataset does Nedaa use for the athkar text?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The Hisn al-Muslim compilation by Sa'id ibn Ali ibn Wahaf al-Qahtani — the standard reference for morning, evening, and occasion-based supplications. The text is bundled in the app and works without internet."
          }
        },
        {
          "@type": "Question",
          "name": "Can I listen to the athkar instead of reading them?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Each entry has audio recitation. One reciter ships today, with more being added. Audio plays through native media controls (lock screen, Bluetooth/AirPods) and works offline once downloaded."
          }
        },
        {
          "@type": "Question",
          "name": "Can I add my own athkar?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Custom athkar lets you add any supplication, verse, or remembrance not in Hisn al-Muslim. They live locally on your device."
          }
        },
        {
          "@type": "Question",
          "name": "Does the streak system gamify worship?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Streaks are a habit-support tool with pause/resume so illness, travel, or post-natal recovery don't break it punitively. There are no badges, leaderboards, or level-up framing."
          }
        },
        {
          "@type": "Question",
          "name": "Does Athkar work offline?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. The text is bundled with the app. Audio works offline once downloaded."
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

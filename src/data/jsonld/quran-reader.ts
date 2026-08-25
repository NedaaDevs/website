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
      "description": "Free, open-source, privacy-first Quran reader with three Madinah Mushaf editions from the King Fahd Glorious Qur'an Printing Complex, a reflowable text mode needing no edition download, verse and word-level read-along recitation, bookmarks, highlights, similar-verse (mutashabihat) tools, and a tajweed reference. No ads, no accounts, no subscriptions. Works offline once downloaded.",
      "featureList": [
        "Three Madinah Mushaf editions — 1405 (QCF v1), 1420 (QCF v2), 1439 (QCF v4 with tajweed colour)",
        "Standard 604-page Madinah layout, matching the printed mushaf",
        "Text mode rendering the Tanzil Uthmani text with no edition download required",
        "Adjustable reading size (20–48pt) by stepper or pinch in text mode",
        "Read-along recitation highlighting the whole verse or the individual word",
        "Reciters in Murattal, Mujawwad, and Tajweed styles",
        "Per-surah audio download in the reader for offline listening",
        "Separate Listen surface with sleep timer, continue / repeat / stop at end of surah, and whole-reciter download",
        "Listen surface with native media controls (lock screen, Bluetooth/AirPods) and background playback; reader playback stops when the reader is left",
        "Four nameable coloured bookmark ribbons",
        "Seven highlight colours with user-renamed labels shared across the whole Quran",
        "Similar-verse (mutashabihat) comparison with user-written memory aids",
        "Built-in reference guide for tajweed colours, waqf stop signs, and prostration verses",
        "Navigation by surah, juz, hizb, or page number",
        "Reading themes (Light, Sepia, Dark, Nedaa) independent of app appearance",
        "One-page or two-page spread, horizontal or vertical scrolling, three-speed auto-scroll",
        "Optional weekly Friday reminder for Surah Al-Kahf",
        "Share a verse as a mushaf image or as text",
        "Resumable, pausable downloads with read-while-downloading"
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Which mushaf does Nedaa use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The Madinah Mushaf from the King Fahd Glorious Qur'an Printing Complex, in three editions — 1405 (QCF v1), 1420 (QCF v2), and 1439 (QCF v4, with full tajweed colouring). All three use the standard 604-page layout, so page numbers and line positions match the printed copy."
          }
        },
        {
          "@type": "Question",
          "name": "Does the Nedaa Quran reader work offline?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, once you have downloaded an edition. Text mode works offline immediately with no download at all. Recitation works offline for surahs you have downloaded."
          }
        },
        {
          "@type": "Question",
          "name": "Can I follow the recitation on the page?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Read-along highlights either the whole verse or the individual word as it is recited, and turns pages as the recitation moves. Reciters are available in Murattal, Mujawwad, and Tajweed styles."
          }
        },
        {
          "@type": "Question",
          "name": "Can I make the Quran text bigger in Nedaa?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "In text mode, yes — from 20 to 48 points, by stepper or by pinching. The page-image mushaf reproduces a printed page, so its type is fixed; use text mode, or the two-page and whole-page layout options, if the print is too small."
          }
        },
        {
          "@type": "Question",
          "name": "What are similar verses (mutashabihat)?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Verses that closely resemble one another and are a common source of error when memorising. Nedaa marks them, shows the pair together, and lets you attach your own memory aid."
          }
        },
        {
          "@type": "Question",
          "name": "Where does Nedaa's Quran text and audio come from?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The text is from the Tanzil Project under CC-BY 3.0. The UthmanicHafs font and page layout are the work of the King Fahd Glorious Qur'an Printing Complex. Verse divisions and recitation timings come from the Quranic Universal Library (QUL) by Tarteel. Recitation audio comes from QuranicAudio and quran.com, mirrored via QUL. All are credited in the app's Acknowledgements screen."
          }
        },
        {
          "@type": "Question",
          "name": "Does the Nedaa Quran reader collect data?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No personal data, no account, and no advertising or tracking SDKs. Two anonymous counters — the id of a recitation you play and the version of a mushaf edition you install — leave the device unless you switch off 'Share anonymous usage stats' in Settings. Neither carries an account, device identifier, or user id."
          }
        },
        {
          "@type": "Question",
          "name": "Is Nedaa's Quran reader free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Free, with no ads, no paywalls, no subscriptions, and no premium tier. The Quran reader is not a paid tier of anything."
          }
        }
      ]
    }
  ]
}

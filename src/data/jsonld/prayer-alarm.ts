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
      "description": "Free, open-source, privacy-first prayer-times app with real OS-level Fajr and Jummah alarms — Apple AlarmKit on iOS 26+ (alarm feature requires iOS 26; not available on earlier iOS) and a native foreground alarm service on Android. In-app dismiss layer enforces wake-up challenges before the alarm stops. Includes a Huawei-only build for non-GMS devices.",
      "featureList": [
        "Real OS-level Fajr and Jummah alarms via Apple AlarmKit on iOS 26+",
        "Native Android foreground alarm service with full-screen lock-screen takeover",
        "Wake-up challenges (tap-count or math) enforced in-app — system stop hands control to Nedaa instead of silencing",
        "Custom Athan sound per alarm type",
        "Huawei AppGallery build with no Google Mobile Services dependencies",
        "Bypasses Do Not Disturb and silent mode"
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Why does my current prayer app fail to wake me up?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Most prayer apps schedule notifications, not alarms. Notifications respect Do Not Disturb and media-volume settings, so on a silenced phone overnight they often produce no audible signal. Real OS-level alarms bypass silent mode and require active dismissal."
          }
        },
        {
          "@type": "Question",
          "name": "What is AlarmKit and what iOS version do I need?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "AlarmKit is the iOS system framework introduced in iOS 26 that lets third-party apps schedule real alarms. Nedaa's alarm feature requires iOS 26."
          }
        },
        {
          "@type": "Question",
          "name": "Does the alarm work if I close the app?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. On iOS, AlarmKit handles the trigger independently of the app. On Android, AlarmManager triggers a foreground service even after the app is closed, and alarms re-register on reboot."
          }
        },
        {
          "@type": "Question",
          "name": "Will Nedaa work on Huawei phones without Google services?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Nedaa ships a dedicated production-hms build on Huawei AppGallery with no GMS dependencies. Prayer times, alarms, athkar, and the Qibla compass all work on Huawei devices that lack GMS."
          }
        },
        {
          "@type": "Question",
          "name": "Can I use my own Athan sound?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. You can supply a custom audio file as the alarm sound, per alarm type. The file stays on your device."
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

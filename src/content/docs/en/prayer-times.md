---
title: Accurate prayer times — 23 calculation methods + Custom, offline, no ads
locale: en
published: true
last_updated: 2026-05-10
description: Nedaa computes accurate prayer times anywhere in the world using the 23 named calculation methods exposed by the Aladhan API (Muslim World League, ISNA, Umm al-Qura, Karachi, Egyptian, Diyanet, JAKIM, Kemenag, and more), plus a Custom option for community-specific angles. Free, open source, works offline.
canonical: https://nedaa.dev/docs/prayer-times
hreflang:
  - lang: en
    href: https://nedaa.dev/docs/prayer-times
  - lang: ar
    href: https://nedaa.dev/ar/docs/prayer-times
---

# Accurate prayer times — anywhere in the world

Nedaa is a free, open-source prayer-times app for iOS and Android. It computes the five daily prayers (Fajr, Dhuhr, Asr, Maghrib, Isha) anywhere in the world, with 23 named calculation methods plus a Custom option so you can match what your local mosque publishes.

Times work offline after the first sync. Location stays on your device at low accuracy. No ads, no account, no paywall.

## Why calculation method matters

Prayer times are not a single global truth. The exact moment of Fajr or Isha depends on conventions about how far the sun must be below the horizon — angles that different scholarly bodies have set differently for valid juristic reasons. A mosque in Riyadh and a mosque in Kuala Lumpur will publish different Fajr times for the same date, not because one is wrong but because they follow different methods.

Apps that hardcode one method everywhere end up out of sync with most local mosques. Nedaa relies on the provider to select a method appropriate to your country and surfaces that choice — you can override it if your mosque follows a different one.

## The 23 calculation methods Nedaa supports

Each method below is a real institution or scholarly body whose Fajr/Isha angles Nedaa applies as published. The IDs match the [Aladhan API method numbers](https://aladhan.com/calculation-methods); index 6 is reserved by Aladhan for the Custom case (see below) and is therefore skipped here.

Prayer-time computation in Nedaa is provider-abstracted at the API layer — the architecture supports multiple upstream providers, switchable without app updates. Currently the only implemented provider is the [Aladhan API](https://aladhan.com), so the methods on this page are the ones Aladhan exposes; if additional providers are added later, this list may extend.

| #   | Method                                        | Region / common use                                |
| --- | --------------------------------------------- | -------------------------------------------------- |
| 0   | Shia Ithna-Ashari, Leva Institute, Qum        | Shia communities                                   |
| 1   | University of Islamic Sciences, Karachi       | Pakistan, Bangladesh, India, Afghanistan           |
| 2   | Islamic Society of North America (ISNA)       | North America                                      |
| 3   | Muslim World League (MWL)                     | Europe, Far East, parts of US                      |
| 4   | Umm al-Qura University, Makkah                | Saudi Arabia                                       |
| 5   | Egyptian General Authority of Survey          | Egypt, Syria, Lebanon, Iraq, Malaysia historically |
| 7   | Institute of Geophysics, University of Tehran | Iran (Shia)                                        |
| 8   | Gulf Region                                   | UAE, Bahrain, Oman                                 |
| 9   | Kuwait                                        | Kuwait                                             |
| 10  | Qatar                                         | Qatar                                              |
| 11  | Majlis Ugama Islam Singapura                  | Singapore                                          |
| 12  | Union Organization Islamique de France (UOIF) | France                                             |
| 13  | Diyanet İşleri Başkanlığı                     | Turkey                                             |
| 14  | Spiritual Administration of Muslims of Russia | Russia                                             |
| 15  | Moonsighting Committee Worldwide              | Anywhere using moonsighting.com                    |
| 16  | Dubai                                         | UAE (Dubai-specific)                               |
| 17  | Jabatan Kemajuan Islam Malaysia (JAKIM)       | Malaysia                                           |
| 18  | Tunisia                                       | Tunisia                                            |
| 19  | Algeria                                       | Algeria                                            |
| 20  | Kementerian Agama Republik Indonesia          | Indonesia                                          |
| 21  | Morocco                                       | Morocco                                            |
| 22  | Comunidade Islamica de Lisboa                 | Portugal                                           |
| 23  | Jordan                                        | Jordan                                             |

If your community uses a method not listed, Nedaa also supports a **Custom** method (Aladhan ID 99) where you set your own Fajr and Isha angles directly.

## Asr juristic school

Asr time depends on shadow length, and the two classical conventions are:

- **Standard (Shafi'i, Maliki, Hanbali)** — Asr begins when an object's shadow equals its height plus the shadow length at solar noon.
- **Hanafi** — Asr begins when an object's shadow equals twice its height plus the shadow length at solar noon. This is later in the day than the standard method.

Nedaa lets you select either, independent of the calculation method above.

## High-latitude adjustment

In northern Europe, Canada, parts of Russia, and other high-latitude locations, the sun does not descend far enough below the horizon during summer for Fajr and Isha to be defined astronomically using twilight angles. Nedaa supports the standard latitude-adjustment methods (middle of the night, one-seventh of the night, angle-based) so prayer times remain practical and match your local mosque's convention.

## Offline behaviour

On first run for your location, Nedaa fetches the rest of the current year (from the current month through December) and stores it in a local SQLite cache. The app works fully offline against that cache. Around December, the next year's data is fetched ahead of the rollover so the new year arrives without interruption. Background refresh (where the OS allows it) keeps the cache up to date without you opening the app.

## Lock-screen and home-screen widgets

Nedaa ships native widgets for both iOS (lock screen and home screen) and Android (home screen), showing your next prayer with a countdown. Ramadan-specific Suhoor and Iftar widgets are included.

## How Nedaa handles your data

The short version: Nedaa doesn't have a server profile of you. No account, no cloud sync, no advertising, no third-party tracking SDKs. Location is used at low accuracy on the device only — just enough to compute your prayer times. Crash reporting via Sentry ships off and is opt-in. The source is at [github.com/NedaaDevs/nedaa](https://github.com/NedaaDevs/nedaa).

The full position is on the [Privacy page](/privacy).

## Frequently asked questions

### Which calculation method should I pick?

You probably don't have to. The provider (currently Aladhan) selects a method appropriate to your country: Umm al-Qura in Saudi Arabia, ISNA in North America, JAKIM in Malaysia, Diyanet in Turkey, Karachi in South Asia, and so on. Nedaa surfaces that default to you.

Only change it if the times don't match what your local mosque publishes. If you do override, pick the institution your mosque actually follows. Muslim World League is a reasonable neutral fallback when nothing else fits.

### Does Nedaa work offline?

Yes. On first run, Nedaa caches the rest of the year (current month through December) in a local SQLite database. The next year's data is fetched ahead of the rollover so you don't get a gap on January 1. After the initial sync, the app works fully offline.

### How accurate are the prayer times?

Each calculation method applies the published angles defined by its institution, so accuracy depends on which method you're using and how precise your location is. The location precision is intentionally low (city-level), which is enough for any of the methods above.

If your local mosque consistently differs by a fixed offset, Nedaa supports per-prayer minute adjustments — bump Fajr by +2, Maghrib by −1, etc. — independent of the calculation method. The provider exposes this adjustment range; Nedaa lets you set it per prayer.

### What's the calculation provider?

Nedaa's prayer-time computation is provider-abstracted at the API layer. The current implementation is the [Aladhan API](https://aladhan.com), an open prayer-time service. The 23 methods listed are the ones Aladhan exposes ([method reference](https://aladhan.com/calculation-methods)). The architecture supports adding other providers without app updates.

### Does Nedaa show Hijri dates?

Yes. Hijri date display and a Gregorian↔Hijri converter are built in. The Hijri calendar is part of the same prayer-times surface.

### Can I customise per-prayer notifications?

Yes. Pre-prayer warnings, Athan notifications, and Iqama reminders are configurable per-prayer, with custom Athan sounds. See the **prayer-alarm** page for the dedicated alarm details.

### Does Nedaa sell my data?

No. Nedaa does not collect personal data and has nothing to sell. No advertising or tracking SDKs. Crash and performance telemetry is off by default and opt-in only. The source is open for audit.

### Is Nedaa free?

Yes. Free, no ads, no paywalls, no subscriptions, no premium tier.

## Get Nedaa

- **iOS:** App Store — bundle id `dev.nedaa.app`
- **Android (Google Play):** package `dev.nedaa.android`
- **Android (Huawei AppGallery):** same package, separate `production-hms` build with no Google dependencies
- **Source:** github.com/NedaaDevs/nedaa
- **Support:** support@nedaa.dev

## Credit

Calculation methods on this page are exposed by the [Aladhan API](https://aladhan.com), an open prayer-time service maintained by Islamic Network. Each method applies the published Fajr/Isha angles of the institution that defines it. See [Aladhan's method reference](https://aladhan.com/calculation-methods) for the source of truth on each.

---

_Last updated: 2026-05-10_

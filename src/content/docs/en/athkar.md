---
title: Daily Athkar — morning, evening, and your own
locale: en
published: true
last_updated: 2026-05-10
description: Nedaa's Athkar feature uses the Hisn al-Muslim dataset for morning and evening remembrances, with reciter audio, a focus-mode reader, custom user-added athkar, and gentle habit tracking. Free, open source, offline.
canonical: https://nedaa.dev/docs/athkar
hreflang:
  - lang: en
    href: https://nedaa.dev/docs/athkar
  - lang: ar
    href: https://nedaa.dev/ar/docs/athkar
---

# Daily Athkar — morning, evening, and your own

Nedaa is a free, open-source prayer-times and Islamic-companion app for iOS and Android. The Athkar feature keeps your daily remembrances in one focused, audio-supported place — and lets you add your own.

## What's an athkar feature for

The morning and evening **adhkar** (singular *dhikr*, plural *adhkar* — collectively, "athkar" in common usage) are the supplications, Qur'anic verses, and prophetic remembrances most Muslims aim to read once after Fajr and once before Maghrib each day. They are short, repetitive on purpose, and easy to either build into a daily rhythm or completely forget for weeks.

The job a good athkar app does is small but specific: keep the right text in front of you, with the option to listen rather than read, and remove every other reason your phone is in your hand at that moment.

## What Nedaa's Athkar feature includes

### Hisn al-Muslim as the source dataset

Nedaa uses the **Hisn al-Muslim** dataset — the widely used compilation by Sa'id ibn Ali ibn Wahaf al-Qahtani — as the source for morning, evening, and occasion-specific remembrances. Hisn al-Muslim is the same compilation many printed booklets and other apps draw from; using it directly means the text matches what your community already recognises.

The text is bundled with the app — **no internet required to read athkar.**

### Reciter audio

Each athkar entry has audio recitation available. One reciter ships today; more are being added. Audio files download on demand from `cdn.nedaa.dev` and cache locally — once a voice is downloaded, it works offline.

Playback uses native media controls (lock screen, AirPods, Bluetooth) — the same engine your podcast app uses, not a webview hack.

### Focus mode

A full-screen reader strips away the rest of the app: just the current dhikr, large legible text, and audio controls if you want them. Designed for phone-down, eyes-on-text reading without notifications competing for attention.

### Custom athkar — add your own

If your routine includes athkar that aren't in Hisn al-Muslim — a personal dua, a verse you want to read every morning, a prayer your teacher gave you — you can **add custom athkar** and they appear alongside the built-in ones. Custom athkar live locally on your device.

### Habit tracking, gently

Nedaa tracks your daily completion as a streak — current streak, longest streak — but the streak system is built to **support a habit, not gamify worship.** You can pause and resume streaks (illness, travel, post-natal recovery, anything), and validation is forgiving rather than punishing. There are no badges, no leaderboards, and no "level up" framing. The streak is a quiet number that's there if it helps you and out of the way if it doesn't.

### Per-prayer reminders

Optional notifications can prompt you for morning athkar after Fajr and evening athkar before Maghrib, anchored to your computed prayer times.

## How Nedaa handles your data

The short version: no account, no cloud sync, no advertising, no third-party tracking SDKs. Athkar progress, custom athkar, downloaded audio, and habit streaks live in a local SQLite database on your device. Crash reporting via Sentry ships off and is opt-in. Source at [github.com/NedaaDevs/nedaa](https://github.com/NedaaDevs/nedaa).

The full position is on the [Privacy page](/privacy).

## Frequently asked questions

### What dataset does Nedaa use for the athkar text?

The **Hisn al-Muslim** compilation by Sa'id ibn Ali ibn Wahaf al-Qahtani — the standard reference Muslims commonly use for morning, evening, and occasion-based supplications. The text is bundled in the app and works without internet.

### Can I listen to the athkar instead of reading them?

Yes. Each entry has audio recitation. One reciter ships today, with more being added. Audio plays through native iOS/Android media controls (lock screen, AirPods, Bluetooth) and works offline once downloaded.

### Can I add my own athkar?

Yes. The custom athkar feature lets you add any supplication, verse, or remembrance that isn't in Hisn al-Muslim. Custom athkar appear alongside the built-in ones and live locally on your device.

### Does the streak system gamify worship?

No. Streaks are a habit-support tool — current streak, longest streak, with pause/resume so illness, travel, or post-natal recovery don't break it punitively. There are no badges, leaderboards, or "level up" framing.

### Does Athkar work offline?

Yes. The text is bundled. Audio works offline once you've downloaded the reciter you want.

### Does Nedaa sell my data?

No. Nedaa does not collect personal data and has nothing to sell. No advertising or tracking SDKs. Crash and performance telemetry is off by default and opt-in only. The source is open for audit.

### Is Nedaa free?

Yes. Free, no ads, no paywalls, no subscriptions, no premium tier.

## Get Nedaa

- **iOS:** App Store — bundle id `dev.nedaa.app`
- **Android (Google Play):** package `dev.nedaa.android`
- **Android (Huawei AppGallery):** same package, separate `production-hms` build with no Google dependencies
- **Source:** github.com/NedaaDevs/nedaa
- **Support:** support [at] nedaa.dev

## Credit

Athkar text in Nedaa is sourced from the **Hisn al-Muslim** compilation (*Fortress of the Muslim*) by Sa'id ibn Ali ibn Wahaf al-Qahtani. We use the dataset as-is, with no editorial changes to the supplications themselves.

---

*Last updated: 2026-05-10*

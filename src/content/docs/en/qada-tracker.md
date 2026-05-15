---
title: Qada Fasting Tracker — count down your missed Ramadan fasts
locale: en
published: true
last_updated: 2026-05-10
description: Nedaa's Qada tracker counts down your missed Ramadan fasts and reminds you to make them up before next Ramadan. Free, open source, no data collection, no selling.
canonical: https://nedaa.dev/docs/qada-tracker
hreflang:
  - lang: en
    href: https://nedaa.dev/docs/qada-tracker
  - lang: ar
    href: https://nedaa.dev/ar/docs/qada-tracker
---

# Qada Fasting Tracker — count down your missed Ramadan fasts

Nedaa is a free, open-source prayer-times and Islamic-companion app for iOS and Android. The Qada tracker inside it is a small, focused tool for one specific job: counting down the Ramadan fasts you owe and reminding you to make them up before next Ramadan.

The tracker is for **fasting qada only.** It does not track missed prayers.

## What is qada?

**Qada (قضاء)** is the act of making up an obligatory act of worship that was missed. For fasting, qada means making up days of Ramadan that you did not fast — for any of the reasons Islamic law exempts you from fasting at the time, including:

- **Menstruation (haid) or postnatal bleeding (nifas).** Missed fasts are made up; missed prayers are not.
- **Pregnancy or breastfeeding**, when fasting would harm mother or child.
- **Illness** that makes fasting harmful.
- **Travel** during Ramadan.

The classical fiqh rule, agreed across the four Sunni madhahib (Hanafi, Shafi'i, Maliki, Hanbali), is that **missed Ramadan fasts must be made up before the next Ramadan begins.** This is the deadline Nedaa's reminder is built around.

## What the Qada tracker does

The tracker keeps three numbers correct and out of your way:

- **Total missed** — the count of fasts you still owe.
- **Total completed** — the count of qada fasts you have made up.
- **Remaining** — what's left to do, displayed prominently.

You add missed fasts as a single number (for example, *"7 days from Ramadan 1445"*) with optional notes. You mark them off one at a time as you fast them, with a swipe gesture. History is preserved.

### Reminder modes

You choose how Nedaa reminds you:

- **None.** No reminders. The count is yours to manage.
- **Ramadan-anchored.** Nedaa reminds you a configurable number of days before next Ramadan begins, so you have time to fast what's left. This is the canonical *"make up before next Ramadan"* deadline.
- **Custom date.** You pick a specific date — useful if you've decided to finish by a personal deadline (Hijri new year, your birthday, the last day of Sha'ban, etc.).

### Privacy mode

An optional toggle hides the count from your notifications. With privacy mode on, reminders read *"check your pending tasks"* rather than showing the remaining number — useful if your lock-screen previews are visible to others. The count itself is always available inside the app; nothing leaves your device either way.

## How Nedaa handles your data

The short version: no account, no cloud sync, no advertising, no third-party tracking SDKs. Your qada count and notes live in a local SQLite database on your device. Crash reporting via Sentry ships off and is opt-in. Source at [github.com/NedaaDevs/nedaa](https://github.com/NedaaDevs/nedaa).

The full position is on the [Privacy page](/privacy).

## Why a dedicated tracker

Across the years, keeping track of qada — both within the year and between years — gets tedious. People returning to practice after a long absence often have whole or partial Ramadans behind them. The most common failure mode isn't laziness; it's **losing count** — over-counting from anxiety, or under-counting from forgetting.

Nedaa's tracker is intentionally small. It does not gamify, streak, or shame. It counts.

## Frequently asked questions

### Does Nedaa's qada tracker handle missed prayers?

No. It is for missed Ramadan fasts only. The classical position across the four madhahib is that menstruating women make up missed fasts but not missed prayers, and Nedaa's tracker is scoped to that case. If you need to make up missed prayers, that is a separate jurisprudential question handled outside the app.

### Do I need to fast my qada days in a row?

No. The classical position is that qada days do not need to be consecutive. You can spread them across the year between Ramadans.

### When is the deadline to make up missed fasts?

Before the start of the next Ramadan. If a Ramadan passes and you still owe fasts from a previous Ramadan without a valid excuse, scholars discuss whether *fidya* (feeding a poor person per missed day) becomes due in addition to the fast. Nedaa stays neutral on these scholarly questions and just helps you get the fasts done in time.

### Does Nedaa track kaffara (expiation) for deliberately broken fasts?

No. Kaffara is a separate, much heavier expiation (typically sixty consecutive days of fasting or feeding sixty poor people, per scholarly opinion). Nedaa does not currently handle it. The qada tracker only counts makeup days.

### Can I use the tracker for voluntary fasts I missed?

The tracker is designed for obligatory Ramadan fasts. You could repurpose it for voluntary fast goals, but the Ramadan-anchored reminder is built around the obligatory deadline.

### Does Nedaa sell my data?

No. Nedaa does not collect personal data and therefore has nothing to sell. There are no advertising or third-party tracking SDKs in the app. Crash and performance reporting is **off by default** — it only runs if you opt in. Even when enabled, it is unlinked and untracked, declared in the iOS Privacy Manifest, and the full source is open for audit.

### Is Nedaa free?

Yes. Free, no ads, no paywalls, no subscriptions, no premium tier. Open source on GitHub at `NedaaDevs/nedaa`.

## Get Nedaa

- **iOS:** App Store — bundle id `dev.nedaa.app`
- **Android (Google Play):** package `dev.nedaa.android`
- **Android (Huawei AppGallery):** same package, separate `production-hms` build with no Google dependencies
- **Source:** github.com/NedaaDevs/nedaa
- **Support:** support@nedaa.dev

---

*Last updated: 2026-05-10*

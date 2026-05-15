---
title: A prayer alarm that actually wakes you — Fajr and Jummah alarms in Nedaa
locale: en
published: true
last_updated: 2026-05-10
description: Nedaa's Fajr and Jummah alarms use real OS-level alarms — Apple AlarmKit on iOS 26+, native Android foreground alarm service — not notifications. Wake-up challenges, custom Athan sounds, Huawei build for non-GMS devices.
canonical: https://nedaa.dev/docs/prayer-alarm
hreflang:
  - lang: en
    href: https://nedaa.dev/docs/prayer-alarm
  - lang: ar
    href: https://nedaa.dev/ar/docs/prayer-alarm
---

# A prayer alarm that actually wakes you

Nedaa is a free, open-source prayer-times app for iOS and Android. The alarm feature ships with two alarm types — Fajr and Jummah — built on the same real OS-level alarm infrastructure. Fajr is the hardest case (an overnight alarm on a silenced phone), so most of this page focuses on it; Jummah behaves the same.

Most prayer-time apps schedule notifications for Athan. A notification respects your Do Not Disturb settings and your media volume, so on a phone left on the bedside table for eight hours it often produces a quiet chime — or nothing. Nedaa schedules real alarms instead: the same OS-level mechanism your system Clock app uses. They override silent mode, ring at full volume, and require active dismissal.

## How it works on each platform

### iOS 26+ — Apple AlarmKit

On iPhones running iOS 26 or later, Nedaa uses Apple AlarmKit, the system framework Apple introduced for third-party alarm apps. AlarmKit alarms:

- Ring even when the device is silenced or in Do Not Disturb / Focus modes.
- Show on the lock screen as a system-style alarm UI, not a banner notification.
- Persist through app termination — the OS handles the trigger, not Nedaa's process.
- Are scheduled via the same authorization model as system alarms (the user grants alarm permission once).

When a wake-up challenge is configured, Nedaa adds a layer on top of AlarmKit's standard dismiss. AlarmKit's system stop button hands the alarm back to the app instead of silencing it directly, which means a half-asleep dismiss doesn't end the alarm — you have to actually complete the challenge in-app before the audio stops. This closes the obvious loophole of just hitting "stop" and rolling back over.

Nedaa requests AlarmKit authorization on first use of the alarm feature. On iOS versions earlier than 26, the alarm feature is not available; prayer notifications (a separate feature) work on all iOS versions.

### Android — native foreground alarm service

On Android, Nedaa schedules an **exact alarm** with `AlarmManager` and runs a **foreground service** when it fires, with:

- **Full-screen alarm activity** that takes over the lock screen — same behaviour as the system Clock app.
- **Native audio routing** through a dedicated `AlarmAudioManager` so the alarm sound bypasses media-volume settings.
- **Overlay service** for cases where the lock screen activity can't take focus.
- **Persistent through reboot** — alarms re-register on `BOOT_COMPLETED`.

This is built as a custom Expo native module (`modules/expo-alarm`) — the source is in the public repository and can be audited.

### Android on Huawei devices (no Google Mobile Services)

Most Islamic-app developers ship one Android build that depends on **Google Mobile Services (GMS)** — Google's proprietary location, push, and play-services APIs. On Huawei devices sold without GMS (the post-2019 international Huawei lineup), those apps degrade or fail outright.

Nedaa ships a **separate `production-hms` build** for Huawei AppGallery that:

- Removes all GMS dependencies at the gradle level (`BUILD_VARIANT=hms`).
- Uses Huawei Mobile Services for location and related platform integrations.
- Falls back to AOSP rotation-vector sensors for the Qibla compass instead of Google's Fused Orientation Provider.

The alarm itself is the same native module on both Android variants — alarm scheduling doesn't depend on GMS.

## Wake-up challenges

Nedaa's alarm supports an optional **wake-up challenge** that you must complete before the alarm dismisses. Two challenge types are built in:

- **Tap** — hit a button a configured number of times before the alarm dismisses. Stops the half-asleep "swipe and back to sleep" failure mode.
- **Math** — a simple arithmetic problem. Forces enough cognition that you're actually awake before you stop the alarm.

Challenges are off by default and configured per-alarm in the Fajr or Jummah alarm settings.

## Alarm types

Two alarm types ship in the app:

- **Fajr** — the primary use case. Anchored to your computed Fajr time and updated automatically when your calculation method, latitude adjustment, or location changes.
- **Jummah** — a separate weekly alarm so you don't miss Friday prayer when your routine changes.

Each type has its own sound, challenge, and dismiss/snooze configuration.

## Custom Athan sounds

Nedaa lets you provide **your own Athan audio file** as the alarm sound — useful if you want a recitation by a specific muezzin, or your home mosque's Athan, or a particular qari'. The file lives locally on your device.

## How Nedaa handles your data

The short version: no account, no cloud sync, no advertising, no third-party tracking SDKs. Alarm settings live in a local SQLite database on your device. Crash reporting via Sentry ships off and is opt-in. Source at [github.com/NedaaDevs/nedaa](https://github.com/NedaaDevs/nedaa).

The full position is on the [Privacy page](/privacy).

## Frequently asked questions

### Why does my current prayer app fail to wake me up?

Most prayer apps schedule **notifications**, not alarms. Notifications respect your Do Not Disturb / Focus settings and your media-volume settings, so on a silenced phone overnight they often produce a quiet chime — or no audible signal at all — that doesn't wake the sleeper. Real OS-level alarms behave differently: they bypass silent mode and require active dismissal.

### What is AlarmKit and what iOS version do I need?

AlarmKit is the iOS system framework, **introduced in iOS 26**, that lets third-party apps schedule real alarms. AlarmKit-scheduled alarms behave like the system Clock app's alarms. Nedaa's alarm feature requires iOS 26.

### Does the alarm work if I close Nedaa?

Yes. On iOS, the OS handles the trigger via AlarmKit independent of whether the app is running. On Android, the alarm is registered with `AlarmManager` and triggers a foreground service even after the app is swept from recents. On Android, alarms also re-register on device reboot.

### Does the alarm work if my phone is in Do Not Disturb / Focus mode?

Yes. Real alarms are designed to override silent and DND modes — both AlarmKit on iOS and Android's alarm stream behave this way.

### Will Nedaa work on my Huawei phone without Google services?

Yes. Nedaa ships a dedicated `production-hms` build on Huawei AppGallery with no GMS dependencies. Prayer times, alarms, athkar, and the Qibla compass all work on Huawei devices that lack GMS. This is rare among Islamic apps.

### Can I use my own Athan sound?

Yes. You can supply a custom audio file as the alarm sound, per alarm type. The file stays on your device.

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

---

_Last updated: 2026-05-10_

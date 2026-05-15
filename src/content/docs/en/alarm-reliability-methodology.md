---
title: How to actually measure whether a Fajr alarm wakes you — a methodology
locale: en
published: true
last_updated: 2026-05-10
description: A reproducible protocol for measuring whether prayer-time apps actually wake you up. Why most "alarm" features in Islamic apps are notifications. The technical difference between AlarmKit, critical notifications, and Android exact alarms. Methodology + Nedaa's implementation as the reference case.
canonical: https://nedaa.dev/docs/alarm-reliability-methodology
hreflang:
  - lang: en
    href: https://nedaa.dev/docs/alarm-reliability-methodology
  - lang: ar
    href: https://nedaa.dev/ar/docs/alarm-reliability-methodology
---

# How to actually measure whether a Fajr alarm wakes you

Most prayer-time apps advertise "Fajr alarm." Most of those alarms are **notifications dressed up as alarms** — they fail to wake the user roughly as often as they succeed, especially when the phone is on silent overnight or in Do Not Disturb. This piece documents:

1. The technical differences between an actual alarm and the various weaker mechanisms that get marketed as alarms.
2. A reproducible measurement protocol for evaluating real-world wake reliability.
3. Nedaa's implementation as a reference case, with code and platform-specific behaviour open for inspection.

It does not (yet) include comparative results from other apps — running that test takes 30 days of measurement per device. The methodology is publishable now; results land when the test runs.

## What "alarm" actually means in mobile OSes

There is no single API called "alarm" on iOS or Android. The word is a marketing term that maps to several distinct implementation patterns, with different reliability characteristics. From least to most reliable:

### 1. Standard notification

A scheduled local notification. Plays the user's notification sound (or none if the phone is silent). Banner appears on lock screen. **Respects** all of: silent mode, Do Not Disturb, Focus modes, system volume.

This is what most Islamic apps actually ship as "Fajr alarm." It works in daytime when the phone is awake and unsilenced. It commonly fails overnight on a silenced phone — which is the only time it actually matters.

### 2. Critical notification (iOS) / High-priority notification (Android)

A privileged notification that bypasses Do Not Disturb and silent mode. On iOS this requires the special **Critical Alerts entitlement**, which Apple grants sparingly; on Android it requires a high-importance notification channel and works on most OEM ROMs.

More reliable than a standard notification. Still a notification, not an alarm — there's no full-screen takeover, no required-dismissal interaction, and behaviour varies across OEMs (Samsung, Xiaomi, OnePlus, Huawei all customise the notification stack).

### 3. Audio-in-background (the "fake alarm" pattern)

The app keeps an audio session alive in the background and plays the alarm sound at the trigger time. Often combined with a notification.

This pattern was common before iOS 26 / AlarmKit because real alarms weren't available to third-party apps. It is fragile: iOS aggressively suspends background audio sessions, the app's process can be killed by the OS or by the user swiping it away from app-switcher, and battery cost is high if the app keeps audio "warm" all night.

### 4. Real OS-level alarm

The OS itself owns the trigger — not the app's process. The app schedules the alarm; the alarm fires whether or not the app is running. Behaviour matches the system Clock app: full volume, lock-screen takeover, requires active dismissal, bypasses silent and Do Not Disturb modes.

Implementations:

- **iOS 26+** — **Apple AlarmKit**, the system framework Apple introduced at WWDC 2025 specifically to give third-party apps real alarm capabilities. This is the only first-party path on iOS to a real alarm. Apps add `NSAlarmKitUsageDescription` to Info.plist, then call `AlarmManager.requestAuthorization()`; the user grants permission once (states: `notDetermined | authorized | denied`). Focus modes need a per-app allow toggle to avoid filtering the alarm.
- **iOS earlier than 26** — no real alarm API exists for third-party apps. Apps that ship a "Fajr alarm" feature on those versions are using critical notifications or background audio under the hood. Both are weaker than a real alarm.
- **Android (any version)** — `AlarmManager.setExactAndAllowWhileIdle()` for the trigger, plus a **foreground service** when the alarm fires that can present a full-screen activity, route audio to the alarm stream, and re-register on `BOOT_COMPLETED` so reboots don't kill the alarm. Permission-gated since Android 12 (`SCHEDULE_EXACT_ALARM`); since **Android 14** that permission is **denied by default**, so apps either ask the user to grant it in Settings or — for legitimate alarm-clock-category apps — declare `USE_EXACT_ALARM`, which Google auto-grants. Nedaa declares both: `USE_EXACT_ALARM` for the modern path, `SCHEDULE_EXACT_ALARM` as a fallback. OEM aggressive-battery-killers (MIUI, OneUI, EMUI) can still interfere; the foreground service mitigates this on most devices.

**Real OS-level alarms are the only mechanism reliable enough to recommend for Fajr.** Everything else is a probabilistic notification.

## Why most apps don't ship a real alarm

Three reasons:

1. **AlarmKit is new.** Apple shipped it in iOS 26. Apps that haven't been updated since 2025 are still on critical-notifications-or-worse.
2. **Critical Alerts requires Apple's approval** — which is granted to relatively few apps. Apps that want to bypass DND without using AlarmKit need this entitlement.
3. **The Android implementation is non-trivial.** A real Android alarm requires `AlarmManager` scheduling, a foreground service with the right service type, an audio manager that bypasses media-volume settings, a full-screen activity requesting `USE_FULL_SCREEN_INTENT`, an overlay service for fallback, a `BOOT_COMPLETED` receiver, and handling for at least Samsung/Xiaomi/Huawei/OnePlus battery-saver behaviour. Nedaa's `modules/expo-alarm/android/` is roughly 3,800 lines of Kotlin/Java plus substantial QA across OEMs.

Most teams ship the notification path because it's days of work, not months, and it's adequate for daytime prayers. For Fajr specifically, "adequate" isn't.

## The measurement protocol

To evaluate any prayer-time app's Fajr-alarm reliability, run the following protocol. Reproducible, comparable across apps, takes 30 days per device.

### Setup

1. **Test device.** A real phone (not a simulator). Note the OS version, OEM, and any battery-saver / aggressive-app-management settings.
2. **Test conditions.** Phone on silent (or Do Not Disturb / Focus) overnight, on bedside table at typical use distance. Charging or not — record either way.
3. **Test app.** Configured with Fajr alarm enabled, alarm sound chosen, and any "wake-up challenge" feature enabled if present.
4. **Control.** Same test on the same device with the system Clock app's alarm at the same time. The system alarm is the reliability ceiling.

### Daily measurement

For 30 consecutive days, record:

| Field                                       | Notes                                                 |
| ------------------------------------------- | ----------------------------------------------------- |
| Date                                        |                                                       |
| Test app fired?                             | Y/N                                                   |
| Test app rang at full volume?               | Y / N / partial                                       |
| Test app required active dismissal?         | Y/N                                                   |
| Test app woke the sleeper?                  | Y/N (subjective — record honestly)                    |
| Time from scheduled trigger to actual fire  | In seconds. >10s of drift is a fail.                  |
| System Clock alarm fired (control)?         | Y/N                                                   |
| Was the test app force-killed before sleep? | Y/N (test "what if user swiped it from app-switcher") |
| Was the device rebooted within last 12h?    | Y/N (test boot-completion re-registration)            |

### Reporting

After 30 days:

- **Wake rate** = (days woken / 30). Compare to control.
- **Drift distribution** — histogram of trigger-to-fire time differences.
- **Force-kill survival** = (days fired after force-kill / days force-killed). Tests whether the alarm survives the user's normal phone-cleanup behaviour.
- **Reboot survival** = (days fired after reboot / days rebooted). Tests `BOOT_COMPLETED` re-registration.
- **Volume ceiling** = % of days the alarm rang at full volume regardless of media-volume setting.

A real alarm should score >95% wake rate, <5 second drift, >95% force-kill survival, and 100% volume-ceiling (always full volume). A notification-based "alarm" typically scores 60-85% wake rate with high variance.

## Nedaa's implementation as the reference case

Nedaa is open source. The alarm code is at `modules/expo-alarm/` in the public repository.

### iOS

- **iOS 26+** uses Apple AlarmKit via `AlarmKit.AlarmManager`. Authorization via `AlarmManager.requestAuthorization()` with `NSAlarmKitUsageDescription` declared in Info.plist. Scheduled alarms persist through app termination and device sleep; they fire whether or not the app process is running.
- **Pre-iOS-26** the alarm feature is gated off. Prayer notifications (a separate, weaker mechanism) remain available, but Nedaa does not present them as an alarm.
- The native module is at `modules/expo-alarm/ios/`.

### Android

- Scheduling: `AlarmManager.setExactAndAllowWhileIdle()` with both `USE_EXACT_ALARM` and `SCHEDULE_EXACT_ALARM` declared in `AndroidManifest.xml`. On Android 14+, `USE_EXACT_ALARM` is auto-granted for alarm-category apps; `SCHEDULE_EXACT_ALARM` is the fallback (default-deny since Android 14, requires user grant in Settings if it's the active path).
- Trigger handler: `AlarmReceiver` (BroadcastReceiver) → `AlarmService` (foreground service with `mediaPlayback` service type) → full-screen `AlarmActivity` over the lock screen.
- Audio: `AlarmAudioManager` routes to `STREAM_ALARM`, bypassing media-volume settings.
- Persistence: `BOOT_COMPLETED` receiver re-registers all scheduled alarms after device reboot.
- Overlay fallback: `AlarmOverlayService` for cases where the lock-screen activity can't take focus (some OEM ROMs).
- The native module is at `modules/expo-alarm/android/src/main/java/expo/modules/alarm/`.

### Both platforms

- Wake-up challenges (`"tap"` and `"math"`, in `modules/expo-alarm/src/index.ts`) require active cognitive dismissal, mitigating the "swipe to dismiss and fall back asleep" failure mode.
- Alarm types are explicitly modelled (`"fajr" | "jummah"`) so each can have its own sound, challenge, and snooze configuration.
- The source is open. Anyone evaluating this benchmark methodology can audit Nedaa's claims directly.

## What the benchmark is _not_ claiming

To stay honest about scope:

- It does not measure **how pleasant** the alarm sound is.
- It does not measure **how easy the configuration UI is**.
- It does not evaluate **prayer-time accuracy** — that's a separate question covered on the [prayer-times page](/docs/prayer-times).
- It does not certify any app as "the best." Reliability is a measurable property; subjective preference is not.

## Why this matters

The audience that cares about Fajr is the audience that's trying to wake up to pray when most people are asleep. For that audience, "the alarm rang loudly enough to actually wake you" is the only metric that matters. Every other metric is a proxy.

The measurement methodology above is reproducible and we'd welcome comparable results from other apps' teams — including ones that beat Nedaa's reliability. The point isn't to win the benchmark; it's to make the dimension measurable so users can choose informed.

## Contribute results

If you run this protocol on any prayer-time app and want to publish results, open an issue at <https://github.com/NedaaDevs/nedaa/issues> with title `[alarm benchmark] <app name> v<version> on <device>` and include your 30-day numbers in the schema above.

We'll publish results — including ones for Nedaa that show problems we need to fix.

---

_Last updated: 2026-05-10. Methodology is stable; results land when measurement runs._

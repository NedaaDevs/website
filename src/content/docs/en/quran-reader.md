---
title: Quran reader — the Madinah Mushaf, with audio and read-along
locale: en
published: true
last_updated: 2026-08-25
description: Nedaa's Quran reader ships three Madinah Mushaf editions from the King Fahd Complex, a reflowable text mode, verse and word-level read-along audio, bookmarks, highlights, similar-verse tools, and a tajweed reference. Free, open source, offline after download.
canonical: https://nedaa.dev/docs/quran-reader
hreflang:
  - lang: en
    href: https://nedaa.dev/docs/quran-reader
  - lang: ar
    href: https://nedaa.dev/ar/docs/quran-reader
---

# Quran reader — the Madinah Mushaf, with audio and read-along

Nedaa is a free, open-source prayer-times and Islamic-companion app for iOS and Android. The Quran reader is the largest feature in the app: the printed Madinah Mushaf on your screen, recitation that follows the page word by word, and the reading tools a person actually uses over years.

## What a Quran app has to get right

Most people reading the Quran on a phone are not reading it for the first time. They have a mushaf they know. They may have memorised from it, and if so the position of a verse on its page is part of the memory — the end of page 5 *is* the end of a specific verse.

That makes the design problem narrower than it looks. A Quran app is not asked to invent a reading experience. It is asked to reproduce a printed one faithfully, put recitation next to it, and then get out of the way. Everything below follows from that.

## What Nedaa's Quran reader includes

### Three Madinah Mushaf editions

The reader ships three editions of the Madinah Mushaf, produced by the **King Fahd Glorious Qur'an Printing Complex** in Madinah:

| Edition | In the app | Character |
| --- | --- | --- |
| QCF v1 | Madinah Mushaf 1405 | The classic black-and-white Madinah print |
| QCF v2 | Madinah Mushaf 1420 | Refined letterforms — the everyday standard |
| QCF v4 | Madinah Mushaf 1439 | Full-colour tajweed for recitation rules |

All three keep the standard 604-page layout, so page numbers, juz boundaries, and line positions match the printed copy you already own. You pick an edition, download it, and can switch or delete editions later.

### A text mode that needs no download

Alongside the page-image mushaf there is a **text mode** that renders the Quran as live text — the Tanzil Uthmani text in the King Fahd Complex's UthmanicHafs face. It needs no download at all, so the reader works the moment you open it.

Text mode keeps the same 604 page boundaries as the printed mushaf; the verses are reflowed, not re-paginated. Its reading size runs from 20 to 48 points, adjustable with a side-mounted stepper or by pinching the page. This is the mode to use if the printed mushaf's fixed type is too small to read comfortably.

### Recitation, with word-level read-along

Pick a reciter and press play. The reader follows along: it can tint **the whole verse** as it is recited, or **the individual word**, and it turns pages for you as the recitation moves. Word-level highlighting depends on published word timings for that recitation; where they do not exist yet, read-along falls back to verse level.

- Reciters are offered in **Murattal, Mujawwad, and Tajweed** styles where they exist.
- Play a single verse, or play from a verse onward.
- At the end of a surah, choose to continue, repeat, or stop.
- A **sleep timer** stops playback after a set time or at the end of the current surah.
- Audio downloads per surah or per reciter for offline listening, with a running storage total and a delete-all control.

Playback uses native media controls — lock screen, AirPods, Bluetooth — and continues in the background.

There is also a separate **Listen** surface for recitation without the page, which has been in the app since before the reader shipped.

### Reading tools

- **Bookmarks.** Four coloured ribbons you can name and move — the digital version of the ribbons sewn into a printed mushaf.
- **Highlights.** Seven colours, and you rename the colours themselves to mean whatever you need them to mean. A colour's name is shared across the whole Quran, so "verses to memorise" stays "verses to memorise" everywhere.
- **Similar verses.** The *mutashabihat* — near-identical verses that people who memorise routinely confuse. The reader marks them, shows them side by side, and lets you write your own memory aid against the pair.
- **Share a verse** as a mushaf image or as text.

### A built-in reference guide

The reader carries a short reference for the marks printed on the page, so you can tap one rather than look it up:

- **Tajweed colours** — ghunnah, idgham with and without ghunnah, and the rest of the colour key used by the v4 edition.
- **Stop signs** — the waqf marks. Every waqf sign in the text is individually tappable.
- **Prostration verses** — where sujood al-tilawah applies, with the supplication and its hadith reference.

### Navigation

Browse by surah or verse, search surah names, or jump directly to a surah, juz, hizb, or page number. The running header carries the surah name and the juz you are in.

### Reading themes and layout

Reading themes — Light, Sepia, Dark, and Nedaa — are **separate from the app's own appearance**, because the light you read in is not the light you check prayer times in. Editions with dedicated dark-theme page images offer them as an optional extra download.

Layout options cover a one-page or two-page spread (useful on tablets), horizontal page turns or vertical scrolling, and an auto-scroll at three speeds for hands-free reading.

### A Friday reminder for Surah Al-Kahf

An optional weekly reminder for **Surah Al-Kahf** on Fridays. It is off until you turn it on, like the rest of Nedaa's notifications.

## Downloading, storage, and offline use

The mushaf editions are page images, so they are a real download rather than a few kilobytes of text. Nedaa is explicit about it:

- The download runs in two steps — pages first, then decorations — with per-page progress.
- You can **start reading while it downloads.**
- Downloads pause, resume, and retry, and a failed page does not lose the rest.
- Choose light-only or light-and-dark images.
- The app checks free space first and tells you what it needs, and warns before a large download over cellular.
- Editions can be deleted individually to free space.

**Once an edition is downloaded, reading it needs no network.** The same applies to recitation you have downloaded. What still needs the network is fetching an edition or a reciter you have not downloaded yet.

## How Nedaa handles your data here

No account, no cloud sync, no advertising, no third-party tracking SDKs. Your bookmarks, highlights, memory-aid notes, reading position, and downloaded files live on your device.

Two things do leave the device, both controlled by a single **"Share anonymous usage stats"** switch in Settings, which you can turn off at any time:

- When you play a recitation, the app sends the **recitation's id** — not who played it, not when you read, not what you read.
- When you install a mushaf edition, the app sends the **edition version**.

Neither carries an account, a device identifier, or a user id, and each is rate-limited to once every thirty minutes. They exist so we can see which reciters and editions people actually use, and they are the numbers published on the operational ledger on our home page. Everything else about your reading stays on your phone.

The full position is on the [Privacy page](/privacy).

## Frequently asked questions

### Which mushaf does Nedaa use?

The Madinah Mushaf from the King Fahd Glorious Qur'an Printing Complex, in three editions — 1405 (QCF v1), 1420 (QCF v2), and 1439 (QCF v4, with full tajweed colouring). All three use the standard 604-page layout.

### Does the Quran reader work offline?

Yes, once you have downloaded an edition. Text mode works offline immediately with no download at all. Recitation works offline for surahs you have downloaded.

### Can I follow the recitation on the page?

Yes. Read-along highlights either the whole verse or the individual word as it is recited, and turns pages as the recitation moves. Reciters are available in Murattal, Mujawwad, and Tajweed styles.

### Can I make the text bigger?

In text mode, yes — from 20 to 48 points, by stepper or by pinching. The page-image mushaf reproduces a printed page, so its type is fixed; use text mode, or the two-page/whole-page layout options, if the print is too small.

### What are "similar verses"?

The *mutashabihat* — verses that closely resemble one another and are a common source of error when memorising. Nedaa marks them, shows the pair together, and lets you attach your own memory aid.

### Where does the Quran text come from?

The text is from the **Tanzil Project**, under CC-BY 3.0. The UthmanicHafs font and the page layout are the King Fahd Glorious Qur'an Printing Complex's work. Verse divisions and recitation timings come from the **Quranic Universal Library (QUL)** by Tarteel. Recitation audio comes from **QuranicAudio** and **quran.com**, mirrored via QUL. All of it is credited in the app's Acknowledgements screen.

### Does Nedaa sell my data?

No. Nedaa does not collect personal data and has nothing to sell. No advertising or tracking SDKs, no account. The anonymous play and download counts described above are the only Quran-related data that leaves your device, and you can switch them off.

### Is Nedaa free?

Yes. Free, no ads, no paywalls, no subscriptions, no premium tier. The Quran reader is not a paid tier of anything.

## Get Nedaa

- **iOS:** App Store — bundle id `dev.nedaa.app`
- **Android (Google Play):** package `dev.nedaa.android`
- **Android (Huawei AppGallery):** same package, separate `production-hms` build with no Google dependencies
- **Source:** github.com/NedaaDevs/nedaa
- **Support:** support [at] nedaa.dev

## Credit

- **Tanzil Project** (`tanzil.net`) — Quran text in Uthmani script, CC-BY 3.0.
- **King Fahd Glorious Qur'an Printing Complex** (`qurancomplex.gov.sa`) — the UthmanicHafs font and the Madinah Mushaf page layout.
- **Quranic Universal Library (QUL)** by **Tarteel** (`qul.tarteel.ai`) — verse divisions and recitation timing.
- **QuranicAudio** (`quranicaudio.com`) and **quran.com** — recitation audio, mirrored via QUL.

The tool we wrote to render the mushaf page images is open source as well, at `github.com/NedaaDevs/quran-image-generator`, and was inspired by `quran/quran.com-images`.

---

*Last updated: 2026-08-25*

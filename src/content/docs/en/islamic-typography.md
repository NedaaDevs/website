---
title: Why digital Quran apps look the way they do — a guide to Islamic typography on small screens
slug: islamic-typography
locale: en
last_updated: 2026-05-06
description: Why Quran apps use page images instead of rendered text, the Uthmani/Imlaei script question, Arabic line-breaking on mobile, and the typography decisions hiding inside every Islamic app. Written from inside Nedaa's open-source codebase.
canonical: https://nedaa.dev/research/islamic-typography
---

# Why digital Quran apps look the way they do

A guide to Islamic typography on small screens — written by the team building Nedaa, an open-source prayer-times and Quran-reader app for iOS and Android.

If you've ever opened two Quran apps side by side and noticed they show the same verse differently — different diacritic placement, different line breaks, different page numbers, sometimes a slightly different *spelling* — you've bumped into a thicket of typographic and editorial decisions that most apps make silently. This piece pulls those decisions into the open.

It's written from a practitioner's seat: we're shipping a Quran reader inside Nedaa, the source code is public, and the decisions below are ones we either made deliberately or inherited from upstream sources. Where Nedaa picked a side, we'll say so.

## Why digital Quran apps use page images, not text rendering

The most common architectural choice in serious Quran apps surprises people: **the page is a picture, not text.** It's a PNG (or WebP) of a printed mushaf page rendered onto the screen. The app then overlays interactive elements — ayah-tap targets, highlight regions, audio sync — on top of an image.

If you're a software engineer this looks backwards. Why ship images when you have a perfectly good Arabic text renderer? Three reasons converge:

### Reason 1 — Memorisers rely on page-end positions

People who have memorised the Quran (huffaz, singular hafiz/hafiza) typically memorise the **Madinah Mushaf layout** — the standard 15-lines-per-page printing produced and distributed by the King Fahd Quran Complex in Madinah. After years of memorisation, the visual position of an ayah on its page becomes part of the memory. The end of page 5 *is* the end of a specific ayah. The fourth line of page 117 *contains* a specific phrase.

If a digital app reflows text to fit the user's font size, those positional anchors break. The hafiz can no longer use the page as a memory aid. **For an app whose target audience includes huffaz, reflowing the text is a worse trade-off than the cost of shipping image bundles.**

### Reason 2 — Calligraphic fidelity at small sizes

Arabic script has features — ligature joins, contextual letter forms, diacritic stacking, the *tashkīl* (vowel marks) sitting precisely over their letters — that are difficult to render perfectly at the dense 15-line-per-page layout on a 6-inch phone screen. The printed Madinah Mushaf is the work of master calligraphers (Uthman Taha being the most prominent, with editions calligraphed in the 1980s onward). Reproducing that calligraphy precisely from a font-rendered fallback means competing with the calligrapher; the image is just *the calligrapher's work, photographed.*

### Reason 3 — Diacritics, line-breaking, and the rasm

Even rendering "the Quran text" raises a question most apps don't ask the user: **which version of the text?**

The Quran has been transmitted in two forms relevant to printed editions:

- **Uthmani text** preserves the *rasm* — the original consonantal skeleton of the Uthmanic codex compiled in the seventh century. Diacritics and vowel marks were added later as reading aids. The Madinah Mushaf uses Uthmani text.
- **Imlaei text** applies modern Arabic spelling rules to the same content. It's what you'd get if you typed the Quran into a contemporary Arabic word processor. It's easier for non-Arabic-native readers to follow because the spelling matches everyday Arabic.

These differ in dozens of small but visible ways — letters with sukun marks, alef variants, the placement of the small alef (*alef khanjariyya*). For a memoriser the difference matters; for a casual reader it usually doesn't, but disclosing the choice is rare.

When apps render text from a font, they are committing to one. **Image-based mushafs sidestep the question by faithfully reproducing whatever printed edition they're scanning** — Madinah Mushaf in Uthmani, in this case.

## The hybrid approach: image pages plus font glyphs

Pure image-based mushafs have their own cost: **the app can't react to where on the page the user tapped.** If page 117 is just a PNG, the app doesn't know whether the user tapped on ayah 3 or ayah 4 unless someone manually annotated coordinate boxes for every ayah on every page. For 604 pages × ~7-15 ayat per page, that's a lot of manual work.

The technique that has emerged in serious Quran apps is **hybrid rendering**: the page background is a high-fidelity image, but ayah numbers and ayah markers are positioned over the image using a custom font with known glyph coordinates. Because the font's glyph metrics are deterministic, the app can place an interactive marker at the correct on-screen position and use it as a tap target.

Nedaa's reader uses this pattern, with a custom font module (`expo-mushaf-line` in our codebase) that exposes glyph bounds so the React Native layer can register the right tap regions. The page itself stays an image — preserving calligraphic fidelity and memorisation positions — but it's no longer dumb.

This is a real engineering tradeoff. It works well; it's also fiddly. Glyph coordinates have to match the page image at every supported display density. Font versioning has to track image versioning. Search has to query a separate text database (because you can't grep an image), and tapping on a search result has to navigate back to the right pixel rectangle on the right page.

## The QCF page-image tradition

The widely-used corpus of Madinah Mushaf page images comes from the **King Fahd Quran Complex** (KFQC, also called King Fahd Glorious Quran Printing Complex) in Madinah. The complex has produced multiple editions of the Madinah Mushaf over the decades; in the digital ecosystem these are commonly referred to as **QCF v1, v2, and v4** (v3 exists but is less commonly distributed publicly). They differ in calligraphic detail, diacritic placement conventions, and rendering generation.

Nedaa supports v1, v2, and v4. We don't editorialise about which is "best" — these are scholarly editions and the choice is the user's. We surface the version selector with visual previews so a user can pick the one that matches what they grew up with or memorised from.

## Searching across diacritics

Search is the single hardest typographic problem inside a Quran app, and almost no user notices when it works.

The naive approach — run a `LIKE` query against the verse text — fails because Arabic text in the database is fully voweled (with diacritics) and users typically search without typing diacritics. The query "الرحمن" should match "الرَّحْمَٰنِ" but a literal text comparison won't.

Nedaa's reader uses **SQLite's FTS5 (full-text search) module** with custom Arabic tokenizer rules to normalise diacritics out of the indexed text while preserving them in the displayed result. The indexed string strips tashkīl, *shadda*, and the small alef; the display string keeps everything. Search by "الرحمن"; see "الرَّحْمَٰنِ" highlighted on the page.

This is mostly invisible work that ships in the database file, not in the UI. It's the kind of detail that distinguishes a Quran app built by people who tried to use one from a Quran app built by people who didn't.

## Pairing Latin and Arabic typefaces

The Quran reader is half of Nedaa. The other half — prayer times, alarm settings, athkar — has UI in five languages: English, Arabic, Malay, Urdu, and growing.

Most apps pick a single typeface and let it render everything. That works badly. **Latin typefaces and Arabic typefaces have different baselines, different weights at the same nominal weight, different x-heights, and different line-height conventions.** A typeface that looks balanced in English will look thin or mis-aligned in Arabic, and vice versa.

Nedaa pairs:

- **Asap** for Latin scripts (UI, English, Malay, Urdu transliteration)
- **IBM Plex Sans Arabic** for Arabic UI text and labels

The two are paired deliberately so that a settings screen with mixed Arabic and English (a common case) reads as one visual whole rather than two clashing systems. Locale-aware font swap is implemented at the component level: the same `Text` component renders Asap or IBM Plex Sans Arabic depending on the active locale.

For Quran *body* text (the ayah display in text-mode reader, separate from the image-based mushaf reader), the rules change again. Quran text needs typefaces designed specifically for Quranic typography — diacritic positioning, ligature behaviour, and aesthetic conventions specific to mushaf rendering. That's not what UI fonts are for.

## What's still hard

A research piece that doesn't list the unsolved problems isn't honest. The hard parts of Islamic-app typography we're still working through:

1. **High-DPI image scaling.** Page-image mushafs at modern phone resolutions are large. Shipping every density variant inflates the download. Generating them on the fly costs CPU and memory. There is no clean answer.
2. **Word-level audio sync.** Ayah-level audio (the EveryAyah pattern) is straightforward; the audio file maps to one ayah, played end-to-end. Word-level sync — highlighting each word as the reciter recites it — needs accurate word timestamps for every reciter for every ayah, and those datasets are sparse and inconsistent.
3. **Right-to-left layout for mixed Arabic+Latin UI.** The whole app supports RTL, but specific edge cases (timestamps in chat-style logs, percentage indicators, version numbers) need bidi-text handling that platform components don't always get right.
4. **Madhhab-neutral copy in a script-rich UI.** Every Arabic Islamic word the UI surfaces (Salah, Athan, Iqama, Sa'i, Tawaf) is also a typographic decision — bold or regular weight, with or without diacritics, transliterated or in script. Getting this consistent across five locales is its own work.

## Why this matters beyond Nedaa

The typographic decisions inside a Quran app aren't visible to most users, but they're load-bearing. **An app that picks Imlaei text without telling you is making an editorial choice on your behalf. An app that ships only one QCF version is silently picking which calligrapher's work you read. An app that renders text at low fidelity is choosing convenience over the printed tradition.**

Most of these decisions are defensible — none of the options is *wrong* — but they are decisions, and they belong in the open where users can evaluate them. That's the job of writing this piece.

Nedaa's source code is at `github.com/NedaaDevs/nedaa`. The Quran reader's design document is at `docs/plans/2026-03-14-quran-mushaf-reader-design.md` in that repo. Anything we got wrong here, you can audit; anything we describe, you can verify.

## Credit

- **King Fahd Quran Complex (KFQC)**, Madinah — page-image editions of the Madinah Mushaf (QCF v1, v2, v4) that anchor the image-based reader pattern across the ecosystem.
- **Tanzil Project** (`tanzil.net`) — Quran text in Uthmani script, CC-BY 3.0. Required attribution preserved in our app's About screen.
- **EveryAyah.com** — per-ayah reciter audio MP3 corpus that most Quran apps (including Nedaa's audio plans) build on.
- **Quranic Universal Library (QUL)** by **Tarteel AI** — open metadata and word-timing source.
- **IBM Plex Sans Arabic** (Open Font License) — UI Arabic typeface in Nedaa.
- **Asap** (Open Font License) — UI Latin typeface in Nedaa.

---

*Last updated: 2026-05-06.*

*This piece is part of an ongoing series from the Nedaa team on the engineering of Islamic apps. Nedaa is free, open source, and privacy-first. It does not collect personal data, has no ads, and has no premium tier.*

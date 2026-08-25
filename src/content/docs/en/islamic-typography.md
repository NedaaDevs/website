---
title: Why digital Quran apps look the way they do — a guide to Islamic typography on small screens
locale: en
published: true
last_updated: 2026-08-25
description: Why Quran apps use page images instead of rendered text, the Uthmani/Imlaei script question, Arabic line-breaking on mobile, and the typography decisions hiding inside every Islamic app. Written from inside Nedaa's open-source codebase.
canonical: https://nedaa.dev/docs/islamic-typography
hreflang:
  - lang: en
    href: https://nedaa.dev/docs/islamic-typography
  - lang: ar
    href: https://nedaa.dev/ar/docs/islamic-typography
---

# Why digital Quran apps look the way they do

A guide to Islamic typography on small screens, written by the team building Nedaa, an open-source prayer-times and Quran-reader app for iOS and Android.

If you've ever opened two Quran apps side by side and noticed they show the same verse differently, you have seen it: different diacritic placement, different line breaks, different page numbers, sometimes a different *spelling*. You have bumped into a thicket of typographic and editorial decisions that most apps make without telling you. This piece pulls those decisions into the open.

It's written from a practitioner's seat: we ship a Quran reader inside Nedaa, the source code is public, and we made some of the decisions below ourselves and inherited the rest from upstream. Where Nedaa picked a side, we'll say so.

## Why digital Quran apps use page images, not text rendering

The most common architectural choice in serious Quran apps surprises people: **the page is a picture, not text.** It's a PNG (or WebP) of a printed mushaf page rendered onto the screen. The app then overlays interactive elements on top of that image: ayah-tap targets, highlight regions, audio sync.

If you're a software engineer this looks backwards. Why ship images when you have a working Arabic text renderer? Three reasons converge:

### Reason 1 — Memorisers rely on page-end positions

Most people who memorise the Quran (huffaz, singular hafiz/hafiza) learn it from the **Madinah Mushaf layout**, the standard 15-lines-per-page printing that the King Fahd Quran Complex in Madinah produces and distributes. After years of memorisation, the visual position of an ayah on its page becomes part of the memory. The end of page 5 *is* the end of a specific ayah. The fourth line of page 117 *contains* a specific phrase.

If a digital app reflows text to fit the user's font size, those positional anchors break. The hafiz can no longer use the page as a memory aid. **For an app whose target audience includes huffaz, reflowing the text is a worse trade-off than the cost of shipping image bundles.**

### Reason 2 — Calligraphic fidelity at small sizes

Arabic script asks a lot of a renderer: ligature joins, contextual letter forms, diacritic stacking, and the *tashkīl* sitting over the letter it belongs to. At the dense 15-lines-per-page layout on a 6-inch screen, a font struggles with all of it. The printed Madinah Mushaf is the work of master calligraphers (Uthman Taha being the most prominent, with editions calligraphed in the 1980s onward). Reproduce that from a font and you are competing with the calligrapher. The image is *the calligrapher's work, photographed.*

### Reason 3 — Diacritics, line-breaking, and the rasm

Even rendering "the Quran text" raises a question most apps don't ask the user: **which version of the text?**

The Quran has been transmitted in two forms relevant to printed editions:

- **Uthmani text** preserves the *rasm* — the original consonantal skeleton of the Uthmanic codex compiled in the seventh century. Diacritics and vowel marks were added later as reading aids. The Madinah Mushaf uses Uthmani text.
- **Imlaei text** applies modern Arabic spelling rules to the same content. It's what you'd get if you typed the Quran into a contemporary Arabic word processor. It's easier for non-Arabic-native readers to follow because the spelling matches everyday Arabic.

These differ in dozens of small but visible ways: letters with sukun marks, alef variants, the placement of the small alef (*alef khanjariyya*). For a memoriser the difference matters; for a casual reader it usually doesn't, but disclosing the choice is rare.

When apps render text from a font, they are committing to one. **Image-based mushafs sidestep the question by reproducing whatever printed edition they scanned**, which here is the Madinah Mushaf in Uthmani.

## The hybrid approach: image pages plus font glyphs

Pure image-based mushafs have their own cost: **the app can't react to where on the page the user tapped.** If page 117 is only a PNG, the app cannot tell ayah 3 from ayah 4 unless someone sat down and drew coordinate boxes around every ayah on every page. For 604 pages × ~7-15 ayat per page, that's a lot of manual work.

The technique that has emerged in serious Quran apps is **hybrid rendering**: the page background is a high-fidelity image, and a separate, precomputed map says where every glyph sits on it. The app knows the coordinates, so it draws an interactive region at the right on-screen position and uses it as a tap or highlight target.

Nedaa's reader does this with a per-edition bounds database. Alongside each edition's page images we ship a `bounds-<version>.db` SQLite file holding, for every glyph, its surah, ayah, line number, x-offset, and width. To make an ayah tappable, or to highlight it during read-along, the reader queries that ayah's glyphs, groups them by line, and reduces each line to one rectangle. The page stays an image, so it keeps the calligraphy and the memorisation positions, and the app can still tell where you tapped.

The tradeoff is real, and the work is fiddly. Regenerate the page images and you must regenerate the bounds with them, versioned together, or every highlight lands off by a few pixels. The reader computes line height from the page image's own pixel height divided by fifteen, since a hardcoded value drifts across screen densities. When an ayah's glyphs are missing, the reader falls back to rendered text instead of drawing a box in the wrong place. Search runs against a separate text database, since you cannot grep an image, and a hit has to navigate you back to the right rectangle on the right page.

## The QCF page-image tradition

Most Madinah Mushaf page images trace back to the **King Fahd Quran Complex** (KFQC, also called King Fahd Glorious Quran Printing Complex) in Madinah. The complex has produced several editions over the decades, which the digital ecosystem calls **QCF v1, v2, and v4**. A v3 exists, but few projects distribute it publicly. They differ in calligraphic detail, diacritic placement conventions, and rendering generation.

Nedaa supports v1, v2, and v4. We don't editorialise about which is "best". These are scholarly editions, and the choice is yours. We surface the version selector with visual previews so a user can pick the one that matches what they grew up with or memorised from.

## Searching across diacritics

Search is the single hardest typographic problem inside a Quran app, and almost no user notices when it works.

The naive approach, a `LIKE` query against the verse text, fails: the database stores the verse fully voweled, and almost nobody types diacritics into a search box. The query "الرحمن" should match "الرَّحْمَٰنِ" but a literal text comparison won't.

Nedaa's reader uses **SQLite's FTS5 (full-text search) module** with custom Arabic tokenizer rules to normalise diacritics out of the indexed text while preserving them in the displayed result. The indexed string strips tashkīl, *shadda*, and the small alef; the display string keeps everything. Search by "الرحمن"; see "الرَّحْمَٰنِ" highlighted on the page.

This is mostly invisible work that ships in the database file, not in the UI. It's the kind of detail that distinguishes a Quran app built by people who tried to use one from a Quran app built by people who didn't.

## Pairing Latin and Arabic typefaces

The Quran reader is half of Nedaa. The other half, meaning prayer times, alarm settings and athkar, has UI in five languages: English, Arabic, Malay, Urdu, and growing.

Most apps pick a single typeface and let it render everything. That works badly. **Latin typefaces and Arabic typefaces have different baselines, different weights at the same nominal weight, different x-heights, and different line-height conventions.** A typeface that looks balanced in English will look thin or mis-aligned in Arabic, and vice versa.

Nedaa pairs:

- **Asap** for Latin scripts (UI, English, Malay, Urdu transliteration)
- **IBM Plex Sans Arabic** for Arabic UI text and labels

We paired the two so a settings screen carrying both Arabic and English, which is the common case, reads as one visual whole instead of two clashing systems. The font swap happens at the component level: the same `Text` component renders Asap or IBM Plex Sans Arabic depending on the active locale.

For Quran *body* text (the ayah display in text-mode reader, separate from the image-based mushaf reader), the rules change again. Quran text needs typefaces built for Quranic typography: diacritic positioning, ligature behaviour, and the aesthetic conventions of mushaf rendering. That's not what UI fonts are for.

## What's still hard

A research piece that doesn't list the unsolved problems isn't honest. The hard parts of Islamic-app typography we're still working through:

1. **High-DPI image scaling.** Page-image mushafs at modern phone resolutions are large. Shipping every density variant inflates the download. Generating them on the fly costs CPU and memory. There is no clean answer.
2. **Word-level audio sync, reciter by reciter.** Ayah-level audio is easy: the file maps to one ayah and plays end to end. Word-level sync, where the app highlights each word as the reciter says it, needs an accurate timestamp for every word of every ayah in that specific recording. Nedaa ships word-level read-along on QUL's timing data. QUL has that data for some recitations and not others, so the reader falls back to verse-level highlighting wherever the timings are missing. Closing the gap means finding or producing timing data for more reciters, which is slower work than any amount of rendering.
3. **Right-to-left layout for mixed Arabic+Latin UI.** The whole app supports RTL, but specific edge cases (timestamps in chat-style logs, percentage indicators, version numbers) need bidi-text handling that platform components don't always get right.
4. **Madhhab-neutral copy in a script-rich UI.** Every Arabic Islamic word the UI surfaces (Salah, Athan, Iqama, Sa'i, Tawaf) is also a typographic decision: bold or regular weight, with or without diacritics, transliterated or in script. Getting this consistent across five locales is its own work.

## Why this matters beyond Nedaa

The typographic decisions inside a Quran app aren't visible to most users, but they're load-bearing. **An app that picks Imlaei text without telling you is making an editorial choice on your behalf. An app that ships only one QCF version is silently picking which calligrapher's work you read. An app that renders text at low fidelity is choosing convenience over the printed tradition.**

Most of these decisions are defensible, and none of the options is *wrong*. They are still decisions, and they belong in the open where you can evaluate them. That's the job of writing this piece.

Nedaa's source code is at `github.com/NedaaDevs/nedaa`. The Quran reader's design document is at `docs/plans/2026-03-14-quran-mushaf-reader-design.md` in that repo. Anything we got wrong here, you can audit; anything we describe, you can verify.

## Credit

- **King Fahd Glorious Qur'an Printing Complex (KFGQPC)**, Madinah — the UthmanicHafs font and the Madinah Mushaf page layout, shipped as the QCF v1, v2, and v4 page-image editions that anchor the image-based reader pattern across the ecosystem.
- **Tanzil Project** (`tanzil.net`) — Quran text in Uthmani script, CC-BY 3.0. Required attribution preserved in our app's Acknowledgements screen.
- **QuranicAudio** (`quranicaudio.com`) and **quran.com** — the reciter audio corpus Nedaa serves, mirrored via QUL.
- **Quranic Universal Library (QUL)** by **Tarteel** — open metadata and word-timing source.
- **IBM Plex Sans Arabic** (Open Font License) — UI Arabic typeface in Nedaa.
- **Asap** (Open Font License) — UI Latin typeface in Nedaa.

---

*Last updated: 2026-05-06.*

*This piece is part of an ongoing series from the Nedaa team on the engineering of Islamic apps. Nedaa is free, open source, and privacy-first. It does not collect personal data, has no ads, and has no premium tier.*

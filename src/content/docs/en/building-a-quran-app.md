---
title: Building a Quran app? Start with images, not fonts
locale: en
published: true
last_updated: 2026-08-25
description: Most serious Quran apps render the mushaf page as an image rather than as text, and nobody tells you that before you start. What we got wrong on the first attempt, the three pieces a mushaf reader is made of, and the open-source tool that renders the pages.
canonical: https://nedaa.dev/docs/building-a-quran-app
hreflang:
  - lang: en
    href: https://nedaa.dev/docs/building-a-quran-app
  - lang: ar
    href: https://nedaa.dev/ar/docs/building-a-quran-app
---

# Building a Quran app? Start with images, not fonts

An intro for anyone about to write their first mushaf reader, from a team that took the long way round.

## What we tried first

We did the obvious thing. We had the Quran text, we had an Arabic font, so we rendered the text into a view and expected a mushaf.

It looked fine on the simulator. Then we ran it on a second device and the lines broke in different places. A third device shifted the diacritics. Android and iOS disagreed about the same string. Every fix we made for one screen density moved something on another, and the page never matched the printed mushaf we were trying to reproduce.

We spent a long time treating this as a bug in our layout code. It is not a bug. It is what happens when you ask a text renderer to reproduce a page that a calligrapher composed by hand.

The thing nobody told us: **serious Quran apps do not render the page as text. They ship a picture of it.**

## Why the picture wins

The short version, and there is a longer one on [why Quran apps look the way they do](/docs/islamic-typography):

The Madinah Mushaf is the layout most huffaz memorise from. Fifteen lines to a page, 604 pages, and no verse ever split across a page turn. Someone who memorised from it knows where a verse sits on its page. Reflow that text to fit a font size and you break the thing they are using the page for.

You are also competing with a calligrapher. The printed page is Uthman Taha's work. A font renderer approximating it will lose, and it will lose differently on every device, which is the part that cost us weeks.

Ship the image and both problems disappear at once. The page is the calligrapher's work, photographed, and it looks the same everywhere.

## What you are actually building

Once you accept the image, the shape of the app falls out. You need three things, and they are separate.

**The page images.** One per page, per edition, and per theme if you want a dark mode. These are the bulk of what a user downloads.

**A bounds map.** The image on its own knows nothing: the app cannot tell whether a tap landed on verse 3 or verse 4. So alongside each edition you ship a small database of glyph rectangles: for every glyph, its surah, its verse, its line, its x-offset and its width. To make a verse tappable, query its glyphs, group them by line, and reduce each line to a rectangle. That is also how you highlight a verse during recitation.

**The text.** You still need the verse text as text, because you cannot search an image. Keep it in its own small database, separate from the images.

Three layers, three different rates of change. The images almost never move, the bounds change whenever you regenerate them, and the text barely changes at all.

Version them separately, or you will re-download hundreds of megabytes to fix a rectangle.

## You probably do not need to write this

Quran.com has already done it. [quran.com-images](https://github.com/quran/quran.com-images) has been rendering mushaf pages for years, and it is where ours came from. If pages are what you need, take it and skip ahead.

### So why did we build another one?

Because it renders whole pages and single ayahs, and we needed lines.

A page image is a fixed raster. On a screen that is not its aspect ratio you letterbox it, and on a phone that means the text ends up smaller than the glass allows.

Fifteen line images can each be laid out to the width you have, so the page fills the screen and the script grows with it. A readable phone layout and a two-page tablet spread become one code path.

The cost is fifteen times as many files to download, place and cache.

Three things came with the rewrite.

It emits the glyph bounds in the same run as the images. Bounds generated separately drift out of alignment with the pixels they describe. Watch the ordering, though. You run the tool more than once, at least for light images and dark ones, and every run appends to the bounds database rather than replacing it. Two runs leave you two copies of every glyph. Our render scripts delete the file first, then let the last line pass write it alone.

It renders V1, V2 and V4, and nothing in it is bound to Hafs. The riwayah lives in the page fonts and the layout database, so another one is a question of supplying those rather than changing code. That is worth knowing if you are building for a region that reads Warsh or Qalun, where the shortage is mushaf data rather than tooling.

And it handles dark mode per edition. V1 and V2 are monochrome, so the app tints them at render time and one set of images serves both themes.

V4 carries the tajweed colour, which a tint would flatten to one colour. We render it twice: once as printed, and once with a different ink and a remapped palette chosen so every rule clears 4.5:1 against the dark reading background. Budget for that, because a colour edition with dark support is two sets of images rather than one.

At the end of every verse sits a small circle with the verse number in it. By default the tool draws those circles into the image, where they become part of the pixels and cannot be taken out again.

Pass `no-markers` and it renders the text glyphs only, leaving the circles out. The app then draws them over the image at display time, placing them from the same bounds database. Every production run of ours passes it.

The difference between a circle in the image and a circle the app draws is four things:

- It is a real touch target, so tapping a verse number can open something.
- It can change state without re-rendering the line. A bookmark ribbon sits where the number was.
- It leaves the line image neutral and tintable while taking its own colour. This is what makes the monochrome editions themeable at all.
- Its number is drawn at display time, so nothing needs re-rendering when it changes.

None of that matters if you are exporting for print. Bake them in.

Ours is [NedaaDevs/quran-image-generator](https://github.com/NedaaDevs/quran-image-generator), on Bun, TypeScript, SQLite and a canvas library rather than Perl, MySQL and GD, which let us keep it in the same pipeline as the app. It writes both variants: `pages/001..604.png`, and `lines/{page}/001..015.png`, fifteen per page.

## Search: strip the tashkeel

The one thing that will surprise you after the images work.

The text in your database is fully voweled. Users type without diacritics. Search for الرحمن and a literal comparison will not match الرَّحْمَٰنِ, so your search returns nothing and looks broken.

The fix is to index a stripped copy and display the full one. We use SQLite's FTS5, dropping tashkeel and the small alef and folding alef variants on the way into the index, while the string we show keeps everything. You search by the bare word and see the voweled verse.

## Where the data comes from

All of it is available, and all of it has a licence you should read.

- **Text** — the [Tanzil Project](https://tanzil.net), Uthmani script, CC-BY 3.0 with attribution required.
- **Fonts and page layout** — the King Fahd Glorious Qur'an Printing Complex, distributed as the QCF v1, v2 and v4 editions.
- **Verse divisions, juz and hizb boundaries, sajda positions, and the mutashabihat pairs** — the [Quranic Universal Library](https://qul.tarteel.ai) by Tarteel. Most of the metadata a reader needs beyond the text itself is here.

We credit all three on an Acknowledgements screen inside the app. Tanzil's licence requires attribution; the others are there because someone reading from this work should be able to see whose it is.

## What it costs you

Honesty about the trade you are making: page images are a real download, and that is what the fidelity costs.

Line mode makes that worse before it makes it better. 604 pages at fifteen lines each is 9,060 files per edition, and again for a second theme where the edition needs one.

Fetching those one at a time over mobile HTTP costs more in round trips than the bytes are worth, and a connection that drops halfway leaves you a pile of half-fetched files with no record of which finished.

That is why the progress UI has three phases rather than one, and why the extract step is not instant on an older phone.

The rest is download UX, and it is where you win or lose someone. Pause and resume, a free-space check before starting, a warning before a large download over cellular.

The hard one is the first read. Our progress screen holds the reader until the edition is in place, so a new user waits before seeing a single verse. Some of them do not wait, and we have not solved that.

Text mode is what stands in the gap. It needs no edition, so someone who does not want to wait, or who wants larger type than a printed page can give, has something to read from immediately.

## Start here

- [quran-image-generator](https://github.com/NedaaDevs/quran-image-generator) — render the pages.
- [Why Quran apps look the way they do](/docs/islamic-typography) — the long version of the typography argument.
- [github.com/NedaaDevs/nedaa](https://github.com/NedaaDevs/nedaa) — our reader, open source, if you want to read how any of the above is wired up.

---

*Last updated: 2026-08-25*

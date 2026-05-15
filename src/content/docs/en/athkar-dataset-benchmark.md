---
title: How complete is your athkar app? A benchmark methodology against Hisn al-Muslim
locale: en
published: true
last_updated: 2026-05-10
description: A reproducible methodology for measuring how completely an Islamic app covers the Hisn al-Muslim dataset of supplications. Includes Nedaa's verified counts (267 supplications, 132 categories) and a template for community contributions.
canonical: https://nedaa.dev/docs/athkar-dataset-benchmark
hreflang:
  - lang: en
    href: https://nedaa.dev/docs/athkar-dataset-benchmark
  - lang: ar
    href: https://nedaa.dev/ar/docs/athkar-dataset-benchmark
---

# How complete is your athkar app?

A benchmark methodology against the Hisn al-Muslim corpus, with Nedaa's verified numbers and a template open to community contribution.

## Why this benchmark exists

Most Islamic apps include a "morning and evening athkar" section. That phrase obscures a wide range of actual coverage. Two apps with the same headline feature can differ substantially in how many supplications they actually include — and a user has no way to know which is which without going through the app supplication-by-supplication.

This piece documents a methodology for measuring it. **Nedaa's numbers are verified** (computed directly from the SQLite database bundled with the app, source code public). **Other apps' numbers are open for community contribution** — we'll publish whatever rows people send in with reproducible counts.

## What we're benchmarking against

The reference dataset is **Hisn al-Muslim** (*حصن المسلم — Fortress of the Muslim*), the supplication compilation by Sa'id ibn Ali ibn Wahaf al-Qahtani. It is the standard reference compilation in widespread use across Sunni Islamic communities, with **132 standard categories** covering daily occasions (waking, dressing, eating), travel, mosque entry/exit, illness and recovery, marriage and family, financial matters, weather events, and named prayers.

Within those categories sit individual supplications — typically with a Quran or hadith provenance. The full dataset, as bundled in Nedaa, contains **267 supplications across 132 categories.**

This is the corpus we measure coverage against. An app's coverage is the percentage of these 267 supplications it includes (full text, in Arabic, attributable to the right occasion).

## What we measure

For each app evaluated, the benchmark records:

| Field | What it captures |
|---|---|
| **Categories covered** | Out of 132. A category counts as covered if at least one supplication from that category is present. |
| **Supplications included** | Out of 267. A supplication counts if its full Arabic text is present and attached to the correct occasion. |
| **Coverage %** | Supplications included / 267. |
| **Audio available** | Number of supplications with at least one reciter audio recording within the app. |
| **Source disclosed** | Does the app name its athkar dataset (Hisn al-Muslim or otherwise)? Y/N + name if Y. |
| **Bundled vs streamed** | Is the text bundled with the app (offline) or fetched live? |
| **Custom additions** | Does the app let the user add their own athkar? |
| **Translation** | Languages the supplication translation is available in (English, Urdu, Malay, Indonesian, French, Turkish, etc.) |

Each of these is independently measurable. Where an app does not disclose its source dataset, the benchmark notes "undisclosed" rather than guessing.

## How to count, reproducibly

Counting matters more than measuring once. The protocol:

1. **Open the app and locate the morning, evening, and occasion-based athkar section.** Note where each lives in the navigation.
2. **Count categories.** Some apps group supplications under named categories matching Hisn al-Muslim's 132. Others group differently — in that case, map their categories onto Hisn al-Muslim's 132 manually using the supplication content.
3. **Count supplications per category.** Match supplications to Hisn al-Muslim entries by content, not by title. The same supplication can appear under different titles across apps.
4. **Note whether audio exists for each supplication.** If audio is per-category rather than per-supplication, note that and count categories with audio.
5. **Check the app's About screen, settings, or store description for a source disclosure.** Record what you find.
6. **Submit your counts.** Open an issue on `github.com/NedaaDevs/nedaa` with the app name, version, and your numbers. We'll add the row.

## Results table

Numbers in *italics* are reproducible from Nedaa's open codebase. Other rows are pending community contribution; if you've manually counted an app, contribute the row.

| App | Version | Categories (of 132) | Supplications (of 267) | Coverage % | Audio | Source disclosed | Bundled offline | Custom add |
|---|---|---|---|---|---|---|---|---|
| **Nedaa** | *2.9.1* | *132* | *267* | *100%* | *Yes, one reciter today, more being added* | *Yes — Hisn al-Muslim, named in app + on website* | *Yes* | *Yes* |
| Muslim Pro | — | pending | pending | pending | pending | pending | pending | pending |
| Athan Pro | — | pending | pending | pending | pending | pending | pending | pending |
| iPray | — | pending | pending | pending | pending | pending | pending | pending |
| Athkar al-Muslim (standalone) | — | pending | pending | pending | pending | pending | pending | pending |
| Quran.com app | — | pending | pending | pending | pending | pending | pending | pending |
| *Your contribution here* | | | | | | | | |

## How Nedaa's numbers were computed

The 267 / 132 figures are computed directly from the SQLite database bundled with the Nedaa app — `assets/db/hisn-muslim.db` in the open repository. To reproduce:

```bash
git clone https://github.com/NedaaDevs/nedaa.git
cd nedaa
sqlite3 assets/db/hisn-muslim.db "SELECT COUNT(*) FROM athkar;"        # 267
sqlite3 assets/db/hisn-muslim.db "SELECT COUNT(*) FROM categories;"    # 132
```

This is the kind of measurement we expect from any app claiming a complete Hisn al-Muslim dataset: a verifiable count from published bytes. If an app's complete coverage cannot be verified, that's worth recording too.

## What the benchmark is *not* measuring

To stay honest about scope:

- **Quality of recitation audio** is not measured. Reciter quality is subjective and depends on the listener's preference.
- **UI quality** of the athkar screen is not measured.
- **Authenticity grading** of individual supplications is not measured. Hisn al-Muslim itself is the reference; we measure coverage against it, not against the underlying hadith authenticity grading (which is its own scholarly question).
- **Beyond Hisn al-Muslim coverage** is not measured. Apps that include supplications outside Hisn al-Muslim (a minority) may have higher absolute counts but the same Hisn al-Muslim coverage percentage; we score the latter.

## Why "100%" is not the only thing that matters

A 100% coverage app and a 30% coverage app are different products serving different users. **The benchmark exists to make the difference visible, not to declare a winner.** A user who only wants morning and evening adhkar and prefers a small, focused app may legitimately prefer a low-coverage app with a clean UI. A user who wants the full daily-occasion catalogue (illness duas, travel duas, household duas, financial duas) is poorly served by an app that only includes 50 supplications.

Coverage is a fact that should be visible at install time, not a discovery the user makes after months of use.

## Contribute a row

If you've used another athkar app and want to count its coverage:

1. Follow the protocol above. Take ~30 minutes per app, less if the app is small.
2. Open an issue at <https://github.com/NedaaDevs/nedaa/issues> with the title `[athkar benchmark] <app name> v<version>`.
3. Include your counts in the field shape above. Note the date you measured (apps update).
4. We'll publish your row with credit (or anonymously if you prefer).

## Credit

The reference corpus is **Hisn al-Muslim** (*Fortress of the Muslim*) by Sa'id ibn Ali ibn Wahaf al-Qahtani. The dataset bundled in Nedaa preserves the original 132-category structure and 267-supplication count.

---

*Last updated: 2026-05-10. Methodology is stable; results table updates as community contributions arrive.*

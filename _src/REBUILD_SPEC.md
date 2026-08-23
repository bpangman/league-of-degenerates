# REBUILD SPEC v2 - League of Degenerates

This replaces the single-page build. Same content standards as `BUILD_SPEC.md`
(read it - the data rules, mobile rules, and the no-dash rule all still apply).
What follows is what CHANGES.

## 1. Split into real, separate pages

The site is currently one long page with anchor links. It must become multiple HTML
files. Each nav item loads its own page at its own URL.

| File | Nav label | Contents |
|---|---|---|
| `index.html` | HOME | Spraypaint hero + pinned countdown board + champion + season-at-a-glance stat row + short teasers linking to the other pages |
| `memo.html` | MEMO | The full 2026 Commissioner's memo |
| `standings.html` | STANDINGS | 2025 final standings (playoff-adjusted) + the awards/superlatives |
| `allplay.html` | ALL-PLAY | The all-play table + luck differential, with the explainer |
| `draft.html` | DRAFT | Draft board with real pick ownership (see section 4) + key dates |
| `dynasty.html` | DYNASTY | Dynasty board, contract cliff, storylines, spreadsheet + rulebook links |
| `history.html` | HISTORY | 2020-2025 season results, champions by year, title counts |
| `record.html` | RECORD BOOK | Lifetime standings, head-to-head explorer, all-time records |

- Shared header/nav and footer, identical on every page. Mark the current page in the nav.
- Shared CSS: put it in one `style.css` that every page links. Same for shared JS in `app.js`.
  (Same-origin static files are fine here; the strict inline rule was for the single-page build.
  Do NOT reference anything off-origin.)
- Data: put the shared data in `data.js` as a plain global object and include it where needed.
- Every page must work when opened directly from its URL. Use RELATIVE links
  (`./memo.html`, not `/memo.html`) so it works under the `/league-of-degenerates/` subpath.

## 2. DELETE these sections entirely
- **The Brackets section** - gone. Do not link to it, do not keep a stub.
- **Week by Week** - gone. Same.

The underlying JSON can stay in `_src/`; just stop rendering those two sections.
Keep the bracket-derived FINAL FINISH info in standings (who won the title, who won the
toilet bowl, etc.) since that is stated in the standings table already.

## 3. Spraypaint hero on the home page

Use the real league artwork. It is already extracted and background-keyed for you:

- `_src/art/logo_ink.png` - the wordmark and doodles as white + red ink on a
  transparent background, 866x846. Copy it into the site root as `logo.png`.

Treat it so it reads as **spray paint on a wall**:
- Dark textured wall behind it. Generate the texture in CSS/SVG (layered gradients plus an
  SVG `feTurbulence` grain). No external images.
- Roughen the ink edges with an SVG filter: `feTurbulence` (fractalNoise, low baseFrequency)
  into `feDisplacementMap` on the logo, so the strokes get that irregular sprayed edge
  instead of a clean cut.
- Add overspray: a blurred, low-opacity copy of the logo behind the sharp one, slightly
  larger, so there is a soft halo of mist around the strokes.
- A few paint drips running down from the bottom of some letters. Subtle. Two or three,
  not a curtain.
- Slight rotation (about 1.5 to 2.5 degrees) so it looks tagged, not placed.
- The red in "NASTY" should glow slightly hotter than the white.

Restraint matters more than effects. If a treatment makes the wordmark harder to read,
drop it. It must still be legible at 375px wide. Provide a sensible `alt`.

## 4. The draft board - real pick ownership

Data is in `_src/sleeper/draft2026.json`, pulled from Sleeper. It is authoritative.

**Round 1, who actually owns each pick:**

| Pick | Owner | Note |
|---|---|---|
| 1.01 | Team Barbie | earned, Toilet Bowl champion (+4 contract yrs) |
| 1.02 | Tony Busch | earned, 8th (+3 contract yrs) |
| 1.03 | Mathieu | earned, 9th (+2 contract yrs) |
| 1.04 | **David** | acquired from BlakeBro (Achane trade) |
| 1.05 | Hannah | earned, 5th |
| 1.06 | Mikey Loff | earned, 6th |
| 1.07 | Ryan M | earned, 4th |
| 1.08 | **Ryan M** | acquired from David |
| 1.09 | **Ryan M** | acquired from Tony Loff |
| 1.10 | Levon | earned, champion picks last (Article 4.02) |

Show BOTH things clearly: the slot order each manager earned from last year's finish,
AND who is actually holding the pick now. Visually distinguish an earned pick from an
acquired one. Call out that **Ryan M holds 1.07, 1.08 and 1.09 back to back to back**,
and that **Tony Loff and David have no first round pick at all**.

**Other picks that have moved (2026):**
- Round 2: Tony Loff's -> BlakeBro. David's -> Ryan M.
- Round 4: David's -> Tony Loff.
- Round 5: Tony Loff's -> David. Ryan M's -> David.

Add a short per-manager summary of what each person actually holds vs what they started with.

## 5. Pinned countdown board (top of home page, above everything)

Pinned at the very top of `index.html` so it is the first thing anyone sees. Live ticking
countdown (days / hours / minutes / seconds), updating every second, computed client side.

| Event | Date/time | Confidence |
|---|---|---|
| Roster + Franchise Tag deadline | **Sat Aug 29, 2026, end of day CT** | INFERRED - mark it |
| **Rookie/FA Draft** | **Sat Sep 5, 2026, 2:00 PM CT** | CONFIRMED from Sleeper |
| Contract deadline | **Wed Sep 9, 2026, 5:00 PM CT** | INFERRED - mark it |
| Trade deadline | **Wed Nov 25, 2026, end of day CT** | INFERRED - mark it |

How these were derived (put a short plain-English note under the board):
- Draft date and time come straight from the league's Sleeper draft, so it is confirmed.
- Contract deadline follows Rule 6.07: contracts are due by the first NFL regular season
  game after the draft. The 2026 season opens **Wednesday September 9**, not the usual
  Thursday, so this year the contract deadline lands on a Wednesday. Past memos used
  5:00 PM CT on kickoff day.
- Roster/Franchise Tag deadline follows Rule 6.12 (at least one week before the draft);
  past memos ran it 3 to 7 days out.
- Trade deadline has been the Wednesday before Thanksgiving every year (11/22/23,
  11/27/24, 11/26/25). In 2026 that is Nov 25.

**Anything marked INFERRED must be visibly flagged on the page** (a small "TBC" chip and a
one-line note that the Commissioner still has to confirm it). Do not present a guess as fact.

Put all four dates in ONE clearly commented config block at the top of `app.js` named
`LEAGUE_DATES`, so a single edit changes the site. Comment it in plain English for a
non-technical reader.

The draft is the primary countdown - make it the biggest. The other three are secondary.
Once an event's date passes, it should show as "PASSED" rather than counting negative.
Handle the CT offset correctly (US Central, currently CDT/UTC-5 for all four dates).

## 6. Memo update
`_src/memo2026.md` has been revised. Re-render from the current file. New material includes
a large section on Levon moving back to the United States in September and a section on
Ryan M's three first round picks. Do not paraphrase it, render it.

## 7. Deploy
Same repo `bpangman/league-of-degenerates`, push to `main`, Pages already enabled.
Verify EVERY page returns 200 at its real URL before reporting done.

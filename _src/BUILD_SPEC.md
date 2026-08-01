# Build spec: League of Degenerates - 2025 Season Site

## Goal
A single-page, self-contained, dark-mode website recapping the 2025 season of the
**Degenerate GM Dynasty League** (aka "The League of Degenerates"), a 10-team
fantasy football dynasty/contract league. It is hosted on GitHub Pages and shared
with 10 friends who will read it on their phones, mostly while talking trash.

Tone of the site chrome: sharp, sports-broadcast, a little unhinged. It should feel
like a real "season in review" microsite, not a school project.

## Non-negotiables
- **Mobile first.** Most people open this on a phone. Nothing may overflow horizontally.
  Wide tables scroll inside their own container.
- **Self-contained.** No CDN scripts, no external fonts, no remote images. Inline all
  CSS/JS. System font stack only.
- **Every number comes from the data files.** Do not invent, round differently, or
  "clean up" a score. Decimals matter - these people will check.
- **No em dashes or en dashes anywhere in copy.** Plain hyphens only.
- Dark theme is the design. Do not build a light mode.

## Data files (all in `_src/`)
| File | Contents |
|---|---|
| `memo2026.md` | The Commissioner's 2026 memo. THE centerpiece. Render it faithfully. |
| `season2025.json` | 14 weeks of matchups, playoff bracket, consolation bracket, final standings |
| `analytics.json` | Precomputed awards: top/low scores, all-play records, luck, closest games, blowouts, weekly high-score winners, final finishing order |
| `history.json` | Final standings 2022-2025, 2026 draft order, title counts |
| `rosters.json` | Per-season rosters with contract years, per owner |
| `storylines.md` | Computed dynasty findings (longest-tenured players, busts, the 2026 contract cliff, trades) |

## Page sections, in order

1. **Hero** - League name, "2025 SEASON IN REVIEW". Champion callout: Levon,
   "Better Bijaness Burrow", won as the 5 seed at 7-7. Include the league's
   defining stat line somewhere: 70 games, 18,053.32 total points, 128.95 avg.

2. **THE MEMO** - the full `memo2026.md`, styled as an actual memorandum
   (To/From/Date/Re header block, letterhead feel). This is the single most
   important element on the page. Give it room to breathe, generous line height,
   readable measure. Pull-quotes on the biggest lines are welcome.

3. **FINAL STANDINGS** - use `analytics.json.final_order` (playoff-adjusted 1-10),
   and show regular-season record + PF + PA from `season2025.json.standings`.
   Make clear the difference between regular-season seed and final finish.
   Highlight: champion at 1, and the Commissioner at 10.

4. **THE BRACKETS** - render the playoff bracket and the consolation ("Toilet Bowl")
   bracket from `season2025.json`. Real bracket layout on desktop; on mobile it can
   degrade to a clean round-by-round list. Show both scores per matchup.

5. **AWARDS / SUPERLATIVES** - from `analytics.json`. At minimum:
   highest single week, lowest single week, biggest blowout, closest game
   (149.52-148.50, a 1.02 point margin), most weekly high-score prizes,
   luckiest team, unluckiest team.

6. **ALL-PLAY TABLE** - the advanced table: all-play record, expected wins vs actual
   wins, luck differential. Sort by all-play. This is the section that proves
   Tony Loff's 11-3 was a fraud and Team Barbie got robbed. Make it feel like evidence.

7. **WEEK BY WEEK** - all 14 weeks, all 70 games. Collapsible per week (details/summary
   is fine). Winner's score emphasized. Compact.

8. **THE DYNASTY BOARD** - built from `rosters.json` + `storylines.md`. Show roster
   progression across seasons and the 2026 contract cliff (who is about to lose whom).
   Include an explainer of the contract notation: a number is years remaining BEYOND
   the listed season, `0` means the season is the last year, no number means expiring
   rights only. Link out to the live spreadsheet and the rulebook (URLs below).

9. **LEAGUE HISTORY** - `history.json`: 2022-2025 final standings, title counts,
   and the 2026 draft order with the contract-year bonuses.

9b. **THE RECORD BOOK (all-time, 2020-2025)** - from `sleeper/lifetime.json` and
   `sleeper/FINDINGS.md`. This is pulled straight from Sleeper's API and every season
   reconciles exactly against Sleeper's own roster records, so state it with confidence.
   Include:
   - Lifetime standings table: W-L, win pct, PF, PA, playoff record, titles
   - **The head-to-head matrix.** Make this interactive: let the reader pick a manager
     and see that manager's career record against all nine others. This is the single
     most requested feature - people want to know who owns who. On mobile, a dropdown
     plus a list beats an 11x11 grid.
   - Champions by year 2020-2025 (note that 2020 and 2021 predate the memo archive)
   - All-time records: highest week (David 226.28, 2023 wk13), lowest week
     (Ryan M 54.0, 2022 wk8), closest game ever (BlakeBro over Tony Loff by 0.36,
     2022 wk4), longest win streak (11, tie: David and Ryan M), longest losing
     streak (Mathieu, 11, spanning 2024-2025)
   - Note in small print that "Mac" owned a roster 2020-2022 and left; Team Barbie
     inherited that seat in 2023. And that Ryan M's 2022 team was named "Vivek McCusker".

10. **Footer** - links to the spreadsheet and rulebook, and a line noting the site was
    assembled from Sleeper screenshots and the Commissioner's memo archive.

## External links
- Roster/contract spreadsheet: https://docs.google.com/spreadsheets/d/1sHKHy68gdvJ45d9gZ9Q1zn-PsI_kiX2Ry_26Z_AW55A/edit
- Rulebook (Be A GM League Manual): https://docs.google.com/document/d/1vWsTgE6UTYll9OBmeRURIGGkpWI1rGUtr29fbQknX2A/edit

## Owner / team / manager mapping (use consistently)
| Person | Sleeper handle | 2025 team name |
|---|---|---|
| BlakeBro (Commissioner) | pangdaddy | Shake & Bake(r) |
| Tony Loff (Co-Commissioner) | TonyLoff | Band-Aid Brigade |
| Mikey Loff | Mloffredo10 | Brock Hard |
| David | DavidBeckham | DavidBeckham |
| Mathieu (Matt) | matthewbuckets | Stroud Boys |
| Hannah | hannah77808 | Tis The Lamb Season |
| Levon | levonthelight | Better Bijaness Burrow |
| Ryan M | ryanmccusker | Cus Cus |
| Tony Busch (TB) | tbusch74 | The Fumblin' Faucis |
| Team Barbie (Madison + Pateel) | MadDawg6969 | Team Barbie |

## Deploy
- New public repo `bpangman/league-of-degenerates`
- GitHub Pages from `main` branch, root
- Final URL: https://bpangman.github.io/league-of-degenerates/

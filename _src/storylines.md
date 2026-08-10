# DFFL Storylines — Degenerate GM Dynasty League, 2020–2026

All figures below are computed directly from `rosters.json`, which was parsed from `sheet_raw.txt` (8 table blocks: 7 season tabs, 2020–2026, plus one unlabeled/ambiguous tab — see **Caveats**). Owner names are normalized to: Blake, Anthony, Michael, David, Matt, Hannah, Levon, Ryan, TB, Mac (2020–2022 only), Team Barbie (2023–2026 only, replaced Mac's slot).

---

## 1. Longest-Tenured Players (same player, same owner, consecutive seasons)

The dynasty has only run 7 seasons (2020–2026), so the maximum possible streak is 7 years. **16 different players have been on the same roster since the origin 2020 draft, never traded or cut** - the true maximum-tenure tier. Three more players - Lamar Jackson, Josh Allen, and Travis Kelce - have been locked onto their current roster just as long, but not from the draft itself: they changed hands in the flurry of trades that opened that first 2020 season, before Week 1 was ever played, and have sat unmoved with their new owner ever since. See **Section 10 (Caveats)** for how the previously-ambiguous "Tab 1" was identified as the origin draft board that makes this distinction possible.

### Tier 1 - 7 straight seasons, 2020-2026, never moved since the origin draft (16 players)
| Player | Owner |
|---|---|
| Terry Mclaurin | Anthony |
| Brandon Aiyuk | Michael |
| Chris Godwin | Matt |
| DJ Moore | Matt |
| Jerry Jeudy | Matt |
| Deshaun Watson | Hannah |
| Christian McCaffery | Hannah |
| Jonathan Taylor | Hannah |
| Tony Pollard | Hannah |
| Courtland Sutton | Hannah |
| Ceedee Lamb | Hannah |
| Justin Jefferson | Hannah |
| Joe Burrow | Levon |
| Patrick Mahomes | Ryan |
| Christian Kirk | TB |
| Michael Pittman | TB |

### Acquired in the 2020 opening trades, held ever since (3 players)
| Player | Owner | Acquired from |
|---|---|---|
| Lamar Jackson | Michael | David |
| Josh Allen | David | Michael |
| Travis Kelce | David | Michael |

Verified by diffing the origin draft board against the confirmed 2020 tab, and corroborated by the 2020 trade log (Section 8): *"David gets Josh Allen and 4 years; Michael gets Lamar Jackson"* and *"Michael gets Chase Claypool and 2 contract years. David Gets Travis Kelce."* Sleeper's own API only logged 2 trades in 2020 while the sheet records 6, so the spreadsheet - not Sleeper - is the authoritative ledger for these early moves.

**Hannah owns 7 of these 16 true never-movers (44%)** - nearly half of every player in the league who has sat on one roster since the origin draft belongs to one team. See Section 9 and Section 6 for why that's about to matter a lot.

### Tier 2 — 6 straight seasons (10 players)
Amari Cooper (Blake, 2020–2025) · Cooper Kupp (David, 2020–2025) · Adam Thielen (Ryan, 2020–2025) · Stefon Diggs (Ryan, 2020–2025) · Travis Etienne (Michael, 2021–2026) · Jaylen Waddle (Michael, 2021–2026) · Jamarr Chase (David, 2021–2026) · Devonta Smith (Hannah, 2021–2026) · Kyle Pitts (Levon, 2021–2026) · Jakobi Myers (Ryan, 2021–2026)

Streak-length distribution across every player/owner pairing ever recorded: 7yr×19, 6yr×10, 5yr×20, 4yr×52, 3yr×76, 2yr×175, 1yr×509.

---

## 2. Iron Men / Franchise Cornerstones (each owner's single longest-held player)

| Owner | Cornerstone | Span | Streak |
|---|---|---|---|
| Anthony | Terry Mclaurin | 2020–2026 | 7 yrs |
| David | Josh Allen (acquired from Michael in the 2020 opening trades) | 2020-2026 | 7 yrs |
| Hannah | Deshaun Watson (tied w/ 6 others, see Tier 1) | 2020–2026 | 7 yrs |
| Levon | Joe Burrow | 2020–2026 | 7 yrs |
| Matt | Chris Godwin | 2020–2026 | 7 yrs |
| Michael | Lamar Jackson (acquired from David in the 2020 opening trades) | 2020-2026 | 7 yrs |
| Ryan | Patrick Mahomes | 2020–2026 | 7 yrs |
| TB | Christian Kirk | 2020–2026 | 7 yrs |
| Blake | Amari Cooper | 2020–2025 | 6 yrs |
| Mac (2020–2022 only) | Dak Prescott | 2020–2022 | 3 yrs (his whole tenure) |
| Team Barbie (2023–2026 only) | Jalen Hurts | 2023–2026 | 4 yrs (their whole tenure) |

Eight of the ten "live" owners (everyone except Blake) still have a cornerstone dating back to that very first 2020 season - whether it's the player they originally drafted (Anthony, Hannah, Levon, Matt, Ryan, TB) or one they landed in the flurry of trades that opened the league before Week 1 (David's Josh Allen, Michael's Lamar Jackson - see Section 1). Mac and Team Barbie's cornerstones simply span their entire time in the league - neither has ever had a chance to lose their guy.

---

## 3. Journeymen (most different owners across all years)

Counting distinct owner-column labels a player has appeared under (see Caveats re: the Mac→Team Barbie ownership handoff, which can inflate this count by one for players who were on that roster slot across the 2022→2023 boundary without actually being traded):

**Clean cases (no Mac/Team Barbie boundary involved) — genuinely 4 real owners:**
- **Daniel Jones** — Anthony (2020) → Michael (2022) → David (2024) → Levon (2025–2026)
- **Latavius Murray** — Anthony (2020) → Levon (2021) → TB (2022) → David (2023)
- **Jake Elliott** — David (2023) → Hannah (2024) → Matt (2025) → Ryan (2026)
- **Jared Goff** — Hannah (2020) → Matt (2022–2023) → David (2024) → TB (2025–2026)
- **Jordan Mason** — Blake (2022) → Team Barbie (2023) → Anthony (2024–2025) → Ryan (2026)

**Boundary-affected cases (3 real owners + 1 franchise-succession label):**
- **Josh Jacobs** — Blake (2020–2021) → Mac (2022) → *[Mac's slot became Team Barbie]* → Team Barbie (2023–2026). Verified against the 2022-tab trade log: *"Blake sends Davante Adams, Josh Jacobs, and $100 FAAB to Mac for his 2023 1st, 2023 2nd, and 2024 1st and 4 contract years."* One real trade, one ownership renaming — not three separate moves.
- **Davante Adams** — same trade, same pattern: Blake (2020–2021) → Mac (2022) → Team Barbie (2023–2026).
- **Keenan Allen / TJ Hockenson / Curtis Samuel** — each shows 4 distinct labels but one of the "owners" is the Mac→Team Barbie seam, so each really changed hands 3 times.

Non-human entries (kickers/defenses churn constantly and aren't very meaningful, but for completeness): **Harrison Butker** and **Tyler Bass** each cycled through 5 different owner-labels 2020–2026; **Steelers D** through 5.

---

## 4. Biggest Contract Commitments

The largest single contract-year grants ever recorded in the sheet (N = years remaining beyond the season granted, so total control = grant year + N):

| Contract | Player | Owner | Granted | Controlled through | Outcome |
|---|---|---|---|---|---|
| 8 yrs | Patrick Mahomes | Ryan | 2020 | 2028 | **Fulfilled to date** — on Ryan's roster every single season 2020–2026, decrementing perfectly (8→7→6→5→4→3→2), never traded. |
| 7 yrs | Lamar Jackson | Michael | 2020 | 2027 | **Fulfilled to date** - not a draft-day pick: Michael acquired Lamar Jackson from David in the 2020 opening trades, with this 7-year contract attached (Section 8: *"David gets Josh Allen and 4 years; Michael gets Lamar Jackson"*). Every year since, it has decremented perfectly (7 to 6 to 5 to 4 to 3 to 2 to 1) on Michael's roster through 2026, never moved again. |
| 6 yrs | Kyler Murray | Levon | 2020 | 2026 | **Broken** — traded to Anthony after just 1 season (2021 note: *"Levon Receives Diontae Johnson... ANTHONY RECEIVES Kyler Murray (5 years remaining)"*). Anthony then carried him 2021–2025 (decrementing 5→4→3→2→1) but Murray is **not** on Anthony's 2026 roster — cut one year short of the fully-committed term. |
| 6 yrs | Justin Herbert | Anthony | 2023 | 2029 | **Fulfilled to date** — this was actually Herbert's *second* deal. TB originally signed him for 3 years in 2020 (decremented to 0 by 2022); Anthony acquired him in a 2023 three-way trade *("Blake receives Alvin Kamara, Tony receives Justin Herbert and Blake's 2023 1st, and TB gets both of Tony's 2023 1st rounders")* and immediately re-signed him for 6 fresh years. Still Anthony's franchise QB, decrementing on schedule (6→5→4→3) through 2026. |
| 5 yrs | AJ Brown | David | 2020 | 2025 | **Partially fulfilled, then traded and extended** — David held him 3 of the 5 committed years (2020–2022), then traded him to Michael for 2023 (contract correctly reset to 2 remaining, matching 3 unused years). Michael has renewed him on expiring year-to-year paper every season since (0 in 2025, blank/expiring again in 2026) — 4 straight seasons of not letting him actually hit the market. |
| 5 yrs | Chris Godwin | Matt | 2020 | 2025 | **Fulfilled and re-upped** — still Matt's, streak now running 7 straight years (see Section 1). |
| 5 yrs | DJ Moore | Matt | 2020 | 2025 | Same as above — still Matt's, 7-year streak. |
| 5 yrs | Deshaun Watson | Hannah | 2020 | 2025 | Fulfilled and re-upped — see the 2026 cliff in Section 6, though. |
| 5 yrs | Christian McCaffery | Hannah | 2020 | 2025 | Same. |
| 5 yrs | Dalvin Cook | Ryan | 2020 | 2025 | **Fulfilled exactly on schedule** — decremented 5→4→3→2→1 every year 2020–2024, then cleanly disappeared from all rosters after 2024 (contract ran out, not traded, not cut early). |
| 5 yrs | Kenny Golladay | Levon | 2020 | 2025 | **Busted** — see Section 5. |
| 5 yrs | Chris Olave | Anthony | 2023 | 2028 | Fulfilled to date. Olave was actually on Blake's roster in 2022 (4-yr deal) before ending up on Anthony's in 2023 with a fresh 5-yr number; still there, decrementing on schedule, through 2026. |

---

## 5. Busts

Players who got a contract of 3+ years and then vanished from **every** roster in the league within a season or two of the grant:

- **Trey Lance** — Matt signed him for **5 years** in 2021. Appears on Matt's roster in 2021 and 2022 (contract already liquidated down from 4 to 1 per the 2023-tab note: *"Matt: Trey Lance 4 turned to 1"*), then gone from the entire league by 2023. Two seasons of return on a five-year bet.
- **Kenny Golladay** — Levon signed him for **5 years** in 2020. On Levon's roster 2020–2022, then formally liquidated: *"Liquidated Reagor and Golladay 2 years each (2:1), spent the 2 new years on singletary"* (2023-tab note). Gone from the league after 2022 — 3 of 5 committed years delivered, the rest converted away.
- **Jalen Reagor** — same liquidation event as Golladay, above; Levon's 3-year 2020 pickup gone by 2022.
- **Bryce Young** — Hannah gave him **4 years** in 2023, then doubled down with a fresh **3-year** re-sign in 2024 — and he was gone from the entire league by the end of 2024. Two commitments, zero payoff.
- **Ezekiel Elliott / Clyde Edwards-Helaire / Trey Sermon** — all Matt/Levon 3–4 year commitments from the 2020–2021 vintage that were out of the league entirely by 2022–2023.
- **Terrace Marshall** — Anthony's 3-year 2021 flier, gone by 2023.
- **Henry Ruggs** — Michael's 3-year 2020 pickup; never appears again after the 2020 tab (matches Ruggs's real-world departure from the NFL after the 2021 season).
- **Jalin Hyatt** — Blake's 3-year 2023 pickup, gone by 2025.
- **Khalil Herbert** — Ryan's 4-year 2024 re-sign, gone by 2025 (one season of "control" purchased for four years of cap).

---

## 6. The 2026 Cliff

Using the 2026 tab only. "Expiring" = contract is `0` (last guaranteed year) or blank (no years — pure rights). "Long control" = contract ≥ 3 years remaining.

| Owner | Roster size | Expiring (0/blank) | Long control (≥3) | Total locked-in years |
|---|---|---|---|---|
| Hannah | 23 | **20** | 1 | 7 |
| Levon | 23 | **20** | 0 | 5 |
| Michael | 23 | 19 | 0 | 7 |
| Team Barbie | 20 | 17 | 1 | 6 |
| David | 19 | 17 | 0 | **2** |
| TB | 21 | 17 | 1 | 7 |
| Matt | 21 | 16 | 1 | 9 |
| Ryan | 21 | 14 | 1 | 10 |
| Blake | 20 | 13 | 2 | 13 |
| Anthony | 21 | 13 | **4** | **18** |

**Hannah is about to lose the most talent, and it's not close.** Every single one of her seven 2020-vintage "never moved" cornerstones — Deshaun Watson, Christian McCaffery, Jonathan Taylor, Tony Pollard, Courtland Sutton, Ceedee Lamb, and Justin Jefferson — shows a **blank/expiring contract on the 2026 tab, simultaneously.** The exact roster that made her the league's most loyal, lowest-churn owner (Section 9) is entirely up for grabs at once. Her only long-term piece is Ashton Jeanty (4 years).

**David is the bare cupboard.** Zero players with 3+ years of control, and only 2 total contract-years locked in across his entire 19-man roster — the lowest total in the league by a factor of 3.

**Anthony is the best-positioned by far** — 4 players locked up 3+ years (Justin Herbert, Omarion Hampton, Travis Hunter, Malik Nabers) and 18 total locked-in contract-years, roughly 9x David's total.

---

## 7. Contract Stockpiles

Using total locked-in contract-years (sum of all non-expiring contract numbers on the active roster) per team, per season:

**Anthony has finished #1 in the league in total locked-in contract-years every single season from 2021 through 2026 — six years running** (rankings by year: 2020: 9th, 2021: 1st, 2022: 1st, 2023: 1st, 2024: 1st, 2025: 1st, 2026: 1st). After a slow 2020 start he became, and has stayed, the league's most aggressive long-term builder.

**David is the opposite story.** His stockpile rank by year: 8th (2020), 5th (2021), 8th (2022), 6th (2023), then **dead last (10th) in 2024, 2025, and 2026** — three straight seasons at the bottom of the league, bleeding from 13 total locked-in years in 2023 down to just 2 by 2026 (Section 6).

**Mac** never finished better than 10th/last in any of its three seasons (2020–2022) — consistent with an owner who was perpetually behind in commitments before Team Barbie inherited the slot.

**Team Barbie**, since taking over in 2023, has hovered near the bottom of the league too (10th, 9th, 9th, 8th) — a rebuild that has not yet turned into a hoard.

---

## 8. Trades (verbatim, by season tab)

**2020 tab:**
- "Blake gets AB; Anthony gets 3 contract years; Blake adds 1 contract year to AB"
- "David gets Josh Allen and 4 years; Michael gets Lamar Jackson"
- "Blake gets Josh Jacobs; Anthony gets 2021 1st (8th overall); If Jacobs healthy then 2022 1st if Blake makes championship, 2022 2nd for playoffs, 2022 4th for miss playoffs. If Jacobs injured 1/2 season picks dropped 1 round)"
- "Anthony gets Joe Mixon 2021 1st (1st overall). Michael gets 2021 1st (4th and 8th overall), 2022 1st, marquise Brown, 2 contract years"
- "Michael gets Chase Claypool and 2 contract years. David Gets Travis Kelce"
- "Mac gets Mike Evans. Levon gets 2021 1st (7th overall) and 1 contract year."

**2021 tab:**
- "David Receives Blakes 2022 1st round pick, Odell Beckham, Devonta Booker. BLAKE RECEIVES- Davids 2022 1st round, Chris Carson, AJ Dillon, 2 contract years"
- "Levon Receives Diontae Johnson (1 year remaining), Anthony's 2022 4th round pick, 2 contract years (to be given at beginning of new league year 2022. ANTHONY RECEIVES Kyler Murray (5 years remaining)"
- "David Receives Alex Collins. ANTHONY RECEIVES - 2 contract years, $60 FAAB"

**2022 tab:**
- "TB sends Josh Palmer and a 4th (2023) to Tony Loff for a 3rd (2023) and 1 contract year (this has been adjusted by BP already); Tony uses 3 years on Palmer"
- "David sends hist 1st (2023) to Tony Loff for James Robinson"
- "David sends Christian Watson and his 2nd (2023) to PangDaddy for Tyler Boyd; Blake uses 2 years on Watson"
- "Blake puts 2 contract years on Christian Watson after the trade (Updated by Tony Loff)"
- "Tony sends Joe Mixon to Mikey for George Pickens and Mikey's 2023 1st rounder (Updated by Tony Loff)"
- "Blake sends Davante Adams, Josh Jacobs, and $100 FAAB to Mac for his 2023 1st, 2023 2nd, and 2024 1st and 4 contract years (Updated by Tony Loff)"
- "Tony sends Isiah Pacheco and 3 contract years to Blake for Garrett Wilson (Blake will put 3 years on Pacheco immediately - Updated by Tony loff)"
- "Matt sends Zeke Elliott to Blake for his 2023 3rd Rounder (not yet updated in above)"

**2023 tab:**
- "David trades Cooper Kupp, Kareem Hunt, and his 2024 & 2025 1st rounders to Blake for Chris Olave and Blake's 2024 1st rounder"
- "3 way trade where Blake receives Alvin Kamara, Tony receives Justin Herbert and Blakes 2023 1st, and TB gets both of Tony's 2023 1st rounders"
- "Matt trades Derrick Henry to Blake for both of Blake's 2023 2nd rounders"
- "David traded his 2024 1st rounder (previously owned by Blake) to TB for his 2023 1st rounder (previously owned by Tony)"
- "Tony Loff gets Jaylen Warren (RB) from Levon for Brandin Cooks and Tank Dell (WRs) - Blake has updated everything up till this point"
- "David sends Chris Olave to Tony Loff for Calvin Ridley and Tony's 2024 1st rounder"
- "BlakeBro sends Derrick Henry to David for his 2024 1st, 2nd, and 2 contract years (already updated)"
- "David sends Jordan Addison, Calvin Ridley, and his 2024 3rd rounder to BlakeBro for Cooper Kupp (UTD)"
- "David sends Saquon Barkley and Jason Sanders to BlakeBro for Alvin Kamara and Jake Elliot (UTD)"
- "Tony Loff sends George Pickens, Rhamondre Stevenson, and 2024 2.02 for Blake's 2024 1.02 and 2 contract years (Updated)"
- "Tony Loff sends 2024 3.02 to TB for Kendre Miller. Tony Loff puts 2 years on Kendre"

**2024 tab:**
- "Tony Loff sends Demario Douglas and 2024 4th for Matty Ice 2024 3rd"
- "Mikey sends D Swift; TB sends James Conner; both sign for 2 years"
- "David Sends Dameon Pierce and 2025 2nd; TB Sends Brian Robinson: David signs B Rob for 3 years"
- "Tony Loff sends 2025 2nd and 3rd for Tyrone Tracy (From Matty Ice)"
- "David sends Brian Robinson, JK Dobbins, 2026 1st to Ryan for Devon Achane"
- "Matt Ice sends Javonte Williams and 2025 3rd to Levon for Tank Dell and 2025 4th"
- "Blake Bro sends 2024 1st and 2024 2nd to Ryan for 2024 1st"

**2025 tab:**
- "Tony Loff gets 1.06, Mitchell, Ridley; BlakeBro gets Kyren WIlliams, Wicks, Bigsby"
- "Tony Loff gets Nico Collins; TB gets DK Metcalf and Deebo Samuel"
- "Tony Loff gets Jaxon Dart (Assigns 2 contract years to him); BlakeBro gets Tony Loffs 2026 2nd round pick"
- "Tony Loff gets David's 2026 4th; David gets Calvin Ridley and Tony Loffs 2026 5th"
- "David gets Stefon Diggs (adds 1 contract year) and Ryan M 2026 5th; Ryan M gets Hollywood Brown and Davids 2026 2nd"

**2026 tab:**
- "6/2: Doivid trades achane to baker; baker trades 2026 1.04, Jordan Addison and Jonathan Brooks to Doivid. Blake assigns 2 contract years to Achane (Now has 3)"
- "TonyLoff trades 2026 1.09, michael wilson, and Jordan Mason to Ryan for David Montgomery and JK Dobbins. TonyLoff assigns 1 contract year to each"

**Tony Loff / Anthony is a party to nearly every trade listed** across all 7 seasons — by a wide margin the league's most active trader (see also Section 9).

---

## 9. Anything Else Statistically Odd or Funny

- **Anthony is a trading addict.** Of the roughly 37 verbatim trades logged across 7 seasons, Anthony (Tony Loff) is named as a party in at least 20 of them — he shows up in every single season's trade log without exception, often multiple times per year (5 separate deals in the 2023 tab alone). Combined with Section 7 (6 straight years leading the league in locked-in contract years), the picture is consistent: Anthony trades constantly *and* signs long, i.e., he's continuously upgrading and re-upping rather than just churning.
- **Hannah is the opposite of Anthony - and it might cost her.** She owns 7 of the 16 all-time "never moved since the origin draft" iron-men (Section 1), and her season-to-season roster turnover is the lowest or second-lowest in the league nearly every year (2020 to 21: 46% turned over, 2024 to 25: 43%, **2025 to 26: just 5%** - she retained 21 of her 22 2025 players into 2026, only replacing 1 and adding 2 rookies). She simply doesn't trade. That extreme loyalty is exactly what set up the 2026 cliff in Section 6 - her whole core is expiring at once because she never diversified when.
- **Michael is close behind Hannah for stability** — his 2025→2026 turnover was also tiny (10%, 19 of 21 players retained), and his career-average turnover (37%) is the second-lowest of any owner with a full 7-year run.
- **David's collapse is the sharpest in the league.** His total locked-in contract-years fell from 33 (2020, ranked 8th) to 13 (2023) to 5 (2024–2025) to just 2 (2026) — three consecutive last-place finishes in Section 7's stockpile ranking, and zero players under contract 3+ years on his entire 2026 roster (Section 6). No other owner shows a decline this steep or this sustained.
- **League-wide, everyone got a lot more conservative about long-term deals over time.** Total locked-in contract-years league-wide fell from 328 in 2020 to just 102 in 2026 — partly a function of the 2026 tab being the *current, in-progress season* (its "Paid?" row reads NO for every owner, unlike every prior season which reads YES — this is the only season that hasn't finished), so most of the incoming rookie class hasn't been extended yet.
- **The spreadsheet has opinions about its own formulas.** Direct quotes preserved from the 2021-tab notes: *"Manually changed Blakes to 4... His formulas couldn't comprehend the change"* and *"had to manually keep his contracts remaining at 5 because of Blakes stupid formulas."* Blake apparently built and maintains the tracker, and his league-mates are not shy about it in writing.
- **The original Kyler Murray asset produced a two-for-one bust.** Levon spent a 6-year commitment on him in 2020 and got traded out of it after one year; Anthony then spent a fresh 5-year commitment on the return and still lost him a year before that term was up (Section 4). Two different owners, two different contracts, same player, neither deal paid off in full.

---

## 10. Caveats

- **The unlabeled "Tab 1" (raw file lines 1-30) has been identified as the origin draft board** - the pre-trade snapshot of the league immediately after the 2020 draft, before the flurry of trades that opened that first season. It uses a different, simpler cell format (`Name (N)` combined in one cell, vs. the two-cell Name/Contract format every other tab uses) and the same 10-owner roster as the 2020 and 2021 tabs (Blake…Mac, no Team Barbie). Its player assignments don't match the confirmed 2020 tab for several players - for example it has David, not Michael, owning Lamar Jackson - which at first looked like a data-quality problem but instead matches the 2020 trade log exactly: *"David gets Josh Allen and 4 years; Michael gets Lamar Jackson"* and *"Michael gets Chase Claypool and 2 contract years. David Gets Travis Kelce."* Diffing this board against the confirmed 2020 tab is what surfaced the fact that Lamar Jackson, Josh Allen, and Travis Kelce were traded within that opening window rather than drafted by their current owners (see Sections 1, 2, and 4). Sleeper's own API only logged 2 trades in 2020 while this board plus the trade log together account for 6, so the spreadsheet - not Sleeper - is the authoritative ledger for these early moves. It is preserved in `rosters.json` under `"year": null` with its original `tab_label` still describing the historical ambiguity, and is left out of every streak/journeyman/contract/cliff calculation in this report except as the origin-state comparison point for Sections 1, 2, and 4.
- **Season-to-tab mapping (2020–2026) was inferred, not explicitly labeled on the sheet.** Each of the 7 real tabs was identified by cross-referencing its "Remaining/New Contracts" notes rows (e.g., a tab containing "2026 New Contracts" must be the 2026 tab) and by verifying that contract-year counts decrement by exactly 1 per season for players who stayed in place (confirmed on multiple players including Deshaun Watson, Lamar Jackson, and Patrick Mahomes). This inference is internally consistent across all 7 tabs but relies on the sheet's contract bookkeeping being accurate.
- **Owner name normalization**: "Blake" = "BlakeBro"; "Anthony" = "Tony Loff" / "TonyLoff" / "Tony" / "PangDaddy"; "Michael" = "Mikey"; "David" = "Doivid" / "Davids"; "Matt" = "Matt Ice" / "Matty Ice"; "Ryan" = "Ryan M". These are used interchangeably in free-text trade notes but map cleanly to a single roster column per season, so player-ownership tracking itself is not affected — only the verbatim trade quotes in Section 8 retain the nicknames as originally written.
- **The Mac → Team Barbie transition (2022 → 2023) is a franchise/ownership succession, not a trade**, but the parser (correctly, per the source data) treats them as two different owner labels. This can overcount "distinct owners" by one for any player who was on that specific roster slot across the boundary without changing hands at all — flagged explicitly wherever it affects a number in Section 3.
- **Player-name matching across seasons used normalized (lowercased, punctuation-stripped) names**, not a hand-curated identity map. This correctly merges near-identical variants (e.g. "Ceedee Lamb"/"CeeDee Lamb", "D'Onta Foreman"/"Donta Foreman") but will **not** merge genuinely different spellings of the same real player if the sheet itself is inconsistent (e.g. "Russel Wilson" is spelled with one L consistently throughout the sheet, so this wasn't an issue in practice, but it was not exhaustively checked for every player in every year). Streak and journeyman numbers should be read as very-high-confidence, not machine-perfect.
- **A handful of roster cells contain an embedded, apparently erroneous parenthetical inside the name itself** — e.g. 2021-tab Blake's "Darren Waller (0)" (with an actual separate contract cell reading "1"), and 2021-tab Blake's "Josh Jacobs (2)" (separate contract cell reading "3"). These are preserved verbatim in the `raw` field per the task's instruction not to "correct" the source; the `contracts` field uses the sheet's dedicated contract-column value, not the number embedded in the name.
- **Several free-text note sections in the sheet** (bench/cut lists in the 2020 tab with no row label, at raw lines 407–411; the weekly top-scorer column embedded only in the 2021 tab; FAAB balances) were captured under each season's `notes.other` for completeness but were not analyzed as part of any storyline above since they fall outside the requested scope.
- **"Long control" thresholds in Sections 6–7** were defined as contract ≥ 3 years remaining (the task allowed either ≥2 or ≥3); ≥2 counts are also present in the underlying data if a different cutoff is wanted.

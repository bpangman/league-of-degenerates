# SPEC v4 - League of Degenerates

Four changes. Everything else stays as it is. All prior rules still apply:
no em/en dashes anywhere, dark theme only, no off-origin requests, no horizontal scroll
at 375px, every number traces to the data files.

## 1. Re-render the shortened memo

`_src/memo2026.md` has been rewritten and is now about half its previous length
(5,667 words down to 2,683). Repeated jokes were cut. Update the `MEMO_MD` string in
`data.js` so it matches the CURRENT file exactly.

This memo was written FOR the user as part of this project. It is not hand-authored text
that must be preserved from an earlier version. Render what is in the file NOW. Do not
revert it, do not restore an older version, do not rewrite its prose or re-lengthen it.

Section headings are unchanged, so the 9 collapsible sections and their teasers should
still work. Re-check each teaser still reads correctly and fix any that no longer match.

## 2. Strip the text out of the spraypaint hero

On `index.html` the hero currently has a kicker above the image reading
`DEGENERATE GM DYNASTY LEAGUE` and a caption below reading `2025 SEASON IN REVIEW`.

**Delete both.** The hero is the image alone on the textured wall. Keep the image's `alt`
text for accessibility, keep the visually-hidden `<h1>` if one exists so the page still has
a heading for screen readers, but remove both visible text elements. Rebalance the spacing
so the artwork does not look stranded once the text is gone.

## 3. The dates are CONFIRMED - remove all TBC markers, and add a new explainer

The user has confirmed all four dates. Remove every "TBC" chip and remove the sentence
that says anything marked TBC is a guess pending confirmation. Rewrite the
"How these dates were figured out" block so it no longer hedges. Keep the genuinely
useful explanation of WHY each date is what it is (Rule 6.07 kickoff, Rule 6.12 one week
before the draft, Wednesday before Thanksgiving), just stated as fact rather than as a guess.

Also correct one thing while you are there: the 2026 NFL season opens **Wednesday
September 9**, which is why the contract deadline is a Wednesday this year rather than the
usual Thursday. Keep that note, it is useful.

### NEW SECTION: "What Happens to Expiring Players"

Add a clearly signposted section explaining the mechanic below. Put it on `draft.html`
near the Key Dates block, AND put a short version with a link to it on `index.html`
directly under the countdown board. This is the thing people forget every year.

Content (write it in plain English, this is the single most confusing rule in the league):

> **The roster deadline is Saturday August 29, one week before the draft (Rule 6.12).**
> That is your last chance to do anything about a player whose contract is up.
>
> A player is expiring if his contract shows **0** (this was his last guaranteed year) or
> shows **no number at all** (you only hold his rights, no security).
>
> By the deadline you have three options for each expiring player:
> 1. **Re-sign him at 2:1.** Two contract years spent for each additional year of control.
>    You must use CARRYOVER years for this. You may not spend your 12 new contract years
>    on re-signings.
> 2. **Franchise tag him.** One more year, free. But if you want to keep him after that
>    tag year, you have to re-sign him for three more years at 2:1, which is six years
>    burned in total. Otherwise he hits the draft the following year.
> 3. **Do nothing**, and he goes into the pool.
>
> **After the deadline, Tony Loff drops every expiring player who was not extended or
> tagged.** Those players all land in the Rookie/FA draft on September 5. That is where a
> big chunk of the draft pool comes from every year, not just rookies.
>
> The same deadline is when rosters must be down to the 20 man maximum.

Cross-reference the Hannah Cliff on the dynasty page here (seven of her cornerstones expire
at once this year), and link to the rulebook.

## 4. FACTUAL CORRECTION on the dynasty page - the "Iron Men" table is wrong

The dynasty page currently claims **19 players have been on the same roster since 2020,
"never traded or cut."** That is wrong and the user caught it.

The cause: the contract spreadsheet has an extra tab that an earlier pass dismissed as a
scratch copy. It is actually the **origin draft board**, the pre-trade state of the league.
A flurry of trades happened in that first 2020 window, so several players' streaks start
after a trade, not at the draft.

Verified by diffing the origin board against the 2020 tab, and corroborated by the
spreadsheet's own 2020 trade log ("David gets Josh Allen and 4 years; Michael gets Lamar
Jackson" and "Michael gets Chase Claypool and 2 contract years. David Gets Travis Kelce").
Note Sleeper's API only logged 2 trades in 2020 while the sheet records 6, so the
spreadsheet is the authoritative ledger for early trades, not Sleeper.

**The correct split is 16 + 3.**

TRUE never-moved since the origin draft (16):
Terry McLaurin (Anthony), Brandon Aiyuk (Michael), Chris Godwin (Matt), DJ Moore (Matt),
Jerry Jeudy (Matt), Deshaun Watson (Hannah), Christian McCaffery (Hannah), Jonathan Taylor
(Hannah), Tony Pollard (Hannah), Courtland Sutton (Hannah), CeeDee Lamb (Hannah), Justin
Jefferson (Hannah), Joe Burrow (Levon), Patrick Mahomes (Ryan), Christian Kirk (TB),
Michael Pittman (TB).

ACQUIRED IN THE 2020 OPENING TRADES, held ever since (3):
- **Lamar Jackson** - now Michael's, **acquired from David**
- **Josh Allen** - now David's, **acquired from Michael**
- **Travis Kelce** - now David's, **acquired from Michael**

Required changes:
- Change the heading and blurb so they no longer say "never traded or cut" for all 19.
  Frame it as 16 players never moved since the origin draft, plus 3 who were acquired in
  the opening 2020 trades and have been locked in ever since.
- Show the 3 acquired players separately or clearly badged as "acquired", naming who they
  came from. Do not bury it.
- Hannah still owns 7 of the 16, so the "more than a third of the loyalty pool" style claim
  should be recomputed against 16, not 19. Check any other number on the page that was
  derived from the 19 figure and fix it too.
- Anywhere else on the site that repeats the "never traded" framing must be fixed.

Also update `_src/storylines.md` sections 1, 2 and 4 so the source document stops asserting
Lamar Jackson was "never traded", and note in its Caveats that the previously-ambiguous tab
is now identified as the origin draft board.

## Verify and report actual output
1. Dash scan over every .html/.js/.css in the repo root returns zero.
2. `node --check data.js` and `node --check app.js` pass.
3. Playwright at 390px on all 8 pages: 200, zero console errors, zero pageerrors,
   scrollWidth-clientWidth === 0.
4. index.html: hero image present, and the strings "2025 SEASON IN REVIEW" and
   "DEGENERATE GM DYNASTY LEAGUE" no longer appear as visible text on the page.
5. The string "TBC" appears ZERO times across the site.
6. "What Happens to Expiring Players" content is present on draft.html and referenced
   on index.html.
7. dynasty.html: no longer claims 19 never-traded; shows 16 plus the 3 acquired, and names
   David and Michael as the sources for Lamar / Josh Allen / Travis Kelce.
8. memo.html: 9 sections, all closed by default, intro and closing always visible.

Local preview server MUST use port 8123. NEVER use 8899 and never kill a process on it.
Then commit, push to main, and poll the live URLs until the changes are serving.
Commit message ends with:
Co-Authored-By: Claude <noreply@anthropic.com>

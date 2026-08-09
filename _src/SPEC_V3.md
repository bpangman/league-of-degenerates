# SPEC v3 - League of Degenerates

Four changes. Everything else on the site stays exactly as it is.
All prior rules still apply: no em/en dashes anywhere, dark theme only, no off-origin
requests, no horizontal scroll at 375px, every number traces to the data files.

## 1. Shorten the header brand on mobile

The header currently reads `LEAGUE OF DEGENERATES` and eats the whole width on a phone.

- On narrow screens (under about 640px) show just **`LOD`** (keep the red styling on the
  `D`-word idea however reads best, e.g. `LOD` with the final letter in the accent red).
- At wider widths keep the full `LEAGUE OF DEGENERATES` exactly as it is now.
- Do this with CSS only (two spans, one hidden per breakpoint). Do not use JS.
- The accessible name of the link must remain the full "League of Degenerates" for screen
  readers regardless of which variant is visible.
- While you are in there: make sure the nav itself does not overflow at 375px. If the eight
  nav items still crowd the bar on a phone, let the nav scroll horizontally inside its own
  container (the PAGE must not scroll sideways).

## 2. Move the spraypaint artwork ABOVE the countdown clocks

On `index.html` the order is currently: countdown board, then the spray hero.
Flip it: **spray hero first, countdown board second.** The artwork should be the first
thing on the page, then the clocks directly under it.

Keep the countdown board's own styling and its "How these dates were figured out" explainer
in place, just relocated below the hero. Do not shrink the artwork to make room; it should
still land as a full statement at the top. Verify on mobile that the clocks are still
reachable without an absurd amount of scrolling - if the hero is too tall on a phone, cap
its height there rather than reordering again.

## 3. TB's baby

`_src/memo2026.md` has been rewritten in the TB section. His third child has ARRIVED:
wife **Nicole**, baby **Ellis**. The section is retitled and is much longer and meaner.
Re-render the memo from the current file so `data.js` matches it. Do not paraphrase or
trim it.

Check the rest of the site for any copy that still says TB's third child is on the way or
"incoming" and update it. The home page teaser for the memo may reference it.

## 4. Collapsible roast sections on the memo page

The memo is one long wall. Make each per-person roast collapse, so the page becomes a
scannable list of names you click to expand.

- Every `##` section in the memo becomes a collapsible block. The heading is the clickable
  control; the body hides until clicked.
- The material BEFORE the first `##` (the opening about finishing tenth) and the closing
  block at the very end (from "One final note" through "HAPPY FANTASY, YOU COWARDS.")
  must stay ALWAYS VISIBLE and never collapse. Only the named sections collapse.
- Default state: **all collapsed**, so the reader lands on a tight list of names.
- Use native `<details>`/`<summary>` so it works with no JS and is accessible. Style the
  summary so it is obviously tappable (chevron that rotates on open, big tap target, at
  least 44px tall). Remove the default disclosure triangle.
- Add an "Expand all / Collapse all" toggle at the top of the list.
- Give each section a stable `id` and support deep links: if the URL has a hash matching a
  section, open that one and scroll to it on load.
- Nice to have, only if it does not clutter: a one-line teaser under each collapsed name
  (for example Levon's could be "Won the title. Nobody noticed. Now he's moving home.").
  Write these yourself from each section's actual content. Keep them under about 60 chars.

The nine sections, in memo order:
Levon, Tony Loff, David, Hannah & Mathieu, Team Barbie, Mikey, Ryan M, TB, The Commissioner.

## Verify before reporting done
1. Dash scan over every .html/.js/.css in the repo root returns zero.
2. Playwright at 390px on all 8 pages: 200, zero console errors, zero pageerrors,
   `scrollWidth - clientWidth === 0`.
3. On `index.html` confirm the logo element appears EARLIER in the document than the
   countdown board element (compare their positions, do not eyeball it).
4. On `memo.html` confirm: all sections start closed, clicking a summary opens it, the
   intro and the closing are visible without any clicking, and expand-all works.
5. Confirm the header shows `LOD` at 390px and the full wordmark at 1280px.
6. Confirm "Ellis" and "Nicole" appear in the rendered memo and that no page still says
   TB's child is on the way.
7. Screenshot index at 390px to /tmp/v3-home-mobile.png, memo at 390px collapsed to
   /tmp/v3-memo-collapsed.png, and memo with one section expanded to /tmp/v3-memo-open.png.

Local preview server: use port **8123**. Do NOT use 8899, that port belongs to another
service on this machine and killing it takes down something the user relies on.

Then commit and push to main, and poll until the live site serves the change.
Commit message ends with:
Co-Authored-By: Claude <noreply@anthropic.com>

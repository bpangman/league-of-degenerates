/* app.js - League of Degenerates. Shared logic for all 8 pages.
   Depends on data.js being loaded first (SEASON2025, ANALYTICS, HISTORY, LIFETIME,
   CHAMPS, H2H, MANAGER_INFO, MEMO_MD, DRAFT2026).
   Every render function below checks that its target element exists before running,
   so this one file can be safely included on every page even though each page only
   has some of the containers. */

/* =========================================================================
   LEAGUE_DATES - the four key 2026 offseason dates, in ONE place.
   Change a date here and it updates everywhere on the site (the home page
   countdown board and the key-dates list on draft.html).

   Every date/time is US Central Time. As of these 2026 dates, Central is on
   Daylight Time (CDT = UTC-5), so every "iso" string below ends in "-05:00"
   to lock it to Central time regardless of what time zone the visitor's own
   phone or computer is set to.
   ========================================================================= */
const LEAGUE_DATES = {

  // The Rookie/Free-Agent draft itself. This is the big one - the primary
  // countdown on the home page. It comes straight from the league's actual
  // Sleeper draft room ("draft_start_ms" in sleeper/draft2026.json).
  draft: {
    label: "Rookie/FA Draft",
    iso: "2026-09-05T14:00:00-05:00", // Saturday, September 5, 2026, 2:00 PM Central
    blurb: "Confirmed straight from the league's Sleeper draft room."
  },

  // The deadline to set final rosters and use a "Franchise Tag" (a rule that
  // lets a manager protect one expiring player) before the draft locks rosters.
  // This lands on the Wednesday before the draft, at midnight Central.
  rosterTag: {
    label: "Roster + Franchise Tag Deadline",
    iso: "2026-09-02T23:59:59-05:00", // Wednesday, September 2, 2026, end of day Central
    blurb: "The Wednesday before the draft, end of day Central."
  },

  // The deadline for signing new player contracts after the draft. League
  // Rule 6.07 ties this to the first real NFL regular-season game after the
  // draft. In most years that's a Thursday, but the 2026 NFL season kicks
  // off on a Wednesday (September 9) instead of the usual Thursday, so this
  // year the contract deadline falls on a Wednesday too, at 5:00 PM Central
  // on kickoff day.
  contract: {
    label: "Contract Deadline",
    iso: "2026-09-09T17:00:00-05:00", // Wednesday, September 9, 2026, 5:00 PM Central
    blurb: "Set by Rule 6.07: due by the first NFL regular-season game after the draft. The 2026 season opens on a Wednesday, not the usual Thursday, so the deadline moves with it."
  },

  // The trade deadline. This one has a clean, unbroken pattern: every year on
  // record it has landed on the Wednesday before Thanksgiving (11/22/23,
  // 11/27/24, 11/26/25). Thanksgiving 2026 is Thursday, November 26, so the
  // Wednesday before it is November 25.
  trade: {
    label: "Trade Deadline",
    iso: "2026-11-25T23:59:59-05:00", // Wednesday, November 25, 2026, end of day Central
    blurb: "Lands on the Wednesday before Thanksgiving every year on record (11/22/23, 11/27/24, 11/26/25)."
  }
};

/* ---------------- small formatting helpers, used everywhere ---------------- */
function fmt(n){ return (typeof n === 'number') ? n.toFixed(2) : n; }
function fmt1(n){ return (typeof n === 'number') ? n.toFixed(1) : n; }
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function personFor(handle){ return MANAGER_INFO[handle] ? MANAGER_INFO[handle].person : handle; }
function teamFor(handle){ return MANAGER_INFO[handle] ? MANAGER_INFO[handle].team : handle; }

/* =========================================================================
   COUNTDOWN BOARD (home page only - runs harmlessly nowhere else because it
   checks for #countdown-board before doing anything)
   ========================================================================= */
(function countdownBoard(){
  const board = document.getElementById('countdown-board');
  if (!board) return;

  const items = [
    { key: 'draft',     cfg: LEAGUE_DATES.draft,     primary: true  },
    { key: 'rosterTag', cfg: LEAGUE_DATES.rosterTag, primary: false },
    { key: 'contract',  cfg: LEAGUE_DATES.contract,  primary: false },
    { key: 'trade',     cfg: LEAGUE_DATES.trade,     primary: false }
  ];

  // Formats the wall-clock date/time exactly as written in the ISO string
  // (e.g. "2026-11-25T23:59:59-05:00" -> "Wed, Nov 25, 2026, 11:59 PM CT").
  // Deliberately does NOT use the real America/Chicago time zone database for
  // display, because that would apply real-world Daylight Saving rules (Central
  // reverts to CST/UTC-6 in early November) and silently shift late-year dates
  // like the trade deadline back an hour on screen even though every date in
  // LEAGUE_DATES is intentionally encoded as a fixed -05:00 offset per the spec.
  function dateLabel(iso){
    const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    const wallClock = new Date(Date.UTC(+m[1], +m[2]-1, +m[3], +m[4], +m[5]));
    const weekday = wallClock.toLocaleDateString('en-US', { weekday:'short', timeZone:'UTC' });
    const month = wallClock.toLocaleDateString('en-US', { month:'short', timeZone:'UTC' });
    const day = +m[3], year = +m[1], hour24 = +m[4], minute = m[5];
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    let hour12 = hour24 % 12; if (hour12 === 0) hour12 = 12;
    return weekday + ', ' + month + ' ' + day + ', ' + year + ', ' + hour12 + ':' + minute + ' ' + ampm + ' CT';
  }

  let html = '';
  items.forEach(item => {
    html += '<div class="cd-card' + (item.primary ? ' primary' : '') + '" id="cd-card-' + item.key + '">' +
      '<div class="cd-name">' + esc(item.cfg.label) + '</div>' +
      '<div class="cd-when">' + dateLabel(item.cfg.iso) + '</div>' +
      '<div class="cd-body" id="cd-body-' + item.key + '"></div>' +
      '</div>';
  });
  board.querySelector('#cd-grid').innerHTML = html;

  function pad(n){ return String(n).padStart(2,'0'); }

  function render(){
    items.forEach(item => {
      const target = new Date(item.cfg.iso).getTime();
      const now = Date.now();
      const body = document.getElementById('cd-body-' + item.key);
      if (!body) return;
      const diff = target - now;
      if (diff <= 0){
        body.innerHTML = '<div class="cd-passed">PASSED</div>';
        return;
      }
      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const mins = Math.floor((totalSeconds % 3600) / 60);
      const secs = totalSeconds % 60;
      body.innerHTML =
        '<div class="cd-timer">' +
          '<div class="cd-unit"><div class="cd-num tabular">' + days + '</div><div class="cd-lbl">Days</div></div>' +
          '<div class="cd-unit"><div class="cd-num tabular">' + pad(hours) + '</div><div class="cd-lbl">Hrs</div></div>' +
          '<div class="cd-unit"><div class="cd-num tabular">' + pad(mins) + '</div><div class="cd-lbl">Min</div></div>' +
          '<div class="cd-unit"><div class="cd-num tabular">' + pad(secs) + '</div><div class="cd-lbl">Sec</div></div>' +
        '</div>';
    });
  }

  render();
  setInterval(render, 1000);
})();

/* =========================================================================
   HERO CHAMP DETAIL (home page)
   ========================================================================= */
(function renderHeroChamp(){
  const el = document.getElementById('hero-champ-detail');
  if (!el) return;
  const champRow = SEASON2025.standings.teams.find(t => t.manager === 'levonthelight');
  const champFinal = SEASON2025.playoffs.rounds.find(r => r.round === 'Championship').matchups[0];
  el.textContent = champRow.wins + '-' + champRow.losses + ' regular season, 5 seed, then beat Tony Loff ' + fmt(champFinal.team2_score) + ' to ' + fmt(champFinal.team1_score) + ' in the Final.';
})();

/* =========================================================================
   MEMO RENDERER (memo.html only) - converts the verbatim markdown in
   data.js's MEMO_MD into the memo-body HTML. Handles: ## headers, **bold**,
   *italic* asides, and blank-line-separated paragraphs. Nothing here changes
   the words themselves - it only wraps them in tags.

   Each ## section becomes a collapsible <details>/<summary> block, closed by
   default. The material before the first ## (the "finished tenth" opening)
   and the material from "One last thing" onward at the very end stay always
   visible and are never wrapped in <details>.
   ========================================================================= */
(function renderMemo(){
  const el = document.getElementById('memo-body');
  if (!el) return;

  function inline(s){
    // escape html first, then apply bold/italic markup
    s = esc(s);
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*(.+?)\*/g, '<em>$1</em>');
    return s;
  }

  function paragraphsHtml(blocks){
    return blocks.map(function(b){
      // A "## " block that ends up in the intro/closing stream (see
      // ALWAYS_OPEN_HEADERS below) renders as a plain headline, not a
      // collapsible <details> summary - reuses the existing .memo-body h3
      // styling instead of a <p>.
      if (b.startsWith('## ')){
        return '<h3>' + inline(b.slice(3).trim()) + '</h3>';
      }
      return '<p>' + inline(b) + '</p>';
    }).join('');
  }

  function slugify(s){
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  // Stable ids + short teasers for the nine named sections, in memo order.
  const SECTION_IDS = ['levon', 'tony-loff', 'david', 'hannah-mathieu', 'team-barbie', 'mikey', 'ryan-m', 'tb', 'commissioner'];

  // One photo per section, keyed by SECTION_IDS. Rendered as a <figure class="memo-photo">
  // at the top of each section's body, before the paragraph text. Width/height are the
  // real pixel dimensions of the web-ready file in ./memo-photos/ (longest side 1000px),
  // hardcoded so the browser can reserve the right space before the image loads. Sources
  // and licenses for all nine are recorded in _src/memo-photos/SOURCES.md.
  const SECTION_PHOTOS = {
    'levon': {
      src: './memo-photos/levon-greenland.jpg',
      alt: 'Aerial view of Nuuk, Greenland, showing the harbor, apartment blocks and surrounding mountains.',
      caption: 'Exhibit B. The nation we could not buy. Levon got there for free.',
      width: 1000, height: 656
    },
    'tony-loff': {
      src: './memo-photos/tony-loff-election-map.jpg',
      alt: 'A shaded red and blue map of United States presidential election results by county.',
      caption: 'Exhibit C. Every poll had it called by ten. The board said otherwise.',
      width: 1000, height: 616
    },
    'david': {
      src: './memo-photos/david-mission-accomplished.jpg',
      alt: 'The banner reading MISSION ACCOMPLISHED hangs above sailors standing in formation on the deck of the USS Abraham Lincoln.',
      caption: 'Exhibit D. Hung two rounds before the war was actually over. Some things never change.',
      width: 1000, height: 714
    },
    'hannah-mathieu': {
      src: './memo-photos/hannah-mathieu-barron-trump.jpg',
      alt: 'Barron Trump standing with an unbothered, stone-faced expression in a crowd at a formal event.',
      caption: 'Exhibit E. Pictured is not Barron next to Elon. For the record, that is Matt, standing next to Hannah, every Sunday of the season.',
      width: 807, height: 1000
    },
    'team-barbie': {
      src: './memo-photos/team-barbie-dewey-defeats-truman.jpg',
      alt: 'Harry Truman smiling and holding up a newspaper with the incorrect headline DEWEY DEFEATS TRUMAN.',
      caption: 'Exhibit F. The pollsters had Team Barbie golfing by October. The pollsters were wrong again.',
      width: 1000, height: 768
    },
    'mikey': {
      src: './memo-photos/mikey-navy-computer.jpg',
      alt: 'A US Navy sailor typing at a computer keyboard aboard a Navy ship.',
      caption: 'Exhibit G. The operation that made the playoffs without him touching a mouse.',
      width: 1000, height: 665
    },
    'ryan-m': {
      src: './memo-photos/ryan-m-iron-dome.jpg',
      alt: 'A military missile defense radar and launcher unit standing in a grassy field.',
      caption: 'Exhibit H. Declared totally annihilated. Rebuilt by Thursday. Every time.',
      width: 747, height: 1000
    },
    'tb': {
      src: './memo-photos/tb-witness-table.jpg',
      alt: 'An empty witness table set up for a Senate committee hearing, with a nameplate, microphone, timer and water bottles.',
      caption: 'Exhibit I. Reserved for testimony. The Fifth Amendment was invoked before anyone sat down.',
      width: 1000, height: 840
    },
    'commissioner': {
      src: './memo-photos/commissioner-artillery.jpg',
      alt: 'Smoke and a shell leaving the barrel of a US Army howitzer during a live fire exercise.',
      caption: 'Exhibit J. Incoming. Six years running. Nobody has ever once sent aid.',
      width: 1000, height: 664
    }
  };

  const SECTION_TEASERS = [
    "Won the title. Nobody noticed. Now he's moving home.",
    '11-3, best record in the league. Lost the Final.',
    'Announced victory early again. Lyla came early too.',
    "Led the league in scoring. Finished 5th.",
    'Unluckiest team in the league. Toilet Bowl champs.',
    'Home from deployment. Playoffs on auto-draft.',
    'Getting married. Quietly hoarding 3 first-rounders.',
    'Baby Ellis arrived. His team went 5-9.',
    "Finished 10th. Gave his consolation pick away."
  ];

  // Headline sections that read like part of the intro (always visible,
  // never collapsible) even though they use a "## " header in the markdown
  // so they still get a visual title. Matched by exact header text.
  const ALWAYS_OPEN_HEADERS = [
    "THE BAKER MAYFIELD AFFAIR"
  ];

  // Split MEMO_MD into: intro (before first ##), named sections, and the
  // always-visible closing block (from "One final note" through the end).
  // A header listed in ALWAYS_OPEN_HEADERS stays part of the intro stream
  // instead of starting a new collapsible section.
  const blocks = MEMO_MD.split(/\n\n+/).map(b => b.trim()).filter(Boolean);
  const introBlocks = [];
  const sections = [];
  const closingBlocks = [];
  let mode = 'intro';
  let current = null;

  blocks.forEach(b => {
    if (mode !== 'closing' && b.startsWith('## ')){
      const title = b.slice(3).trim();
      if (mode === 'intro' && ALWAYS_OPEN_HEADERS.indexOf(title) !== -1){
        introBlocks.push(b);
        return;
      }
      current = { title: title, bodyBlocks: [] };
      sections.push(current);
      mode = 'section';
      return;
    }
    if (mode === 'section' && b.startsWith('One last thing')){
      mode = 'closing';
      closingBlocks.push(b);
      return;
    }
    if (mode === 'intro'){ introBlocks.push(b); return; }
    if (mode === 'section'){ current.bodyBlocks.push(b); return; }
    closingBlocks.push(b);
  });

  let html = paragraphsHtml(introBlocks);

  html += '<div class="memo-toggle-row"><button type="button" id="memo-toggle-all" class="memo-toggle-btn">Expand all</button></div>';

  html += '<div class="memo-sections">';
  sections.forEach((sec, i) => {
    const id = SECTION_IDS[i] || slugify(sec.title);
    const teaser = SECTION_TEASERS[i] || '';
    const photo = SECTION_PHOTOS[id];
    const photoHtml = photo ?
      '<figure class="memo-photo"><img src="' + photo.src + '" alt="' + esc(photo.alt) + '" loading="lazy" width="' + photo.width + '" height="' + photo.height + '"><figcaption>' + inline(photo.caption) + '</figcaption></figure>' :
      '';
    html += '<details class="memo-section" id="' + id + '">' +
      '<summary>' +
        '<span class="ms-title">' + inline(sec.title) + '</span>' +
        '<span class="ms-chevron" aria-hidden="true"></span>' +
        (teaser ? '<span class="ms-teaser">' + inline(teaser) + '</span>' : '') +
      '</summary>' +
      '<div class="ms-body">' + photoHtml + paragraphsHtml(sec.bodyBlocks) + '</div>' +
    '</details>';
  });
  html += '</div>';

  html += '<div class="memo-closing">' + paragraphsHtml(closingBlocks) + '</div>';

  el.innerHTML = html;

  // Expand all / collapse all toggle.
  const detailsEls = Array.prototype.slice.call(el.querySelectorAll('details.memo-section'));
  const toggleBtn = document.getElementById('memo-toggle-all');
  if (toggleBtn && detailsEls.length){
    toggleBtn.addEventListener('click', function(){
      const anyClosed = detailsEls.some(function(d){ return !d.open; });
      detailsEls.forEach(function(d){ d.open = anyClosed; });
      toggleBtn.textContent = anyClosed ? 'Collapse all' : 'Expand all';
    });
  }

  // Deep-link support: #<section-id> opens and scrolls to that section.
  function openFromHash(){
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;
    const target = document.getElementById(hash);
    if (target && target.tagName === 'DETAILS'){
      target.open = true;
      target.scrollIntoView({ block: 'start' });
    }
  }
  openFromHash();
  window.addEventListener('hashchange', openFromHash);
})();

/* =========================================================================
   STANDINGS + AWARDS (standings.html)
   ========================================================================= */
(function renderStandings(){
  const tbody = document.querySelector('#standings-table tbody');
  if (!tbody) return;
  const regSeed = {};
  SEASON2025.standings.teams.forEach(t => regSeed[t.manager] = t.rank);
  const regRow = {};
  SEASON2025.standings.teams.forEach(t => regRow[t.manager] = t);

  ANALYTICS.final_order.forEach(row => {
    const reg = regRow[row.manager];
    const tr = document.createElement('tr');
    if (row.place === 1) tr.className = 'row-champ';
    if (row.place === 10) tr.className = 'row-last';
    tr.innerHTML =
      '<td class="num">' + row.place + '</td>' +
      '<td>' + esc(row.team) + '</td>' +
      '<td>' + esc(personFor(row.manager)) + '</td>' +
      '<td class="num">' + regSeed[row.manager] + '</td>' +
      '<td class="num">' + reg.wins + '</td>' +
      '<td class="num">' + reg.losses + '</td>' +
      '<td class="num">' + fmt(reg.pf) + '</td>' +
      '<td class="num">' + fmt(reg.pa) + '</td>' +
      '<td>' + esc(row.result) + '</td>';
    tbody.appendChild(tr);
  });
})();

(function renderAwards(){
  const el = document.getElementById('award-grid');
  if (!el) return;
  const top = ANALYTICS.top_scores[0];
  const low = ANALYTICS.low_scores[0];
  const blow = ANALYTICS.blowouts[0];
  const close = ANALYTICS.closest[0];
  const adv = ANALYTICS.advanced;
  const mostPrizesTeam = adv.slice().sort((a,b)=>b.weekly_prizes-a.weekly_prizes)[0];
  const luckiest = adv.slice().sort((a,b)=>b.luck-a.luck)[0];
  const unluckiest = adv.slice().sort((a,b)=>a.luck-b.luck)[0];

  const cards = [
    {label:'Highest Single Week', value: fmt(top.score), sub: esc(top.team) + ' - Week ' + top.week + ' vs ' + esc(top.opp) + ' (' + fmt(top.opp_score) + ')', pos:true},
    {label:'Lowest Single Week', value: fmt(low.score), sub: esc(low.team) + ' - Week ' + low.week + ' vs ' + esc(low.opp) + ' (' + fmt(low.opp_score) + ')', neg:true},
    {label:'Biggest Blowout', value: fmt(blow.margin), sub: esc(blow.home) + ' ' + fmt(blow.home_score) + ' def. ' + esc(blow.away) + ' ' + fmt(blow.away_score) + ' - Week ' + blow.week, neg:true},
    {label:'Closest Game', value: fmt(close.margin), sub: esc(close.away) + ' ' + fmt(close.away_score) + ' vs ' + esc(close.home) + ' ' + fmt(close.home_score) + ' - Week ' + close.week},
    {label:'Most Weekly High-Score Prizes', value: mostPrizesTeam.weekly_prizes, sub: esc(mostPrizesTeam.team) + ' won the weekly prize ' + mostPrizesTeam.weekly_prizes + ' times', pos:true},
    {label:'Luckiest Team', value: (luckiest.luck>0?'+':'') + fmt(luckiest.luck), sub: esc(luckiest.team) + ' - ' + fmt1(luckiest.expected_wins) + ' expected wins, ' + luckiest.actual_wins + ' actual', pos:true},
    {label:'Unluckiest Team', value: fmt(unluckiest.luck), sub: esc(unluckiest.team) + ' - ' + fmt1(unluckiest.expected_wins) + ' expected wins, only ' + unluckiest.actual_wins + ' actual', neg:true}
  ];
  el.innerHTML = cards.map(c => '<div class="award-card ' + (c.pos?'pos':c.neg?'neg':'') + '"><div class="a-label">' + c.label + '</div><div class="a-value tabular">' + c.value + '</div><div class="a-sub">' + c.sub + '</div></div>').join('');
})();

/* =========================================================================
   ALL-PLAY (allplay.html)
   ========================================================================= */
(function renderAllPlay(){
  const tbody = document.querySelector('#allplay-table tbody');
  if (!tbody) return;
  const rows = ANALYTICS.advanced.slice().sort((a,b) => b.allplay_pct - a.allplay_pct);
  rows.forEach(r => {
    const tr = document.createElement('tr');
    const luckStr = (r.luck > 0 ? '+' : '') + fmt(r.luck);
    tr.innerHTML =
      '<td>' + esc(r.team) + '</td>' +
      '<td class="num">' + r.allplay_w + '-' + r.allplay_l + '</td>' +
      '<td class="num">' + r.allplay_pct.toFixed(3) + '</td>' +
      '<td class="num">' + fmt1(r.expected_wins) + '</td>' +
      '<td class="num">' + r.actual_wins + '</td>' +
      '<td class="num" style="color:' + (r.luck>=0?'var(--gold)':'var(--red)') + '">' + luckStr + '</td>' +
      '<td class="num">' + fmt(r.pf) + '</td>' +
      '<td class="num">' + fmt(r.ppg) + '</td>' +
      '<td class="num">' + r.weekly_prizes + '</td>';
    tbody.appendChild(tr);
  });
})();

/* =========================================================================
   DRAFT BOARD (draft.html)
   ========================================================================= */
(function renderDraftBoard(){
  const el = document.getElementById('draft-round1');
  if (!el) return;
  let html = '';
  DRAFT2026.round1.forEach(p => {
    html += '<div class="draft-pick ' + (p.acquired ? 'acquired' : 'earned') + '">' +
      '<div class="dp-num">' + esc(p.pick) + '</div>' +
      '<div class="dp-mid"><h4>' + esc(p.heldBy) + '</h4><p>' + esc(p.note) + '</p></div>' +
      '<div class="dp-right"><span class="pill ' + (p.acquired ? 'red' : 'gray') + '">' + (p.acquired ? 'Acquired' : 'Earned') + '</span></div>' +
      '</div>';
  });
  el.innerHTML = html;

  const movedEl = document.getElementById('draft-moved-other');
  if (movedEl){
    movedEl.innerHTML = DRAFT2026.moved_other_rounds.map(m =>
      '<li>Round ' + m.round + ': ' + esc(m.from) + '\'s pick moved to ' + esc(m.to) + '</li>'
    ).join('');
  }

  const summaryEl = document.getElementById('draft-manager-summary');
  if (summaryEl){
    summaryEl.innerHTML = DRAFT2026.manager_summary.map(m =>
      '<div class="info-card"><h4>' + esc(m.manager) + '</h4><p>' + esc(m.notes) + '</p></div>'
    ).join('');
  }
})();

(function renderKeyDates(){
  const el = document.getElementById('key-dates-list');
  if (!el) return;
  // Reuses the same fixed-offset wall-clock formatter as the countdown board
  // (see the comment on dateLabel() above) so the date/time shown here always
  // matches the date/time shown on the home page countdown, with no
  // Daylight-Saving-related drift for the later-year dates.
  function formatCT(iso){
    const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    const wallClock = new Date(Date.UTC(+m[1], +m[2]-1, +m[3], +m[4], +m[5]));
    const weekday = wallClock.toLocaleDateString('en-US', { weekday:'short', timeZone:'UTC' });
    const month = wallClock.toLocaleDateString('en-US', { month:'short', timeZone:'UTC' });
    const day = +m[3], year = +m[1], hour24 = +m[4], minute = m[5];
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    let hour12 = hour24 % 12; if (hour12 === 0) hour12 = 12;
    return weekday + ', ' + month + ' ' + day + ', ' + year + ', ' + hour12 + ':' + minute + ' ' + ampm + ' CT';
  }
  const items = [LEAGUE_DATES.draft, LEAGUE_DATES.rosterTag, LEAGUE_DATES.contract, LEAGUE_DATES.trade];
  el.innerHTML = items.map(cfg => {
    return '<div class="key-date-row"><span class="kd-name">' + esc(cfg.label) + '</span><span class="kd-when">' + formatCT(cfg.iso) + '</span></div>';
  }).join('');
})();

/* =========================================================================
   LEAGUE HISTORY (history.html)
   ========================================================================= */
(function renderHistorySeasons(){
  const el = document.getElementById('history-seasons');
  if (!el) return;
  let html = '';
  HISTORY.seasons.slice().reverse().forEach(s => {
    html += '<div class="year-block"><h4><span class="yr">' + s.year + '</span> Champion: ' + esc(s.champion) + '</h4>';
    html += '<div class="champ-line">Source: ' + esc(s.source) + '</div>';
    html += '<div class="table-scroll"><table class="narrow"><thead><tr><th class="num">Place</th><th>Owner</th><th>Record</th><th>Note</th></tr></thead><tbody>';
    s.standings.forEach(row => {
      html += '<tr' + (row.place===1?' class="row-champ"':'') + (row.place===10?' class="row-last"':'') + '>' +
        '<td class="num">' + row.place + '</td><td>' + esc(row.owner) + '</td><td class="num">' + esc(row.record) + '</td><td>' + esc(row.note) + '</td></tr>';
    });
    html += '</tbody></table></div></div>';
  });
  el.innerHTML = html;
})();

(function renderChampsByYear(){
  const tbody = document.querySelector('#champs-table tbody');
  if (!tbody) return;
  CHAMPS.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td class="num">' + c.year + '</td><td>' + esc(c.champion) + '</td><td>' + esc(c.runner_up) + '</td><td>' + esc(c.toilet_bowl_winner) + '</td>';
    tbody.appendChild(tr);
  });
})();

(function renderTitles(){
  const el = document.getElementById('titles-list');
  if (!el) return;
  const rows = HISTORY.titles.slice().sort((a,b)=>b.titles-a.titles);
  el.innerHTML = rows.map(t => '<div class="info-card"><h4>' + esc(t.owner) + '</h4><p>' + t.titles + ' title' + (t.titles===1?'':'s') + (t.years.length ? ' (' + t.years.join(', ') + ')' : '') + '</p></div>').join('');
})();

/* =========================================================================
   RECORD BOOK (record.html)
   ========================================================================= */
(function renderLifetime(){
  const tbody = document.querySelector('#lifetime-table tbody');
  if (!tbody) return;
  const rows = LIFETIME.slice().sort((a,b) => b.regular_season.pct - a.regular_season.pct);
  const titleMap = {};
  CHAMPS.forEach(c => { titleMap[c.champion] = (titleMap[c.champion]||0) + 1; });
  rows.forEach((m, i) => {
    const tr = document.createElement('tr');
    if (i===0) tr.className='row-champ';
    if (i===rows.length-1) tr.className='row-last';
    const rs = m.regular_season, po = m.playoff;
    tr.innerHTML =
      '<td class="num">' + (i+1) + '</td>' +
      '<td>' + esc(m.manager) + '</td>' +
      '<td class="num">' + rs.wins + '</td>' +
      '<td class="num">' + rs.losses + '</td>' +
      '<td class="num">' + rs.pct.toFixed(3) + '</td>' +
      '<td class="num">' + fmt(rs.pf) + '</td>' +
      '<td class="num">' + fmt(rs.pa) + '</td>' +
      '<td class="num">' + po.wins + '-' + po.losses + '</td>' +
      '<td class="num">' + (titleMap[m.manager]||0) + '</td>';
    tbody.appendChild(tr);
  });
})();

(function h2hWidget(){
  const select = document.getElementById('h2h-select');
  const panel = document.getElementById('h2h-panel');
  if (!select || !panel) return;

  const managers = LIFETIME.map(m => m.manager).sort();
  select.innerHTML = managers.map(m => '<option value="' + esc(m) + '">' + esc(m) + '</option>').join('');

  function recordsFor(name){
    const out = [];
    H2H.forEach(p => {
      if (p.a === name){
        out.push({opp:p.b, w:p.aw, l:p.bw, pf:p.ap, pa:p.bp});
      } else if (p.b === name){
        out.push({opp:p.a, w:p.bw, l:p.aw, pf:p.bp, pa:p.ap});
      }
    });
    return out;
  }

  function show(name){
    const recs = recordsFor(name).sort((a,b) => (b.w+b.l) - (a.w+a.l));
    let totalW = 0, totalL = 0, totalPF = 0, totalPA = 0;
    recs.forEach(r => { totalW += r.w; totalL += r.l; totalPF += r.pf; totalPA += r.pa; });

    let html = '<div class="h2h-summary">' +
      '<div><div class="h2h-name">' + esc(name) + '</div></div>' +
      '<div><div class="h2h-rec">' + totalW + '-' + totalL + '</div><div class="h2h-rec-lbl">Lifetime H2H Record</div></div>' +
      '<div><div class="h2h-rec">' + fmt(totalPF) + '</div><div class="h2h-rec-lbl">Points For</div></div>' +
      '<div><div class="h2h-rec">' + fmt(totalPA) + '</div><div class="h2h-rec-lbl">Points Against</div></div>' +
      '</div>';

    recs.forEach(r => {
      const g = r.w + r.l;
      const pct = g ? r.w / g : 0;
      const cls = r.w > r.l ? 'winning' : (r.w < r.l ? 'losing' : '');
      html += '<div class="h2h-row ' + cls + '">' +
        '<span class="opp">' + esc(r.opp) + '</span>' +
        '<span class="rec tabular">' + r.w + '-' + r.l + '</span>' +
        '<span class="pts tabular">' + fmt(r.pf) + ' - ' + fmt(r.pa) + '</span>' +
        '<span class="bar"><span class="bar-fill" style="width:' + (pct*100).toFixed(0) + '%"></span></span>' +
        '</div>';
    });
    panel.innerHTML = html;
  }

  select.addEventListener('change', () => show(select.value));

  const initial = managers.includes('Levon') ? 'Levon' : managers[0];
  select.value = initial;
  show(initial);
})();

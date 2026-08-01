#!/usr/bin/env python3
"""
Build lifetime.json from the cached Sleeper API data pulled by pull.py.
Also prints a reconciliation table (computed regular-season W-L vs the
W-L stored in each season's /rosters settings) so mismatches are caught,
not papered over.
"""
import json
import os
from collections import defaultdict

DIR = os.path.dirname(os.path.abspath(__file__))


def load(name):
    path = os.path.join(DIR, name)
    if not os.path.exists(path):
        return None
    with open(path) as f:
        return json.load(f)


CHAIN = load("_chain.json")

# ---- Known canonical name mapping (by display_name), per task spec ----
KNOWN_BY_DISPLAY = {
    "pangdaddy": "BlakeBro",
    "TonyLoff": "Tony Loff",
    "Mloffredo10": "Mikey Loff",
    "DavidBeckham": "David",
    "matthewbuckets": "Mathieu",
    "hannah77808": "Hannah",
    "levonthelight": "Levon",
    "ryanmccusker": "Ryan M",
    "tbusch74": "Tony Busch",
    "MadDawg6969": "Team Barbie",
}

# Additional handles seen only in early seasons that are the *same person*
# as a known-mapped user_id under a later display_name change, discovered
# empirically from users_<lid>.json (same user_id, different display_name
# across seasons):
#   588165481005887488: levonmyers71 (2020-2021) -> levonthelight (2022+) => "Levon"
# These are handled automatically below since we key on user_id, not display_name,
# and only need one season's display_name to hit the KNOWN_BY_DISPLAY table.

# Mac: user_id 587120763782336512, display_name "macf" in 2020/2021/2022.
# Not in the task's known-mapping table (which only covers current-era
# owners), but identified empirically: owned roster slot 6 in 2020, 2021,
# and 2022 (11-3 record in 2022, exactly matching history.json's "Vacated /
# Mac's seat, 11-3" row for that year's 3rd place finisher). Left the league
# after the 2022 season; roster slot 6 was taken over by MadDawg6969/Team
# Barbie starting 2023. Canonical name inferred as "Mac".
MAC_USER_ID = "587120763782336512"

# ---- Build global user_id -> canonical name map by scanning every season's users ----
user_canonical = {}
user_all_display_names = defaultdict(set)
league_meta = []  # list of dicts per season

for lid in CHAIN:
    league = load(f"league_{lid}.json")
    users = load(f"users_{lid}.json") or []
    for u in users:
        uid = u["user_id"]
        dn = u.get("display_name")
        if dn:
            user_all_display_names[uid].add(dn)
        if uid not in user_canonical:
            if dn in KNOWN_BY_DISPLAY:
                user_canonical[uid] = KNOWN_BY_DISPLAY[dn]
            elif uid == MAC_USER_ID:
                user_canonical[uid] = "Mac"

# second pass: catch any user_id whose FIRST-seen display_name wasn't in the
# known table but a LATER season's display_name is (e.g. levonmyers71 -> levonthelight)
for uid, names in user_all_display_names.items():
    if uid in user_canonical:
        continue
    for dn in names:
        if dn in KNOWN_BY_DISPLAY:
            user_canonical[uid] = KNOWN_BY_DISPLAY[dn]
            break

unmapped = []
for uid, names in user_all_display_names.items():
    if uid not in user_canonical:
        # fall back to most recent display_name
        fallback = sorted(names)[-1]
        user_canonical[uid] = fallback
        unmapped.append((uid, names))

print("=== Canonical name map ===")
for uid, name in sorted(user_canonical.items(), key=lambda x: x[1]):
    print(f"  {uid}  ->  {name}   (seen as: {sorted(user_all_display_names.get(uid, []))})")
if unmapped:
    print("\n!!! UNMAPPED (fell back to raw display_name, needs human confirmation):")
    for uid, names in unmapped:
        print(f"  {uid}  names_seen={sorted(names)}")

# ---- Seasons list ----
seasons = []
for lid in CHAIN:
    league = load(f"league_{lid}.json")
    seasons.append({
        "year": int(league["season"]),
        "league_id": lid,
        "name": league.get("name"),
        "playoff_week_start": league.get("settings", {}).get("playoff_week_start"),
        "status": league.get("status"),
    })

print("\n=== Seasons found ===")
for s in seasons:
    print(f"  {s['year']}  {s['league_id']}  playoff_week_start={s['playoff_week_start']}  status={s['status']}")

# ---- Per-season roster owner -> canonical name, and games ----
PLAYABLE_SEASONS = [s for s in seasons if s["status"] == "complete"]
print(f"\nPlayable (complete) seasons: {[s['year'] for s in PLAYABLE_SEASONS]}")
NOT_PLAYABLE = [s for s in seasons if s["status"] != "complete"]
if NOT_PLAYABLE:
    print(f"Excluded from stats (not complete): {[(s['year'], s['status']) for s in NOT_PLAYABLE]}")

season_data = {}  # year -> dict with rosters, roster_owner map, games list

for s in PLAYABLE_SEASONS:
    lid = s["league_id"]
    year = s["year"]
    pws = s["playoff_week_start"]
    rosters = load(f"rosters_{lid}.json") or []
    roster_owner = {r["roster_id"]: r["owner_id"] for r in rosters}
    roster_settings = {r["roster_id"]: r.get("settings", {}) for r in rosters}

    games = []  # list of dicts: week, roster_a, roster_b, pts_a, pts_b, playoff(bool)
    for wk in range(1, 19):
        mu = load(f"matchups_{lid}_wk{wk}.json")
        if not mu:
            continue
        by_matchup = defaultdict(list)
        for entry in mu:
            mid = entry.get("matchup_id")
            if mid is None:
                continue
            pts = entry.get("points")
            by_matchup[mid].append((entry["roster_id"], pts))
        for mid, entries in by_matchup.items():
            if len(entries) != 2:
                print(f"  !! WARNING: season {year} week {wk} matchup_id {mid} has {len(entries)} entries (expected 2): {entries}")
                continue
            (ra, pa), (rb, pb) = entries
            if pa is None and pb is None:
                continue
            pa = pa or 0.0
            pb = pb or 0.0
            is_playoff = wk >= pws
            games.append({
                "week": wk, "roster_a": ra, "roster_b": rb,
                "pts_a": pa, "pts_b": pb, "playoff": is_playoff,
            })

    winners_bracket = load(f"winners_bracket_{lid}.json") or []
    losers_bracket = load(f"losers_bracket_{lid}.json") or []

    season_data[year] = {
        "lid": lid, "pws": pws, "roster_owner": roster_owner,
        "roster_settings": roster_settings, "games": games,
        "winners_bracket": winners_bracket, "losers_bracket": losers_bracket,
    }

# ---- Reconciliation: computed regular-season W-L-T vs roster settings ----
print("\n=== RECONCILIATION: computed regular-season record vs roster settings ===")
recon_rows = []
recon_all_match = True
for year, sd in season_data.items():
    computed = defaultdict(lambda: {"w": 0, "l": 0, "t": 0, "pf": 0.0, "pa": 0.0})
    for g in sd["games"]:
        if g["playoff"]:
            continue
        ra, rb, pa, pb = g["roster_a"], g["roster_b"], g["pts_a"], g["pts_b"]
        computed[ra]["pf"] += pa
        computed[ra]["pa"] += pb
        computed[rb]["pf"] += pb
        computed[rb]["pa"] += pa
        if pa > pb:
            computed[ra]["w"] += 1
            computed[rb]["l"] += 1
        elif pb > pa:
            computed[rb]["w"] += 1
            computed[ra]["l"] += 1
        else:
            computed[ra]["t"] += 1
            computed[rb]["t"] += 1

    for rid, owner_id in sd["roster_owner"].items():
        name = user_canonical.get(owner_id, owner_id)
        rs = sd["roster_settings"].get(rid, {})
        exp_w, exp_l, exp_t = rs.get("wins", 0), rs.get("losses", 0), rs.get("ties", 0)
        comp = computed[rid]
        match = (comp["w"] == exp_w and comp["l"] == exp_l and comp["t"] == exp_t)
        recon_all_match = recon_all_match and match
        recon_rows.append({
            "year": year, "manager": name, "roster_id": rid,
            "computed": f"{comp['w']}-{comp['l']}-{comp['t']}",
            "roster_settings": f"{exp_w}-{exp_l}-{exp_t}",
            "match": match,
        })

for row in sorted(recon_rows, key=lambda r: (r["year"], not r["match"])):
    flag = "OK" if row["match"] else "MISMATCH"
    print(f"  {row['year']}  {row['manager']:15s}  computed={row['computed']:8s}  roster_settings={row['roster_settings']:8s}  [{flag}]")

print(f"\nALL SEASONS RECONCILE: {recon_all_match}")

with open(os.path.join(DIR, "_reconciliation.json"), "w") as f:
    json.dump({"all_match": recon_all_match, "rows": recon_rows}, f, indent=1)

# ==================== Build lifetime.json ====================

# managers list: every user_id that was ever a PRIMARY roster owner in a playable season
manager_seasons = defaultdict(set)
for year, sd in season_data.items():
    for rid, owner_id in sd["roster_owner"].items():
        manager_seasons[owner_id].add(year)

managers_out = []
for uid, yrs in manager_seasons.items():
    managers_out.append({
        "user_id": uid,
        "display_name": sorted(user_all_display_names.get(uid, [""]))[-1],
        "known_as": user_canonical.get(uid, uid),
        "seasons_played": sorted(yrs),
    })
managers_out.sort(key=lambda m: m["known_as"])

# lifetime aggregation
lifetime_acc = defaultdict(lambda: {
    "regular_wins": 0, "regular_losses": 0, "regular_ties": 0,
    "regular_pf": 0.0, "regular_pa": 0.0,
    "playoff_wins": 0, "playoff_losses": 0,
    "season_records": [],  # (year, w, l, t, pf)
    "weeks": [],  # (year, week, points)
})

for year, sd in season_data.items():
    per_roster_season = defaultdict(lambda: {"w": 0, "l": 0, "t": 0, "pf": 0.0})
    for g in sd["games"]:
        ra, rb, pa, pb = g["roster_a"], g["roster_b"], g["pts_a"], g["pts_b"]
        name_a = user_canonical.get(sd["roster_owner"][ra], ra)
        name_b = user_canonical.get(sd["roster_owner"][rb], rb)

        lifetime_acc[name_a]["weeks"].append((year, g["week"], pa))
        lifetime_acc[name_b]["weeks"].append((year, g["week"], pb))

        if g["playoff"]:
            if pa > pb:
                lifetime_acc[name_a]["playoff_wins"] += 1
                lifetime_acc[name_b]["playoff_losses"] += 1
            elif pb > pa:
                lifetime_acc[name_b]["playoff_wins"] += 1
                lifetime_acc[name_a]["playoff_losses"] += 1
            # ties in playoffs: none expected, not counted separately
        else:
            lifetime_acc[name_a]["regular_pf"] += pa
            lifetime_acc[name_a]["regular_pa"] += pb
            lifetime_acc[name_b]["regular_pf"] += pb
            lifetime_acc[name_b]["regular_pa"] += pa
            per_roster_season[ra]["pf"] += pa
            per_roster_season[rb]["pf"] += pb
            if pa > pb:
                lifetime_acc[name_a]["regular_wins"] += 1
                lifetime_acc[name_b]["regular_losses"] += 1
                per_roster_season[ra]["w"] += 1
                per_roster_season[rb]["l"] += 1
            elif pb > pa:
                lifetime_acc[name_b]["regular_wins"] += 1
                lifetime_acc[name_a]["regular_losses"] += 1
                per_roster_season[rb]["w"] += 1
                per_roster_season[ra]["l"] += 1
            else:
                lifetime_acc[name_a]["regular_ties"] += 1
                lifetime_acc[name_b]["regular_ties"] += 1
                per_roster_season[ra]["t"] += 1
                per_roster_season[rb]["t"] += 1

    for rid, owner_id in sd["roster_owner"].items():
        name = user_canonical.get(owner_id, owner_id)
        rec = per_roster_season[rid]
        lifetime_acc[name]["season_records"].append(
            (year, rec["w"], rec["l"], rec["t"], round(rec["pf"], 2))
        )

lifetime_out = []
for name, acc in lifetime_acc.items():
    w, l, t = acc["regular_wins"], acc["regular_losses"], acc["regular_ties"]
    total = w + l + t
    pct = round((w + 0.5 * t) / total, 4) if total else 0.0

    best = max(acc["season_records"], key=lambda r: (r[1] - r[2], r[4])) if acc["season_records"] else None
    worst = min(acc["season_records"], key=lambda r: (r[1] - r[2], r[4])) if acc["season_records"] else None

    weeks = acc["weeks"]
    hi = max(weeks, key=lambda x: x[2]) if weeks else None
    lo = min(weeks, key=lambda x: x[2]) if weeks else None

    lifetime_out.append({
        "manager": name,
        "regular_season": {
            "wins": w, "losses": l, "ties": t, "pct": pct,
            "pf": round(acc["regular_pf"], 2), "pa": round(acc["regular_pa"], 2),
        },
        "playoff": {"wins": acc["playoff_wins"], "losses": acc["playoff_losses"]},
        "best_season": {"year": best[0], "record": f"{best[1]}-{best[2]}" + (f"-{best[3]}" if best[3] else ""), "pf": best[4]} if best else None,
        "worst_season": {"year": worst[0], "record": f"{worst[1]}-{worst[2]}" + (f"-{worst[3]}" if worst[3] else ""), "pf": worst[4]} if worst else None,
        "highest_week": {"year": hi[0], "week": hi[1], "points": round(hi[2], 2)} if hi else None,
        "lowest_week": {"year": lo[0], "week": lo[1], "points": round(lo[2], 2)} if lo else None,
    })

lifetime_out.sort(key=lambda x: x["regular_season"]["pct"], reverse=True)

# head-to-head
h2h_acc = defaultdict(lambda: {"a_wins": 0, "b_wins": 0, "ties": 0, "a_points": 0.0, "b_points": 0.0, "games": []})

def pair_key(n1, n2):
    return tuple(sorted([n1, n2]))

for year, sd in season_data.items():
    for g in sd["games"]:
        ra, rb, pa, pb = g["roster_a"], g["roster_b"], g["pts_a"], g["pts_b"]
        name_a = user_canonical.get(sd["roster_owner"][ra], ra)
        name_b = user_canonical.get(sd["roster_owner"][rb], rb)
        key = pair_key(name_a, name_b)
        rec = h2h_acc[key]
        # normalize so 'a' in rec corresponds to key[0]
        if name_a == key[0]:
            fa, fb, sa, sb = name_a, name_b, pa, pb
        else:
            fa, fb, sa, sb = name_b, name_a, pb, pa
        rec["a_points"] += sa
        rec["b_points"] += sb
        if sa > sb:
            rec["a_wins"] += 1
        elif sb > sa:
            rec["b_wins"] += 1
        else:
            rec["ties"] += 1
        rec["games"].append({
            "year": year, "week": g["week"], "a_score": round(sa, 2), "b_score": round(sb, 2),
            "playoff": g["playoff"],
        })

h2h_out = []
for (n1, n2), rec in h2h_acc.items():
    h2h_out.append({
        "a": n1, "b": n2,
        "a_wins": rec["a_wins"], "b_wins": rec["b_wins"], "ties": rec["ties"],
        "a_points": round(rec["a_points"], 2), "b_points": round(rec["b_points"], 2),
        "games": sorted(rec["games"], key=lambda g: (g["year"], g["week"])),
    })
h2h_out.sort(key=lambda x: (x["a"], x["b"]))

# season summaries: standings, champion, runner_up, toilet_bowl_winner
season_summaries = []
for year, sd in season_data.items():
    per_roster = defaultdict(lambda: {"w": 0, "l": 0, "t": 0, "pf": 0.0, "pa": 0.0})
    for g in sd["games"]:
        if g["playoff"]:
            continue
        ra, rb, pa, pb = g["roster_a"], g["roster_b"], g["pts_a"], g["pts_b"]
        per_roster[ra]["pf"] += pa
        per_roster[ra]["pa"] += pb
        per_roster[rb]["pf"] += pb
        per_roster[rb]["pa"] += pa
        if pa > pb:
            per_roster[ra]["w"] += 1
            per_roster[rb]["l"] += 1
        elif pb > pa:
            per_roster[rb]["w"] += 1
            per_roster[ra]["l"] += 1
        else:
            per_roster[ra]["t"] += 1
            per_roster[rb]["t"] += 1

    standings = []
    for rid, owner_id in sd["roster_owner"].items():
        name = user_canonical.get(owner_id, owner_id)
        rec = per_roster[rid]
        standings.append({
            "manager": name, "wins": rec["w"], "losses": rec["l"],
            "pf": round(rec["pf"], 2), "pa": round(rec["pa"], 2),
        })
    standings.sort(key=lambda s: (-s["wins"], -s["pf"]))

    champion = None
    runner_up = None
    toilet_bowl_winner = None
    wb = sd["winners_bracket"]
    lb = sd["losers_bracket"]
    final = next((m for m in wb if m.get("p") == 1), None)
    if final:
        champ_rid = final["w"]
        loser_rid = final["t1"] if final["t1"] != champ_rid else final["t2"]
        champion = user_canonical.get(sd["roster_owner"].get(champ_rid), champ_rid)
        runner_up = user_canonical.get(sd["roster_owner"].get(loser_rid), loser_rid)
    tb_final = next((m for m in lb if m.get("p") == 1), None)
    if tb_final:
        tb_rid = tb_final["w"]
        toilet_bowl_winner = user_canonical.get(sd["roster_owner"].get(tb_rid), tb_rid)

    season_summaries.append({
        "year": year, "standings": standings,
        "champion": champion, "runner_up": runner_up,
        "toilet_bowl_winner": toilet_bowl_winner,
    })
season_summaries.sort(key=lambda s: s["year"])

lifetime_json = {
    "seasons": [{"year": s["year"], "league_id": s["league_id"], "name": s["name"], "playoff_week_start": s["playoff_week_start"]} for s in seasons],
    "managers": managers_out,
    "lifetime": lifetime_out,
    "head_to_head": h2h_out,
    "season_summaries": season_summaries,
}

with open(os.path.join(DIR, "lifetime.json"), "w") as f:
    json.dump(lifetime_json, f, indent=1)

print("\nWrote lifetime.json")
print(f"managers: {len(managers_out)}")
print(f"lifetime entries: {len(lifetime_out)}")
print(f"h2h pairs: {len(h2h_out)}")
print(f"season summaries: {len(season_summaries)}")

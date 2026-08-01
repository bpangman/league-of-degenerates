#!/usr/bin/env python3
"""
Pull complete history of a Sleeper fantasy football league via the public
read-only API. Caches every raw response to disk so nothing needs re-fetching.
"""
import json
import os
import sys
import time
import urllib.request
import urllib.error

BASE = "https://api.sleeper.app/v1"
OUTDIR = os.path.dirname(os.path.abspath(__file__))
START_LEAGUE_ID = "1180328979696623616"
COMMISH_USER_ID = "585627790750040064"

SLEEP = 0.1


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "dffl-history-pull/1.0"})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = resp.read()
                time.sleep(SLEEP)
                if not data:
                    return None
                return json.loads(data)
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None
            print(f"  HTTP error {e.code} on {url}, attempt {attempt+1}", file=sys.stderr)
            time.sleep(1 + attempt)
        except Exception as e:
            print(f"  Error {e} on {url}, attempt {attempt+1}", file=sys.stderr)
            time.sleep(1 + attempt)
    print(f"  FAILED after retries: {url}", file=sys.stderr)
    return None


def cache_path(name):
    return os.path.join(OUTDIR, name)


def load_or_fetch(name, url, force=False):
    path = cache_path(name)
    if not force and os.path.exists(path):
        with open(path) as f:
            return json.load(f)
    data = fetch(url)
    with open(path, "w") as f:
        json.dump(data, f, indent=1)
    print(f"  fetched -> {name}")
    return data


def main():
    # 1. players_nfl.json - fetch once ever
    players_path = cache_path("players_nfl.json")
    if os.path.exists(players_path):
        print("players_nfl.json already cached, skipping fetch")
    else:
        print("Fetching players_nfl.json (large, ~5MB)...")
        data = fetch(f"{BASE}/players/nfl")
        with open(players_path, "w") as f:
            json.dump(data, f)
        print("  done")

    # 2. Walk league chain backwards from START_LEAGUE_ID
    chain = []  # list of league_id in chronological order (oldest first)
    seen = set()
    cur = START_LEAGUE_ID
    forward_ids = []  # collect in reverse-walk order first (newest first)
    while cur and cur not in seen:
        seen.add(cur)
        forward_ids.append(cur)
        league = load_or_fetch(f"league_{cur}.json", f"{BASE}/league/{cur}")
        if league is None:
            print(f"  league {cur} returned null, stopping walk")
            break
        prev = league.get("previous_league_id")
        cur = prev if prev else None

    # 3. Check for 2026 league via user leagues endpoint
    leagues_2026 = load_or_fetch(
        f"user_leagues_{COMMISH_USER_ID}_2026.json",
        f"{BASE}/user/{COMMISH_USER_ID}/leagues/nfl/2026",
    )
    league_2026_id = None
    if leagues_2026:
        # find the one whose chain connects to our START_LEAGUE_ID (match by name or previous_league_id)
        for lg in leagues_2026:
            if lg.get("previous_league_id") == START_LEAGUE_ID or lg.get("league_id") == START_LEAGUE_ID:
                league_2026_id = lg["league_id"]
        # fallback: if only one league returned for 2026, use it
        if league_2026_id is None and len(leagues_2026) == 1:
            league_2026_id = leagues_2026[0]["league_id"]
        print(f"2026 leagues found: {[l.get('league_id') for l in leagues_2026]}")
        if league_2026_id:
            print(f"  -> using {league_2026_id} as 2026 league")
            if league_2026_id not in seen:
                seen.add(league_2026_id)
                forward_ids.insert(0, league_2026_id)
                load_or_fetch(f"league_{league_2026_id}.json", f"{BASE}/league/{league_2026_id}")
    else:
        print("No 2026 leagues found for this user yet.")

    # forward_ids currently newest-first (2026 if present, then 2025 down to oldest)
    chain = list(reversed(forward_ids))  # oldest first
    print(f"\nFull league chain (oldest->newest): {chain}\n")

    with open(cache_path("_chain.json"), "w") as f:
        json.dump(chain, f, indent=1)

    # 4. For each league in chain, fetch users, rosters, drafts, matchups, brackets, transactions
    for lid in chain:
        league = load_or_fetch(f"league_{lid}.json", f"{BASE}/league/{lid}")
        season = league.get("season") if league else "?"
        print(f"=== League {lid} (season {season}) ===")

        load_or_fetch(f"users_{lid}.json", f"{BASE}/league/{lid}/users")
        load_or_fetch(f"rosters_{lid}.json", f"{BASE}/league/{lid}/rosters")

        drafts = load_or_fetch(f"drafts_{lid}.json", f"{BASE}/league/{lid}/drafts")
        if drafts:
            for d in drafts:
                did = d.get("draft_id")
                if did:
                    load_or_fetch(f"draft_picks_{did}.json", f"{BASE}/draft/{did}/picks")

        load_or_fetch(f"winners_bracket_{lid}.json", f"{BASE}/league/{lid}/winners_bracket")
        load_or_fetch(f"losers_bracket_{lid}.json", f"{BASE}/league/{lid}/losers_bracket")

        # matchups weeks 1-18, stop gracefully but still probe all (cheap + cached)
        empty_streak = 0
        for wk in range(1, 19):
            fname = f"matchups_{lid}_wk{wk}.json"
            path = cache_path(fname)
            if os.path.exists(path):
                with open(path) as f:
                    mu = json.load(f)
            else:
                mu = load_or_fetch(fname, f"{BASE}/league/{lid}/matchups/{wk}")
            if not mu:
                empty_streak += 1
            else:
                empty_streak = 0
            if empty_streak >= 3:
                # likely past the end of the season data; still try remaining weeks
                # cheaply since already cheap, but let's not spam forever
                pass

        # transactions weeks 1-18
        for wk in range(1, 19):
            fname = f"transactions_{lid}_wk{wk}.json"
            path = cache_path(fname)
            if os.path.exists(path):
                continue
            load_or_fetch(fname, f"{BASE}/league/{lid}/transactions/{wk}")

    print("\nDone pulling all data.")


if __name__ == "__main__":
    main()

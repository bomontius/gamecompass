"""Local Steam metadata updater for Oyun Pusulasi.

It uses public Steam Store endpoints only. It never reads the Steam client,
profile cookies, credentials, or changing playtime data.
"""

from __future__ import annotations

import datetime as dt
import html
import json
import re
import sys
import time
import unicodedata
import urllib.parse
import urllib.request
from pathlib import Path


USER_AGENT = "OyunPusulasi/0.1 (local desktop app)"
REQUEST_TIMEOUT = 18

DISCOVERY_QUERIES = [
    ("colony sim", "strong", ["koloni", "basebuilding", "sandbox"], "Koloni ve üs kurma araması"),
    ("base building survival", "strong", ["basebuilding", "hayatta kalma", "üretim"], "Üs kurma ve sistem yönetimi araması"),
    ("city builder", "strong", ["şehir kurma", "ekonomi", "yerleşim"], "Şehir kurma ve yerleşim araması"),
    ("historical strategy", "strong", ["grand strategy", "tarihsel", "diplomasi"], "Tarihsel strateji araması"),
    ("grand strategy", "strong", ["grand strategy", "diplomasi", "sandbox"], "Grand strategy araması"),
    ("tycoon management", "strong", ["tycoon", "yönetim", "işletme"], "Tycoon ve yönetim araması"),
    ("factory logistics", "strong", ["üretim", "lojistik", "ekonomi"], "Üretim ve lojistik araması"),
    ("tactical military shooter", "strong", ["gerçekçi shooter", "taktik", "takım"], "Gerçekçi ve taktik shooter araması"),
    ("football manager", "strong", ["menajerlik", "spor simülasyonu", "yönetim"], "Menajerlik araması"),
]

DISCOVERY_SKIP_WORDS = (
    "dlc", "soundtrack", "ost", "bundle", "pack", "demo", "prologue", "playtest", "test server",
    "wallpaper", "tool", "editor", "content", "upgrade", "cosmetic", "season pass", "artbook",
)
DISCOVERY_NEGATIVE_WORDS = (
    "magic", "magical", "hero shooter", "anime", "gacha", "idle clicker", "dating sim", "visual novel",
    "card battler", "match 3", "slot", "pinball", "music", "soundtrack", "dlc",
)
DISCOVERY_POSITIVE_WORDS = (
    "colony", "colonist", "settlement", "village", "town", "city builder", "base building", "survival",
    "factory", "automation", "logistics", "management", "tycoon", "grand strategy", "strategy", "historical",
    "tactical", "military", "realistic", "simulator", "football", "soccer", "manager", "office", "production",
    "economy", "trade", "diplomacy", "medieval", "ancient", "world war", "war", "combat",
)


def now_iso() -> str:
    return dt.datetime.now().astimezone().isoformat(timespec="seconds")


def read_json(path: Path, default):
    if not path.exists():
        return default
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return default


def write_json(path: Path, value) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding="utf-8")
    temporary.replace(path)


def clean_text(value: str | None) -> str:
    if not value:
        return ""
    value = html.unescape(re.sub(r"<[^>]+>", " ", str(value)))
    replacements = {
        "Ã¢â‚¬â„¢": "’",
        "Ã¢â‚¬â„œ": "“",
        "Ã¢â‚¬Â": "”",
        "Ã¢â‚¬â€œ": "–",
        "Ã¢â‚¬â€": "—",
        "Ã¢â€žÂ¢": "™",
        "â„¢": "™",
        "Ã‚Â®": "®",
        "Â®": "®",
        "Ã©": "é",
        "Ã¶": "ö",
        "Ã¼": "ü",
        "Ä±": "ı",
        "ÅŸ": "ş",
        "ÄŸ": "ğ",
        "Ä°": "İ",
    }
    for before, after in replacements.items():
        value = value.replace(before, after)
    return re.sub(r"\s+", " ", value).strip()


def normalized(value: str) -> str:
    value = clean_text(value).casefold()
    value = value.replace("™", "").replace("®", "")
    value = unicodedata.normalize("NFKD", value)
    value = "".join(char for char in value if not unicodedata.combining(char))
    return re.sub(r"[^a-z0-9]+", "", value)


def fetch_json(url: str):
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=REQUEST_TIMEOUT) as response:
        return json.loads(response.read().decode("utf-8"))


def resolve_steam_id(profile_ref: str, api_key: str) -> str:
    value = str(profile_ref or "").strip()
    numeric = re.search(r"(?:^|/)(7\d{16})(?:/|$)", value)
    if numeric:
        return numeric.group(1)
    vanity = re.search(r"steamcommunity\.com/id/([^/?#]+)", value, re.IGNORECASE)
    if not vanity and re.fullmatch(r"[A-Za-z0-9_-]+", value):
        vanity = re.fullmatch(r"[A-Za-z0-9_-]+", value)
    if not vanity:
        raise ValueError("Steam profil bağlantısı veya SteamID64 tanınamadı.")
    query = urllib.parse.urlencode({"key": api_key, "vanityurl": vanity.group(1), "format": "json"})
    payload = fetch_json(f"https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?{query}")
    resolved = str(payload.get("response", {}).get("steamid", ""))
    if not resolved:
        raise ValueError("Steam profil adı çözülemedi. Profil bağlantısını veya SteamID64 değerini kontrol et.")
    return resolved


def fetch_owned_games(api_key: str, profile_ref: str, include_free_games: bool = True) -> dict:
    key = str(api_key or "").strip()
    if len(key) < 20:
        raise ValueError("Steam Web API anahtarı eksik veya geçersiz görünüyor.")
    steam_id = resolve_steam_id(profile_ref, key)
    query = urllib.parse.urlencode({
        "key": key,
        "steamid": steam_id,
        "include_appinfo": 1,
        "include_played_free_games": 1 if include_free_games else 0,
        "format": "json",
    })
    payload = fetch_json(f"https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?{query}")
    response = payload.get("response") or {}
    if "games" not in response:
        raise ValueError("Steam oyun ayrıntılarını döndürmedi. API anahtarını veya profil gizliliğindeki Oyun ayrıntıları ayarını kontrol et.")
    games = []
    for item in response.get("games", []):
        app_id = int(item.get("appid") or 0)
        if not app_id:
            continue
        icon = item.get("img_icon_url", "")
        games.append({
            "steamAppId": app_id,
            "name": clean_text(item.get("name")) or f"Steam oyunu {app_id}",
            "playtimeHours": round(float(item.get("playtime_forever") or 0) / 60, 1),
            "playtimeRecentHours": round(float(item.get("playtime_2weeks") or 0) / 60, 1),
            "owned": True,
            "headerImage": f"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/{app_id}/header.jpg",
            "capsuleImage": f"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/{app_id}/capsule_231x87.jpg",
            "iconImage": f"https://media.steampowered.com/steamcommunity/public/images/apps/{app_id}/{icon}.jpg" if icon else "",
            "steamUrl": f"https://store.steampowered.com/app/{app_id}/",
        })
    return {"steamId": steam_id, "games": games, "gameCount": int(response.get("game_count") or len(games))}


def resolve_app_id(title: str) -> int | None:
    query = urllib.parse.urlencode({"term": title, "l": "english", "cc": "us"})
    try:
        payload = fetch_json(f"https://store.steampowered.com/api/storesearch/?{query}")
    except Exception:
        return None
    target = normalized(title)
    for item in payload.get("items", []):
        if normalized(item.get("name", "")) == target:
            return int(item["id"])
    items = payload.get("items", [])
    return int(items[0]["id"]) if items else None


def fetch_details(app_id: int) -> dict:
    details_url = f"https://store.steampowered.com/api/appdetails?appids={app_id}&l=english&cc=us"
    review_url = f"https://store.steampowered.com/appreviews/{app_id}?json=1&language=all&purchase_type=all"
    details_payload = fetch_json(details_url)
    entry = details_payload.get(str(app_id), {})
    data = entry.get("data", {}) if entry.get("success") else {}
    reviews = {}
    try:
        reviews = fetch_json(review_url).get("query_summary", {})
    except Exception:
        reviews = {}

    total = int(reviews.get("total_reviews") or data.get("recommendations", {}).get("total") or 0)
    positive = int(reviews.get("total_positive") or 0)
    negative = int(reviews.get("total_negative") or 0)
    review_percent = round(positive * 100 / (positive + negative)) if positive + negative else None
    genres = [item.get("description") for item in data.get("genres", []) if item.get("description")]
    categories = [item.get("description") for item in data.get("categories", []) if item.get("description")]
    release_date = clean_text(data.get("release_date", {}).get("date"))
    screenshots = [{
        "thumbnail": item.get("path_thumbnail", ""),
        "full": item.get("path_full", ""),
    } for item in data.get("screenshots", []) if item.get("path_thumbnail") or item.get("path_full")][:8]
    movies = [{
        "name": clean_text(item.get("name")),
        "thumbnail": item.get("thumbnail", ""),
        "mp4": item.get("mp4", {}),
        "webm": item.get("webm", {}),
    } for item in data.get("movies", []) if item.get("mp4") or item.get("webm")][:3]
    return {
        "steamAppId": app_id,
        "name": clean_text(data.get("name")),
        "type": data.get("type", ""),
        "releaseDate": release_date or "Tarih bilgisi yok",
        "releaseDateIso": parse_release_date(release_date),
        "shortDescription": clean_text(data.get("short_description")),
        "headerImage": data.get("header_image") or data.get("capsule_image") or "",
        "capsuleImage": data.get("capsule_image") or "",
        "steamUrl": f"https://store.steampowered.com/app/{app_id}/",
        "reviewCount": total,
        "reviewPercent": review_percent,
        "genres": genres,
        "categories": categories,
        "screenshots": screenshots,
        "movies": movies,
    }


def parse_release_date(value: str) -> str | None:
    if not value:
        return None
    for pattern in ("%b %d, %Y", "%d %b, %Y", "%b %Y", "%Y"):
        try:
            return dt.datetime.strptime(value, pattern).date().isoformat()
        except ValueError:
            continue
    return None


def clean_library(raw_library: list[dict]) -> list[dict]:
    result = []
    for item in raw_library:
        result.append({
            "name": clean_text(item.get("name")),
            "playtimeHours": float(item.get("playtimeHours") or 0),
            "owned": True,
        })
    return result


def find_owned(candidate: dict, library: list[dict]) -> dict | None:
    aliases = [candidate.get("title", ""), *candidate.get("ownedAliases", [])]
    wanted = {normalized(alias) for alias in aliases if alias}
    for item in library:
        if normalized(item["name"]) in wanted:
            return item
    return None


def is_recent(release_iso: str | None, days: int = 60) -> bool:
    if not release_iso:
        return False
    try:
        release = dt.date.fromisoformat(release_iso)
    except ValueError:
        return False
    return (dt.date.today() - release).days <= days


def fallback_details(candidate: dict, app_id: int | None) -> dict:
    return {
        "steamAppId": app_id,
        "name": candidate["title"],
        "type": "game",
        "releaseDate": "Künye güncellemesi bekliyor",
        "releaseDateIso": None,
        "shortDescription": "Steam mağaza künyesi ilk uygun güncellemede alınacak.",
        "headerImage": "",
        "capsuleImage": "",
        "steamUrl": f"https://store.steampowered.com/search/?term={urllib.parse.quote(candidate['title'])}",
        "reviewCount": 0,
        "reviewPercent": None,
        "genres": [],
        "categories": [],
        "screenshots": [],
        "movies": [],
    }


def search_store(query: str, count: int = 30, filter_value: str | None = None, sort_by: str = "Released_DESC") -> list[dict]:
    params = urllib.parse.urlencode({
        "term": query,
        "start": 0,
        "count": count,
        "sort_by": sort_by,
        "infinite": 1,
    })
    if filter_value:
        params += "&" + urllib.parse.urlencode({"filter": filter_value})
    payload = fetch_json(f"https://store.steampowered.com/search/?{params}")
    html_body = payload.get("results_html", "")
    row_pattern = re.compile(
        r'<a[^>]+data-ds-appid="(?P<app_id>\d+)"[^>]*>.*?'
        r'<span class="title">(?P<title>.*?)</span>.*?'
        r'<div class="search_released[^>]*>\s*(?P<release>[^<]+?)\s*</div>',
        re.S,
    )
    results = []
    for match in row_pattern.finditer(html_body):
        title = clean_text(match.group("title"))
        if not title or any(word in title.casefold() for word in DISCOVERY_SKIP_WORDS):
            continue
        results.append({
            "steamAppId": int(match.group("app_id")),
            "title": title,
            "releaseDate": clean_text(match.group("release")),
            "releaseDateIso": parse_search_release_date(match.group("release")),
        })
    return results


def store_search(query: str, count: int = 12) -> list[dict]:
    params = urllib.parse.urlencode({"term": query, "l": "english", "cc": "us", "count": count})
    payload = fetch_json(f"https://store.steampowered.com/api/storesearch/?{params}")
    results = []
    for item in payload.get("items", []):
        if item.get("type") != "app" or not item.get("id") or not item.get("name"):
            continue
        results.append({
            "steamAppId": int(item["id"]),
            "title": clean_text(item.get("name")),
            "capsuleImage": item.get("tiny_image", ""),
            "releaseDate": "",
        })
    return results[:count]


SUBGENRE_LABELS = {
    "koloni": "Colony Sim",
    "basebuilding": "Base Building",
    "şehir kurma": "City Builder",
    "tarihsel": "Historical",
    "grand strategy": "Grand Strategy",
    "gerçekçi shooter": "Tactical Shooter",
    "taktik": "Tactical",
    "yönetim": "Management Sim",
    "tycoon": "Tycoon",
    "lojistik": "Logistics",
    "üretim": "Production",
    "menajerlik": "Football Manager",
    "ofis yönetimi": "Office Management",
    "roguelite": "Roguelike",
    "sandbox": "Sandbox",
    "hayatta kalma": "Survival",
    "uzay": "Space Sim",
    "ekonomi": "Economy",
    "diplomasi": "Diplomacy",
    "savaş": "War Strategy",
    "operasyon": "Military Operations",
    "simülasyon": "Simulation",
}


def classify_game(candidate: dict, details: dict) -> dict:
    tags = [str(tag) for tag in candidate.get("tags", [])]
    genres = [str(genre) for genre in details.get("genres", [])]
    haystack = " ".join([candidate.get("title", ""), details.get("name", ""), details.get("shortDescription", ""), *tags, *genres]).casefold()
    categories: set[str] = set()
    subgenres: set[str] = set()

    def has(*words: str) -> bool:
        return any(word.casefold() in haystack for word in words)

    if has("action", "shooter", "tactical shooter", "combat", "savaş"):
        categories.add("Action")
    if has("shooter", "fps", "first-person", "gerçekçi shooter", "tactical shooter"):
        categories.add("FPS")
    if has("rpg", "role-playing", "rol yapma"):
        categories.add("RPG")
    if has("mmorpg", "massively multiplayer"):
        categories.add("MMORPG")
    if has("strategy", "grand strategy", "city builder", "şehir kurma", "tarihsel", "diplomasi"):
        categories.add("Strategy")
    if has("simulation", "simulator", "simülasyon", "management", "yönetim", "tycoon"):
        categories.add("Simulation")
    if has("management", "yönetim", "tycoon", "menajerlik", "office"):
        categories.add("Management")
    if has("sports", "football", "soccer", "spor"):
        categories.add("Sports")
    if has("adventure", "macera"):
        categories.add("Adventure")
    if has("survival", "hayatta kalma"):
        categories.add("Survival")
    if has("racing", "yarış"):
        categories.add("Racing")
    if has("puzzle", "bulmaca"):
        categories.add("Puzzle")

    for tag in tags:
        label = SUBGENRE_LABELS.get(tag.casefold())
        if label:
            subgenres.add(label)
    if has("roguelike", "roguelite"):
        subgenres.add("Roguelike")
    if has("first-person shooter", "fps", "shooter"):
        subgenres.add("Shooter")
    if has("grand strategy"):
        subgenres.add("Grand Strategy")
    if has("historical", "tarihsel", "orta çağ", "medieval", "ancient"):
        subgenres.add("Historical")
    if has("base building", "basebuilding", "üs kurma"):
        subgenres.add("Base Building")
    if has("city builder", "şehir kurma"):
        subgenres.add("City Builder")
    if has("management", "yönetim", "simulator", "simulation"):
        subgenres.add("Simulation")

    if not categories:
        categories.add("Other")
    if not subgenres:
        subgenres.add("General")
    return {"generalCategories": sorted(categories), "subgenres": sorted(subgenres)}


def parse_search_release_date(value: str) -> str | None:
    value = clean_text(value)
    for pattern in ("%d %b, %Y", "%b %d, %Y", "%d %b %Y", "%b %Y"):
        try:
            return dt.datetime.strptime(value, pattern).date().isoformat()
        except ValueError:
            continue
    return None


def discovery_score(details: dict) -> tuple[int, int]:
    haystack = " ".join([
        details.get("name", ""), details.get("shortDescription", ""),
        " ".join(details.get("genres", [])), " ".join(details.get("categories", [])),
    ]).casefold()
    positive = sum(1 for word in DISCOVERY_POSITIVE_WORDS if word in haystack)
    negative = sum(1 for word in DISCOVERY_NEGATIVE_WORDS if word in haystack)
    return positive, negative


def is_recent_date(release_iso: str | None, days: int = 120) -> bool:
    if not release_iso:
        return False
    try:
        release = dt.date.fromisoformat(release_iso)
    except ValueError:
        return False
    return 0 <= (dt.date.today() - release).days <= days


def discover_new_games(previous_by_key: dict, known_ids: set[int], run_at: str, errors: list[str], mark_new_on_list: bool) -> list[dict]:
    found: dict[int, dict] = {}
    for query, lane, tags, query_reason in DISCOVERY_QUERIES:
        try:
            results = search_store(query)
        except Exception as error:
            errors.append(f"Yeni oyun araması ({query}): {error}")
            continue
        for result in results:
            app_id = result["steamAppId"]
            if app_id in known_ids or app_id in found or not is_recent_date(result.get("releaseDateIso")):
                continue
            found[app_id] = {**result, "profileLane": lane, "tags": tags, "queryReason": query_reason}

    games = []
    for app_id, result in list(found.items())[:28]:
        try:
            details = fetch_details(app_id)
            if details.get("type") not in ("", "game"):
                continue
            positive, negative = discovery_score(details)
            if positive < 2 or negative > positive:
                continue
            existing = previous_by_key.get(str(app_id), {})
            first_seen = existing.get("firstSeenAt") or run_at
            lane = "strong" if positive >= 3 and negative == 0 else "maybe"
            game = {
                **details,
                **classify_game(result, details),
                "id": f"steam-{app_id}",
                "title": details.get("name") or result["title"],
                "profileLane": lane,
                "tags": result["tags"],
                "reason": f"{result['queryReason']}; açıklama ve Steam tür etiketleri profil sinyallerinle örtüşüyor.",
                "owned": False,
                "playtimeHours": 0,
                "firstSeenAt": first_seen,
                "newOnList": bool(mark_new_on_list and not existing),
                "isNewRelease": is_recent(details.get("releaseDateIso"), days=60),
                "discovered": True,
                "updatedAt": run_at,
            }
            games.append(game)
            known_ids.add(app_id)
            time.sleep(0.08)
        except Exception as error:
            errors.append(f"Yeni oyun künyesi ({result['title']}): {error}")
    return games


UPCOMING_QUERIES = [
    ("colony sim", ["koloni", "basebuilding", "sandbox"], "Koloni ve üs kurma"),
    ("city builder", ["şehir kurma", "ekonomi", "yerleşim"], "Şehir kurma ve yerleşim"),
    ("historical strategy", ["grand strategy", "tarihsel", "diplomasi"], "Tarihsel strateji"),
    ("management tycoon", ["yönetim", "tycoon", "lojistik"], "Yönetim ve tycoon"),
    ("tactical shooter", ["gerçekçi shooter", "taktik", "takım"], "Gerçekçi taktik shooter"),
    ("football manager", ["menajerlik", "yönetim", "spor simülasyonu"], "Menajerlik"),
]


def discover_upcoming(previous: list[dict], known_ids: set[int], run_at: str, errors: list[str]) -> list[dict]:
    found: dict[int, dict] = {}
    for query, tags, reason in UPCOMING_QUERIES:
        try:
            results = search_store(query, count=24, filter_value="comingsoon", sort_by="Released_ASC")
        except Exception as error:
            errors.append(f"Yaklaşan oyun araması ({query}): {error}")
            continue
        for result in results:
            app_id = result["steamAppId"]
            release = result.get("releaseDate", "").casefold()
            if app_id in known_ids or app_id in found or any(word in result["title"].casefold() for word in DISCOVERY_SKIP_WORDS):
                continue
            if result.get("releaseDateIso") and dt.date.fromisoformat(result["releaseDateIso"]) <= dt.date.today():
                continue
            if not result.get("releaseDateIso") and "coming" not in release and "soon" not in release:
                continue
            found[app_id] = {**result, "tags": tags, "queryReason": reason}

    previous_by_key = {str(item.get("steamAppId")): item for item in previous if item.get("steamAppId")}
    games: list[dict] = []
    for app_id, result in list(found.items())[:24]:
        try:
            details = fetch_details(app_id)
            if details.get("type") not in ("", "game"):
                continue
            positive, negative = discovery_score(details)
            if positive < 1 or negative > positive:
                continue
            classification = classify_game({"title": result["title"], "tags": result["tags"]}, details)
            previous_game = previous_by_key.get(str(app_id), {})
            games.append({
                **details,
                **classification,
                "id": f"steam-{app_id}",
                "title": details.get("name") or result["title"],
                "profileLane": "strong" if positive >= 3 else "maybe",
                "tags": result["tags"],
                "reason": f"{result['queryReason']} araması; Steam açıklaması profil sinyallerinle örtüşüyor.",
                "owned": False,
                "playtimeHours": 0,
                "firstSeenAt": previous_game.get("firstSeenAt") or run_at,
                "newOnList": False,
                "isNewRelease": False,
                "isUpcoming": True,
                "followable": True,
                "updatedAt": run_at,
            })
            time.sleep(0.08)
        except Exception as error:
            errors.append(f"Yaklaşan oyun künyesi ({result['title']}): {error}")
    return games


def update_catalog(root: Path, weekly: bool = False) -> dict:
    data_dir = root / "data"
    candidate_payload = read_json(data_dir / "candidates.json", {"candidates": []})
    library = clean_library(read_json(data_dir / "library.json", []))
    previous = read_json(data_dir / "catalog.json", {"games": [], "lastUpdatedAt": None})
    update_state = read_json(data_dir / "update-state.json", {"weeklyUpdateCount": 0, "initialSetupAt": previous.get("lastUpdatedAt")})
    previous_by_key = {
        str(item.get("steamAppId")): item for item in previous.get("games", []) if item.get("steamAppId")
    }
    run_at = now_iso()
    games = []
    errors = []
    known_ids = {int(item["steamAppId"]) for item in previous.get("games", []) if item.get("steamAppId")}

    for candidate in candidate_payload.get("candidates", []):
        if not candidate.get("steamAppId") and not candidate.get("title"):
            continue
        app_id = candidate.get("steamAppId")
        if not app_id:
            app_id = resolve_app_id(candidate["title"])
        if not app_id:
            errors.append(candidate.get("title", "Bilinmeyen oyun"))
            continue

        existing = previous_by_key.get(str(app_id), {})
        details = fallback_details(candidate, app_id)
        try:
            details = fetch_details(int(app_id))
        except Exception as error:
            errors.append(f"{candidate['title']}: {error}")
            if existing:
                details.update({key: existing.get(key, value) for key, value in details.items()})

        owned = find_owned(candidate, library)
        first_seen = existing.get("firstSeenAt") or run_at
        game = {
            **details,
            **classify_game(candidate, details),
            "id": f"steam-{app_id}",
            "title": details.get("name") or candidate["title"],
            "profileLane": candidate.get("lane", "strong"),
            "tags": candidate.get("tags", []),
            "reason": candidate.get("reason", "Profilinle eşleşen bir oyun.") ,
            "owned": bool(owned),
            "playtimeHours": owned.get("playtimeHours", 0) if owned else 0,
            "firstSeenAt": first_seen,
            "newOnList": False,
            "isNewRelease": is_recent(details.get("releaseDateIso")),
            "updatedAt": run_at,
        }
        games.append(game)
        known_ids.add(int(app_id))
        time.sleep(0.08)

    fixed_ids = {int(item["steamAppId"]) for item in games if item.get("steamAppId")}
    for previous_game in previous.get("games", []):
        if not previous_game.get("discovered") or not previous_game.get("steamAppId"):
            continue
        if int(previous_game["steamAppId"]) in fixed_ids:
            continue
        try:
            refreshed = fetch_details(int(previous_game["steamAppId"]))
            games.append({
                **previous_game,
                **refreshed,
                **classify_game({"title": previous_game.get("title", ""), "tags": previous_game.get("tags", [])}, refreshed),
                "updatedAt": run_at,
                "newOnList": False,
            })
        except Exception as error:
            errors.append(f"Mevcut keşif künyesi ({previous_game.get('title', 'Bilinmeyen oyun')}): {error}")
            games.append(previous_game)

    games.extend(discover_new_games(previous_by_key, known_ids, run_at, errors, mark_new_on_list=weekly))
    upcoming = discover_upcoming(previous.get("upcoming", []), known_ids, run_at, errors)
    if not upcoming and previous.get("upcoming"):
        upcoming = [
            item for item in previous.get("upcoming", [])
            if not item.get("releaseDateIso") or dt.date.fromisoformat(item["releaseDateIso"]) > dt.date.today()
        ]

    if weekly:
        update_state["weeklyUpdateCount"] = int(update_state.get("weeklyUpdateCount") or 0) + 1
    update_state["initialSetupAt"] = update_state.get("initialSetupAt") or run_at
    update_state["lastUpdateAt"] = run_at
    update_state["lastUpdateWasWeekly"] = bool(weekly)
    write_json(data_dir / "update-state.json", update_state)

    result = {
        "schemaVersion": 1,
        "lastUpdatedAt": run_at,
        "lastUpdateErrors": errors[:12],
        "games": games,
        "upcoming": upcoming,
    }
    write_json(data_dir / "catalog.json", result)
    return result


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    weekly = "--weekly" in sys.argv
    if "--root" in sys.argv:
        root_index = sys.argv.index("--root")
        if root_index + 1 < len(sys.argv):
            root = Path(sys.argv[root_index + 1]).resolve()
    update_catalog(root, weekly=weekly)
    print("Oyun Pusulasi katalog guncellendi.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

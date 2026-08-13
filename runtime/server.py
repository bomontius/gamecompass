from __future__ import annotations

import argparse
import datetime as dt
import json
import mimetypes
import os
import webbrowser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

from scripts.updater import clean_library, fetch_details, fetch_owned_games, read_json, search_store, store_search, update_catalog, write_json


DEFAULT_SETTINGS = {
    "theme": "neon",
    "background": "tactical",
    "font": "arcade",
    "fontSize": "normal",
    "language": "tr",
    "weeklyUpdatesEnabled": True,
    "welcomeSeen": False,
    "guideCompleted": False,
}

ALLOWED_THEMES = {"neon", "field", "synth", "ember", "arctic", "acid"}
ALLOWED_BACKGROUNDS = {"tactical", "neon", "management"}
ALLOWED_FONTS = {"arcade", "command", "editorial", "terminal", "catalog", "poster"}
ALLOWED_LANGUAGES = {"tr", "en"}
ALLOWED_FONT_SIZES = {"small", "normal", "large"}

DEFAULT_PROFILE_STATE = {
    "favorites": [],
    "hiddenGames": [],
    "blockedTypes": [],
    "likedGames": [],
    "dislikedGames": [],
    "notes": {},
    "extraPreferences": [],
    "positiveTags": [],
    "preferredCategories": [],
    "preferredSubgenres": [],
    "acceptedTermsAt": None,
    "plan": {},
    "shelves": [],
    "followedUpcoming": [],
}

CURATED_TAGS = [
    "koloni", "basebuilding", "grand strategy", "tarihsel", "şehir kurma",
    "gerçekçi shooter", "yönetim", "tycoon", "lojistik", "menajerlik", "ofis yönetimi",
]


def now_iso() -> str:
    return dt.datetime.now().astimezone().isoformat(timespec="seconds")


def settings_payload(value: dict | None = None) -> dict:
    raw = {**DEFAULT_SETTINGS, **(value or {})}
    return {
        "theme": raw["theme"] if raw.get("theme") in ALLOWED_THEMES else DEFAULT_SETTINGS["theme"],
        "background": raw["background"] if raw.get("background") in ALLOWED_BACKGROUNDS else DEFAULT_SETTINGS["background"],
        "font": raw["font"] if raw.get("font") in ALLOWED_FONTS else DEFAULT_SETTINGS["font"],
        "fontSize": raw["fontSize"] if raw.get("fontSize") in ALLOWED_FONT_SIZES else DEFAULT_SETTINGS["fontSize"],
        "language": raw["language"] if raw.get("language") in ALLOWED_LANGUAGES else DEFAULT_SETTINGS["language"],
        "weeklyUpdatesEnabled": bool(raw.get("weeklyUpdatesEnabled", True)),
        "welcomeSeen": bool(raw.get("welcomeSeen", False)),
        "guideCompleted": bool(raw.get("guideCompleted", False)),
    }


def merge_state(value: dict | None, profile_kind: str = "custom") -> dict:
    state = {**DEFAULT_PROFILE_STATE, **(value or {})}
    state["profileKind"] = profile_kind
    for key in ("favorites", "hiddenGames", "blockedTypes", "likedGames", "dislikedGames", "positiveTags", "preferredCategories", "preferredSubgenres", "followedUpcoming"):
        if not isinstance(state.get(key), list):
            state[key] = []
    for key in ("notes", "plan"):
        if not isinstance(state.get(key), dict):
            state[key] = {}
    if not isinstance(state.get("extraPreferences"), list):
        state["extraPreferences"] = []
    if not isinstance(state.get("shelves"), list):
        state["shelves"] = []
    if not isinstance(state.get("acceptedTermsAt"), str):
        state["acceptedTermsAt"] = None
    return state


def empty_profile() -> dict:
    return {
        "id": None,
        "name": "Yeni profil oluştur",
        "description": "Henüz bir profil oluşturulmadı.",
        "kind": "custom",
        "libraryMode": "empty",
        "libraryAdditions": [],
        "state": merge_state({}, "custom"),
    }


def profiles_path(root: Path) -> Path:
    return root / "data" / "profiles.json"


def load_profiles(root: Path) -> dict:
    payload = read_json(profiles_path(root), {})
    if not isinstance(payload, dict):
        payload = {}
    profiles = payload.get("profiles")
    if not isinstance(profiles, list):
        profiles = []
    for profile in profiles:
        profile["state"] = merge_state(profile.get("state"), profile.get("kind", "custom"))
        profile.setdefault("libraryMode", "empty")
        profile.setdefault("libraryAdditions", [])
    payload["profiles"] = profiles
    if not any(profile.get("id") == payload.get("activeProfileId") for profile in profiles):
        payload["activeProfileId"] = profiles[0]["id"] if profiles else None
    write_json(profiles_path(root), payload)
    return payload


def save_profiles(root: Path, payload: dict) -> None:
    write_json(profiles_path(root), payload)


def active_profile(root: Path, payload: dict | None = None) -> tuple[dict, dict]:
    payload = payload or load_profiles(root)
    profile = next((item for item in payload["profiles"] if item.get("id") == payload.get("activeProfileId")), None)
    if profile is None:
        return payload, empty_profile()
    return payload, profile


def profile_library(root: Path, profile: dict) -> list[dict]:
    seed = clean_library(read_json(root / "data" / "library.json", [])) if profile.get("libraryMode") == "seed" else []
    additions = profile.get("libraryAdditions", [])
    merged: dict[str, dict] = {}
    for item in [*seed, *additions]:
        key = str(item.get("steamAppId") or item.get("name", "")).casefold()
        if key:
            merged[key] = {"owned": True, "playtimeHours": 0, **item}
    return list(merged.values())


def normalize_imported_library(games: list) -> list[dict]:
    merged: dict[str, dict] = {}
    for item in games[:5000]:
        if not isinstance(item, dict):
            continue
        app_id = int(item.get("steamAppId") or item.get("appid") or item.get("appId") or item.get("appID") or 0)
        name = str(item.get("name") or item.get("title") or "").strip()
        if not app_id and not name:
            continue
        key = str(app_id or name).casefold()
        playtime = item.get("playtimeHours", item.get("hoursOnRecord"))
        try:
            hours = round(float(playtime), 1) if playtime is not None else round(float(item.get("playtime_forever") or 0) / 60, 1)
        except (TypeError, ValueError):
            hours = 0
        entry = {"steamAppId": app_id or None, "name": name or f"Steam oyunu {app_id}", "playtimeHours": hours, "owned": True}
        for field in ("headerImage", "capsuleImage", "iconImage", "steamUrl"):
            if item.get(field):
                entry[field] = str(item[field])
        merged[key] = entry
    return list(merged.values())


def profile_summaries(root: Path, payload: dict) -> list[dict]:
    return [{
        "id": profile["id"],
        "name": profile.get("name", "Adsız profil"),
        "description": profile.get("description", ""),
        "steamProfileName": profile.get("steamProfileName", ""),
        "kind": profile.get("kind", "custom"),
        "libraryCount": len(profile_library(root, profile)),
    } for profile in payload["profiles"]]


class AppHandler(BaseHTTPRequestHandler):
    root: Path

    def log_message(self, format: str, *args) -> None:
        return

    def send_json(self, payload: dict, status: int = 200) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def read_body(self) -> dict:
        length = int(self.headers.get("Content-Length", "0"))
        if length <= 0:
            return {}
        try:
            return json.loads(self.rfile.read(length).decode("utf-8"))
        except (json.JSONDecodeError, UnicodeDecodeError):
            return {}

    def response_bundle(self) -> dict:
        profiles = load_profiles(self.root)
        profiles, profile = active_profile(self.root, profiles)
        settings = settings_payload(read_json(self.root / "data" / "settings.json", {}))
        catalog = read_json(self.root / "data" / "catalog.json", {"games": [], "upcoming": []})
        return {
            "library": profile_library(self.root, profile),
            "catalog": catalog,
            "state": merge_state(profile.get("state"), profile.get("kind", "custom")),
            "profiles": profile_summaries(self.root, profiles),
            "activeProfileId": profile["id"],
            "activeProfile": {
                "id": profile["id"],
                "name": profile.get("name", "Adsız profil"),
                "description": profile.get("description", ""),
                "steamProfileName": profile.get("steamProfileName", ""),
                "kind": profile.get("kind", "custom"),
            },
            "settings": settings,
        }

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path
        if path == "/api/health":
            self.send_json({"ok": True})
            return
        if path == "/api/bootstrap":
            self.send_json(self.response_bundle())
            return
        if path == "/api/backup":
            profiles = load_profiles(self.root)
            settings = settings_payload(read_json(self.root / "data" / "settings.json", {}))
            self.send_json({
                "format": "game-compass-profile-backup",
                "version": 1,
                "exportedAt": now_iso(),
                "activeProfileId": profiles.get("activeProfileId"),
                "profiles": profiles.get("profiles", []),
                "settings": settings,
            })
            return
        self.serve_static(path)

    def do_POST(self) -> None:
        path = urlparse(self.path).path
        payload = self.read_body()
        if path == "/api/open-url":
            url = str(payload.get("url", "")).strip()
            parsed = urlparse(url)
            allowed_hosts = {"store.steampowered.com", "steamcommunity.com", "github.com", "www.github.com"}
            if parsed.scheme != "https" or parsed.netloc not in allowed_hosts:
                self.send_json({"ok": False, "error": "Yalnızca Steam veya Game Compass GitHub bağlantıları açılabilir."}, 400)
                return
            if os.name == "nt":
                os.startfile(url)
            else:
                webbrowser.open(url, new=2)
            self.send_json({"ok": True})
            return
        if path == "/api/state":
            profiles = load_profiles(self.root)
            profiles, profile = active_profile(self.root, profiles)
            profile["state"] = merge_state(payload, profile.get("kind", "custom"))
            save_profiles(self.root, profiles)
            self.send_json({"ok": True, "state": profile["state"]})
            return
        if path == "/api/settings":
            settings = settings_payload({**read_json(self.root / "data" / "settings.json", {}), **payload})
            write_json(self.root / "data" / "settings.json", settings)
            self.send_json({"ok": True, "settings": settings})
            return
        if path == "/api/backup/import":
            backup = payload.get("backup", payload)
            if not isinstance(backup, dict) or not isinstance(backup.get("profiles"), list) or not backup.get("profiles"):
                self.send_json({"ok": False, "error": "Geçerli bir Game Compass profil yedeği bulunamadı."}, 400)
                return
            if len(backup["profiles"]) > 50:
                self.send_json({"ok": False, "error": "Yedek en fazla 50 profil içerebilir."}, 400)
                return
            imported_profiles = []
            for index, source in enumerate(backup["profiles"]):
                if not isinstance(source, dict):
                    continue
                profile = dict(source)
                profile["id"] = str(profile.get("id") or f"profile-imported-{index}-{int(dt.datetime.now().timestamp() * 1000)}")
                profile["name"] = str(profile.get("name") or "İçe aktarılan profil").strip()[:120]
                profile["description"] = str(profile.get("description") or "").strip()[:500]
                profile.pop("steamApiKey", None)
                profile.pop("apiKey", None)
                profile["state"] = merge_state(profile.get("state"), profile.get("kind", "custom"))
                profile["libraryMode"] = profile.get("libraryMode") if profile.get("libraryMode") in {"empty", "steam", "file", "seed"} else "empty"
                additions = profile.get("libraryAdditions", [])
                profile["libraryAdditions"] = normalize_imported_library(additions if isinstance(additions, list) else [])
                imported_profiles.append(profile)
            if not imported_profiles:
                self.send_json({"ok": False, "error": "Yedekte içe aktarılabilir profil bulunamadı."}, 400)
                return
            active_id = str(backup.get("activeProfileId") or "")
            if active_id not in {profile["id"] for profile in imported_profiles}:
                active_id = imported_profiles[0]["id"]
            save_profiles(self.root, {"activeProfileId": active_id, "profiles": imported_profiles})
            if isinstance(backup.get("settings"), dict):
                write_json(self.root / "data" / "settings.json", settings_payload(backup["settings"]))
            self.send_json({"ok": True, "bundle": self.response_bundle()})
            return
        if path == "/api/profile/create":
            profiles = load_profiles(self.root)
            name = str(payload.get("name", "Yeni profil")).strip() or "Yeni profil"
            if not bool(payload.get("termsAccepted", False)):
                self.send_json({"ok": False, "error": "Kullanım koşullarını kabul etmeden profil oluşturulamaz."}, 400)
                return
            profile_id = f"profile-{int(dt.datetime.now().timestamp() * 1000)}"
            preferred_categories = [str(item).strip() for item in payload.get("preferredCategories", []) if str(item).strip()][:40]
            preferred_subgenres = [str(item).strip() for item in payload.get("preferredSubgenres", []) if str(item).strip()][:80]
            positive_tags = list(dict.fromkeys([
                *[str(item).strip() for item in payload.get("positiveTags", []) if str(item).strip()],
                *preferred_categories,
                *preferred_subgenres,
            ]))[:120]
            state = merge_state({
                "positiveTags": positive_tags,
                "blockedTypes": payload.get("blockedTypes", []),
                "extraPreferences": payload.get("extraPreferences", []),
                "preferredCategories": preferred_categories,
                "preferredSubgenres": preferred_subgenres,
                "acceptedTermsAt": now_iso(),
            }, "custom")
            profiles["profiles"].append({
                "id": profile_id,
                "name": name,
                "description": str(payload.get("description", "Sıfırdan oluşturulan profil.")),
                "steamProfileName": str(payload.get("steamProfileName", "")).strip(),
                "theme": str(payload.get("theme", "neon")),
                "font": str(payload.get("font", "arcade")),
                "kind": "custom",
                "libraryMode": "empty",
                "libraryAdditions": [],
                "state": state,
                "createdAt": now_iso(),
            })
            profiles["activeProfileId"] = profile_id
            save_profiles(self.root, profiles)
            self.send_json({"ok": True, "bundle": self.response_bundle()})
            return
        if path == "/api/profile/switch":
            profiles = load_profiles(self.root)
            profile_id = str(payload.get("profileId", ""))
            if not any(item.get("id") == profile_id for item in profiles["profiles"]):
                self.send_json({"ok": False, "error": "Profil bulunamadı."}, 404)
                return
            profiles["activeProfileId"] = profile_id
            save_profiles(self.root, profiles)
            self.send_json({"ok": True, "bundle": self.response_bundle()})
            return
        if path == "/api/profile/reset":
            profiles = load_profiles(self.root)
            profiles, profile = active_profile(self.root, profiles)
            mode = str(payload.get("mode", "preferences"))
            current = merge_state(profile.get("state"), profile.get("kind", "custom"))
            if mode == "profile":
                current = merge_state({}, profile.get("kind", "custom"))
                if profile.get("kind") == "curated":
                    current["positiveTags"] = CURATED_TAGS.copy()
                profile["libraryAdditions"] = []
            else:
                current["positiveTags"] = CURATED_TAGS.copy() if profile.get("kind") == "curated" else []
                current["preferredCategories"] = []
                current["preferredSubgenres"] = []
                current["blockedTypes"] = []
                current["hiddenGames"] = []
                current["likedGames"] = []
                current["dislikedGames"] = []
                current["extraPreferences"] = []
            profile["state"] = current
            save_profiles(self.root, profiles)
            self.send_json({"ok": True, "bundle": self.response_bundle()})
            return
        if path == "/api/library/add":
            profiles = load_profiles(self.root)
            profiles, profile = active_profile(self.root, profiles)
            app_id = int(payload.get("steamAppId", 0) or 0)
            if not app_id:
                self.send_json({"ok": False, "error": "Steam oyunu seçilmedi."}, 400)
                return
            addition = {"steamAppId": app_id, "name": str(payload.get("title", "")), "playtimeHours": 0, "owned": True}
            try:
                details = fetch_details(app_id)
                addition.update({"name": details.get("name") or addition["name"], "headerImage": details.get("headerImage", ""), "steamUrl": details.get("steamUrl", "")})
            except Exception:
                pass
            additions = profile.setdefault("libraryAdditions", [])
            additions[:] = [item for item in additions if int(item.get("steamAppId", 0) or 0) != app_id]
            additions.append(addition)
            save_profiles(self.root, profiles)
            self.send_json({"ok": True, "library": profile_library(self.root, profile), "bundle": self.response_bundle()})
            return
        if path == "/api/steam-import":
            profiles = load_profiles(self.root)
            profiles, profile = active_profile(self.root, profiles)
            api_key = str(payload.get("key", "")).strip()
            profile_ref = str(payload.get("profileRef", "")).strip()
            try:
                result = fetch_owned_games(api_key, profile_ref, bool(payload.get("includeFreeGames", True)))
                profile["libraryMode"] = "steam"
                profile["libraryAdditions"] = result["games"]
                profile["steamImport"] = {"steamId": result["steamId"], "importedAt": now_iso(), "count": len(result["games"]), "source": "Steam Web API"}
                save_profiles(self.root, profiles)
                self.send_json({"ok": True, "importedCount": len(result["games"]), "steamId": result["steamId"], "bundle": self.response_bundle()})
            except ValueError as error:
                self.send_json({"ok": False, "error": str(error)}, 400)
            except Exception:
                self.send_json({"ok": False, "error": "Steam’e bağlanılamadı. İnternet bağlantısını, API anahtarını ve profil gizliliğini kontrol et."}, 502)
            return
        if path == "/api/library/import":
            profiles = load_profiles(self.root)
            profiles, profile = active_profile(self.root, profiles)
            games = normalize_imported_library(payload.get("games", []))
            if not games:
                self.send_json({"ok": False, "error": "Aktarılabilir oyun kaydı bulunamadı."}, 400)
                return
            profile["libraryMode"] = "file"
            profile["libraryAdditions"] = games
            profile["steamImport"] = {"importedAt": now_iso(), "count": len(games), "source": "Dosya aktarımı"}
            save_profiles(self.root, profiles)
            self.send_json({"ok": True, "importedCount": len(games), "bundle": self.response_bundle()})
            return
        if path == "/api/steam-search":
            query = str(payload.get("query", "")).strip()
            if len(query) < 2:
                self.send_json({"ok": True, "results": []})
                return
            try:
                results = store_search(query, count=12)
                self.send_json({"ok": True, "results": [{
                    "steamAppId": item["steamAppId"],
                    "title": item["title"],
                    "releaseDate": item.get("releaseDate", ""),
                    "capsuleImage": item.get("capsuleImage") or f"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/{item['steamAppId']}/capsule_231x87.jpg",
                    "steamUrl": f"https://store.steampowered.com/app/{item['steamAppId']}/",
                } for item in results]})
            except Exception as error:
                self.send_json({"ok": False, "error": str(error)}, 502)
            return
        if path == "/api/update":
            try:
                weekly = bool(payload.get("weekly", False))
                catalog = update_catalog(self.root, weekly=weekly)
                if weekly:
                    write_json(self.root / "data" / "weekly-marker.json", {"date": dt.datetime.now().astimezone().strftime("%Y-%m-%d"), "updatedAt": now_iso()})
                bundle = self.response_bundle()
                bundle["catalog"] = catalog
                self.send_json({"ok": True, **bundle})
            except Exception as error:
                self.send_json({"ok": False, "error": str(error)}, 500)
            return
        self.send_json({"ok": False, "error": "Bilinmeyen istek"}, 404)

    def serve_static(self, path: str) -> None:
        relative = "index.html" if path in ("", "/") else path.lstrip("/")
        candidate = (self.root / relative).resolve()
        if self.root.resolve() not in candidate.parents and candidate != self.root.resolve():
            self.send_error(403)
            return
        if not candidate.exists() or not candidate.is_file():
            self.send_error(404)
            return
        content = candidate.read_bytes()
        content_type = mimetypes.guess_type(candidate.name)[0] or "application/octet-stream"
        if candidate.suffix in (".js", ".css", ".json", ".html"):
            content_type += "; charset=utf-8"
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        cache_control = "no-cache"
        if candidate.suffix in (".js", ".css", ".svg", ".ico", ".png", ".jpg", ".jpeg", ".webp"):
            cache_control = "public, max-age=86400"
        self.send_header("Cache-Control", cache_control)
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=str(Path(__file__).resolve().parent))
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument("--update", action="store_true")
    parser.add_argument("--weekly", action="store_true")
    args = parser.parse_args()
    root = Path(args.root).resolve()
    if args.update:
        settings = settings_payload(read_json(root / "data" / "settings.json", {}))
        if args.weekly and not settings.get("weeklyUpdatesEnabled", True):
            print("Haftalik guncelleme ayari kapali.")
            return 0
        update_catalog(root, weekly=args.weekly)
        return 0

    handler = type("ConfiguredAppHandler", (AppHandler,), {"root": root})
    server = ThreadingHTTPServer(("127.0.0.1", args.port), handler)
    server.daemon_threads = True
    print(f"Oyun Pusulasi http://127.0.0.1:{args.port}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

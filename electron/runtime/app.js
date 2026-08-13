const profileAnchors = [
  { text: "Koloni, üs kurma ve emergent hikâyeler", direction: "more", source: "başlangıç analizi", tags: ["koloni", "base building"] },
  { text: "Gerçek tarihe dayalı grand strategy", direction: "more", source: "başlangıç analizi", tags: ["grand strategy", "tarihsel"] },
  { text: "Manor Lords / Ostriv çizgisinde tarihsel şehir kurma", direction: "more", source: "başlangıç analizi", tags: ["şehir kurma", "tarihsel"] },
  { text: "Gerçekçi ve taktik shooter", direction: "more", source: "başlangıç analizi", tags: ["gerçekçi shooter", "taktik"] },
  { text: "Menajerlik, ofis yönetimi ve tycoon", direction: "more", source: "başlangıç analizi", tags: ["yönetim", "tycoon"] },
  { text: "Yetenek veya büyü tabanlı rekabetçi shooter", direction: "block", source: "açık tercihin", tags: ["büyü", "hero shooter", "valorant"] },
];

const viewMeta = {
  home: ["", "Sana göre", "Uzun soluklu sistemler, gerçek dünya ve sana göre oyunlar."],
  new: ["", "Yeni gelenler", "Yeni çıkanlar ve bu listeye yeni düşen keşifler."],
  upcoming: ["", "Yakında çıkacaklar", "Profilinle eşleşen, henüz çıkmamış oyunları takip et."],
  low: ["", "Alt liste", "Türe yakın; ama sende daha düşük uyum ihtimali taşıyanlar."],
  favorites: ["", "Kayıtlılarım", "Daha sonra dönmek için ayırdığın oyunlar ve notlar."],
  library: ["", "Kütüphanem", "Bu profilin oyunları; oynama saatleri öneri kararına dönüşmez."],
  shelves: ["", "Kişisel raflar", "Benzer oyunları ortak sistemlerine göre otomatik raflara ayırdım."],
  excluded: ["", "Dışlananlar", "Gizlediğin oyunlar ve profilinden çıkardığın oyun tipleri."],
  profile: ["", "Profil ve temalar", "Profilini değiştir, tema seç, yeni pusula oluştur veya sıfırla."],
  updates: ["", "Güncelleme durumu", "Haftalık keşif taraması ve son yenilenen bilgiler."],
};

const defaultState = () => ({
  favorites: [], hiddenGames: [], blockedTypes: [], likedGames: [], notes: {}, extraPreferences: [],
  positiveTags: [], plan: {}, shelves: [], followedUpcoming: [], dislikedGames: [],
});

const app = {
  view: "home",
  library: [],
  catalog: { games: [], upcoming: [], lastUpdatedAt: null, lastUpdateErrors: [] },
  state: defaultState(),
  settings: { theme: "neon", background: "tactical", font: "arcade", fontSize: "normal", language: "tr", weeklyUpdatesEnabled: true, welcomeSeen: false, guideCompleted: false },
  profiles: [],
  activeProfileId: null,
  activeProfile: { id: null, name: "Yeni profil oluştur", description: "Henüz bir profil oluşturulmadı.", kind: "custom" },
  selectedCategories: new Set(),
  selectedSubgenres: new Set(),
  expandedGroups: new Set(),
  compareSet: new Set(),
  registry: new Map(),
  updateInProgress: false,
  steamSearchTimer: null,
  renderFrame: 0,
  cache: {
    catalogGames: null,
    upcomingGames: null,
    knownGames: null,
    catalogByNormalized: null,
    libraryCards: null,
    librarySource: null,
    libraryPreferenceTerms: null,
    libraryPreferenceSource: null,
    gameText: new Map(),
    normalizedGameText: new Map(),
    categories: new Map(),
    subgenres: new Map(),
  },
};

function notifyLocaleRender() {
  if (typeof window !== "undefined" && typeof window.__gcLocaleRefresh === "function") window.__gcLocaleRefresh();
}

function uiText(turkish, english) {
  return app.settings.language === "en" ? english : turkish;
}

function localizedReason(value) {
  const reason = value || "";
  if (app.settings.language !== "en") return reason;
  const normalizedReason = reason.toLocaleLowerCase("tr-TR");
  if (normalizedReason.includes("katalog türleri") || normalizedReason.includes("oyun türleri")) return "A discovery matched to the catalog genres and systems you enjoy.";
  if (normalizedReason.includes("yaklaşan çıkışlar")) return "An upcoming discovery that may match your profile.";
  const known = {
    "Oyun türleri ve sistem etiketleriyle eşleşen bir keşif adayı.": "A discovery candidate matched to the game systems and genres you enjoy.",
    "Katalog türleri ve sistem etiketleriyle eşleşen bir keşif.": "A discovery matched to the catalog genres and systems you enjoy.",
    "Yaklaşan çıkışlar arasında profilinle eşleşebilecek bir keşif.": "An upcoming discovery that may match your profile.",
    "Profilinle eşleşen bir oyun.": "A game matched to your profile.",
    "Bu oyun aktif profilinin kütüphanesine eklendi.": "This game was added to the active profile library.",
    "Steam mağaza özeti henüz alınmadı.": "The Steam store summary has not been loaded yet.",
    "Profil sinyallerinle eşleşen keşif.": "A discovery matched to your profile signals.",
  };
  return known[reason] || reason;
}

function hasActiveProfile() {
  return Boolean(app.activeProfile?.id && app.profiles.length);
}

const planLabels = { now: "Şimdi", later: "Sonra", tracking: "Takipte", deferred: "Ertelendi" };
const planLabelsEn = { now: "Now", later: "Later", tracking: "Following", deferred: "Deferred" };
const planOrder = ["now", "later", "tracking", "deferred"];
const themeOptions = [
  ["neon", "Neon Pulse", "Siyan, pembe, lime"],
  ["field", "Field Ops", "Amber, zeytin, kum"],
  ["synth", "Synthwave", "Mor, cyan, magenta"],
  ["ember", "Ember Raid", "Kömür, kor, turuncu"],
  ["arctic", "Arctic Command", "Buz mavisi, çelik, beyaz"],
  ["acid", "Acid Grid", "Siyah, asit sarısı, elektrik"],
];
const fontOptions = [
  ["arcade", "Arcade Grid", "Köşeli ve enerjik"],
  ["command", "Command", "Dar, askeri ve net"],
  ["editorial", "Editorial", "Karakterli serif"],
  ["terminal", "Terminal", "Monospace ve teknik"],
  ["catalog", "Catalog", "Klasik ve dengeli"],
  ["poster", "Poster", "Kalın ve vurucu"],
];
const tagAliases = {
  koloni: ["koloni", "colony", "colony sim", "settlement"],
  "base building": ["base building", "basebuilding", "üs kurma", "üs inşa", "survival base"],
  "şehir kurma": ["şehir kurma", "city builder", "city-building", "yerleşim"],
  tarihsel: ["tarihsel", "historical", "history", "orta çağ", "medieval", "antik", "ancient"],
  "grand strategy": ["grand strategy", "strateji", "diplomasi", "empire"],
  "gerçekçi shooter": ["gerçekçi shooter", "realistic shooter", "tactical shooter", "askeri shooter"],
  taktik: ["taktik", "tactical", "military operations", "operasyon"],
  yönetim: ["yönetim", "management", "management sim", "işletme"],
  tycoon: ["tycoon", "business sim", "işletme simülasyonu"],
  lojistik: ["lojistik", "logistics", "transport", "ulaşım"],
  üretim: ["üretim", "production", "factory", "automation", "fabrika"],
  menajerlik: ["menajerlik", "football manager", "soccer manager", "spor simülasyonu"],
  "ofis yönetimi": ["ofis yönetimi", "office management", "software inc", "ofis"],
  roguelike: ["roguelike", "roguelite", "rogue-like"],
  "büyü": ["büyü", "magic", "magical", "spell", "fantasy magic"],
  "hero shooter": ["hero shooter", "ability shooter", "yetenek tabanlı"],
  valorant: ["valorant"],
  gacha: ["gacha", "loot box"],
};

const defaultShelves = [
  { id: "shelf-colony", name: "RimWorld’e yakın koloni sistemleri", match: ["Colony Sim", "Base Building"] },
  { id: "shelf-history", name: "Tarihsel devlet ve şehir", match: ["Historical", "Grand Strategy", "City Builder"] },
  { id: "shelf-systems", name: "Üretim, lojistik ve tycoon", match: ["Production", "Logistics", "Management Sim", "Tycoon"] },
  { id: "shelf-operations", name: "Gerçekçi operasyonlar", match: ["Tactical Shooter", "Military Operations", "Tactical"] },
];

function cleanText(value) {
  if (value === undefined || value === null) return "";
  let text = String(value);
  const replacements = {
    "Ã§": "ç", "Ã‡": "Ç", "Ã¶": "ö", "Ã–": "Ö", "Ã¼": "ü", "Ãœ": "Ü", "Ä±": "ı", "Ä°": "İ",
    "ÅŸ": "ş", "Åž": "Ş", "ÄŸ": "ğ", "Äž": "Ğ", "Ã©": "é", "Ã‰": "É", "Ã¢": "â", "Ã®": "î",
    "Ã»": "û", "Â®": "®", "â„¢": "™", "â€™": "’", "â€œ": "“", "â€�": "”", "â€“": "–", "â€”": "—",
    "ÃƒÂ§": "ç", "ÃƒÂ¶": "ö", "ÃƒÂ¼": "ü", "Ã„Â±": "ı", "Ã…Å¸": "ş", "Ã„ÂŸ": "ğ", "Ã„Â°": "İ",
  };
  Object.entries(replacements).forEach(([from, to]) => { text = text.replaceAll(from, to); });
  return text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function normalize(value) {
  return cleanText(value).toLocaleLowerCase("tr-TR").replace(/[™®]/g, "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "");
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

function formatNumber(value) { return new Intl.NumberFormat("tr-TR").format(Number(value || 0)); }

function formatHours(value) {
  const hours = Number(value || 0);
  if (!hours) return "oynanmadı";
  if (hours < 1) return `${Math.round(hours * 60)} dk`;
  return `${hours.toLocaleString("tr-TR", { maximumFractionDigits: 1 })} saat`;
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return cleanText(value);
  return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function resetDerivedCache() {
  app.cache.catalogGames = null;
  app.cache.upcomingGames = null;
  app.cache.knownGames = null;
  app.cache.catalogByNormalized = null;
  app.cache.libraryCards = null;
  app.cache.librarySource = null;
  app.cache.libraryPreferenceTerms = null;
  app.cache.libraryPreferenceSource = null;
  app.cache.gameText.clear();
  app.cache.normalizedGameText.clear();
  app.cache.categories.clear();
  app.cache.subgenres.clear();
}

function allCatalogGames() {
  if (app.cache.catalogGames) return app.cache.catalogGames;
  app.cache.catalogGames = (app.catalog.games || []).map((game) => ({
    ...game,
    title: cleanText(game.title || game.name),
    reason: cleanText(game.reason),
    shortDescription: cleanText(game.shortDescription),
    tags: (game.tags || []).map(cleanText),
    generalCategories: (game.generalCategories || []).map(cleanText),
    subgenres: (game.subgenres || []).map(cleanText),
  }));
  app.cache.catalogByNormalized = new Map();
  app.cache.catalogGames.forEach((game) => {
    app.cache.catalogByNormalized.set(normalize(game.title), game);
    (game.ownedAliases || []).forEach((alias) => app.cache.catalogByNormalized.set(normalize(alias), game));
  });
  return app.cache.catalogGames;
}

function upcomingGames() {
  if (app.cache.upcomingGames) return app.cache.upcomingGames;
  app.cache.upcomingGames = (app.catalog.upcoming || []).map((game) => ({
    ...game,
    title: cleanText(game.title || game.name),
    reason: cleanText(game.reason),
    shortDescription: cleanText(game.shortDescription),
    tags: (game.tags || []).map(cleanText),
    generalCategories: (game.generalCategories || []).map(cleanText),
    subgenres: (game.subgenres || []).map(cleanText),
  }));
  return app.cache.upcomingGames;
}

function allKnownGames() {
  if (!app.cache.knownGames) app.cache.knownGames = [...allCatalogGames(), ...upcomingGames()];
  return app.cache.knownGames;
}

function findCatalogForLibrary(item) {
  const target = normalize(item.name);
  allCatalogGames();
  return app.cache.catalogByNormalized.get(target);
}

function libraryCards() {
  if (app.cache.libraryCards && app.cache.librarySource === app.library) return app.cache.libraryCards;
  app.cache.librarySource = app.library;
  app.cache.libraryCards = app.library.map((item) => {
    const linked = findCatalogForLibrary(item);
    if (linked) return { ...linked, playtimeHours: item.playtimeHours, owned: true };
    return {
      ...item,
      id: `library-${normalize(item.name)}`, title: cleanText(item.name), owned: true, playtimeHours: item.playtimeHours,
      profileLane: "library", tags: [], generalCategories: ["Library"], subgenres: [],
      reason: "Bu oyun aktif profilinin kütüphanesine eklendi.", shortDescription: "Steam künyesi henüz alınmadı.",
    };
  });
  return app.cache.libraryCards;
}

function libraryPreferenceTerms() {
  if (app.cache.libraryPreferenceTerms && app.cache.libraryPreferenceSource === app.library) return app.cache.libraryPreferenceTerms;
  const counts = new Map();
  libraryCards().forEach((game) => {
    const terms = [...(game.generalCategories || []), ...(game.subgenres || []), ...(game.tags || [])]
      .map(cleanText)
      .filter((term) => term && normalize(term) !== "library");
    [...new Set(terms)].forEach((term) => counts.set(term, (counts.get(term) || 0) + 1));
  });
  app.cache.libraryPreferenceSource = app.library;
  app.cache.libraryPreferenceTerms = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "tr"))
    .slice(0, 80)
    .map(([term]) => term);
  return app.cache.libraryPreferenceTerms;
}

function gameText(game) {
  if (!app.cache.gameText.has(game.id)) app.cache.gameText.set(game.id, [game.title, game.reason, game.shortDescription, ...(game.tags || []), ...(game.generalCategories || []), ...(game.subgenres || []), ...(game.genres || []), ...(game.categories || [])].map(cleanText).join(" "));
  return app.cache.gameText.get(game.id);
}

function includesTerm(game, term) {
  const wanted = normalize(term);
  if (!wanted) return false;
  if (!app.cache.normalizedGameText.has(game.id)) app.cache.normalizedGameText.set(game.id, normalize(gameText(game)));
  return app.cache.normalizedGameText.get(game.id).includes(wanted);
}

function isBlocked(game) {
  if (app.state.hiddenGames.includes(game.id) || game.profileLane === "excluded") return true;
  return (app.state.blockedTypes || []).some((type) => includesTerm(game, type));
}

function isExcludedViewGame(game) { return isBlocked(game); }

function profileFit(game) {
  if (isBlocked(game)) return -100;
  if (game.owned) return 0;
  const extraPositive = (app.state.extraPreferences || []).filter((item) => item.direction === "more").flatMap((item) => item.tags || []);
  const desired = [...new Set([
    ...(app.state.positiveTags || []),
    ...(app.state.preferredCategories || []),
    ...(app.state.preferredSubgenres || []),
    ...extraPositive,
    ...libraryPreferenceTerms(),
  ].filter(Boolean))];
  if (app.activeProfile.kind === "custom") {
    if (!desired.length) return 0;
    return desired.reduce((score, term) => score + (includesTerm(game, term) ? 2 : 0), 0);
  }
  const laneScore = { anchor: 6, strong: 4, maybe: 2 };
  const matched = desired.filter((term) => includesTerm(game, term)).length;
  return (laneScore[game.profileLane] || 1) + matched;
}

function laneLabel(game) {
  if (game.isUpcoming) return [uiText("YAKINDA", "UPCOMING"), "blue"];
  if (game.newOnList) return ["NEW ON LIST", "pink"];
  if (game.isNewRelease) return [uiText("YENİ", "NEW"), "orange"];
  if (game.profileLane === "excluded") return [uiText("DIŞLANMIŞ", "EXCLUDED"), "orange"];
  if (game.owned) return [uiText("KÜTÜPHANENDE", "IN YOUR LIBRARY"), "blue"];
  if (game.profileLane === "maybe") return [uiText("ALT LİSTE", "LOWER LANE"), "orange"];
  return [uiText("GÜÇLÜ EŞLEŞME", "STRONG MATCH"), ""];
}

function planLabel(game) {
  const key = app.state.plan?.[game.id];
  return key ? uiText(planLabels[key], planLabelsEn[key]) : uiText("Planla", "Plan");
}

function releaseValue(game) { return game.releaseDateIso ? new Date(game.releaseDateIso).getTime() : 0; }

function dedupeGames(games) {
  const byId = new Map();
  games.forEach((game) => { if (game?.id && !byId.has(game.id)) byId.set(game.id, game); });
  return [...byId.values()];
}

function applyFilters(games) {
  const search = normalize(document.getElementById("searchInput")?.value || "");
  return dedupeGames(games).filter((game) => {
    if (search && !normalize(gameText(game)).includes(search)) return false;
    if (app.selectedCategories.size && ![...app.selectedCategories].every((value) => (game.generalCategories || []).includes(value))) return false;
    if (app.selectedSubgenres.size && ![...app.selectedSubgenres].every((value) => (game.subgenres || []).includes(value))) return false;
    return true;
  });
}

function sortGames(games) {
  const sort = document.getElementById("sortSelect")?.value || "fit";
  return games.sort((a, b) => {
    if (sort === "review") return (b.reviewPercent || 0) - (a.reviewPercent || 0) || (b.reviewCount || 0) - (a.reviewCount || 0);
    if (sort === "release") return releaseValue(b) - releaseValue(a);
    if (sort === "playtime") return Number(b.playtimeHours || 0) - Number(a.playtimeHours || 0);
    return profileFit(b) - profileFit(a) || (b.reviewPercent || 0) - (a.reviewPercent || 0) || a.title.localeCompare(b.title, "tr");
  });
}

function getGamesForView() {
  const games = allCatalogGames();
  let result;
  if (app.view === "home") {
    const threshold = app.activeProfile.kind === "custom" ? 1 : 4;
    result = games.filter((game) => !game.owned && profileFit(game) >= threshold);
  } else if (app.view === "new") {
    result = games.filter((game) => !game.owned && (game.newOnList || game.isNewRelease) && profileFit(game) > 0);
  } else if (app.view === "upcoming") {
    result = upcomingGames().filter((game) => app.state.followedUpcoming.includes(game.id) || profileFit(game) > 0);
  } else if (app.view === "low") {
    result = games.filter((game) => !game.owned && profileFit(game) > 0 && (game.profileLane === "maybe" || profileFit(game) < 5));
  } else if (app.view === "favorites") {
    result = allKnownGames().filter((game) => app.state.favorites.includes(game.id));
    result = [...result, ...libraryCards().filter((game) => app.state.favorites.includes(game.id))];
  } else if (app.view === "library") {
    result = libraryCards();
  } else if (app.view === "excluded") {
    result = allKnownGames().filter(isExcludedViewGame);
  } else {
    result = games.filter((game) => !game.owned && profileFit(game) > 0);
  }
  return sortGames(applyFilters(result));
}

function categoryList(game) {
  if (!app.cache.categories.has(game.id)) app.cache.categories.set(game.id, game.generalCategories?.length ? game.generalCategories : [game.owned ? "Library" : "Other"]);
  return app.cache.categories.get(game.id);
}
function subgenreList(game) {
  if (!app.cache.subgenres.has(game.id)) app.cache.subgenres.set(game.id, game.subgenres?.length ? game.subgenres : (game.tags || []).slice(0, 3));
  return app.cache.subgenres.get(game.id);
}

function cardHtml(game) {
  app.registry.set(game.id, game);
  const [badge, badgeClass] = laneLabel(game);
  const image = game.headerImage || game.capsuleImage;
  const fit = profileFit(game);
  const review = game.reviewPercent == null ? uiText("Steam puanı bekleniyor", "Steam rating pending") : `${game.reviewPercent}% ${uiText("olumlu", "positive")} · ${formatNumber(game.reviewCount)} ${uiText("oy", "reviews")}`;
  const tags = [...new Set([...subgenreList(game), ...categoryList(game)])].slice(0, 5);
  const isFavorite = app.state.favorites.includes(game.id);
  const isCompared = app.compareSet.has(game.id);
  const isFollowed = app.state.followedUpcoming.includes(game.id);
  return `<article class="game-card" data-game-id="${escapeHtml(game.id)}">
    <div class="game-cover">${image ? `<img src="${escapeHtml(image)}" alt="" loading="lazy">` : `<div class="cover-fallback">${escapeHtml(game.title)}</div>`}<div class="card-badges"><span class="badge ${badgeClass}">${escapeHtml(badge)}</span>${game.owned ? `<span class="badge blue">${escapeHtml(formatHours(game.playtimeHours))}</span>` : ""}</div></div>
    <div class="card-body"><div class="card-title" title="${escapeHtml(game.title)}">${escapeHtml(game.title)}</div><div class="card-reason">${escapeHtml(localizedReason(game.reason) || game.shortDescription || uiText("Profil sinyallerinle eşleşen keşif.", "A discovery matched to your profile signals."))}</div><div class="tag-row">${tags.map((tag) => `<span class="game-tag">${escapeHtml(tag)}</span>`).join("")}</div><div class="card-meta"><span>${escapeHtml(game.releaseDate || uiText("Çıkış tarihi yok", "No release date"))}</span><span class="review-meta">${escapeHtml(review.split(" · ")[0])}</span></div></div>
    <div class="card-footer"><button class="card-action ${isFavorite ? "active" : ""}" data-action="favorite">${isFavorite ? "★" : "☆"} ${uiText("Kaydet", "Save")}</button><button class="card-action ${isCompared ? "active" : ""}" data-action="compare">${isCompared ? "✓" : "+"} ${uiText("Karşılaştır", "Compare")}</button>${game.isUpcoming ? `<button class="card-action ${isFollowed ? "active" : ""}" data-action="follow">${isFollowed ? uiText("Takipte", "Following") : uiText("Takip et", "Follow")}</button>` : `<button class="card-action" data-action="cycle-plan">${escapeHtml(planLabel(game))}</button>`}<button class="card-action primary" data-action="open">${uiText("Künye ↗", "Dossier ↗")}</button></div>
  </article>`;
}

function renderCards() {
  const games = getGamesForView();
  const grid = document.getElementById("gameGrid");
  const empty = document.getElementById("emptyState");
  app.registry.clear();
  const groups = new Map();
  games.forEach((game) => categoryList(game).forEach((category) => { if (!groups.has(category)) groups.set(category, []); groups.get(category).push(game); }));
  const ordered = [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0], "tr"));
  grid.innerHTML = ordered.map(([category, items]) => {
    const key = `${app.view}:${category}`;
    const collapsed = !app.expandedGroups.has(key);
    return `<section class="category-group ${collapsed ? "collapsed" : ""}" data-category="${escapeHtml(category)}"><button class="category-group-header" aria-expanded="${String(!collapsed)}" data-toggle-category="${escapeHtml(category)}"><span><span class="category-kicker">${uiText("KATEGORİ", "CATEGORY")}</span><strong>${escapeHtml(category)}</strong></span><span class="category-count">${items.length} ${uiText("oyun", "games")} <b>⌄</b></span></button><div class="category-group-grid">${collapsed ? "" : items.map(cardHtml).join("")}</div></section>`;
  }).join("");
  empty.classList.toggle("hidden", games.length > 0);
  document.getElementById("resultCount").textContent = `${formatNumber(games.length)} ${uiText("oyun", "games")}`;
  notifyLocaleRender();
}

function renderShelves() {
  const candidates = sortGames(applyFilters(allCatalogGames().filter((game) => !game.owned && profileFit(game) > 0)));
  const shelves = [...defaultShelves, ...(app.state.shelves || []).map((shelf) => ({ ...shelf, custom: true, match: [] }))];
  const used = new Set();
  app.registry.clear();
  const html = shelves.map((shelf) => {
    let games = shelf.custom ? candidates.filter((game) => (shelf.gameIds || []).includes(game.id)) : candidates.filter((game) => shelf.match.some((term) => (game.subgenres || []).includes(term) || (game.generalCategories || []).includes(term)));
    games = dedupeGames(games);
    games.forEach((game) => used.add(game.id));
    return `<section class="shelf-section"><div class="shelf-heading"><div><span class="category-kicker">${uiText("KİŞİSEL RAF", "PERSONAL SHELF")}</span><h3>${escapeHtml(shelf.name)}</h3></div><span>${games.length} ${uiText("oyun", "games")}</span></div><div class="shelf-grid">${games.length ? games.map(cardHtml).join("") : `<div class="shelf-empty">${uiText("Bu raf için henüz eşleşen bir oyun yok.", "No matching game has been found for this shelf yet.")}</div>`}</div></section>`;
  }).join("");
  document.getElementById("gameGrid").innerHTML = html;
  document.getElementById("emptyState").classList.toggle("hidden", candidates.length > 0 || shelves.length > 0);
  document.getElementById("resultCount").textContent = `${formatNumber(used.size)} ${uiText("oyun", "games")} · ${shelves.length} ${uiText("raf", "shelves")}`;
  notifyLocaleRender();
}

function renderFilterMenu(kind, values, selected) {
  const button = document.getElementById(`${kind}FilterButton`);
  const menu = document.getElementById(`${kind}FilterMenu`);
  if (!button || !menu) return;
  const label = kind === "category" ? uiText("kategori", "categories") : uiText("alt tür", "subgenres");
  button.innerHTML = selected.size ? `${selected.size} ${label} ${uiText("seçili", "selected")} <span>⌄</span>` : `${uiText("Tüm", "All")} ${kind === "category" ? uiText("kategoriler", "categories") : uiText("alt türler", "subgenres")} <span>⌄</span>`;
  menu.innerHTML = `<div class="multi-select-head"><span>${kind === "category" ? uiText("Ana kategorileri", "Select main categories") : uiText("Alt türleri", "Select subgenres")} ${uiText("birlikte seç", "together")}</span><button type="button" data-clear-filter="${kind}">${uiText("Temizle", "Clear")}</button></div>${values.map((value) => `<label class="tag-option"><input type="checkbox" value="${escapeHtml(value)}" ${selected.has(value) ? "checked" : ""}><span>${escapeHtml(value)}</span></label>`).join("")}`;
}

function renderFilters() {
  const games = allKnownGames();
  const categories = [...new Set(games.flatMap(categoryList))].filter(Boolean).sort((a, b) => a.localeCompare(b, "tr"));
  const subgenres = [...new Set(games.flatMap(subgenreList))].filter(Boolean).sort((a, b) => a.localeCompare(b, "tr"));
  app.selectedCategories = new Set([...app.selectedCategories].filter((value) => categories.includes(value)));
  app.selectedSubgenres = new Set([...app.selectedSubgenres].filter((value) => subgenres.includes(value)));
  renderFilterMenu("category", categories, app.selectedCategories);
  renderFilterMenu("subgenre", subgenres, app.selectedSubgenres);
}

function renderCounts() {
  const games = allCatalogGames();
  const strong = games.filter((game) => !game.owned && profileFit(game) >= (app.activeProfile.kind === "custom" ? 1 : 4)).length;
  const fresh = games.filter((game) => !game.owned && (game.newOnList || game.isNewRelease) && profileFit(game) > 0).length;
  const low = games.filter((game) => !game.owned && profileFit(game) > 0 && (game.profileLane === "maybe" || profileFit(game) < 5)).length;
  const excluded = allKnownGames().filter(isExcludedViewGame).length;
  const upcoming = upcomingGames().length;
  document.getElementById("strongCount").textContent = formatNumber(strong);
  document.getElementById("newCount").textContent = formatNumber(fresh);
  document.getElementById("upcomingCount").textContent = formatNumber(upcoming);
  document.getElementById("lowCount").textContent = formatNumber(low);
  document.getElementById("favoriteCount").textContent = formatNumber(app.state.favorites.length);
  document.getElementById("libraryCount").textContent = formatNumber(app.library.length);
  document.getElementById("excludedCount").textContent = formatNumber(excluded);
  document.getElementById("metricLibrary").textContent = formatNumber(app.library.length);
  document.getElementById("metricStrong").textContent = formatNumber(strong);
  document.getElementById("metricLow").textContent = formatNumber(low);
  document.getElementById("metricUpcoming").textContent = formatNumber(upcoming);
}

function syncInitialUpdatePrompt() {
  const needsInitialUpdate = !app.catalog.lastUpdatedAt && !app.updateInProgress;
  const prompt = uiText("\u0130lk listeyi haz\u0131rlamak i\u00e7in \u015eimdi g\u00fcncelle d\u00fc\u011fmesine bas.", "Press Update now to prepare your first discovery list.");
  const button = document.getElementById("updateButton");
  if (button) {
    button.classList.toggle("needs-initial-update", needsInitialUpdate);
    button.dataset.firstUpdate = String(needsInitialUpdate);
    button.title = needsInitialUpdate ? prompt : uiText("Katalo\u011fu yenile", "Refresh catalog");
  }
  const cardButton = document.querySelector("[data-trigger-update]");
  const card = cardButton?.closest(".update-card");
  if (!card) return;
  const existing = card.querySelector(".first-update-alert");
  if (needsInitialUpdate && !existing) {
    const alert = document.createElement("div");
    alert.className = "first-update-alert";
    alert.setAttribute("role", "alert");
    alert.innerHTML = `<span class="first-update-alert-icon">!</span><div><strong>${uiText("\u0130lk g\u00fcncelleme gerekli", "First update required")}</strong><p>${prompt}</p></div>`;
    card.insertBefore(alert, card.firstChild);
  } else if (!needsInitialUpdate) existing?.remove();
  cardButton?.classList.toggle("needs-initial-update", needsInitialUpdate);
  if (cardButton) cardButton.dataset.firstUpdate = String(needsInitialUpdate);
}

function renderSync() {
  const label = app.catalog.lastUpdatedAt ? `Son: ${formatDate(app.catalog.lastUpdatedAt)}` : "İlk güncelleme bekleniyor";
  document.getElementById("topbarSync").textContent = label;
  document.getElementById("sidebarSync").textContent = app.catalog.lastUpdatedAt ? "Katalog güncel" : "Katalog hazırlanıyor";
}

function renderProfileSelect() {
  const select = document.getElementById("profileSelect");
  select.innerHTML = app.profiles.length
    ? app.profiles.map((profile) => `<option value="${escapeHtml(profile.id)}" ${profile.id === app.activeProfileId ? "selected" : ""}>${escapeHtml(profile.name)}</option>`).join("")
    : `<option value="" selected>Profil oluştur</option>`;
  select.disabled = !app.profiles.length;
}

function themeCard(theme, label, description) {
  return `<button class="theme-card ${app.settings.theme === theme ? "active" : ""}" data-theme-choice="${theme}"><span class="theme-preview ${theme}"><i></i><i></i><i></i></span><strong>${label}</strong><small>${description}</small></button>`;
}

function fontCard(font, label, description) {
  return `<button class="font-card ${app.settings.font === font ? "active" : ""}" data-font-choice="${font}"><span class="font-preview font-${font}">Aa / 01</span><strong>${label}</strong><small>${description}</small></button>`;
}

function renderProfile() {
  if (!hasActiveProfile()) {
    document.getElementById("profileView").innerHTML = `<div class="onboarding-layout"><div class="profile-panel onboarding-panel"><div class="section-kicker">İLK ADIM</div><h3>Kendi oyun pusulanı kur.</h3><p>Bu sürüm kişisel veriler veya hazır profil olmadan başlar. Sevdiğin türleri ve uzak durduğun oyun tiplerini yazarak sana özel keşif akışını oluştur.</p><div class="onboarding-points"><div><strong>Boş kütüphane</strong><span>Steam hesabından veya dosyadan isteğe bağlı aktarım yapabilirsin.</span></div><div><strong>Oynama saati şart değil</strong><span>Öneriler, yazdığın tercihler üzerinden şekillenir.</span></div><div><strong>Her profil ayrı</strong><span>İstediğin kadar profil oluşturup aralarında geçiş yapabilirsin.</span></div></div><button class="update-button onboarding-button" data-open-profile-dialog>Yeni profil oluştur <span>→</span></button></div><div class="profile-panel onboarding-panel onboarding-preview"><div class="section-kicker">HAZIR</div><div class="onboarding-orbit"><span>zevk</span><span>tür</span><span>oyun</span><b>◎</b></div><h3>Temiz bir başlangıç.</h3><p>Profilini oluşturduktan sonra katalog, filtreler ve öneriler senin seçimlerine göre görünür.</p></div></div>`;
    return;
  }
  const rules = app.activeProfile.kind === "curated"
    ? profileAnchors
    : (app.state.positiveTags || []).map((tag) => ({ text: `${cleanText(tag)} odaklı oyunlar`, direction: "more", source: "bu profilin başlangıç tercihi" }));
  const extra = app.state.extraPreferences || [];
  const blocked = app.state.blockedTypes || [];
  const rows = [...rules, ...extra, ...blocked.map((item) => ({ text: `${cleanText(item)} tipi oyunlar`, direction: "block", source: "senin dışlama kararın" }))].map((rule, index) => `<div class="rule-row"><div class="rule-copy"><span class="rule-dot ${rule.direction === "block" ? "block" : rule.direction === "less" ? "less" : ""}"></span><div><div class="rule-text">${escapeHtml(rule.text || rule)}</div><div class="rule-source">${escapeHtml(rule.source || "profil tercihi")}</div></div></div>${index >= rules.length ? `<button class="rule-remove" data-remove-preference="${Math.max(0, index - rules.length)}" title="Tercihi kaldır">×</button>` : ""}</div>`).join("");
  const positiveText = (app.state.positiveTags || []).map(cleanText).join(" · ") || "Henüz özel tercih yok";
  document.getElementById("profileView").innerHTML = `<div class="profile-layout"><div class="profile-panel profile-identity"><div class="section-kicker">AKTİF PROFİL</div><h3>${escapeHtml(app.activeProfile.name)}</h3><p>${escapeHtml(app.activeProfile.description || "Bu profil kendi tercihleriyle çalışıyor.")}</p><div class="profile-badges"><span class="profile-badge">${app.activeProfile.kind === "curated" ? "Başlangıç profili" : "Sıfırdan profil"}</span><span class="profile-badge">${formatNumber(app.library.length)} kütüphane oyunu</span></div><div class="rule-list">${rows || `<div class="profile-empty">Bu profil henüz tercih almamış. Aşağıdaki düğmeden bir tercih ekle.</div>`}</div><button class="add-rule-button" id="addPreference">＋ Yeni tercih tipi ekle</button><div class="profile-actions"><button class="ghost-button small" data-reset-profile="preferences">Tercihleri sıfırla</button><button class="text-button danger-text" data-reset-profile="profile">Profili sıfırla</button><button class="text-button danger-text delete-profile-button" data-delete-profile>Profili sil</button></div></div><div class="profile-panel"><div class="section-kicker">PROFİL SİNYALLERİ</div><h3>Ne arıyoruz?</h3><p>Bu profilde aranan ana sinyaller: <strong>${escapeHtml(positiveText)}</strong></p><div class="profile-axes"><div class="axis"><span>Koloni / üs</span><div class="axis-bar"><span style="width:${app.activeProfile.kind === "custom" ? 76 : 96}%"></span></div><span class="axis-value">${app.activeProfile.kind === "custom" ? 76 : 96}</span></div><div class="axis"><span>Tarihsel strateji</span><div class="axis-bar"><span style="width:${app.activeProfile.kind === "custom" ? 68 : 92}%"></span></div><span class="axis-value">${app.activeProfile.kind === "custom" ? 68 : 92}</span></div><div class="axis"><span>Yönetim / tycoon</span><div class="axis-bar"><span style="width:${app.activeProfile.kind === "custom" ? 61 : 84}%"></span></div><span class="axis-value">${app.activeProfile.kind === "custom" ? 61 : 84}</span></div><div class="axis"><span>Gerçekçi taktik</span><div class="axis-bar"><span style="width:${app.activeProfile.kind === "custom" ? 55 : 78}%"></span></div><span class="axis-value">${app.activeProfile.kind === "custom" ? 55 : 78}</span></div></div><div class="section-kicker profile-theme-kicker">TEMA</div><div class="theme-grid">${themeCard("neon", "Neon Pulse", "Siyan, pembe, lime")}${themeCard("field", "Field Ops", "Amber, zeytin, kum")}${themeCard("synth", "Synthwave", "Mor, cyan, magenta")}</div><label class="weekly-toggle"><input type="checkbox" data-weekly-toggle ${app.settings.weeklyUpdatesEnabled ? "checked" : ""}><span><strong>Haftalık tarama etkin</strong><small>Cuma 13:00–20:00 aralığındaki görev çalışsın.</small></span></label></div></div>`;
  const themeGrid = document.querySelector("#profileView .theme-grid");
  if (themeGrid) themeGrid.innerHTML = themeOptions.map(([id, label, description]) => themeCard(id, label, description)).join("");
  const signalsPanel = document.querySelector("#profileView .profile-panel:nth-child(2)");
  if (signalsPanel && !signalsPanel.querySelector(".font-grid")) signalsPanel.insertAdjacentHTML("beforeend", `<div class="section-kicker profile-font-kicker">YAZI TİPİ</div><div class="font-grid">${fontOptions.map(([id, label, description]) => fontCard(id, label, description)).join("")}</div>`);
  notifyLocaleRender();
}

function renderUpdates() {
  const last = app.catalog.lastUpdatedAt ? formatDate(app.catalog.lastUpdatedAt) : "Henüz çalışmadı";
  const errors = app.catalog.lastUpdateErrors?.length || 0;
  const upcoming = app.catalog.upcoming?.length || 0;
  document.getElementById("updatesView").innerHTML = `<div class="update-card"><div class="section-kicker">SİSTEM DURUMU</div><h3>Keşif akışı hazır.</h3><p>Uygulama cuma günleri 13:00–20:00 aralığında tarama yapar. Bilgisayar kapalıysa görev bir sonraki uygun açılışta tamamlanır. Manuel güncelleme notlarını, profilleri ve kararlarını silmez.</p><div class="update-detail-list"><div class="update-detail"><span>Son başarılı tarama</span><strong>${escapeHtml(last)}</strong></div><div class="update-detail"><span>Katalogdaki eşleşme</span><strong>${formatNumber(app.catalog.games?.length || 0)} oyun</strong></div><div class="update-detail"><span>Yaklaşan profil eşleşmesi</span><strong>${formatNumber(upcoming)} oyun</strong></div><div class="update-detail"><span>Haftalık arka plan görevi</span><strong class="${app.settings.weeklyUpdatesEnabled ? "update-status-good" : "update-status-warn"}">${app.settings.weeklyUpdatesEnabled ? "Etkin" : "KapalI"}</strong></div><div class="update-detail"><span>Künye alınamayan kayıt</span><strong class="${errors ? "update-status-warn" : "update-status-good"}">${errors || "Yok"}</strong></div></div><button class="update-button" data-trigger-update ${app.updateInProgress ? "disabled" : ""}>${app.updateInProgress ? "Güncelleniyor…" : "Şimdi güncelle"}</button><div class="update-instructions">Steam hesabı bağlantısı kullanılmaz. Katalog, Steam’in herkese açık mağaza künyeleri ve aktif yerel profil üzerinden yenilenir. “New on list” etiketi yalnızca ilk haftalık taramada yeni bulunan oyunlara verilir.</div></div>`;
  notifyLocaleRender();
}

const baseRenderUpdates = renderUpdates;
renderUpdates = function renderUpdatesWithInitialPrompt() {
  baseRenderUpdates();
  syncInitialUpdatePrompt();
};

function renderLibraryTools() {
  const element = document.getElementById("libraryTools");
  element.classList.toggle("hidden", app.view !== "library");
  const copy = element.firstElementChild;
  if (copy && !copy.querySelector("#libraryGuidance")) {
    const guidance = document.createElement("p");
    guidance.id = "libraryGuidance";
    guidance.className = "library-guidance";
    copy.appendChild(guidance);
  }
  const guidance = document.getElementById("libraryGuidance");
  if (guidance) guidance.textContent = uiText("K\u00fct\u00fcphanendeki oyunlar sevdi\u011fin sistemler i\u00e7in ek bir sinyaldir ve \u00f6nerileri etkiler. Bir oyunun t\u00fcr\u00fcn\u00fc \u00f6nermemizi istemiyorsan k\u00fcnyedeki \u201cBu oyun tipini \u00f6nerme\u201d se\u00e7ene\u011fini kullanabilirsin.", "Games in your library are an additional signal for the systems you enjoy and influence recommendations. If you do not want us to recommend a game's type, use \u201cDo not recommend this game type\u201d in its dossier.");
}

function renderCompareTray() {
  const tray = document.getElementById("compareTray");
  tray.classList.toggle("hidden", app.compareSet.size === 0);
  document.getElementById("compareCount").textContent = `${app.compareSet.size} / 4`;
}

function renderAll() {
  document.documentElement.dataset.theme = app.settings.theme || "neon";
  document.documentElement.dataset.background = app.settings.background || "tactical";
  document.documentElement.dataset.font = app.settings.font || "arcade";
  document.documentElement.dataset.fontSize = app.settings.fontSize || "normal";
  const freshStart = !hasActiveProfile();
  document.querySelector("#homeHero .hero-kicker").textContent = freshStart ? "HOŞ GELDİN" : "BU HAFTANIN KISA NOTU";
  document.querySelector("#homeHero h2").innerHTML = freshStart ? "Kendi pusulanı<br><em>kur.</em>" : "Sistem kurmayı<br><em>seviyorsun.</em>";
  document.querySelector("#homeHero p").textContent = freshStart
    ? "Önce sevdiğin oyun sistemlerini anlat. Oyun Pusulası, önerilerini bu seçimlere göre kurar; kişisel kütüphane aktarımı tamamen isteğe bağlıdır."
    : "Koloniler, yaşayan şehirler, gerçek tarihe dayalı strateji ve kararlarının sonuç verdiği yönetim oyunları senin keşif alanın.";
  renderCounts();
  renderSync();
  syncInitialUpdatePrompt();
  renderProfileSelect();
  renderFilters();
  renderCompareTray();
  if (freshStart) app.view = "profile";
  setView(app.view);
}

function renderCurrentView() {
  if (app.view === "shelves") renderShelves(); else renderCards();
}

function scheduleCurrentViewRender() {
  cancelAnimationFrame(app.renderFrame);
  app.renderFrame = requestAnimationFrame(() => {
    app.renderFrame = 0;
    renderCurrentView();
  });
}

function setView(view) {
  app.view = viewMeta[view] ? view : "home";
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.view === app.view));
  const meta = viewMeta[app.view];
  document.getElementById("viewEyebrow").textContent = meta[0];
  document.getElementById("viewTitle").textContent = meta[1];
  document.getElementById("viewSubtitle").textContent = meta[2];
  if (app.view === "library") {
    document.getElementById("viewEyebrow").textContent = uiText("KÜTÜPHANEM", "MY LIBRARY");
    document.getElementById("viewTitle").textContent = uiText("Kendi oyunların", "Your games");
    document.getElementById("viewSubtitle").textContent = uiText("Kütüphanendeki oyunlar, zevk profilin için ek sinyaldir.", "Games in your library are an additional signal for your taste profile.");
  }
  const special = ["profile", "updates"].includes(app.view);
  const shelves = app.view === "shelves";
  document.getElementById("homeHero").classList.toggle("hidden", app.view !== "home");
  document.getElementById("metricsRow").classList.toggle("hidden", special);
  document.getElementById("gameSection").classList.toggle("hidden", special);
  document.querySelector(".content-section").classList.toggle("hidden", special);
  document.getElementById("profileView").classList.toggle("hidden", app.view !== "profile");
  document.getElementById("updatesView").classList.toggle("hidden", app.view !== "updates");
  renderLibraryTools();
  if (app.view === "profile") renderProfile();
  else if (app.view === "updates") renderUpdates();
  else {
    const titles = {
      home: ["ÖNCELİKLİ KEŞİF", "Sana göre öneriler"], new: ["SON HAREKETLER", "Yeni keşifler"], upcoming: ["TAKİP LİSTESİ", "Yakında çıkacaklar"],
      low: ["BİR ALT RAFTA", "Düşük uyumlu ama yakın oyunlar"], favorites: ["SENİN İŞARETLEDİKLERİN", "Kayıtlı oyunlar"], library: ["AKTİF PROFİL KÜTÜPHANESİ", "Kütüphanem"],
      shelves: ["OTOMATİK RAF SİSTEMİ", "Kişisel raflar"], excluded: ["FİLTRE DIŞI", "Dışlanan oyunlar"],
    };
    const title = titles[app.view] || titles.home;
    document.getElementById("sectionKicker").textContent = title[0];
    document.getElementById("sectionTitle").textContent = title[1];
    document.getElementById("gridKicker").textContent = title[0];
    document.getElementById("gridTitle").textContent = title[1];
    if (app.view === "library") {
      document.getElementById("sectionKicker").textContent = uiText("KÜTÜPHANEM", "MY LIBRARY");
      document.getElementById("sectionTitle").textContent = uiText("Kendi oyunların", "Your games");
      document.getElementById("gridKicker").textContent = uiText("KÜTÜPHANEN", "YOUR LIBRARY");
      document.getElementById("gridTitle").textContent = uiText("Kütüphanendeki oyunlar", "Games in your library");
    }
    renderCurrentView();
  }
}

function mediaMarkup(game) {
  const movies = Array.isArray(game.movies) ? game.movies : [];
  const screenshots = Array.isArray(game.screenshots) ? game.screenshots.filter((item) => item.thumbnail || item.full).slice(0, 8) : [];
  const movie = movies.find((item) => item.mp4?.max || item.mp4?.["480"] || item.webm?.max || item.webm?.["480"]);
  const movieUrl = movie?.mp4?.max || movie?.mp4?.["480"] || movie?.webm?.max || movie?.webm?.["480"] || "";
  const movieType = movie?.mp4?.max || movie?.mp4?.["480"] ? "video/mp4" : "video/webm";
  const poster = movie?.thumbnail || game.headerImage || game.capsuleImage || "";
  if (!movieUrl && !screenshots.length) return "";
  const video = movieUrl ? `<div class="media-video" data-video-container><button class="media-video-poster" type="button" data-load-video="${escapeHtml(movieUrl)}" data-video-type="${movieType}" data-video-poster="${escapeHtml(poster)}">${poster ? `<img src="${escapeHtml(poster)}" alt="">` : ""}<span class="media-play">▶</span><strong>Fragmanı yükle</strong><small>Steam medyası · yalnızca isteyince açılır</small></button></div>` : "";
  const images = screenshots.length ? `<div class="media-gallery">${screenshots.map((item, index) => `<button type="button" class="media-thumb" data-media-image="${escapeHtml(item.full || item.thumbnail)}" data-media-alt="${escapeHtml(`${game.title} ekran görüntüsü ${index + 1}`)}"><img src="${escapeHtml(item.thumbnail || item.full)}" loading="lazy" alt=""></button>`).join("")}</div>` : "";
  return `<div class="drawer-section media-section"><div class="drawer-section-label">STEAM MEDYASI</div>${video}${images}</div>`;
}

function openMediaImage(url, alt) {
  const dialog = document.getElementById("mediaDialog");
  document.getElementById("mediaContent").innerHTML = `<img src="${escapeHtml(url)}" alt="${escapeHtml(alt || "Steam ekran görüntüsü")}">`;
  if (typeof dialog.showModal === "function") dialog.showModal();
}

function openDrawer(gameId) {
  const game = app.registry.get(gameId) || allKnownGames().find((item) => item.id === gameId) || libraryCards().find((item) => item.id === gameId);
  if (!game) return;
  app.registry.set(game.id, game);
  const image = game.headerImage || game.capsuleImage;
  const review = game.reviewPercent == null ? "Bekleniyor" : `${game.reviewPercent}% olumlu · ${formatNumber(game.reviewCount)} değerlendirme`;
  const note = app.state.notes[game.id] || "";
  const categories = categoryList(game).concat(subgenreList(game));
  const followed = app.state.followedUpcoming.includes(game.id);
  const media = mediaMarkup(game);
  document.getElementById("drawerContent").innerHTML = `<div class="drawer-cover">${image ? `<img src="${escapeHtml(image)}" alt="">` : `<div class="cover-fallback">${escapeHtml(game.title)}</div>`}</div><div class="drawer-header"><div class="section-kicker">${game.isUpcoming ? "YAKINDA ÇIKIYOR" : game.owned ? "KÜTÜPHANENDEN REFERANS" : "SANA GÖRE KEŞİF"}</div><h2>${escapeHtml(game.title)}</h2><p>${escapeHtml(game.shortDescription || "Steam mağaza özeti henüz alınmadı.")}</p></div><div class="drawer-tags">${categories.map((tag) => `<span class="game-tag">${escapeHtml(tag)}</span>`).join("")}</div><div class="drawer-facts"><div class="drawer-fact"><label>Steam puanı</label><strong>${escapeHtml(review)}</strong></div><div class="drawer-fact"><label>Çıkış</label><strong>${escapeHtml(game.releaseDate || "—")}</strong></div><div class="drawer-fact"><label>Kategori</label><strong>${escapeHtml(categoryList(game).join(" · "))}</strong></div><div class="drawer-fact"><label>Oynama</label><strong>${game.owned ? formatHours(game.playtimeHours) : "Kütüphanende değil"}</strong></div></div><div class="drawer-reason">${escapeHtml(game.reason || "Profilinle eşleşen bir keşif.")}</div>${media}<div class="drawer-section"><div class="drawer-section-label">SENİN KARARIN</div><div class="drawer-actions"><button class="drawer-action ${app.state.favorites.includes(game.id) ? "active" : ""}" data-drawer-action="favorite">${app.state.favorites.includes(game.id) ? "★ Kayıtlı" : "☆ Kaydet"}</button><button class="drawer-action ${app.compareSet.has(game.id) ? "active" : ""}" data-drawer-action="compare">${app.compareSet.has(game.id) ? "✓ Masada" : "+ Karşılaştır"}</button><button class="drawer-action" data-drawer-action="cycle-plan">Plan: ${escapeHtml(planLabel(game))}</button>${game.isUpcoming ? `<button class="drawer-action ${followed ? "active" : ""}" data-drawer-action="follow">${followed ? "Takipten çıkar" : "Çıkışı takip et"}</button>` : ""}<button class="drawer-action" data-drawer-action="add-shelf">Rafa ekle</button><button class="drawer-action" data-drawer-action="like">Beğendim</button><button class="drawer-action" data-drawer-action="dislike">Beğenmedim</button><button class="drawer-action danger" data-drawer-action="hide">Bu oyunu önerme</button><button class="drawer-action danger" data-drawer-action="block">Bu oyun tipini önerme</button></div></div><div class="drawer-section"><div class="drawer-section-label">KİŞİSEL NOT</div><textarea class="notes-area" id="drawerNote" placeholder="Bu oyun hakkında kendine bir not bırak...">${escapeHtml(note)}</textarea></div>${game.steamUrl ? `<button class="steam-link" type="button" data-open-steam="${escapeHtml(game.steamUrl)}">Steam sayfasını aç ↗</button>` : ""}`;
  if (game.owned) {
    const actionGroup = document.querySelector("#drawerContent .drawer-actions");
    actionGroup?.insertAdjacentHTML("beforebegin", "<p class=\"drawer-guidance\">" + uiText("K\u00fct\u00fcphanendeki oyunlar zevk sinyali olarak kullan\u0131l\u0131r. Bu oyunun t\u00fcr\u00fcn\u00fc \u00f6nerilere yans\u0131tmak istemiyorsan a\u015fa\u011f\u0131daki \u201cBu oyun tipini \u00f6nerme\u201d se\u00e7ene\u011fini kullanabilirsin.", "Games in your library are used as taste signals. If you do not want this game's type reflected in recommendations, use \u201cDo not recommend this game type\u201d below.") + "</p>");
  }
  document.getElementById("detailDrawer").classList.add("open");
  document.getElementById("detailDrawer").setAttribute("aria-hidden", "false");
  document.getElementById("drawerContent").dataset.gameId = game.id;
}

function closeDrawer() {
  document.getElementById("detailDrawer").classList.remove("open");
  document.getElementById("detailDrawer").setAttribute("aria-hidden", "true");
}

function toast(message, error = false) {
  const activeDialog = [...document.querySelectorAll("dialog[open]")].at(-1);
  if (activeDialog) {
    let dialogToast = activeDialog.querySelector(".dialog-toast");
    if (!dialogToast) {
      dialogToast = document.createElement("div");
      dialogToast.className = "dialog-toast";
      activeDialog.appendChild(dialogToast);
    }
    dialogToast.textContent = message;
    dialogToast.classList.toggle("error", error);
    dialogToast.classList.add("show");
    clearTimeout(app.dialogToastTimer);
    app.dialogToastTimer = setTimeout(() => dialogToast.classList.remove("show"), 4200);
    return;
  }
  const element = document.getElementById("toast");
  element.textContent = message;
  element.classList.toggle("error", error);
  element.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => element.classList.remove("show"), 3200);
}

async function persistState() {
  try {
    const response = await fetch("/api/state", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(app.state) });
    const payload = await response.json();
    if (!payload.ok) throw new Error(payload.error || "Kayıt başarısız.");
  } catch (error) { toast("Tercih kaydedilemedi. Yerel bağlantıyı kontrol et.", true); }
}

async function persistSettings() {
  try {
    const response = await fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(app.settings) });
    const payload = await response.json();
    if (payload.settings) app.settings = { ...app.settings, ...payload.settings };
  } catch (error) { toast("Tema veya güncelleme ayarı kaydedilemedi.", true); }
}

async function openDefaultBrowser(url) {
  try {
    const response = await fetch("/api/open-url", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
    const payload = await response.json();
    if (!payload.ok) throw new Error(payload.error || "Bağlantı açılamadı.");
  } catch (error) { toast(error.message, true); }
}

function inferTags(text) {
  const normalizedText = normalize(text);
  return Object.entries(tagAliases).filter(([, aliases]) => aliases.some((alias) => normalizedText.includes(normalize(alias)))).map(([tag]) => tag);
}

async function handleAction(action, game) {
  if (!game) return;
  if (action === "favorite") {
    app.state.favorites = app.state.favorites.includes(game.id) ? app.state.favorites.filter((id) => id !== game.id) : [...app.state.favorites, game.id];
    toast(app.state.favorites.includes(game.id) ? "Kayıtlılara eklendi." : "Kayıtlılardan çıkarıldı.");
  } else if (action === "like") {
    if (!app.state.likedGames.includes(game.id)) app.state.likedGames.push(game.id);
    const learned = [...new Set([...(game.subgenres || []), ...(game.tags || [])])].slice(0, 3);
    app.state.positiveTags = [...new Set([...(app.state.positiveTags || []), ...learned])];
    toast("Tercihin kaydedildi; listeler hemen yenilendi.");
  } else if (action === "dislike") {
    if (!app.state.dislikedGames.includes(game.id)) app.state.dislikedGames.push(game.id);
    if (!app.state.hiddenGames.includes(game.id)) app.state.hiddenGames.push(game.id);
    toast("Beğenmeme kararın kaydedildi; listeler hemen yenilendi.");
    closeDrawer();
  } else if (action === "hide") {
    if (!app.state.hiddenGames.includes(game.id)) app.state.hiddenGames.push(game.id);
    toast("Bu oyun ana listeden gizlendi.");
    closeDrawer();
  } else if (action === "block") {
    const suggested = game.subgenres?.[0] || game.tags?.[0] || "";
    const type = window.prompt("Bu oyunun hangi tipini önermeyelim?", suggested);
    if (!type?.trim()) return;
    if (!app.state.blockedTypes.some((item) => normalize(item) === normalize(type))) app.state.blockedTypes.push(type.trim());
    toast(`${type.trim()} tipi önerilerden çıkarıldı.`);
    closeDrawer();
  } else if (action === "compare") {
    if (app.compareSet.has(game.id)) app.compareSet.delete(game.id);
    else if (app.compareSet.size >= 4) { toast("Karşılaştırma masası en fazla 4 oyun alır.", true); return; }
    else app.compareSet.add(game.id);
    toast(app.compareSet.has(game.id) ? "Karşılaştırma masasına eklendi." : "Karşılaştırma masasından çıkarıldı.");
  } else if (action === "follow") {
    app.state.followedUpcoming = app.state.followedUpcoming.includes(game.id) ? app.state.followedUpcoming.filter((id) => id !== game.id) : [...app.state.followedUpcoming, game.id];
    toast(app.state.followedUpcoming.includes(game.id) ? "Çıkış takibe alındı." : "Çıkış takibinden çıkarıldı.");
  } else if (action === "cycle-plan") {
    const current = app.state.plan?.[game.id];
    const nextIndex = current ? (planOrder.indexOf(current) + 1) % planOrder.length : 0;
    app.state.plan[game.id] = planOrder[nextIndex];
    toast(`Oyun planına eklendi: ${planLabels[planOrder[nextIndex]]}.`);
  } else if (action === "add-shelf") {
    const name = window.prompt("Oyunu hangi kişisel rafa ekleyelim?", "Yeni raf");
    if (!name?.trim()) return;
    const shelf = app.state.shelves.find((item) => normalize(item.name) === normalize(name));
    if (shelf) shelf.gameIds = [...new Set([...(shelf.gameIds || []), game.id])];
    else app.state.shelves.push({ id: `custom-${Date.now()}`, name: name.trim(), gameIds: [game.id] });
    toast("Oyun kişisel rafa eklendi.");
  }
  await persistState();
  renderCounts();
  renderCompareTray();
  if (app.view === "profile") renderProfile(); else if (app.view === "shelves") renderShelves(); else renderCards();
  if (document.getElementById("detailDrawer").classList.contains("open")) openDrawer(game.id);
}

function openPreferenceDialog() {
  const dialog = document.getElementById("preferenceDialog");
  document.getElementById("preferenceText").value = "";
  document.getElementById("preferenceDirection").value = "more";
  if (typeof dialog.showModal === "function") dialog.showModal();
}

async function savePreference(event) {
  if (event.submitter?.value === "cancel") return;
  event.preventDefault();
  const text = document.getElementById("preferenceText").value.trim();
  const direction = document.getElementById("preferenceDirection").value;
  if (!text) { toast("Önce bir tercih yaz.", true); return; }
  const tags = inferTags(text);
  app.state.extraPreferences.push({ text, direction, tags, source: "senin eklediğin kural", createdAt: new Date().toISOString() });
  if (direction === "more") app.state.positiveTags = [...new Set([...(app.state.positiveTags || []), ...tags])];
  if (direction === "block") app.state.blockedTypes = [...new Set([...(app.state.blockedTypes || []), ...tags])];
  await persistState();
  document.getElementById("preferenceDialog").close();
  toast("Tercihin kaydedildi; listeler hemen yenilendi.");
  renderAll();
}

function openProfileDialog() {
  ["newProfileName", "newProfileDescription", "newProfilePreferences", "newProfileBlocks"].forEach((id) => { document.getElementById(id).value = ""; });
  const dialog = document.getElementById("profileDialog");
  if (typeof dialog.showModal === "function") dialog.showModal();
}

async function createProfile(event) {
  if (event.submitter?.value === "cancel") return;
  event.preventDefault();
  const name = document.getElementById("newProfileName").value.trim();
  const description = document.getElementById("newProfileDescription").value.trim();
  const preferences = document.getElementById("newProfilePreferences").value.trim();
  const blocks = document.getElementById("newProfileBlocks").value.trim();
  if (!name) { toast("Profile bir ad ver.", true); return; }
  const positiveTags = inferTags(preferences);
  const blockedTypes = inferTags(blocks);
  const extraPreferences = [];
  if (preferences) extraPreferences.push({ text: preferences, direction: "more", tags: positiveTags, source: "profil oluşturulurken yazıldı" });
  if (blocks) extraPreferences.push({ text: blocks, direction: "block", tags: blockedTypes, source: "profil oluşturulurken yazıldı" });
  try {
    const response = await fetch("/api/profile/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, description, positiveTags, blockedTypes, extraPreferences }) });
    const payload = await response.json();
    if (!payload.ok) throw new Error(payload.error || "Profil oluşturulamadı.");
    document.getElementById("profileDialog").close();
    applyBundle(payload.bundle);
    setView("profile");
    toast(`${name} profili hazır. Kütüphane boş başladı.`);
  } catch (error) { toast(error.message, true); }
}

async function switchProfile(profileId) {
  if (!profileId || profileId === app.activeProfileId) return;
  try {
    const response = await fetch("/api/profile/switch", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profileId }) });
    const payload = await response.json();
    if (!payload.ok) throw new Error(payload.error || "Profil değiştirilemedi.");
    app.compareSet.clear();
    applyBundle(payload.bundle);
    toast(`${app.activeProfile.name} profiline geçildi.`);
  } catch (error) { toast(error.message, true); }
}

async function resetProfile(mode) {
  const label = mode === "profile" ? "aktif profili ve bu profile eklenen oyunları" : "aktif profilin tercihlerini";
  if (!window.confirm(`${label} sıfırlansın mı?`)) return;
  try {
    const response = await fetch("/api/profile/reset", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode }) });
    const payload = await response.json();
    if (!payload.ok) throw new Error(payload.error || "Sıfırlama başarısız.");
    app.compareSet.clear();
    applyBundle(payload.bundle);
    toast("Profil ayarları sıfırlandı.");
  } catch (error) { toast(error.message, true); }
}

async function deleteProfile() {
  if (!app.activeProfile?.id) return;
  const name = app.activeProfile.name || "aktif profil";
  if (!window.confirm(`“${name}” profili ve bu profile ait kararlar silinsin mi?`)) return;
  try {
    const response = await fetch("/api/profile/delete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profileId: app.activeProfile.id }) });
    const payload = await response.json();
    if (!payload.ok) throw new Error(payload.error || "Profil silinemedi.");
    app.compareSet.clear();
    applyBundle(payload.bundle);
    toast(payload.bundle?.activeProfileId ? `${name} profili silindi.` : "Profil silindi. Yeni bir profil oluşturabilirsin.");
  } catch (error) { toast(error.message, true); }
}

async function searchSteam(query) {
  const resultBox = document.getElementById("librarySearchResults");
  if (!resultBox) return;
  if (query.length < 2) { resultBox.innerHTML = ""; return; }
  resultBox.innerHTML = `<div class="search-loading">Steam aranıyor…</div>`;
  try {
    const response = await fetch("/api/steam-search", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query }) });
    const payload = await response.json();
    if (!payload.ok) throw new Error(payload.error || "Steam araması başarısız.");
    resultBox.innerHTML = payload.results.length ? payload.results.map((item) => `<button class="library-result" type="button" data-add-library="${item.steamAppId}"><img src="${escapeHtml(item.capsuleImage)}" alt=""><span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.releaseDate || "Çıkış tarihi yok")}</small></span><b>＋</b></button>`).join("") : `<div class="search-loading">Eşleşme bulunamadı.</div>`;
  } catch (error) { resultBox.innerHTML = `<div class="search-loading error-copy">${escapeHtml(error.message)}</div>`; }
}

async function addLibraryGame(appId) {
  const item = [...document.querySelectorAll(`[data-add-library="${appId}"]`)][0];
  const title = item?.querySelector("strong")?.textContent || "Steam oyunu";
  try {
    const response = await fetch("/api/library/add", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ steamAppId: Number(appId), title }) });
    const payload = await response.json();
    if (!payload.ok) throw new Error(payload.error || "Kütüphaneye eklenemedi.");
    applyBundle(payload.bundle);
    document.getElementById("librarySearchResults").innerHTML = "";
    document.getElementById("librarySearchInput").value = "";
    toast(`${title} aktif profilin kütüphanesine eklendi.`);
  } catch (error) { toast(error.message, true); }
}

function openSteamImport() {
  const dialog = document.getElementById("steamImportDialog");
  document.getElementById("steamApiKey").value = "";
  document.getElementById("steamProfileRef").value = "";
  document.getElementById("steamImportStatus").textContent = "API anahtarı bu uygulamada saklanmaz.";
  if (typeof dialog.showModal === "function") dialog.showModal();
}

async function importSteamLibrary(event) {
  if (event.submitter?.value === "cancel") return;
  event.preventDefault();
  const key = document.getElementById("steamApiKey").value.trim();
  const profileRef = document.getElementById("steamProfileRef").value.trim();
  const includeFreeGames = document.getElementById("steamIncludeFreeGames").checked;
  if (!key || !profileRef) { toast("Steam API anahtarını ve profil bağlantısını doldur.", true); return; }
  if (app.library.length && !window.confirm("Bu profilin mevcut kütüphanesi Steam’den gelen listeyle güncellensin mi?")) return;
  const button = document.getElementById("steamImportButton");
  button.disabled = true;
  document.getElementById("steamImportStatus").textContent = "Steam kütüphanesi alınıyor…";
  try {
    const response = await fetch("/api/steam-import", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key, profileRef, includeFreeGames }) });
    const payload = await response.json();
    if (!payload.ok) throw new Error(payload.error || "Steam kütüphanesi alınamadı.");
    document.getElementById("steamImportDialog").close();
    applyBundle(payload.bundle);
    setView("library");
    toast(`${formatNumber(payload.importedCount || app.library.length)} Steam oyunu aktarıldı.`);
  } catch (error) {
    document.getElementById("steamImportStatus").textContent = error.message;
    toast(error.message, true);
  } finally {
    button.disabled = false;
  }
}

function parseDelimitedLine(line, delimiter = ",") {
  const cells = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"' && line[index + 1] === '"') { value += '"'; index += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === delimiter && !quoted) { cells.push(value.trim()); value = ""; }
    else value += char;
  }
  cells.push(value.trim());
  return cells;
}

function normalizeImportedEntry(item) {
  const steamAppId = Number(item.steamAppId || item.appid || item.appId || item.appID || item.id || 0);
  const name = String(item.name || item.title || item.game_name || item.gameName || "").trim();
  const hourValue = item.playtimeHours ?? item.hoursOnRecord ?? item.hoursPlayed ?? item.playtime_forever_hours;
  const minuteValue = item.playtimeForeverMinutes ?? item.playtime_forever ?? item.playtime_minutes;
  const playtimeHours = hourValue !== undefined && hourValue !== "" ? Number(hourValue) : Number(minuteValue || 0) / 60;
  if (!name && !steamAppId) return null;
  return { steamAppId: steamAppId || undefined, name: name || `Steam oyunu ${steamAppId}`, playtimeHours: Number.isFinite(playtimeHours) ? Math.round(playtimeHours * 10) / 10 : 0, owned: true };
}

function parseLibraryFileText(fileName, text) {
  const lower = fileName.toLocaleLowerCase("tr-TR");
  if (lower.endsWith(".json")) {
    const parsed = JSON.parse(text);
    return (Array.isArray(parsed) ? parsed : (parsed.games || parsed.library || parsed.applist?.apps || [])).map(normalizeImportedEntry).filter(Boolean);
  }
  if (lower.endsWith(".xml")) {
    return [...text.matchAll(/<game\b[\s\S]*?<\/game>/gi)].map((match) => {
      const block = match[0];
      const read = (tag) => block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"))?.[1]?.replace(/<!\[CDATA\[|\]\]>/g, "").trim() || "";
      return normalizeImportedEntry({ appID: read("appID"), name: read("name"), hoursOnRecord: read("hoursOnRecord") });
    }).filter(Boolean);
  }
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return [];
  const delimiter = lines[0].includes("\t") ? "\t" : ",";
  const headers = parseDelimitedLine(lines[0], delimiter).map((header) => normalize(header));
  return lines.slice(1).map((line) => {
    const values = parseDelimitedLine(line, delimiter);
    return normalizeImportedEntry(Object.fromEntries(headers.map((header, index) => [header, values[index] || ""])));
  }).filter(Boolean);
}

async function importLibraryFile(file) {
  try {
    const games = parseLibraryFileText(file.name, await file.text());
    if (!games.length) throw new Error("Dosyada tanınan oyun kaydı bulunamadı.");
    const response = await fetch("/api/library/import", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ games }) });
    const payload = await response.json();
    if (!payload.ok) throw new Error(payload.error || "Dosya aktarımı başarısız.");
    applyBundle(payload.bundle);
    setView("library");
    toast(`${formatNumber(payload.importedCount || games.length)} oyun dosyadan aktarıldı.`);
  } catch (error) { toast(error.message, true); }
}

function openCompare() {
  const games = [...app.compareSet].map((id) => app.registry.get(id) || allKnownGames().find((game) => game.id === id)).filter(Boolean);
  if (games.length < 2) { toast("Karşılaştırmak için en az 2 oyun seç.", true); return; }
  document.getElementById("compareContent").innerHTML = `<div class="compare-table-wrap"><table class="compare-table"><thead><tr><th>Ölçüt</th>${games.map((game) => `<th>${escapeHtml(game.title)}</th>`).join("")}</tr></thead><tbody><tr><td>Steam puanı</td>${games.map((game) => `<td>${game.reviewPercent == null ? "Bekleniyor" : `${game.reviewPercent}% · ${formatNumber(game.reviewCount)} oy`}</td>`).join("")}</tr><tr><td>Çıkış</td>${games.map((game) => `<td>${escapeHtml(game.releaseDate || "—")}</td>`).join("")}</tr><tr><td>Ana kategori</td>${games.map((game) => `<td>${escapeHtml(categoryList(game).join(" · "))}</td>`).join("")}</tr><tr><td>Alt tür</td>${games.map((game) => `<td>${escapeHtml(subgenreList(game).join(" · "))}</td>`).join("")}</tr><tr><td>Profil uyumu</td>${games.map((game) => `<td>${profileFit(game) < 0 ? "Dışarıda" : `${profileFit(game)} sinyal`}</td>`).join("")}</tr><tr><td>Oyun planı</td>${games.map((game) => `<td>${escapeHtml(planLabel(game))}</td>`).join("")}</tr></tbody></table></div>`;
  const dialog = document.getElementById("compareDialog");
  if (typeof dialog.showModal === "function") dialog.showModal();
}

async function runUpdate() {
  if (app.updateInProgress) return;
  app.updateInProgress = true;
  syncInitialUpdatePrompt();
  document.getElementById("updateButton").disabled = true;
  document.getElementById("updateButton").innerHTML = "<span class=\"update-icon\">↻</span><span>Güncelleniyor…</span>";
  if (app.view === "updates") renderUpdates();
  try {
    const response = await fetch("/api/update", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ weekly: false }) });
    const payload = await response.json();
    if (!payload.ok) throw new Error(payload.error || "Güncelleme başarısız.");
    applyBundle(payload);
    toast(`${formatNumber(app.catalog.games.length)} oyun ve ${formatNumber(app.catalog.upcoming?.length || 0)} upcoming kaydı yenilendi.`);
  } catch (error) { toast(`Güncelleme yapılamadı: ${error.message}`, true); }
  finally {
    app.updateInProgress = false;
    document.getElementById("updateButton").disabled = false;
    document.getElementById("updateButton").innerHTML = "<span class=\"update-icon\">↻</span><span>Şimdi güncelle</span>";
    syncInitialUpdatePrompt();
    if (app.view === "updates") renderUpdates();
  }
}

function applyBundle(bundle) {
  if (!bundle) return;
  app.library = bundle.library || [];
  app.catalog = bundle.catalog || { games: [], upcoming: [] };
  app.state = { ...defaultState(), ...(bundle.state || {}) };
  app.settings = { ...app.settings, ...(bundle.settings || {}) };
  app.profiles = bundle.profiles || app.profiles;
  app.activeProfileId = bundle.activeProfileId ?? null;
  app.activeProfile = bundle.activeProfile || { id: null, name: "Yeni profil oluştur", description: "Henüz bir profil oluşturulmadı.", kind: "custom" };
  resetDerivedCache();
  app.expandedGroups.clear();
  document.documentElement.dataset.theme = app.settings.theme || "neon";
  document.documentElement.dataset.background = app.settings.background || "tactical";
  document.documentElement.dataset.font = app.settings.font || "arcade";
  document.documentElement.dataset.fontSize = app.settings.fontSize || "normal";
  renderAll();
  if (!hasActiveProfile()) window.setTimeout(() => {
    const dialog = document.getElementById("profileDialog");
    if (dialog && !dialog.open) openProfileDialog();
  }, 80);
}

async function bootstrap() {
  try {
    const response = await fetch("/api/bootstrap");
    const payload = await response.json();
    applyBundle(payload);
  } catch (error) { toast("Yerel uygulama sunucusuna bağlanılamadı.", true); }
}

document.addEventListener("click", async (event) => {
  const nav = event.target.closest("[data-view]");
  if (nav) { setView(nav.dataset.view); return; }
  const viewLink = event.target.closest("[data-view-link]");
  if (viewLink) { setView(viewLink.dataset.viewLink); return; }
  const scrollTarget = event.target.closest("[data-scroll-target]");
  if (scrollTarget) { document.getElementById(scrollTarget.dataset.scrollTarget)?.scrollIntoView({ behavior: "smooth" }); return; }
  if (event.target.closest("[data-close-drawer]")) { closeDrawer(); return; }
  if (event.target.closest("[data-close-media]")) { document.getElementById("mediaDialog")?.close(); return; }
  const mediaImage = event.target.closest("[data-media-image]");
  if (mediaImage) { openMediaImage(mediaImage.dataset.mediaImage, mediaImage.dataset.mediaAlt); return; }
  const loadVideo = event.target.closest("[data-load-video]");
  if (loadVideo) {
    const container = loadVideo.closest("[data-video-container]");
    const url = loadVideo.dataset.loadVideo;
    const type = loadVideo.dataset.videoType || "video/mp4";
    const poster = loadVideo.dataset.videoPoster;
    if (container && url) container.innerHTML = `<video controls preload="metadata" poster="${escapeHtml(poster)}"><source src="${escapeHtml(url)}" type="${escapeHtml(type)}"></video>`;
    return;
  }
  const closeDialog = event.target.closest("[data-close-dialog]");
  if (closeDialog) { document.getElementById(closeDialog.dataset.closeDialog)?.close(); return; }
  if (event.target.closest("#dismissNotice")) { document.getElementById("noticeStrip").classList.add("hidden"); return; }
  const steamLink = event.target.closest("[data-open-steam]");
  if (steamLink) { await openDefaultBrowser(steamLink.dataset.openSteam); return; }
  const filterButton = event.target.closest("#categoryFilterButton, #subgenreFilterButton");
  if (filterButton) {
    const wrap = filterButton.closest(".multi-select");
    document.querySelectorAll(".multi-select").forEach((item) => { if (item !== wrap) item.classList.remove("open"); });
    const open = !wrap.classList.contains("open");
    wrap.classList.toggle("open", open);
    filterButton.setAttribute("aria-expanded", String(open));
    return;
  }
  const clearFilter = event.target.closest("[data-clear-filter]");
  if (clearFilter) {
    if (clearFilter.dataset.clearFilter === "category") app.selectedCategories.clear(); else app.selectedSubgenres.clear();
    renderFilters();
    if (app.view === "shelves") renderShelves(); else renderCards();
    return;
  }
  const categoryToggle = event.target.closest("[data-toggle-category]");
  if (categoryToggle) {
    const key = `${app.view}:${categoryToggle.dataset.toggleCategory}`;
    if (app.expandedGroups.has(key)) app.expandedGroups.delete(key); else app.expandedGroups.add(key);
    renderCards();
    return;
  }
  if (event.target.closest("#updateButton") || event.target.closest("[data-trigger-update]")) { await runUpdate(); return; }
  if (event.target.closest("#newProfileButton")) { openProfileDialog(); return; }
  if (event.target.closest("[data-open-profile-dialog]")) { openProfileDialog(); return; }
  if (event.target.closest("#addPreference")) { openPreferenceDialog(); return; }
  const theme = event.target.closest("[data-theme-choice]");
  if (theme) { app.settings.theme = theme.dataset.themeChoice; await persistSettings(); renderAll(); return; }
  const font = event.target.closest("[data-font-choice]");
  if (font) { app.settings.font = font.dataset.fontChoice; await persistSettings(); renderAll(); return; }
  const reset = event.target.closest("[data-reset-profile]");
  if (reset) { await resetProfile(reset.dataset.resetProfile); return; }
  if (event.target.closest("[data-delete-profile]")) { await deleteProfile(); return; }
  if (event.target.closest("[data-open-compare]")) { openCompare(); return; }
  if (event.target.closest("[data-clear-compare]")) { app.compareSet.clear(); renderCompareTray(); renderCards(); return; }
  if (event.target.closest("[data-open-steam-import]")) { openSteamImport(); return; }
  if (event.target.closest("[data-import-library-file]")) { document.getElementById("libraryImportFile").click(); return; }
  const addLibrary = event.target.closest("[data-add-library]");
  if (addLibrary) { await addLibraryGame(addLibrary.dataset.addLibrary); return; }
  const remove = event.target.closest("[data-remove-preference]");
  if (remove) { app.state.extraPreferences.splice(Number(remove.dataset.removePreference), 1); await persistState(); renderAll(); return; }
  const card = event.target.closest(".game-card");
  if (card) {
    const game = app.registry.get(card.dataset.gameId);
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (action) { if (action === "open") openDrawer(card.dataset.gameId); else await handleAction(action, game); return; }
    openDrawer(card.dataset.gameId);
    return;
  }
  const drawerAction = event.target.closest("[data-drawer-action]");
  if (drawerAction) {
    const game = app.registry.get(document.getElementById("drawerContent").dataset.gameId);
    await handleAction(drawerAction.dataset.drawerAction, game);
  }
});

document.addEventListener("change", async (event) => {
  if (event.target.id === "profileSelect") { await switchProfile(event.target.value); return; }
  if (event.target.id === "drawerNote") {
    const gameId = document.getElementById("drawerContent").dataset.gameId;
    app.state.notes[gameId] = event.target.value;
    await persistState();
    toast("Not kaydedildi.");
    return;
  }
  if (event.target.matches("#categoryFilterMenu input, #subgenreFilterMenu input")) {
    const targetSet = event.target.closest("#categoryFilterMenu") ? app.selectedCategories : app.selectedSubgenres;
    if (event.target.checked) targetSet.add(event.target.value); else targetSet.delete(event.target.value);
    renderFilters();
    scheduleCurrentViewRender();
    return;
  }
  if (event.target.matches("[data-weekly-toggle]")) {
    app.settings.weeklyUpdatesEnabled = event.target.checked;
    await persistSettings();
    toast(event.target.checked ? "Haftalık tarama açıldı." : "Haftalık tarama kapatıldı.");
    renderProfile();
  }
});

document.addEventListener("input", (event) => {
  if (event.target.id === "searchInput") { scheduleCurrentViewRender(); return; }
  if (event.target.id === "librarySearchInput") {
    clearTimeout(app.steamSearchTimer);
    app.steamSearchTimer = setTimeout(() => searchSteam(event.target.value.trim()), 350);
  }
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".multi-select")) document.querySelectorAll(".multi-select").forEach((wrap) => wrap.classList.remove("open"));
});

document.getElementById("preferenceForm").addEventListener("submit", savePreference);
document.getElementById("profileForm").addEventListener("submit", createProfile);
document.getElementById("steamImportForm").addEventListener("submit", importSteamLibrary);
document.getElementById("libraryImportFile").addEventListener("change", (event) => { const file = event.target.files?.[0]; if (file) importLibraryFile(file); event.target.value = ""; });
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeDrawer(); });

if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
bootstrap();

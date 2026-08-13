(() => {
  "use strict";

  const CURRENT_VERSION = "1.0.1";
  const REPOSITORY_URL = "https://github.com/bomontius/gamecompass";
  const messages = {
    tr: {
      github: "GitHub deposu",
      madeBy: "Made by Bomontius",
      releaseTitle: "Yeni bir s\u00fcr\u00fcm mevcut",
      releaseOpen: "GitHub release\u2019i a\u00e7",
      sizeTitle: "YAZI BOYUTU",
      small: "K\u00fc\u00e7\u00fck",
      normal: "Normal",
      large: "B\u00fcy\u00fck",
      backgroundTitle: "ARKA PLAN",
      backgroundBody: "Pusulanın atmosferini değiştir. Görseller hafif canlı/parallax hareketiyle arka planda çalışır.",
      backgroundTactical: "Tactical worlds",
      backgroundNeon: "Neon frontier",
      backgroundManagement: "Historical systems",
      backupKicker: "YEREL PROF\u0130L YEDE\u011e\u0130",
      backupTitle: "Profillerini sakla",
      backupBody: "Profil tercihlerini ve yerel k\u00fct\u00fcphanelerini bu bilgisayarda bir JSON dosyas\u0131 olarak yedekleyebilir, daha sonra geri y\u00fckleyebilirsin.",
      backupExport: "Yede\u011fi indir",
      backupImport: "Yede\u011fi y\u00fckle",
      backupConfirm: "Bu i\u015flem mevcut profilleri ve ayarlar\u0131 yedekteki bilgilerle de\u011fi\u015ftirir. Devam edilsin mi?",
      backupDone: "Profil yede\u011fi indirildi.",
      restoreDone: "Profil yede\u011fi y\u00fcklendi.",
      backupError: "Profil yede\u011fi i\u015flenemedi.",
      importFolderError: "Profil klasöründe profiles.json, library.json veya geçerli bir ayar bulunamadı.",
      updateVersion: "S\u00fcr\u00fcm",
      languageTitle: "Uygulama dili",
    },
    en: {
      github: "GitHub repository",
      madeBy: "Made by Bomontius",
      releaseTitle: "A new version is available",
      releaseOpen: "Open GitHub release",
      sizeTitle: "FONT SIZE",
      small: "Small",
      normal: "Normal",
      large: "Large",
      backgroundTitle: "BACKGROUND",
      backgroundBody: "Change the atmosphere of your compass. The artwork stays lightweight with a subtle live/parallax motion.",
      backgroundTactical: "Tactical worlds",
      backgroundNeon: "Neon frontier",
      backgroundManagement: "Historical systems",
      backupKicker: "LOCAL PROFILE BACKUP",
      backupTitle: "Keep your profiles safe",
      backupBody: "Export your profile preferences and local libraries to a JSON file, then restore them whenever you need.",
      backupExport: "Download backup",
      backupImport: "Restore backup",
      backupConfirm: "This replaces the current profiles and settings with the backup contents. Continue?",
      backupDone: "Profile backup downloaded.",
      restoreDone: "Profile backup restored.",
      backupError: "The profile backup could not be processed.",
      importFolderError: "The profile folder did not contain a valid profiles.json, library.json or settings file.",
      updateVersion: "Version",
      languageTitle: "App language",
    },
  };

  const state = { release: null, decorating: false, frame: 0 };

  function language() {
    return app.settings?.language === "en" ? "en" : "tr";
  }

  function text(key) {
    return messages[language()][key] || messages.tr[key] || key;
  }

  function applyFontSize() {
    const value = ["small", "normal", "large"].includes(app.settings?.fontSize) ? app.settings.fontSize : "normal";
    document.documentElement.dataset.fontSize = value;
  }

  function applyV030Language() {
    applyFontSize();
    const set = (id, value) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    };
    const githubIcon = document.querySelector("#githubLink svg");
    if (githubIcon && !githubIcon.dataset.gcReady) {
      githubIcon.innerHTML = '<path d="M12 .5C5.65 .5 .5 5.65 .5 12c0 5.09 3.3 9.4 7.88 10.93.58.1.79-.25.79-.56v-2.16c-3.2.7-3.88-1.54-3.88-1.54-.53-1.37-1.28-1.73-1.28-1.73-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.56-.29-5.26-1.28-5.26-5.68 0-1.25.45-2.28 1.18-3.08-.12-.3-.51-1.47.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.05.73.8 1.18 1.83 1.18 3.08 0 4.41-2.7 5.39-5.27 5.67.41.35.78 1.04.78 2.1v2.96c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35 .5 12 .5z"/>';
      githubIcon.dataset.gcReady = "true";
    }
    set("githubLinkLabel", text("github"));
    set("madeByLabel", text("madeBy"));
    set("releaseUpdateTitle", text("releaseTitle"));
    set("releaseUpdateOpen", text("releaseOpen"));
    set("backupKicker", text("backupKicker"));
    set("backupTitle", text("backupTitle"));
    set("backupBody", text("backupBody"));
    set("backupExport", text("backupExport"));
    set("backupImport", text("backupImport"));
    set("fontSizeKicker", text("sizeTitle"));
    set("backgroundKicker", text("backgroundTitle"));
    set("backgroundBody", text("backgroundBody"));
    document.querySelectorAll("[data-gc-background]").forEach((button) => {
      const key = button.dataset.gcBackground || "tactical";
      const label = button.querySelector("[data-gc-background-label]");
      if (label) label.textContent = text(`background${key[0].toUpperCase()}${key.slice(1)}`);
    });
    document.querySelectorAll("[data-gc-font-size]").forEach((button) => {
      const key = button.dataset.gcFontSize || "normal";
      const label = button.querySelector(".font-size-label") || button;
      label.textContent = text(key);
    });
    const version = document.getElementById("releaseUpdateVersion");
    if (version && state.release) version.textContent = `${text("updateVersion")} ${state.release.tag}`;
  }

  function fontSizeMarkup(current) {
    return `<div class="section-kicker font-size-kicker" id="fontSizeKicker">${text("sizeTitle")}</div><div class="font-size-grid" id="fontSizeGrid">${["small", "normal", "large"].map((value) => `<button type="button" class="font-size-choice ${current === value ? "active" : ""}" data-font-size-choice="${value}"><span class="font-size-sample font-size-${value}">Aa</span><span data-gc-font-size="${value}">${text(value)}</span></button>`).join("")}</div>`;
  }

  function backgroundMarkup(current) {
    const options = [
      ["tactical", "backgroundTactical", "background-tactical.png"],
      ["neon", "backgroundNeon", "background-neon.png"],
      ["management", "backgroundManagement", "background-management.png"],
    ];
    return `<div class="section-kicker background-kicker" id="backgroundKicker">${text("backgroundTitle")}</div><p class="background-body" id="backgroundBody">${text("backgroundBody")}</p><div class="background-grid">${options.map(([id, key, file]) => `<button type="button" class="background-choice ${current === id ? "active" : ""}" data-gc-background="${id}"><img src="/assets/backgrounds/${file}" alt="" loading="lazy" decoding="async"><span class="background-choice-overlay"><strong data-gc-background-label>${text(key)}</strong><small>${id === "tactical" ? "01" : id === "neon" ? "02" : "03"}</small></span></button>`).join("")}</div>`;
  }

  function wizardFontSizeMarkup(current) {
    return `<div class="wizard-section-label">${text("sizeTitle")}</div><div class="font-size-grid wizard-font-size-grid" id="gcWizardFontSize"><button type="button" class="font-size-choice ${current === "small" ? "active" : ""}" data-gc-font-size="small"><span class="font-size-sample font-size-small">Aa</span><span class="font-size-label">${text("small")}</span></button><button type="button" class="font-size-choice ${current === "normal" ? "active" : ""}" data-gc-font-size="normal"><span class="font-size-sample font-size-normal">Aa</span><span class="font-size-label">${text("normal")}</span></button><button type="button" class="font-size-choice ${current === "large" ? "active" : ""}" data-gc-font-size="large"><span class="font-size-sample font-size-large">Aa</span><span class="font-size-label">${text("large")}</span></button></div>`;
  }

  function wizardLanguageMarkup(current) {
    return `<label class="form-label" for="gcWizardLanguage">${text("languageTitle")}</label><select id="gcWizardLanguage"><option value="tr" ${current === "tr" ? "selected" : ""}>T\u00fcrk\u00e7e</option><option value="en" ${current === "en" ? "selected" : ""}>English</option></select>`;
  }

  function decorateWizard() {
    const draft = window.__gcWizard?.draft;
    const step = window.__gcWizard?.step;
    if (!draft) return false;
    let changed = false;
    const languageSelect = document.getElementById("gcWizardLanguage");
    if (step === 1 && !languageSelect) {
      const intro = document.querySelector("#profileForm .wizard-step-copy");
      if (intro) { intro.insertAdjacentHTML("afterend", wizardLanguageMarkup(draft.language || language())); changed = true; }
    }
    if (step === 4 && languageSelect) {
      const languageLabel = languageSelect.previousElementSibling;
      if (languageLabel?.matches(".form-label")) languageLabel.remove();
      languageSelect.remove();
      changed = true;
    }
    if (step === 4 && !document.getElementById("gcWizardFontSize")) {
      const fontGrid = document.querySelector("#profileForm .wizard-font-grid");
      if (fontGrid) { fontGrid.insertAdjacentHTML("afterend", wizardFontSizeMarkup(draft.fontSize || app.settings?.fontSize || "normal")); changed = true; }
    }
    return changed;
  }

  function backupMarkup() {
    return `<div class="profile-backup-panel" id="profileBackupPanel"><div class="section-kicker" id="backupKicker">${text("backupKicker")}</div><h4 id="backupTitle">${text("backupTitle")}</h4><p id="backupBody">${text("backupBody")}</p><div class="profile-backup-actions"><button type="button" class="library-import-button" id="backupExport" data-backup-export>${text("backupExport")}</button><button type="button" class="library-import-button secondary" id="backupImport" data-backup-import>${text("backupImport")}</button></div></div>`;
  }

  function decorateProfile() {
    const view = document.getElementById("profileView");
    if (!view || app.view !== "profile") return false;
    let changed = false;
    const onboarding = view.querySelector(".onboarding-panel");
    if (onboarding && !document.getElementById("profileBackupPanel")) { onboarding.insertAdjacentHTML("beforeend", backupMarkup()); changed = true; }
    if (!hasActiveProfile()) {
      return changed;
    }
    const signalPanel = view.querySelector(".profile-panel:nth-child(2)");
    if (signalPanel && !document.getElementById("backgroundGrid")) { signalPanel.insertAdjacentHTML("beforeend", `<div id="backgroundGrid">${backgroundMarkup(app.settings?.background || "tactical")}</div>`); changed = true; }
    const fontGrid = signalPanel?.querySelector(".font-grid");
    if (fontGrid && !document.getElementById("fontSizeGrid")) { fontGrid.insertAdjacentHTML("afterend", fontSizeMarkup(app.settings?.fontSize || "normal")); changed = true; }
    const identity = view.querySelector(".profile-identity");
    const actions = identity?.querySelector(".profile-actions");
    if (actions && !document.getElementById("profileBackupPanel")) { actions.insertAdjacentHTML("afterend", backupMarkup()); changed = true; }
    return changed;
  }

  function decorate() {
    if (state.decorating) return;
    state.decorating = true;
    try {
      const wizardChanged = decorateWizard();
      const profileChanged = decorateProfile();
      if (wizardChanged || profileChanged) applyV030Language();
    } finally {
      state.decorating = false;
    }
  }

  function scheduleDecorate() {
    if (state.frame) return;
    state.frame = requestAnimationFrame(() => {
      state.frame = 0;
      decorate();
    });
  }

  async function openExternal(url) {
    if (!url) return;
    if (typeof openDefaultBrowser === "function") {
      await openDefaultBrowser(url);
      return;
    }
    await fetch("/api/open-url", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
  }

  async function exportBackup() {
    try {
      const response = await fetch("/api/backup");
      const backup = await response.json();
      if (!response.ok || !Array.isArray(backup.profiles) || !backup.profiles.length) throw new Error(text("backupError"));
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `game-compass-profile-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast(text("backupDone"));
    } catch (error) {
      toast(error.message || text("backupError"), true);
    }
  }

  async function importBackupObject(backup, { fromWizard = false } = {}) {
    if (!backup || !Array.isArray(backup.profiles) || !backup.profiles.length) throw new Error(text("backupError"));
    if (!window.confirm(text("backupConfirm"))) return;
    const response = await fetch("/api/backup/import", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ backup }) });
    const payload = await response.json();
    if (!response.ok || !payload.ok) throw new Error(payload.error || text("backupError"));
    if (fromWizard) document.querySelector("#profileDialog")?.close();
    applyBundle(payload.bundle);
    if (fromWizard) {
      app.settings.welcomeSeen = false;
      app.settings.guideCompleted = false;
      await persistSettings();
      if (typeof window.__gcWelcomeAfterProfile === "function") window.__gcWelcomeAfterProfile();
      else setView("welcome");
    } else {
      setView("profile");
    }
    toast(text("restoreDone"));
  }

  async function importBackup(file, options = {}) {
    try {
      const backup = JSON.parse((await file.text()).replace(/^\uFEFF/, ""));
      await importBackupObject(backup, options);
    } catch (error) {
      toast(error.message || text("backupError"), true);
    }
  }

  function folderFile(files, name) {
    return files.find((file) => file.name.toLowerCase() === name || String(file.webkitRelativePath || "").toLowerCase().endsWith("/" + name));
  }

  async function readJsonFile(file) {
    return JSON.parse((await file.text()).replace(/^\uFEFF/, ""));
  }

  async function importBackupFolder(files) {
    try {
      const profilesFile = folderFile(files, "profiles.json");
      const libraryFile = folderFile(files, "library.json");
      const settingsFile = folderFile(files, "settings.json");
      if (!profilesFile) throw new Error(text("importFolderError"));
      const sourceProfiles = await readJsonFile(profilesFile);
      const profiles = Array.isArray(sourceProfiles) ? sourceProfiles : sourceProfiles?.profiles;
      if (!Array.isArray(profiles) || !profiles.length) throw new Error(text("importFolderError"));
      const libraryPayload = libraryFile ? await readJsonFile(libraryFile) : [];
      const library = Array.isArray(libraryPayload) ? libraryPayload : Array.isArray(libraryPayload?.games) ? libraryPayload.games : [];
      const settings = settingsFile ? await readJsonFile(settingsFile) : {};
      const importedProfiles = profiles.map((profile) => {
        const copy = { ...profile, state: { ...(profile.state || {}) } };
        if (library.length) {
          copy.libraryMode = "file";
          copy.libraryAdditions = [...library, ...(Array.isArray(copy.libraryAdditions) ? copy.libraryAdditions : [])];
        }
        return copy;
      });
      await importBackupObject({ format: "game-compass-profile-backup", version: 1, activeProfileId: sourceProfiles.activeProfileId, profiles: importedProfiles, settings }, { fromWizard: true });
    } catch (error) {
      toast(error.message || text("backupError"), true);
    }
  }

  function parseVersion(value) {
    const match = String(value || "").replace(/^v/i, "").match(/^(\d+)\.(\d+)\.(\d+)/);
    return match ? match.slice(1).map(Number) : [0, 0, 0];
  }

  function isNewer(candidate, current) {
    const a = parseVersion(candidate);
    const b = parseVersion(current);
    for (let index = 0; index < 3; index += 1) {
      if (a[index] !== b[index]) return a[index] > b[index];
    }
    return false;
  }

  function showReleaseNotice(release) {
    state.release = release;
    const notice = document.getElementById("releaseUpdateNotice");
    if (!notice) return;
    notice.classList.remove("hidden");
    notice.dataset.releaseUrl = release.url || `${REPOSITORY_URL}/releases/latest`;
    const version = document.getElementById("releaseUpdateVersion");
    if (version) version.textContent = `${text("updateVersion")} ${release.tag}`;
    applyV030Language();
  }

  async function checkForRelease() {
    try {
      const response = await fetch(`https://api.github.com/repos/bomontius/gamecompass/releases/latest?ts=${Date.now()}`, { headers: { Accept: "application/vnd.github+json" } });
      if (!response.ok) return;
      const release = await response.json();
      if (!release?.tag_name || !isNewer(release.tag_name, CURRENT_VERSION)) return;
      showReleaseNotice({ tag: release.tag_name, url: release.html_url || `${REPOSITORY_URL}/releases/latest` });
    } catch (_) {
      // Release checks are optional and must not interrupt offline discovery.
    }
  }

  function installGlobalDecorators() {
    const baseRenderAll = typeof renderAll === "function" ? renderAll : null;
    if (baseRenderAll) {
      renderAll = function (...args) {
        const result = baseRenderAll(...args);
        applyV030Language();
        scheduleDecorate();
        return result;
      };
    }
    const baseSetView = typeof setView === "function" ? setView : null;
    if (baseSetView) {
      setView = function (...args) {
        const result = baseSetView(...args);
        applyV030Language();
        scheduleDecorate();
        return result;
      };
    }
    const baseRenderProfile = typeof renderProfile === "function" ? renderProfile : null;
    if (baseRenderProfile) {
      renderProfile = function (...args) {
        const result = baseRenderProfile(...args);
        applyV030Language();
        scheduleDecorate();
        return result;
      };
    }
  }

  function installHandlers() {
    document.addEventListener("click", (event) => {
      const size = event.target.closest("[data-font-size-choice], [data-gc-font-size]");
      if (size) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const value = size.dataset.fontSizeChoice || size.dataset.gcFontSize || "normal";
        app.settings.fontSize = value;
        if (window.__gcWizard?.draft && size.dataset.gcFontSize) window.__gcWizard.draft.fontSize = value;
        applyFontSize();
        document.querySelectorAll("[data-font-size-choice], [data-gc-font-size]").forEach((button) => button.classList.toggle("active", (button.dataset.fontSizeChoice || button.dataset.gcFontSize) === value));
        if (!size.dataset.gcFontSize) void persistSettings();
        return;
      }
      const background = event.target.closest("[data-gc-background]");
      if (background) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const value = ["tactical", "neon", "management"].includes(background.dataset.gcBackground) ? background.dataset.gcBackground : "tactical";
        app.settings.background = value;
        document.documentElement.dataset.background = value;
        document.querySelectorAll("[data-gc-background]").forEach((button) => button.classList.toggle("active", button.dataset.gcBackground === value));
        void persistSettings();
        return;
      }
      if (event.target.closest("[data-backup-export]")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        void exportBackup();
        return;
      }
      if (event.target.closest("[data-backup-import]")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        document.getElementById("profileBackupFile")?.click();
        return;
      }
      if (event.target.closest("[data-gc-wizard-import]")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        document.getElementById("profileBackupFolder")?.click();
        return;
      }
      if (event.target.closest("[data-gc-wizard-import-json]")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        document.getElementById("wizardBackupFile")?.click();
        return;
      }
      const github = event.target.closest("#githubLink");
      if (github) {
        event.preventDefault();
        event.stopImmediatePropagation();
        void openExternal(REPOSITORY_URL);
        return;
      }
      const releaseButton = event.target.closest("#releaseUpdateOpen");
      if (releaseButton) {
        event.preventDefault();
        event.stopImmediatePropagation();
        void openExternal(document.getElementById("releaseUpdateNotice")?.dataset.releaseUrl || `${REPOSITORY_URL}/releases/latest`);
      }
    }, true);
    document.addEventListener("change", (event) => {
      if (event.target?.id === "profileBackupFile") {
        const file = event.target.files?.[0];
        if (file) void importBackup(file);
        event.target.value = "";
      }
      if (event.target?.id === "wizardBackupFile") {
        const file = event.target.files?.[0];
        if (file) void importBackup(file, { fromWizard: true });
        event.target.value = "";
      }
      if (event.target?.id === "profileBackupFolder") {
        const files = [...(event.target.files || [])];
        if (files.length) void importBackupFolder(files);
        event.target.value = "";
      }
      if (event.target?.id === "gcWizardFontSize") {
        const value = event.target.value;
        if (window.__gcWizard?.draft) window.__gcWizard.draft.fontSize = value;
        app.settings.fontSize = value;
        applyFontSize();
      }
    }, true);
  }

  function init() {
    window.__gcAfterWizardRender = () => { if (decorateWizard()) applyV030Language(); };
    installGlobalDecorators();
    installHandlers();
    decorate();
    applyV030Language();
    setTimeout(checkForRelease, 900);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else setTimeout(init, 0);
})();

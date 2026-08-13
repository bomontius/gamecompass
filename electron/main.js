const { app, BrowserWindow, dialog } = require("electron");
const fs = require("fs");
const path = require("path");
const http = require("http");
const net = require("net");
const { spawn } = require("child_process");

let mainWindow = null;
let serverProcess = null;
let serverPort = 8765;
let runtimeRoot = null;

function sourceRoot() {
  return path.join(process.resourcesPath, "runtime");
}

function copyDirectory(source, target) {
  fs.mkdirSync(target, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const from = path.join(source, entry.name);
    const to = path.join(target, entry.name);
    if (entry.isDirectory()) copyDirectory(from, to);
    else fs.copyFileSync(from, to);
  }
}

function catalogNeedsSeed(sourcePath, targetPath) {
  try {
    const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
    const target = JSON.parse(fs.readFileSync(targetPath, "utf8"));
    const sourceGames = Array.isArray(source.games) ? source.games : [];
    const targetGames = Array.isArray(target.games) ? target.games : [];
    const sourceHasCategories = sourceGames.some((game) => Array.isArray(game.generalCategories) && Array.isArray(game.subgenres));
    const targetHasCategories = targetGames.some((game) => Array.isArray(game.generalCategories) && Array.isArray(game.subgenres));
    return sourceGames.length > targetGames.length || (sourceHasCategories && !targetHasCategories) || (!Array.isArray(target.upcoming));
  } catch (_) {
    return true;
  }
}

function ensureRuntime() {
  const target = path.join(app.getPath("userData"), "runtime");
  const source = sourceRoot();
  if (!fs.existsSync(path.join(target, "server.py"))) {
    copyDirectory(source, target);
  } else {
    for (const file of ["index.html", "styles.css", "app.js", "server.py", "sw.js", "release-v020.js", "release-v030.js"]) {
      fs.copyFileSync(path.join(source, file), path.join(target, file));
    }
    if (fs.existsSync(path.join(source, "assets"))) copyDirectory(path.join(source, "assets"), path.join(target, "assets"));
    copyDirectory(path.join(source, "scripts"), path.join(target, "scripts"));
    const sourceData = path.join(source, "data");
    const targetData = path.join(target, "data");
    fs.mkdirSync(targetData, { recursive: true });
    for (const file of ["candidates.json", "library.json"]) {
      const from = path.join(sourceData, file);
      if (fs.existsSync(from)) fs.copyFileSync(from, path.join(targetData, file));
    }
    if (!fs.existsSync(path.join(targetData, "catalog.json")) && fs.existsSync(path.join(sourceData, "catalog.json"))) {
      fs.copyFileSync(path.join(sourceData, "catalog.json"), path.join(targetData, "catalog.json"));
    } else if (catalogNeedsSeed(path.join(sourceData, "catalog.json"), path.join(targetData, "catalog.json"))) {
      fs.copyFileSync(path.join(sourceData, "catalog.json"), path.join(targetData, "catalog.json"));
    }
    const sourcePython = path.join(source, "python");
    const targetPython = path.join(target, "python");
    if (fs.existsSync(path.join(sourcePython, "python.exe")) && !fs.existsSync(path.join(targetPython, "python.exe"))) {
      copyDirectory(sourcePython, targetPython);
    }
  }
  runtimeRoot = target;
  return target;
}

function serverHealth(port) {
  return new Promise((resolve) => {
    const request = http.get(`http://127.0.0.1:${port}/api/health`, { timeout: 850 }, (response) => {
      response.resume();
      resolve(response.statusCode === 200);
    });
    request.on("error", () => resolve(false));
    request.on("timeout", () => { request.destroy(); resolve(false); });
  });
}

function availablePort() {
  return new Promise((resolve) => {
    const listener = net.createServer();
    listener.listen(0, "127.0.0.1", () => {
      const port = listener.address().port;
      listener.close(() => resolve(port));
    });
  });
}

function pythonCommand() {
  const bundled = runtimeRoot ? path.join(runtimeRoot, "python", "python.exe") : null;
  if (bundled && fs.existsSync(bundled)) return bundled;

  const local = process.env.LOCALAPPDATA || "";
  const candidates = [
    path.join(local, "Programs", "Python", "Python314", "python.exe"),
    path.join(local, "Programs", "Python", "Python313", "python.exe"),
    path.join(local, "Programs", "Python", "Python312", "python.exe"),
    "C:\\Windows\\py.exe",
    "python.exe",
  ];
  return candidates.find((candidate) => !path.isAbsolute(candidate) || fs.existsSync(candidate)) || "python.exe";
}

function startServer() {
  const python = pythonCommand();
  const serverPath = path.join(runtimeRoot, "server.py");
  const child = spawn(python, [serverPath, "--root", runtimeRoot, "--port", String(serverPort)], {
    cwd: runtimeRoot,
    windowsHide: true,
    stdio: "ignore",
  });
  serverProcess = child;
  child.once("error", (error) => { child.spawnError = error; });
}

async function waitForServer() {
  for (let attempt = 0; attempt < 70; attempt += 1) {
    if (serverProcess?.spawnError) {
      throw new Error(`Yerel servis başlatılamadı: ${serverProcess.spawnError.message}`);
    }
    if (serverProcess && serverProcess.exitCode !== null) {
      throw new Error(`Yerel servis kapandı (kod ${serverProcess.exitCode}).`);
    }
    if (await serverHealth(serverPort)) return;
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error("Yerel servis zamanında hazır olmadı.");
}

async function startLocalServer() {
  ensureRuntime();
  serverPort = await availablePort();
  startServer();
  await waitForServer();
}

function stopServer() {
  if (serverProcess && !serverProcess.killed) serverProcess.kill();
  serverProcess = null;
}

async function runWeeklyUpdate() {
  ensureRuntime();
  const python = pythonCommand();
  const result = spawn(python, [path.join(runtimeRoot, "server.py"), "--root", runtimeRoot, "--update", "--weekly"], {
    cwd: runtimeRoot,
    windowsHide: true,
    stdio: "ignore",
  });
  return new Promise((resolve, reject) => {
    result.once("error", reject);
    result.once("exit", (code) => code === 0 ? resolve() : reject(new Error(`Haftalık güncelleme kodu: ${code}`)));
  });
}

function configureUserDataPath() {
  const legacy = path.join(app.getPath("appData"), "oyun-pusulasi-gamecompass");
  const documentsPath = path.join(app.getPath("documents"), "Game Compass");
  if (!fs.existsSync(documentsPath) && fs.existsSync(legacy)) copyDirectory(legacy, documentsPath);
  app.setPath("userData", documentsPath);
  app.setAppUserModelId("bomontius.gamecompass");
}

async function createWindow() {
  await startLocalServer();
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1040,
    minHeight: 680,
    backgroundColor: "#091110",
    autoHideMenuBar: true,
    title: "Game Compass",
    icon: path.join(__dirname, "assets", "oyun-pusulasi-icon.ico"),
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true },
  });
  await mainWindow.loadURL(`http://127.0.0.1:${serverPort}/`);
  mainWindow.on("closed", () => { mainWindow = null; });
}

app.whenReady().then(async () => {
  try {
    configureUserDataPath();
    if (process.argv.includes("--weekly-update")) {
      await runWeeklyUpdate();
      app.quit();
      return;
    }
    await createWindow();
  } catch (error) {
    dialog.showErrorBox("Game Compass", error.message);
    app.quit();
  }
});

app.on("before-quit", stopServer);
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });

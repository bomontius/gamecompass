const crypto = require("node:crypto");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const https = require("node:https");
const path = require("node:path");

const PYTHON_VERSION = "3.13.15";
const PYTHON_ARCHIVE = `python-${PYTHON_VERSION}-embed-amd64.zip`;
const PYTHON_URL = `https://www.python.org/ftp/python/${PYTHON_VERSION}/${PYTHON_ARCHIVE}`;
const PYTHON_SHA256 = "D1F04D990AEE1253D8569E8E5104E30FA9F5FA830899F14843448872D936A2CF";
const bundleDirectory = path.join(__dirname, "..", "runtime", "python");
const cacheDirectory = path.join(__dirname, ".cache");
const archivePath = path.join(cacheDirectory, PYTHON_ARCHIVE);

function sha256(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const stream = fs.createReadStream(filePath);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.once("error", reject);
    stream.once("end", () => resolve(hash.digest("hex").toUpperCase()));
  });
}

function download(url, destination, redirectCount = 0) {
  if (redirectCount > 5) return Promise.reject(new Error("Too many redirects while downloading embedded Python."));
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        response.resume();
        download(new URL(response.headers.location, url).href, destination, redirectCount + 1).then(resolve, reject);
        return;
      }
      if (response.statusCode !== 200) {
        response.resume();
        reject(new Error(`Embedded Python download failed with HTTP ${response.statusCode}.`));
        return;
      }

      const output = fs.createWriteStream(destination);
      response.pipe(output);
      output.once("finish", () => output.close(resolve));
      output.once("error", (error) => {
        output.destroy();
        reject(error);
      });
    });
    request.once("error", reject);
  });
}

async function ensureArchive() {
  fs.mkdirSync(cacheDirectory, { recursive: true });
  if (!fs.existsSync(archivePath) || (await sha256(archivePath)) !== PYTHON_SHA256) {
    await download(PYTHON_URL, archivePath);
  }
  const actualHash = await sha256(archivePath);
  if (actualHash !== PYTHON_SHA256) {
    throw new Error(`Embedded Python checksum mismatch: expected ${PYTHON_SHA256}, received ${actualHash}.`);
  }
}

function patchPythonPathFile() {
  const pathFile = fs.readdirSync(bundleDirectory).find((entry) => entry.endsWith("._pth"));
  if (!pathFile) throw new Error("Embedded Python path configuration was not found.");
  const fullPath = path.join(bundleDirectory, pathFile);
  const lines = fs.readFileSync(fullPath, "utf8").split(/\r?\n/);
  if (!lines.some((line) => line.trim() === "..")) {
    const blankLine = lines.findIndex((line) => line.trim() === "");
    if (blankLine === -1) lines.push("..");
    else lines.splice(blankLine, 0, "..");
    fs.writeFileSync(fullPath, `${lines.join("\r\n").replace(/\r?\n+$/, "")}\r\n`, "utf8");
  }
}

async function main() {
  const hasPathConfiguration = fs.existsSync(bundleDirectory) && fs.readdirSync(bundleDirectory).some((entry) => entry.endsWith("._pth"));
  if (fs.existsSync(path.join(bundleDirectory, "python.exe")) && hasPathConfiguration) {
    patchPythonPathFile();
    process.stdout.write(`Embedded Python ${PYTHON_VERSION} is ready.\n`);
    return;
  }

  await ensureArchive();
  fs.mkdirSync(bundleDirectory, { recursive: true });
  execFileSync("tar", ["-xf", archivePath, "-C", bundleDirectory], { stdio: "inherit" });
  patchPythonPathFile();
  process.stdout.write(`Prepared embedded Python ${PYTHON_VERSION}.\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error}\n`);
  process.exitCode = 1;
});

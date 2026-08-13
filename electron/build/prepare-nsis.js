const fs = require("node:fs");
const path = require("node:path");

const templatePath = path.join(__dirname, "..", "node_modules", "app-builder-lib", "templates", "nsis", "assistedInstaller.nsh");
let source = fs.readFileSync(templatePath, "utf8");
const existingSafeguard = /(?:  !include StrContains\.nsh\r?\n\r?\n)?  !define MUI_PAGE_CUSTOMFUNCTION_PRE instFilesPre\r?\n  Function instFilesPre\r?\n    \$\{StrContains\} \$0 "\$\{APP_FILENAME\}" \$INSTDIR\r?\n    \$\{If\} \$0 == ""\r?\n      StrCpy \$INSTDIR "\$INSTDIR\\\$\{APP_FILENAME\}"\r?\n    \$\{endIf\}\r?\n  FunctionEnd\r?\n\r?\n/;
if (source.includes("Function instFilesPre")) source = source.replace(existingSafeguard, "");

const marker = "  !insertmacro MUI_PAGE_INSTFILES\n";
if (!source.includes(marker)) {
  throw new Error("Could not safely locate the NSIS installation-files page.");
}

const safeguard = `  !define MUI_PAGE_CUSTOMFUNCTION_PRE instFilesPre\n  Function instFilesPre\n    \${StrContains} $0 "\${APP_FILENAME}" $INSTDIR\n    \${If} $0 == ""\n      StrCpy $INSTDIR "$INSTDIR\\\${APP_FILENAME}"\n    \${endIf}\n  FunctionEnd\n\n`;
fs.writeFileSync(templatePath, source.replace(marker, `${safeguard}${marker}`), "utf8");
process.stdout.write("Restored the NSIS install-folder safeguard so every selected location gets a Game Compass folder.\n");

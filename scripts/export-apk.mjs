import { readFile, copyFile, mkdir, access } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appVersionSources = [
  {
    file: path.join(repoRoot, "src", "config", "game-constants.ts"),
    pattern: /version:\s*"([^"]+)"/,
    label: "a versao do app em src/config/game-constants.ts",
  },
  {
    file: path.join(repoRoot, "src", "ui", "main.ts"),
    pattern: /const VERSION = "([^"]+)"/,
    label: "a versao do app em src/ui/main.ts",
  },
];
const androidGradleFile = path.join(repoRoot, "android", "app", "build.gradle");
const apkSource = path.join(repoRoot, "android", "app", "build", "outputs", "apk", "debug", "app-debug.apk");

function readVersionFrom(text, pattern, label) {
  const match = text.match(pattern);
  if (!match?.[1]) {
    throw new Error(`Nao foi possivel encontrar ${label}.`);
  }
  return match[1];
}

async function requireExists(targetPath) {
  try {
    await access(targetPath, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function readAppVersion() {
  for (const source of appVersionSources) {
    if (!(await requireExists(source.file))) continue;
    const text = await readFile(source.file, "utf8");
    const match = text.match(source.pattern);
    if (match?.[1]) return match[1];
  }

  const labels = appVersionSources.map((source) => source.label).join(" ou ");
  throw new Error(`Nao foi possivel encontrar ${labels}.`);
}

async function resolveDesktopDir() {
  const home = os.homedir();
  const candidates = [
    path.join(home, "Desktop"),
    path.join(home, "OneDrive", "Desktop"),
    path.join(home, "Area de Trabalho"),
    path.join(home, "OneDrive", "Area de Trabalho"),
    path.join(home, "Área de Trabalho"),
    path.join(home, "OneDrive", "Área de Trabalho"),
  ];

  for (const candidate of candidates) {
    if (await requireExists(candidate)) return candidate;
  }

  return path.join(home, "Desktop");
}

async function main() {
  // Keep Android metadata and displayed app version aligned with the exported APK name.
  const [appVersion, gradle, apkExists] = await Promise.all([
    readAppVersion(),
    readFile(androidGradleFile, "utf8"),
    requireExists(apkSource),
  ]);

  if (!apkExists) {
    throw new Error(`APK nao encontrada em ${apkSource}`);
  }

  const androidVersion = readVersionFrom(gradle, /versionName\s+"([^"]+)"/, "a versionName do Android");

  if (appVersion !== androidVersion) {
    throw new Error(
      `Versoes divergentes: app=${appVersion} e android=${androidVersion}. ` +
      `A exportacao do APK foi bloqueada para manter o nome consistente.`
    );
  }

  const desktopDir = await resolveDesktopDir();
  await mkdir(desktopDir, { recursive: true });

  const target = path.join(desktopDir, `DotsAndBoxes-${appVersion}-debug.apk`);
  await copyFile(apkSource, target);

  console.log(`APK exportado para: ${target}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

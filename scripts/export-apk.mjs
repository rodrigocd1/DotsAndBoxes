import { readFile, copyFile, mkdir, access } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appVersionFile = path.join(repoRoot, "src", "ui", "main.ts");
const androidGradleFile = path.join(repoRoot, "android", "app", "build.gradle");
const apkSource = path.join(repoRoot, "android", "app", "build", "outputs", "apk", "debug", "app-debug.apk");

function readVersionFrom(text, pattern, label) {
  const match = text.match(pattern);
  if (!match?.[1]) {
    throw new Error(`Não foi possível encontrar ${label}.`);
  }
  return match[1];
}

async function resolveDesktopDir() {
  const home = os.homedir();
  const candidates = [
    path.join(home, "Desktop"),
    path.join(home, "OneDrive", "Desktop"),
    path.join(home, "Área de Trabalho"),
    path.join(home, "OneDrive", "Área de Trabalho"),
  ];

  for (const candidate of candidates) {
    if (await requireExists(candidate)) return candidate;
  }

  return path.join(home, "Desktop");
}

async function requireExists(targetPath) {
  try {
    await access(targetPath, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  // Regra fixa: o APK exportado sempre deve carregar o mesmo nome da versão
  // exibida no app e registrada no Android. Se divergir, falha para evitar erro humano.
  const [appTs, gradle, apkExists] = await Promise.all([
    readFile(appVersionFile, "utf8"),
    readFile(androidGradleFile, "utf8"),
    requireExists(apkSource),
  ]);

  if (!apkExists) {
    throw new Error(`APK não encontrada em ${apkSource}`);
  }

  const appVersion = readVersionFrom(appTs, /const VERSION = "([^"]+)"/, "a versão do app em src/ui/main.ts");
  const androidVersion = readVersionFrom(gradle, /versionName\s+"([^"]+)"/, "a versionName do Android");

  if (appVersion !== androidVersion) {
    throw new Error(
      `Versões divergentes: app=${appVersion} e android=${androidVersion}. ` +
      `A exportação do APK foi bloqueada para manter o nome consistente.`
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

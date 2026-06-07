/** Persistência em localStorage — progresso, rank, energia, god mode, tema, pulos */
import { ENERGY_REGEN_MINUTES, MAX_ENERGY as MAX_ENERGY_CONFIG, SKIPS_PER_WEEK as SKIPS_PER_WEEK_CONFIG } from "../config/game-constants";
import { t } from "./i18n";

// ── Pulos de fase (skip semanal) ──────────────────────────────────────────
const SKIPS_KEY = "dab_skips";
export const SKIPS_PER_WEEK = SKIPS_PER_WEEK_CONFIG;
export const MAX_ENERGY = MAX_ENERGY_CONFIG;
interface SkipData { count: number; weekStart: number; }

function getWeekStart(): number {
  const d = new Date(); d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); // segunda-feira
  return d.getTime();
}

function loadSkipData(): SkipData {
  try {
    const raw = localStorage.getItem(SKIPS_KEY);
    if (raw) {
      const data = JSON.parse(raw) as SkipData;
      if (data.weekStart >= getWeekStart()) return data;
    }
  } catch {}
  const fresh: SkipData = { count: SKIPS_PER_WEEK, weekStart: getWeekStart() };
  localStorage.setItem(SKIPS_KEY, JSON.stringify(fresh));
  return fresh;
}

export function getAvailableSkips(): number { return loadSkipData().count; }

export function useSkip(): boolean {
  const data = loadSkipData();
  if (data.count <= 0) return false;
  data.count--;
  localStorage.setItem(SKIPS_KEY, JSON.stringify(data));
  return true;
}

export function setSkipCount(n: number): void {
  const data = loadSkipData();
  data.count = Math.max(0, n);
  localStorage.setItem(SKIPS_KEY, JSON.stringify(data));
}

// ── Volume da música ──────────────────────────────────────────────────────
const MUSIC_VOL_KEY = "dab_music_vol";
const MUTE_KEY = "dab_mute";
export function loadMute(): boolean {
  return localStorage.getItem(MUTE_KEY) === "1";
}
export function saveMute(on: boolean): void {
  localStorage.setItem(MUTE_KEY, on ? "1" : "0");
}

export function loadMusicVolume(): number {
  const v = localStorage.getItem(MUSIC_VOL_KEY);
  return v === null ? 0.25 : Math.max(0, Math.min(1, parseFloat(v)));
}
export function saveMusicVolume(vol: number): void {
  localStorage.setItem(MUSIC_VOL_KEY, String(Math.max(0, Math.min(1, vol))));
}

// ── Vibração háptica ──────────────────────────────────────────────────────
const VIBRATION_KEY = "dab_vibration";
export function loadVibration(): boolean {
  const v = localStorage.getItem(VIBRATION_KEY);
  return v === null ? true : v === "1"; // padrão: ativo
}
export function saveVibration(on: boolean): void {
  localStorage.setItem(VIBRATION_KEY, on ? "1" : "0");
}
export function vibrate(pattern: number | number[]): void {
  if (!loadVibration()) return;
  try {
    const nav = globalThis as typeof globalThis & {
      navigator?: { vibrate?: (value: number | number[]) => void };
    };
    if (nav.navigator?.vibrate) {
      nav.navigator.vibrate(pattern);
    }
  } catch {}
}

// ── Tema ──────────────────────────────────────────────────────────────────
export type Theme = "dark" | "light" | "pink";
const THEME_KEY = "dab_theme";
function isTheme(value: string | null): value is Theme {
  return value === "dark" || value === "light" || value === "pink";
}
export function hasSavedTheme(): boolean {
  return isTheme(localStorage.getItem(THEME_KEY));
}
export function loadTheme(): Theme {
  const stored = localStorage.getItem(THEME_KEY);
  return isTheme(stored) ? stored : "dark";
}
export function saveTheme(theme: Theme): void {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}
export function applyTheme(theme: Theme = loadTheme()): void {
  const doc = globalThis as typeof globalThis & {
    document?: { documentElement?: { setAttribute(name: string, value: string): void } };
  };
  doc.document?.documentElement?.setAttribute("data-theme", theme);
}

const THEME_PLAYER_COLORS: Record<Theme, readonly [string, string, string, string]> = {
  dark:  ["#22d3ee", "#f472b6", "#f59e0b", "#a855f7"],
  light: ["#f59e0b", "#7c3aed", "#2563eb", "#db2777"],
  pink:  ["#ff4fd8", "#2563eb", "#a855f7", "#f59e0b"],
};

export function getThemePlayerColors(theme: Theme = loadTheme()): readonly [string, string, string, string] {
  return THEME_PLAYER_COLORS[theme];
}

// ── Perfil / XP ───────────────────────────────────────────────────────────

export interface StageProgress {
  stars: 0 | 1 | 2 | 3;
  bestScore: number;
}

export interface PlayerProfile {
  name: string;
  xp: number;
  stageProgress: Record<number, StageProgress>;
}

const PROFILE_KEY = "dab_profile";

function defaultProfile(): PlayerProfile {
  return { name: "Jogador", xp: 0, stageProgress: {} };
}

export function loadProfile(): PlayerProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return defaultProfile();
    return JSON.parse(raw) as PlayerProfile;
  } catch {
    return defaultProfile();
  }
}

export function saveProfile(p: PlayerProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}

export function recordStageResult(
  stageId: number,
  stars: 0 | 1 | 2 | 3,
  score: number,
  xpEarned: number,
): PlayerProfile {
  const profile = loadProfile();
  const prev = profile.stageProgress[stageId];
  profile.stageProgress[stageId] = {
    stars: Math.max(stars, prev?.stars ?? 0) as 0 | 1 | 2 | 3,
    bestScore: Math.max(score, prev?.bestScore ?? 0),
  };
  profile.xp += xpEarned;
  saveProfile(profile);
  return profile;
}

export function rankLabel(xp: number): { rank: string; icon: string; next: number } {
  const tiers = [
    { key: "rank_master",   icon: "👑", min: 150000, next: Infinity },
    { key: "rank_diamond",  icon: "🔷", min: 75000,  next: 150000 },
    { key: "rank_plat_3",   icon: "💎", min: 50000,  next: 75000 },
    { key: "rank_plat_2",   icon: "💎", min: 40000,  next: 50000 },
    { key: "rank_plat_1",   icon: "💎", min: 30000,  next: 40000 },
    { key: "rank_gold_3",   icon: "🥇", min: 20000,  next: 30000 },
    { key: "rank_gold_2",   icon: "🥇", min: 15000,  next: 20000 },
    { key: "rank_gold_1",   icon: "🥇", min: 10000,  next: 15000 },
    { key: "rank_silver_3", icon: "🥈", min: 6000,   next: 10000 },
    { key: "rank_silver_2", icon: "🥈", min: 3500,   next: 6000 },
    { key: "rank_silver_1", icon: "🥈", min: 2500,   next: 3500 },
    { key: "rank_bronze_3", icon: "🥉", min: 1500,   next: 2500 },
    { key: "rank_bronze_2", icon: "🥉", min: 1000,   next: 1500 },
    { key: "rank_bronze_1", icon: "🥉", min: 500,    next: 1000 },
    { key: "rank_beginner", icon: "⚪", min: 0,      next: 500 },
  ];
  const tier = tiers.find((tier) => xp >= tier.min) ?? tiers[tiers.length - 1]!;
  return { rank: t(tier.key), icon: tier.icon, next: tier.next };
}

// ── Sistema de Energia ────────────────────────────────────────────────────

const ENERGY_REGEN_INTERVAL_MS = Math.round(ENERGY_REGEN_MINUTES * 60_000);

interface EnergyState {
  amount: number;
  lastSaved: number;
}

const ENERGY_KEY = "dab_energy";

export function loadEnergy(): number {
  try {
    const raw = localStorage.getItem(ENERGY_KEY);
    if (!raw) return MAX_ENERGY;
    const s = JSON.parse(raw) as EnergyState;
    const regained = Math.floor((Date.now() - s.lastSaved) / ENERGY_REGEN_INTERVAL_MS);
    return Math.min(MAX_ENERGY, s.amount + regained);
  } catch {
    return MAX_ENERGY;
  }
}

export function saveEnergy(amount: number): void {
  localStorage.setItem(ENERGY_KEY, JSON.stringify({ amount, lastSaved: Date.now() }));
}

export function spendEnergy(): boolean {
  const cur = loadEnergy();
  if (cur <= 0) return false;
  saveEnergy(cur - 1);
  return true;
}

export function refillEnergy(): void {
  saveEnergy(MAX_ENERGY);
}

export function addEnergy(amount: number): void {
  saveEnergy(Math.min(MAX_ENERGY, loadEnergy() + amount));
}

/** Milissegundos até a próxima recarga de +1 energia */
export function msToNextEnergy(): number {
  try {
    const raw = localStorage.getItem(ENERGY_KEY);
    if (!raw) return 0;
    const s = JSON.parse(raw) as EnergyState;
    if (loadEnergy() >= MAX_ENERGY) return 0;
    return ENERGY_REGEN_INTERVAL_MS - ((Date.now() - s.lastSaved) % ENERGY_REGEN_INTERVAL_MS);
  } catch {
    return 0;
  }
}

// ── God Mode ──────────────────────────────────────────────────────────────

const GOD_KEY = "dab_god";

export interface GodModeConfig {
  unlimitedEnergy: boolean;
  simulateSso: boolean;
  simulateVip: boolean;
  simulateStage: number | null;
  simulateRankedPoints: number | null;
  simulateCompetitiveEnergy: number | null;
  simulatePhotoPermission: boolean | null;
}

function defaultGodMode(): GodModeConfig {
  return {
    unlimitedEnergy: false,
    simulateSso: false,
    simulateVip: false,
    simulateStage: null,
    simulateRankedPoints: null,
    simulateCompetitiveEnergy: null,
    simulatePhotoPermission: null,
  };
}

export function loadGodMode(): GodModeConfig {
  try {
    const raw = localStorage.getItem(GOD_KEY);
    if (!raw) return defaultGodMode();
    const parsed = JSON.parse(raw) as Partial<GodModeConfig>;
    return { ...defaultGodMode(), ...parsed };
  } catch {
    return defaultGodMode();
  }
}

export function saveGodMode(cfg: GodModeConfig): void {
  localStorage.setItem(GOD_KEY, JSON.stringify(cfg));
}

/** Verifica se o usuário está "logado" (real ou simulado via God Mode) */
export function isLoggedIn(): boolean {
  const god = loadGodMode();
  if (god.simulateSso) return true;
  // TODO: verificar SSO real quando implementado
  return false;
}

/** Verifica se o Passe VIP está ativo (real ou simulado via God Mode) */
export function isVipActive(): boolean {
  const god = loadGodMode();
  if (god.simulateVip) return true;
  // TODO: verificar assinatura real quando implementada
  return false;
}

/** Retorna a fase máxima desbloqueada (real ou simulada via God Mode) */
export function getEffectiveMaxStage(): number {
  const god = loadGodMode();
  if (god.simulateStage !== null && god.simulateStage > 0) {
    return god.simulateStage;
  }
  const profile = loadProfile();
  let max = 1;
  for (const key in profile.stageProgress) {
    const id = parseInt(key, 10);
    const progress = profile.stageProgress[id];
    if (progress && progress.stars > 0 && id >= max) {
      max = id + 1;
    }
  }
  return max;
}

/** Verifica se um recurso está desbloqueado pela fase atual */
export function isFeatureUnlocked(requiredStage: number): boolean {
  return getEffectiveMaxStage() >= requiredStage;
}


/**
 * Sistema de Poderes do Tabuleiro
 * Dica do Mestre, Radar Tático, Congelar IA
 */
import {
  FREE_MASTER_TIP_DAILY_AD_LIMIT,
  VIP_MASTER_TIP_DAILY_LIMIT,
  VIP_BASIC_TRAINING_MASTER_TIP_MAX_RATIO,
  TACTICAL_RADAR_MAX_STOCK,
  TACTICAL_RADAR_UNLOCK_STAGE,
  FREE_FREEZE_AI_INTERVAL_DAYS,
  VIP_FREEZE_AI_INTERVAL_DAYS,
  FREE_RETRY_DAILY_AD_LIMIT,
  VIP_RETRY_DAILY_FREE_LIMIT,
  MASTER_TIP_UNLOCK_STAGE,
  ENERGY_FREE_RETRY_UNLOCK_STAGE,
} from "../config/game-constants";

// ── Tipos ──────────────────────────────────────────────────────────────────

export type GameMode = "arcade" | "vs-bot" | "multi" | "ranked" | "timer-attack" | "nerves-of-steel" | "x1" | "basic-training" | "vip-training";

export interface PowerState {
  masterTipCount: number;
  radarStock: number;
  lastFreezeDate: number | null;
  retryCount: number;
  date: string;
}

// ── Modos onde poderes são proibidos ─────────────────────────────────────

const MASTER_TIP_BLOCKED_MODES: readonly GameMode[] = ["ranked", "x1", "timer-attack", "vip-training"];
const RADAR_BLOCKED_MODES: readonly GameMode[] = ["ranked", "x1", "vip-training"];
const FREEZE_BLOCKED_MODES: readonly GameMode[] = ["ranked", "x1", "timer-attack"];
const RETRY_BLOCKED_MODES: readonly GameMode[] = ["ranked", "x1"];

// ── Storage ───────────────────────────────────────────────────────────────

const MASTER_TIP_KEY = "dab_master_tip_daily";
const RADAR_KEY = "dab_radar_stock";
const FREEZE_KEY = "dab_freeze_ai";
const RETRY_KEY = "dab_retry_daily";

function todayString(): string {
  return new Date().toISOString().split("T")[0] ?? "";
}

interface DailyTracker {
  count: number;
  date: string;
}

function loadDailyTracker(key: string): DailyTracker {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { count: 0, date: todayString() };
    const tracker = JSON.parse(raw) as DailyTracker;
    if (tracker.date !== todayString()) {
      return { count: 0, date: todayString() };
    }
    return tracker;
  } catch {
    return { count: 0, date: todayString() };
  }
}

function saveDailyTracker(key: string, tracker: DailyTracker): void {
  localStorage.setItem(key, JSON.stringify(tracker));
}

// ── Dica do Mestre ───────────────────────────────────────────────────────

export function canUseMasterTip(mode: GameMode, isVip: boolean): boolean {
  if (MASTER_TIP_BLOCKED_MODES.includes(mode)) return false;
  const tracker = loadDailyTracker(MASTER_TIP_KEY);
  const limit = isVip ? VIP_MASTER_TIP_DAILY_LIMIT : FREE_MASTER_TIP_DAILY_AD_LIMIT;
  return tracker.count < limit;
}

export function getMasterTipDailyRemaining(isVip: boolean): number {
  const tracker = loadDailyTracker(MASTER_TIP_KEY);
  const limit = isVip ? VIP_MASTER_TIP_DAILY_LIMIT : FREE_MASTER_TIP_DAILY_AD_LIMIT;
  return Math.max(0, limit - tracker.count);
}

/** Limite de dicas no treino básico VIP = metade das jogadas estimadas */
export function getBasicTrainingTipLimit(estimatedMoves: number): number {
  return Math.floor(estimatedMoves * VIP_BASIC_TRAINING_MASTER_TIP_MAX_RATIO);
}

export function useMasterTip(): boolean {
  const tracker = loadDailyTracker(MASTER_TIP_KEY);
  tracker.count++;
  tracker.date = todayString();
  saveDailyTracker(MASTER_TIP_KEY, tracker);
  return true;
}

// ── Radar Tático ────────────────────────────────────────────────────────

export function getRadarStock(): number {
  try {
    const raw = localStorage.getItem(RADAR_KEY);
    if (!raw) return 0;
    return Math.min(TACTICAL_RADAR_MAX_STOCK, parseInt(raw, 10));
  } catch {
    return 0;
  }
}

export function addRadar(amount: number): void {
  const current = getRadarStock();
  const newStock = Math.min(TACTICAL_RADAR_MAX_STOCK, current + amount);
  localStorage.setItem(RADAR_KEY, String(newStock));
}

export function useRadar(mode: GameMode): boolean {
  if (RADAR_BLOCKED_MODES.includes(mode)) return false;
  const stock = getRadarStock();
  if (stock <= 0) return false;
  localStorage.setItem(RADAR_KEY, String(stock - 1));
  return true;
}

export function canUseRadar(mode: GameMode): boolean {
  if (RADAR_BLOCKED_MODES.includes(mode)) return false;
  return getRadarStock() > 0;
}

// ── Congelar IA ──────────────────────────────────────────────────────────

interface FreezeState {
  lastUsed: number | null;
}

function loadFreezeState(): FreezeState {
  try {
    const raw = localStorage.getItem(FREEZE_KEY);
    if (!raw) return { lastUsed: null };
    return JSON.parse(raw) as FreezeState;
  } catch {
    return { lastUsed: null };
  }
}

export function canFreezeAi(mode: GameMode, isVip: boolean): boolean {
  if (FREEZE_BLOCKED_MODES.includes(mode)) return false;
  const state = loadFreezeState();
  if (state.lastUsed === null) return true;
  const intervalDays = isVip ? VIP_FREEZE_AI_INTERVAL_DAYS : FREE_FREEZE_AI_INTERVAL_DAYS;
  const daysSince = (Date.now() - state.lastUsed) / (1000 * 60 * 60 * 24);
  return daysSince >= intervalDays;
}

export function getDaysUntilFreeze(isVip: boolean): number {
  const state = loadFreezeState();
  if (state.lastUsed === null) return 0;
  const intervalDays = isVip ? VIP_FREEZE_AI_INTERVAL_DAYS : FREE_FREEZE_AI_INTERVAL_DAYS;
  const daysSince = (Date.now() - state.lastUsed) / (1000 * 60 * 60 * 24);
  return Math.max(0, Math.ceil(intervalDays - daysSince));
}

export function useFreezeAi(): void {
  localStorage.setItem(FREEZE_KEY, JSON.stringify({ lastUsed: Date.now() }));
}

// ── Retry sem energia ─────────────────────────────────────────────────────

export function canRetryFree(mode: GameMode, isVip: boolean): boolean {
  if (RETRY_BLOCKED_MODES.includes(mode)) return false;
  const tracker = loadDailyTracker(RETRY_KEY);
  const limit = isVip ? VIP_RETRY_DAILY_FREE_LIMIT : FREE_RETRY_DAILY_AD_LIMIT;
  return tracker.count < limit;
}

export function getRetryRemaining(isVip: boolean): number {
  const tracker = loadDailyTracker(RETRY_KEY);
  const limit = isVip ? VIP_RETRY_DAILY_FREE_LIMIT : FREE_RETRY_DAILY_AD_LIMIT;
  return Math.max(0, limit - tracker.count);
}

export function useRetry(): void {
  const tracker = loadDailyTracker(RETRY_KEY);
  tracker.count++;
  tracker.date = todayString();
  saveDailyTracker(RETRY_KEY, tracker);
}

// ── Helpers de unlock ─────────────────────────────────────────────────────

export { MASTER_TIP_UNLOCK_STAGE, TACTICAL_RADAR_UNLOCK_STAGE, ENERGY_FREE_RETRY_UNLOCK_STAGE };

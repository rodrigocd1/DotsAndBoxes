/**
 * Sistema de Códigos de Recompensa
 * Validação e resgate de códigos promocionais.
 */
import {
  PERMANENT_REWARD_CODE,
  REWARD_CODE_REWARDS,
} from "../config/game-constants";

// ── Tipos ──────────────────────────────────────────────────────────────────

export interface RewardCodeRedemption {
  code: string;
  redeemedAt: number;
  rewards: CodeRewards;
}

export interface CodeRewards {
  energy: number;
  masterTips: number;
  freeRetries: number;
}

export interface RedeemResult {
  success: boolean;
  reason?: "already_redeemed" | "invalid_code" | "expired" | "requires_login";
  rewards?: CodeRewards;
}

// ── Storage ───────────────────────────────────────────────────────────────

const REDEEMED_KEY = "dab_redeemed_codes";

function loadRedeemedCodes(): RewardCodeRedemption[] {
  try {
    const raw = localStorage.getItem(REDEEMED_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as RewardCodeRedemption[];
  } catch {
    return [];
  }
}

function saveRedeemedCodes(codes: RewardCodeRedemption[]): void {
  localStorage.setItem(REDEEMED_KEY, JSON.stringify(codes));
}

// ── API ───────────────────────────────────────────────────────────────────

export function isCodeRedeemed(code: string): boolean {
  const normalized = code.toUpperCase().trim();
  return loadRedeemedCodes().some((r) => r.code === normalized);
}

export function getCodeRewards(code: string): CodeRewards | null {
  const normalized = code.toUpperCase().trim();
  const rewards = REWARD_CODE_REWARDS[normalized as keyof typeof REWARD_CODE_REWARDS];
  if (!rewards) return null;
  return {
    energy: rewards.energy,
    masterTips: rewards.masterTips,
    freeRetries: rewards.freeRetries,
  };
}

export function redeemCode(code: string, isLoggedIn: boolean): RedeemResult {
  const normalized = code.toUpperCase().trim();

  if (!isLoggedIn) {
    return { success: false, reason: "requires_login" };
  }

  if (isCodeRedeemed(normalized)) {
    return { success: false, reason: "already_redeemed" };
  }

  const rewards = getCodeRewards(normalized);
  if (!rewards) {
    return { success: false, reason: "invalid_code" };
  }

  const redeemed = loadRedeemedCodes();
  redeemed.push({
    code: normalized,
    redeemedAt: Date.now(),
    rewards,
  });
  saveRedeemedCodes(redeemed);

  return { success: true, rewards };
}

export function isPermanentCode(code: string): boolean {
  return code.toUpperCase().trim() === PERMANENT_REWARD_CODE;
}

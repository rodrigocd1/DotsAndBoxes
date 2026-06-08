/**
 * Definições e validações dos modos de jogo.
 * Centraliza regras de cada modo.
 */
import {
  TIMER_ATTACK_TOTAL_BOARDS,
  TIMER_ATTACK_UNLOCK_STAGE,
  RANKED_UNLOCK_STAGE,
  NERVES_OF_STEEL_UNLOCK_STAGE,
  NERVES_OF_STEEL_DISPLAY_NAME,
  NERVES_OF_STEEL_TAGLINE,
  NERVES_OF_STEEL_MOVE_TIME_SECONDS,
  NERVES_OF_STEEL_VIP_EXTRA_TIME_SECONDS,
  NERVES_OF_STEEL_VIP_EXTRA_LIVES,
  X1_STATUS,
  X1_BETA_SERVER_URL,
} from "../config/game-constants";

// ── Tipos ──────────────────────────────────────────────────────────────────

export interface TimerAttackConfig {
  totalBoards: number;
  unlockStage: number;
  powersAllowed: false;
  vipAdvantage: false;
}

export interface NervesOfSteelConfig {
  displayName: string;
  tagline: string;
  unlockStage: number;
  moveTimeSeconds: number;
  vipExtraTimeSeconds: number;
  vipExtraLives: number;
  powersAllowed: true;
  vipCanPause: true;
}

export interface RankedConfig {
  unlockStage: number;
  requiresLogin: true;
  powersAllowed: false;
  vipAdvantage: false;
}

export interface X1Config {
  status: typeof X1_STATUS;
  betaServerUrl: string;
  powersAllowed: false;
  vipAdvantage: false;
}

// ── Configurações ──────────────────────────────────────────────────────────

export const TIMER_ATTACK: TimerAttackConfig = {
  totalBoards: TIMER_ATTACK_TOTAL_BOARDS,
  unlockStage: TIMER_ATTACK_UNLOCK_STAGE,
  powersAllowed: false,
  vipAdvantage: false,
};

export const NERVES_OF_STEEL: NervesOfSteelConfig = {
  displayName: NERVES_OF_STEEL_DISPLAY_NAME,
  tagline: NERVES_OF_STEEL_TAGLINE,
  unlockStage: NERVES_OF_STEEL_UNLOCK_STAGE,
  moveTimeSeconds: NERVES_OF_STEEL_MOVE_TIME_SECONDS,
  vipExtraTimeSeconds: NERVES_OF_STEEL_VIP_EXTRA_TIME_SECONDS,
  vipExtraLives: NERVES_OF_STEEL_VIP_EXTRA_LIVES,
  powersAllowed: true,
  vipCanPause: true,
};

export const RANKED: RankedConfig = {
  unlockStage: RANKED_UNLOCK_STAGE,
  requiresLogin: true,
  powersAllowed: false,
  vipAdvantage: false,
};

export const X1_ONLINE: X1Config = {
  status: X1_STATUS,
  betaServerUrl: X1_BETA_SERVER_URL,
  powersAllowed: false,
  vipAdvantage: false,
};

/** Verifica se poderes são permitidos no modo */
export function arePowersAllowed(mode: string): boolean {
  switch (mode) {
    case "ranked":
    case "x1":
    case "timer-attack":
    case "vip-training":
      return false;
    default:
      return true;
  }
}

/** Retorna tempo por jogada no Nervos de Aço (com bônus VIP) */
export function getNervesOfSteelMoveTime(isVip: boolean): number {
  return NERVES_OF_STEEL.moveTimeSeconds + (isVip ? NERVES_OF_STEEL.vipExtraTimeSeconds : 0);
}

/** Retorna vidas no Nervos de Aço (com bônus VIP) */
export function getNervesOfSteelLives(isVip: boolean): number {
  return 1 + (isVip ? NERVES_OF_STEEL.vipExtraLives : 0);
}

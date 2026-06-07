/**
 * Sistema de XP
 * Multiplicadores de XP por status (free/VIP) e anúncio.
 */
import {
  FREE_XP_MULTIPLIER,
  FREE_AD_XP_MULTIPLIER,
  VIP_XP_MULTIPLIER,
  VIP_AD_XP_MULTIPLIER,
} from "../config/game-constants";

export interface XpCalculation {
  baseXp: number;
  multiplier: number;
  totalXp: number;
  isVip: boolean;
  watchedAd: boolean;
}

/** Calcula o XP final com multiplicador */
export function calculateXp(
  baseXp: number,
  isVip: boolean,
  watchedAd: boolean,
): XpCalculation {
  let multiplier: number;

  if (isVip && watchedAd) {
    multiplier = VIP_AD_XP_MULTIPLIER;
  } else if (isVip) {
    multiplier = VIP_XP_MULTIPLIER;
  } else if (watchedAd) {
    multiplier = FREE_AD_XP_MULTIPLIER;
  } else {
    multiplier = FREE_XP_MULTIPLIER;
  }

  return {
    baseXp,
    multiplier,
    totalXp: Math.round(baseXp * multiplier),
    isVip,
    watchedAd,
  };
}

/** Texto explicativo do multiplicador */
export function getXpMultiplierLabel(isVip: boolean, watchedAd: boolean): string {
  if (isVip && watchedAd) return `${VIP_AD_XP_MULTIPLIER}x XP (VIP + Anúncio)`;
  if (isVip) return `${VIP_XP_MULTIPLIER}x XP (VIP)`;
  if (watchedAd) return `${FREE_AD_XP_MULTIPLIER}x XP (Anúncio)`;
  return `${FREE_XP_MULTIPLIER}x XP`;
}

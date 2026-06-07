/**
 * Sistema de Ranking Competitivo
 * Gerenciamento de pontos, ranks e energia competitiva.
 */
import {
  COMPETITIVE_RANKS,
  RANKED_DAILY_TICKETS,
  RANKED_WIN_POINTS,
  RANKED_LOSS_POINTS,
  RANKED_DRAW_POINTS,
  RANKED_FREE_WIN_ENERGY_REWARD,
  RANKED_FREE_LOSS_ENERGY_REWARD,
  RANKED_VIP_WIN_ENERGY_REWARD,
  RANKED_VIP_LOSS_ENERGY_REWARD,
} from "../config/game-constants";

// ── Tipos ──────────────────────────────────────────────────────────────────

export interface CompetitiveProfile {
  points: number;
  wins: number;
  losses: number;
  draws: number;
  ticketsUsedToday: number;
  lastTicketResetDate: string;
  photoPermission: boolean | null;
}

export interface RankInfo {
  id: string;
  label: string;
  minPoints: number;
}

export interface MatchResult {
  pointsDelta: number;
  energyReward: number;
  newRank: RankInfo;
  promoted: boolean;
  demoted: boolean;
}

// ── Storage ───────────────────────────────────────────────────────────────

const COMP_KEY = "dab_competitive";

function todayString(): string {
  return new Date().toISOString().split("T")[0] ?? "";
}

function defaultProfile(): CompetitiveProfile {
  return {
    points: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    ticketsUsedToday: 0,
    lastTicketResetDate: todayString(),
    photoPermission: null,
  };
}

export function loadCompetitiveProfile(): CompetitiveProfile {
  try {
    const raw = localStorage.getItem(COMP_KEY);
    if (!raw) return defaultProfile();
    const profile = JSON.parse(raw) as CompetitiveProfile;
    // Reset tickets diários se mudou o dia
    if (profile.lastTicketResetDate !== todayString()) {
      profile.ticketsUsedToday = 0;
      profile.lastTicketResetDate = todayString();
      saveCompetitiveProfile(profile);
    }
    return profile;
  } catch {
    return defaultProfile();
  }
}

export function saveCompetitiveProfile(profile: CompetitiveProfile): void {
  localStorage.setItem(COMP_KEY, JSON.stringify(profile));
}

// ── Ranks ─────────────────────────────────────────────────────────────────

export function getRankForPoints(points: number): RankInfo {
  // Percorre de trás para frente (maior rank primeiro)
  for (let i = COMPETITIVE_RANKS.length - 1; i >= 0; i--) {
    const rank = COMPETITIVE_RANKS[i]!;
    if (points >= rank.minPoints) {
      return { id: rank.id, label: rank.label, minPoints: rank.minPoints };
    }
  }
  const first = COMPETITIVE_RANKS[0]!;
  return { id: first.id, label: first.label, minPoints: first.minPoints };
}

// ── Tickets ───────────────────────────────────────────────────────────────

export function getAvailableTickets(): number {
  const profile = loadCompetitiveProfile();
  return Math.max(0, RANKED_DAILY_TICKETS - profile.ticketsUsedToday);
}

export function useTicket(): boolean {
  const profile = loadCompetitiveProfile();
  if (profile.ticketsUsedToday >= RANKED_DAILY_TICKETS) return false;
  profile.ticketsUsedToday++;
  saveCompetitiveProfile(profile);
  return true;
}

// ── Resultado de partida ──────────────────────────────────────────────────

export function recordMatchResult(
  result: "win" | "loss" | "draw",
  isVip: boolean,
): MatchResult {
  const profile = loadCompetitiveProfile();
  const oldRank = getRankForPoints(profile.points);

  let pointsDelta: number;
  let energyReward: number;

  switch (result) {
    case "win":
      pointsDelta = RANKED_WIN_POINTS;
      energyReward = isVip ? RANKED_VIP_WIN_ENERGY_REWARD : RANKED_FREE_WIN_ENERGY_REWARD;
      profile.wins++;
      break;
    case "loss":
      pointsDelta = RANKED_LOSS_POINTS;
      energyReward = isVip ? RANKED_VIP_LOSS_ENERGY_REWARD : RANKED_FREE_LOSS_ENERGY_REWARD;
      profile.losses++;
      break;
    case "draw":
      pointsDelta = RANKED_DRAW_POINTS;
      energyReward = 0;
      profile.draws++;
      break;
  }

  profile.points = Math.max(0, profile.points + pointsDelta);
  saveCompetitiveProfile(profile);

  const newRank = getRankForPoints(profile.points);

  return {
    pointsDelta,
    energyReward,
    newRank,
    promoted: newRank.minPoints > oldRank.minPoints,
    demoted: newRank.minPoints < oldRank.minPoints,
  };
}

// ── Foto SSO ──────────────────────────────────────────────────────────────

export function setPhotoPermission(allowed: boolean): void {
  const profile = loadCompetitiveProfile();
  profile.photoPermission = allowed;
  saveCompetitiveProfile(profile);
}

export function getPhotoPermission(): boolean | null {
  return loadCompetitiveProfile().photoPermission;
}

/** Persistência em localStorage — progresso de estágios e rank */

export interface StageProgress {
  stars: 0 | 1 | 2 | 3;
  bestScore: number;
}

export interface PlayerProfile {
  name: string;
  xp: number;
  stageProgress: Record<number, StageProgress>;
}

const KEY = "dab_profile";

function defaultProfile(): PlayerProfile {
  return { name: "Jogador", xp: 0, stageProgress: {} };
}

export function loadProfile(): PlayerProfile {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultProfile();
    return JSON.parse(raw) as PlayerProfile;
  } catch {
    return defaultProfile();
  }
}

export function saveProfile(p: PlayerProfile): void {
  localStorage.setItem(KEY, JSON.stringify(p));
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
    { rank: "Mestre",      icon: "👑", min: 150000, next: Infinity },
    { rank: "Diamante",    icon: "🔷", min: 75000,  next: 150000 },
    { rank: "Platina III", icon: "💎", min: 50000,  next: 75000 },
    { rank: "Platina II",  icon: "💎", min: 40000,  next: 50000 },
    { rank: "Platina I",   icon: "💎", min: 30000,  next: 40000 },
    { rank: "Ouro III",    icon: "🥇", min: 20000,  next: 30000 },
    { rank: "Ouro II",     icon: "🥇", min: 15000,  next: 20000 },
    { rank: "Ouro I",      icon: "🥇", min: 10000,  next: 15000 },
    { rank: "Prata III",   icon: "🥈", min: 6000,   next: 10000 },
    { rank: "Prata II",    icon: "🥈", min: 3500,   next: 6000 },
    { rank: "Prata I",     icon: "🥈", min: 2500,   next: 3500 },
    { rank: "Bronze III",  icon: "🥉", min: 1500,   next: 2500 },
    { rank: "Bronze II",   icon: "🥉", min: 1000,   next: 1500 },
    { rank: "Bronze I",    icon: "🥉", min: 500,    next: 1000 },
    { rank: "Iniciante",   icon: "⚪", min: 0,      next: 500 },
  ];
  return tiers.find((t) => xp >= t.min) ?? tiers[tiers.length - 1]!;
}

/**
 * Serviço de Feedback
 * Coleta e gerenciamento de feedback pós-partida.
 */
import {
  FEEDBACK_DAILY_REWARD_LIMIT,
  FEEDBACK_ENERGY_REWARD,
  FEEDBACK_CATEGORIES,
  type FeedbackCategory,
} from "../config/game-constants";

// ── Tipos ──────────────────────────────────────────────────────────────────

export interface FeedbackEntry {
  id: string;
  stars: 1 | 2 | 3 | 4 | 5;
  comment: string;
  category: FeedbackCategory;
  mode: string;
  stageId: number | null;
  createdAt: number;
  synced: boolean;
}

export interface FeedbackSubmitResult {
  success: boolean;
  energyRewarded: boolean;
  energyAmount: number;
  dailyLimitReached: boolean;
}

// ── Storage ───────────────────────────────────────────────────────────────

const FEEDBACK_KEY = "dab_feedback";
const FEEDBACK_REWARDS_KEY = "dab_feedback_rewards";

interface FeedbackRewardTracker {
  count: number;
  date: string;
}

function todayString(): string {
  return new Date().toISOString().split("T")[0] ?? "";
}

function loadRewardTracker(): FeedbackRewardTracker {
  try {
    const raw = localStorage.getItem(FEEDBACK_REWARDS_KEY);
    if (!raw) return { count: 0, date: todayString() };
    const tracker = JSON.parse(raw) as FeedbackRewardTracker;
    if (tracker.date !== todayString()) {
      return { count: 0, date: todayString() };
    }
    return tracker;
  } catch {
    return { count: 0, date: todayString() };
  }
}

function saveRewardTracker(tracker: FeedbackRewardTracker): void {
  localStorage.setItem(FEEDBACK_REWARDS_KEY, JSON.stringify(tracker));
}

function loadFeedbackEntries(): FeedbackEntry[] {
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as FeedbackEntry[];
  } catch {
    return [];
  }
}

function saveFeedbackEntries(entries: FeedbackEntry[]): void {
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(entries));
}

// ── API Pública ───────────────────────────────────────────────────────────

export function getRemainingFeedbackRewards(): number {
  const tracker = loadRewardTracker();
  return Math.max(0, FEEDBACK_DAILY_REWARD_LIMIT - tracker.count);
}

export function submitFeedback(
  stars: 1 | 2 | 3 | 4 | 5,
  comment: string,
  category: FeedbackCategory,
  mode: string,
  stageId: number | null,
): FeedbackSubmitResult {
  const entry: FeedbackEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    stars,
    comment,
    category,
    mode,
    stageId,
    createdAt: Date.now(),
    synced: false,
  };

  const entries = loadFeedbackEntries();
  entries.push(entry);
  saveFeedbackEntries(entries);

  const tracker = loadRewardTracker();
  const canReward = tracker.count < FEEDBACK_DAILY_REWARD_LIMIT;

  if (canReward) {
    tracker.count++;
    saveRewardTracker(tracker);
  }

  return {
    success: true,
    energyRewarded: canReward,
    energyAmount: canReward ? FEEDBACK_ENERGY_REWARD : 0,
    dailyLimitReached: tracker.count >= FEEDBACK_DAILY_REWARD_LIMIT,
  };
}

export function getUnsyncedFeedback(): FeedbackEntry[] {
  return loadFeedbackEntries().filter((e) => !e.synced);
}

export function markFeedbackSynced(ids: string[]): void {
  const entries = loadFeedbackEntries();
  for (const entry of entries) {
    if (ids.includes(entry.id)) {
      entry.synced = true;
    }
  }
  saveFeedbackEntries(entries);
}

export { FEEDBACK_CATEGORIES };

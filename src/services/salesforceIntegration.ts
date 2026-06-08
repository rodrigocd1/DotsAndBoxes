/**
 * Salesforce Integration Service
 * Comunicação com Salesforce via Apex REST limitado.
 * Cache local e fallback offline obrigatórios.
 */
import { SALESFORCE_CONFIG } from "../config/game-constants";
import type { AuthProvider, PlayerAccount as AuthPlayerAccount } from "./authTypes";

// ── Tipos ──────────────────────────────────────────────────────────────────

export interface SalesforceResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
  fromCache?: boolean;
}

export interface GameConfig {
  betaServerUrl: string;
  featureFlags: Record<string, boolean>;
  maintenanceMessage: string | null;
  minVersion: string | null;
}

export interface PlayerAccount {
  gamePlayerId: string;
  displayName: string;
  loginProvider: "google" | "apple" | "steam" | null;
  profileJson: string;
  progressJson: string;
  rewardsJson: string;
  passeVipActive: boolean;
  passeVipExpiresAt: string | null;
  isBetaTester: boolean;
  recoveryHash: string | null;
}

export interface FeedbackPayload {
  mode: string;
  stage: number | null;
  boardSize: string;
  difficulty: string;
  avgBotTimeMs: number;
  maxBotTimeMs: number;
  result: "win" | "loss" | "draw";
  score: string;
  durationMs: number;
  powersUsed: string[];
  tipsUsed: number;
  radarUsed: number;
  freezeAiUsed: number;
  stars: number;
  comment: string;
  funRating: number;
  difficultyRating: number;
  fairnessRating: number;
  category: string;
}

export interface RewardCodeResult {
  valid: boolean;
  alreadyUsed: boolean;
  expired: boolean;
  rewards: {
    energy?: number;
    masterTips?: number;
    freeRetries?: number;
  } | null;
}

export interface RecoveryValidation {
  valid: boolean;
  playerId: string | null;
}

// ── Cache ──────────────────────────────────────────────────────────────────

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class SalesforceCache {
  private store = new Map<string, CacheEntry<unknown>>();
  private readonly ttl = SALESFORCE_CONFIG.cacheTtlMs;

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > this.ttl) {
      this.store.delete(key);
      return null;
    }
    return entry.data as T;
  }

  set<T>(key: string, data: T): void {
    this.store.set(key, { data, timestamp: Date.now() });
  }

  clear(): void {
    this.store.clear();
  }
}

// ── Fila de reenvio ───────────────────────────────────────────────────────

interface QueuedOperation {
  id: string;
  endpoint: string;
  payload: unknown;
  attempts: number;
  createdAt: number;
}

const RETRY_QUEUE_KEY = "dab_sf_retry_queue";
const MAX_RETRY_ATTEMPTS = 3;

function loadRetryQueue(): QueuedOperation[] {
  try {
    const raw = localStorage.getItem(RETRY_QUEUE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as QueuedOperation[];
  } catch {
    return [];
  }
}

function saveRetryQueue(queue: QueuedOperation[]): void {
  localStorage.setItem(RETRY_QUEUE_KEY, JSON.stringify(queue));
}

function enqueue(endpoint: string, payload: unknown): void {
  const queue = loadRetryQueue();
  queue.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    endpoint,
    payload,
    attempts: 0,
    createdAt: Date.now(),
  });
  saveRetryQueue(queue);
}

// ── Instância global ──────────────────────────────────────────────────────

const cache = new SalesforceCache();

// ── Helpers ───────────────────────────────────────────────────────────────

async function sfFetch<T>(
  endpoint: string,
  _options?: { method?: string; body?: unknown },
): Promise<SalesforceResult<T>> {
  // TODO: Implementar chamada real para Salesforce Apex REST
  // Exemplo futuro:
  // const url = `${SALESFORCE_CONFIG.baseUrl}${endpoint}`;
  // const response = await fetch(url, { ... });
  void endpoint;
  return { ok: false, error: "Salesforce integration not yet implemented" };
}

function buildPlayerEndpoint(playerId: string): string {
  return `${SALESFORCE_CONFIG.endpoints.playerAccount}?playerId=${encodeURIComponent(playerId)}`;
}

function authProviderToSalesforce(provider: AuthProvider): PlayerAccount["loginProvider"] {
  if (provider === "google" || provider === "apple" || provider === "steam") {
    return provider;
  }
  return null;
}

function serializeJson(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return "{}";
  }
}

function buildPlayerSyncPayload(account: AuthPlayerAccount): Partial<PlayerAccount> & { gamePlayerId: string } {
  return {
    gamePlayerId: account.playerId,
    displayName: account.displayName,
    loginProvider: authProviderToSalesforce(account.provider),
    profileJson: serializeJson({
      avatarUrl: account.avatarUrl ?? null,
      createdAt: account.createdAt,
      deviceId: account.deviceId ?? null,
      email: account.email ?? null,
      linkedProviders: account.linkedProviders,
      provider: account.provider,
      updatedAt: account.lastLoginAt,
      useSsoPhotoInRanking: account.useSsoPhotoInRanking ?? false,
    }),
    progressJson: "{}",
    rewardsJson: "{}",
    passeVipActive: false,
    passeVipExpiresAt: null,
    isBetaTester: false,
    recoveryHash: null,
  };
}

// ── API Pública ───────────────────────────────────────────────────────────

export async function fetchGameConfig(): Promise<SalesforceResult<GameConfig>> {
  const cacheKey = "game_config";
  const cached = cache.get<GameConfig>(cacheKey);
  if (cached) return { ok: true, data: cached, fromCache: true };

  const result = await sfFetch<GameConfig>(SALESFORCE_CONFIG.endpoints.config);
  if (result.ok && result.data) {
    cache.set(cacheKey, result.data);
  }
  return result;
}

export async function sendFeedback(
  feedback: FeedbackPayload,
): Promise<SalesforceResult<{ caseId: string }>> {
  const result = await sfFetch<{ caseId: string }>(
    SALESFORCE_CONFIG.endpoints.feedback,
    { method: "POST", body: feedback },
  );

  if (!result.ok) {
    enqueue(SALESFORCE_CONFIG.endpoints.feedback, feedback);
  }

  return result;
}

export async function validateRewardCode(
  code: string,
  playerId: string,
): Promise<SalesforceResult<RewardCodeResult>> {
  return sfFetch<RewardCodeResult>(SALESFORCE_CONFIG.endpoints.rewardCode, {
    method: "POST",
    body: { code: code.toUpperCase(), playerId },
  });
}

export async function getPlayer(
  playerId: string,
): Promise<SalesforceResult<PlayerAccount>> {
  const cacheKey = `player_${playerId}`;
  const cached = cache.get<PlayerAccount>(cacheKey);
  if (cached) return { ok: true, data: cached, fromCache: true };

  const result = await sfFetch<PlayerAccount>(
    buildPlayerEndpoint(playerId),
  );
  if (result.ok && result.data) {
    cache.set(cacheKey, result.data);
  }
  return result;
}

export async function upsertPlayer(
  player: Partial<PlayerAccount> & { gamePlayerId: string },
): Promise<SalesforceResult<{ success: boolean }>> {
  cache.clear();
  const result = await sfFetch<{ success: boolean }>(
    SALESFORCE_CONFIG.endpoints.playerAccount,
    { method: "POST", body: player },
  );
  if (!result.ok) {
    enqueue(SALESFORCE_CONFIG.endpoints.playerAccount, player);
  }
  return result;
}

export async function validateRecoveryCode(
  recoveryHash: string,
): Promise<SalesforceResult<RecoveryValidation>> {
  return sfFetch<RecoveryValidation>(SALESFORCE_CONFIG.endpoints.recovery, {
    method: "POST",
    body: { recoveryHash },
  });
}

/** Tenta reenviar operações falhadas da fila */
export async function processRetryQueue(): Promise<number> {
  const queue = loadRetryQueue();
  if (queue.length === 0) return 0;

  let processed = 0;
  const remaining: QueuedOperation[] = [];

  for (const op of queue) {
    if (op.attempts >= MAX_RETRY_ATTEMPTS) continue;

    const result = await sfFetch(op.endpoint, {
      method: "POST",
      body: op.payload,
    });

    if (result.ok) {
      processed++;
    } else {
      remaining.push({ ...op, attempts: op.attempts + 1 });
    }
  }

  saveRetryQueue(remaining);
  return processed;
}

export async function syncPlayerAccountToSalesforce(
  account: AuthPlayerAccount,
): Promise<SalesforceResult<{ success: boolean }>> {
  return upsertPlayer(buildPlayerSyncPayload(account));
}

export async function fetchPlayerAccountFromSalesforce(
  playerId: string,
): Promise<SalesforceResult<PlayerAccount>> {
  return getPlayer(playerId);
}

export async function updatePlayerRecoveryHash(
  playerId: string,
  recoveryHash: string,
): Promise<SalesforceResult<{ success: boolean }>> {
  const payload = { playerId, recoveryHash };
  const result = await sfFetch<{ success: boolean }>(
    SALESFORCE_CONFIG.endpoints.recovery,
    { method: "POST", body: payload },
  );
  if (!result.ok) {
    enqueue(SALESFORCE_CONFIG.endpoints.recovery, payload);
  }
  return result;
}

export async function updateSsoPhotoPermission(
  playerId: string,
  useSsoPhoto: boolean,
): Promise<SalesforceResult<{ success: boolean }>> {
  return upsertPlayer({
    gamePlayerId: playerId,
    profileJson: serializeJson({
      useSsoPhotoInRanking: useSsoPhoto,
      updatedAt: new Date().toISOString(),
    }),
  });
}

export async function updatePlayerProfileJson(
  playerId: string,
  profile: unknown,
): Promise<SalesforceResult<{ success: boolean }>> {
  return upsertPlayer({
    gamePlayerId: playerId,
    profileJson: serializeJson(profile),
  });
}

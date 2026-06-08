import {
  AUTH_APPLE_ENABLED,
  AUTH_GOOGLE_ENABLED,
  AUTH_STEAM_FUTURE_ENABLED,
  GUEST_LOGIN_ENABLED,
  REMEMBER_LOGIN_ENABLED,
  SALESFORCE_PLAYER_SYNC_ENABLED,
} from "../config/game-constants";
import type { AuthProvider, AuthSession, LinkedAccount, PlayerAccount } from "./authTypes";
import {
  clearAuthSession,
  clearCurrentPlayerAccount,
  getAuthSession,
  getCurrentPlayerAccount,
  getOrCreateDeviceId,
  isLoggedIn,
  isSsoLoggedIn,
  loadProfile,
  saveAuthSession,
  saveCurrentPlayerAccount,
} from "../ui/storage";
import { t } from "../ui/i18n";
import { syncPlayerAccountToSalesforce, updatePlayerProfileJson } from "./salesforceIntegration";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
const SESSION_REFRESH_WINDOW_MS = 12 * 60 * 60 * 1000;
const DEFAULT_PLAYER_NAME = "Jogador";

export interface AuthState {
  account: PlayerAccount | null;
  session: AuthSession | null;
  isLoggedIn: boolean;
  isGuest: boolean;
  isSsoLoggedIn: boolean;
}

export interface AuthActionResult {
  ok: boolean;
  state: AuthState;
  message?: string;
}

interface MockProviderIdentity {
  email: string;
  displayName: string;
  providerUserId: string;
  avatarUrl: string;
}

function isBrowserDevEnvironment(): boolean {
  const runtime = globalThis as typeof globalThis & {
    location?: { hostname?: string };
  };
  const host = runtime.location?.hostname ?? "";
  return (
    host === "" ||
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "0.0.0.0" ||
    host.endsWith(".local")
  );
}

function normalizeDisplayName(name: string | undefined): string {
  const trimmed = name?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : DEFAULT_PLAYER_NAME;
}

function buildAvatarDataUrl(displayName: string, provider: AuthProvider): string {
  const initials = normalizeDisplayName(displayName)
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "DB";
  const fill = provider === "apple" ? "#111827" : "#2563eb";
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">`,
    `<rect width="160" height="160" rx="36" fill="${fill}"/>`,
    `<circle cx="80" cy="62" r="30" fill="rgba(255,255,255,0.16)"/>`,
    `<path d="M40 132c7-23 27-34 40-34s33 11 40 34" fill="rgba(255,255,255,0.16)"/>`,
    `<text x="80" y="92" font-family="Arial, sans-serif" font-size="34" font-weight="700" text-anchor="middle" fill="#ffffff">${initials}</text>`,
    `</svg>`,
  ].join("");
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function buildMockIdentity(provider: "google" | "apple"): MockProviderIdentity {
  const deviceId = getOrCreateDeviceId();
  const baseName = normalizeDisplayName(loadProfile().name);
  const providerLabel = provider === "google" ? "Google" : "Apple";
  const emailDomain = provider === "google" ? "gmail.mock" : "icloud.mock";
  const displayName = `${baseName} ${providerLabel}`.trim();

  return {
    email: `${deviceId}@${emailDomain}`,
    displayName,
    providerUserId: `${provider}_${deviceId}`,
    avatarUrl: buildAvatarDataUrl(displayName, provider),
  };
}

function currentTimestampIso(offsetMs = 0): string {
  return new Date(Date.now() + offsetMs).toISOString();
}

function getBaseAccount(playerProvider: AuthProvider): PlayerAccount {
  const existing = getCurrentPlayerAccount();
  const deviceId = getOrCreateDeviceId();
  const profileName = normalizeDisplayName(loadProfile().name);

  if (existing) {
    return {
      ...existing,
      displayName: normalizeDisplayName(existing.displayName || profileName),
      provider: playerProvider,
      createdAt: existing.createdAt || currentTimestampIso(),
      lastLoginAt: currentTimestampIso(),
      deviceId,
      linkedProviders: Array.isArray(existing.linkedProviders) ? existing.linkedProviders : [],
    };
  }

  return {
    playerId: `player_${deviceId}`,
    displayName: profileName,
    provider: playerProvider,
    isGuest: playerProvider === "guest",
    isSsoLoggedIn: false,
    createdAt: currentTimestampIso(),
    lastLoginAt: currentTimestampIso(),
    deviceId,
    linkedProviders: [],
  };
}

function upsertLinkedProvider(
  linkedProviders: readonly LinkedAccount[],
  provider: AuthProvider,
  providerUserId: string,
  email?: string,
): LinkedAccount[] {
  const filtered = linkedProviders.filter((entry) => entry.provider !== provider);
  const nextEntry: LinkedAccount = {
    provider,
    providerUserId,
    linkedAt: currentTimestampIso(),
    ...(email ? { email } : {}),
  };
  return [...filtered, nextEntry];
}

function buildSignedInSession(provider: AuthProvider, playerId: string): AuthSession {
  const suffix = Math.random().toString(36).slice(2, 10);
  const expiresAt = currentTimestampIso(SESSION_DURATION_MS);
  return {
    playerId,
    provider,
    accessToken: `mock_access_${provider}_${suffix}`,
    idToken: `mock_id_${provider}_${suffix}`,
    expiresAt,
    isSecurelyStored: false,
  };
}

function buildSignedInAccount(provider: "google" | "apple"): PlayerAccount {
  const base = getBaseAccount(provider);
  const identity = buildMockIdentity(provider);

  return {
    ...base,
    displayName: identity.displayName,
    provider,
    isGuest: false,
    isSsoLoggedIn: true,
    email: identity.email,
    avatarUrl: identity.avatarUrl,
    lastLoginAt: currentTimestampIso(),
    linkedProviders: upsertLinkedProvider(
      base.linkedProviders,
      provider,
      identity.providerUserId,
      identity.email,
    ),
  };
}

function buildGuestAccount(displayName?: string): PlayerAccount {
  const base = getBaseAccount("guest");
  return {
    ...base,
    displayName: normalizeDisplayName(displayName ?? base.displayName),
    provider: "guest",
    isGuest: true,
    isSsoLoggedIn: false,
    lastLoginAt: currentTimestampIso(),
    linkedProviders: base.linkedProviders.filter((entry) => entry.provider !== "guest"),
  };
}

function buildFallbackLoggedInAccount(): PlayerAccount | null {
  if (!isLoggedIn()) return null;
  const session = getAuthSession();
  const provider = session?.provider === "apple" ? "apple" : "google";
  const base = getBaseAccount(provider);
  return {
    ...base,
    provider,
    isGuest: false,
    isSsoLoggedIn: true,
    linkedProviders: base.linkedProviders,
  };
}

function persistSignedInAccount(account: PlayerAccount, session: AuthSession): void {
  saveCurrentPlayerAccount(account);
  if (REMEMBER_LOGIN_ENABLED) {
    saveAuthSession(session);
  } else {
    clearAuthSession();
  }
  if (SALESFORCE_PLAYER_SYNC_ENABLED) {
    void syncPlayerAccountToSalesforce(account);
    void updatePlayerProfileJson(account.playerId, loadProfile());
  }
}

function buildState(account: PlayerAccount | null, session: AuthSession | null): AuthState {
  const loggedIn = isLoggedIn();
  const resolvedAccount = account ?? buildFallbackLoggedInAccount();
  return {
    account: resolvedAccount,
    session,
    isLoggedIn: loggedIn,
    isGuest: resolvedAccount?.isGuest ?? !loggedIn,
    isSsoLoggedIn: isSsoLoggedIn() || loggedIn,
  };
}

function result(ok: boolean, message?: string): AuthActionResult {
  return {
    ok,
    state: getCurrentAuthState(),
    ...(message ? { message } : {}),
  };
}

function canUseMockProvider(provider: "google" | "apple"): boolean {
  void provider;
  return isBrowserDevEnvironment();
}

function isApplePlatformSupported(): boolean {
  const runtime = globalThis as typeof globalThis & {
    navigator?: { userAgent?: string };
  };
  const ua = runtime.navigator?.userAgent ?? "";
  return /iPhone|iPad|Macintosh|Mac OS X/i.test(ua);
}

function convertCurrentAccountToGuest(): void {
  const currentAccount = getCurrentPlayerAccount();
  if (!currentAccount) return;
  saveCurrentPlayerAccount({
    ...currentAccount,
    provider: "guest",
    isGuest: true,
    isSsoLoggedIn: false,
    lastLoginAt: currentTimestampIso(),
  });
}

export function getCurrentAuthState(): AuthState {
  return buildState(getCurrentPlayerAccount(), getAuthSession());
}

export async function signInWithGoogle(): Promise<AuthActionResult> {
  if (!AUTH_GOOGLE_ENABLED) {
    return result(false, t("auth_google_disabled"));
  }
  if (!canUseMockProvider("google")) {
    return result(false, t("auth_google_todo"));
  }

  const account = buildSignedInAccount("google");
  const session = buildSignedInSession("google", account.playerId);
  persistSignedInAccount(account, session);
  return result(true, t("auth_login_success_google"));
}

export async function signInWithApple(): Promise<AuthActionResult> {
  if (!AUTH_APPLE_ENABLED) {
    return result(false, t("auth_apple_disabled"));
  }
  if (!canUseMockProvider("apple") && !isApplePlatformSupported()) {
    return result(false, t("auth_apple_unsupported"));
  }
  if (!canUseMockProvider("apple") && isApplePlatformSupported()) {
    return result(false, t("auth_apple_todo"));
  }

  const account = buildSignedInAccount("apple");
  const session = buildSignedInSession("apple", account.playerId);
  persistSignedInAccount(account, session);
  return result(true, t("auth_login_success_apple"));
}

export async function signInWithSteam(): Promise<AuthActionResult> {
  if (!AUTH_STEAM_FUTURE_ENABLED) {
    return result(false, t("auth_steam_future"));
  }
  return result(false, t("auth_steam_future"));
}

export async function signInAsGuest(displayName?: string): Promise<AuthActionResult> {
  if (!GUEST_LOGIN_ENABLED) {
    return result(false, t("auth_guest_disabled"));
  }
  const guestAccount = buildGuestAccount(displayName);
  saveCurrentPlayerAccount(guestAccount);
  clearAuthSession();
  return result(true, t("auth_guest_continue_success"));
}

export async function signOut(): Promise<AuthActionResult> {
  clearAuthSession();
  clearCurrentPlayerAccount();
  return result(true, t("auth_logout_success"));
}

export async function refreshSessionIfNeeded(): Promise<AuthState> {
  const session = getAuthSession();
  if (!session) return getCurrentAuthState();

  const expiresAtMs = session.expiresAt ? Date.parse(session.expiresAt) : Number.NaN;
  if (Number.isFinite(expiresAtMs) && expiresAtMs <= Date.now()) {
    clearAuthSession();
    convertCurrentAccountToGuest();
    return getCurrentAuthState();
  }

  if (Number.isFinite(expiresAtMs) && expiresAtMs - Date.now() <= SESSION_REFRESH_WINDOW_MS) {
    saveAuthSession({
      ...session,
      expiresAt: currentTimestampIso(SESSION_DURATION_MS),
    });
  }

  return getCurrentAuthState();
}

export async function linkProvider(provider: AuthProvider): Promise<AuthActionResult> {
  if (provider === "guest") {
    return signInAsGuest();
  }
  if (provider === "google") {
    return signInWithGoogle();
  }
  if (provider === "apple") {
    return signInWithApple();
  }
  return signInWithSteam();
}

export async function unlinkProvider(provider: AuthProvider): Promise<AuthActionResult> {
  const account = getCurrentPlayerAccount();
  if (!account) {
    return result(false, t("auth_unlink_missing_account"));
  }

  const nextLinkedProviders = account.linkedProviders.filter((entry) => entry.provider !== provider);
  if (account.provider === provider && nextLinkedProviders.length === 0) {
    clearAuthSession();
    saveCurrentPlayerAccount(buildGuestAccount(account.displayName));
    return result(true, t("auth_unlink_success"));
  }

  const fallbackProvider = account.provider === provider
    ? nextLinkedProviders[0]?.provider ?? "guest"
    : account.provider;

  const nextAccount: PlayerAccount = {
    ...account,
    provider: fallbackProvider,
    isGuest: fallbackProvider === "guest",
    isSsoLoggedIn: fallbackProvider !== "guest",
    linkedProviders: nextLinkedProviders,
    lastLoginAt: currentTimestampIso(),
  };
  saveCurrentPlayerAccount(nextAccount);

  const currentSession = getAuthSession();
  if (currentSession && currentSession.provider === provider) {
    if (fallbackProvider === "guest") {
      clearAuthSession();
    } else {
      saveAuthSession({
        ...currentSession,
        provider: fallbackProvider,
      });
    }
  }

  return result(true, t("auth_unlink_success"));
}

export function canUseOnlineFeatures(): boolean {
  return getCurrentAuthState().isLoggedIn && !getCurrentAuthState().isGuest;
}

export function canUseRanked(): boolean {
  return canUseOnlineFeatures();
}

export function canRedeemPermanentRewardCodes(): boolean {
  return canUseOnlineFeatures();
}

export function canAccumulateTacticalRadar(): boolean {
  return canUseOnlineFeatures();
}

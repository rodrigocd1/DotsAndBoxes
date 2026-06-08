/**
 * Recuperação de Conta
 * Geração e validação de chaves de recuperação.
 */
import {
  RECOVERY_CODE_LENGTH,
  RECOVERY_CODE_CHARSET,
} from "../config/game-constants";
import { validateRecoveryCode as validateRecoveryCodeHash } from "./salesforceIntegration";

// ── Tipos ──────────────────────────────────────────────────────────────────

export interface RecoveryCodeState {
  code: string;
  createdAt: number;
}

export interface RecoveryCodeValidationResult {
  valid: boolean;
  source: "local" | "salesforce" | "none";
  playerId?: string | null;
}

// ── Storage ───────────────────────────────────────────────────────────────

const RECOVERY_KEY = "dab_recovery_code";

function loadRecoveryState(): RecoveryCodeState | null {
  try {
    const raw = localStorage.getItem(RECOVERY_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as RecoveryCodeState;
  } catch {
    return null;
  }
}

function saveRecoveryState(state: RecoveryCodeState): void {
  // TODO: migrar este armazenamento local para secure storage nativo quando o plugin estiver disponível.
  localStorage.setItem(RECOVERY_KEY, JSON.stringify(state));
}

// ── Geração ───────────────────────────────────────────────────────────────

function generateCode(): string {
  const values = new Uint8Array(RECOVERY_CODE_LENGTH);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(values);
  } else {
    for (let i = 0; i < values.length; i++) {
      values[i] = Math.floor(Math.random() * 256);
    }
  }
  let code = "";
  for (let i = 0; i < RECOVERY_CODE_LENGTH; i++) {
    code += RECOVERY_CODE_CHARSET[values[i]! % RECOVERY_CODE_CHARSET.length];
  }
  return code;
}

export function normalizeRecoveryCode(code: string): string {
  return code.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

// ── Hash (SHA-256) ────────────────────────────────────────────────────────

export async function hashCode(code: string): Promise<string> {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const encoded = new TextEncoder().encode(code);
    const buffer = await crypto.subtle.digest("SHA-256", encoded);
    const array = new Uint8Array(buffer);
    return Array.from(array)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  // Fallback simples (não criptograficamente seguro, apenas para dev)
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    const char = code.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash).toString(16).padStart(8, "0");
}

// ── API Pública ───────────────────────────────────────────────────────────

export function getOrCreateRecoveryCode(): RecoveryCodeState {
  const existing = loadRecoveryState();
  if (existing) return existing;

  const state: RecoveryCodeState = {
    code: generateCode(),
    createdAt: Date.now(),
  };
  saveRecoveryState(state);
  return state;
}

export function regenerateRecoveryCode(): RecoveryCodeState {
  const state: RecoveryCodeState = {
    code: generateCode(),
    createdAt: Date.now(),
  };
  saveRecoveryState(state);
  return state;
}

export function getRecoveryCode(): string | null {
  const state = loadRecoveryState();
  return state?.code ?? null;
}

export function hasRecoveryCode(): boolean {
  return loadRecoveryState() !== null;
}

export async function getRecoveryCodeHash(): Promise<string | null> {
  const code = getRecoveryCode();
  if (!code) return null;
  return hashCode(code);
}

export async function validateRecoveryCodeInput(code: string): Promise<RecoveryCodeValidationResult> {
  const normalizedCode = normalizeRecoveryCode(code);
  if (normalizedCode.length !== RECOVERY_CODE_LENGTH) {
    return { valid: false, source: "none" };
  }

  const localCode = getRecoveryCode();
  if (localCode && normalizeRecoveryCode(localCode) === normalizedCode) {
    return { valid: true, source: "local" };
  }

  const recoveryHash = await hashCode(normalizedCode);
  const remoteValidation = await validateRecoveryCodeHash(recoveryHash);
  if (remoteValidation.ok && remoteValidation.data?.valid) {
    return {
      valid: true,
      source: "salesforce",
      playerId: remoteValidation.data.playerId,
    };
  }

  return { valid: false, source: "none" };
}

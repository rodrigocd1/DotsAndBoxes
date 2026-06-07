/**
 * Recuperação de Conta
 * Geração e validação de chaves de recuperação.
 */
import {
  RECOVERY_CODE_LENGTH,
  RECOVERY_CODE_CHARSET,
} from "../config/game-constants";

// ── Tipos ──────────────────────────────────────────────────────────────────

export interface RecoveryCodeState {
  code: string;
  createdAt: number;
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

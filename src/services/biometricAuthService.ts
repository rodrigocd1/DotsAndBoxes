import {
  BIOMETRIC_LOGIN_ENABLED,
  SECURE_SESSION_STORAGE_ENABLED,
} from "../config/game-constants";
import { getAuthSession, loadGodMode } from "../ui/storage";

const BIOMETRIC_ENABLED_KEY = "dab_biometric_login_enabled";

interface LocalStorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function storage(): LocalStorageLike | null {
  return typeof localStorage !== "undefined" ? localStorage : null;
}

export function hasBiometricLoginEnabled(): boolean {
  const backend = storage();
  return backend?.getItem(BIOMETRIC_ENABLED_KEY) === "1";
}

export async function isBiometricAvailable(): Promise<boolean> {
  if (!BIOMETRIC_LOGIN_ENABLED || !SECURE_SESSION_STORAGE_ENABLED) {
    return false;
  }

  const godMode = loadGodMode();
  if (godMode.simulateSso) {
    return true;
  }

  // TODO: ligar ao plugin nativo de biometria/secure storage no app mobile.
  return false;
}

export async function enableBiometricLogin(): Promise<boolean> {
  const backend = storage();
  if (!backend || !getAuthSession()) return false;
  if (!(await isBiometricAvailable())) return false;

  backend.setItem(BIOMETRIC_ENABLED_KEY, "1");
  return true;
}

export function disableBiometricLogin(): void {
  storage()?.removeItem(BIOMETRIC_ENABLED_KEY);
}

export async function authenticateWithBiometrics(): Promise<boolean> {
  if (!(await isBiometricAvailable())) return false;

  const godMode = loadGodMode();
  if (godMode.simulateSso) {
    return true;
  }

  // TODO: disparar prompt biométrico real quando o plugin nativo estiver configurado.
  return false;
}

export async function tryAutoLoginWithBiometrics(): Promise<boolean> {
  if (!hasBiometricLoginEnabled()) return false;
  if (!getAuthSession()) return false;

  return authenticateWithBiometrics();
}

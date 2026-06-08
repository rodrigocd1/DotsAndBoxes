import {
  consumeNervesAttemptIndex,
  getAuthSession,
  getCurrentPlayerAccount,
  isGuestUser,
  isLoggedIn,
  isSsoLoggedIn,
  loadEnergy,
  loadNervesProgress,
  msToNextEnergy,
  resetNervesProgress,
  saveAuthSession,
  saveCurrentPlayerAccount,
  saveEnergy,
} from "./storage";
import { ENERGY_REGEN_MINUTES, GAME_CONSTANTS } from "../config/game-constants";

describe("energy storage", () => {
  const memory = new Map<string, string>();
  const localStorageMock = {
    getItem: (key: string) => memory.get(key) ?? null,
    setItem: (key: string, value: string) => {
      memory.set(key, String(value));
    },
    removeItem: (key: string) => {
      memory.delete(key);
    },
    clear: () => {
      memory.clear();
    },
  };

  beforeAll(() => {
    Object.defineProperty(globalThis, "localStorage", {
      value: localStorageMock,
      configurable: true,
    });
  });

  beforeEach(() => {
    memory.clear();
    jest.restoreAllMocks();
  });

  it("usa a constante de minutos para regenerar energia", () => {
    expect(ENERGY_REGEN_MINUTES).toBe(GAME_CONSTANTS.energy.regenMinutes);

    const intervalMs = Math.round(ENERGY_REGEN_MINUTES * 60_000);

    const now = 1_000_000;
    const nowSpy = jest.spyOn(Date, "now");

    nowSpy.mockReturnValue(now);
    saveEnergy(4);
    expect(loadEnergy()).toBe(4);

    nowSpy.mockReturnValue(now + intervalMs - 1);
    expect(loadEnergy()).toBe(4);
    expect(msToNextEnergy()).toBe(1);

    nowSpy.mockReturnValue(now + intervalMs);
    expect(loadEnergy()).toBe(5);
    expect(msToNextEnergy()).toBe(intervalMs);
  });

  it("persiste e reseta a progressao de tabuleiros do Nervos de Aco", () => {
    expect(loadNervesProgress().attemptsStarted).toBe(0);
    expect(consumeNervesAttemptIndex()).toBe(0);
    expect(consumeNervesAttemptIndex()).toBe(1);
    expect(loadNervesProgress().attemptsStarted).toBe(2);

    resetNervesProgress();

    expect(loadNervesProgress().attemptsStarted).toBe(0);
  });

  it("persiste conta e sessao de usuario com fallback seguro", () => {
    saveCurrentPlayerAccount({
      playerId: "player_google_1",
      displayName: "Rodrigo",
      provider: "google",
      isGuest: false,
      isSsoLoggedIn: true,
      email: "rodrigo@example.com",
      createdAt: "2026-06-08T00:00:00.000Z",
      lastLoginAt: "2026-06-08T00:00:00.000Z",
      linkedProviders: [],
    });

    saveAuthSession({
      playerId: "player_google_1",
      provider: "google",
      accessToken: "token-publico-teste",
      isSecurelyStored: true,
    });

    expect(getCurrentPlayerAccount()?.displayName).toBe("Rodrigo");
    expect(getCurrentPlayerAccount()?.deviceId).toBeTruthy();
    expect(getAuthSession()).toEqual({
      playerId: "player_google_1",
      provider: "google",
      accessToken: "token-publico-teste",
      idToken: undefined,
      expiresAt: undefined,
      isSecurelyStored: false,
    });
    expect(isSsoLoggedIn()).toBe(true);
    expect(isLoggedIn()).toBe(true);
    expect(isGuestUser()).toBe(false);
  });
});

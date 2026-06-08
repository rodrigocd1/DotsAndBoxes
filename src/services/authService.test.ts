import {
  canAccumulateTacticalRadar,
  canRedeemPermanentRewardCodes,
  canUseOnlineFeatures,
  canUseRanked,
  getCurrentAuthState,
  refreshSessionIfNeeded,
  signInAsGuest,
  signInWithGoogle,
} from "./authService";
import { getAuthSession, getCurrentPlayerAccount, saveAuthSession } from "../ui/storage";

describe("auth service", () => {
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

  it("permite jogar como guest sem acesso online", async () => {
    const result = await signInAsGuest();

    expect(result.ok).toBe(true);
    expect(getCurrentPlayerAccount()?.provider).toBe("guest");
    expect(getCurrentAuthState().isGuest).toBe(true);
    expect(canUseOnlineFeatures()).toBe(false);
    expect(canUseRanked()).toBe(false);
    expect(canRedeemPermanentRewardCodes()).toBe(false);
    expect(canAccumulateTacticalRadar()).toBe(false);
  });

  it("promove guest para login Google com sessao persistida", async () => {
    await signInAsGuest();

    const result = await signInWithGoogle();

    expect(result.ok).toBe(true);
    expect(getCurrentPlayerAccount()?.provider).toBe("google");
    expect(getCurrentPlayerAccount()?.isGuest).toBe(false);
    expect(getAuthSession()?.provider).toBe("google");
    expect(canUseOnlineFeatures()).toBe(true);
    expect(canUseRanked()).toBe(true);
    expect(canRedeemPermanentRewardCodes()).toBe(true);
    expect(canAccumulateTacticalRadar()).toBe(true);
  });

  it("converte a conta de volta para guest quando a sessao expira", async () => {
    await signInWithGoogle();

    saveAuthSession({
      playerId: getCurrentPlayerAccount()!.playerId,
      provider: "google",
      accessToken: "expired-token",
      expiresAt: "2000-01-01T00:00:00.000Z",
      isSecurelyStored: false,
    });

    const state = await refreshSessionIfNeeded();

    expect(state.isLoggedIn).toBe(false);
    expect(getAuthSession()).toBeNull();
    expect(getCurrentPlayerAccount()?.provider).toBe("guest");
    expect(getCurrentPlayerAccount()?.isGuest).toBe(true);
  });
});

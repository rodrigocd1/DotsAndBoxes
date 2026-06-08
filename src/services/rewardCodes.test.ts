import { PERMANENT_REWARD_CODE } from "../config/game-constants";
import { redeemCode } from "./rewardCodes";

describe("reward codes", () => {
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
  });

  it("bloqueia o PUTZFORCE sem login", () => {
    expect(redeemCode(PERMANENT_REWARD_CODE, false)).toEqual({
      success: false,
      reason: "requires_login",
    });
  });

  it("mantem o resgate funcional com login", () => {
    const result = redeemCode(PERMANENT_REWARD_CODE, true);

    expect(result.success).toBe(true);
    expect(result.rewards).toEqual({
      energy: 5,
      masterTips: 1,
      freeRetries: 1,
    });
  });
});

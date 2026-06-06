import {
  loadEnergy,
  msToNextEnergy,
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
});

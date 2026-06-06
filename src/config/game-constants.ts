export const GAME_CONSTANTS = {
  version: "v0.01.53",
  energy: {
    max: 10,
    regenMinutes: 2,
    rewardAmount: 5,
  },
  progression: {
    skipsPerWeek: 3,
    totalStages: 60,
    initialStages: 60,
  },
  board: {
    minGridSize: 2,
  },
  renderer: {
    cellSize: 80,
    padding: 50,
    dotRadius: 7,
    hitRadius: 24,
    touchHitRadius: 38,
  },
  admob: {
    useProductionAds: false,
    androidAppIdTest: "ca-app-pub-3940256099942544~3347511713",
    androidAppIdProduction: "ca-app-pub-5289795165154473~7698786958",
    rewardedAdUnitIdTest: "ca-app-pub-3940256099942544/5224354917",
    rewardedAdUnitIdProduction: "ca-app-pub-5289795165154473/3300907170",
  },
} as const;

export const VERSION = GAME_CONSTANTS.version;
export const MAX_ENERGY = GAME_CONSTANTS.energy.max;
export const ENERGY_REGEN_MINUTES = GAME_CONSTANTS.energy.regenMinutes;
export const ENERGY_REWARD_AMOUNT = GAME_CONSTANTS.energy.rewardAmount;
export const SKIPS_PER_WEEK = GAME_CONSTANTS.progression.skipsPerWeek;
export const TOTAL_STAGES = GAME_CONSTANTS.progression.totalStages;
export const INITIAL_STAGES = GAME_CONSTANTS.progression.initialStages;
export const MIN_GRID_SIZE = GAME_CONSTANTS.board.minGridSize;
export const CELL_SIZE = GAME_CONSTANTS.renderer.cellSize;
export const BOARD_PADDING = GAME_CONSTANTS.renderer.padding;
export const DOT_RADIUS = GAME_CONSTANTS.renderer.dotRadius;
export const HIT_RADIUS = GAME_CONSTANTS.renderer.hitRadius;
export const TOUCH_HIT_RADIUS = GAME_CONSTANTS.renderer.touchHitRadius;
export const USE_PRODUCTION_ADS = GAME_CONSTANTS.admob.useProductionAds;
export const ADMOB_ANDROID_APP_ID_TEST = GAME_CONSTANTS.admob.androidAppIdTest;
export const ADMOB_ANDROID_APP_ID_PRODUCTION = GAME_CONSTANTS.admob.androidAppIdProduction;
export const ADMOB_REWARDED_AD_UNIT_ID_TEST = GAME_CONSTANTS.admob.rewardedAdUnitIdTest;
export const ADMOB_REWARDED_AD_UNIT_ID_PRODUCTION = GAME_CONSTANTS.admob.rewardedAdUnitIdProduction;

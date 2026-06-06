import { Capacitor, type PluginListenerHandle } from "@capacitor/core";
import {
  AdMob,
  RewardAdPluginEvents,
  type AdMobRewardItem,
  type RewardAdOptions,
} from "@capacitor-community/admob";
import {
  ADMOB_ANDROID_APP_ID_PRODUCTION,
  ADMOB_ANDROID_APP_ID_TEST,
  ADMOB_REWARDED_AD_UNIT_ID_PRODUCTION,
  ADMOB_REWARDED_AD_UNIT_ID_TEST,
  ENERGY_REWARD_AMOUNT,
  USE_PRODUCTION_ADS,
} from "../config/game-constants";

export {
  ADMOB_ANDROID_APP_ID_PRODUCTION,
  ADMOB_ANDROID_APP_ID_TEST,
  ADMOB_REWARDED_AD_UNIT_ID_PRODUCTION,
  ADMOB_REWARDED_AD_UNIT_ID_TEST,
  ENERGY_REWARD_AMOUNT,
  USE_PRODUCTION_ADS,
} from "../config/game-constants";

// Produção AdMob desativada por segurança. Ativar somente quando solicitado explicitamente.

export const ADMOB_ANDROID_APP_ID_ACTIVE = USE_PRODUCTION_ADS
  ? ADMOB_ANDROID_APP_ID_PRODUCTION
  : ADMOB_ANDROID_APP_ID_TEST;

export const ADMOB_REWARDED_AD_UNIT_ID_ACTIVE = USE_PRODUCTION_ADS
  ? ADMOB_REWARDED_AD_UNIT_ID_PRODUCTION
  : ADMOB_REWARDED_AD_UNIT_ID_TEST;

const ADMOB_PLATFORM_ANDROID = "android";

const REWARDED_FLOW_STATE = {
  Idle: "idle",
  Loading: "loading",
  Showing: "showing",
} as const;

type RewardedFlowState = (typeof REWARDED_FLOW_STATE)[keyof typeof REWARDED_FLOW_STATE];

export const REWARDED_AD_STATUS = {
  Rewarded: "rewarded",
  Unavailable: "unavailable",
  Dismissed: "dismissed",
  Error: "error",
  Busy: "busy",
} as const;

export type RewardedAdStatus = (typeof REWARDED_AD_STATUS)[keyof typeof REWARDED_AD_STATUS];

export interface RewardedAdOutcome {
  status: RewardedAdStatus;
  reward?: AdMobRewardItem;
}

let admobInitialized = false;
let initializePromise: Promise<boolean> | null = null;
let rewardedFlowState: RewardedFlowState = REWARDED_FLOW_STATE.Idle;

function isSupportedAdMobPlatform(): boolean {
  return (
    Capacitor.isNativePlatform() &&
    Capacitor.getPlatform() === ADMOB_PLATFORM_ANDROID &&
    Capacitor.isPluginAvailable("AdMob")
  );
}

function removeListenerHandles(handles: PluginListenerHandle[]): void {
  for (const handle of handles) {
    void handle.remove().catch(() => {});
  }
}

function createRewardedAdOptions(): RewardAdOptions {
  return {
    adId: ADMOB_REWARDED_AD_UNIT_ID_ACTIVE,
    isTesting: !USE_PRODUCTION_ADS,
  };
}

export function getActiveAdMobConfig() {
  return {
    appId: ADMOB_ANDROID_APP_ID_ACTIVE,
    rewardedAdUnitId: ADMOB_REWARDED_AD_UNIT_ID_ACTIVE,
    isProduction: USE_PRODUCTION_ADS,
  };
}

export function isRewardedAdBusy(): boolean {
  return rewardedFlowState !== REWARDED_FLOW_STATE.Idle;
}

export async function initializeAdMob(): Promise<boolean> {
  if (!isSupportedAdMobPlatform()) return false;
  if (admobInitialized) return true;
  if (initializePromise) return initializePromise;

  initializePromise = (async () => {
    try {
      await AdMob.initialize({
        initializeForTesting: !USE_PRODUCTION_ADS,
      });
      admobInitialized = true;
      return true;
    } catch {
      return false;
    } finally {
      if (!admobInitialized) initializePromise = null;
    }
  })();

  return initializePromise;
}

export async function showRewardedEnergyAd(): Promise<RewardedAdOutcome> {
  if (isRewardedAdBusy()) {
    return { status: REWARDED_AD_STATUS.Busy };
  }

  const ready = await initializeAdMob();
  if (!ready) {
    return { status: REWARDED_AD_STATUS.Unavailable };
  }

  rewardedFlowState = REWARDED_FLOW_STATE.Loading;

  const handles: PluginListenerHandle[] = [];
  let showRequested = false;
  let rewardGranted = false;
  let resolveOutcome: ((outcome: RewardedAdOutcome) => void) | null = null;

  const finish = (outcome: RewardedAdOutcome): void => {
    if (!resolveOutcome) return;
    const resolve = resolveOutcome;
    resolveOutcome = null;
    rewardedFlowState = REWARDED_FLOW_STATE.Idle;
    removeListenerHandles(handles);
    resolve(outcome);
  };

  const outcomePromise = new Promise<RewardedAdOutcome>((resolve) => {
    resolveOutcome = resolve;
  });

  const requestShow = (): void => {
    if (showRequested) return;
    showRequested = true;
    rewardedFlowState = REWARDED_FLOW_STATE.Showing;
    void AdMob.showRewardVideoAd().catch(() => {
      finish({ status: REWARDED_AD_STATUS.Error });
    });
  };

  try {
    handles.push(await AdMob.addListener(RewardAdPluginEvents.Loaded, () => {
      requestShow();
    }));
    handles.push(await AdMob.addListener(RewardAdPluginEvents.FailedToLoad, () => {
      finish({ status: REWARDED_AD_STATUS.Unavailable });
    }));
    handles.push(await AdMob.addListener(RewardAdPluginEvents.FailedToShow, () => {
      finish({ status: REWARDED_AD_STATUS.Error });
    }));
    handles.push(await AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward: AdMobRewardItem) => {
      if (rewardGranted) return;
      rewardGranted = true;
      finish({ status: REWARDED_AD_STATUS.Rewarded, reward });
    }));
    handles.push(await AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
      if (!rewardGranted) {
        finish({ status: REWARDED_AD_STATUS.Dismissed });
      }
    }));

    await AdMob.prepareRewardVideoAd(createRewardedAdOptions());
    return await outcomePromise;
  } catch {
    finish({ status: REWARDED_AD_STATUS.Unavailable });
    return await outcomePromise;
  }
}

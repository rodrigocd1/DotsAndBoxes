// ══════════════════════════════════════════════════════════════════════════════
// GOD MODE — Deve ser a primeira constante importante do arquivo
// ══════════════════════════════════════════════════════════════════════════════

/** Ativa God Mode global (ferramentas de dev/teste) */
export const GOD_MODE_ENABLED = true;
/** Simula SSO ativo sem login real */
export const GOD_MODE_SIMULATE_SSO_ENABLED = true;
/** Simula Passe VIP assinado */
export const GOD_MODE_SIMULATE_VIP_ENABLED = true;
/** Permite resetar limites diários/semanais */
export const GOD_MODE_LIMIT_RESET_ENABLED = true;

// ══════════════════════════════════════════════════════════════════════════════
// VERSÃO
// ══════════════════════════════════════════════════════════════════════════════

export const GAME_CONSTANTS = {
  version: "v0.01.68",
  energy: {
    max: 10,
    regenMinutes: 2,
    rewardAmount: 5,
  },
} as const;

export const VERSION = GAME_CONSTANTS.version;

// ══════════════════════════════════════════════════════════════════════════════
// PASSE VIP
// ══════════════════════════════════════════════════════════════════════════════

export const VIP_PASS_ENABLED = false;
export const VIP_PASS_DISPLAY_NAME = "Passe VIP";
export const VIP_PASS_MONTHLY_PRICE_BRL = 4.99;
export const VIP_PASS_ANNUAL_PRICE_BRL = 49.99;
export const VIP_PASS_ANTI_PAY_TO_WIN_MESSAGE =
  "O premium melhora recompensa, não aumenta chance de ganhar!";
export const VIP_PASS_MONTHLY_PRODUCT_ID = "dbm_vip_monthly";
export const VIP_PASS_ANNUAL_PRODUCT_ID = "dbm_vip_annual";
export const REMOVE_ADS_PRODUCT_ID = "dbm_remove_ads";
export const REMOVE_ADS_PRICE_BRL = 19.9;

// ══════════════════════════════════════════════════════════════════════════════
// ENERGIA
// ══════════════════════════════════════════════════════════════════════════════

export const INITIAL_ENERGY = 5;
export const FREE_MAX_ENERGY = 10;
export const VIP_MAX_ENERGY = 12;
export const REWARDED_AD_ENERGY_AMOUNT = 5;
export const TUTORIAL_COMPLETION_BONUS_ENERGY = 3;
export const TUTORIAL_COMPLETION_BONUS_DAYS = 3;
export const SSO_WELCOME_KIT_DAYS = 3;
export const SSO_WELCOME_KIT_DOUBLE_ENERGY_ENABLED = true;

// Aliases para compatibilidade com código existente
export const MAX_ENERGY = FREE_MAX_ENERGY;
export const ENERGY_REGEN_MINUTES = 2;
export const ENERGY_REWARD_AMOUNT = REWARDED_AD_ENERGY_AMOUNT;

// ══════════════════════════════════════════════════════════════════════════════
// DESBLOQUEIO POR FASE
// ══════════════════════════════════════════════════════════════════════════════

/** Fase em que a Dica do Mestre desbloqueia */
export const MASTER_TIP_UNLOCK_STAGE = 3;
/** Fase em que o feedback desbloqueia */
export const FEEDBACK_UNLOCK_STAGE = 3;
/** Fase em que o XP dobrado desbloqueia */
export const DOUBLE_XP_UNLOCK_STAGE = 5;
/** Fase em que o retry grátis (sem energia) desbloqueia */
export const ENERGY_FREE_RETRY_UNLOCK_STAGE = 5;
/** Fase em que o Timer Attack desbloqueia */
export const TIMER_ATTACK_UNLOCK_STAGE = 8;
/** Fase em que o Ranked desbloqueia */
export const RANKED_UNLOCK_STAGE = 10;
/** Fase em que o Radar Tático desbloqueia */
export const TACTICAL_RADAR_UNLOCK_STAGE = 11;
/** Fase em que Nervos de Aço desbloqueia */
export const NERVES_OF_STEEL_UNLOCK_STAGE = 12;

// ══════════════════════════════════════════════════════════════════════════════
// DICA DO MESTRE
// ══════════════════════════════════════════════════════════════════════════════

/** Free: dicas por dia via anúncio */
export const FREE_MASTER_TIP_DAILY_AD_LIMIT = 3;
/** VIP Arcade: dicas por dia */
export const VIP_MASTER_TIP_DAILY_LIMIT = 6;
/** VIP treino básico: limite = ratio * jogadas estimadas do tabuleiro */
export const VIP_BASIC_TRAINING_MASTER_TIP_MAX_RATIO = 0.5;

// ══════════════════════════════════════════════════════════════════════════════
// RADAR TÁTICO
// ══════════════════════════════════════════════════════════════════════════════

/** Estoque máximo de Radar Tático */
export const TACTICAL_RADAR_MAX_STOCK = 5;

// ══════════════════════════════════════════════════════════════════════════════
// CONGELAR IA
// ══════════════════════════════════════════════════════════════════════════════

/** Free: 1 uso a cada N dias */
export const FREE_FREEZE_AI_INTERVAL_DAYS = 4;
/** VIP: 1 uso a cada N dias */
export const VIP_FREEZE_AI_INTERVAL_DAYS = 3;

// ══════════════════════════════════════════════════════════════════════════════
// RETRY SEM ENERGIA
// ══════════════════════════════════════════════════════════════════════════════

/** Free: retries por dia assistindo anúncio */
export const FREE_RETRY_DAILY_AD_LIMIT = 10;
/** VIP: retries grátis por dia sem anúncio */
export const VIP_RETRY_DAILY_FREE_LIMIT = 5;

// ══════════════════════════════════════════════════════════════════════════════
// XP
// ══════════════════════════════════════════════════════════════════════════════

/** Multiplicador XP free */
export const FREE_XP_MULTIPLIER = 1.0;
/** Multiplicador XP free com anúncio */
export const FREE_AD_XP_MULTIPLIER = 2.0;
/** Multiplicador XP VIP automático */
export const VIP_XP_MULTIPLIER = 1.5;
/** Multiplicador XP VIP com anúncio */
export const VIP_AD_XP_MULTIPLIER = 3.0;

// ══════════════════════════════════════════════════════════════════════════════
// FEEDBACK
// ══════════════════════════════════════════════════════════════════════════════

/** Energia concedida por feedback */
export const FEEDBACK_ENERGY_REWARD = 1;
/** Feedbacks recompensados por dia */
export const FEEDBACK_DAILY_REWARD_LIMIT = 3;
/** Mensagem de incentivo ao feedback */
export const FEEDBACK_INCENTIVE_MESSAGE =
  "Deixe seu feedback e ganhe +1 energia.";

/** Categorias de feedback */
export const FEEDBACK_CATEGORIES = [
  "elogio",
  "sugestao_melhoria",
  "reclamacao",
  "erro_bug",
  "ia_lenta",
  "tabuleiro_injusto",
  "dificuldade_desbalanceada",
  "outro",
] as const;

export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number];

// ══════════════════════════════════════════════════════════════════════════════
// TREINO
// ══════════════════════════════════════════════════════════════════════════════

/** Tabuleiros básicos (quadrados simples) */
export const BASIC_TRAINING_GRID_SIZES = [3, 4, 5, 6] as const;
/** Mensagem treino VIP bloqueado */
export const VIP_TRAINING_LOCKED_MESSAGE =
  "Esse tabuleiro faz parte do Passe VIP. Ao assinar, você desbloqueia tabuleiros especiais para treino. Nesses tabuleiros não é permitido usar poderes.";

// ══════════════════════════════════════════════════════════════════════════════
// COMPETITIVO / RANKED
// ══════════════════════════════════════════════════════════════════════════════

/** Tickets competitivos por dia */
export const RANKED_DAILY_TICKETS = 10;
/** Pontos por vitória ranked */
export const RANKED_WIN_POINTS = 4;
/** Pontos por derrota ranked (negativo) */
export const RANKED_LOSS_POINTS = -2;
/** Pontos por empate ranked */
export const RANKED_DRAW_POINTS = 0;

/** Recompensa pós-partida ranked (energia normal) */
export const RANKED_FREE_WIN_ENERGY_REWARD = 1;
export const RANKED_FREE_LOSS_ENERGY_REWARD = 0;
export const RANKED_VIP_WIN_ENERGY_REWARD = 2;
export const RANKED_VIP_LOSS_ENERGY_REWARD = 1;

/** Tabela de ranks competitivos: [nome, pontos mínimos] */
export const COMPETITIVE_RANKS = [
  { id: "bronze_3", label: "Bronze III", minPoints: 0 },
  { id: "bronze_2", label: "Bronze II", minPoints: 40 },
  { id: "bronze_1", label: "Bronze I", minPoints: 100 },
  { id: "silver_3", label: "Prata III", minPoints: 180 },
  { id: "silver_2", label: "Prata II", minPoints: 300 },
  { id: "silver_1", label: "Prata I", minPoints: 450 },
  { id: "gold_3", label: "Ouro III", minPoints: 650 },
  { id: "gold_2", label: "Ouro II", minPoints: 900 },
  { id: "gold_1", label: "Ouro I", minPoints: 1200 },
  { id: "platinum_3", label: "Platina III", minPoints: 1600 },
  { id: "platinum_2", label: "Platina II", minPoints: 2100 },
  { id: "platinum_1", label: "Platina I", minPoints: 2700 },
  { id: "diamond_3", label: "Diamante III", minPoints: 3500 },
  { id: "diamond_2", label: "Diamante II", minPoints: 4500 },
  { id: "diamond_1", label: "Diamante I", minPoints: 5800 },
  { id: "master", label: "Mestre", minPoints: 7500 },
  { id: "legendary", label: "Lendário", minPoints: 10000 },
] as const;

// ══════════════════════════════════════════════════════════════════════════════
// TIMER ATTACK
// ══════════════════════════════════════════════════════════════════════════════

/** Duração do Timer Attack em segundos */
export const TIMER_ATTACK_DURATION_SECONDS = 180;
/** Grade fixa usada internamente no Timer Attack */
export const TIMER_ATTACK_DEFAULT_GRID_SIZE = 4;

// ══════════════════════════════════════════════════════════════════════════════
// NERVOS DE AÇO
// ══════════════════════════════════════════════════════════════════════════════

export const NERVES_OF_STEEL_DISPLAY_NAME = "Nervos de Aço";
export const NERVES_OF_STEEL_TAGLINE =
  "Uma vida. Tempo correndo. Até onde você aguenta?";
/** Tempo por jogada em segundos */
export const NERVES_OF_STEEL_MOVE_TIME_SECONDS = 10;
/** Bônus VIP de tempo extra (segundos) */
export const NERVES_OF_STEEL_VIP_EXTRA_TIME_SECONDS = 2;
/** VIP: vidas extras por tentativa */
export const NERVES_OF_STEEL_VIP_EXTRA_LIVES = 1;

// ══════════════════════════════════════════════════════════════════════════════
// X1 ONLINE
// ══════════════════════════════════════════════════════════════════════════════

/** URL do servidor beta */
export const X1_BETA_SERVER_URL = "https://dbm-beta.myftp.biz";
/** Status do X1 */
export const X1_STATUS = "coming_soon" as const;

// ══════════════════════════════════════════════════════════════════════════════
// BANNERS — onde exibir
// ══════════════════════════════════════════════════════════════════════════════

export const BANNER_CONFIG = {
  menuPrincipal: false,
  loja: true,
  mapa: true,
  perfil: true,
  feedback: false,
  gameplay: false,
  tutorial: false,
  ranked: false,
  x1: false,
} as const;

// ══════════════════════════════════════════════════════════════════════════════
// ADMOB — IDs de anúncio
// ══════════════════════════════════════════════════════════════════════════════

export const USE_PRODUCTION_ADS = false;

// IDs de teste (Google sample ads)
const ADMOB_TEST = {
  androidAppId: "ca-app-pub-3940256099942544~3347511713",
  bannerAdUnitId: "ca-app-pub-3940256099942544/6300978111",
  rewardedAdUnitId: "ca-app-pub-3940256099942544/5224354917",
} as const;

// IDs de produção (preencher quando ativar)
const ADMOB_PROD = {
  androidAppId: "ca-app-pub-5289795165154473~7698786958",
  bannerAdUnitId: "TODO_BANNER_PROD_ID",
  rewardedAdUnitId: "ca-app-pub-5289795165154473/3300907170",
} as const;

const ADMOB_ACTIVE = USE_PRODUCTION_ADS ? ADMOB_PROD : ADMOB_TEST;

// Exports legados para compatibilidade
export const ADMOB_ANDROID_APP_ID_TEST = ADMOB_TEST.androidAppId;
export const ADMOB_ANDROID_APP_ID_PRODUCTION = ADMOB_PROD.androidAppId;
export const ADMOB_REWARDED_AD_UNIT_ID_TEST = ADMOB_TEST.rewardedAdUnitId;
export const ADMOB_REWARDED_AD_UNIT_ID_PRODUCTION = ADMOB_PROD.rewardedAdUnitId;

// Exports ativos (usar estes nos novos módulos)
export const ADMOB_ANDROID_APP_ID_ACTIVE = ADMOB_ACTIVE.androidAppId;
export const ADMOB_BANNER_AD_UNIT_ID_ACTIVE = ADMOB_ACTIVE.bannerAdUnitId;
export const ADMOB_REWARDED_AD_UNIT_ID_ACTIVE = ADMOB_ACTIVE.rewardedAdUnitId;

// IDs por função (separação lógica — todos apontam para o mesmo test ID por ora)
export const ADMOB_IDS = {
  test: {
    bannerLoja: ADMOB_TEST.bannerAdUnitId,
    bannerMapa: ADMOB_TEST.bannerAdUnitId,
    bannerPerfil: ADMOB_TEST.bannerAdUnitId,
    rewardedEnergy: ADMOB_TEST.rewardedAdUnitId,
    rewardedRetry: ADMOB_TEST.rewardedAdUnitId,
    rewardedMasterTip: ADMOB_TEST.rewardedAdUnitId,
    rewardedDoubleXp: ADMOB_TEST.rewardedAdUnitId,
    rewardedTacticalRadar: ADMOB_TEST.rewardedAdUnitId,
  },
  production: {
    bannerLoja: "TODO_BANNER_LOJA_PROD",
    bannerMapa: "TODO_BANNER_MAPA_PROD",
    bannerPerfil: "TODO_BANNER_PERFIL_PROD",
    rewardedEnergy: ADMOB_PROD.rewardedAdUnitId,
    rewardedRetry: "TODO_REWARDED_RETRY_PROD",
    rewardedMasterTip: "TODO_REWARDED_MASTER_TIP_PROD",
    rewardedDoubleXp: "TODO_REWARDED_DOUBLE_XP_PROD",
    rewardedTacticalRadar: "TODO_REWARDED_TACTICAL_RADAR_PROD",
  },
} as const;

// ══════════════════════════════════════════════════════════════════════════════
// SALESFORCE
// ══════════════════════════════════════════════════════════════════════════════

export const SALESFORCE_CONFIG = {
  /** Endpoint base — preencher com URL real */
  baseUrl: "TODO_SALESFORCE_BASE_URL",
  /** Endpoints específicos */
  endpoints: {
    config: "/services/apexrest/dbm/config",
    feedback: "/services/apexrest/dbm/feedback",
    rewardCode: "/services/apexrest/dbm/reward-code",
    playerAccount: "/services/apexrest/dbm/player",
    recovery: "/services/apexrest/dbm/recovery",
  },
  /** Nome do Account especial de configuração */
  gameConfigAccountName: "GAME_CONFIG",
  /** Cache TTL em milissegundos (5 minutos) */
  cacheTtlMs: 5 * 60 * 1000,
  /** Timeout de requisição em milissegundos */
  requestTimeoutMs: 10_000,
} as const;

// ══════════════════════════════════════════════════════════════════════════════
// RECUPERAÇÃO DE CONTA
// ══════════════════════════════════════════════════════════════════════════════

/** Comprimento do código de recuperação */
export const RECOVERY_CODE_LENGTH = 28;
/** Caracteres usados (sem O, I, L para evitar confusão) */
export const RECOVERY_CODE_CHARSET =
  "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

// ══════════════════════════════════════════════════════════════════════════════
// CÓDIGO DE RECOMPENSA
// ══════════════════════════════════════════════════════════════════════════════

/** Código permanente */
export const PERMANENT_REWARD_CODE = "PUTZFORCE";

export const REWARD_CODE_REWARDS = {
  PUTZFORCE: {
    energy: 5,
    masterTips: 1,
    freeRetries: 1,
  },
} as const;

// ══════════════════════════════════════════════════════════════════════════════
// PROGRESSÃO (compatibilidade)
// ══════════════════════════════════════════════════════════════════════════════

export const SKIPS_PER_WEEK = 3;
export const TOTAL_STAGES = 60;
export const INITIAL_STAGES = 60;

// ══════════════════════════════════════════════════════════════════════════════
// TABULEIRO / RENDERER (compatibilidade)
// ══════════════════════════════════════════════════════════════════════════════

export const MIN_GRID_SIZE = 2;
export const CELL_SIZE = 80;
export const BOARD_PADDING = 50;
export const DOT_RADIUS = 7;
export const HIT_RADIUS = 24;
export const TOUCH_HIT_RADIUS = 38;

// ══════════════════════════════════════════════════════════════════════════════
// BOT / IA — Timeouts
// ══════════════════════════════════════════════════════════════════════════════

export const BOT_TIMEOUTS_MS = {
  "muito-facil": 100,
  facil: 200,
  medio: 500,
  dificil: 1000,
  "muito-dificil": 1500,
  impossivel: 2000,
  impulsivo: 300,
} as const;

// ══════════════════════════════════════════════════════════════════════════════
// TUTORIAL
// ══════════════════════════════════════════════════════════════════════════════

export const TUTORIAL_SKIP_MESSAGE =
  "Você pode pular o tutorial e fazer depois a qualquer momento. Ao concluir, você ganha +3 energia por 3 dias. Esse bônus só pode ser recebido 1 vez por conta.";

// ══════════════════════════════════════════════════════════════════════════════
// MENSAGEM DE RECURSO BLOQUEADO
// ══════════════════════════════════════════════════════════════════════════════

/** Template para recurso bloqueado — usar com replace("{stage}", stageNumber) */
export const LOCKED_FEATURE_MESSAGE_TEMPLATE =
  "Esse recurso será desbloqueado na Fase {stage}.";

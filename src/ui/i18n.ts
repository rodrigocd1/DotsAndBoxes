export type Lang = "pt-BR" | "pt-PT" | "es" | "en";

export const LANG_NAMES: Record<Lang, string> = {
  "pt-BR": "🇧🇷",
  "pt-PT": "🇵🇹",
  "es":    "🇪🇸",
  "en":    "🇬🇧",
};

const LANG_KEY = "dab_lang";

export function getCurrentLang(): Lang {
  const stored = localStorage.getItem(LANG_KEY) as Lang | null;
  if (stored && stored in LANG_NAMES) return stored;
  const nav = navigator.language ?? "";
  if (nav.startsWith("pt-PT")) return "pt-PT";
  if (nav.startsWith("pt"))    return "pt-BR";
  if (nav.startsWith("es"))    return "es";
  return "en";
}

export function setLang(lang: Lang): void {
  localStorage.setItem(LANG_KEY, lang);
}

export function t(key: string, vars?: Record<string, string | number>): string {
  const lang = getCurrentLang();
  let str =
    (TRANSLATIONS[lang] as Record<string, string>)[key] ??
    (TRANSLATIONS["en"] as Record<string, string>)[key] ??
    key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replaceAll(`{${k}}`, String(v));
    }
  }
  return str;
}

// ── Traduções ─────────────────────────────────────────────────────────────

const TRANSLATIONS: Record<Lang, Record<string, string>> = {
  // ────────────────── PORTUGUÊS BRASIL ──────────────────
  "pt-BR": {
    tagline: "Conecte • Feche • Domine",
    menu_arcade: "Arcade",
    menu_arcade_sub: "{done}/{total} fases concluídas",
    menu_bot: "Modo Treino",
    menu_bot_sub: "7 dificuldades",
    menu_multi: "Multijogador",
    menu_multi_sub: "2 a 4 jogadores • Duplas ou Solo",
    back: "← Voltar",
    lang_label: "Idioma",

    // Energia
    energy_no: "⚡ Sem energia! Aguarde a recarga ou assista um anúncio.",
    energy_recharged: "⚡ Energia recarregada!",
    energy_unlimited: "∞",

    // Configurações
    settings: "Configurações",
    theme: "Tema",
    theme_dark: "🌙 Escuro",
    theme_light: "☀️ Claro",
    multiplatform: "Multiplataforma",
    profile: "Perfil",

    // Bot
    diff_muito_facil: "Muito Fácil",
    diff_facil: "Fácil",
    diff_medio: "Médio",
    diff_dificil: "Difícil",
    diff_muito_dificil: "Muito Difícil",
    diff_impossivel: "Impossível",
    diff_impulsivo: "Impulsivo",

    // Setup
    setup_difficulty: "Dificuldade",
    setup_grid: "Grade",
    setup_players: "Jogadores",
    setup_mode: "Modo",
    setup_solo: "Solo (todos vs todos)",
    setup_teams: "Duplas (2v2)",
    setup_start: "Iniciar Partida",

    // Jogo
    game_turn: "Vez de {name}",
    game_bot_thinking: "Bot pensando...",
    stage_label: "Fase {id}",
    vs_bot_label: "vs Bot — {diff}",
    teams_2v2: "Duplas 2v2",
    n_players: "{n} Jogadores",
    team_a: "Time A",
    team_b: "Time B",

    // Celebração
    stage_complete: "COMPLETA!",
    next_stage: "Próxima Fase →",
    map: "📍 Mapa",
    victory: "Vitória!",
    won_suffix: "venceu!",
    tie: "🤝 Empate!",
    new_game: "Nova Partida",
    xp_gained: "+{xp} XP",

    // Derrota
    you_lost: "Você perdeu!",
    try_again: "⚡ Tentar de novo",
    watch_ad: "📺 Assistir anúncio",

    // Anúncio
    ad_label: "ANÚNCIO",
    ad_close_timer: "Fechar ({n})",
    ad_close_ready: "✓ Fechar",
    ad_text: "Baixe agora o melhor jogo!",
    ad_cta: "JOGAR GRÁTIS",

    // God Mode
    god_mode: "👑 God Mode",
    god_unlimited_energy: "Energia ilimitada",
    god_go_stage: "Ir para fase específica",
    god_go: "IR",
    god_next: "⏭ Próxima fase ({id})",
    god_refill: "⚡ Recarregar energia",
    god_activated: "👑 God Mode ATIVADO!",
    god_deactivated: "God Mode desativado",
    on_label: "ON",
    off_label: "OFF",

    // Jogadores
    player_n: "Jogador {n}",
    you: "Você",
    bot: "Bot",

    // Ranks
    rank_master:     "Mestre",
    rank_diamond:    "Diamante",
    rank_plat_3:     "Platina III",
    rank_plat_2:     "Platina II",
    rank_plat_1:     "Platina I",
    rank_gold_3:     "Ouro III",
    rank_gold_2:     "Ouro II",
    rank_gold_1:     "Ouro I",
    rank_silver_3:   "Prata III",
    rank_silver_2:   "Prata II",
    rank_silver_1:   "Prata I",
    rank_bronze_3:   "Bronze III",
    rank_bronze_2:   "Bronze II",
    rank_bronze_1:   "Bronze I",
    rank_beginner:   "Iniciante",
  },

  // ────────────────── PORTUGUÊS PORTUGAL ──────────────────
  "pt-PT": {
    settings: "Definições",
    theme: "Tema",
    theme_dark: "🌙 Escuro",
    theme_light: "☀️ Claro",
    multiplatform: "Multiplataforma",
    profile: "Perfil",
    tagline: "Conecte • Feche • Domine",
    menu_arcade: "Arcade",
    menu_arcade_sub: "{done}/{total} fases concluídas",
    menu_bot: "Modo Treino",
    menu_bot_sub: "7 dificuldades",
    menu_multi: "Multijogador",
    menu_multi_sub: "2 a 4 jogadores • Duplas ou Solo",
    back: "← Voltar",
    lang_label: "Idioma",

    energy_no: "⚡ Sem energia! Aguarde a recarga ou veja um anúncio.",
    energy_recharged: "⚡ Energia recarregada!",
    energy_unlimited: "∞",

    diff_muito_facil: "Muito Fácil",
    diff_facil: "Fácil",
    diff_medio: "Médio",
    diff_dificil: "Difícil",
    diff_muito_dificil: "Muito Difícil",
    diff_impossivel: "Impossível",
    diff_impulsivo: "Impulsivo",

    setup_difficulty: "Dificuldade",
    setup_grid: "Grelha",
    setup_players: "Jogadores",
    setup_mode: "Modo",
    setup_solo: "Solo (todos vs todos)",
    setup_teams: "Duplas (2v2)",
    setup_start: "Iniciar Jogo",

    game_turn: "Vez de {name}",
    game_bot_thinking: "Bot a pensar...",
    stage_label: "Fase {id}",
    vs_bot_label: "vs Bot — {diff}",
    teams_2v2: "Duplas 2v2",
    n_players: "{n} Jogadores",
    team_a: "Equipa A",
    team_b: "Equipa B",

    stage_complete: "COMPLETA!",
    next_stage: "Próxima Fase →",
    map: "📍 Mapa",
    victory: "Vitória!",
    won_suffix: "venceu!",
    tie: "🤝 Empate!",
    new_game: "Novo Jogo",
    xp_gained: "+{xp} XP",

    you_lost: "Perdeu!",
    try_again: "⚡ Tentar novamente",
    watch_ad: "📺 Ver anúncio",

    ad_label: "ANÚNCIO",
    ad_close_timer: "Fechar ({n})",
    ad_close_ready: "✓ Fechar",
    ad_text: "Descarregue agora o melhor jogo!",
    ad_cta: "JOGAR GRÁTIS",

    god_mode: "👑 God Mode",
    god_unlimited_energy: "Energia ilimitada",
    god_go_stage: "Ir para fase específica",
    god_go: "IR",
    god_next: "⏭ Próxima fase ({id})",
    god_refill: "⚡ Recarregar energia",
    god_activated: "👑 God Mode ATIVADO!",
    god_deactivated: "God Mode desativado",
    on_label: "ON",
    off_label: "OFF",

    player_n: "Jogador {n}",
    you: "Você",
    bot: "Bot",

    rank_master:     "Mestre",
    rank_diamond:    "Diamante",
    rank_plat_3:     "Platina III",
    rank_plat_2:     "Platina II",
    rank_plat_1:     "Platina I",
    rank_gold_3:     "Ouro III",
    rank_gold_2:     "Ouro II",
    rank_gold_1:     "Ouro I",
    rank_silver_3:   "Prata III",
    rank_silver_2:   "Prata II",
    rank_silver_1:   "Prata I",
    rank_bronze_3:   "Bronze III",
    rank_bronze_2:   "Bronze II",
    rank_bronze_1:   "Bronze I",
    rank_beginner:   "Iniciante",
  },

  // ────────────────── ESPAÑOL ──────────────────
  "es": {
    settings: "Ajustes",
    theme: "Tema",
    theme_dark: "🌙 Oscuro",
    theme_light: "☀️ Claro",
    multiplatform: "Multiplataforma",
    profile: "Perfil",
    tagline: "Conecta • Cierra • Domina",
    menu_arcade: "Arcade",
    menu_arcade_sub: "{done}/{total} fases completadas",
    menu_bot: "Modo Entrenamiento",
    menu_bot_sub: "7 niveles de dificultad",
    menu_multi: "Multijugador",
    menu_multi_sub: "2 a 4 jugadores • Parejas o Solo",
    back: "← Volver",
    lang_label: "Idioma",

    energy_no: "⚡ ¡Sin energía! Espera la recarga o ve un anuncio.",
    energy_recharged: "⚡ ¡Energía recargada!",
    energy_unlimited: "∞",

    diff_muito_facil: "Muy Fácil",
    diff_facil: "Fácil",
    diff_medio: "Medio",
    diff_dificil: "Difícil",
    diff_muito_dificil: "Muy Difícil",
    diff_impossivel: "Imposible",
    diff_impulsivo: "Impulsivo",

    setup_difficulty: "Dificultad",
    setup_grid: "Cuadrícula",
    setup_players: "Jugadores",
    setup_mode: "Modo",
    setup_solo: "Solo (todos vs todos)",
    setup_teams: "Parejas (2v2)",
    setup_start: "Iniciar Partida",

    game_turn: "Turno de {name}",
    game_bot_thinking: "Bot pensando...",
    stage_label: "Fase {id}",
    vs_bot_label: "vs Bot — {diff}",
    teams_2v2: "Parejas 2v2",
    n_players: "{n} Jugadores",
    team_a: "Equipo A",
    team_b: "Equipo B",

    stage_complete: "¡COMPLETA!",
    next_stage: "Siguiente Fase →",
    map: "📍 Mapa",
    victory: "¡Victoria!",
    won_suffix: "¡ganó!",
    tie: "🤝 ¡Empate!",
    new_game: "Nueva Partida",
    xp_gained: "+{xp} XP",

    you_lost: "¡Perdiste!",
    try_again: "⚡ Intentar de nuevo",
    watch_ad: "📺 Ver anuncio",

    ad_label: "ANUNCIO",
    ad_close_timer: "Cerrar ({n})",
    ad_close_ready: "✓ Cerrar",
    ad_text: "¡Descarga ahora el mejor juego!",
    ad_cta: "JUGAR GRATIS",

    god_mode: "👑 Modo Dios",
    god_unlimited_energy: "Energía ilimitada",
    god_go_stage: "Ir a fase específica",
    god_go: "IR",
    god_next: "⏭ Siguiente fase ({id})",
    god_refill: "⚡ Recargar energía",
    god_activated: "👑 ¡Modo Dios ACTIVADO!",
    god_deactivated: "Modo Dios desactivado",
    on_label: "ON",
    off_label: "OFF",

    player_n: "Jugador {n}",
    you: "Tú",
    bot: "Bot",

    rank_master:     "Maestro",
    rank_diamond:    "Diamante",
    rank_plat_3:     "Platino III",
    rank_plat_2:     "Platino II",
    rank_plat_1:     "Platino I",
    rank_gold_3:     "Oro III",
    rank_gold_2:     "Oro II",
    rank_gold_1:     "Oro I",
    rank_silver_3:   "Plata III",
    rank_silver_2:   "Plata II",
    rank_silver_1:   "Plata I",
    rank_bronze_3:   "Bronce III",
    rank_bronze_2:   "Bronce II",
    rank_bronze_1:   "Bronce I",
    rank_beginner:   "Principiante",
  },

  // ────────────────── ENGLISH ──────────────────
  "en": {
    settings: "Settings",
    theme: "Theme",
    theme_dark: "🌙 Dark",
    theme_light: "☀️ Light",
    multiplatform: "Multiplatform",
    profile: "Profile",
    tagline: "Connect • Close • Dominate",
    menu_arcade: "Arcade",
    menu_arcade_sub: "{done}/{total} stages completed",
    menu_bot: "Training Mode",
    menu_bot_sub: "7 difficulty levels",
    menu_multi: "Multiplayer",
    menu_multi_sub: "2 to 4 players • Teams or Solo",
    back: "← Back",
    lang_label: "Language",

    energy_no: "⚡ No energy! Wait for recharge or watch an ad.",
    energy_recharged: "⚡ Energy recharged!",
    energy_unlimited: "∞",

    diff_muito_facil: "Very Easy",
    diff_facil: "Easy",
    diff_medio: "Medium",
    diff_dificil: "Hard",
    diff_muito_dificil: "Very Hard",
    diff_impossivel: "Impossible",
    diff_impulsivo: "Impulsive",

    setup_difficulty: "Difficulty",
    setup_grid: "Grid Size",
    setup_players: "Players",
    setup_mode: "Mode",
    setup_solo: "Solo (all vs all)",
    setup_teams: "Teams (2v2)",
    setup_start: "Start Game",

    game_turn: "{name}'s turn",
    game_bot_thinking: "Bot thinking...",
    stage_label: "Stage {id}",
    vs_bot_label: "vs Bot — {diff}",
    teams_2v2: "Teams 2v2",
    n_players: "{n} Players",
    team_a: "Team A",
    team_b: "Team B",

    stage_complete: "COMPLETE!",
    next_stage: "Next Stage →",
    map: "📍 Map",
    victory: "Victory!",
    won_suffix: "won!",
    tie: "🤝 Tie!",
    new_game: "New Game",
    xp_gained: "+{xp} XP",

    you_lost: "You lost!",
    try_again: "⚡ Try Again",
    watch_ad: "📺 Watch Ad",

    ad_label: "AD",
    ad_close_timer: "Close ({n})",
    ad_close_ready: "✓ Close",
    ad_text: "Download the best game now!",
    ad_cta: "PLAY FREE",

    god_mode: "👑 God Mode",
    god_unlimited_energy: "Unlimited energy",
    god_go_stage: "Go to specific stage",
    god_go: "GO",
    god_next: "⏭ Next stage ({id})",
    god_refill: "⚡ Refill energy",
    god_activated: "👑 God Mode ACTIVATED!",
    god_deactivated: "God Mode deactivated",
    on_label: "ON",
    off_label: "OFF",

    player_n: "Player {n}",
    you: "You",
    bot: "Bot",

    rank_master:     "Master",
    rank_diamond:    "Diamond",
    rank_plat_3:     "Platinum III",
    rank_plat_2:     "Platinum II",
    rank_plat_1:     "Platinum I",
    rank_gold_3:     "Gold III",
    rank_gold_2:     "Gold II",
    rank_gold_1:     "Gold I",
    rank_silver_3:   "Silver III",
    rank_silver_2:   "Silver II",
    rank_silver_1:   "Silver I",
    rank_bronze_3:   "Bronze III",
    rank_bronze_2:   "Bronze II",
    rank_bronze_1:   "Bronze I",
    rank_beginner:   "Beginner",
  },
};

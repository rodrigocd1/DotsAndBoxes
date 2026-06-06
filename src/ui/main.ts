import { GameController, GameConfig } from "./controller";
import { render, canvasSize, findLineAtPoint } from "./renderer";
import { chooseBotMove, botThinkDelay, BotDifficulty, BOT_DIFFICULTIES, getDiffLabel } from "./bot";
import { getStage, INITIAL_STAGES } from "./arcade-stages";
import {
  loadProfile, recordStageResult, rankLabel,
  loadEnergy, spendEnergy, refillEnergy, MAX_ENERGY,
  loadGodMode, saveGodMode, GodModeConfig,
  loadTheme, saveTheme, applyTheme, Theme,
  getAvailableSkips, useSkip, setSkipCount, SKIPS_PER_WEEK,
  loadVibration, saveVibration, vibrate,
  loadMusicVolume, saveMusicVolume,
  loadMute, saveMute,
} from "./storage";
import { t, getCurrentLang, setLang, LANG_NAMES, Lang } from "./i18n";
import { Line, lineKey } from "../models/line";
import "flag-icons/css/flag-icons.min.css";

// ── Tabler Icons — inline SVG (MIT License) ───────────────────────────────
// Fonte: https://tabler.io/icons
// SVGs usados como constantes inline pois o campo "exports" do pacote @tabler/icons
// bloqueia imports ?raw no Vite. Adicionar novos ícones: copiar o SVG do site acima.
const TABLER_ATTRS        = `xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"`;
const TABLER_CLR          = `<path stroke="none" d="M0 0h24v24H0z" fill="none"/>`;
function tablerSvg(size: number, paths: string): string {
  return `<svg ${TABLER_ATTRS} width="${size}" height="${size}" viewBox="0 0 24 24">${TABLER_CLR}${paths}</svg>`;
}
function tablerSvgFilled(size: number, paths: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor">${TABLER_CLR}${paths}</svg>`;
}
const MENU_ICON_SIZE     = 22;
const PLATFORM_ICON_SIZE = 16;
const ICO_BARBELL    = tablerSvg(MENU_ICON_SIZE,     `<path d="M2 12h1"/><path d="M6 8h-2a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2"/><path d="M6 7v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-10a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1"/><path d="M9 12h6"/><path d="M15 7v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-10a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1"/><path d="M18 8h2a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2"/><path d="M22 12h-1"/>`);
const ICO_USERS      = tablerSvg(MENU_ICON_SIZE,     `<path d="M5 7a4 4 0 1 0 8 0a4 4 0 1 0-8 0"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M21 21v-2a4 4 0 0 0-3-3.85"/>`);
const ICO_BOOK       = tablerSvg(MENU_ICON_SIZE,     `<path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0"/><path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0"/><path d="M3 6l0 13"/><path d="M12 6l0 13"/><path d="M21 6l0 13"/>`);
const ICO_ANDROID    = tablerSvg(PLATFORM_ICON_SIZE, `<path d="M4 10l0 6"/><path d="M20 10l0 6"/><path d="M7 9h10v8a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-8a5 5 0 0 1 10 0"/><path d="M8 3l1 2"/><path d="M16 3l-1 2"/><path d="M9 18l0 3"/><path d="M15 18l0 3"/>`);
const ICO_APPLE      = tablerSvg(PLATFORM_ICON_SIZE, `<path d="M8.286 7.008c-3.216 0-4.286 3.23-4.286 5.92c0 3.229 2.143 8.072 4.286 8.072c1.165-.05 1.799-.538 3.214-.538c1.406 0 1.607.538 3.214.538s4.286-3.229 4.286-5.381c-.03-.011-2.649-.434-2.679-3.23c-.02-2.335 2.589-3.179 2.679-3.228c-1.096-1.606-3.162-2.113-3.75-2.153c-1.535-.12-3.032 1.077-3.75 1.077c-.729 0-2.036-1.077-3.214-1.077"/><path d="M12 4a2 2 0 0 0 2-2a2 2 0 0 0-2 2"/>`);
const ICO_DEVICES_PC = tablerSvg(PLATFORM_ICON_SIZE, `<path d="M3 5h6v14h-6l0-14"/><path d="M12 9h10v7h-10l0-7"/><path d="M14 19h6"/><path d="M17 16v3"/><path d="M6 13v.01"/><path d="M6 16v.01"/>`);
const ICO_STAR       = tablerSvg(MENU_ICON_SIZE,     `<path d="M12 17.75l-6.172 3.245l1.179-6.873l-5-4.867l6.9-1l3.086-6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158-3.245"/>`);
// Ícones de tema — reutilizados no toggle do menu e nos botões de configurações
const THEME_ICON_SIZE = 16;
const ICO_MOON_STARS  = tablerSvg(THEME_ICON_SIZE,   `<path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1-8.313-12.454l0 .008"/><path d="M17 4a2 2 0 0 0 2 2a2 2 0 0 0-2 2a2 2 0 0 0-2-2a2 2 0 0 0 2-2"/><path d="M19 11h2m-1-1v2"/>`);
const ICO_SUN         = tablerSvgFilled(THEME_ICON_SIZE, `<path d="M12 19a1 1 0 0 1 .993 .883l.007 .117v1a1 1 0 0 1-1.993 .117l-.007-.117v-1a1 1 0 0 1 1-1z"/><path d="M18.313 16.91l.094 .083l.7 .7a1 1 0 0 1-1.32 1.497l-.094-.083l-.7-.7a1 1 0 0 1 1.218-1.567l.102 .07z"/><path d="M7.007 16.993a1 1 0 0 1 .083 1.32l-.083 .094l-.7 .7a1 1 0 0 1-1.497-1.32l.083-.094l.7-.7a1 1 0 0 1 1.414 0z"/><path d="M4 11a1 1 0 0 1 .117 1.993l-.117 .007h-1a1 1 0 0 1-.117-1.993l.117-.007h1z"/><path d="M21 11a1 1 0 0 1 .117 1.993l-.117 .007h-1a1 1 0 0 1-.117-1.993l.117-.007h1z"/><path d="M6.213 4.81l.094 .083l.7 .7a1 1 0 0 1-1.32 1.497l-.094-.083l-.7-.7a1 1 0 0 1 1.217-1.567l.102 .07z"/><path d="M19.107 4.893a1 1 0 0 1 .083 1.32l-.083 .094l-.7 .7a1 1 0 0 1-1.497-1.32l.083-.094l.7-.7a1 1 0 0 1 1.414 0z"/><path d="M12 2a1 1 0 0 1 .993 .883l.007 .117v1a1 1 0 0 1-1.993 .117l-.007-.117v-1a1 1 0 0 1 1-1z"/><path d="M12 7a5 5 0 1 1-4.995 5.217l-.005-.217l.005-.217a5 5 0 0 1 4.995-4.783z"/>`);
const ICO_SETTINGS    = tablerSvg(THEME_ICON_SIZE,   `<path d="M10.325 4.317a1.95 1.95 0 0 1 3.35 0l.24 .392a1.95 1.95 0 0 0 1.155 .857l.45 .12a1.95 1.95 0 0 1 1.454 2.138l-.067 .462a1.95 1.95 0 0 0 .39 1.535l.295 .355a1.95 1.95 0 0 1 0 2.5l-.295 .355a1.95 1.95 0 0 0-.39 1.535l.067 .462a1.95 1.95 0 0 1-1.454 2.138l-.45 .12a1.95 1.95 0 0 0-1.155 .857l-.24 .392a1.95 1.95 0 0 1-3.35 0l-.24 -.392a1.95 1.95 0 0 0-1.155 -.857l-.45 -.12a1.95 1.95 0 0 1-1.454 -2.138l.067 -.462a1.95 1.95 0 0 0-.39 -1.535l-.295 -.355a1.95 1.95 0 0 1 0 -2.5l.295 -.355a1.95 1.95 0 0 0 .39 -1.535l-.067 -.462a1.95 1.95 0 0 1 1.454 -2.138l.45 -.12a1.95 1.95 0 0 0 1.155 -.857l.24 -.392z"/><circle cx="12" cy="12" r="3"/>`);
const ICO_VIBRATION   = tablerSvg(THEME_ICON_SIZE,   `<path d="M3 5a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2l0 -14"/><path d="M8 4l2 0"/><path d="M9 17l0 .01"/><path d="M21 6l-2 3l2 3l-2 3l2 3"/>`);

// ── Versionamento ─────────────────────────────────────────────────────────
// Regra obrigatória para qualquer IA ou desenvolvedor:
//   A cada funcionalidade nova, incremento ou modificação solicitada: patch += 1
//   Quando patch atingir 100: minor += 1 e patch = 0
//   Formato: v{major}.{minor}.{patch}
//   Exemplos: v0.1.98 → v0.1.99 → v0.2.0 → v0.2.1
//   NUNCA alterar major sem decisão explícita do responsável pelo projeto.
const VERSION = "v0.01.34";

// ── Estado global ─────────────────────────────────────────────────────────
interface GameSession {
  mode: "arcade" | "vs-bot" | "multi";
  stageId?: number;
  botDifficulty?: BotDifficulty;
  playerCount?: number;
  teamMode?: boolean;
  controller: GameController;
  botPlayerId?: string;
  botThinking: boolean;
  freeRetry: boolean;
  maxChain?: number; // max caixas fechadas pelo humano em um único turno (arcade)
}

let session: GameSession | null = null;
let hoverLine: Line | null = null;
let godMode: GodModeConfig = loadGodMode();

const app = document.getElementById("app")!;
const PLAYER_COLORS = ["#e74c3c", "#3498db", "#2ecc71", "#f39c12"];

applyTheme();

// ── Música de fundo ───────────────────────────────────────────────────────
function sectionTitle(icon: string, label: string): string {
  return `
    <span class="section-title">
      <span class="section-title-icon">${icon}</span>
      <span>${label}</span>
    </span>`;
}

const bgMusic = new Audio("./bg_music.mp3");
bgMusic.loop = true;
bgMusic.preload = "none"; // não bloqueia o boot — carrega só quando necessário
bgMusic.volume = 0;       // começa mudo para o fade-in
bgMusic.muted = loadMute();

function fadeInMusic(targetVol: number, durationMs = 5000) {
  const steps = 60;
  const interval = durationMs / steps;
  const step = targetVol / steps;
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, targetVol);
    bgMusic.volume = current;
    if (current >= targetVol) clearInterval(timer);
  }, interval);
}

function startMusic() {
  if (bgMusic.paused) {
    bgMusic.play().then(() => fadeInMusic(loadMusicVolume())).catch(() => {});
  }
}
document.addEventListener("click",      startMusic, { once: true });
document.addEventListener("touchstart", startMusic, { once: true, passive: true });

// ── Helpers ───────────────────────────────────────────────────────────────
function playerNames() { return [1,2,3,4].map((n) => t("player_n", { n })); }

function scaled(canvas: HTMLCanvasElement, cx: number, cy: number) {
  const r = canvas.getBoundingClientRect();
  return { x: (cx - r.left) * (canvas.width / r.width), y: (cy - r.top) * (canvas.height / r.height) };
}

function rankProgressSVG(xp: number): string {
  const tiers = [
    { key: "rank_master",   icon: "👑", min: 150000, next: Infinity },
    { key: "rank_diamond",  icon: "🔷", min: 75000,  next: 150000 },
    { key: "rank_plat_3",   icon: "💎", min: 50000,  next: 75000 },
    { key: "rank_plat_2",   icon: "💎", min: 40000,  next: 50000 },
    { key: "rank_plat_1",   icon: "💎", min: 30000,  next: 40000 },
    { key: "rank_gold_3",   icon: "🥇", min: 20000,  next: 30000 },
    { key: "rank_gold_2",   icon: "🥇", min: 15000,  next: 20000 },
    { key: "rank_gold_1",   icon: "🥇", min: 10000,  next: 15000 },
    { key: "rank_silver_3", icon: "🥈", min: 6000,   next: 10000 },
    { key: "rank_silver_2", icon: "🥈", min: 3500,   next: 6000 },
    { key: "rank_silver_1", icon: "🥈", min: 2500,   next: 3500 },
    { key: "rank_bronze_3", icon: "🥉", min: 1500,   next: 2500 },
    { key: "rank_bronze_2", icon: "🥉", min: 1000,   next: 1500 },
    { key: "rank_bronze_1", icon: "🥉", min: 500,    next: 1000 },
    { key: "rank_beginner", icon: "⚪", min: 0,      next: 500 },
  ];
  const tier = tiers.find((t) => xp >= t.min) ?? tiers[tiers.length - 1]!;
  const progress = tier.next === Infinity ? 1 : Math.min(1, (xp - tier.min) / (tier.next - tier.min));
  const arc = progress * 100;
  return `
    <svg class="rank-ring-svg" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--ring-bg)" stroke-width="2.5"/>
      <circle cx="18" cy="18" r="15.9" fill="none"
        stroke="url(#rg)" stroke-width="2.5"
        stroke-dasharray="${arc} 100" stroke-linecap="round"
        transform="rotate(-90 18 18)"/>
      <defs>
        <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#f39c12"/>
          <stop offset="100%" stop-color="#e74c3c"/>
        </linearGradient>
      </defs>
    </svg>
    <span class="rank-ring-icon">${tier.icon}</span>`;
}

function energyHTML(): string {
  const cur = godMode.unlimitedEnergy ? MAX_ENERGY : loadEnergy();
  const pct = (cur / MAX_ENERGY) * 100;
  const label = godMode.unlimitedEnergy ? "∞" : `${cur}/${MAX_ENERGY}`;
  const dots = Array.from({ length: MAX_ENERGY }, (_, i) =>
    `<span class="e-dot ${i < cur ? "full" : ""}"></span>`
  ).join("");
  return `
    <div class="energy-row">
      <span class="energy-bolt">⚡</span>
      <span class="energy-count">${label}</span>
      <div class="e-dots-wrap">${dots}</div>
      <div class="e-bar-wrap"><div class="e-bar-fill" style="width:${pct}%"></div></div>
    </div>`;
}

// ── Confetti ──────────────────────────────────────────────────────────────
function launchConfetti(dur = 3200) {
  const cv = document.createElement("canvas");
  Object.assign(cv.style, { position:"fixed", top:"0", left:"0", width:"100%", height:"100%", pointerEvents:"none", zIndex:"998" });
  cv.width = window.innerWidth; cv.height = window.innerHeight;
  document.body.appendChild(cv);
  const ctx = cv.getContext("2d")!;
  const COLS = ["#e74c3c","#3498db","#2ecc71","#f39c12","#9b59b6","#1abc9c","#e67e22","#ff6b9d"];
  const parts = Array.from({ length: 160 }, () => ({
    x: Math.random() * cv.width, y: -20 - Math.random() * 120,
    w: 5 + Math.random() * 9, h: 3 + Math.random() * 5,
    color: COLS[Math.floor(Math.random() * COLS.length)]!,
    vx: (Math.random() - 0.5) * 3, vy: 1.5 + Math.random() * 4,
    rot: Math.random() * Math.PI * 2, drot: (Math.random() - 0.5) * 0.15, opacity: 1,
  }));
  const start = Date.now();
  (function f() {
    const p = (Date.now() - start) / dur;
    ctx.clearRect(0, 0, cv.width, cv.height);
    for (const pt of parts) {
      pt.x += pt.vx; pt.y += pt.vy; pt.rot += pt.drot;
      if (p > 0.65) pt.opacity = Math.max(0, 1 - (p - 0.65) / 0.35);
      ctx.save(); ctx.globalAlpha = pt.opacity; ctx.translate(pt.x, pt.y); ctx.rotate(pt.rot);
      ctx.fillStyle = pt.color; ctx.fillRect(-pt.w / 2, -pt.h / 2, pt.w, pt.h); ctx.restore();
    }
    if (p < 1) requestAnimationFrame(f); else cv.remove();
  })();
}

// ── Frases de incentivo ───────────────────────────────────────────────────
const PHRASES_3: readonly string[] = [
  "Parabéns!", "Mandou muito!", "Excelente!", "Perfeito!", "Arrasou!",
  "Show demais!", "Você brilhou!", "Sensacional!", "Incrível!", "Missão completa!",
  "Jogada perfeita!", "Resultado top!", "Você dominou!", "Que vitória!", "Muito bem!",
  "Desempenho incrível!", "Nota máxima!", "Você é fera!", "Trabalho impecável!", "Vitória com estilo!",
];
const PHRASES_2: readonly string[] = [
  "Boa!", "Legal!", "Foi bem!", "Bom trabalho!", "Quase lá!",
  "Continue assim!", "Bom resultado!", "Mandou bem!", "Boa tentativa!", "Está evoluindo!",
  "Nada mal!", "Segue firme!", "Bom avanço!", "Você conseguiu!", "Tá no caminho!",
  "Bem jogado!", "Foi positivo!", "Boa partida!", "Progresso feito!", "Mais uma etapa!",
];
const PHRASES_1: readonly string[] = [
  "Bom trabalho!", "Boa jogada!", "Foi muito bem!", "Continue assim!",
  "Segue firme!", "Boa partida!", "Mandou bem!", "Você conseguiu!",
];
const PHRASES_DEFEAT: readonly string[] = [
  "Não foi dessa vez!", "Quase lá!", "Tente novamente!", "Você consegue!",
  "Foi por pouco!", "Continue tentando!", "A próxima é sua!", "Não desista!",
  "Boa tentativa!", "Hora da revanche!", "Mais uma chance!", "Você está evoluindo!",
  "Faz parte do jogo!", "Dá para virar!", "Vamos de novo!", "Aprendizado feito!",
  "Faltou pouco!", "Na próxima vai!", "Respira e tenta de novo!", "O jogo ainda não acabou!",
];
const PHRASES_DRAW: readonly string[] = [
  "Empate!", "Deu empate!", "Jogo equilibrado!", "Foi parelho!", "Ninguém levou!",
  "Disputa acirrada!", "Boa partida!", "Bem disputado!", "Quase vitória!", "Equilíbrio total!",
  "Jogo justo!", "Batalha equilibrada!", "Ficou no empate!", "Ninguém cedeu!",
  "Partida apertada!", "Resultado equilibrado!", "Deu tudo igual!", "Grande disputa!",
  "Um duelo de respeito!", "Hora da revanche!",
];

function pickPhrase(stars: 0|1|2|3): string {
  const list = stars >= 3 ? PHRASES_3 : stars === 2 ? PHRASES_2 : PHRASES_1;
  return list[Math.floor(Math.random() * list.length)]!;
}
function pickResultPhrase(tied: boolean): string {
  const list = tied ? PHRASES_DRAW : PHRASES_DEFEAT;
  return list[Math.floor(Math.random() * list.length)]!;
}

// ── Celebração ────────────────────────────────────────────────────────────
function showCelebration(stars: 0|1|2|3, xp: number, label: string, nextId: number|null, onNext: ()=>void, onMap: ()=>void, mainTitle?: string) {
  launchConfetti();
  const ov = document.createElement("div");
  ov.className = "cel-overlay";
  const starsHtml = [0,1,2].map((i) =>
    `<span class="cel-star ${i < stars ? "earned" : "empty"}" style="animation-delay:${0.4+i*0.25}s">★</span>`
  ).join("");
  ov.innerHTML = `
    <div class="cel-card">
      ${label ? `<div class="cel-label">${label}</div>` : ""}
      <div class="cel-title">${mainTitle ?? t("stage_complete")}</div>
      <div class="cel-stars">${starsHtml}</div>
      <div class="cel-phrase">${pickPhrase(stars)}</div>
      ${xp > 0 ? `<div class="cel-xp">${t("xp_gained", { xp })}</div>` : ""}
      <div class="cel-actions" id="cel-actions">
        ${nextId ? `<button class="btn-cel-next" id="btn-cel-next">${t("next_stage")}</button>` : ""}
        <button class="btn-cel-map" id="btn-cel-map">${t("map")}</button>
      </div>
    </div>`;
  document.body.appendChild(ov);
  const acts = ov.querySelector<HTMLElement>("#cel-actions")!;
  acts.style.opacity = "0";
  setTimeout(() => { acts.style.opacity = "1"; acts.style.transition = "opacity 0.4s"; }, 2200);
  ov.querySelector("#btn-cel-next")?.addEventListener("click", () => { ov.remove(); onNext(); });
  ov.querySelector("#btn-cel-map")?.addEventListener("click",  () => { ov.remove(); onMap(); });
}

interface SkipInfo { available: number; onSkip: () => void; }

function showFailBanner(onRetry: ()=>void, onMap: ()=>void, tied = false, skipInfo?: SkipInfo) {
  const skipSection = !tied && skipInfo ? `
    <div class="fail-skip-section">
      <span class="fail-skip-label">${t("skip_phase")}</span>
      ${skipInfo.available > 0
        ? `<button class="btn-ad" id="fa">${t("skip_via_ad", { n: skipInfo.available })}</button>`
        : `<span class="no-skips-label">${t("no_skips_left")}</span>`}
    </div>` : "";
  const ov = document.createElement("div");
  ov.className = "fail-overlay";
  ov.innerHTML = `
    <div class="fail-card">
      <div class="fail-emoji">${tied ? "🤝" : "😞"}</div>
      <div class="fail-title">${tied ? t("you_tied") : t("you_lost")}</div>
      <div class="fail-phrase">${pickResultPhrase(tied)}</div>
      <div class="fail-actions">
        <button class="btn-retry-pay" id="fr">${t("try_again")}</button>
        <button class="btn-cel-map" id="fm">${t("map")}</button>
      </div>
      ${skipSection}
    </div>`;
  document.body.appendChild(ov);
  ov.querySelector("#fr")?.addEventListener("click", () => { ov.remove(); onRetry(); });
  ov.querySelector("#fm")?.addEventListener("click", () => { ov.remove(); onMap(); });
  ov.querySelector("#fa")?.addEventListener("click", () => { ov.remove(); skipInfo?.onSkip(); });
}

function showAdModal(onComplete: ()=>void) {
  const ov = document.createElement("div");
  ov.className = "ad-overlay";
  ov.innerHTML = `
    <div class="ad-card">
      <div class="ad-top"><span class="ad-tag">${t("ad_label")}</span><span class="ad-timer" id="at">5</span></div>
      <div class="ad-mock"><div class="ad-logo">🎮</div><div class="ad-text">${t("ad_text")}</div><div class="ad-cta">${t("ad_cta")}</div></div>
      <div class="ad-progress-wrap"><div class="ad-progress" id="ap"></div></div>
      <button class="btn-close-ad" id="ac" disabled>${t("ad_close_timer", { n: 5 })}</button>
    </div>`;
  document.body.appendChild(ov);
  let sec = 5;
  const timerEl = ov.querySelector<HTMLElement>("#at")!;
  const closeBtn = ov.querySelector<HTMLButtonElement>("#ac")!;
  const progEl = ov.querySelector<HTMLElement>("#ap")!;
  progEl.style.transition = `width ${sec}s linear`;
  requestAnimationFrame(() => { progEl.style.width = "100%"; });
  const iv = setInterval(() => {
    sec--;
    timerEl.textContent = String(sec);
    closeBtn.textContent = sec > 0 ? t("ad_close_timer", { n: sec }) : t("ad_close_ready");
    if (sec <= 0) { clearInterval(iv); closeBtn.disabled = false; closeBtn.classList.add("ready"); }
  }, 1000);
  closeBtn.addEventListener("click", () => { ov.remove(); onComplete(); });
}

// ── Settings Modal ────────────────────────────────────────────────────────
function showSettings() {
  const cur = loadTheme();
  const ov = document.createElement("div");
  ov.className = "modal-overlay";
  ov.innerHTML = `
    <div class="modal-card">
      <div class="modal-header">
        ${sectionTitle(ICO_SETTINGS, t("settings"))}
        <button class="modal-close" id="mc">✕</button>
      </div>
      <div class="settings-section">
        <label class="settings-label">${t("theme")}</label>
        <div class="theme-row">
          <button class="btn-theme-opt ${cur==="dark"?"active":""}" data-theme="dark" title="${t("theme_dark")}">${ICO_MOON_STARS}</button>
          <button class="btn-theme-opt ${cur==="light"?"active":""}" data-theme="light" title="${t("theme_light")}">${ICO_SUN}</button>
          <button class="btn-theme-opt ${cur==="pink"?"active":""}" data-theme="pink" title="${t("theme_pink")}">🌸</button>
        </div>
      </div>
      <div class="settings-section">
        <label class="settings-label">${t("lang_label")}</label>
        <div class="lang-selector settings-lang">${langSelectorInner()}</div>
      </div>
      <div class="settings-section">
        <div class="god-row">
          <label class="god-label settings-vibration-label">
            <span class="settings-vibration-icon">${ICO_VIBRATION}</span>
            <span>${t("settings_vibration")}</span>
          </label>
          <label class="toggle-switch" id="sv-wrap">
            <input type="checkbox" id="sv" ${loadVibration()?"checked":""}>
            <span class="toggle-track"></span>
          </label>
        </div>
      </div>
      <div class="settings-section">
        <div class="god-row">
          <label class="god-label">${t("settings_mute")}</label>
          <label class="toggle-switch">
            <input type="checkbox" id="sm" ${loadMute()?"checked":""}>
            <span class="toggle-track"></span>
          </label>
        </div>
      </div>
      <div class="settings-section" id="music-vol-section" style="${loadMute()?"opacity:.4;pointer-events:none":""}">
        <label class="settings-label">${t("settings_music")}</label>
        <div class="music-vol-row">
          <span class="music-vol-icon">🔇</span>
          <input class="music-vol-slider" id="music-vol" type="range" min="0" max="100" value="${Math.round(loadMusicVolume()*100)}" />
          <span class="music-vol-icon">🔊</span>
          <span class="music-vol-pct" id="music-vol-pct">${Math.round(loadMusicVolume()*100)}%</span>
        </div>
      </div>
      <div class="settings-section" id="sound-vol-section" style="opacity:.45;pointer-events:none">
        <label class="settings-label">${t("settings_sound")}</label>
        <div class="music-vol-row">
          <span class="music-vol-icon">🔈</span>
          <input class="music-vol-slider" id="sound-vol" type="range" min="0" max="100" value="50" disabled />
          <span class="music-vol-icon">🔊</span>
          <span class="music-vol-pct" id="sound-vol-pct">—</span>
        </div>
      </div>
      <div class="settings-version">${VERSION}</div>
    </div>`;
  document.body.appendChild(ov);
  ov.querySelector("#mc")?.addEventListener("click", () => ov.remove());
  ov.addEventListener("click", (e) => { if (e.target === ov) ov.remove(); });
  ov.querySelectorAll(".btn-theme-opt").forEach((b) => {
    (b as HTMLElement).onclick = () => {
      saveTheme((b as HTMLElement).dataset["theme"] as Theme);
      ov.querySelectorAll(".btn-theme-opt").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
    };
  });
  ov.querySelectorAll(".btn-lang").forEach((b) => {
    (b as HTMLElement).onclick = () => {
      setLang((b as HTMLElement).dataset["lang"] as Lang);
      ov.remove(); showMenu();
    };
  });
  ov.querySelector<HTMLInputElement>("#sv")?.addEventListener("change", (e) => {
    const on = (e.target as HTMLInputElement).checked;
    saveVibration(on);
    if (on) vibrate(30);
  });
  ov.querySelector<HTMLInputElement>("#sm")?.addEventListener("change", (e) => {
    const muted = (e.target as HTMLInputElement).checked;
    saveMute(muted);
    bgMusic.muted = muted;
    const sec = ov.querySelector<HTMLElement>("#music-vol-section");
    if (sec) { sec.style.opacity = muted ? ".4" : ""; sec.style.pointerEvents = muted ? "none" : ""; }
  });
  ov.querySelector<HTMLInputElement>("#music-vol")?.addEventListener("input", (e) => {
    const vol = parseInt((e.target as HTMLInputElement).value, 10) / 100;
    saveMusicVolume(vol);
    bgMusic.volume = vol;
    const pct = ov.querySelector<HTMLElement>("#music-vol-pct");
    if (pct) pct.textContent = `${Math.round(vol * 100)}%`;
    if (bgMusic.paused && vol > 0) bgMusic.play().catch(() => {});
  });
}

// ── God Mode Modal ────────────────────────────────────────────────────────
function showGodModeModal(currentStageId?: number) {
  const ov = document.createElement("div");
  ov.className = "modal-overlay";
  ov.innerHTML = `
    <div class="modal-card god-card">
      <div class="modal-header">${sectionTitle(ICO_SETTINGS, t("god_mode"))}<button class="modal-close" id="gc">✕</button></div>
      <div class="settings-section">
        <div class="god-row">
          <label class="god-label">${t("god_unlimited_energy")}</label>
          <button class="god-toggle ${godMode.unlimitedEnergy?"on":""}" id="ge">${godMode.unlimitedEnergy ? t("on_label") : t("off_label")}</button>
        </div>
      </div>
      <div class="settings-section">
        <div class="god-row">
          <label class="god-label">${t("god_skips")} <span id="skip-count-label">${getAvailableSkips()}/${SKIPS_PER_WEEK}</span></label>
          <button class="god-go" id="gsr">${t("god_refill")}</button>
        </div>
      </div>
      <div class="settings-section">
        <label class="settings-label">${t("god_go_stage")}</label>
        <div class="god-input-row">
          <input class="god-input" id="gs" type="number" min="1" max="500" placeholder="1-500" value="${currentStageId??1}" />
          <button class="god-go" id="gg">${t("god_go")}</button>
        </div>
      </div>
      ${currentStageId?`<button class="god-skip" id="gsk">${t("god_next",{id:currentStageId+1})}</button>`:""}
      <button class="god-refill" id="gr">${t("god_refill")}</button>
    </div>`;
  document.body.appendChild(ov);
  ov.querySelector("#gc")?.addEventListener("click", () => ov.remove());
  ov.addEventListener("click", (e) => { if (e.target === ov) ov.remove(); });
  const tb = ov.querySelector<HTMLButtonElement>("#ge")!;
  tb.addEventListener("click", () => {
    godMode.unlimitedEnergy = !godMode.unlimitedEnergy; saveGodMode(godMode);
    tb.textContent = godMode.unlimitedEnergy ? t("on_label") : t("off_label");
    tb.classList.toggle("on", godMode.unlimitedEnergy); refreshEnergyDisplay();
  });
  ov.querySelector("#gr")?.addEventListener("click", () => { refillEnergy(); refreshEnergyDisplay(); showToast(t("energy_recharged")); });
  ov.querySelector("#gsr")?.addEventListener("click", () => { setSkipCount(SKIPS_PER_WEEK); ov.querySelector<HTMLElement>("#skip-count-label")!.textContent = `${SKIPS_PER_WEEK}/${SKIPS_PER_WEEK}`; showToast(`${SKIPS_PER_WEEK} pulos restaurados`); });
  ov.querySelector("#gg")?.addEventListener("click", () => {
    const v = parseInt((ov.querySelector<HTMLInputElement>("#gs")!).value, 10);
    if (v >= 1 && v <= 500) { ov.remove(); session = null; hoverLine = null; startArcadeStage(v, true); }
  });
  ov.querySelector("#gsk")?.addEventListener("click", () => {
    if (!currentStageId) return;
    ov.remove(); session = null; hoverLine = null; startArcadeStage(currentStageId + 1, true);
  });
}

// ── Toast ─────────────────────────────────────────────────────────────────
function showToast(msg: string) {
  document.querySelectorAll(".toast").forEach((el) => el.remove());
  const el = document.createElement("div");
  el.className = "toast"; el.textContent = msg; document.body.appendChild(el);
  requestAnimationFrame(() => { el.classList.add("show"); });
  setTimeout(() => { el.classList.remove("show"); setTimeout(() => el.remove(), 400); }, 2200);
}

// ── Energia ───────────────────────────────────────────────────────────────
let energyTimer: ReturnType<typeof setInterval> | null = null;
function refreshEnergyDisplay() { document.querySelectorAll("#energy-display").forEach((el) => { el.innerHTML = energyHTML(); }); }
function startEnergyTimer() { if (energyTimer) clearInterval(energyTimer); energyTimer = setInterval(refreshEnergyDisplay, 15_000); }
function stopEnergyTimer() { if (energyTimer) { clearInterval(energyTimer); energyTimer = null; } }

// ── Idioma ────────────────────────────────────────────────────────────────
const LANG_ARIA: Record<Lang, string> = {
  "pt-BR": "Português Brasil",
  "pt-PT": "Português Portugal",
  "es":    "Espanhol",
  "en":    "Inglês",
};
const LANG_FLAG: Record<Lang, string> = {
  "pt-BR": "br",
  "pt-PT": "pt",
  "es":    "es",
  "en":    "gb",
};
function langSelectorInner(): string {
  const cur = getCurrentLang();
  return (Object.keys(LANG_ARIA) as Lang[]).map((code) =>
    `<button class="btn-lang ${code===cur?"active":""}" data-lang="${code}" title="${LANG_ARIA[code]}" aria-label="${LANG_ARIA[code]}"><span class="fi fi-${LANG_FLAG[code]} fi-flag-icon"></span></button>`
  ).join("");
}
function langSelectorHTML(): string {
  return `<div class="lang-selector">${langSelectorInner()}</div>`;
}
function bindLangSelector(root: Element | Document = document) {
  root.querySelectorAll(".btn-lang").forEach((b) => {
    (b as HTMLElement).onclick = () => { setLang((b as HTMLElement).dataset["lang"] as Lang); showMenu(); };
  });
}

// ── MENU ──────────────────────────────────────────────────────────────────
let titleClicks = 0; let titleTimer: ReturnType<typeof setTimeout> | null = null;

function showMenu() {
  stopEnergyTimer(); session = null; hoverLine = null;
  const profile = loadProfile();
  const rank = rankLabel(profile.xp);
  const done = Object.values(profile.stageProgress).filter((s) => s.stars > 0).length;
  const isNew = done === 0;

  app.innerHTML = `
    <div class="screen menu-screen">

      <div class="topbar">
        <div></div>
        <div class="topbar-right">
          <button class="btn-settings-pill" id="btn-settings" title="${t("settings")}" aria-label="${t("settings")}">${ICO_SETTINGS}<span>${t("settings")}</span></button>
          <button class="btn-profile-icon" id="btn-profile" title="${t("profile")}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          </button>
        </div>
      </div>

      <div class="menu-logo" id="menu-title">
        <h1>Dots &amp; Boxes</h1>
        <p class="menu-tagline">${t("tagline")}</p>
      </div>

      <div class="rank-card">
        <div class="rank-ring-wrap">
          ${rankProgressSVG(profile.xp)}
        </div>
        <div class="rank-info">
          <span class="rank-name">${rank.rank}</span>
          <span class="rank-xp">${profile.xp.toLocaleString()} XP</span>
        </div>
        ${godMode.unlimitedEnergy ? `<button class="btn-god-ring" id="btn-god-menu">👑</button>` : ""}
      </div>

      <div id="energy-display">${energyHTML()}</div>

      <div class="menu-buttons">
        <button class="btn-menu btn-arcade" id="btn-arcade">
          <div class="btn-menu-icon-wrap btn-icon--arcade">${ICO_STAR}</div>
          <div class="btn-menu-text">
            <strong>${t("menu_arcade")}</strong>
            <small>${t("menu_arcade_sub", { done, total: INITIAL_STAGES })}</small>
          </div>
          ${isNew ? `<span class="badge-new">NEW</span>` : ""}
        </button>
        <button class="btn-menu btn-bot" id="btn-bot">
          <div class="btn-menu-icon-wrap btn-icon--bot">${ICO_BARBELL}</div>
          <div class="btn-menu-text">
            <strong>${t("menu_bot")}</strong>
            <small>${t("menu_bot_sub")}</small>
          </div>
        </button>
        <button class="btn-menu btn-multi" id="btn-multi">
          <div class="btn-menu-icon-wrap btn-icon--multi">${ICO_USERS}</div>
          <div class="btn-menu-text">
            <strong>${t("menu_multi")}</strong>
            <small>${t("menu_multi_sub")}</small>
          </div>
        </button>
      </div>

      ${langSelectorHTML()}

      <button class="btn-menu btn-tutorial" id="btn-tutorial">
        <div class="btn-menu-icon-wrap btn-icon--tutorial">${ICO_BOOK}</div>
        <div class="btn-menu-text">
          <strong>${t("menu_tutorial")}</strong>
          <small>${t("menu_tutorial_sub")}</small>
        </div>
      </button>

      <div class="theme-toggle-wrap">
        <button class="theme-toggle-opt ${loadTheme()==="dark"?"active":""}" data-t="dark" title="${t("theme_dark").replace(/^.\s/,"")}">${ICO_MOON_STARS}</button>
        <button class="theme-toggle-opt ${loadTheme()==="light"?"active":""}" data-t="light" title="${t("theme_light").replace(/^.\s/,"")}">${ICO_SUN}</button>
        <button class="theme-toggle-opt ${loadTheme()==="pink"?"active":""}" data-t="pink" title="${t("theme_pink").replace(/^.\s/,"")}">🌸</button>
      </div>

      <div class="bottom-bar">
        <div class="platform-pills">
          <span class="platform-pill">${ICO_DEVICES_PC} PC</span>
          <span class="platform-pill">${ICO_ANDROID} Android</span>
          <span class="platform-pill">${ICO_APPLE} IOS</span>
        </div>
        <div class="bottom-star">✦</div>
        <div class="version-tag">${VERSION}</div>
      </div>

    </div>`;

  startEnergyTimer();
  document.getElementById("btn-arcade")!.onclick   = showArcadeMap;
  document.getElementById("btn-bot")!.onclick      = showBotSetup;
  document.getElementById("btn-multi")!.onclick    = showMultiSetup;
  document.getElementById("btn-tutorial")!.onclick = showTutorial;
  document.querySelectorAll(".theme-toggle-opt").forEach((b) => {
    (b as HTMLElement).onclick = () => { saveTheme((b as HTMLElement).dataset["t"] as Theme); showMenu(); };
  });
  document.getElementById("btn-settings")!.onclick = showSettings;
  document.getElementById("btn-profile")?.addEventListener("click", () => showToast("👤 " + t("profile") + " — em breve!"));
  document.getElementById("btn-god-menu")?.addEventListener("click", () => showGodModeModal());
  bindLangSelector();

  document.getElementById("menu-title")!.addEventListener("click", () => {
    titleClicks++; if (titleTimer) clearTimeout(titleTimer);
    titleTimer = setTimeout(() => { titleClicks = 0; }, 3000);
    if (titleClicks >= 7) {
      titleClicks = 0; godMode.unlimitedEnergy = !godMode.unlimitedEnergy; saveGodMode(godMode);
      showToast(godMode.unlimitedEnergy ? t("god_activated") : t("god_deactivated")); showMenu();
    }
  });
}

// ── MAPA ARCADE ───────────────────────────────────────────────────────────
function showArcadeMap() {
  stopEnergyTimer();
  const profile = loadProfile();
  let cells = "";
  for (let i = 1; i <= INITIAL_STAGES; i++) {
    const prog = profile.stageProgress[i]; const stars = prog?.stars ?? 0;
    const unlocked = i === 1 || (profile.stageProgress[i - 1]?.stars ?? 0) > 0;
    const starStr = "★".repeat(stars) + "☆".repeat(3 - stars);
    cells += `<button class="stage-cell ${unlocked?"unlocked":"locked"} stars-${stars}" data-stage="${i}" ${unlocked?"":"disabled"}>
      <span class="stage-num">${i}</span><span class="stage-stars">${starStr}</span></button>`;
  }
  app.innerHTML = `
    <div class="screen arcade-screen">
      <div class="screen-header">
        <button class="btn-back" id="btn-back">${t("back")}</button>
        <h2>${sectionTitle(ICO_STAR, t("menu_arcade"))}</h2>
        <div id="energy-display" style="font-size:.75rem">${energyHTML()}</div>
      </div>
      <div class="stage-grid">${cells}</div>
    </div>`;
  startEnergyTimer();
  document.getElementById("btn-back")!.onclick = showMenu;
  document.querySelectorAll(".stage-cell.unlocked").forEach((el) => {
    (el as HTMLElement).onclick = () => startArcadeStage(parseInt((el as HTMLElement).dataset["stage"]!, 10));
  });
}

// ── SETUP VS BOT ──────────────────────────────────────────────────────────
const DIFF_META: Record<BotDifficulty, { icon: string; tier: "easy" | "hard" | "wild" }> = {
  "muito-facil":   { icon: "☆", tier: "easy" },
  "facil":         { icon: "☆", tier: "easy" },
  "medio":         { icon: "😊", tier: "easy" },
  "dificil":       { icon: "😠", tier: "hard" },
  "muito-dificil": { icon: "😠", tier: "hard" },
  "impossivel":    { icon: "💀", tier: "hard" },
  "impulsivo":     { icon: "🎲", tier: "wild" },
};

function dotGridHTML(n: number): string {
  const dots = Array.from({ length: n * n }, () => `<span class="dot-preview"></span>`).join("");
  return `<div class="dot-grid-preview" style="grid-template-columns:repeat(${n},1fr)">${dots}</div>`;
}

function showBotSetup() {
  stopEnergyTimer();
  app.innerHTML = `
    <div class="screen setup-screen">
      <div class="screen-header">
        <button class="btn-back" id="btn-back">${t("back")}</button>
        <h2>${sectionTitle(ICO_BARBELL, t("menu_bot"))}</h2>
        <span class="header-end-spacer"></span>
      </div>
      <div class="setup-section">
        <label class="setup-label">${t("setup_difficulty")}</label>
        <div class="diff-grid">${BOT_DIFFICULTIES.map((k) => {
          const m = DIFF_META[k];
          return `<button class="btn-diff btn-diff--${m.tier}" data-diff="${k}"><span class="diff-icon">${m.icon}</span>${getDiffLabel(k)}</button>`;
        }).join("")}</div>
      </div>
      <div class="setup-section">
        <label class="setup-label">${t("setup_grid")}</label>
        <div class="grid-size-row">${[3,4,5,6].map(n =>
          `<button class="btn-grid-size" data-size="${n}"><span class="grid-size-label">${n}×${n}</span>${dotGridHTML(n)}</button>`
        ).join("")}</div>
      </div>
      <button class="btn-start" id="btn-start" disabled>${t("setup_start")}</button>
    </div>`;
  document.getElementById("btn-back")!.onclick = showMenu;
  let diff: BotDifficulty | null = null; let sz = 4;
  (document.querySelector(`[data-size="4"]`) as HTMLElement).classList.add("selected");
  document.querySelectorAll(".btn-diff").forEach((b) => {
    (b as HTMLElement).onclick = () => {
      document.querySelectorAll(".btn-diff").forEach((x) => x.classList.remove("selected"));
      b.classList.add("selected"); diff = (b as HTMLElement).dataset["diff"] as BotDifficulty;
      (document.getElementById("btn-start") as HTMLButtonElement).disabled = false;
    };
  });
  document.querySelectorAll(".btn-grid-size").forEach((b) => {
    (b as HTMLElement).onclick = () => {
      document.querySelectorAll(".btn-grid-size").forEach((x) => x.classList.remove("selected"));
      b.classList.add("selected"); sz = parseInt((b as HTMLElement).dataset["size"]!, 10);
    };
  });
  document.getElementById("btn-start")!.onclick = () => { if (diff) startBotGame(diff, sz); };
}

// ── SETUP MULTI ───────────────────────────────────────────────────────────
function showMultiSetup() {
  stopEnergyTimer();
  app.innerHTML = `
    <div class="screen setup-screen">
      <div class="screen-header">
        <button class="btn-back" id="btn-back">${t("back")}</button>
        <h2>${sectionTitle(ICO_USERS, t("menu_multi"))}</h2>
      </div>
      <div class="setup-section">
        <label class="setup-label">${t("setup_players")}</label>
        <div class="multi-grid multi-grid--players">${[2,3,4].map(n=>`<button class="btn-player-count" data-count="${n}"><span class="diff-icon">${ICO_USERS}</span>${t("n_players", { n })}</button>`).join("")}</div>
      </div>
      <div class="setup-section" id="team-section" style="display:none">
        <label class="setup-label">${t("setup_mode")}</label>
        <div class="multi-grid multi-grid--teams">
          <button class="btn-team-mode selected" data-team="false">${t("setup_solo")}</button>
          <button class="btn-team-mode" data-team="true">${t("setup_teams")}</button>
        </div>
      </div>
      <div class="setup-section">
        <label class="setup-label">${t("setup_grid")}</label>
        <div class="multi-grid multi-grid--sizes">${[3,4,5,6].map(n=>`<button class="btn-grid-size" data-size="${n}"><span class="grid-size-label">${n}×${n}</span>${dotGridHTML(n)}</button>`).join("")}</div>
      </div>
      <button class="btn-start" id="btn-start" disabled>${t("setup_start")}</button>
    </div>`;
  document.getElementById("btn-back")!.onclick = showMenu;
  let count = 0, team = false, sz = 4;
  (document.querySelector(`[data-size="4"]`) as HTMLElement).classList.add("selected");
  document.querySelectorAll(".btn-player-count").forEach((b) => {
    (b as HTMLElement).onclick = () => {
      document.querySelectorAll(".btn-player-count").forEach((x) => x.classList.remove("selected"));
      b.classList.add("selected"); count = parseInt((b as HTMLElement).dataset["count"]!, 10);
      (document.getElementById("team-section") as HTMLElement).style.display = count === 4 ? "block" : "none";
      (document.getElementById("btn-start") as HTMLButtonElement).disabled = false;
    };
  });
  document.querySelectorAll(".btn-team-mode").forEach((b) => {
    (b as HTMLElement).onclick = () => {
      document.querySelectorAll(".btn-team-mode").forEach((x) => x.classList.remove("selected"));
      b.classList.add("selected"); team = (b as HTMLElement).dataset["team"] === "true";
    };
  });
  document.querySelectorAll(".btn-grid-size").forEach((b) => {
    (b as HTMLElement).onclick = () => {
      document.querySelectorAll(".btn-grid-size").forEach((x) => x.classList.remove("selected"));
      b.classList.add("selected"); sz = parseInt((b as HTMLElement).dataset["size"]!, 10);
    };
  });
  document.getElementById("btn-start")!.onclick = () => { if (count) startMultiGame(count, team, sz); };
}

// ── TUTORIAL ──────────────────────────────────────────────────────────────
function showTutorial() {
  stopEnergyTimer();
  const steps = [
    { icon: "•••", title: t("tut_step1_title"), desc: t("tut_step1_desc") },
    { icon: "⬜",  title: t("tut_step2_title"), desc: t("tut_step2_desc") },
    { icon: "★",  title: t("tut_step3_title"), desc: t("tut_step3_desc") },
    { icon: "🔄",  title: t("tut_step4_title"), desc: t("tut_step4_desc") },
  ];
  app.innerHTML = `
    <div class="screen setup-screen">
      <div class="screen-header">
        <button class="btn-back" id="btn-back">${t("back")}</button>
        <h2>${sectionTitle(ICO_BOOK, t("menu_tutorial"))}</h2>
        <span class="header-end-spacer"></span>
      </div>
      <div class="tut-steps">
        ${steps.map((s, i) => `
          <div class="tut-step">
            <div class="tut-step-num">${i + 1}</div>
            <div class="tut-step-body">
              <strong>${s.title}</strong>
              <span>${s.desc}</span>
            </div>
          </div>`).join("")}
      </div>
      <div class="tut-board-hint">
        <div class="tut-grid">${Array.from({length:9},(_,i)=>`<div class="tut-dot ${i===4?"tut-dot--hl":""}"></div>`).join("")}</div>
        <p class="tut-hint-text">${t("tut_hint")}</p>
      </div>
    </div>`;
  document.getElementById("btn-back")!.onclick = showMenu;
}

// ── STARTERS ──────────────────────────────────────────────────────────────
function startArcadeStage(stageId: number, godSkip = false) {
  if (!godSkip && !godMode.unlimitedEnergy && !spendEnergy()) { showToast(t("energy_no")); return; }
  const stage = getStage(stageId);
  session = {
    mode: "arcade", stageId, botDifficulty: stage.difficulty,
    controller: new GameController({ gridSize: stage.gridSize, players: [{ name: t("you"), color: PLAYER_COLORS[0]! }, { name: t("bot"), color: PLAYER_COLORS[1]! }] }),
    botPlayerId: "p2", botThinking: false, freeRetry: false, maxChain: 0,
  };
  showGame();
}
function startBotGame(difficulty: BotDifficulty, gridSize: number) {
  session = {
    mode: "vs-bot", botDifficulty: difficulty,
    controller: new GameController({ gridSize, players: [{ name: t("you"), color: PLAYER_COLORS[0]! }, { name: t("bot"), color: PLAYER_COLORS[1]! }] }),
    botPlayerId: "p2", botThinking: false, freeRetry: false,
  };
  showGame();
}
function startMultiGame(playerCount: number, teamMode: boolean, gridSize: number) {
  const names = playerNames();
  const players = Array.from({ length: playerCount }, (_, i) => ({ name: names[i]!, color: PLAYER_COLORS[i]! })) as GameConfig["players"];
  session = { mode: "multi", teamMode, playerCount, controller: new GameController({ gridSize, players }), botThinking: false, freeRetry: false };
  showGame();
}

// ── JOGO ──────────────────────────────────────────────────────────────────
function showGame() {
  if (!session) return;
  const s = session; stopEnergyTimer();
  const modeTitle = s.mode === "arcade"
    ? sectionTitle(ICO_STAR, t("stage_label", { id: s.stageId! }))
    : s.mode === "vs-bot"
    ? sectionTitle(ICO_BARBELL, `${t("menu_bot")} · ${getDiffLabel(s.botDifficulty!)}`)
    : sectionTitle(ICO_USERS, s.teamMode ? t("teams_2v2") : t("n_players", { n: s.playerCount! }));

  app.innerHTML = `
    <div class="screen game-screen">
      <div class="game-hud">
        <div class="screen-header">
          <button class="btn-back" id="btn-back">${t("back")}</button>
          <h2>${modeTitle}</h2>
          ${godMode.unlimitedEnergy ? `<button class="btn-god-corner" id="btn-god-game">👑</button>` : `<span class="header-end-spacer"></span>`}
        </div>
        <div id="scoreboard" class="scoreboard"></div>
        <div id="status" class="status"></div>
      </div>
      <div class="canvas-wrapper"><canvas id="board"></canvas></div>
    </div>`;

  document.getElementById("btn-back")!.onclick = () => {
    session = null; hoverLine = null;
    if (s.mode === "arcade") showArcadeMap(); else if (s.mode === "vs-bot") showBotSetup(); else showMultiSetup();
  };
  document.getElementById("btn-god-game")?.addEventListener("click", () => showGodModeModal(s.stageId));

  const canvas = document.getElementById("board") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;

  function draw() {
    const st = s.controller.getState();
    const { width, height } = canvasSize(st.gridSize);
    canvas.width = width; canvas.height = height;
    render(ctx, st, hoverLine, s.teamMode ?? false); updateHUD();
  }

  function updateHUD() {
    const st = s.controller.getState();
    const scb = document.getElementById("scoreboard"); const statusEl = document.getElementById("status");
    if (!scb || !statusEl) return;
    if (s.teamMode && s.playerCount === 4) {
      const sA = st.players.filter((_,i)=>i%2===0).reduce((a,p)=>a+p.score,0);
      const sB = st.players.filter((_,i)=>i%2===1).reduce((a,p)=>a+p.score,0);
      scb.innerHTML = `<div class="team-chip" style="--pc:${PLAYER_COLORS[0]}">${t("team_a")} <strong>${sA}</strong></div><div class="team-chip" style="--pc:${PLAYER_COLORS[1]}">${t("team_b")} <strong>${sB}</strong></div>`;
    } else {
      scb.innerHTML = st.players.map((p) => {
        const active = p.id === st.currentPlayerId && st.status === "playing";
        return `<div class="player-chip ${active?"player-chip--active":""}" style="--pc:${p.color}"><span class="player-dot"></span><span class="player-name">${p.name}</span><span class="player-score">${p.score}</span></div>`;
      }).join("");
    }
    if (st.status === "finished") { statusEl.textContent = ""; onGameFinished(); }
    else if (s.botThinking) { statusEl.textContent = t("game_bot_thinking"); statusEl.style.color = "var(--text-2)"; }
    else { const cur = st.players.find((p)=>p.id===st.currentPlayerId)!; statusEl.textContent = t("game_turn",{name:cur.name}); statusEl.style.color = cur.color; }
  }

  function onGameFinished() {
    const st = s.controller.getState();
    const maxScore = Math.max(...st.players.map((p)=>p.score));
    if (s.mode === "arcade" && s.stageId != null) {
      const stage = getStage(s.stageId);
      const you = st.players.find((p)=>p.id!==s.botPlayerId)!;
      const bot = st.players.find((p)=>p.id===s.botPlayerId)!;
      const won  = you.score > bot.score;
      const tied = you.score === bot.score;
      if (won) {
        const totalBoxes = (stage.gridSize - 1) ** 2;
        let stars: 0|1|2|3 = 1; let xp = 100;
        if (stage.objectiveType === "win") {
          if (you.score >= Math.ceil(totalBoxes * 0.65))      { stars = 3; xp += 100; }
          else if (you.score >= Math.ceil(totalBoxes * 0.5))  { stars = 2; xp += 50; }
        } else if (stage.objectiveType === "margin") {
          if ((you.score - bot.score) >= stage.objectiveValue + 2)  { stars = 3; xp += 100; }
          else if ((you.score - bot.score) >= stage.objectiveValue)  { stars = 2; xp += 50; }
        } else if (stage.objectiveType === "dominance") {
          if (you.score / totalBoxes >= 0.75)                              { stars = 3; xp += 100; }
          else if (you.score / totalBoxes >= stage.objectiveValue / 100)   { stars = 2; xp += 50; }
        } else if (stage.objectiveType === "clean") {
          if (bot.score === 0 && (you.score - bot.score) >= 3) { stars = 3; xp += 100; }
          else if (bot.score === 0)                             { stars = 2; xp += 50; }
        } else if (stage.objectiveType === "chain") {
          const chain = s.maxChain ?? 0;
          if (chain >= 3)      { stars = 3; xp += 100; }
          else if (chain >= 2) { stars = 2; xp += 50; }
        }
        recordStageResult(s.stageId, stars, you.score*100, xp);
        const nextId = s.stageId < INITIAL_STAGES ? s.stageId+1 : null;
        showCelebration(stars, xp, t("stage_label",{id:s.stageId}), nextId,
          () => { if (nextId) startArcadeStage(nextId); else showArcadeMap(); },
          () => { session=null; hoverLine=null; showArcadeMap(); });
      } else {
        const retryFn = () => { if (!godMode.unlimitedEnergy && !spendEnergy()) { showToast(t("energy_no")); return; } session=null; hoverLine=null; startArcadeStage(s.stageId!,true); };
        const mapFn  = () => { session=null; hoverLine=null; showArcadeMap(); };
        const nextId = s.stageId! < INITIAL_STAGES ? s.stageId! + 1 : null;
        const skipInfo: SkipInfo | undefined = (!tied && nextId != null) ? {
          available: getAvailableSkips(),
          onSkip: () => showAdModal(() => { if (useSkip()) { session=null; hoverLine=null; startArcadeStage(nextId, true); } else showToast(t("no_skips_left")); }),
        } : undefined;
        showFailBanner(retryFn, mapFn, tied, skipInfo);
      }
    } else if (s.mode === "vs-bot") {
      const you  = st.players.find((p)=>p.id!==s.botPlayerId)!;
      const bot2 = st.players.find((p)=>p.id===s.botPlayerId)!;
      const isTie = you.score === bot2.score;
      if (isTie) showFailBanner(()=>startBotGame(s.botDifficulty!,st.gridSize),showMenu, true);
      else if (you.score === maxScore) showCelebration(1,60,t("victory"),null,()=>startBotGame(s.botDifficulty!,st.gridSize),showMenu);
      else showFailBanner(()=>startBotGame(s.botDifficulty!,st.gridSize),showMenu);
    } else {
      const winners = st.players.filter((p)=>p.score===maxScore);
      const winTitle = winners.length===1 ? `${winners[0]!.name} ${t("won_suffix")}` : t("tie");
      showCelebration(3,80,"",null,()=>startMultiGame(s.playerCount!,s.teamMode!,st.gridSize),showMenu, winTitle);
    }
  }

  function isBotTurn() { return !!s.botPlayerId && s.controller.getState().currentPlayerId===s.botPlayerId; }

  function scheduleBotMove() {
    if (!s.botDifficulty) return; s.botThinking=true; updateHUD();
    setTimeout(() => {
      if (!session||session!==s) return; const st=s.controller.getState();
      if (st.status==="finished"||!isBotTurn()) return;
      s.controller.playLine(chooseBotMove(st,s.botDifficulty!)); s.botThinking=false; draw();
      if (isBotTurn()&&s.controller.getState().status!=="finished") scheduleBotMove();
    }, botThinkDelay(s.botDifficulty));
  }

  function handleMove(line: Line) {
    const st = s.controller.getState();
    if (st.status==="finished"||s.botThinking||isBotTurn()||line.ownerId!==null) return;
    const scoreBefore = s.botPlayerId != null ? (st.players.find((p)=>p.id!==s.botPlayerId)?.score ?? 0) : 0;
    s.controller.playLine(line); hoverLine=null; draw();
    const scoreAfterMove = s.botPlayerId != null ? (s.controller.getState().players.find((p)=>p.id!==s.botPlayerId)?.score ?? 0) : 0;
    if (scoreAfterMove > scoreBefore) {
      vibrate([40, 20, 40]); // ponto marcado — vibração dupla mais forte
    } else {
      vibrate(18); // jogada sem ponto — vibração leve
    }
    if (s.mode === "arcade" && s.botPlayerId != null) {
      const closed = scoreAfterMove - scoreBefore;
      if (closed > (s.maxChain ?? 0)) s.maxChain = closed;
    }
    if (isBotTurn()&&s.controller.getState().status!=="finished") scheduleBotMove();
  }

  canvas.addEventListener("mousemove",(e) => {
    const st=s.controller.getState(); if(st.status==="finished"||s.botThinking||isBotTurn()) return;
    const {x,y}=scaled(canvas,e.clientX,e.clientY); const found=findLineAtPoint(st,x,y);
    const cand=found?.ownerId===null?found:null;
    if((hoverLine?lineKey(hoverLine):null)!==(cand?lineKey(cand):null)){hoverLine=cand;draw();}
    canvas.style.cursor=hoverLine?"pointer":"default";
  });
  canvas.addEventListener("mouseleave",()=>{hoverLine=null;draw();canvas.style.cursor="default";});
  canvas.addEventListener("click",(e)=>{ const{x,y}=scaled(canvas,e.clientX,e.clientY); const f=findLineAtPoint(s.controller.getState(),x,y); if(f) handleMove(f); });
  canvas.addEventListener("touchend",(e)=>{ e.preventDefault(); const touch=e.changedTouches[0]; if(!touch) return; const{x,y}=scaled(canvas,touch.clientX,touch.clientY); const f=findLineAtPoint(s.controller.getState(),x,y); if(f) handleMove(f); },{passive:false});
  draw();
  if (isBotTurn()) scheduleBotMove();
}

// ── CSS ───────────────────────────────────────────────────────────────────
const style = document.createElement("style");
style.textContent = `
/* ── Variáveis de tema ─────────────────────────────────────────── */
:root, html[data-theme="dark"] {
  --bg:            #0d1117;
  --bg-2:          #161c27;
  --bg-3:          #1c2535;
  --border:        rgba(255,255,255,0.08);
  --border-strong: rgba(255,255,255,0.14);
  --text:          #e6edf3;
  --text-2:        #8d96a0;
  --text-3:        #555f6d;
  --shadow:        0 4px 24px rgba(0,0,0,0.5);
  --ring-bg:       rgba(255,255,255,0.1);
  --btn-bg:        rgba(255,255,255,0.04);
  --ui-accent:     #06b6d4;
  --ui-accent-soft:rgba(6,182,212,0.14);
  --ui-accent-border:rgba(6,182,212,0.42);
  --ui-accent-glow:0 0 16px rgba(6,182,212,0.18);
  --toggle-on:     #22c55e;
  --arcade-border: linear-gradient(135deg,#ec4899,#8b5cf6,#06b6d4);
  --arcade-glow:   0 0 24px rgba(139,92,246,0.25), 0 0 48px rgba(236,72,153,0.1);
  --title-gradient:linear-gradient(135deg,#f97316 0%,#a855f7 50%,#06b6d4 100%);
  --title-shadow: 0 2px 12px rgba(0,0,0,0.35);
}
html[data-theme="light"] {
  --bg:            #f0e8d8;
  --bg-2:          #faf5ee;
  --bg-3:          #e8dcc8;
  --border:        rgba(120,90,50,0.12);
  --border-strong: rgba(120,90,50,0.24);
  --text:          #2d1f0e;
  --text-2:        #6b5540;
  --text-3:        #a08868;
  --shadow:        0 2px 12px rgba(120,90,50,0.12);
  --ring-bg:       rgba(120,90,50,0.1);
  --btn-bg:        #e8dcc8;
  --ui-accent:     #f59e0b;
  --ui-accent-soft:rgba(245,158,11,0.14);
  --ui-accent-border:rgba(245,158,11,0.45);
  --ui-accent-glow:0 0 16px rgba(245,158,11,0.18);
  --toggle-on:     #f59e0b;
  --arcade-border: linear-gradient(135deg,#3b82f6,#6366f1);
  --arcade-glow:   0 0 16px rgba(59,130,246,0.15);
  --title-gradient:linear-gradient(135deg,#7c4a00 0%,#c2410c 52%,#92400e 100%);
  --title-shadow: 0 2px 12px rgba(120,90,50,0.22);
}
html[data-theme="pink"] {
  --bg:            #fdf2f8;
  --bg-2:          #fff0f6;
  --bg-3:          #fce7f3;
  --border:        rgba(236,72,153,0.15);
  --border-strong: rgba(236,72,153,0.3);
  --text:          #1a202c;
  --text-2:        #6b3a5a;
  --text-3:        #a8729a;
  --shadow:        0 2px 12px rgba(236,72,153,0.12);
  --ring-bg:       rgba(236,72,153,0.1);
  --btn-bg:        #fbcfe8;
  --ui-accent:     #ec4899;
  --ui-accent-soft:rgba(236,72,153,0.14);
  --ui-accent-border:rgba(236,72,153,0.4);
  --ui-accent-glow:0 0 16px rgba(236,72,153,0.18);
  --toggle-on:     #ec4899;
  --arcade-border: linear-gradient(135deg,#ec4899,#f9a8d4);
  --arcade-glow:   0 0 16px rgba(236,72,153,0.2);
  --title-gradient:linear-gradient(135deg,#7f1d4e 0%,#be185d 52%,#db2777 100%);
  --title-shadow: 0 2px 12px rgba(122,15,75,0.22);
}

/* ── Reset & Base ──────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: system-ui, -apple-system, sans-serif;
  background: var(--bg);
  min-height: 100dvh;
  display: flex; align-items: center; justify-content: center;
  color: var(--text);
  transition: background 0.3s, color 0.3s;
}

/* Imagem de fundo */
body::before {
  content: '';
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
html[data-theme="dark"] body::before {
  background-image: url('./bg-dark-mobile.jpeg');
}
html[data-theme="light"] body::before { background-image: url('./bg-light-mobile.jpeg'); }
html[data-theme="pink"]  body::before { background-image: url('./bg-pink-mobile.jpeg'); }
@media (min-width: 768px) {
  html[data-theme="dark"]  body::before { background-image: url('./bg-dark.jpeg'); }
  html[data-theme="light"] body::before { background-image: url('./bg-light.jpeg'); }
  html[data-theme="pink"]  body::before { background-image: url('./bg-light.jpeg'); }
}

#app { width: 100%; max-width: 560px; position: relative; z-index: 1; }

.screen {
  display: flex; flex-direction: column; align-items: center;
  gap: 16px; padding: 16px 20px 24px; min-height: 100dvh; width: 100%;
}

/* ── TOPBAR ──────────────────────────────────────────────────── */
.topbar {
  display: flex; align-items: center; justify-content: space-between;
  width: 100%; padding-top: 4px;
}
.topbar-right { display: flex; align-items: center; gap: 10px; }
.btn-settings-pill {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  background: var(--ui-accent-soft); border: 1px solid var(--ui-accent-border);
  border-radius: 999px; min-height: 38px; padding: 0 14px 0 12px;
  color: var(--ui-accent); cursor: pointer; font-size: .78rem; font-weight: 700;
  letter-spacing: .1px; transition: all .15s; backdrop-filter: blur(8px);
  box-shadow: 0 0 0 1px rgba(255,255,255,.02) inset;
  white-space: nowrap;
}
.btn-settings-pill svg { width: 16px; height: 16px; flex-shrink: 0; }
.btn-settings-pill:hover {
  background: var(--bg-3); color: var(--ui-accent); transform: translateY(-1px);
  box-shadow: 0 0 0 1px var(--ui-accent-border) inset, var(--ui-accent-glow);
}
.btn-settings-pill:active { transform: translateY(0); }
.btn-settings-pill span { line-height: 1; }
.btn-profile-icon {
  width: 38px; height: 38px; border-radius: 50%;
  background: var(--bg-2); border: 1px solid var(--ui-accent-border);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--ui-accent); transition: all .15s;
  box-shadow: 0 0 0 1px var(--ui-accent-soft) inset;
}
.btn-profile-icon:hover {
  background: var(--bg-3); color: var(--ui-accent); transform: translateY(-1px);
  box-shadow: 0 0 0 1px var(--ui-accent-border) inset, var(--ui-accent-glow);
}
.btn-profile-icon:active { transform: translateY(0); }
.btn-profile-icon svg { width: 18px; height: 18px; }

/* ── MENU ────────────────────────────────────────────────────── */
.menu-screen { justify-content: flex-start; padding-top: 4px; gap: 14px; }
.menu-logo { cursor: pointer; user-select: none; text-align: center; }
.menu-logo h1 {
  font-size: 2.4rem; font-weight: 900; letter-spacing: -1px;
  background: var(--title-gradient);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  text-shadow: 0 2px 10px var(--title-shadow);
}
.menu-tagline { color: var(--text-2); font-size: .88rem; margin-top: 2px; }

/* ── RANK CARD ───────────────────────────────────────────────── */
.rank-card {
  display: flex; align-items: center; gap: 14px;
  background: var(--bg-2); border: 1px solid var(--border-strong);
  border-radius: 16px; padding: 12px 20px;
  box-shadow: var(--shadow); transition: background .3s;
}
.rank-ring-wrap {
  position: relative; width: 54px; height: 54px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.rank-ring-svg { position: absolute; inset: 0; width: 100%; height: 100%; transform: rotate(0deg); }
.rank-ring-icon { font-size: 1.6rem; position: relative; z-index: 1; }
.rank-info { display: flex; flex-direction: column; gap: 2px; }
.rank-name { font-size: 1.05rem; font-weight: 800; color: var(--text); }
.rank-xp   { font-size: .8rem; color: var(--text-2); }
.btn-god-ring {
  margin-left: auto; background: none; border: none;
  font-size: 1.1rem; cursor: pointer; opacity: .7;
}
.btn-god-ring:hover { opacity: 1; }

/* ── ENERGIA ─────────────────────────────────────────────────── */
.energy-row {
  display: flex; align-items: center; gap: 10px;
  width: 100%; justify-content: center;
}
.energy-bolt { font-size: 1.1rem; }
.energy-count { font-weight: 800; color: #22c55e; font-size: .9rem; min-width: 36px; }
.e-dots-wrap { display: none; }
.menu-screen .energy-row { flex-wrap: wrap; justify-content: center; row-gap: 6px; }
.menu-screen .e-dots-wrap { display: flex; flex-basis: 100%; justify-content: center; gap: 3px; }
.menu-screen .e-bar-wrap  { display: none; }
.e-bar-wrap {
  display: flex; flex: 1; max-width: 200px; height: 13px;
  background: rgba(0,0,0,.35); border-radius: 6px; overflow: hidden;
  border: 1px solid rgba(255,255,255,.1);
  box-shadow: inset 0 1px 3px rgba(0,0,0,.4);
}
.e-bar-fill {
  height: 100%; border-radius: 6px; transition: width .4s ease;
  background: linear-gradient(90deg, #16a34a 0%, #22c55e 60%, #86efac 100%);
  box-shadow: 0 0 10px #22c55e88;
  background-size: 200px 100%;
}

/* ── MENU BUTTONS ────────────────────────────────────────────── */
.menu-buttons { display: flex; flex-direction: column; gap: 10px; width: 100%; }

.btn-menu {
  display: flex; align-items: center; gap: 14px;
  border-radius: 16px; padding: 14px 16px;
  cursor: pointer; color: var(--text);
  transition: all .15s; width: 100%; position: relative;
  overflow: hidden;
}
.btn-menu:active { transform: scale(.985); }
.btn-menu-icon-wrap {
  width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.35rem; transition: transform .15s;
}
.btn-menu-icon-wrap svg { display: block; flex-shrink: 0; }
.btn-menu:hover .btn-menu-icon-wrap { transform: scale(1.08); }
.btn-menu-text { flex: 1; display: flex; flex-direction: column; gap: 2px; align-items: center; }
.btn-menu-text strong { font-size: .98rem; display: block; font-weight: 700; }
.btn-menu-text small  { font-size: .76rem; color: var(--text-2); }

/* Arcade */
.btn-arcade {
  background: rgba(0,0,0,.82); border: 1.5px solid rgba(6,182,212,.5);
  box-shadow: 0 0 14px rgba(6,182,212,.12);
}
.btn-arcade:hover { border-color: #06b6d4; background: rgba(0,0,0,.9); box-shadow: 0 0 22px rgba(6,182,212,.22); }
.btn-icon--arcade { background: rgba(6,182,212,.14); border: 1.5px solid rgba(6,182,212,.5); }

/* Bot */
.btn-bot {
  background: rgba(0,0,0,.82); border: 1.5px solid rgba(236,72,153,.5);
  box-shadow: 0 0 14px rgba(236,72,153,.12);
}
.btn-bot:hover { border-color: #ec4899; background: rgba(0,0,0,.9); box-shadow: 0 0 22px rgba(236,72,153,.22); }
.btn-icon--bot { background: rgba(236,72,153,.14); border: 1.5px solid rgba(236,72,153,.5); }

/* Multi */
.btn-multi {
  background: rgba(0,0,0,.82); border: 1.5px solid rgba(139,92,246,.5);
  box-shadow: 0 0 14px rgba(139,92,246,.12);
}
.btn-multi:hover { border-color: #8b5cf6; background: rgba(0,0,0,.9); box-shadow: 0 0 22px rgba(139,92,246,.22); }
.btn-icon--multi { background: rgba(139,92,246,.14); border: 1.5px solid rgba(139,92,246,.5); }

/* Tutorial */
.btn-tutorial {
  background: rgba(0,0,0,.82); border: 1.5px solid rgba(245,158,11,.5);
  box-shadow: 0 0 14px rgba(245,158,11,.12);
}
.btn-tutorial:hover { border-color: #f59e0b; background: rgba(0,0,0,.9); box-shadow: 0 0 22px rgba(245,158,11,.22); }
.btn-icon--tutorial { background: rgba(245,158,11,.14); border: 1.5px solid rgba(245,158,11,.5); }

html[data-theme="light"] .btn-arcade,
html[data-theme="light"] .btn-bot,
html[data-theme="light"] .btn-multi,
html[data-theme="light"] .btn-tutorial { background: #e8dcc8; }
html[data-theme="light"] .btn-arcade:hover,
html[data-theme="light"] .btn-bot:hover,
html[data-theme="light"] .btn-multi:hover,
html[data-theme="light"] .btn-tutorial:hover { background: #d4c4a8; }
html[data-theme="light"] .btn-arcade,
html[data-theme="light"] .btn-bot,
html[data-theme="light"] .btn-multi,
html[data-theme="light"] .btn-tutorial {
  border-color: var(--ui-accent-border);
  box-shadow: 0 0 14px rgba(245,158,11,.12);
}
html[data-theme="light"] .btn-arcade:hover,
html[data-theme="light"] .btn-bot:hover,
html[data-theme="light"] .btn-multi:hover,
html[data-theme="light"] .btn-tutorial:hover {
  border-color: var(--ui-accent);
  box-shadow: 0 0 22px var(--ui-accent-soft);
}
html[data-theme="light"] .btn-icon--arcade,
html[data-theme="light"] .btn-icon--bot,
html[data-theme="light"] .btn-icon--multi,
html[data-theme="light"] .btn-icon--tutorial {
  background: var(--ui-accent-soft);
  border-color: var(--ui-accent-border);
  color: var(--ui-accent);
}
html[data-theme="light"] .btn-profile-icon {
  background: var(--ui-accent-soft);
  color: var(--ui-accent);
}
html[data-theme="pink"] .btn-arcade,
html[data-theme="pink"] .btn-bot,
html[data-theme="pink"] .btn-multi,
html[data-theme="pink"] .btn-tutorial { background: #fbcfe8; }
html[data-theme="pink"] .btn-arcade:hover,
html[data-theme="pink"] .btn-bot:hover,
html[data-theme="pink"] .btn-multi:hover,
html[data-theme="pink"] .btn-tutorial:hover { background: #f9a8d4; }
html[data-theme="pink"] .btn-arcade,
html[data-theme="pink"] .btn-bot,
html[data-theme="pink"] .btn-multi,
html[data-theme="pink"] .btn-tutorial {
  border-color: var(--ui-accent-border);
  box-shadow: 0 0 14px rgba(236,72,153,.12);
}
html[data-theme="pink"] .btn-arcade:hover,
html[data-theme="pink"] .btn-bot:hover,
html[data-theme="pink"] .btn-multi:hover,
html[data-theme="pink"] .btn-tutorial:hover {
  border-color: var(--ui-accent);
  box-shadow: 0 0 22px var(--ui-accent-soft);
}
html[data-theme="pink"] .btn-menu-icon-wrap {
  background: var(--ui-accent-soft);
  border-color: var(--ui-accent-border);
  color: var(--ui-accent);
}
html[data-theme="pink"] .btn-settings-pill,
html[data-theme="pink"] .btn-profile-icon,
html[data-theme="pink"] .section-title-icon {
  background: var(--ui-accent-soft);
  border-color: var(--ui-accent-border);
  color: var(--ui-accent);
}
html[data-theme="pink"] .btn-settings-pill:hover,
html[data-theme="pink"] .btn-profile-icon:hover {
  background: var(--bg-3); color: var(--ui-accent);
  box-shadow: 0 0 0 1px var(--ui-accent-border) inset, var(--ui-accent-glow);
}

/* Pink — seleções e interativos */
html[data-theme="pink"] .btn-lang.active { border-color: var(--ui-accent-border); box-shadow: 0 0 0 2px var(--ui-accent-soft); }
html[data-theme="pink"] .btn-theme-opt.active { background: var(--ui-accent-soft); border-color: var(--ui-accent-border); color: var(--ui-accent); }
html[data-theme="pink"] .btn-diff.selected,
html[data-theme="pink"] .btn-grid-size.selected,
html[data-theme="pink"] .btn-player-count.selected,
html[data-theme="pink"] .btn-team-mode.selected { background: var(--ui-accent-soft); border-color: var(--ui-accent-border); color: var(--ui-accent); }
html[data-theme="pink"] .btn-grid-size.selected .dot-preview { background: var(--ui-accent); }
html[data-theme="pink"] .btn-start { background: #ec4899; box-shadow: 0 4px 16px rgba(236,72,153,.35); }
html[data-theme="pink"] .btn-start:hover:not(:disabled) { background: #db2777; }
html[data-theme="pink"] .btn-ad { border-color: #ec4899; color: #be185d; }
html[data-theme="pink"] .btn-ad:hover { background: rgba(236,72,153,.1); }
html[data-theme="pink"] .stage-cell.unlocked:hover { border-color: rgba(236,72,153,.5); }
html[data-theme="pink"] .stage-cell.stars-3 { border-color: rgba(236,72,153,.6); }
html[data-theme="pink"] .btn-lang.active { border-color: var(--ui-accent-border); }

.badge-new {
  position: absolute; top: 10px; right: 12px;
  background: #06b6d4; color: #fff;
  font-size: .62rem; font-weight: 800;
  padding: 3px 8px; border-radius: 20px; letter-spacing: .5px;
}

/* ── IDIOMA ──────────────────────────────────────────────────── */
.lang-selector { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
.btn-lang {
  background: var(--bg-2); border: 1px solid var(--border);
  border-radius: 10px; width: 44px; height: 44px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: 1.6rem; line-height: 1;
  transition: all .15s; padding: 0;
}
.btn-lang .fi-flag-icon { border-radius: 3px; box-shadow: 0 1px 3px rgba(0,0,0,.3); }
.btn-lang:hover { border-color: var(--border-strong); transform: scale(1.1); }
.btn-lang.active {
  background: var(--ui-accent-soft); border-color: var(--ui-accent-border);
  box-shadow: 0 0 0 2px var(--ui-accent-soft); color: var(--ui-accent);
  transform: scale(1.1);
}

/* ── BOTTOM BAR ──────────────────────────────────────────────── */
.bottom-bar {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  margin-top: auto; padding-top: 8px; width: 100%;
  position: relative;
}
/* ── TOGGLE DE TEMA ──────────────────────────────────────────── */
.theme-toggle-wrap {
  display: flex;
  background: var(--bg-2); border: 1.5px solid var(--ui-accent-border);
  border-radius: 20px; overflow: hidden;
  box-shadow: 0 0 0 1px var(--ui-accent-soft) inset;
}
.theme-toggle-opt {
  flex: 1; padding: 5px 10px; font-size: .75rem; font-weight: 800;
  cursor: pointer; border: none; background: transparent;
  color: var(--text-2); transition: all .15s; white-space: nowrap;
  display: flex; align-items: center; justify-content: center;
}
.theme-toggle-opt svg { flex-shrink: 0; }
.theme-toggle-opt:hover { color: var(--ui-accent); }
.theme-toggle-opt.active {
  background: var(--ui-accent-soft); color: var(--ui-accent);
}

.platform-pills {
  display: flex; gap: 12px;
  border: 1.5px solid var(--border-strong); border-radius: 20px;
  padding: 5px 18px;
  background: var(--bg-2);
}
.platform-pill {
  display: flex; align-items: center; gap: 4px;
  font-size: .75rem; font-weight: 800;
  color: var(--text-2); letter-spacing: .8px;
}
.platform-pill svg { flex-shrink: 0; }
.bottom-star {
  position: absolute; right: 0; bottom: 2px;
  font-size: 1.3rem; color: var(--text-3); opacity: .5;
  font-family: serif;
}
.version-tag {
  position: absolute; right: 0; top: 0;
  font-size: .68rem; color: var(--text-3);
}

@media (max-width: 767px) {
  .menu-logo {
    margin-top: clamp(18px, 4vh, 56px);
  }
  .bottom-bar {
    padding-bottom: 4px;
  }
  .screen:not(.menu-screen):not(.game-screen) {
    padding-top: clamp(48px, 8vh, 80px);
  }
}

/* ── HEADER (outras telas) ───────────────────────────────────── */
.screen-header {
  display: flex; align-items: center; justify-content: space-between;
  width: 100%; gap: 10px; padding-bottom: 4px;
}
.screen-header h2 {
  flex: 1; display: flex; align-items: center; justify-content: center;
  text-align: center; font-size: 1.1rem; font-weight: 800; color: var(--text);
  min-width: 0;
}
.section-title { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-width: 0; }
.section-title-icon {
  width: 28px; height: 28px; border-radius: 9px;
  display: inline-flex; align-items: center; justify-content: center;
  background: var(--ui-accent-soft); border: 1px solid var(--ui-accent-border);
  color: var(--ui-accent); box-shadow: 0 0 0 1px var(--ui-accent-soft) inset;
  flex-shrink: 0;
}
.section-title-icon svg { width: 15px; height: 15px; flex-shrink: 0; }
.section-title > span:last-child { min-width: 0; }
.header-end-spacer { flex: 0 0 72px; }
.btn-back {
  background: var(--ui-accent-soft); border: 1px solid var(--ui-accent-border);
  border-radius: 10px; padding: 8px 14px; color: var(--ui-accent);
  cursor: pointer; font-size: .84rem; font-weight: 600;
  transition: all .15s; white-space: nowrap;
  box-shadow: 0 0 0 1px var(--ui-accent-soft) inset;
}
.btn-back:hover {
  background: var(--bg-3); color: var(--ui-accent);
  box-shadow: 0 0 0 1px var(--ui-accent-border) inset, var(--ui-accent-glow);
}
.btn-god-corner {
  background: var(--ui-accent-soft); border: 1px solid var(--ui-accent-border);
  border-radius: 10px; padding: 6px 10px; color: var(--ui-accent);
  cursor: pointer; font-size: .95rem; transition: all .15s;
  box-shadow: 0 0 0 1px var(--ui-accent-soft) inset;
}
.btn-god-corner:hover {
  background: var(--bg-3); box-shadow: 0 0 0 1px var(--ui-accent-border) inset, var(--ui-accent-glow);
}

/* ── ARCADE MAP ──────────────────────────────────────────────── */
.stage-grid { display: grid; grid-template-columns: repeat(5,1fr); gap: 8px; width: 100%; padding-bottom: 24px; }
.stage-cell {
  background: var(--bg-2); border: 1px solid var(--border); border-radius: 12px;
  padding: 8px 4px; cursor: pointer; color: var(--text);
  display: flex; flex-direction: column; align-items: center; gap: 2px; transition: all .15s;
}
.stage-cell:disabled { opacity: .3; cursor: not-allowed; }
.stage-cell.unlocked:hover { background: var(--bg-3); border-color: var(--border-strong); }
.stage-cell.stars-3 { border-color: rgba(243,156,18,.5); }
.stage-cell.stars-2 { border-color: var(--ui-accent-border); }
.stage-cell.stars-1 { border-color: rgba(46,204,113,.4); }
.stage-num { font-size: .85rem; font-weight: 700; }
.stage-stars { font-size: .6rem; color: #f39c12; }

/* ── SETUP ───────────────────────────────────────────────────── */
.setup-screen { gap: 20px; }
.setup-section { width: 100%; }
.setup-label { font-size: .72rem; font-weight: 700; color: var(--text-3); text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px; }
.diff-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 8px; }
.btn-diff, .btn-grid-size, .btn-player-count, .btn-team-mode {
  background: var(--bg-2); border: 1px solid var(--border); border-radius: 10px;
  padding: 12px; color: var(--text); cursor: pointer; font-size: .875rem;
  transition: all .1s; text-align: center; font-weight: 600;
}
.btn-diff:hover, .btn-player-count:hover, .btn-team-mode:hover { background: var(--bg-3); }
.btn-player-count.selected, .btn-team-mode.selected {
  background: var(--ui-accent-soft); border-color: var(--ui-accent-border); color: var(--ui-accent);
}
/* Difficulty buttons — layout + tier colors */
.btn-diff { display: flex; align-items: center; gap: 8px; text-align: left; }
.btn-diff:last-child:nth-child(odd) { grid-column: 1 / -1; justify-content: center; }
.diff-icon { font-size: 1rem; flex-shrink: 0; }
.btn-diff--easy  { border-color: rgba(6,182,212,.4); }
.btn-diff--easy:hover  { border-color: #06b6d4; background: rgba(6,182,212,.06); }
.btn-diff--easy.selected  { background: var(--ui-accent-soft); border-color: var(--ui-accent-border); color: var(--ui-accent); }
.btn-diff--hard  { border-color: rgba(168,85,247,.4); }
.btn-diff--hard:hover  { border-color: #a855f7; background: rgba(168,85,247,.06); }
.btn-diff--hard.selected  { background: var(--ui-accent-soft); border-color: var(--ui-accent-border); color: var(--ui-accent); }
.btn-diff--wild  { border-color: rgba(249,115,22,.4); }
.btn-diff--wild:hover  { border-color: #f97316; background: rgba(249,115,22,.06); }
.btn-diff--wild.selected  { background: var(--ui-accent-soft); border-color: var(--ui-accent-border); color: var(--ui-accent); }
html[data-theme="light"] .btn-diff--easy,
html[data-theme="light"] .btn-diff--hard,
html[data-theme="light"] .btn-diff--wild {
  border-color: var(--ui-accent-border);
}
html[data-theme="light"] .btn-diff--easy:hover,
html[data-theme="light"] .btn-diff--hard:hover,
html[data-theme="light"] .btn-diff--wild:hover {
  border-color: var(--ui-accent);
  background: var(--ui-accent-soft);
}
/* Grid size buttons with dot preview */
.btn-grid-size { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 10px 8px; }
.btn-grid-size:hover { background: var(--bg-3); }
.btn-grid-size.selected { background: var(--ui-accent-soft); border-color: var(--ui-accent-border); color: var(--ui-accent); }
.grid-size-label { font-weight: 700; font-size: .85rem; }
.dot-grid-preview { display: grid; gap: 3px; }
.dot-preview { width: 5px; height: 5px; border-radius: 50%; background: rgba(140,155,180,.4); }
.btn-grid-size.selected .dot-preview { background: var(--ui-accent); }
.multi-grid { display: grid; gap: 8px; width: 100%; }
.multi-grid--players { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.multi-grid--teams,
.multi-grid--sizes { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.btn-player-count { display: flex; align-items: center; justify-content: center; gap: 8px; min-height: 48px; }
.btn-team-mode { min-height: 48px; }
.grid-size-row { display: flex; gap: 8px; flex-wrap: wrap; }
.grid-size-row > * { flex: 1; min-width: 70px; }
.btn-start {
  background: var(--ui-accent); border: none; border-radius: 12px; padding: 14px;
  color: #fff; font-size: 1rem; font-weight: 700; cursor: pointer; width: 100%;
  margin-top: 8px; transition: all .15s; box-shadow: 0 4px 16px var(--ui-accent-soft);
}
.btn-start:hover:not(:disabled) { filter: brightness(1.06); }
.btn-start:disabled { opacity: .4; cursor: not-allowed; box-shadow: none; }

/* ── JOGO ────────────────────────────────────────────────────── */
/* "mobile" e "responsivo" são equivalentes neste projeto: max-width: 767px */
.game-screen {
  position: relative; padding: 0; gap: 0;
  display: flex; align-items: center; justify-content: center;
}
.game-hud {
  position: absolute; top: 10px; left: 16px; right: 16px;
  display: flex; flex-direction: column; gap: 10px; z-index: 2;
  pointer-events: none;
}
.game-hud > * { pointer-events: auto; }
.game-screen .canvas-wrapper { display: flex; justify-content: center; }
@media (max-width: 767px) {
  .game-screen .canvas-wrapper { margin-bottom: 40px; }
}
.scoreboard { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.player-chip { display: flex; align-items: center; gap: 7px; background: var(--bg-2); border: 2px solid var(--border); border-radius: 40px; padding: 7px 14px; font-size: .88rem; transition: border-color .15s; }
.player-chip--active { border-color: var(--pc); box-shadow: 0 0 0 3px color-mix(in srgb, var(--pc) 18%, transparent); }
.player-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--pc); flex-shrink: 0; }
.player-name { font-weight: 600; }
.player-score { font-weight: 800; color: var(--pc); }
.team-chip { background: var(--bg-2); border: 2px solid var(--pc); border-radius: 10px; padding: 8px 16px; font-weight: 700; }
.status { font-size: .92rem; font-weight: 600; min-height: 1.4em; transition: color .2s; }
.canvas-wrapper { width: 100%; display: flex; justify-content: center; }
canvas { max-width: 100%; height: auto; border-radius: 14px; background: #fff; box-shadow: var(--shadow); touch-action: none; display: block; }

/* ── MODAL (Settings + God Mode) ────────────────────────────── */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.6); display: flex; align-items: center; justify-content: center; z-index: 700; backdrop-filter: blur(6px); animation: fadeIn .2s; }
.modal-card {
  background: var(--bg-2); border: 1px solid var(--ui-accent-border); border-radius: 20px;
  padding: 24px; width: 320px; display: flex; flex-direction: column; gap: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,.4), 0 0 0 1px var(--ui-accent-soft);
}
.modal-header {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 1.05rem; font-weight: 800; color: var(--ui-accent);
}
.modal-header > span { display: inline-flex; align-items: center; gap: 6px; }
.modal-header > span svg { width: 16px; height: 16px; flex-shrink: 0; }
.modal-close {
  background: var(--ui-accent-soft); border: 1px solid var(--ui-accent-border);
  color: var(--ui-accent); cursor: pointer; font-size: 1.1rem; padding: 4px;
  border-radius: 6px; transition: all .15s;
}
.modal-close:hover { background: var(--bg-3); box-shadow: 0 0 0 1px var(--ui-accent-border) inset, var(--ui-accent-glow); }
.settings-section { display: flex; flex-direction: column; gap: 10px; }
.settings-label { font-size: .72rem; font-weight: 700; color: var(--text-3); text-transform: uppercase; letter-spacing: 1px; }
.theme-row { display: flex; gap: 8px; }
.btn-theme-opt { flex: 1; background: var(--bg-3); border: 1px solid var(--border); border-radius: 10px; padding: 10px; color: var(--text-2); cursor: pointer; font-size: .82rem; font-weight: 600; transition: all .15s; display: flex; align-items: center; justify-content: center; gap: 5px; }
.btn-theme-opt svg { flex-shrink: 0; }
.btn-theme-opt:hover { border-color: var(--ui-accent-border); color: var(--ui-accent); }
.btn-theme-opt.active { background: var(--ui-accent-soft); border-color: var(--ui-accent-border); color: var(--ui-accent); }
.settings-vibration-label { display: inline-flex; align-items: center; gap: 8px; }
.settings-vibration-icon { display: inline-flex; align-items: center; justify-content: center; color: var(--ui-accent); }
.settings-vibration-icon svg { width: 16px; height: 16px; flex-shrink: 0; }
.settings-version { font-size: .72rem; color: var(--text-3); text-align: center; }
.settings-lang { margin-top: 0; }
.music-vol-row { display: flex; align-items: center; gap: 8px; width: 100%; }
.music-vol-icon { font-size: 1rem; flex-shrink: 0; }
.music-vol-slider { flex: 1; height: 4px; accent-color: var(--ui-accent); cursor: pointer; border-radius: 4px; }
.music-vol-pct { font-size: .78rem; font-weight: 700; color: var(--text-2); min-width: 36px; text-align: right; }
html[data-theme="pink"] .music-vol-slider { accent-color: #ec4899; }

/* Toggle switch (vibração) */
.toggle-switch { position: relative; width: 46px; height: 26px; cursor: pointer; flex-shrink: 0; }
.toggle-switch input { opacity: 0; width: 0; height: 0; position: absolute; }
.toggle-track {
  position: absolute; inset: 0; border-radius: 13px;
  background: var(--border-strong); transition: background .2s;
}
.toggle-track::after {
  content: ""; position: absolute;
  width: 20px; height: 20px; border-radius: 50%;
  background: #fff; top: 3px; left: 3px;
  transition: transform .2s; box-shadow: 0 1px 3px rgba(0,0,0,.3);
}
.toggle-switch input:checked + .toggle-track { background: var(--toggle-on); }
.toggle-switch input:checked + .toggle-track::after { transform: translateX(20px); }

/* God Mode */
.god-card { border-color: rgba(243,156,18,.3); }
.god-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.god-label { font-size: .88rem; color: var(--text-2); font-weight: 600; }
.god-toggle { background: var(--bg-3); border: 1px solid var(--border-strong); border-radius: 8px; padding: 7px 16px; color: var(--text-2); font-weight: 700; cursor: pointer; transition: all .15s; font-size: .85rem; }
.god-toggle.on { background: var(--ui-accent-soft); border-color: var(--ui-accent-border); color: var(--ui-accent); }
.god-input-row { display: flex; gap: 8px; }
.god-input { background: var(--bg-3); border: 1px solid var(--border-strong); border-radius: 8px; padding: 8px 12px; color: var(--text); font-size: .9rem; width: 90px; outline: none; }
.god-input:focus { border-color: var(--ui-accent-border); }
.god-go { background: var(--ui-accent); border: none; border-radius: 8px; padding: 8px 14px; color: #fff; font-weight: 700; cursor: pointer; font-size: .85rem; box-shadow: 0 4px 16px var(--ui-accent-soft); }
.god-skip { background: rgba(155,89,182,.15); border: 1px solid #9b59b6; border-radius: 10px; padding: 10px; color: #9b59b6; font-weight: 700; cursor: pointer; width: 100%; text-align: center; font-size: .88rem; }
.god-skip:hover { background: rgba(155,89,182,.25); }
.god-refill { background: rgba(243,156,18,.1); border: 1px solid rgba(243,156,18,.4); border-radius: 10px; padding: 10px; color: #f39c12; font-weight: 700; cursor: pointer; width: 100%; text-align: center; font-size: .88rem; }
.god-refill:hover { background: rgba(243,156,18,.2); }

/* ── CELEBRAÇÃO ──────────────────────────────────────────────── */
.cel-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.88); display: flex; align-items: center; justify-content: center; z-index: 500; animation: fadeIn .3s; }
.cel-card { display: flex; flex-direction: column; align-items: center; gap: 16px; text-align: center; padding: 16px; }
.cel-label { font-size: .95rem; color: var(--text-2); font-weight: 600; animation: fadeInUp .5s .1s both; }
.cel-title { font-size: 3.5rem; font-weight: 900; letter-spacing: -1px; background: linear-gradient(135deg,#f39c12,#e74c3c,#9b59b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: bounceIn .7s .2s both; }
.cel-stars { display: flex; gap: 10px; }
.cel-star { font-size: 3rem; color: #333; animation: starPop .4s both; }
.cel-star.earned { color: #f39c12; text-shadow: 0 0 24px #f39c12cc; }
.cel-phrase { font-size: 1.1rem; font-weight: 700; color: #e6edf3; letter-spacing: .3px; animation: fadeInUp .4s .85s both; text-align: center; }
.cel-xp { font-size: 1.6rem; font-weight: 800; color: #2ecc71; animation: fadeInUp .5s 1s both; text-shadow: 0 0 12px #2ecc7166; }
.cel-actions { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
.btn-cel-next { background: linear-gradient(135deg,#2ecc71,#27ae60); border: none; border-radius: 12px; padding: 14px 28px; color: #fff; font-size: 1rem; font-weight: 800; cursor: pointer; transition: transform .1s; box-shadow: 0 4px 16px #2ecc7144; }
.btn-cel-next:hover { transform: scale(1.04); }
.btn-cel-map { background: var(--bg-3); border: 1px solid var(--border-strong); border-radius: 12px; padding: 14px 20px; color: var(--text-2); font-size: .9rem; font-weight: 600; cursor: pointer; }
.btn-cel-map:hover { background: var(--bg-2); }

/* ── DERROTA ─────────────────────────────────────────────────── */
.fail-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.88); display: flex; align-items: center; justify-content: center; z-index: 500; animation: fadeIn .3s; }
.fail-card { display: flex; flex-direction: column; align-items: center; gap: 16px; text-align: center; background: #1a0010; border: 1px solid rgba(231,76,60,.3); border-radius: 20px; padding: 32px 40px; }
.fail-emoji { font-size: 3.5rem; animation: bounceIn .5s both; }
.fail-title { font-size: 1.8rem; font-weight: 900; color: #e74c3c; animation: fadeInUp .4s .2s both; }
.fail-phrase { font-size: 1rem; font-weight: 600; color: #e6edf3; letter-spacing: .3px; animation: fadeInUp .4s .45s both; text-align: center; }
.fail-actions { display: flex; flex-direction: column; gap: 10px; width: 100%; }
.btn-retry-pay { background: #e74c3c; border: none; border-radius: 10px; padding: 12px 24px; color: #fff; font-weight: 700; cursor: pointer; font-size: .95rem; transition: background .15s; }
.btn-retry-pay:hover { background: #c0392b; }
/* ── TUTORIAL ────────────────────────────────────────────────── */
.tut-steps { display: flex; flex-direction: column; gap: 10px; width: 100%; }
.tut-step { display: flex; align-items: flex-start; gap: 12px; background: var(--bg-2); border: 1px solid var(--border); border-radius: 12px; padding: 12px 14px; }
.tut-step-num { width: 28px; height: 28px; border-radius: 50%; background: var(--ui-accent-soft); border: 1.5px solid var(--ui-accent-border); color: var(--ui-accent); font-weight: 800; font-size: .85rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.tut-step-body { display: flex; flex-direction: column; gap: 3px; }
.tut-step-body strong { font-size: .9rem; font-weight: 700; color: var(--text); }
.tut-step-body span { font-size: .78rem; color: var(--text-2); line-height: 1.4; }
.tut-board-hint { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 14px; background: var(--bg-2); border: 1px solid var(--border); border-radius: 12px; width: 100%; }
.tut-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; padding: 4px; }
.tut-dot { width: 9px; height: 9px; border-radius: 50%; background: rgba(140,155,180,.45); }
.tut-dot--hl { background: var(--ui-accent); box-shadow: 0 0 8px var(--ui-accent); }
.tut-hint-text { font-size: .76rem; color: var(--text-2); text-align: center; }

.fail-skip-section { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,.08); }
.fail-skip-label { font-size: .8rem; color: var(--text-2); font-weight: 600; }
.no-skips-label { font-size: .78rem; color: var(--text-3); }
.btn-ad { background: transparent; border: 1px solid var(--ui-accent-border); border-radius: 10px; padding: 12px 24px; color: var(--ui-accent); font-weight: 700; cursor: pointer; font-size: .95rem; transition: all .15s; width: 100%; }
.btn-ad:hover { background: var(--ui-accent-soft); }

/* ── ANÚNCIO ─────────────────────────────────────────────────── */
.ad-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.92); display: flex; align-items: center; justify-content: center; z-index: 600; }
.ad-card { background: #111; border: 1px solid #333; border-radius: 16px; width: 300px; display: flex; flex-direction: column; overflow: hidden; }
.ad-top { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: #222; }
.ad-tag { font-size: .7rem; font-weight: 700; color: #aaa; letter-spacing: 2px; }
.ad-timer { font-size: .85rem; font-weight: 700; color: #f39c12; }
.ad-mock { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 32px 20px; }
.ad-logo { font-size: 3rem; }
.ad-text { font-size: .9rem; color: #ccc; text-align: center; }
.ad-cta { background: #e74c3c; border-radius: 8px; padding: 8px 20px; font-weight: 700; font-size: .9rem; color: #fff; }
.ad-progress-wrap { height: 4px; background: #333; }
.ad-progress { height: 100%; width: 0; background: var(--ui-accent); }
.btn-close-ad { background: #1a1a2e; border: none; padding: 14px; color: #888; font-size: .9rem; font-weight: 700; cursor: not-allowed; transition: all .15s; }
.btn-close-ad.ready { color: #2ecc71; cursor: pointer; }
.btn-close-ad.ready:hover { background: #252540; }

/* ── TOAST ───────────────────────────────────────────────────── */
.toast { position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%) translateY(20px); background: var(--bg-2); border: 1px solid var(--border-strong); border-radius: 10px; padding: 10px 20px; color: var(--text); font-size: .88rem; font-weight: 600; z-index: 800; opacity: 0; transition: opacity .3s, transform .3s; pointer-events: none; white-space: nowrap; max-width: 90vw; text-align: center; box-shadow: var(--shadow); }
.toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

/* ── ANIMAÇÕES ───────────────────────────────────────────────── */
@keyframes fadeIn    { from{opacity:0} to{opacity:1} }
@keyframes fadeInUp  { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
@keyframes bounceIn  { 0%{transform:scale(.2);opacity:0} 60%{transform:scale(1.15)} 80%{transform:scale(.95)} 100%{transform:scale(1);opacity:1} }
@keyframes starPop   { 0%{transform:scale(0) rotate(-45deg);opacity:0} 60%{transform:scale(1.3) rotate(8deg)} 100%{transform:scale(1) rotate(0);opacity:1} }
`;
document.head.appendChild(style);

// ── Vibração global em botões ─────────────────────────────────────────────
document.addEventListener("click", (e) => {
  const el = e.target as Element;
  if (el.closest("button") && !el.closest("canvas")) vibrate(8);
}, { passive: true });

// ── Boot ──────────────────────────────────────────────────────────────────
showMenu();

import { GameController, GameConfig } from "./controller";
import { render, canvasSize, findLineAtPoint } from "./renderer";
import { chooseBotMove, botThinkDelay, BotDifficulty, BOT_DIFFICULTIES, getDiffLabel } from "./bot";
import { getStage, INITIAL_STAGES } from "./arcade-stages";
import {
  loadProfile, recordStageResult, rankLabel,
  loadEnergy, spendEnergy, refillEnergy, MAX_ENERGY,
  loadGodMode, saveGodMode, GodModeConfig,
  loadTheme, saveTheme, applyTheme, Theme,
} from "./storage";
import { t, getCurrentLang, setLang, LANG_NAMES, Lang } from "./i18n";
import { Line, lineKey } from "../models/line";
import "flag-icons/css/flag-icons.min.css";

const VERSION = "v1.2.5";

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
}

let session: GameSession | null = null;
let hoverLine: Line | null = null;
let godMode: GodModeConfig = loadGodMode();

const app = document.getElementById("app")!;
const PLAYER_COLORS = ["#e74c3c", "#3498db", "#2ecc71", "#f39c12"];

applyTheme();

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

// ── Celebração ────────────────────────────────────────────────────────────
function showCelebration(stars: 0|1|2|3, xp: number, label: string, nextId: number|null, onNext: ()=>void, onMap: ()=>void) {
  launchConfetti();
  const ov = document.createElement("div");
  ov.className = "cel-overlay";
  const starsHtml = [0,1,2].map((i) =>
    `<span class="cel-star ${i < stars ? "earned" : "empty"}" style="animation-delay:${0.4+i*0.25}s">★</span>`
  ).join("");
  ov.innerHTML = `
    <div class="cel-card">
      <div class="cel-label">${label}</div>
      <div class="cel-title">${t("stage_complete")}</div>
      <div class="cel-stars">${starsHtml}</div>
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

function showFailBanner(onRetry: ()=>void, onAd: ()=>void, onMap: ()=>void) {
  const ov = document.createElement("div");
  ov.className = "fail-overlay";
  ov.innerHTML = `
    <div class="fail-card">
      <div class="fail-emoji">😞</div>
      <div class="fail-title">${t("you_lost")}</div>
      <div class="fail-actions">
        <button class="btn-retry-pay" id="fr">${t("try_again")}</button>
        <button class="btn-ad" id="fa">${t("watch_ad")}</button>
        <button class="btn-cel-map" id="fm">${t("map")}</button>
      </div>
    </div>`;
  document.body.appendChild(ov);
  ov.querySelector("#fr")?.addEventListener("click", () => { ov.remove(); onRetry(); });
  ov.querySelector("#fa")?.addEventListener("click", () => { ov.remove(); onAd(); });
  ov.querySelector("#fm")?.addEventListener("click", () => { ov.remove(); onMap(); });
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
        <span>⚙ ${t("settings")}</span>
        <button class="modal-close" id="mc">✕</button>
      </div>
      <div class="settings-section">
        <label class="settings-label">${t("theme")}</label>
        <div class="theme-row">
          <button class="btn-theme-opt ${cur==="dark"?"active":""}" data-theme="dark">${t("theme_dark")}</button>
          <button class="btn-theme-opt ${cur==="light"?"active":""}" data-theme="light">${t("theme_light")}</button>
        </div>
      </div>
      <div class="settings-section">
        <label class="settings-label">${t("lang_label")}</label>
        <div class="lang-selector settings-lang">${langSelectorInner()}</div>
      </div>
      <div class="settings-version">${VERSION}</div>
    </div>`;
  document.body.appendChild(ov);
  ov.querySelector("#mc")?.addEventListener("click", () => ov.remove());
  ov.addEventListener("click", (e) => { if (e.target === ov) ov.remove(); });
  ov.querySelectorAll(".btn-theme-opt").forEach((b) => {
    (b as HTMLElement).onclick = () => {
      saveTheme((b as HTMLElement).dataset["theme"] as Theme);
      ov.remove(); showMenu();
    };
  });
  ov.querySelectorAll(".btn-lang").forEach((b) => {
    (b as HTMLElement).onclick = () => {
      setLang((b as HTMLElement).dataset["lang"] as Lang);
      ov.remove(); showMenu();
    };
  });
}

// ── God Mode Modal ────────────────────────────────────────────────────────
function showGodModeModal(currentStageId?: number) {
  const ov = document.createElement("div");
  ov.className = "modal-overlay";
  ov.innerHTML = `
    <div class="modal-card god-card">
      <div class="modal-header"><span>${t("god_mode")}</span><button class="modal-close" id="gc">✕</button></div>
      <div class="settings-section">
        <div class="god-row">
          <label class="god-label">${t("god_unlimited_energy")}</label>
          <button class="god-toggle ${godMode.unlimitedEnergy?"on":""}" id="ge">${godMode.unlimitedEnergy ? t("on_label") : t("off_label")}</button>
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
          <button class="btn-settings-pill" id="btn-settings">⚙ ${t("settings")}</button>
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
          <div class="btn-menu-text">
            <strong>${t("menu_arcade")}</strong>
            <small>${t("menu_arcade_sub", { done, total: INITIAL_STAGES })}</small>
          </div>
          ${isNew ? `<span class="badge-new">NEW</span>` : ""}
        </button>
        <button class="btn-menu btn-bot" id="btn-bot">
          <div class="btn-menu-text">
            <strong>${t("menu_bot")}</strong>
            <small>${t("menu_bot_sub")}</small>
          </div>
        </button>
        <button class="btn-menu btn-multi" id="btn-multi">
          <div class="btn-menu-text">
            <strong>${t("menu_multi")}</strong>
            <small>${t("menu_multi_sub")}</small>
          </div>
        </button>
      </div>

      ${langSelectorHTML()}

      <div class="bottom-bar">
        <div class="platform-icons">
          <span>🖥 PC</span>
          <span>🤖 Android</span>
          <span>📱 iOS</span>
        </div>
        <div class="platform-label">${t("multiplatform")}</div>
        <div class="bottom-star">✦</div>
        <div class="version-tag">${VERSION}</div>
      </div>

    </div>`;

  startEnergyTimer();
  document.getElementById("btn-arcade")!.onclick = showArcadeMap;
  document.getElementById("btn-bot")!.onclick    = showBotSetup;
  document.getElementById("btn-multi")!.onclick  = showMultiSetup;
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
        <h2>🕹️ Arcade</h2>
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
function showBotSetup() {
  stopEnergyTimer();
  app.innerHTML = `
    <div class="screen setup-screen">
      <div class="screen-header">
        <button class="btn-back" id="btn-back">${t("back")}</button>
        <h2>🤖 ${t("menu_bot")}</h2>
      </div>
      <div class="setup-section">
        <label class="setup-label">${t("setup_difficulty")}</label>
        <div class="diff-grid">${BOT_DIFFICULTIES.map((k) => `<button class="btn-diff" data-diff="${k}">${getDiffLabel(k)}</button>`).join("")}</div>
      </div>
      <div class="setup-section">
        <label class="setup-label">${t("setup_grid")}</label>
        <div class="grid-size-row">${[3,4,5,6].map(n=>`<button class="btn-grid-size" data-size="${n}">${n}×${n}</button>`).join("")}</div>
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
        <h2>👥 ${t("menu_multi")}</h2>
      </div>
      <div class="setup-section">
        <label class="setup-label">${t("setup_players")}</label>
        <div class="grid-size-row">${[2,3,4].map(n=>`<button class="btn-player-count" data-count="${n}">${n}</button>`).join("")}</div>
      </div>
      <div class="setup-section" id="team-section" style="display:none">
        <label class="setup-label">${t("setup_mode")}</label>
        <div class="grid-size-row">
          <button class="btn-team-mode selected" data-team="false">${t("setup_solo")}</button>
          <button class="btn-team-mode" data-team="true">${t("setup_teams")}</button>
        </div>
      </div>
      <div class="setup-section">
        <label class="setup-label">${t("setup_grid")}</label>
        <div class="grid-size-row">${[3,4,5,6].map(n=>`<button class="btn-grid-size" data-size="${n}">${n}×${n}</button>`).join("")}</div>
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

// ── STARTERS ──────────────────────────────────────────────────────────────
function startArcadeStage(stageId: number, godSkip = false) {
  if (!godSkip && !godMode.unlimitedEnergy && !spendEnergy()) { showToast(t("energy_no")); return; }
  const stage = getStage(stageId);
  session = {
    mode: "arcade", stageId, botDifficulty: stage.difficulty,
    controller: new GameController({ gridSize: stage.gridSize, players: [{ name: t("you"), color: PLAYER_COLORS[0]! }, { name: t("bot"), color: PLAYER_COLORS[1]! }] }),
    botPlayerId: "p2", botThinking: false, freeRetry: false,
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
  const stageLabel = s.mode === "arcade" ? t("stage_label", { id: s.stageId! })
    : s.mode === "vs-bot" ? t("vs_bot_label", { diff: getDiffLabel(s.botDifficulty!) })
    : s.teamMode ? t("teams_2v2") : t("n_players", { n: s.playerCount! });

  app.innerHTML = `
    <div class="screen game-screen">
      <div class="game-topbar">
        <button class="btn-back-sm" id="btn-back">✕</button>
        <span class="game-mode-label">${stageLabel}</span>
        <button class="btn-god-corner" id="btn-god-game">👑</button>
      </div>
      <div id="scoreboard" class="scoreboard"></div>
      <div id="status" class="status"></div>
      <div class="canvas-wrapper"><canvas id="board"></canvas></div>
    </div>`;

  document.getElementById("btn-back")!.onclick = () => {
    session = null; hoverLine = null;
    if (s.mode === "arcade") showArcadeMap(); else if (s.mode === "vs-bot") showBotSetup(); else showMultiSetup();
  };
  document.getElementById("btn-god-game")!.onclick = () => showGodModeModal(s.stageId);

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
      const won = you.score > bot.score;
      if (won) {
        let stars: 0|1|2|3 = 1; let xp = 100;
        if (stage.objectiveType === "margin" && (you.score-bot.score) >= stage.objectiveValue) { stars=2; xp+=50; }
        else if (stage.objectiveType === "dominance" && you.score/((stage.gridSize-1)**2) >= stage.objectiveValue/100) { stars=2; xp+=50; }
        if (stars===2&&stage.objectiveType==="margin"&&(you.score-bot.score)>=stage.objectiveValue+2) { stars=3; xp+=50; }
        recordStageResult(s.stageId, stars, you.score*100, xp);
        const nextId = s.stageId < INITIAL_STAGES ? s.stageId+1 : null;
        showCelebration(stars, xp, t("stage_label",{id:s.stageId}), nextId,
          () => { if (nextId) startArcadeStage(nextId); else showArcadeMap(); },
          () => { session=null; hoverLine=null; showArcadeMap(); });
      } else {
        showFailBanner(
          () => { if (!godMode.unlimitedEnergy && !spendEnergy()) { showToast(t("energy_no")); return; } session=null; hoverLine=null; startArcadeStage(s.stageId!,true); },
          () => showAdModal(() => { session=null; hoverLine=null; startArcadeStage(s.stageId!,true); }),
          () => { session=null; hoverLine=null; showArcadeMap(); });
      }
    } else if (s.mode === "vs-bot") {
      const you = st.players.find((p)=>p.id!==s.botPlayerId)!;
      if (you.score === maxScore) showCelebration(1,60,t("victory"),null,()=>startBotGame(s.botDifficulty!,st.gridSize),showMenu);
      else showFailBanner(()=>startBotGame(s.botDifficulty!,st.gridSize),()=>showAdModal(()=>startBotGame(s.botDifficulty!,st.gridSize)),showMenu);
    } else {
      const winners = st.players.filter((p)=>p.score===maxScore);
      const label = winners.length===1 ? `${winners[0]!.name} ${t("won_suffix")}` : t("tie");
      showCelebration(3,80,label,null,()=>startMultiGame(s.playerCount!,s.teamMode!,st.gridSize),showMenu);
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
    s.controller.playLine(line); hoverLine=null; draw();
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
  --arcade-border: linear-gradient(135deg,#ec4899,#8b5cf6,#06b6d4);
  --arcade-glow:   0 0 24px rgba(139,92,246,0.25), 0 0 48px rgba(236,72,153,0.1);
  --title-gradient:linear-gradient(135deg,#f97316 0%,#a855f7 50%,#06b6d4 100%);
}
html[data-theme="light"] {
  --bg:            #d8e4f0;
  --bg-2:          #ffffff;
  --bg-3:          #eef2f8;
  --border:        rgba(0,0,0,0.08);
  --border-strong: rgba(0,0,0,0.16);
  --text:          #1a202c;
  --text-2:        #4a5568;
  --text-3:        #8896a0;
  --shadow:        0 2px 12px rgba(0,0,0,0.08);
  --ring-bg:       rgba(0,0,0,0.1);
  --btn-bg:        #ffffff;
  --arcade-border: linear-gradient(135deg,#3b82f6,#6366f1);
  --arcade-glow:   0 0 16px rgba(59,130,246,0.15);
  --title-gradient:none;
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
html[data-theme="light"] body::before {
  background-image: url('./bg-light-mobile.jpeg');
}
@media (min-width: 768px) {
  html[data-theme="dark"] body::before {
    background-image: url('./bg-dark.jpeg');
  }
  html[data-theme="light"] body::before {
    background-image: url('./bg-light.jpeg');
  }
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
  display: flex; align-items: center; gap: 6px;
  background: var(--bg-2); border: 1px solid var(--border-strong);
  border-radius: 20px; padding: 7px 14px; color: var(--text-2);
  cursor: pointer; font-size: .82rem; font-weight: 600;
  transition: all .15s; backdrop-filter: blur(8px);
}
.btn-settings-pill:hover { background: var(--bg-3); color: var(--text); }
.btn-profile-icon {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--bg-2); border: 1px solid var(--border-strong);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--text-2); transition: all .15s;
}
.btn-profile-icon:hover { background: var(--bg-3); color: var(--text); }
.btn-profile-icon svg { width: 18px; height: 18px; }

/* ── MENU ────────────────────────────────────────────────────── */
.menu-screen { justify-content: flex-start; padding-top: 12px; gap: 18px; }
.menu-logo { cursor: pointer; user-select: none; text-align: center; }
.menu-logo h1 {
  font-size: 2.4rem; font-weight: 900; letter-spacing: -1px;
  background: var(--title-gradient);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
html[data-theme="light"] .menu-logo h1 {
  background: none; -webkit-text-fill-color: #1e293b; color: #1e293b;
  font-weight: 900;
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
.energy-count { font-weight: 800; color: #3b9df8; font-size: .9rem; min-width: 36px; }
.e-dots-wrap { display: flex; gap: 3px; flex-wrap: wrap; max-width: 160px; }
.e-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--border-strong); flex-shrink: 0; transition: background .2s; }
.e-dot.full { background: #3b9df8; box-shadow: 0 0 5px #3b9df866; }
.e-bar-wrap { display: none; flex: 1; max-width: 180px; height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; }
.e-bar-fill { height: 100%; background: #3b9df8; border-radius: 4px; transition: width .3s; }
html[data-theme="light"] .e-dots-wrap { display: none; }
html[data-theme="light"] .e-bar-wrap  { display: block; }

/* ── MENU BUTTONS ────────────────────────────────────────────── */
.menu-buttons { display: flex; flex-direction: column; gap: 10px; width: 100%; }

.btn-menu {
  display: flex; align-items: center; justify-content: center;
  background: var(--btn-bg); border: 1px solid var(--border);
  border-radius: 16px; padding: 16px 20px;
  cursor: pointer; color: var(--text); text-align: center;
  transition: all .15s; width: 100%; position: relative;
  overflow: hidden;
}
.btn-menu:hover { background: var(--bg-3); border-color: var(--border-strong); }
.btn-menu:active { transform: scale(.985); }
.btn-menu-text { display: flex; flex-direction: column; gap: 2px; align-items: center; }
.btn-menu-text strong { font-size: .98rem; display: block; font-weight: 700; }
.btn-menu-text small  { font-size: .76rem; color: var(--text-2); }

/* Arcade — gradient border */
.btn-arcade {
  border: 1.5px solid transparent;
  background: linear-gradient(var(--bg-2), var(--bg-2)) padding-box,
              var(--arcade-border) border-box;
  box-shadow: var(--arcade-glow);
}
.btn-arcade:hover { box-shadow: var(--arcade-glow), 0 2px 12px rgba(0,0,0,.2); }

html[data-theme="light"] .btn-arcade {
  background: #fff padding-box, linear-gradient(135deg,#3b82f6,#6366f1) border-box;
}
html[data-theme="light"] .btn-bot,
html[data-theme="light"] .btn-multi { background: #fff; }

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
.btn-lang.active { border-color: #3b9df8; box-shadow: 0 0 0 2px rgba(59,157,248,0.35); transform: scale(1.1); }

/* ── BOTTOM BAR ──────────────────────────────────────────────── */
.bottom-bar {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  margin-top: auto; padding-top: 8px; width: 100%;
  position: relative;
}
.platform-icons { display: flex; gap: 16px; font-size: .78rem; color: var(--text-3); }
.platform-label { font-size: .72rem; color: var(--text-3); }
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
}

/* ── HEADER (outras telas) ───────────────────────────────────── */
.screen-header {
  display: flex; align-items: center; justify-content: space-between;
  width: 100%; gap: 10px; padding-bottom: 4px;
}
.screen-header h2 { font-size: 1.1rem; font-weight: 800; color: var(--text); }
.btn-back {
  background: var(--bg-2); border: 1px solid var(--border-strong);
  border-radius: 10px; padding: 8px 14px; color: var(--text-2);
  cursor: pointer; font-size: .84rem; font-weight: 600;
  transition: all .15s; white-space: nowrap;
}
.btn-back:hover { background: var(--bg-3); color: var(--text); }
.btn-god-corner {
  background: var(--bg-2); border: 1px solid rgba(243,156,18,.3);
  border-radius: 10px; padding: 6px 10px; color: #f39c12;
  cursor: pointer; font-size: .95rem; transition: all .15s;
}
.btn-god-corner:hover { background: var(--bg-3); }

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
.stage-cell.stars-2 { border-color: rgba(59,157,248,.4); }
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
.btn-diff:hover, .btn-grid-size:hover, .btn-player-count:hover, .btn-team-mode:hover { background: var(--bg-3); }
.btn-diff.selected, .btn-grid-size.selected, .btn-player-count.selected, .btn-team-mode.selected {
  background: rgba(59,157,248,.15); border-color: #3b9df8; color: #3b9df8;
}
.grid-size-row { display: flex; gap: 8px; flex-wrap: wrap; }
.grid-size-row > * { flex: 1; min-width: 70px; }
.btn-start {
  background: #3b9df8; border: none; border-radius: 12px; padding: 14px;
  color: #fff; font-size: 1rem; font-weight: 700; cursor: pointer; width: 100%;
  margin-top: 8px; transition: all .15s; box-shadow: 0 4px 16px rgba(59,157,248,.3);
}
.btn-start:hover:not(:disabled) { background: #2980b9; }
.btn-start:disabled { opacity: .4; cursor: not-allowed; box-shadow: none; }

/* ── JOGO ────────────────────────────────────────────────────── */
.game-screen { padding: 10px 16px 20px; gap: 10px; }
.game-topbar { display: flex; align-items: center; justify-content: space-between; width: 100%; }
.btn-back-sm { background: var(--bg-2); border: 1px solid var(--border-strong); border-radius: 8px; padding: 6px 12px; color: var(--text-2); cursor: pointer; font-size: .9rem; transition: all .15s; }
.btn-back-sm:hover { background: var(--bg-3); }
.game-mode-label { font-size: .82rem; color: var(--text-2); font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 200px; }
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
.modal-card { background: var(--bg-2); border: 1px solid var(--border-strong); border-radius: 20px; padding: 24px; width: 320px; display: flex; flex-direction: column; gap: 20px; box-shadow: 0 20px 60px rgba(0,0,0,.4); }
.modal-header { display: flex; justify-content: space-between; align-items: center; font-size: 1.05rem; font-weight: 800; color: var(--text); }
.modal-close { background: none; border: none; color: var(--text-2); cursor: pointer; font-size: 1.1rem; padding: 4px; border-radius: 6px; }
.modal-close:hover { background: var(--bg-3); }
.settings-section { display: flex; flex-direction: column; gap: 10px; }
.settings-label { font-size: .72rem; font-weight: 700; color: var(--text-3); text-transform: uppercase; letter-spacing: 1px; }
.theme-row { display: flex; gap: 8px; }
.btn-theme-opt { flex: 1; background: var(--bg-3); border: 1px solid var(--border); border-radius: 10px; padding: 10px; color: var(--text-2); cursor: pointer; font-size: .88rem; font-weight: 600; transition: all .15s; }
.btn-theme-opt:hover { border-color: var(--border-strong); color: var(--text); }
.btn-theme-opt.active { background: rgba(59,157,248,.15); border-color: #3b9df8; color: #3b9df8; }
.settings-version { font-size: .72rem; color: var(--text-3); text-align: center; }
.settings-lang { margin-top: 0; }

/* God Mode */
.god-card { border-color: rgba(243,156,18,.3); }
.god-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.god-label { font-size: .88rem; color: var(--text-2); font-weight: 600; }
.god-toggle { background: var(--bg-3); border: 1px solid var(--border-strong); border-radius: 8px; padding: 7px 16px; color: var(--text-2); font-weight: 700; cursor: pointer; transition: all .15s; font-size: .85rem; }
.god-toggle.on { background: rgba(243,156,18,.15); border-color: #f39c12; color: #f39c12; }
.god-input-row { display: flex; gap: 8px; }
.god-input { background: var(--bg-3); border: 1px solid var(--border-strong); border-radius: 8px; padding: 8px 12px; color: var(--text); font-size: .9rem; width: 90px; outline: none; }
.god-input:focus { border-color: #3b9df8; }
.god-go { background: #3b9df8; border: none; border-radius: 8px; padding: 8px 14px; color: #fff; font-weight: 700; cursor: pointer; font-size: .85rem; }
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
.fail-actions { display: flex; flex-direction: column; gap: 10px; width: 100%; }
.btn-retry-pay { background: #e74c3c; border: none; border-radius: 10px; padding: 12px 24px; color: #fff; font-weight: 700; cursor: pointer; font-size: .95rem; transition: background .15s; }
.btn-retry-pay:hover { background: #c0392b; }
.btn-ad { background: transparent; border: 1px solid #3b9df8; border-radius: 10px; padding: 12px 24px; color: #3b9df8; font-weight: 700; cursor: pointer; font-size: .95rem; transition: all .15s; }
.btn-ad:hover { background: rgba(59,157,248,.1); }

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
.ad-progress { height: 100%; width: 0; background: #3b9df8; }
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

// ── Boot ──────────────────────────────────────────────────────────────────
showMenu();

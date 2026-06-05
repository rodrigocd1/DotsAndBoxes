import { GameController, GameConfig } from "./controller";
import { render, canvasSize, findLineAtPoint } from "./renderer";
import { chooseBotMove, botThinkDelay, BotDifficulty, BOT_DIFFICULTY_LABELS } from "./bot";
import { getStage, INITIAL_STAGES } from "./arcade-stages";
import { loadProfile, recordStageResult, rankLabel } from "./storage";
import { Line, lineKey } from "../models/line";

// ── Estado global de navegação ────────────────────────────────────────────
type Screen = "menu" | "arcade-map" | "vs-bot-setup" | "multi-setup" | "game";

interface GameSession {
  mode: "arcade" | "vs-bot" | "multi";
  stageId?: number;
  botDifficulty?: BotDifficulty;
  playerCount?: number;
  teamMode?: boolean;
  controller: GameController;
  botPlayerId?: string;
  botThinking: boolean;
}

let currentScreen: Screen = "menu";
let session: GameSession | null = null;
let hoverLine: Line | null = null;
const app = document.getElementById("app")!;

// ── Utilitários ───────────────────────────────────────────────────────────
function scaled(canvas: HTMLCanvasElement, cx: number, cy: number) {
  const r = canvas.getBoundingClientRect();
  return { x: (cx - r.left) * (canvas.width / r.width), y: (cy - r.top) * (canvas.height / r.height) };
}

const PLAYER_COLORS = ["#e74c3c", "#3498db", "#2ecc71", "#f39c12"];
const PLAYER_NAMES  = ["Jogador 1", "Jogador 2", "Jogador 3", "Jogador 4"];

// ── TELA: MENU ────────────────────────────────────────────────────────────
function showMenu() {
  currentScreen = "menu";
  const profile = loadProfile();
  const rank = rankLabel(profile.xp);
  const stagesCompleted = Object.values(profile.stageProgress).filter((s) => s.stars > 0).length;

  app.innerHTML = `
    <div class="screen menu-screen">
      <div class="menu-logo">
        <h1>Dots &amp; Boxes</h1>
        <p class="menu-tagline">Conecte • Feche • Domine</p>
      </div>

      <div class="rank-badge">
        <span class="rank-icon">${rank.icon}</span>
        <div class="rank-info">
          <span class="rank-name">${rank.rank}</span>
          <span class="rank-xp">${profile.xp.toLocaleString()} XP</span>
        </div>
      </div>

      <div class="menu-buttons">
        <button class="btn-menu btn-arcade" id="btn-arcade">
          <span class="btn-icon">🕹️</span>
          <div class="btn-text">
            <strong>Arcade</strong>
            <small>${stagesCompleted}/${INITIAL_STAGES} fases concluídas</small>
          </div>
        </button>

        <button class="btn-menu btn-bot" id="btn-bot">
          <span class="btn-icon">🤖</span>
          <div class="btn-text">
            <strong>vs Bot</strong>
            <small>Escolha a dificuldade</small>
          </div>
        </button>

        <button class="btn-menu btn-multi" id="btn-multi">
          <span class="btn-icon">👥</span>
          <div class="btn-text">
            <strong>Multijogador</strong>
            <small>2 a 4 jogadores • Duplas ou Solo</small>
          </div>
        </button>
      </div>
    </div>`;

  document.getElementById("btn-arcade")!.onclick = showArcadeMap;
  document.getElementById("btn-bot")!.onclick    = showBotSetup;
  document.getElementById("btn-multi")!.onclick  = showMultiSetup;
}

// ── TELA: MAPA ARCADE ─────────────────────────────────────────────────────
function showArcadeMap() {
  currentScreen = "arcade-map";
  const profile = loadProfile();

  let cells = "";
  for (let i = 1; i <= INITIAL_STAGES; i++) {
    const prog = profile.stageProgress[i];
    const stars = prog?.stars ?? 0;
    const unlocked = i === 1 || (profile.stageProgress[i - 1]?.stars ?? 0) > 0;
    const starStr = "★".repeat(stars) + "☆".repeat(3 - stars);
    cells += `<button class="stage-cell ${unlocked ? "unlocked" : "locked"} stars-${stars}" data-stage="${i}" ${unlocked ? "" : "disabled"}>
      <span class="stage-num">${i}</span>
      <span class="stage-stars">${starStr}</span>
    </button>`;
  }

  app.innerHTML = `
    <div class="screen arcade-screen">
      <div class="screen-header">
        <button class="btn-back" id="btn-back">← Voltar</button>
        <h2>🕹️ Modo Arcade</h2>
      </div>
      <div class="stage-grid">${cells}</div>
    </div>`;

  document.getElementById("btn-back")!.onclick = showMenu;
  document.querySelectorAll(".stage-cell.unlocked").forEach((el) => {
    (el as HTMLElement).onclick = () => {
      const id = parseInt((el as HTMLElement).dataset["stage"]!, 10);
      startArcadeStage(id);
    };
  });
}

// ── TELA: SETUP VS BOT ────────────────────────────────────────────────────
function showBotSetup() {
  currentScreen = "vs-bot-setup";

  const diffs = Object.entries(BOT_DIFFICULTY_LABELS) as [BotDifficulty, string][];
  const diffButtons = diffs.map(([k, label]) =>
    `<button class="btn-diff" data-diff="${k}">${label}</button>`
  ).join("");

  app.innerHTML = `
    <div class="screen setup-screen">
      <div class="screen-header">
        <button class="btn-back" id="btn-back">← Voltar</button>
        <h2>🤖 vs Bot</h2>
      </div>
      <div class="setup-section">
        <label class="setup-label">Dificuldade</label>
        <div class="diff-grid">${diffButtons}</div>
      </div>
      <div class="setup-section">
        <label class="setup-label">Tamanho da Grade</label>
        <div class="grid-size-row">
          ${[3,4,5,6].map(n => `<button class="btn-grid-size" data-size="${n}">${n}×${n}</button>`).join("")}
        </div>
      </div>
      <button class="btn-start" id="btn-start" disabled>Iniciar Partida</button>
    </div>`;

  document.getElementById("btn-back")!.onclick = showMenu;

  let selectedDiff: BotDifficulty | null = null;
  let selectedSize = 4;

  // Pré-seleciona grade 4
  (document.querySelector(`[data-size="4"]`) as HTMLElement).classList.add("selected");

  document.querySelectorAll(".btn-diff").forEach((btn) => {
    (btn as HTMLElement).onclick = () => {
      document.querySelectorAll(".btn-diff").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedDiff = (btn as HTMLElement).dataset["diff"] as BotDifficulty;
      (document.getElementById("btn-start") as HTMLButtonElement).disabled = false;
    };
  });

  document.querySelectorAll(".btn-grid-size").forEach((btn) => {
    (btn as HTMLElement).onclick = () => {
      document.querySelectorAll(".btn-grid-size").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedSize = parseInt((btn as HTMLElement).dataset["size"]!, 10);
    };
  });

  document.getElementById("btn-start")!.onclick = () => {
    if (!selectedDiff) return;
    startBotGame(selectedDiff, selectedSize);
  };
}

// ── TELA: SETUP MULTIJOGADOR ──────────────────────────────────────────────
function showMultiSetup() {
  currentScreen = "multi-setup";

  app.innerHTML = `
    <div class="screen setup-screen">
      <div class="screen-header">
        <button class="btn-back" id="btn-back">← Voltar</button>
        <h2>👥 Multijogador</h2>
      </div>
      <div class="setup-section">
        <label class="setup-label">Número de Jogadores</label>
        <div class="grid-size-row">
          ${[2,3,4].map(n => `<button class="btn-player-count" data-count="${n}">${n} jogadores</button>`).join("")}
        </div>
      </div>
      <div class="setup-section" id="team-section" style="display:none">
        <label class="setup-label">Modo de Equipe</label>
        <div class="grid-size-row">
          <button class="btn-team-mode selected" data-team="false">Solo (todos vs todos)</button>
          <button class="btn-team-mode" data-team="true">Duplas (2v2)</button>
        </div>
      </div>
      <div class="setup-section">
        <label class="setup-label">Tamanho da Grade</label>
        <div class="grid-size-row">
          ${[3,4,5,6].map(n => `<button class="btn-grid-size" data-size="${n}">${n}×${n}</button>`).join("")}
        </div>
      </div>
      <button class="btn-start" id="btn-start" disabled>Iniciar Partida</button>
    </div>`;

  document.getElementById("btn-back")!.onclick = showMenu;

  let playerCount = 0;
  let teamMode = false;
  let gridSize = 4;

  (document.querySelector(`[data-size="4"]`) as HTMLElement).classList.add("selected");

  document.querySelectorAll(".btn-player-count").forEach((btn) => {
    (btn as HTMLElement).onclick = () => {
      document.querySelectorAll(".btn-player-count").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      playerCount = parseInt((btn as HTMLElement).dataset["count"]!, 10);
      const teamSection = document.getElementById("team-section")!;
      teamSection.style.display = playerCount === 4 ? "block" : "none";
      (document.getElementById("btn-start") as HTMLButtonElement).disabled = false;
    };
  });

  document.querySelectorAll(".btn-team-mode").forEach((btn) => {
    (btn as HTMLElement).onclick = () => {
      document.querySelectorAll(".btn-team-mode").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      teamMode = (btn as HTMLElement).dataset["team"] === "true";
    };
  });

  document.querySelectorAll(".btn-grid-size").forEach((btn) => {
    (btn as HTMLElement).onclick = () => {
      document.querySelectorAll(".btn-grid-size").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      gridSize = parseInt((btn as HTMLElement).dataset["size"]!, 10);
    };
  });

  document.getElementById("btn-start")!.onclick = () => {
    if (!playerCount) return;
    startMultiGame(playerCount, teamMode, gridSize);
  };
}

// ── INICIAR PARTIDAS ──────────────────────────────────────────────────────
function startArcadeStage(stageId: number) {
  const stage = getStage(stageId);
  const config: GameConfig = {
    gridSize: stage.gridSize,
    players: [
      { name: "Você", color: PLAYER_COLORS[0]! },
      { name: "Bot",  color: PLAYER_COLORS[1]! },
    ],
  };
  session = {
    mode: "arcade",
    stageId,
    botDifficulty: stage.difficulty,
    controller: new GameController(config),
    botPlayerId: "p2",
    botThinking: false,
  };
  showGame();
}

function startBotGame(difficulty: BotDifficulty, gridSize: number) {
  const config: GameConfig = {
    gridSize,
    players: [
      { name: "Você", color: PLAYER_COLORS[0]! },
      { name: "Bot",  color: PLAYER_COLORS[1]! },
    ],
  };
  session = {
    mode: "vs-bot",
    botDifficulty: difficulty,
    controller: new GameController(config),
    botPlayerId: "p2",
    botThinking: false,
  };
  showGame();
}

function startMultiGame(playerCount: number, teamMode: boolean, gridSize: number) {
  const players = Array.from({ length: playerCount }, (_, i) => ({
    name: PLAYER_NAMES[i]!,
    color: PLAYER_COLORS[i]!,
  })) as GameConfig["players"];

  session = {
    mode: "multi",
    teamMode,
    playerCount,
    controller: new GameController({ gridSize, players }),
    botThinking: false,
  };
  showGame();
}

// ── TELA DE JOGO ──────────────────────────────────────────────────────────
function showGame() {
  if (!session) return;
  const s = session;
  const state = s.controller.getState();

  const stageLabel = s.mode === "arcade"
    ? `Fase ${s.stageId}`
    : s.mode === "vs-bot"
    ? `vs Bot — ${BOT_DIFFICULTY_LABELS[s.botDifficulty!]}`
    : s.teamMode ? "Duplas 2v2" : `${s.playerCount} Jogadores`;

  app.innerHTML = `
    <div class="screen game-screen">
      <div class="game-topbar">
        <button class="btn-back-sm" id="btn-back">✕</button>
        <span class="game-mode-label">${stageLabel}</span>
        <div style="width:36px"></div>
      </div>
      <div id="scoreboard" class="scoreboard"></div>
      <div id="status" class="status"></div>
      <div class="canvas-wrapper"><canvas id="board"></canvas></div>
      <div id="result-banner" class="result-banner" style="display:none"></div>
    </div>`;

  document.getElementById("btn-back")!.onclick = () => {
    session = null;
    hoverLine = null;
    if (s.mode === "arcade") showArcadeMap();
    else if (s.mode === "vs-bot") showBotSetup();
    else showMultiSetup();
  };

  const canvas  = document.getElementById("board") as HTMLCanvasElement;
  const ctx     = canvas.getContext("2d")!;

  function draw() {
    const st = s.controller.getState();
    const { width, height } = canvasSize(st.gridSize);
    canvas.width  = width;
    canvas.height = height;
    render(ctx, st, hoverLine, s.teamMode ?? false);
    updateHUD();
  }

  function updateHUD() {
    const st = s.controller.getState();
    const scoreboard = document.getElementById("scoreboard")!;
    const statusEl   = document.getElementById("status")!;

    if (s.teamMode && s.playerCount === 4) {
      // Placar por time
      const teamA = st.players.filter((_, i) => i % 2 === 0);
      const teamB = st.players.filter((_, i) => i % 2 === 1);
      const scoreA = teamA.reduce((a, p) => a + p.score, 0);
      const scoreB = teamB.reduce((a, p) => a + p.score, 0);
      scoreboard.innerHTML = `
        <div class="team-chip" style="--player-color:${PLAYER_COLORS[0]}">
          Time A <strong>${scoreA}</strong>
        </div>
        <div class="team-chip" style="--player-color:${PLAYER_COLORS[1]}">
          Time B <strong>${scoreB}</strong>
        </div>`;
    } else {
      scoreboard.innerHTML = st.players.map((p) => {
        const active = p.id === st.currentPlayerId && st.status === "playing";
        return `<div class="player-chip ${active ? "player-chip--active" : ""}" style="--player-color:${p.color}">
          <span class="player-dot"></span>
          <span class="player-name">${p.name}</span>
          <span class="player-score">${p.score}</span>
        </div>`;
      }).join("");
    }

    if (st.status === "finished") {
      statusEl.textContent = "";
      showResultBanner();
    } else if (s.botThinking) {
      statusEl.textContent = "Bot pensando...";
      statusEl.style.color = "#888";
    } else {
      const cur = st.players.find((p) => p.id === st.currentPlayerId)!;
      statusEl.textContent = `Vez de ${cur.name}`;
      statusEl.style.color = cur.color;
    }
  }

  function showResultBanner() {
    const st = s.controller.getState();
    const banner = document.getElementById("result-banner")!;
    const maxScore = Math.max(...st.players.map((p) => p.score));

    let msg = "";
    let xpEarned = 0;
    let stars: 0 | 1 | 2 | 3 = 0;

    if (s.mode === "arcade" && s.stageId != null) {
      const stage = getStage(s.stageId);
      const you = st.players.find((p) => p.id !== s.botPlayerId)!;
      const bot = st.players.find((p) => p.id === s.botPlayerId)!;
      const won = you.score > bot.score;

      if (won) {
        stars = 1;
        xpEarned = 100;
        // Verifica 2ª estrela
        if (stage.objectiveType === "win") {
          stars = you.score >= stage.objectiveValue ? 2 : 1;
        } else if (stage.objectiveType === "margin") {
          stars = (you.score - bot.score) >= stage.objectiveValue ? 2 : 1;
        }
        if (stars === 2) xpEarned += 50;
        if (stars === 2 && stage.objectiveType === "margin" && (you.score - bot.score) >= stage.objectiveValue + 2) {
          stars = 3;
          xpEarned += 50;
        }
        recordStageResult(s.stageId, stars, you.score * 100, xpEarned);
        msg = `🎉 Vitória! +${xpEarned} XP`;
      } else {
        stars = 0;
        msg = `😞 Derrota — Tente novamente`;
      }
    } else if (s.mode === "vs-bot") {
      const you = st.players.find((p) => p.id !== s.botPlayerId)!;
      const won = you.score === maxScore;
      xpEarned = won ? 60 : 0;
      msg = won ? `🏆 Vitória! +${xpEarned} XP` : `😞 Derrota`;
    } else {
      const winners = st.players.filter((p) => p.score === maxScore);
      msg = winners.length === 1 ? `🏆 ${winners[0]!.name} venceu!` : `🤝 Empate!`;
    }

    const starsStr = "★".repeat(stars) + "☆".repeat(3 - stars);

    banner.style.display = "block";
    banner.innerHTML = `
      <div class="result-content">
        <div class="result-msg">${msg}</div>
        ${s.mode === "arcade" ? `<div class="result-stars">${starsStr}</div>` : ""}
        <div class="result-actions">
          <button class="btn-result" id="btn-retry">🔄 ${s.mode === "arcade" ? "Tentar de Novo" : "Nova Partida"}</button>
          <button class="btn-result btn-result-back" id="btn-result-back">← Menu</button>
        </div>
      </div>`;

    document.getElementById("btn-retry")!.onclick = () => {
      if (s.mode === "arcade" && s.stageId != null) startArcadeStage(s.stageId);
      else if (s.mode === "vs-bot") startBotGame(s.botDifficulty!, s.controller.getState().gridSize);
      else startMultiGame(s.playerCount!, s.teamMode!, s.controller.getState().gridSize);
    };
    document.getElementById("btn-result-back")!.onclick = () => {
      session = null; hoverLine = null;
      if (s.mode === "arcade") showArcadeMap();
      else if (s.mode === "vs-bot") showBotSetup();
      else showMultiSetup();
    };
  }

  function isBotTurn(): boolean {
    if (!s.botPlayerId) return false;
    return s.controller.getState().currentPlayerId === s.botPlayerId;
  }

  function scheduleBotMove() {
    if (!s.botDifficulty) return;
    s.botThinking = true;
    updateHUD();
    setTimeout(() => {
      if (!session || session !== s) return;
      const st = s.controller.getState();
      if (st.status === "finished" || !isBotTurn()) return;
      const move = chooseBotMove(st, s.botDifficulty!);
      s.controller.playLine(move);
      s.botThinking = false;
      draw();
      if (isBotTurn()) scheduleBotMove();
    }, botThinkDelay(s.botDifficulty));
  }

  function handleMove(line: Line) {
    const st = s.controller.getState();
    if (st.status === "finished" || s.botThinking) return;
    if (isBotTurn()) return;
    if (line.ownerId !== null) return;

    s.controller.playLine(line);
    hoverLine = null;
    draw();

    if (isBotTurn() && s.controller.getState().status !== "finished") {
      scheduleBotMove();
    }
  }

  canvas.addEventListener("mousemove", (e) => {
    const st = s.controller.getState();
    if (st.status === "finished" || s.botThinking || isBotTurn()) return;
    const { x, y } = scaled(canvas, e.clientX, e.clientY);
    const found = findLineAtPoint(st, x, y);
    const candidate = found?.ownerId === null ? found : null;
    if ((hoverLine ? lineKey(hoverLine) : null) !== (candidate ? lineKey(candidate) : null)) {
      hoverLine = candidate;
      draw();
    }
    canvas.style.cursor = hoverLine ? "pointer" : "default";
  });

  canvas.addEventListener("mouseleave", () => { hoverLine = null; draw(); canvas.style.cursor = "default"; });

  canvas.addEventListener("click", (e) => {
    const { x, y } = scaled(canvas, e.clientX, e.clientY);
    const found = findLineAtPoint(s.controller.getState(), x, y);
    if (found) handleMove(found);
  });

  canvas.addEventListener("touchend", (e) => {
    e.preventDefault();
    const t = e.changedTouches[0];
    if (!t) return;
    const { x, y } = scaled(canvas, t.clientX, t.clientY);
    const found = findLineAtPoint(s.controller.getState(), x, y);
    if (found) handleMove(found);
  }, { passive: false });

  draw();

  // Se a partida começar com o bot jogando primeiro (improvável, mas possível)
  if (isBotTurn()) scheduleBotMove();
}

// ── CSS injetado ──────────────────────────────────────────────────────────
const style = document.createElement("style");
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: system-ui, -apple-system, sans-serif;
    background: #0f0f1a;
    min-height: 100dvh;
    display: flex; align-items: center; justify-content: center;
    color: #fff;
  }
  #app { width: 100%; max-width: 560px; }

  .screen { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 24px 16px; min-height: 100dvh; width: 100%; }

  /* MENU */
  .menu-screen { justify-content: center; gap: 24px; }
  .menu-logo h1 { font-size: 2.2rem; font-weight: 900; letter-spacing: -1px; background: linear-gradient(135deg, #e74c3c, #3498db); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; text-align: center; }
  .menu-tagline { text-align: center; color: #aaa; font-size: 0.9rem; margin-top: 4px; }

  .rank-badge { display: flex; align-items: center; gap: 10px; background: #1a1a2e; border: 1px solid #333; border-radius: 12px; padding: 10px 16px; }
  .rank-icon { font-size: 1.6rem; }
  .rank-name { font-weight: 700; font-size: 0.95rem; display: block; }
  .rank-xp { font-size: 0.8rem; color: #aaa; }

  .menu-buttons { display: flex; flex-direction: column; gap: 12px; width: 100%; }
  .btn-menu { display: flex; align-items: center; gap: 16px; background: #1a1a2e; border: 1px solid #333; border-radius: 14px; padding: 16px 20px; cursor: pointer; color: #fff; text-align: left; transition: background 0.15s, transform 0.1s; width: 100%; }
  .btn-menu:hover { background: #252540; }
  .btn-menu:active { transform: scale(0.98); }
  .btn-icon { font-size: 1.8rem; flex-shrink: 0; }
  .btn-text strong { font-size: 1rem; display: block; }
  .btn-text small { font-size: 0.8rem; color: #aaa; }
  .btn-arcade { border-color: #e74c3c44; }
  .btn-bot    { border-color: #3498db44; }
  .btn-multi  { border-color: #2ecc7144; }

  /* HEADER */
  .screen-header { display: flex; align-items: center; width: 100%; gap: 12px; }
  .screen-header h2 { font-size: 1.2rem; font-weight: 800; }
  .btn-back { background: #1a1a2e; border: 1px solid #333; border-radius: 8px; padding: 8px 14px; color: #fff; cursor: pointer; font-size: 0.9rem; }
  .btn-back:hover { background: #252540; }

  /* ARCADE MAP */
  .arcade-screen { }
  .stage-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; width: 100%; padding-bottom: 24px; }
  .stage-cell { background: #1a1a2e; border: 1px solid #333; border-radius: 10px; padding: 8px 4px; cursor: pointer; color: #fff; display: flex; flex-direction: column; align-items: center; gap: 2px; transition: background 0.15s; }
  .stage-cell:disabled { opacity: 0.35; cursor: not-allowed; }
  .stage-cell.unlocked:hover { background: #252540; }
  .stage-cell.stars-3 { border-color: #f39c1266; }
  .stage-cell.stars-2 { border-color: #3498db44; }
  .stage-cell.stars-1 { border-color: #2ecc7144; }
  .stage-num { font-size: 0.85rem; font-weight: 700; }
  .stage-stars { font-size: 0.65rem; color: #f39c12; }

  /* SETUP */
  .setup-screen { gap: 20px; }
  .setup-section { width: 100%; }
  .setup-label { font-size: 0.8rem; font-weight: 700; color: #aaa; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 10px; }
  .diff-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
  .btn-diff, .btn-grid-size, .btn-player-count, .btn-team-mode {
    background: #1a1a2e; border: 1px solid #333; border-radius: 10px;
    padding: 12px; color: #fff; cursor: pointer; font-size: 0.9rem;
    transition: background 0.1s; text-align: center; font-weight: 600;
  }
  .btn-diff:hover, .btn-grid-size:hover, .btn-player-count:hover, .btn-team-mode:hover { background: #252540; }
  .btn-diff.selected, .btn-grid-size.selected, .btn-player-count.selected, .btn-team-mode.selected { background: #3498db22; border-color: #3498db; color: #3498db; }
  .grid-size-row { display: flex; gap: 8px; flex-wrap: wrap; }
  .grid-size-row .btn-grid-size, .grid-size-row .btn-player-count, .grid-size-row .btn-team-mode { flex: 1; min-width: 80px; }
  .btn-start { background: #3498db; border: none; border-radius: 12px; padding: 14px 32px; color: #fff; font-size: 1rem; font-weight: 700; cursor: pointer; width: 100%; margin-top: 8px; transition: background 0.15s; }
  .btn-start:hover:not(:disabled) { background: #2980b9; }
  .btn-start:disabled { opacity: 0.4; cursor: not-allowed; }

  /* GAME */
  .game-screen { padding: 12px 16px 24px; gap: 10px; }
  .game-topbar { display: flex; align-items: center; justify-content: space-between; width: 100%; }
  .btn-back-sm { background: #1a1a2e; border: 1px solid #333; border-radius: 8px; padding: 6px 12px; color: #fff; cursor: pointer; font-size: 1rem; }
  .game-mode-label { font-size: 0.85rem; color: #aaa; font-weight: 600; }

  .scoreboard { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
  .player-chip { display: flex; align-items: center; gap: 7px; background: #1a1a2e; border: 2px solid #333; border-radius: 40px; padding: 7px 14px; font-size: 0.9rem; transition: border-color 0.15s; }
  .player-chip--active { border-color: var(--player-color); box-shadow: 0 0 0 3px color-mix(in srgb, var(--player-color) 20%, transparent); }
  .player-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--player-color); flex-shrink: 0; }
  .player-name { font-weight: 600; }
  .player-score { font-weight: 800; color: var(--player-color); }
  .team-chip { background: #1a1a2e; border: 2px solid var(--player-color); border-radius: 10px; padding: 8px 16px; font-weight: 700; }

  .status { font-size: 0.95rem; font-weight: 600; min-height: 1.4em; transition: color 0.2s; }

  .canvas-wrapper { width: 100%; display: flex; justify-content: center; }
  canvas { max-width: 100%; height: auto; border-radius: 14px; background: #fff; box-shadow: 0 8px 32px rgba(0,0,0,0.4); touch-action: none; display: block; }

  /* RESULT BANNER */
  .result-banner { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 10; }
  .result-content { background: #1a1a2e; border: 1px solid #333; border-radius: 20px; padding: 32px 40px; text-align: center; display: flex; flex-direction: column; gap: 16px; min-width: 260px; }
  .result-msg { font-size: 1.4rem; font-weight: 800; }
  .result-stars { font-size: 1.6rem; color: #f39c12; letter-spacing: 4px; }
  .result-actions { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
  .btn-result { background: #3498db; border: none; border-radius: 10px; padding: 12px 24px; color: #fff; font-size: 0.95rem; font-weight: 700; cursor: pointer; transition: background 0.15s; }
  .btn-result:hover { background: #2980b9; }
  .btn-result-back { background: #333; }
  .btn-result-back:hover { background: #444; }
`;
document.head.appendChild(style);

// ── Boot ───────────────────────────────────────────────────────────────────
showMenu();

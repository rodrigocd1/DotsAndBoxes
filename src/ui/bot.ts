import { GameState } from "../state/game-state";
import { Line } from "../models/line";
import { applyMove } from "../services/move";
import { getAvailableLines } from "../queries/lines";
import { boxEdgeKeys, boxKeyFromTopLeft } from "../models/box";
import { dot } from "../models/dot";
import { t } from "./i18n";

export type BotDifficulty =
  | "muito-facil"
  | "facil"
  | "medio"
  | "dificil"
  | "muito-dificil"
  | "impossivel"
  | "impulsivo";

const DIFF_I18N_KEYS: Record<BotDifficulty, string> = {
  "muito-facil": "diff_muito_facil",
  facil: "diff_facil",
  medio: "diff_medio",
  dificil: "diff_dificil",
  "muito-dificil": "diff_muito_dificil",
  impossivel: "diff_impossivel",
  impulsivo: "diff_impulsivo",
};

export function getDiffLabel(diff: BotDifficulty): string {
  return t(DIFF_I18N_KEYS[diff]);
}

export const BOT_DIFFICULTIES: BotDifficulty[] = [
  "muito-facil", "facil", "medio", "dificil", "muito-dificil", "impossivel", "impulsivo",
];

function randomLine(lines: readonly Line[]): Line {
  return lines[Math.floor(Math.random() * lines.length)] as Line;
}

function sidesCount(state: GameState, topLeftRow: number, topLeftCol: number): number {
  const keys = boxEdgeKeys(dot(topLeftRow, topLeftCol));
  return keys.filter((k) => state.lines[k]?.ownerId !== null).length;
}

function winningMoves(state: GameState, lines: readonly Line[]): Line[] {
  return lines.filter((line) =>
    adjacentBoxes(state, line).some(([r, c]) => sidesCount(state, r, c) === 3),
  );
}

function safeMoves(state: GameState, lines: readonly Line[]): Line[] {
  return lines.filter((line) =>
    !adjacentBoxes(state, line).some(([r, c]) => sidesCount(state, r, c) === 2),
  );
}

function adjacentBoxes(state: GameState, line: Line): [number, number][] {
  const candidates: [number, number][] = [];
  const { from, to } = line;
  const isHorizontal = from.row === to.row;

  if (isHorizontal) {
    candidates.push([from.row - 1, from.col], [from.row, from.col]);
  } else {
    candidates.push([from.row, from.col - 1], [from.row, from.col]);
  }

  return candidates.filter(([r, c]) =>
    r >= 0 &&
    c >= 0 &&
    state.boxes[boxKeyFromTopLeft(dot(r, c))] !== undefined,
  );
}

function evaluate(state: GameState, botId: string): number {
  const bot = state.players.find((p) => p.id === botId);
  const opp = state.players.find((p) => p.id !== botId);
  return (bot?.score ?? 0) - (opp?.score ?? 0);
}

function minimax(
  state: GameState,
  botId: string,
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean,
): number {
  if (state.status === "finished" || depth === 0) {
    return evaluate(state, botId);
  }

  const lines = getAvailableLines(state);
  if (lines.length === 0) return evaluate(state, botId);

  const sorted = [...lines].sort((a, b) => {
    const aWins = adjacentBoxes(state, a).some(([r, c]) => sidesCount(state, r, c) === 3) ? 1 : 0;
    const bWins = adjacentBoxes(state, b).some(([r, c]) => sidesCount(state, r, c) === 3) ? 1 : 0;
    return bWins - aWins;
  });

  if (maximizing) {
    let best = -Infinity;
    for (const line of sorted) {
      const result = applyMove(state, line);
      if (!result.ok) continue;
      const nextMaximizing = result.value.currentPlayerId === botId;
      const val = minimax(result.value, botId, depth - 1, alpha, beta, nextMaximizing);
      best = Math.max(best, val);
      alpha = Math.max(alpha, val);
      if (beta <= alpha) break;
    }
    return best;
  }

  let best = Infinity;
  for (const line of sorted) {
    const result = applyMove(state, line);
    if (!result.ok) continue;
    const nextMaximizing = result.value.currentPlayerId === botId;
    const val = minimax(result.value, botId, depth - 1, alpha, beta, nextMaximizing);
    best = Math.min(best, val);
    beta = Math.min(beta, val);
    if (beta <= alpha) break;
  }
  return best;
}

function bestMinimaxMove(state: GameState, botId: string, depth: number): Line {
  const lines = getAvailableLines(state);
  let bestLine = lines[0] as Line;
  let bestVal = -Infinity;

  for (const line of lines) {
    const result = applyMove(state, line);
    if (!result.ok) continue;
    const nextMax = result.value.currentPlayerId === botId;
    const val = minimax(result.value, botId, depth - 1, -Infinity, Infinity, nextMax);
    if (val > bestVal) {
      bestVal = val;
      bestLine = line;
    }
  }
  return bestLine;
}

export function chooseBotMove(state: GameState, difficulty: BotDifficulty): Line {
  const available = getAvailableLines(state);
  if (available.length === 0) throw new Error("Sem movimentos disponiveis");

  const botId = state.currentPlayerId;

  switch (difficulty) {
    case "muito-facil":
      return randomLine(available);

    case "facil": {
      const wins = winningMoves(state, available);
      if (wins.length > 0 && Math.random() < 0.5) return randomLine(wins);
      return randomLine(available);
    }

    case "medio": {
      const wins = winningMoves(state, available);
      if (wins.length > 0) return randomLine(wins);
      const safe = safeMoves(state, available);
      return safe.length > 0 ? randomLine(safe) : randomLine(available);
    }

    case "dificil":
      return bestMinimaxMove(state, botId, 3);

    case "muito-dificil":
      return bestMinimaxMove(state, botId, 6);

    case "impossivel": {
      const depth = Object.keys(state.boxes).length <= 9 ? 12 : 8;
      return bestMinimaxMove(state, botId, depth);
    }

    case "impulsivo":
      return Math.random() < 0.4
        ? bestMinimaxMove(state, botId, 8)
        : randomLine(available);
  }
}

export function botThinkDelay(difficulty: BotDifficulty): number {
  const delays: Record<BotDifficulty, number> = {
    "muito-facil": 300,
    facil: 400,
    medio: 500,
    dificil: 700,
    "muito-dificil": 900,
    impossivel: 1200,
    impulsivo: 200,
  };
  return delays[difficulty];
}

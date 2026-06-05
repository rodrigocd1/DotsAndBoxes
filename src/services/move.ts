import { Box, boxEdgeKeys, boxKeyFromTopLeft } from "../models/box";
import { Line, lineKey } from "../models/line";
import { Player } from "../models/player";
import { GameState } from "../state/game-state";
import { invalid, valid, ValidationResult } from "../validation/result";

export const MoveError = {
  GAME_FINISHED: "GAME_FINISHED",
  LINE_NOT_FOUND: "LINE_NOT_FOUND",
  LINE_ALREADY_TAKEN: "LINE_ALREADY_TAKEN",
} as const;
export type MoveErrorCode = (typeof MoveError)[keyof typeof MoveError];

/**
 * Aplica uma jogada de forma imutável. Retorna um novo GameState ou um erro
 * tipado. Nunca muta o estado de entrada.
 *
 * Regras aplicadas:
 *  - linha tem que existir no tabuleiro e estar livre;
 *  - quem fecha o 4o lado de um quadrado ganha o quadrado;
 *  - fechou >=1 quadrado => joga de novo; senão passa a vez;
 *  - todas as linhas jogadas => status "finished".
 */
export function applyMove(state: GameState, line: Line): ValidationResult<GameState> {
  if (state.status === "finished") {
    return invalid("A partida já terminou", MoveError.GAME_FINISHED);
  }

  const key = lineKey(line);
  const existing = state.lines[key];
  if (existing === undefined) {
    return invalid("Linha inexistente no tabuleiro", MoveError.LINE_NOT_FOUND);
  }
  if (existing.ownerId !== null) {
    return invalid("Linha já foi jogada", MoveError.LINE_ALREADY_TAKEN);
  }

  const playerId = state.currentPlayerId;

  const nextLines: Record<string, Line> = {
    ...state.lines,
    [key]: { ...existing, ownerId: playerId },
  };

  const nextBoxes: Record<string, Box> = { ...state.boxes };
  let completed = 0;
  for (const box of Object.values(state.boxes)) {
    if (box.ownerId !== null) continue;
    const edges = boxEdgeKeys(box.topLeft);
    const allClaimed = edges.every((edgeKey) => {
      const edge = nextLines[edgeKey];
      return edge !== undefined && edge.ownerId !== null;
    });
    if (allClaimed) {
      nextBoxes[boxKeyFromTopLeft(box.topLeft)] = { ...box, ownerId: playerId };
      completed += 1;
    }
  }

  const nextPlayers: Player[] = state.players.map((p) =>
    p.id === playerId ? { ...p, score: p.score + completed } : { ...p },
  );

  const allLinesClaimed = Object.values(nextLines).every((l) => l.ownerId !== null);
  const status: GameState["status"] = allLinesClaimed ? "finished" : "playing";

  const currentPlayerId =
    status === "finished" || completed > 0
      ? playerId
      : nextPlayerId(state.players, playerId);

  return valid({
    ...state,
    lines: nextLines,
    boxes: nextBoxes,
    players: nextPlayers,
    currentPlayerId,
    status,
  });
}

function nextPlayerId(players: readonly Player[], currentId: string): string {
  const idx = players.findIndex((p) => p.id === currentId);
  const nextIdx = (idx + 1) % players.length;
  // players nunca é vazio em uma partida válida
  return (players[nextIdx] as Player).id;
}

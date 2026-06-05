import { boxKeyFromTopLeft, Box } from "../models/box";
import { dot } from "../models/dot";
import { Line, lineKey, makeLine } from "../models/line";
import { Player } from "../models/player";
import { GameState } from "../state/game-state";

export const MIN_GRID_SIZE = 2;

/**
 * Inicializa o estado da partida com todas as linhas e quadrados (densos),
 * todos sem dono. O primeiro jogador da lista começa.
 *
 * @param gridSize quantidade de PONTOS por lado (ex: 5 => 4x4 quadrados)
 */
export function createBoard(gridSize: number, players: readonly Player[]): GameState {
  if (gridSize < MIN_GRID_SIZE) {
    throw new RangeError(`gridSize deve ser >= ${MIN_GRID_SIZE}`);
  }
  if (players.length < 2) {
    throw new RangeError("É necessário ao menos 2 jogadores");
  }

  const lines: Record<string, Line> = {};
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize - 1; c++) {
      const line = makeLine(dot(r, c), dot(r, c + 1));
      lines[lineKey(line)] = line;
    }
  }
  for (let r = 0; r < gridSize - 1; r++) {
    for (let c = 0; c < gridSize; c++) {
      const line = makeLine(dot(r, c), dot(r + 1, c));
      lines[lineKey(line)] = line;
    }
  }

  const boxes: Record<string, Box> = {};
  for (let r = 0; r < gridSize - 1; r++) {
    for (let c = 0; c < gridSize - 1; c++) {
      const box: Box = { topLeft: dot(r, c), ownerId: null };
      boxes[boxKeyFromTopLeft(box.topLeft)] = box;
    }
  }

  // players.length >= 2 garantido acima
  const firstPlayer = players[0] as Player;

  return {
    gridSize,
    players: players.map((p) => ({ ...p, score: 0 })),
    lines,
    boxes,
    currentPlayerId: firstPlayer.id,
    status: "playing",
  };
}

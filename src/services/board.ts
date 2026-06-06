import { boxKeyFromTopLeft, Box } from "../models/box";
import { dot, Dot } from "../models/dot";
import { Line, lineKey, makeLine } from "../models/line";
import { Player } from "../models/player";
import { GameState } from "../state/game-state";
import { MIN_GRID_SIZE } from "../config/game-constants";

export { MIN_GRID_SIZE } from "../config/game-constants";

export interface BoardCell {
  readonly x: number;
  readonly y: number;
}

export interface SparseBoardConfig {
  readonly width: number;
  readonly height: number;
  readonly cells: readonly BoardCell[];
}

/**
 * Inicializa o estado da partida com todas as linhas e quadrados (densos),
 * todos sem dono. O primeiro jogador da lista comeca.
 *
 * @param gridSize quantidade de PONTOS por lado (ex: 5 => 4x4 quadrados)
 */
export function createBoard(gridSize: number, players: readonly Player[]): GameState {
  if (gridSize < MIN_GRID_SIZE) {
    throw new RangeError(`gridSize deve ser >= ${MIN_GRID_SIZE}`);
  }
  validatePlayers(players);

  const lines: Record<string, Line> = {};
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize - 1; c++) {
      addLine(lines, dot(r, c), dot(r, c + 1));
    }
  }
  for (let r = 0; r < gridSize - 1; r++) {
    for (let c = 0; c < gridSize; c++) {
      addLine(lines, dot(r, c), dot(r + 1, c));
    }
  }

  const boxes: Record<string, Box> = {};
  for (let r = 0; r < gridSize - 1; r++) {
    for (let c = 0; c < gridSize - 1; c++) {
      const box: Box = { topLeft: dot(r, c), ownerId: null };
      boxes[boxKeyFromTopLeft(box.topLeft)] = box;
    }
  }

  return buildGameState(gridSize, gridSize, lines, boxes, players);
}

/**
 * Inicializa um tabuleiro esparso a partir de celulas ativas.
 * `width` e `height` sao contagens de celulas, nao de pontos.
 */
export function createBoardFromCells(
  config: SparseBoardConfig,
  players: readonly Player[],
): GameState {
  const { width, height, cells } = config;
  if (width < 1 || height < 1) {
    throw new RangeError("width e height devem ser >= 1");
  }
  if (cells.length === 0) {
    throw new RangeError("E necessario ao menos 1 celula ativa");
  }
  validatePlayers(players);

  const lines: Record<string, Line> = {};
  const boxes: Record<string, Box> = {};

  for (const cell of cells) {
    if (cell.x < 0 || cell.x >= width || cell.y < 0 || cell.y >= height) {
      throw new RangeError(`Celula fora do limite: (${cell.x}, ${cell.y})`);
    }

    const topLeft = dot(cell.y, cell.x);
    boxes[boxKeyFromTopLeft(topLeft)] = { topLeft, ownerId: null };
    addLine(lines, dot(cell.y, cell.x), dot(cell.y, cell.x + 1));
    addLine(lines, dot(cell.y + 1, cell.x), dot(cell.y + 1, cell.x + 1));
    addLine(lines, dot(cell.y, cell.x), dot(cell.y + 1, cell.x));
    addLine(lines, dot(cell.y, cell.x + 1), dot(cell.y + 1, cell.x + 1));
  }

  return buildGameState(height + 1, width + 1, lines, boxes, players);
}

function addLine(lines: Record<string, Line>, from: Dot, to: Dot): void {
  const line = makeLine(from, to);
  lines[lineKey(line)] = line;
}

function validatePlayers(players: readonly Player[]): void {
  if (players.length < 2) {
    throw new RangeError("E necessario ao menos 2 jogadores");
  }
}

function buildGameState(
  gridRows: number,
  gridCols: number,
  lines: Record<string, Line>,
  boxes: Record<string, Box>,
  players: readonly Player[],
): GameState {
  const firstPlayer = players[0] as Player;

  return {
    gridSize: Math.max(gridRows, gridCols),
    gridRows,
    gridCols,
    players: players.map((p) => ({ ...p, score: 0 })),
    lines,
    boxes,
    currentPlayerId: firstPlayer.id,
    status: "playing",
  };
}

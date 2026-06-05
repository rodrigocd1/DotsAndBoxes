import { getWinner, isGameOver } from "./end-game";
import { createBoard } from "./board";
import { createPlayer } from "../models/player";
import { GameState } from "../state/game-state";
import { Line } from "../models/line";
import { Box } from "../models/box";

const p1 = createPlayer("p1", "Rodrigo", "#032D60");
const p2 = createPlayer("p2", "Michaell", "#FFD500");

function craftFinished(boxOwners: Record<string, string>): GameState {
  const base = createBoard(3, [p1, p2]); // 4 boxes, 12 linhas
  const lines: Record<string, Line> = {};
  for (const [k, l] of Object.entries(base.lines)) lines[k] = { ...l, ownerId: "p1" };
  const boxes: Record<string, Box> = {};
  for (const [k, b] of Object.entries(base.boxes)) {
    boxes[k] = { ...b, ownerId: boxOwners[k] ?? "p1" };
  }
  return { ...base, lines, boxes, status: "finished" };
}

describe("getWinner", () => {
  it("retorna null se o jogo não acabou", () => {
    expect(getWinner(createBoard(3, [p1, p2]))).toBeNull();
  });

  it("retorna 'draw' quando há empate no topo", () => {
    const state = craftFinished({ "b-0-0": "p1", "b-0-1": "p1", "b-1-0": "p2", "b-1-1": "p2" });
    expect(getWinner(state)).toBe("draw");
  });

  it("retorna o jogador com mais quadrados", () => {
    const state = craftFinished({ "b-0-0": "p1", "b-0-1": "p1", "b-1-0": "p1", "b-1-1": "p2" });
    expect(getWinner(state)).toMatchObject({ id: "p1" });
  });
});

describe("isGameOver", () => {
  it("é falso no início e verdadeiro com todas as linhas jogadas", () => {
    expect(isGameOver(createBoard(3, [p1, p2]))).toBe(false);
    const finished = craftFinished({});
    expect(isGameOver(finished)).toBe(true);
  });
});

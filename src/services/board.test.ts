import { createBoard, MIN_GRID_SIZE } from "./board";
import { getScores } from "./scoring";
import { createPlayer } from "../models/player";

const p1 = createPlayer("p1", "Rodrigo", "#032D60");
const p2 = createPlayer("p2", "Michaell", "#FFD500");

describe("createBoard", () => {
  it("cria a quantidade correta de linhas e quadrados para 5x5 pontos", () => {
    const state = createBoard(5, [p1, p2]);
    // horizontais: 5*4=20, verticais: 4*5=20 => 40 linhas; quadrados: 4*4=16
    expect(Object.keys(state.lines)).toHaveLength(40);
    expect(Object.keys(state.boxes)).toHaveLength(16);
  });

  it("cria 4 linhas e 1 quadrado para o menor tabuleiro (2x2)", () => {
    const state = createBoard(2, [p1, p2]);
    expect(Object.keys(state.lines)).toHaveLength(4);
    expect(Object.keys(state.boxes)).toHaveLength(1);
  });

  it("começa com o primeiro jogador, status playing e placar zerado", () => {
    const state = createBoard(3, [p1, p2]);
    expect(state.currentPlayerId).toBe("p1");
    expect(state.status).toBe("playing");
    expect(getScores(state)).toEqual({ p1: 0, p2: 0 });
    expect(state.players.every((p) => p.score === 0)).toBe(true);
  });

  it("rejeita grid menor que o mínimo e menos de 2 jogadores", () => {
    expect(() => createBoard(MIN_GRID_SIZE - 1, [p1, p2])).toThrow(RangeError);
    expect(() => createBoard(3, [p1])).toThrow(RangeError);
  });
});

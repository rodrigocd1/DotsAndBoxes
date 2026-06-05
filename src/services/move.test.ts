import { applyMove, MoveError } from "./move";
import { createBoard } from "./board";
import { getScores } from "./scoring";
import { getWinner, isGameOver } from "./end-game";
import { createPlayer } from "../models/player";
import { makeLine, lineKey, Line } from "../models/line";
import { dot } from "../models/dot";
import { GameState } from "../state/game-state";
import { Box } from "../models/box";

const p1 = createPlayer("p1", "Rodrigo", "#032D60");
const p2 = createPlayer("p2", "Michaell", "#FFD500");

function unwrap(result: ReturnType<typeof applyMove>): GameState {
  if (!result.ok) throw new Error(`Esperava sucesso, veio erro: ${result.error}`);
  return result.value;
}

describe("applyMove - validações", () => {
  it("rejeita linha já jogada", () => {
    let state = createBoard(3, [p1, p2]);
    state = unwrap(applyMove(state, makeLine(dot(0, 0), dot(0, 1))));
    const result = applyMove(state, makeLine(dot(0, 0), dot(0, 1)));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe(MoveError.LINE_ALREADY_TAKEN);
  });

  it("rejeita linha inexistente no tabuleiro", () => {
    const state = createBoard(2, [p1, p2]);
    const result = applyMove(state, makeLine(dot(5, 5), dot(5, 6)));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe(MoveError.LINE_NOT_FOUND);
  });
});

describe("applyMove - turnos", () => {
  it("passa a vez quando nenhum quadrado é fechado", () => {
    const state = createBoard(3, [p1, p2]);
    const next = unwrap(applyMove(state, makeLine(dot(0, 0), dot(0, 1))));
    expect(next.currentPlayerId).toBe("p2");
  });

  it("mantém a vez quem fecha um quadrado e pontua", () => {
    // 3x3 pontos. Box (0,0) bordas: h-0-0, h-1-0, v-0-0, v-0-1
    let state = createBoard(3, [p1, p2]);
    state = unwrap(applyMove(state, makeLine(dot(0, 0), dot(0, 1)))); // p1 -> p2
    state = unwrap(applyMove(state, makeLine(dot(1, 0), dot(1, 1)))); // p2 -> p1
    state = unwrap(applyMove(state, makeLine(dot(0, 0), dot(1, 0)))); // p1 -> p2
    state = unwrap(applyMove(state, makeLine(dot(0, 1), dot(1, 1)))); // p2 fecha box (0,0)
    expect(getScores(state).p2).toBe(1);
    expect(state.currentPlayerId).toBe("p2"); // joga de novo
    expect(state.boxes["b-0-0"]?.ownerId).toBe("p2");
  });
});

describe("applyMove - fechar 2 quadrados com 1 linha", () => {
  it("conta +2 e mantém a vez", () => {
    // 3x3 pontos. A linha v-0-1 faz fronteira entre box (0,0) e box (0,1).
    const base = createBoard(3, [p1, p2]);
    const filler = "p2";
    const sharedKey = lineKey(makeLine(dot(0, 1), dot(1, 1))); // v-0-1
    const lines: Record<string, Line> = {};
    for (const [k, l] of Object.entries(base.lines)) {
      // tudo de p1, exceto a linha compartilhada (livre) e linhas fora dos 2 boxes
      const ownsBox0 = ["h-0-0", "h-1-0", "v-0-0"].includes(k);
      const ownsBox1 = ["h-0-1", "h-1-1", "v-0-2"].includes(k);
      lines[k] = (ownsBox0 || ownsBox1) ? { ...l, ownerId: filler } : { ...l };
    }
    const crafted: GameState = { ...base, lines, currentPlayerId: "p1" };
    const next = unwrap(applyMove(crafted, makeLine(dot(0, 1), dot(1, 1))));
    expect(next.boxes["b-0-0"]?.ownerId).toBe("p1");
    expect(next.boxes["b-0-1"]?.ownerId).toBe("p1");
    expect(getScores(next).p1).toBe(2);
    expect(next.lines[sharedKey]?.ownerId).toBe("p1");
    expect(next.currentPlayerId).toBe("p1");
  });
});

describe("partida completa 2x2", () => {
  it("termina ao fechar o único quadrado e define o vencedor", () => {
    let state = createBoard(2, [p1, p2]);
    state = unwrap(applyMove(state, makeLine(dot(0, 0), dot(0, 1)))); // p1
    state = unwrap(applyMove(state, makeLine(dot(1, 0), dot(1, 1)))); // p2
    state = unwrap(applyMove(state, makeLine(dot(0, 0), dot(1, 0)))); // p1
    state = unwrap(applyMove(state, makeLine(dot(0, 1), dot(1, 1)))); // p2 fecha
    expect(isGameOver(state)).toBe(true);
    expect(state.status).toBe("finished");
    expect(getWinner(state)).toMatchObject({ id: "p2" });
  });

  it("rejeita jogada após o fim", () => {
    let state = createBoard(2, [p1, p2]);
    state = unwrap(applyMove(state, makeLine(dot(0, 0), dot(0, 1))));
    state = unwrap(applyMove(state, makeLine(dot(1, 0), dot(1, 1))));
    state = unwrap(applyMove(state, makeLine(dot(0, 0), dot(1, 0))));
    state = unwrap(applyMove(state, makeLine(dot(0, 1), dot(1, 1))));
    const result = applyMove(state, makeLine(dot(0, 0), dot(0, 1)));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe(MoveError.GAME_FINISHED);
  });
});

describe("imutabilidade", () => {
  it("não muta o estado de entrada", () => {
    const state = createBoard(3, [p1, p2]);
    const snapshot = JSON.stringify(state);
    applyMove(state, makeLine(dot(0, 0), dot(0, 1)));
    expect(JSON.stringify(state)).toBe(snapshot);
  });
});

describe("consistência placar x boxes", () => {
  it("player.score sempre espelha getScores", () => {
    let state = createBoard(3, [p1, p2]);
    const moves = [
      makeLine(dot(0, 0), dot(0, 1)),
      makeLine(dot(1, 0), dot(1, 1)),
      makeLine(dot(0, 0), dot(1, 0)),
      makeLine(dot(0, 1), dot(1, 1)),
    ];
    for (const m of moves) state = unwrap(applyMove(state, m));
    const scores = getScores(state);
    for (const player of state.players) {
      expect(player.score).toBe(scores[player.id]);
    }
  });
});

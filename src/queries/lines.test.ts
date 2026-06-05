import { getAvailableLines, getAllLines, isLineTaken } from "./lines";
import { createBoard } from "../services/board";
import { applyMove } from "../services/move";
import { createPlayer } from "../models/player";
import { makeLine } from "../models/line";
import { dot } from "../models/dot";

const p1 = createPlayer("p1", "Rodrigo", "#032D60");
const p2 = createPlayer("p2", "Michaell", "#FFD500");

describe("queries de linhas", () => {
  it("getAvailableLines diminui após cada jogada", () => {
    const state = createBoard(3, [p1, p2]);
    const before = getAvailableLines(state).length;
    expect(before).toBe(getAllLines(state).length);
    const result = applyMove(state, makeLine(dot(0, 0), dot(0, 1)));
    if (!result.ok) throw new Error(result.error);
    expect(getAvailableLines(result.value).length).toBe(before - 1);
  });

  it("isLineTaken reflete a posse", () => {
    const state = createBoard(3, [p1, p2]);
    const line = makeLine(dot(0, 0), dot(0, 1));
    expect(isLineTaken(state, line)).toBe(false);
    const result = applyMove(state, line);
    if (!result.ok) throw new Error(result.error);
    expect(isLineTaken(result.value, line)).toBe(true);
  });
});

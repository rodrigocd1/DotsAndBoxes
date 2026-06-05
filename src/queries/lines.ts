import { Box } from "../models/box";
import { Line, lineKey } from "../models/line";
import { GameState } from "../state/game-state";

export function getAllLines(state: GameState): Line[] {
  return Object.values(state.lines);
}

/** Linhas ainda jogáveis. Base para qualquer IA e para a renderização. */
export function getAvailableLines(state: GameState): Line[] {
  return Object.values(state.lines).filter((line) => line.ownerId === null);
}

export function getAllBoxes(state: GameState): Box[] {
  return Object.values(state.boxes);
}

export function isLineTaken(state: GameState, line: Line): boolean {
  const entry = state.lines[lineKey(line)];
  return entry !== undefined && entry.ownerId !== null;
}

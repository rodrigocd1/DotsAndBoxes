import { Player } from "../models/player";
import { GameState } from "../state/game-state";
import { getScores } from "./scoring";

export function isGameOver(state: GameState): boolean {
  return Object.values(state.lines).every((line) => line.ownerId !== null);
}

/**
 * Retorna o vencedor, "draw" em caso de empate no topo, ou null se o jogo
 * ainda não terminou.
 */
export function getWinner(state: GameState): Player | "draw" | null {
  if (!isGameOver(state)) {
    return null;
  }
  const scores = getScores(state);
  let best: Player | null = null;
  let bestScore = -1;
  let tie = false;

  for (const player of state.players) {
    const s = scores[player.id] ?? 0;
    if (s > bestScore) {
      bestScore = s;
      best = player;
      tie = false;
    } else if (s === bestScore) {
      tie = true;
    }
  }

  return tie ? "draw" : best;
}

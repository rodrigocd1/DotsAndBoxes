import { GameState } from "../state/game-state";

/**
 * Pontuação autoritativa, derivada da posse dos quadrados (fonte única de
 * verdade). `player.score` é apenas um cache espelhando este cálculo.
 */
export function getScores(state: GameState): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const player of state.players) {
    scores[player.id] = 0;
  }
  for (const box of Object.values(state.boxes)) {
    const owner = box.ownerId;
    if (owner === null) continue;
    const current = scores[owner];
    if (current !== undefined) {
      scores[owner] = current + 1;
    }
  }
  return scores;
}

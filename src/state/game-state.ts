import { Box } from "../models/box";
import { Line } from "../models/line";
import { Player } from "../models/player";

export type GameStatus = "playing" | "finished";

/**
 * Estado completo e imutável de uma partida.
 * `lines` e `boxes` são dicionários indexados por chave (O(1) para checagens).
 * Todas as linhas e quadrados existem desde o início (densos), com ownerId null.
 */
export interface GameState {
  readonly gridSize: number;
  readonly players: readonly Player[];
  readonly lines: Readonly<Record<string, Line>>;
  readonly boxes: Readonly<Record<string, Box>>;
  readonly currentPlayerId: string;
  readonly status: GameStatus;
}

import { GameState } from "../state/game-state";
import { createBoard } from "../services/board";
import { createPlayer } from "../models/player";
import { applyMove } from "../services/move";
import { Line } from "../models/line";
import { getAvailableLines } from "../queries/lines";

export interface PlayerConfig {
  name: string;
  color: string;
}

export interface GameConfig {
  gridSize: number;
  players: [PlayerConfig, PlayerConfig, ...PlayerConfig[]];
}

export class GameController {
  private state: GameState;

  constructor(config: GameConfig) {
    this.state = this.buildState(config);
  }

  private buildState(config: GameConfig): GameState {
    const players = config.players.map((p, i) =>
      createPlayer(`p${i + 1}`, p.name, p.color),
    );
    return createBoard(config.gridSize, players);
  }

  getState(): GameState {
    return this.state;
  }

  playLine(line: Line): boolean {
    const result = applyMove(this.state, line);
    if (result.ok) {
      this.state = result.value;
      return true;
    }
    return false;
  }

  reset(config: GameConfig): void {
    this.state = this.buildState(config);
  }

  getAvailableLines(): readonly Line[] {
    return getAvailableLines(this.state);
  }
}

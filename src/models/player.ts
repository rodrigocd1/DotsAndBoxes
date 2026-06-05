export interface Player {
  readonly id: string;
  readonly name: string;
  readonly color: string;
  readonly score: number;
}

export function createPlayer(id: string, name: string, color: string): Player {
  return { id, name, color, score: 0 };
}

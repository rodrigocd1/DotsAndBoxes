/**
 * Ponto da grade. A grade tem `gridSize` x `gridSize` pontos.
 * Coordenadas 0-indexadas: (row, col).
 */
export interface Dot {
  readonly row: number;
  readonly col: number;
}

export function dot(row: number, col: number): Dot {
  return { row, col };
}

export function dotsEqual(a: Dot, b: Dot): boolean {
  return a.row === b.row && a.col === b.col;
}

export function dotKey(d: Dot): string {
  return `${d.row}:${d.col}`;
}

/** Dois pontos são adjacentes se diferem em exatamente 1 na horizontal OU vertical. */
export function areAdjacent(a: Dot, b: Dot): boolean {
  const sameRow = a.row === b.row && Math.abs(a.col - b.col) === 1;
  const sameCol = a.col === b.col && Math.abs(a.row - b.row) === 1;
  return sameRow || sameCol;
}

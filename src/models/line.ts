import { Dot, areAdjacent, dot } from "./dot";

export type LineOrientation = "horizontal" | "vertical";

/**
 * Linha entre dois pontos adjacentes.
 * `from` é sempre o ponto canônico (mais acima/à esquerda), garantindo que
 * a chave (`lineKey`) seja estável independentemente da ordem de clique.
 * `ownerId` = null enquanto a linha não foi jogada.
 */
export interface Line {
  readonly from: Dot;
  readonly to: Dot;
  readonly ownerId: string | null;
}

export function orientationOf(line: Line): LineOrientation {
  return line.from.row === line.to.row ? "horizontal" : "vertical";
}

/**
 * Cria uma linha canônica entre dois pontos adjacentes.
 * Lança RangeError se os pontos não forem adjacentes (violação de pré-condição:
 * a UI só constrói linhas entre pontos vizinhos do tabuleiro).
 */
export function makeLine(a: Dot, b: Dot, ownerId: string | null = null): Line {
  if (!areAdjacent(a, b)) {
    throw new RangeError(
      `Pontos não adjacentes: (${a.row},${a.col}) e (${b.row},${b.col})`,
    );
  }
  const aFirst = a.row < b.row || (a.row === b.row && a.col < b.col);
  const first = aFirst ? a : b;
  const second = aFirst ? b : a;
  return { from: dot(first.row, first.col), to: dot(second.row, second.col), ownerId };
}

/** Chave única e estável: `h-row-col` (horizontal) ou `v-row-col` (vertical). */
export function lineKey(line: Line): string {
  const prefix = line.from.row === line.to.row ? "h" : "v";
  return `${prefix}-${line.from.row}-${line.from.col}`;
}

export function lineKeyFromDots(a: Dot, b: Dot): string {
  return lineKey(makeLine(a, b));
}

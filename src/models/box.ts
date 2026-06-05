import { Dot, dot } from "./dot";
import { lineKey, makeLine } from "./line";

/**
 * Quadrado da grade, identificado pelo ponto superior-esquerdo.
 * `ownerId` = null enquanto não fechado.
 */
export interface Box {
  readonly topLeft: Dot;
  readonly ownerId: string | null;
}

export function boxKeyFromTopLeft(topLeft: Dot): string {
  return `b-${topLeft.row}-${topLeft.col}`;
}

export function boxKey(box: Box): string {
  return boxKeyFromTopLeft(box.topLeft);
}

/**
 * As 4 chaves de linha que cercam o quadrado em `topLeft`:
 * [topo, base, esquerda, direita].
 */
export function boxEdgeKeys(topLeft: Dot): readonly [string, string, string, string] {
  const r = topLeft.row;
  const c = topLeft.col;
  return [
    lineKey(makeLine(dot(r, c), dot(r, c + 1))),
    lineKey(makeLine(dot(r + 1, c), dot(r + 1, c + 1))),
    lineKey(makeLine(dot(r, c), dot(r + 1, c))),
    lineKey(makeLine(dot(r, c + 1), dot(r + 1, c + 1))),
  ];
}

import { GameState } from "../state/game-state";
import { Line, lineKey, makeLine } from "../models/line";
import { dot } from "../models/dot";

const CELL = 80;
const PAD = 50;
const DOT_R = 7;
const HIT = 24;
export const TOUCH_HIT = 38;

function dotX(col: number): number {
  return PAD + col * CELL;
}
function dotY(row: number): number {
  return PAD + row * CELL;
}

function cssVar(name: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

function boardPalette() {
  return {
    bg: cssVar("--bg-2", "#ffffff"),
    emptyLine: cssVar("--border-strong", "#d1d5db"),
    hoverLine: cssVar("--ui-accent", "#64748b"),
    dot: cssVar("--ui-accent-border", "#334155"),
  };
}

function playerColor(state: GameState, ownerId: string | null): string {
  if (!ownerId) return "#ccc";
  return state.players.find((p) => p.id === ownerId)?.color ?? "#888";
}

function strokeSegment(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  width: number,
  outlineColor: string,
): void {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.strokeStyle = outlineColor;
  ctx.lineWidth = width + 2.5;
  ctx.stroke();

  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

export function canvasSize(gridSize: number): { width: number; height: number } {
  const size = PAD * 2 + (gridSize - 1) * CELL;
  return { width: size, height: size };
}

export function render(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  hoverLine: Line | null,
  _teamMode = false,
): void {
  const { gridSize } = state;
  const { width, height } = canvasSize(gridSize);
  const palette = boardPalette();

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  // Boxes preenchidas
  for (const box of Object.values(state.boxes)) {
    if (!box.ownerId) continue;
    const color = playerColor(state, box.ownerId);
    const x = dotX(box.topLeft.col);
    const y = dotY(box.topLeft.row);

    ctx.fillStyle = color + "33";
    ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2);

    const player = state.players.find((p) => p.id === box.ownerId);
    if (player) {
      ctx.fillStyle = color + "bb";
      ctx.font = `bold ${Math.floor(CELL * 0.35)}px system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        player.name[0]?.toUpperCase() ?? "?",
        x + CELL / 2,
        y + CELL / 2,
      );
    }
  }

  // Linhas
  const currentPlayer = state.players.find(
    (p) => p.id === state.currentPlayerId,
  );

  for (const line of Object.values(state.lines)) {
    const isHover = hoverLine !== null && lineKey(hoverLine) === lineKey(line);
    const x1 = dotX(line.from.col);
    const y1 = dotY(line.from.row);
    const x2 = dotX(line.to.col);
    const y2 = dotY(line.to.row);

    if (line.ownerId !== null) {
      strokeSegment(ctx, x1, y1, x2, y2, playerColor(state, line.ownerId), 7.75, "rgba(0,0,0,0.36)");
    } else if (isHover) {
      strokeSegment(ctx, x1, y1, x2, y2, (currentPlayer?.color ?? palette.hoverLine) + "ee", 6.75, "rgba(0,0,0,0.28)");
    } else {
      strokeSegment(ctx, x1, y1, x2, y2, palette.emptyLine, 3.5, "rgba(0,0,0,0.16)");
    }
  }

  // Pontos
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      ctx.beginPath();
      ctx.arc(dotX(c), dotY(r), DOT_R, 0, Math.PI * 2);
      ctx.fillStyle = palette.dot;
      ctx.fill();
    }
  }
}

export function findLineAtPoint(
  state: GameState,
  x: number,
  y: number,
  hitRadius = HIT,
): Line | null {
  const { gridSize } = state;
  let closest: Line | null = null;
  let minDist = hitRadius;
  const alongPadding = Math.max(4, Math.round(hitRadius * 0.4));

  // Linhas horizontais
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize - 1; c++) {
      const lx1 = dotX(c);
      const lx2 = dotX(c + 1);
      const ly = dotY(r);
      if (x >= lx1 - alongPadding && x <= lx2 + alongPadding) {
        const dist = Math.abs(y - ly);
        if (dist < minDist) {
          minDist = dist;
          const key = lineKey(makeLine(dot(r, c), dot(r, c + 1)));
          closest = state.lines[key] ?? null;
        }
      }
    }
  }

  // Linhas verticais
  for (let r = 0; r < gridSize - 1; r++) {
    for (let c = 0; c < gridSize; c++) {
      const ly1 = dotY(r);
      const ly2 = dotY(r + 1);
      const lx = dotX(c);
      if (y >= ly1 - alongPadding && y <= ly2 + alongPadding) {
        const dist = Math.abs(x - lx);
        if (dist < minDist) {
          minDist = dist;
          const key = lineKey(makeLine(dot(r, c), dot(r + 1, c)));
          closest = state.lines[key] ?? null;
        }
      }
    }
  }

  return closest;
}

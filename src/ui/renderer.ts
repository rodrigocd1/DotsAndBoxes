import { Dot, dotKey } from "../models/dot";
import { GameState } from "../state/game-state";
import { Line, lineKey } from "../models/line";
import {
  BOARD_PADDING,
  CELL_SIZE,
  DOT_RADIUS,
  HIT_RADIUS,
} from "../config/game-constants";

function dotX(col: number): number {
  return BOARD_PADDING + col * CELL_SIZE;
}
function dotY(row: number): number {
  return BOARD_PADDING + row * CELL_SIZE;
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
    guidedLine: cssVar("--ui-accent", "#64748b"),
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

export function canvasSize(gridRows: number, gridCols = gridRows): { width: number; height: number } {
  const width = BOARD_PADDING * 2 + (gridCols - 1) * CELL_SIZE;
  const height = BOARD_PADDING * 2 + (gridRows - 1) * CELL_SIZE;
  return { width, height };
}

export function render(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  hoverLine: Line | null,
  guidedLine: Line | null,
  _teamMode = false,
): void {
  const { width, height } = canvasSize(state.gridRows, state.gridCols);
  const palette = boardPalette();

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  for (const box of Object.values(state.boxes)) {
    if (!box.ownerId) continue;
    const color = playerColor(state, box.ownerId);
    const x = dotX(box.topLeft.col);
    const y = dotY(box.topLeft.row);

    ctx.fillStyle = color + "33";
    ctx.fillRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2);

    const player = state.players.find((p) => p.id === box.ownerId);
    if (player) {
      ctx.fillStyle = color + "bb";
      ctx.font = `bold ${Math.floor(CELL_SIZE * 0.35)}px system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        player.name[0]?.toUpperCase() ?? "?",
        x + CELL_SIZE / 2,
        y + CELL_SIZE / 2,
      );
    }
  }

  const currentPlayer = state.players.find(
    (p) => p.id === state.currentPlayerId,
  );

  for (const line of Object.values(state.lines)) {
    const isHover = hoverLine !== null && lineKey(hoverLine) === lineKey(line);
    const isGuided = guidedLine !== null && lineKey(guidedLine) === lineKey(line);
    const x1 = dotX(line.from.col);
    const y1 = dotY(line.from.row);
    const x2 = dotX(line.to.col);
    const y2 = dotY(line.to.row);

    if (line.ownerId !== null) {
      strokeSegment(ctx, x1, y1, x2, y2, playerColor(state, line.ownerId), 7.75, "rgba(0,0,0,0.36)");
    } else if (isHover) {
      strokeSegment(ctx, x1, y1, x2, y2, (currentPlayer?.color ?? palette.hoverLine) + "ee", 6.75, "rgba(0,0,0,0.28)");
    } else if (isGuided) {
      strokeSegment(ctx, x1, y1, x2, y2, (currentPlayer?.color ?? palette.guidedLine) + "ee", 6.25, "rgba(245,158,11,0.30)");
    } else {
      strokeSegment(ctx, x1, y1, x2, y2, palette.emptyLine, 3.5, "rgba(0,0,0,0.16)");
    }
  }

  for (const point of collectDots(state)) {
    ctx.beginPath();
    ctx.arc(dotX(point.col), dotY(point.row), DOT_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = palette.dot;
    ctx.fill();
  }
}

export function findLineAtPoint(
  state: GameState,
  x: number,
  y: number,
  hitRadius = HIT_RADIUS,
): Line | null {
  let closest: Line | null = null;
  let minDist = hitRadius;
  const alongPadding = Math.max(4, Math.round(hitRadius * 0.4));

  for (const line of Object.values(state.lines)) {
    const x1 = dotX(line.from.col);
    const y1 = dotY(line.from.row);
    const x2 = dotX(line.to.col);
    const y2 = dotY(line.to.row);
    const horizontal = line.from.row === line.to.row;

    if (horizontal) {
      if (x >= x1 - alongPadding && x <= x2 + alongPadding) {
        const dist = Math.abs(y - y1);
        if (dist < minDist) {
          minDist = dist;
          closest = line;
        }
      }
      continue;
    }

    if (y >= y1 - alongPadding && y <= y2 + alongPadding) {
      const dist = Math.abs(x - x1);
      if (dist < minDist) {
        minDist = dist;
        closest = line;
      }
    }
  }

  return closest;
}

function collectDots(state: GameState): Dot[] {
  const unique = new Map<string, Dot>();
  for (const line of Object.values(state.lines)) {
    unique.set(dotKey(line.from), line.from);
    unique.set(dotKey(line.to), line.to);
  }
  return [...unique.values()];
}

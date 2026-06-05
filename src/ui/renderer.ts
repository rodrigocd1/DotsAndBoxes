import { GameState } from "../state/game-state";
import { Line, lineKey, makeLine } from "../models/line";
import { dot } from "../models/dot";

const CELL = 80;
const PAD = 50;
const DOT_R = 7;
const HIT = 24;

function dotX(col: number): number {
  return PAD + col * CELL;
}
function dotY(row: number): number {
  return PAD + row * CELL;
}

function playerColor(state: GameState, ownerId: string | null): string {
  if (!ownerId) return "#ccc";
  return state.players.find((p) => p.id === ownerId)?.color ?? "#888";
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

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
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

    ctx.beginPath();
    ctx.moveTo(dotX(line.from.col), dotY(line.from.row));
    ctx.lineTo(dotX(line.to.col), dotY(line.to.row));
    ctx.lineCap = "round";

    if (line.ownerId !== null) {
      ctx.strokeStyle = playerColor(state, line.ownerId);
      ctx.lineWidth = 7;
    } else if (isHover) {
      ctx.strokeStyle = (currentPlayer?.color ?? "#888") + "cc";
      ctx.lineWidth = 6;
    } else {
      ctx.strokeStyle = "#dde1e7";
      ctx.lineWidth = 3;
    }

    ctx.stroke();
  }

  // Pontos
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      ctx.beginPath();
      ctx.arc(dotX(c), dotY(r), DOT_R, 0, Math.PI * 2);
      ctx.fillStyle = "#2c3e50";
      ctx.fill();
    }
  }
}

export function findLineAtPoint(
  state: GameState,
  x: number,
  y: number,
): Line | null {
  const { gridSize } = state;
  let closest: Line | null = null;
  let minDist = HIT;

  // Linhas horizontais
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize - 1; c++) {
      const lx1 = dotX(c);
      const lx2 = dotX(c + 1);
      const ly = dotY(r);
      if (x >= lx1 - 4 && x <= lx2 + 4) {
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
      if (y >= ly1 - 4 && y <= ly2 + 4) {
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

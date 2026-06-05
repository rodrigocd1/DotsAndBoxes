/** Animated neon background — dark theme only */

export type StopBg = () => void;

// ── Paletas ───────────────────────────────────────────────────────────────
const L_COLORS = ["#00e5ff", "#22d3ee", "#38bdf8", "#3b82f6", "#818cf8"];
const R_COLORS = ["#a855f7", "#c026d3", "#ec4899", "#fb923c", "#f97316"];
const BG_DARK   = "#0c1120";

// ── Helpers de pseudo-aleatório determinístico ────────────────────────────
function prng(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function pickColor(colors: readonly string[], t: number): string {
  const i = Math.max(0, Math.min(colors.length - 1, Math.round(t * (colors.length - 1))));
  return colors[i]!;
}

// ── Desenho com glow ──────────────────────────────────────────────────────
function glowLine(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number,
  color: string, alpha: number,
) {
  if (alpha <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.6;
  ctx.lineCap = "round";
  ctx.shadowColor = color;
  ctx.shadowBlur = 16;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.shadowBlur = 5; ctx.lineWidth = 0.7; ctx.stroke();
  ctx.restore();
}

function glowDot(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, r: number, color: string, alpha: number,
) {
  if (alpha <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 14;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

// ── Estrela de 4 pontas (sparkle) ─────────────────────────────────────────
function drawStar(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, size: number, color: string, alpha: number,
) {
  if (alpha <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 20;
  ctx.beginPath();
  // 4-pointed star
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const tip = size;
    const shoulder = size * 0.08;
    const aL = angle - Math.PI / 8;
    const aR = angle + Math.PI / 8;
    if (i === 0) ctx.moveTo(x + Math.cos(angle) * tip, y + Math.sin(angle) * tip);
    else ctx.lineTo(x + Math.cos(angle) * tip, y + Math.sin(angle) * tip);
    ctx.lineTo(x + Math.cos(aR) * shoulder, y + Math.sin(aR) * shoulder);
    const next = angle + Math.PI / 2;
    ctx.lineTo(x + Math.cos(next) * tip, y + Math.sin(next) * tip);
    ctx.lineTo(x + Math.cos(aL + Math.PI / 2) * shoulder, y + Math.sin(aL + Math.PI / 2) * shoulder);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// ── Cluster de caixas neon ────────────────────────────────────────────────
interface Cluster {
  ox: number; oy: number;         // origem em pixels (relativo ao canvas)
  cols: number; rows: number;
  cell: number;
  colors: readonly string[];
  side: "left" | "right";
  fadeWidth: number;              // largura da zona de fade (px)
}

function drawCluster(ctx: CanvasRenderingContext2D, c: Cluster) {
  const { ox, oy, cols, rows, cell, colors, side, fadeWidth } = c;

  for (let r = 0; r <= rows; r++) {
    for (let col = 0; col <= cols; col++) {
      const x = ox + col * cell;
      const y = oy + r * cell;

      // Distância da borda de entrada: determina fade
      const distIn = side === "left" ? x - ox : ox + cols * cell - x;
      const edgeAlpha = Math.max(0, Math.min(1, distIn / fadeWidth));

      // Cor baseada em progressão horizontal
      const colorT = side === "left" ? 1 - col / cols : col / cols;
      const color = pickColor(colors, colorT);

      // Linhas horizontais (algumas faltando = caixas parciais)
      if (col < cols) {
        const seed = r * 97 + col * 13 + 1000;
        if (prng(seed) > 0.18) {
          glowLine(ctx, x, y, x + cell, y, color, edgeAlpha * 0.9);
        }
      }

      // Linhas verticais
      if (r < rows) {
        const seed = r * 53 + col * 31 + 2000;
        if (prng(seed) > 0.18) {
          glowLine(ctx, x, y, x, y + cell, color, edgeAlpha * 0.9);
        }
      }

      // Ponto na interseção
      if (edgeAlpha > 0.05) {
        glowDot(ctx, x, y, 2.8, color, edgeAlpha * 0.95);
      }
    }
  }
}

// ── Raios de luz nas arestas dos clusters ─────────────────────────────────
function drawCornerRay(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  angle: number, length: number, color: string, alpha: number,
) {
  const grd = ctx.createLinearGradient(x, y, x + Math.cos(angle) * length, y + Math.sin(angle) * length);
  grd.addColorStop(0, color);
  grd.addColorStop(1, "transparent");
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = grd;
  ctx.lineWidth = 1.5;
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
  ctx.stroke();
  ctx.restore();
}

// ── Interface principal ───────────────────────────────────────────────────
interface Sp {
  x: number; y: number; size: number; alpha: number;
  maxAlpha: number; speed: number; color: string; growing: boolean;
}

export function startBackground(insertBefore: Element): StopBg {
  const canvas = document.createElement("canvas");
  Object.assign(canvas.style, {
    position: "fixed", inset: "0", width: "100%", height: "100%",
    pointerEvents: "none", zIndex: "0",
  });
  insertBefore.parentElement!.insertBefore(canvas, insertBefore);

  const ctx = canvas.getContext("2d")!;
  const sparkles: Sp[] = [];
  let raf = 0;
  let stopped = false;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  // ── Gerar sparkles iniciais ──────────────────────────────────────────
  function spawnSparkle(w: number, h: number) {
    const side = Math.random() < 0.5 ? "left" : "right";
    const zoneW = Math.min(300, w * 0.28);
    const x = side === "left"
      ? Math.random() * zoneW
      : w - Math.random() * zoneW;
    const allColors = [...L_COLORS, ...R_COLORS];
    sparkles.push({
      x, y: Math.random() * h,
      size: 4 + Math.random() * 8,
      alpha: 0, maxAlpha: 0.5 + Math.random() * 0.5,
      speed: 0.008 + Math.random() * 0.015,
      color: allColors[Math.floor(Math.random() * allColors.length)]!,
      growing: true,
    });
  }

  // ── Ciclo de animação ────────────────────────────────────────────────
  let lastSpawn = 0;

  function frame(now: number) {
    if (stopped) return;

    const w = canvas.width;
    const h = canvas.height;

    // Spawn sparkles periodicamente
    if (now - lastSpawn > 1800 && sparkles.length < 10) {
      spawnSparkle(w, h);
      lastSpawn = now;
    }

    ctx.clearRect(0, 0, w, h);

    // ── Background base ──────────────────────────────────────────────
    ctx.fillStyle = BG_DARK;
    ctx.fillRect(0, 0, w, h);

    // Gradiente radial: centro ligeiramente mais claro
    const grd = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.7);
    grd.addColorStop(0, "rgba(30,45,80,0.35)");
    grd.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);

    // ── Grade de pontos ──────────────────────────────────────────────
    const SPACING = 28;
    ctx.fillStyle = "rgba(140,155,180,0.22)";
    for (let y = SPACING / 2; y < h; y += SPACING) {
      for (let x = SPACING / 2; x < w; x += SPACING) {
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // ── Clusters neon ────────────────────────────────────────────────
    const cell = Math.max(55, Math.min(80, h / 11));
    const zoneW = Math.min(320, w * 0.28);
    const leftCols  = Math.floor(zoneW / cell) + 1;
    const rightCols = leftCols;
    const rows = Math.ceil(h / cell) + 1;
    const startY = -(cell / 2);

    // Sub-cluster esquerdo menor (deslocado)
    drawCluster(ctx, {
      ox: -cell * 0.5, oy: startY + cell * 3,
      cols: Math.max(2, leftCols - 1), rows: Math.floor(rows * 0.55),
      cell: Math.round(cell * 0.72), colors: L_COLORS,
      side: "left", fadeWidth: zoneW * 0.6,
    });

    // Cluster esquerdo principal
    drawCluster(ctx, {
      ox: -cell * 0.3, oy: startY,
      cols: leftCols, rows,
      cell, colors: L_COLORS,
      side: "left", fadeWidth: zoneW * 0.85,
    });

    // Sub-cluster direito menor
    drawCluster(ctx, {
      ox: w - (rightCols - 1) * Math.round(cell * 0.72) + cell * 0.3,
      oy: startY + cell * 2,
      cols: Math.max(2, rightCols - 1), rows: Math.floor(rows * 0.6),
      cell: Math.round(cell * 0.72), colors: R_COLORS,
      side: "right", fadeWidth: zoneW * 0.6,
    });

    // Cluster direito principal
    drawCluster(ctx, {
      ox: w - rightCols * cell + cell * 0.2, oy: startY,
      cols: rightCols, rows,
      cell, colors: R_COLORS,
      side: "right", fadeWidth: zoneW * 0.85,
    });

    // ── Raios de canto ───────────────────────────────────────────────
    drawCornerRay(ctx, 0, h * 0.6, -0.5, 200, L_COLORS[0]!, 0.6);
    drawCornerRay(ctx, 80, h,       0.9,  180, L_COLORS[2]!, 0.5);
    drawCornerRay(ctx, w, h * 0.15, Math.PI + 0.3, 220, R_COLORS[0]!, 0.5);
    drawCornerRay(ctx, w - 60, 0,   Math.PI * 0.8, 160, R_COLORS[2]!, 0.45);

    // ── Vignette (bordas escuras) ────────────────────────────────────
    const vg = ctx.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, h * 0.9);
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, w, h);

    // ── Sparkles animados ────────────────────────────────────────────
    for (let i = sparkles.length - 1; i >= 0; i--) {
      const sp = sparkles[i]!;
      sp.alpha += sp.growing ? sp.speed : -sp.speed;
      if (sp.alpha >= sp.maxAlpha) sp.growing = false;
      if (sp.alpha <= 0) { sparkles.splice(i, 1); continue; }
      drawStar(ctx, sp.x, sp.y, sp.size, sp.color, sp.alpha);
    }

    // ── Estrela fixa (canto inferior direito) ───────────────────────
    drawStar(ctx, w - 28, h - 28, 12, "#ffffff", 0.55);

    raf = requestAnimationFrame(frame);
  }

  raf = requestAnimationFrame(frame);

  return () => {
    stopped = true;
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
    canvas.remove();
  };
}

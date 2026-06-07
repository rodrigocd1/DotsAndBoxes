/**
 * Laboratório de Teste
 * Sempre ativo, coleta dados de partida para análise.
 */

// ── Tipos ──────────────────────────────────────────────────────────────────

export interface LabReport {
  id: string;
  mode: string;
  stageId: number | null;
  boardSize: string;
  difficulty: string;
  avgBotTimeMs: number;
  maxBotTimeMs: number;
  result: "win" | "loss" | "draw";
  score: string;
  durationMs: number;
  powersUsed: string[];
  tipsUsed: number;
  radarUsed: number;
  freezeAiUsed: number;
  feedbackStars: number | null;
  feedbackComment: string;
  funRating: number | null;
  difficultyRating: number | null;
  fairnessRating: number | null;
  createdAt: number;
  synced: boolean;
}

// ── Storage ───────────────────────────────────────────────────────────────

const LAB_KEY = "dab_lab_reports";
const MAX_LOCAL_REPORTS = 100;

function loadReports(): LabReport[] {
  try {
    const raw = localStorage.getItem(LAB_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LabReport[];
  } catch {
    return [];
  }
}

function saveReports(reports: LabReport[]): void {
  // Manter apenas os últimos N relatórios localmente
  const trimmed = reports.slice(-MAX_LOCAL_REPORTS);
  localStorage.setItem(LAB_KEY, JSON.stringify(trimmed));
}

// ── API Pública ───────────────────────────────────────────────────────────

export function createLabReport(
  data: Omit<LabReport, "id" | "createdAt" | "synced">,
): LabReport {
  const report: LabReport = {
    ...data,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
    synced: false,
  };

  const reports = loadReports();
  reports.push(report);
  saveReports(reports);

  return report;
}

export function getUnsyncedReports(): LabReport[] {
  return loadReports().filter((r) => !r.synced);
}

export function markReportsSynced(ids: string[]): void {
  const reports = loadReports();
  for (const report of reports) {
    if (ids.includes(report.id)) {
      report.synced = true;
    }
  }
  saveReports(reports);
}

export function getReportCount(): number {
  return loadReports().length;
}

export function getRecentReports(limit: number): LabReport[] {
  return loadReports().slice(-limit);
}

import { BotDifficulty } from "./bot";
import { t } from "./i18n";
import { INITIAL_STAGES, TOTAL_STAGES } from "../config/game-constants";

export { INITIAL_STAGES, TOTAL_STAGES } from "../config/game-constants";

export interface ActiveCell {
  readonly x: number;
  readonly y: number;
}

export interface BoardTemplate {
  readonly id: number;
  readonly name: string;
  readonly matrix: readonly string[];
  readonly width: number;
  readonly height: number;
  readonly cells: readonly ActiveCell[];
  readonly totalMaxScore: number;
}

export const DIFFICULTY_GROUPS = [
  "MUITO_FACIL",
  "FACIL",
  "MEDIO",
  "DIFICIL",
  "MUITO_DIFICIL",
  "IMPOSSIVEL",
] as const;

export type StageDifficultyGroup = typeof DIFFICULTY_GROUPS[number];

export interface Stage {
  readonly id: number;
  readonly templateId: number;
  readonly templateName: string;
  readonly board: {
    readonly width: number;
    readonly height: number;
    readonly cells: readonly ActiveCell[];
  };
  readonly totalMaxScore: number;
  readonly baseDifficulty: StageDifficultyGroup;
  readonly effectiveDifficulty: StageDifficultyGroup;
  readonly difficulty: BotDifficulty;
  readonly stars: readonly [string, string, string];
}

const GROUP_TO_BOT_DIFFICULTY: Record<StageDifficultyGroup, BotDifficulty> = {
  MUITO_FACIL: "muito-facil",
  FACIL: "facil",
  MEDIO: "medio",
  DIFICIL: "dificil",
  MUITO_DIFICIL: "muito-dificil",
  IMPOSSIVEL: "impossivel",
};

export const EVEN_STAGE_DIFFICULTY_BOOST: Record<StageDifficultyGroup, StageDifficultyGroup> = {
  MUITO_FACIL: "MEDIO",
  FACIL: "DIFICIL",
  MEDIO: "MUITO_DIFICIL",
  DIFICIL: "IMPOSSIVEL",
  MUITO_DIFICIL: "IMPOSSIVEL",
  IMPOSSIVEL: "IMPOSSIVEL",
};

export const STAR_THRESHOLDS: Record<StageDifficultyGroup, { twoStars: number; threeStars: number }> = {
  MUITO_FACIL: { twoStars: 0.65, threeStars: 0.8 },
  FACIL: { twoStars: 0.65, threeStars: 0.8 },
  MEDIO: { twoStars: 0.6, threeStars: 0.75 },
  DIFICIL: { twoStars: 0.6, threeStars: 0.75 },
  MUITO_DIFICIL: { twoStars: 0.55, threeStars: 0.7 },
  IMPOSSIVEL: { twoStars: 0.55, threeStars: 0.7 },
};

const DIFFICULTY_LABEL_KEYS: Record<StageDifficultyGroup, string> = {
  MUITO_FACIL: "diff_muito_facil",
  FACIL: "diff_facil",
  MEDIO: "diff_medio",
  DIFICIL: "diff_dificil",
  MUITO_DIFICIL: "diff_muito_dificil",
  IMPOSSIVEL: "diff_impossivel",
};

const RAW_BOARD_TEMPLATES = [
  { id: 1, name: "Mini Classico", matrix: ["111", "111", "111"] },
  { id: 2, name: "Classico Mobile", matrix: ["1111", "1111", "1111", "1111"] },
  { id: 3, name: "Cruz Compacta", matrix: ["00100", "00100", "11111", "00100", "00100"] },
  { id: 4, name: "Diamante Quadriculado", matrix: ["00100", "01110", "11111", "01110", "00100"] },
  { id: 5, name: "Ampulheta Quadriculada", matrix: ["11011", "01110", "00100", "01110", "00100", "01110", "11011"] },
  { id: 6, name: "Escadinha", matrix: ["10000", "11000", "01100", "00110", "00011"] },
  { id: 7, name: "Ilhas Duplas", matrix: ["11000", "11000", "00000", "00011", "00011"] },
  { id: 8, name: "Corredor Vertical", matrix: ["111", "111", "111", "111", "111"] },
  { id: 9, name: "Campo Tatico", matrix: ["1111", "1111", "1111"] },
  { id: 10, name: "Labirinto Mobile", matrix: ["11110", "00010", "01110", "01000", "01111", "00001", "11101", "10101", "11111"] },
] as const;

export const BOARD_TEMPLATES: readonly BoardTemplate[] = RAW_BOARD_TEMPLATES.map(normalizeTemplate);

const STAGES: readonly Stage[] = Array.from({ length: TOTAL_STAGES }, (_, index) =>
  buildStage(index + 1),
);

export function calculateStars(
  playerScore: number,
  aiScore: number,
  totalMaxScore: number,
  effectiveDifficulty: StageDifficultyGroup,
): 0 | 1 | 2 | 3 {
  if (playerScore <= aiScore) return 0;

  const threshold = STAR_THRESHOLDS[effectiveDifficulty];
  const twoStarsScore = Math.ceil(totalMaxScore * threshold.twoStars);
  const threeStarsScore = Math.ceil(totalMaxScore * threshold.threeStars);

  if (playerScore >= threeStarsScore) return 3;
  if (playerScore >= twoStarsScore) return 2;
  return 1;
}

export function getDifficultyLabel(group: StageDifficultyGroup): string {
  return t(DIFFICULTY_LABEL_KEYS[group]);
}

export function getStageTitle(stage: Pick<Stage, "id" | "baseDifficulty">): string {
  return t("stage_header", { id: stage.id, diff: getDifficultyLabel(stage.baseDifficulty) });
}

export function isDifficultyIntroStage(stageId: number): boolean {
  return ((stageId - 1) % BOARD_TEMPLATES.length) === 0;
}

export function getStage(id: number): Stage {
  const normalizedId = Math.max(1, Math.min(TOTAL_STAGES, Math.floor(id)));
  return STAGES[normalizedId - 1] ?? STAGES[STAGES.length - 1]!;
}

function buildStage(id: number): Stage {
  const template = BOARD_TEMPLATES[(id - 1) % BOARD_TEMPLATES.length]!;
  const baseDifficulty = baseDifficultyForStage(id);
  const effectiveDifficulty = effectiveDifficultyForStage(baseDifficulty, id);

  return {
    id,
    templateId: template.id,
    templateName: template.name,
    board: {
      width: template.width,
      height: template.height,
      cells: template.cells,
    },
    totalMaxScore: template.totalMaxScore,
    baseDifficulty,
    effectiveDifficulty,
    difficulty: GROUP_TO_BOT_DIFFICULTY[effectiveDifficulty],
    stars: starDescriptions(template.totalMaxScore, effectiveDifficulty),
  };
}

function normalizeTemplate(template: { id: number; name: string; matrix: readonly string[] }): BoardTemplate {
  const width = template.matrix[0]?.length ?? 0;
  const height = template.matrix.length;
  if (width < 1 || width > 5) {
    throw new RangeError(`Template ${template.id} com largura invalida: ${width}`);
  }
  if (height < 1 || height > 10) {
    throw new RangeError(`Template ${template.id} com altura invalida: ${height}`);
  }

  const cells: ActiveCell[] = [];
  for (const [y, row] of template.matrix.entries()) {
    if (row.length !== width) {
      throw new RangeError(`Template ${template.id} com linhas de larguras diferentes`);
    }
    for (const [x, value] of [...row].entries()) {
      if (value !== "0" && value !== "1") {
        throw new RangeError(`Template ${template.id} contem valor invalido: ${value}`);
      }
      if (value === "1") cells.push({ x, y });
    }
  }

  return {
    ...template,
    width,
    height,
    cells,
    totalMaxScore: cells.length,
  };
}

function baseDifficultyForStage(id: number): StageDifficultyGroup {
  const groupIndex = Math.min(
    DIFFICULTY_GROUPS.length - 1,
    Math.max(0, Math.floor((id - 1) / BOARD_TEMPLATES.length)),
  );
  return DIFFICULTY_GROUPS[groupIndex]!;
}

function effectiveDifficultyForStage(
  baseDifficulty: StageDifficultyGroup,
  stageId: number,
): StageDifficultyGroup {
  return stageId % 2 === 0
    ? EVEN_STAGE_DIFFICULTY_BOOST[baseDifficulty]
    : baseDifficulty;
}

function starDescriptions(
  totalMaxScore: number,
  effectiveDifficulty: StageDifficultyGroup,
): readonly [string, string, string] {
  const threshold = STAR_THRESHOLDS[effectiveDifficulty];
  return [
    "Venca",
    `Venca com >=${Math.ceil(totalMaxScore * threshold.twoStars)} caixas`,
    `Venca com >=${Math.ceil(totalMaxScore * threshold.threeStars)} caixas`,
  ];
}

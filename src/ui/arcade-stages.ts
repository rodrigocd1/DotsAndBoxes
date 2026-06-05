import { BotDifficulty } from "./bot";

export interface Stage {
  id: number;
  gridSize: number;
  difficulty: BotDifficulty;
  objectiveType: ObjectiveType;
  objectiveValue: number;
  stars: [string, string, string]; // descrição das 3 estrelas
}

export type ObjectiveType =
  | "win"           // vencer (qualquer placar)
  | "margin"        // vencer por N+ caixas de diferença
  | "dominance"     // fechar ≥N% das caixas
  | "chain"         // fechar ≥N caixas em um turno
  | "clean";        // vencer sem dar nenhuma caixa ao bot

const TIERS: {
  range: [number, number];
  gridSizes: number[];
  difficulty: BotDifficulty;
}[] = [
  { range: [1, 10],   gridSizes: [3],    difficulty: "muito-facil" },
  { range: [11, 25],  gridSizes: [3, 4], difficulty: "muito-facil" },
  { range: [26, 50],  gridSizes: [4],    difficulty: "facil" },
  { range: [51, 80],  gridSizes: [4],    difficulty: "facil" },
  { range: [81, 120], gridSizes: [4, 5], difficulty: "medio" },
  { range: [121, 170],gridSizes: [5],    difficulty: "medio" },
  { range: [171, 230],gridSizes: [5],    difficulty: "dificil" },
  { range: [231, 300],gridSizes: [5, 6], difficulty: "dificil" },
  { range: [301, 380],gridSizes: [6],    difficulty: "muito-dificil" },
  { range: [381, 450],gridSizes: [6],    difficulty: "muito-dificil" },
  { range: [451, 490],gridSizes: [6],    difficulty: "impossivel" },
  { range: [491, 500],gridSizes: [6],    difficulty: "impossivel" },
];

function tierFor(id: number) {
  return TIERS.find(([, [lo, hi]] = [, [0, 0]], t) =>
    id >= t.range[0] && id <= t.range[1],
  ) ?? TIERS[TIERS.length - 1]!;
}

// Deterministicamente escolhe objetivo com base no id
function objectiveFor(id: number, gridSize: number): Pick<Stage, "objectiveType" | "objectiveValue" | "stars"> {
  const totalBoxes = (gridSize - 1) * (gridSize - 1);
  const mod = id % 5;

  if (mod === 0) {
    return {
      objectiveType: "dominance",
      objectiveValue: 60,
      stars: ["Vença", "Feche ≥60% das caixas", "Feche ≥75% das caixas"],
    };
  }
  if (mod === 1) {
    const margin = Math.min(2 + Math.floor(id / 50), Math.floor(totalBoxes / 2));
    return {
      objectiveType: "margin",
      objectiveValue: margin,
      stars: ["Vença", `Vença por ≥${margin} caixas`, `Vença por ≥${margin + 2} caixas`],
    };
  }
  if (mod === 2) {
    return {
      objectiveType: "chain",
      objectiveValue: 2,
      stars: ["Vença", "Feche ≥2 caixas em um turno", "Feche ≥3 caixas em um turno"],
    };
  }
  if (mod === 3) {
    return {
      objectiveType: "clean",
      objectiveValue: 0,
      stars: ["Vença", "Vença sem dar caixas ao bot", "Vença sem dar caixas com margem ≥3"],
    };
  }
  // mod === 4 → win simples
  return {
    objectiveType: "win",
    objectiveValue: 0,
    stars: ["Vença", `Vença com ≥${Math.ceil(totalBoxes * 0.5)} caixas`, `Vença com ≥${Math.ceil(totalBoxes * 0.65)} caixas`],
  };
}

export function getStage(id: number): Stage {
  const tier = TIERS.find((t) => id >= t.range[0] && id <= t.range[1]) ?? TIERS[TIERS.length - 1]!;
  const gridSizes = tier.gridSizes;
  // Alterna entre os tamanhos do tier de forma determinística
  const gridSize = gridSizes[(id % gridSizes.length)] ?? gridSizes[0]!;
  const objective = objectiveFor(id, gridSize);

  return {
    id,
    gridSize,
    difficulty: tier.difficulty,
    ...objective,
  };
}

export const TOTAL_STAGES = 500;
export const INITIAL_STAGES = 50;

import {
  BOARD_TEMPLATES,
  DIFFICULTY_GROUPS,
  EVEN_STAGE_DIFFICULTY_BOOST,
  INITIAL_STAGES,
  NERVES_OF_STEEL_BOARD_CYCLE_SIZE,
  TOTAL_STAGES,
  calculateStars,
  getDifficultyLabel,
  getNervesOfSteelBoardRotation,
  getStage,
  getStageTitle,
  isDifficultyIntroStage,
} from "./arcade-stages";

describe("arcade stages", () => {
  it("gera 60 fases reaproveitando 10 templates", () => {
    expect(TOTAL_STAGES).toBe(60);
    expect(INITIAL_STAGES).toBe(60);
    expect(BOARD_TEMPLATES).toHaveLength(10);
    expect(getStage(1).templateId).toBe(1);
    expect(getStage(10).templateId).toBe(10);
    expect(getStage(11).templateId).toBe(1);
    expect(getStage(60).templateId).toBe(10);
  });

  it("mantem os templates pedidos nas fases 5 e 10", () => {
    expect(getStage(5).templateName).toBe("Ampulheta Quadriculada");
    expect(getStage(10).templateName).toBe("Labirinto Mobile");
  });

  it("respeita largura, altura e totalMaxScore dos templates", () => {
    for (const template of BOARD_TEMPLATES) {
      expect(template.width).toBeLessThanOrEqual(5);
      expect(template.height).toBeLessThanOrEqual(10);
      expect(template.totalMaxScore).toBe(template.cells.length);
      expect(template.matrix.every((row) => row.length === template.width)).toBe(true);
    }
  });

  it("aplica dificuldade base nas fases impares e boost nas pares", () => {
    expect(DIFFICULTY_GROUPS).toEqual([
      "MUITO_FACIL",
      "FACIL",
      "MEDIO",
      "DIFICIL",
      "MUITO_DIFICIL",
      "IMPOSSIVEL",
    ]);
    expect(getStage(1).baseDifficulty).toBe("MUITO_FACIL");
    expect(getStage(1).effectiveDifficulty).toBe("MUITO_FACIL");
    expect(getStage(2).effectiveDifficulty).toBe(EVEN_STAGE_DIFFICULTY_BOOST.MUITO_FACIL);
    expect(getStage(12).baseDifficulty).toBe("FACIL");
    expect(getStage(12).effectiveDifficulty).toBe(EVEN_STAGE_DIFFICULTY_BOOST.FACIL);
    expect(getStage(52).baseDifficulty).toBe("IMPOSSIVEL");
    expect(getStage(52).effectiveDifficulty).toBe("IMPOSSIVEL");
  });

  it("calcula estrelas usando score, totalMaxScore e dificuldade efetiva", () => {
    expect(calculateStars(5, 5, 9, "MUITO_FACIL")).toBe(0);
    expect(calculateStars(6, 3, 9, "MUITO_FACIL")).toBe(2);
    expect(calculateStars(8, 1, 9, "MUITO_FACIL")).toBe(3);
    expect(calculateStars(7, 5, 12, "IMPOSSIVEL")).toBe(2);
    expect(calculateStars(9, 3, 12, "IMPOSSIVEL")).toBe(3);
  });

  it("expõe titulo e introducao nas viradas de dificuldade", () => {
    expect(getDifficultyLabel("MUITO_FACIL")).toBe("Muito Fácil");
    expect(getStageTitle(getStage(11))).toContain("Fase 11");
    expect(getStageTitle(getStage(11))).toContain("Fácil");
    expect(isDifficultyIntroStage(1)).toBe(true);
    expect(isDifficultyIntroStage(11)).toBe(true);
    expect(isDifficultyIntroStage(12)).toBe(false);
  });

  it("rota os 10 tabuleiros do Nervos de Aco sem repetir antes do fim do ciclo", () => {
    const firstCycle = Array.from({ length: NERVES_OF_STEEL_BOARD_CYCLE_SIZE }, (_, index) =>
      getNervesOfSteelBoardRotation(index),
    );

    expect(firstCycle.map((entry) => entry.template.id)).toEqual(
      BOARD_TEMPLATES.map((template) => template.id),
    );
    expect(new Set(firstCycle.map((entry) => entry.template.id)).size).toBe(BOARD_TEMPLATES.length);
    expect(firstCycle.every((entry) => entry.difficulty === "medio")).toBe(true);
  });

  it("aumenta a dificuldade do Nervos de Aco a cada ciclo completo", () => {
    expect(getNervesOfSteelBoardRotation(0).difficulty).toBe("medio");
    expect(getNervesOfSteelBoardRotation(NERVES_OF_STEEL_BOARD_CYCLE_SIZE).difficulty).toBe("dificil");
    expect(getNervesOfSteelBoardRotation(NERVES_OF_STEEL_BOARD_CYCLE_SIZE * 2).difficulty).toBe("muito-dificil");
    expect(getNervesOfSteelBoardRotation(NERVES_OF_STEEL_BOARD_CYCLE_SIZE * 3).difficulty).toBe("impossivel");
    expect(getNervesOfSteelBoardRotation(NERVES_OF_STEEL_BOARD_CYCLE_SIZE * 4).difficulty).toBe("impulsivo");
    expect(getNervesOfSteelBoardRotation(NERVES_OF_STEEL_BOARD_CYCLE_SIZE * 8).difficulty).toBe("impulsivo");
  });
});

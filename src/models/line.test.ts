import { makeLine, lineKey } from "./line";
import { dot } from "./dot";

describe("makeLine / lineKey", () => {
  it("gera a mesma chave independentemente da ordem dos pontos", () => {
    const a = lineKey(makeLine(dot(0, 0), dot(0, 1)));
    const b = lineKey(makeLine(dot(0, 1), dot(0, 0)));
    expect(a).toBe(b);
    expect(a).toBe("h-0-0");
  });

  it("distingue horizontal de vertical", () => {
    expect(lineKey(makeLine(dot(0, 0), dot(0, 1)))).toBe("h-0-0");
    expect(lineKey(makeLine(dot(0, 0), dot(1, 0)))).toBe("v-0-0");
  });

  it("lança erro para pontos não adjacentes", () => {
    expect(() => makeLine(dot(0, 0), dot(2, 0))).toThrow(RangeError);
    expect(() => makeLine(dot(0, 0), dot(1, 1))).toThrow(RangeError);
  });
});

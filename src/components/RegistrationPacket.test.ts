import { describe, expect, it } from "vitest";
import { FLEX_PACKAGE_OPTIONS, SPRING_PACKAGE_OPTIONS } from "./RegistrationPacket";

describe("FLEX_PACKAGE_OPTIONS", () => {
  it("exposes the 5 / 10 / 15 / 20 workout packs in published order", () => {
    expect(FLEX_PACKAGE_OPTIONS.map((option) => option.id)).toEqual([
      "flex-5",
      "flex-10",
      "flex-15",
      "flex-20",
    ]);
  });

  it("matches the prices David published for Summer 2026", () => {
    const byId = Object.fromEntries(
      FLEX_PACKAGE_OPTIONS.map((option) => [option.id, option]),
    );
    expect(byId["flex-5"].price).toBe("$475");
    expect(byId["flex-10"].price).toBe("$825");
    expect(byId["flex-15"].price).toBe("$1,125");
    expect(byId["flex-20"].price).toBe("$1,395");
  });

  it("emits googleValue strings the Apps Script can parse off the Summer Track prefix", () => {
    for (const option of FLEX_PACKAGE_OPTIONS) {
      const fallback = `Summer 2026 Flex - ${option.googleValue}`;
      expect(fallback.startsWith("Summer 2026 Flex - ")).toBe(true);
      expect(option.googleValue).toContain(option.price);
    }
  });
});

describe("SPRING_PACKAGE_OPTIONS", () => {
  it("still ships the full 10-option Small Group + Group menu", () => {
    expect(SPRING_PACKAGE_OPTIONS).toHaveLength(10);
  });
});

import { describe, it, expect } from "vitest";
import { calculateCB, TARGET_2025, ENERGY_CONVERSION } from "../../src/core/domain/Compliance";

describe("calculateCB", () => {
  it("should correctly calculate compliance balance for given inputs", () => {
    const actualGHG = 91.0;
    const fuelConsumption = 5000;
    const totalEnergy = fuelConsumption * ENERGY_CONVERSION;
    const expectedCB = (TARGET_2025 - actualGHG) * totalEnergy;

    const result = calculateCB(actualGHG, fuelConsumption);

    expect(result).toBeCloseTo(expectedCB, 5);
  });

  it("should return 0 when actualGHG equals TARGET_2025", () => {
    const result = calculateCB(TARGET_2025, 5000);
    expect(result).toBe(0);
  });

  it("should handle zero fuel consumption gracefully", () => {
    const result = calculateCB(90, 0);
    expect(result).toBeCloseTo(0);
  });

});

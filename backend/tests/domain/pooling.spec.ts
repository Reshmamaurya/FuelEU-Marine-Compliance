import { CreatePoolUseCase } from "../../src/core/application/usecases/CreatePoolUseCase";

describe("CreatePoolUseCase.allocate()", () => {
  const dummyRepo = { createPool: async () => {} } as any;
  const useCase = new CreatePoolUseCase(dummyRepo);

  it("should satisfy sum >= 0 constraint", () => {
    const members = [
      { shipId: "A", adjustedCB: 100 },
      { shipId: "B", adjustedCB: -60 },
      { shipId: "C", adjustedCB: -40 },
    ];
    const result = useCase.allocate(members);
    const total = result.reduce((s, m) => s + m.cbAfter!, 0);
    expect(total).toBeGreaterThanOrEqual(0);
  });

  it("should throw error if sum < 0", () => {
    const invalid = [
      { shipId: "A", adjustedCB: -10 },
      { shipId: "B", adjustedCB: -20 },
    ];
    expect(() => useCase.allocate(invalid)).toThrow("Pool sum < 0");
  });

  it("should not worsen deficits", () => {
    const members = [
      { shipId: "A", adjustedCB: 100 },
      { shipId: "B", adjustedCB: -60 },
    ];
    const result = useCase.allocate(members);
    const deficit = result.find(m => m.shipId === "B")!;
    expect(deficit.cbAfter).toBeGreaterThanOrEqual(deficit.cbBefore!);
  });
});

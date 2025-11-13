import { BankSurplusUseCase } from "../../src/core/application/usecases/BankSurplusUseCase";

describe("BankSurplusUseCase", () => {
  const complianceRepo = {
    findLatestCompliance: async () => ({ shipId: "S1", year: 2024, cbGco2eq: 500 }),
  };
  const bankingRepo = {
    addBankEntry: async (entry: any) => entry,
  };

  const useCase = new BankSurplusUseCase(bankingRepo as any, complianceRepo as any);

  it("should bank positive CB", async () => {
    const result = await useCase.execute("S1", 2024, 200);
    expect(result.amountGco2eq).toBe(200);
  });

  it("should reject if CB <= 0", async () => {
    const badCompliance = {
      findLatestCompliance: async () => ({ cbGco2eq: -100 }),
    };
    const badUseCase = new BankSurplusUseCase(bankingRepo as any, badCompliance as any);
    await expect(badUseCase.execute("S1", 2024, 50)).rejects.toThrow("Cannot bank non-positive CB");
  });
});

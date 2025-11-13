import { IBankingRepository } from "../../ports/repositories/IBankingRepository";
import { IComplianceRepository } from "../../ports/repositories/IComplianceRepository";
import { BankEntry } from "../../domain/BankEntry";

export class BankSurplusUseCase {
  constructor(private bankingRepo: IBankingRepository, private complianceRepo: IComplianceRepository) {}

  async execute(shipId: string, year: number, amount: number) {
    const compliance = await this.complianceRepo.findLatestCompliance(shipId, year);
    if (!compliance) throw new Error("No compliance record found");
    if (compliance.cbGco2eq <= 0) throw new Error("Cannot bank non-positive CB");
    if (amount > compliance.cbGco2eq) throw new Error("Amount exceeds available CB");

    const entry = new BankEntry(shipId, year, amount, new Date());
    return this.bankingRepo.addBankEntry(entry);
  }
}

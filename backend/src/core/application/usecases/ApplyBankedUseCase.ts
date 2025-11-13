import { IBankingRepository } from "../../ports/repositories/IBankingRepository";
import { BankEntry } from "../../domain/BankEntry";

export class ApplyBankedUseCase {
  constructor(private bankingRepo: IBankingRepository) {}

  async execute(shipId: string, year: number, amount: number) {
    const total = await this.bankingRepo.getBankedTotal(shipId, year);
    if (amount > total) throw new Error("Insufficient banked amount");

    const entry = new BankEntry(shipId, year, -Math.abs(amount), new Date());
    return this.bankingRepo.addBankEntry(entry);
  }
}

import { BankEntry } from "../../domain/BankEntry";

export interface IBankingRepository {
  addBankEntry(entry: BankEntry): Promise<BankEntry>;
  getBankedTotal(shipId: string, year: number): Promise<number>;
  getBankEntries(shipId: string, year: number): Promise<BankEntry[]>;
}

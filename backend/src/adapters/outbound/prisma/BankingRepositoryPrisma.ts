import { prisma } from "./PrismaClientProvider";
import { IBankingRepository } from "@core/ports/repositories/IBankingRepository";
import { BankEntry } from "@core/domain/BankEntry";
import { bank_entries, pools, pool_members } from "@prisma/client";


export class BankingRepositoryPrisma implements IBankingRepository {
  async addBankEntry(entry: BankEntry) {
    const r = await prisma.bank_entries.create({
      data: {
        ship_id: entry.shipId,
        year: entry.year,
        amount_gco2eq: entry.amountGco2eq,
      },
    });
    return new BankEntry(r.ship_id, r.year, r.amount_gco2eq, r.created_at);
  }

  async getBankedTotal(shipId: string, year: number) {
    const rows = await prisma.bank_entries.findMany({ where: { ship_id: shipId, year } });
    return rows.reduce((sum: number, r: bank_entries) => sum + r.amount_gco2eq, 0);
  }

  async getBankEntries(shipId: string, year: number) {
    const rows = await prisma.bank_entries.findMany({
      where: { ship_id: shipId, year },
      orderBy: { created_at: "desc" },
    });
    return rows.map((r: bank_entries) => new BankEntry(r.ship_id, r.year, r.amount_gco2eq, r.created_at));
  }
}

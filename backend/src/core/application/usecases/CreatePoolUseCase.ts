import { IPoolRepository } from "../../ports/repositories/IPoolRepository";
import { Pool, PoolMember } from "../../domain/Pool";

export class CreatePoolUseCase {
  constructor(private poolRepo: IPoolRepository) {}

  allocate(members: PoolMember[]): PoolMember[] {
    const mems = members.map(m => ({
      ...m,
      cbBefore: m.adjustedCB,
      cbAfter: m.adjustedCB
    }));

    const total = mems.reduce((sum, m) => sum + m.adjustedCB, 0);
    if (total < 0) throw new Error("Pool sum < 0 — invalid");

    const surplus = mems.filter(m => m.cbAfter! > 0);
    const deficit = mems.filter(m => m.cbAfter! < 0);

    for (const s of surplus) {
      let available = s.cbAfter!;
      for (const d of deficit) {
        if (available <= 0) break;
        if (d.cbAfter! >= 0) continue;
        const transfer = Math.min(available, Math.abs(d.cbAfter!));
        d.cbAfter! += transfer;
        available -= transfer;
      }
      s.cbAfter = available; // leftover must be >= 0
    }

    // Post-checks
    for (const m of mems) {
      if (m.cbBefore! < 0 && m.cbAfter! < m.cbBefore!) throw new Error("Deficit worsened");
      if (m.cbBefore! > 0 && m.cbAfter! < 0) throw new Error("Surplus went negative");
    }

    return mems;
  }

  async execute(year: number, members: PoolMember[]) {
    const result = this.allocate(members);
    const pool = new Pool(year, result);
    await this.poolRepo.createPool(pool);
    return result;
  }
}

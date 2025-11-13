import { prisma } from "./PrismaClientProvider";
import { IPoolRepository } from "@core/ports/repositories/IPoolRepository";
import { Pool } from "@core/domain/Pool";

export class PoolRepositoryPrisma implements IPoolRepository {
  async createPool(pool: Pool) {
    await prisma.pools.create({
      data: {
        year: pool.year,
        members: {
          create: pool.members.map(m => ({
            ship_id: m.shipId,
            cb_before: m.cbBefore ?? 0,
            cb_after: m.cbAfter ?? 0,
          })),
        },
      },
    });
  }

  async getPoolsByYear(year: number) {
    const rows = await prisma.pools.findMany({ where: { year }, include: { members: true } });
    return rows.map(
      r =>
        new Pool(
          r.year,
          r.members.map((m: any) => ({
            shipId: m.ship_id,
            adjustedCB: m.cb_before,
            cbBefore: m.cb_before,
            cbAfter: m.cb_after,
          }))
        )
    );
  }
}

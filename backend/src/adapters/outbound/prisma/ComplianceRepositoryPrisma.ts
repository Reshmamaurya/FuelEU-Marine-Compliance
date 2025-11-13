import { prisma } from "./PrismaClientProvider";
import { IComplianceRepository } from "@core/ports/repositories/IComplianceRepository";
import { ShipCompliance } from "@core/domain/ShipCompliance";

export class ComplianceRepositoryPrisma implements IComplianceRepository {
  async saveCompliance(record: ShipCompliance) {
    const r = await prisma.ship_compliance.create({
      data: { ship_id: record.shipId, year: record.year, cb_gco2eq: record.cbGco2eq },
    });
    return new ShipCompliance(r.ship_id, r.year, r.cb_gco2eq, r.created_at);
  }

  async findLatestCompliance(shipId: string, year: number) {
    const r = await prisma.ship_compliance.findFirst({
      where: { ship_id: shipId, year },
      orderBy: { created_at: "desc" },
    });
    return r ? new ShipCompliance(r.ship_id, r.year, r.cb_gco2eq, r.created_at) : null;
  }
}

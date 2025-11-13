import { ShipCompliance } from "../../domain/ShipCompliance";

export interface IComplianceRepository {
  saveCompliance(record: ShipCompliance): Promise<ShipCompliance>;
  findLatestCompliance(shipId: string, year: number): Promise<ShipCompliance | null>;
}

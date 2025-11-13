import { TARGET_2025, ENERGY_CONVERSION } from "../../domain/valueObjects";
import { IComplianceRepository } from "../../ports/repositories/IComplianceRepository";
import { ShipCompliance } from "../../domain/ShipCompliance";

export class CalculateCBUseCase {
  constructor(private complianceRepo: IComplianceRepository) {}

  calculate(actualGHG: number, fuelConsumption: number): number {
    const totalEnergy = fuelConsumption * ENERGY_CONVERSION;
    return (TARGET_2025 - actualGHG) * totalEnergy;
  }

  async execute(shipId: string, year: number, actualGHG: number, fuelConsumption: number) {
    const cb = this.calculate(actualGHG, fuelConsumption);
    const record = new ShipCompliance(shipId, year, cb, new Date());
    return this.complianceRepo.saveCompliance(record);
  }
}

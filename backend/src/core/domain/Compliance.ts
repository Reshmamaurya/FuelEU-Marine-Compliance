export const TARGET_2025 = 89.3368;
export const ENERGY_CONVERSION = 41000;

/**
 * Calculate Compliance Balance (CB)
 * Formula: (TARGET - actualGHG) × (fuelConsumption × ENERGY_CONVERSION)
 */
export function calculateCB(actualGHG: number, fuelConsumption: number): number {
  const totalEnergy = fuelConsumption * ENERGY_CONVERSION;
  return (TARGET_2025 - actualGHG) * totalEnergy;
}

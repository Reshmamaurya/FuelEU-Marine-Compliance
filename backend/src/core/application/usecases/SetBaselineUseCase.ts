import { IRouteRepository } from "@core/ports/repositories/IRouteRepository";

export class SetBaselineUseCase {
  constructor(private routeRepo: IRouteRepository) {}

  async execute(routeId: string): Promise<void> {
    // 1. Unset all other baselines
    await this.routeRepo.unsetAllBaselines();

    // 2. Set the new baseline
    const route = await this.routeRepo.findByRouteId(routeId);
    if (!route) throw new Error(`Route with ID ${routeId} not found`);

    route.isBaseline = true;
    await this.routeRepo.save(route);
  }
}

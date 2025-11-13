import { IRouteRepository } from "../../ports/repositories/IRouteRepository";

export class CompareRoutesUseCase {
  constructor(private routeRepo: IRouteRepository) {}

  async execute(year?: number) {
    const routes = await this.routeRepo.findAll({ year });
    const baseline = routes.find(r => r.isBaseline);
    if (!baseline) return { baseline: null, comparisons: [] };

    const comparisons = routes
      .filter(r => r.routeId !== baseline.routeId)
      .map(r => ({
        route: r,
        percentDiff: ((r.ghgIntensity / baseline.ghgIntensity) - 1) * 100,
        compliant: r.ghgIntensity <= 89.3368
      }));

    return { baseline, comparisons };
  }
}

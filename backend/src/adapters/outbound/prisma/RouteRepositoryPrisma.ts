import { IRouteRepository } from "@core/ports/repositories/IRouteRepository";
import { Route } from "@core/domain/Route";
import { prisma } from "./PrismaClientProvider";

function toDomain(r: any): Route {
  return new Route({
    id: r.id,
    routeId: r.route_id,
    vesselType: r.vessel_type,
    fuelType: r.fuel_type,
    year: r.year,
    ghgIntensity: r.ghg_intensity,
    fuelConsumption: r.fuel_consumption,
    distance: r.distance,
    totalEmissions: r.total_emissions,
    isBaseline: r.is_baseline,
  });
}

export class RouteRepositoryPrisma implements IRouteRepository {
  async findAll(filters?: { vesselType?: string; fuelType?: string; year?: number }): Promise<Route[]> {
    const where: any = {};
    if (filters?.vesselType) where.vessel_type = filters.vesselType;
    if (filters?.fuelType) where.fuel_type = filters.fuelType;
    if (filters?.year) where.year = filters.year;

    const rows = await prisma.routes.findMany({ where, orderBy: { id: "asc" } });
    return rows.map(toDomain);
  }

  async findById(id: number): Promise<Route | null> {
    const r = await prisma.routes.findUnique({ where: { id } });
    return r ? toDomain(r) : null;
  }

  async findByRouteId(routeId: string): Promise<Route | null> {
    const r = await prisma.routes.findUnique({ where: { route_id: routeId } });
    return r ? toDomain(r) : null;
  }

  async save(route: Route): Promise<Route> {
    const r = await prisma.routes.upsert({
      where: { route_id: route.routeId },
      update: {
        vessel_type: route.vesselType,
        fuel_type: route.fuelType,
        year: route.year,
        ghg_intensity: route.ghgIntensity,
        fuel_consumption: route.fuelConsumption,
        distance: route.distance,
        total_emissions: route.totalEmissions,
        is_baseline: route.isBaseline,
      },
      create: {
        route_id: route.routeId,
        vessel_type: route.vesselType,
        fuel_type: route.fuelType,
        year: route.year,
        ghg_intensity: route.ghgIntensity,
        fuel_consumption: route.fuelConsumption,
        distance: route.distance,
        total_emissions: route.totalEmissions,
        is_baseline: route.isBaseline,
      },
    });
    return toDomain(r);
  }

  /**
   * Ensure only one baseline per dataset:
   * 1. Unset all baselines (global or per year if you want that constraint)
   * 2. Set the selected route as baseline
   */
  async setBaseline(routeId: string): Promise<void> {
    const route = await prisma.routes.findUnique({ where: { route_id: routeId } });
    if (!route) throw new Error("Route not found");

    await prisma.$transaction([
      prisma.routes.updateMany({
        // If you want one baseline PER YEAR, keep the year filter.
        // If you want one baseline globally, remove `where: { year: route.year }`
        where: { year: route.year },
        data: { is_baseline: false },
      }),
      prisma.routes.update({
        where: { route_id: routeId },
        data: { is_baseline: true },
      }),
    ]);
  }

  /** Optional helper for completeness */
  async unsetAllBaselines(): Promise<void> {
    await prisma.routes.updateMany({ data: { is_baseline: false } });
  }
}

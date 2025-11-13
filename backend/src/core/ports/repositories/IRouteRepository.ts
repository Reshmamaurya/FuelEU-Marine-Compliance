import { Route } from "@core/domain/Route";

export interface IRouteRepository {
  findAll(filters?: { vesselType?: string; fuelType?: string; year?: number }): Promise<Route[]>;
  findById(id: number): Promise<Route | null>;
  findByRouteId(routeId: string): Promise<Route | null>;
  save(route: Route): Promise<Route>;
  setBaseline(routeId: string): Promise<void>;

  /** Unset all baseline flags in the database */
  unsetAllBaselines(): Promise<void>;
}

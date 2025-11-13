import { Pool } from "../../domain/Pool";

export interface IPoolRepository {
  createPool(pool: Pool): Promise<void>;
  getPoolsByYear(year: number): Promise<Pool[]>;
}

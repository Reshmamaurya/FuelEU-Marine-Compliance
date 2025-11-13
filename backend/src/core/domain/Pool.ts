export type PoolMember = {
  shipId: string;
  adjustedCB: number;
  cbBefore?: number;
  cbAfter?: number;
};

export class Pool {
  constructor(public year: number, public members: PoolMember[]) {}
}

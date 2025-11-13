export class ShipCompliance {
  constructor(
    public shipId: string,
    public year: number,
    public cbGco2eq: number,
    public createdAt?: Date
  ) {}
}

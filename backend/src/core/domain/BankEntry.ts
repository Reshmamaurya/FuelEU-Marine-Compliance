export class BankEntry {
  constructor(
    public shipId: string,
    public year: number,
    public amountGco2eq: number,
    public createdAt?: Date
  ) {}
}

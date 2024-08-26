export default class BaseEntity {
  public createdAt: string;
  public updatedAt: string;

  constructor(public id: number) {
    const now = new Date().toISOString();
    this.createdAt = now;
    this.updatedAt = now;
  }
}

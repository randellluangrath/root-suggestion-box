export default class BaseEntity {
  constructor(
    public id: number,
    public createdAt: string = new Date().toISOString(),
    public updatedAt: string = new Date().toISOString()
  ) {}
}

import BaseEntity from "./BaseEntity";

export default class User extends BaseEntity {
  constructor(id: number, public firstName: string, public lastName: string) {
    super(id);
  }
}

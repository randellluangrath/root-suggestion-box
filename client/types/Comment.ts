import BaseEntity from "./BaseEntity";
import User from "./User";

export default class Comment extends BaseEntity {
  constructor(id: number, public body: string, public user: User) {
    super(id);
  }
}

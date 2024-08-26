import BaseEntity from "./BaseEntity";
import Comment from "./Comment";
import User from "./User";

export default class Suggestion extends BaseEntity {
  constructor(
    id: number,
    public title: string,
    public description: string,
    public user: User,
    public comments: Comment[]
  ) {
    super(id);
  }
}

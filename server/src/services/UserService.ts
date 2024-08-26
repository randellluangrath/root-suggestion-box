import { injectable } from "tsyringe";
import User from "../types/User";

@injectable()
export default class UserService {
  private users: User[] = [];

  constructor() {}

  /**
   * Find a user by ID
   * @param userId - The ID of the user to find
   * @returns A promise that resolves to the user, or undefined if not found
   */
  async findByIdAsync(userId: number): Promise<User | undefined> {
    return this.users.find((user) => user.id === userId);
  }

  /**
   * Fetch all users
   * @returns A promise that resolves to an array of users
   */
  async findAllAsync(): Promise<User[]> {
    return this.users;
  }

  /**
   * Create a new user
   * @param firstName - The first name of the user
   * @param lastName - The last name of the user
   * @returns A promise that resolves to the newly created user
   */
  async createAsync(firstName: string, lastName: string): Promise<User> {
    const newUser = new User(this.users.length + 1, firstName, lastName);
    this.users.push(newUser);
    return newUser;
  }
}

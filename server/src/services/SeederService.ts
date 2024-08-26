import { inject, injectable } from "tsyringe";
import UserService from "./UserService";
import SuggestionService from "./SuggestionService";
import { faker } from "@faker-js/faker";
import { SocketService } from "./SocketService";
import { EVENTS } from "../types/Events";

@injectable()
export default class SeederService {
  constructor(
    @inject(UserService) private userService: UserService,
    @inject(SuggestionService) private suggestionService: SuggestionService,
    @inject(SocketService) private socketService: SocketService
  ) {}

  /**
   * Seed users
   * @param count - Number of users to seed
   */
  async seedUsers(count: number): Promise<void> {
    for (let i = 0; i < count; i++) {
      await this.userService.createAsync(
        faker.word.adjective(),
        faker.word.noun()
      );
    }
  }

  /**
   * Seed suggestions
   * @param count - Number of suggestions to seed
   */
  async seedSuggestions(count: number): Promise<void> {
    const users = await this.userService.findAllAsync();
    for (let i = 0; i < count; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];

      const suggestion = await this.suggestionService.createAsync(
        faker.lorem.sentence(),
        faker.lorem.paragraph(),
        randomUser.id
      );

      // Seed comments for each suggestion
      await this.seedComments(suggestion.id, 5); // Example: Seed 5 comments per suggestion
    }
  }

  /**
   * Seed comments for a suggestion
   * @param suggestionId - The ID of the suggestion to seed comments for
   * @param count - Number of comments to seed
   */
  async seedComments(suggestionId: number, count: number): Promise<void> {
    const users = await this.userService.findAllAsync();
    for (let i = 0; i < count; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];

      await this.suggestionService.addCommentAsync(
        suggestionId,
        faker.lorem.sentence(),
        randomUser.id
      );
    }
  }

  /**
   * Start simulating activity by adding suggestions and comments at regular intervals
   * @param suggestionInterval - Interval in milliseconds to add suggestions
   */
  startSimulation(suggestionInterval: number): void {
    setInterval(async () => {
      const users = await this.userService.findAllAsync();
      const randomUser = users[Math.floor(Math.random() * users.length)];

      const suggestion = await this.suggestionService.createAsync(
        faker.lorem.sentence(),
        faker.lorem.paragraph(),
        randomUser.id
      );

      this.socketService.emit(EVENTS.SUGGESTION_CREATED, suggestion);
    }, suggestionInterval);
  }
}

import { inject, injectable } from "tsyringe";
import UserService from "./UserService";
import Suggestion from "../types/Suggestion";
import Comment from "../types/Comment";
import { SocketService } from "./SocketService";
import { EVENTS } from "../types/Events";

@injectable()
export default class SuggestionService {
  private suggestions: Suggestion[] = [];

  constructor(
    @inject(UserService) private userService: UserService,
    @inject(SocketService) private socketService: SocketService
  ) {}

  /**
   * Fetch all suggestions
   * @returns A promise that resolves to an array of suggestions
   */
  async findAllAsync(): Promise<Suggestion[]> {
    return this.suggestions;
  }

  /**
   * Create a new suggestion
   * @param title - The title of the suggestion
   * @param description - The description of the suggestion
   * @param userId - The ID of the user creating the suggestion
   * @returns A promise that resolves to the newly created suggestion
   */
  async createAsync(
    title: string,
    description: string,
    userId: number
  ): Promise<Suggestion> {
    const user = await this.userService.findByIdAsync(userId);

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const newSuggestion = new Suggestion(
      this.suggestions.length + 1,
      title,
      description,
      user,
      []
    );

    this.suggestions.push(newSuggestion);

    // Emit event to notify clients
    this.socketService.emit(EVENTS.SUGGESTION_CREATED, newSuggestion);

    return newSuggestion;
  }

  /**
   * Add a comment to a suggestion
   * @param suggestionId - The ID of the suggestion to add the comment to
   * @param body - The body of the comment
   * @param userId - The ID of the user adding the comment
   */
  async addCommentAsync(
    suggestionId: number,
    body: string,
    userId: number
  ): Promise<void> {
    const existingUser = await this.userService.findByIdAsync(userId);

    if (!existingUser) throw new Error(`No user found with id ${userId}`);

    const existingSuggestion = this.suggestions.find(
      (s) => s.id === Number(suggestionId)
    );

    if (!existingSuggestion) {
      throw new Error(
        JSON.stringify({
          error: "No suggestion found",
          suggestionId,
          suggestions: this.suggestions,
        })
      );
    }

    const newComment = new Comment(
      existingSuggestion.comments.length + 1,
      body,
      existingUser
    );

    existingSuggestion.comments.push(newComment);
    existingSuggestion.updatedAt = new Date().toISOString();
  }
}

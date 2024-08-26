import "reflect-metadata";
import {
  Param,
  Body,
  Get,
  Post,
  Put,
  HttpCode,
  InternalServerError,
  NotFoundError,
  JsonController,
} from "routing-controllers";
import { container } from "tsyringe";
import SuggestionService from "../services/SuggestionService";

@JsonController()
export class SuggestionController {
  private suggestionService: SuggestionService;

  constructor() {
    this.suggestionService = container.resolve(SuggestionService);
  }

  /**
   * Endpoint to get all suggestions.
   *
   * @returns A list of all suggestions.
   * @throws InternalServerError if the operation fails.
   */
  @Get("/suggestions")
  @HttpCode(200)
  async getAll() {
    try {
      return this.suggestionService.findAllAsync();
    } catch (error: any) {
      throw new InternalServerError(
        `Failed to get all suggestions: ${error.message}`
      );
    }
  }

  /**
   * Endpoint to get a specific suggestion by ID.
   *
   * @param id - The ID of the suggestion to retrieve.
   * @returns The suggestion with the specified ID.
   * @throws NotFoundError if the suggestion is not found.
   * @throws InternalServerError if the operation fails.
   */
  @Get("/suggestions/:id")
  @HttpCode(200)
  async getOne(@Param("id") id: number) {
    try {
      const suggestions = await this.suggestionService.findAllAsync();
      const suggestion = suggestions.find((s) => s.id === id);
      if (!suggestion) {
        throw new NotFoundError(`Suggestion with ID ${id} not found`);
      }
      return suggestion;
    } catch (error: any) {
      throw new InternalServerError(
        `Failed to get suggestion with ID ${id}: ${error.message}`
      );
    }
  }

  /**
   * Endpoint to create a new suggestion.
   *
   * @param body - The request body containing the suggestion details.
   * @returns The created suggestion.
   * @throws InternalServerError if the operation fails.
   */
  @Post("/suggestions")
  @HttpCode(201)
  async post(
    @Body() body: { title: string; description: string; userId: number }
  ) {
    const { title, description, userId } = body;
    try {
      return this.suggestionService.createAsync(title, description, userId);
    } catch (error: any) {
      throw new InternalServerError(
        `Failed to create suggestion: ${error.message}`
      );
    }
  }

  /**
   * Endpoint to add a comment to a suggestion.
   *
   * @param suggestionId - The ID of the suggestion to add a comment to.
   * @param body - The request body containing the comment details.
   * @returns A success message.
   * @throws InternalServerError if the operation fails.
   */
  @Put("/suggestions/:id/comments")
  @HttpCode(201)
  async addComment(
    @Param("id") suggestionId: number,
    @Body() body: { comment: string; userId: number }
  ) {
    const { comment, userId } = body;
    try {
      await this.suggestionService.addCommentAsync(
        suggestionId,
        comment,
        userId
      );
      return { message: "Comment added successfully" };
    } catch (error: any) {
      throw new InternalServerError(`Failed to add comment: ${error.message}`);
    }
  }
}

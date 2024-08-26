import "reflect-metadata";
import {
  Body,
  Post,
  HttpCode,
  InternalServerError,
  JsonController,
} from "routing-controllers";
import { container } from "tsyringe";
import AuthenticationService from "../services/AuthenticationService";

@JsonController()
export class UserController {
  private authenticationService: AuthenticationService;

  constructor() {
    this.authenticationService = container.resolve(AuthenticationService);
  }

  /**
   * Endpoint to sign in a user.
   *
   * @param body - The request body containing the user ID.
   * @returns The result of the sign-in operation.
   * @throws InternalServerError if the sign-in operation fails.
   */
  @Post("/users/signin")
  @HttpCode(200)
  async signIn(@Body() body: { id: number }) {
    try {
      // Call the signIn method of the AuthenticationService with the provided user ID
      return this.authenticationService.signIn(body.id);
    } catch (error: any) {
      // Throw an InternalServerError if the sign-in operation fails
      throw new InternalServerError(
        `Failed to sign in user with ID ${body.id}: ${error.message}`
      );
    }
  }
}

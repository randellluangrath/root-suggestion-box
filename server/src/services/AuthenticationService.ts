import jwt from "jsonwebtoken";
import { injectable, inject } from "tsyringe";
import dotenv from "dotenv";
import UserService from "./UserService";
import { NotFoundError } from "routing-controllers";

dotenv.config();

@injectable()
export default class AuthenticationService {
  private signingKey: string;
  private userService: UserService;

  constructor(@inject(UserService) userService: UserService) {
    const signingKey = process.env.SIGNING_KEY;
    if (!signingKey) {
      throw new Error("SIGNING_KEY is not defined in environment variables");
    }
    this.signingKey = signingKey;
    this.userService = userService;
  }

  /**
   * Sign in a user and generate a JWT token
   * @param userId - The ID of the user to sign in
   * @returns An object containing the generated JWT token
   */
  async signIn(userId: number): Promise<{ token: string }> {
    const user = await this.userService.findByIdAsync(userId);
    if (!user) {
      throw new NotFoundError(`User with ID ${userId} not found`);
    }
    const token = this.generateToken({ user }, "1h");
    return { token };
  }

  /**
   * Generate a JWT token
   * @param payload - The payload to include in the token
   * @param expiresIn - The expiration time of the token
   * @returns The generated JWT token
   */
  generateToken(payload: object, expiresIn: string | number): string {
    return jwt.sign(payload, this.signingKey, { expiresIn });
  }

  /**
   * Verify a JWT token
   * @param token - The token to verify
   * @returns The decoded payload
   */
  verifyToken(token: string): object | string {
    return jwt.verify(token, this.signingKey);
  }
}

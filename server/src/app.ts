import "reflect-metadata";
import { createExpressServer } from "routing-controllers";
import { container, DependencyContainer } from "tsyringe";
import bodyParser from "body-parser";
import winston from "winston";
import expressWinston from "express-winston";
import dotenv from "dotenv";
import http from "http";
import { SuggestionController } from "./controllers/SuggestionController";
import { UserController } from "./controllers/UserController";
import UserService from "./services/UserService";
import SuggestionService from "./services/SuggestionService";
import SeederService from "./services/SeederService";
import AuthenticationService from "./services/AuthenticationService";
import { SocketService } from "./services/SocketService";

dotenv.config();

const PORT = process.env.PORT || 3001;

// Register Services
registerServices(container);

const app = createExpressServer({
  controllers: [SuggestionController, UserController],
  defaultErrorHandler: false,
  routePrefix: "/api",
});

// Create HTTP server from the Express app
const server = http.createServer(app);

// Initialize SocketService with the HTTP server
const socketService = container.resolve(SocketService);
socketService.initialize(server);

applyMiddlewares(app);

// Start the Server
server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  const seederService = container.resolve(SeederService);
  await seederService.seedUsers(10);
  await seederService.seedSuggestions(5);

  // Start simulating activity
  seederService.startSimulation(15000); // Add a suggestion every 15 seconds
});

/**
 * Register services with the dependency injection container.
 */
function registerServices(container: DependencyContainer) {
  container.registerSingleton<AuthenticationService>(AuthenticationService);
  container.registerSingleton<UserService>(UserService);
  container.registerSingleton<SuggestionService>(SuggestionService);
  container.registerSingleton<SeederService>(SeederService);
  container.registerSingleton<SocketService>(SocketService);
}

/**
 * @param app - The Express application instance.
 */
function applyMiddlewares(app: any) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(
    expressWinston.logger({
      transports: [new winston.transports.Console()],
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
      ),
      msg: "HTTP {{req.method}} {{req.url}}",
      expressFormat: true,
      colorize: true,
      level: "info",
    })
  );

  app.use(errorHandlerMiddleware);
}

/**
 * @param err - The error object.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function.
 */
function errorHandlerMiddleware(err: any, req: any, res: any, next: any) {
  if (res.headersSent) {
    return next(err);
  }
  console.error("Error:", err.stack);
  res.status(500).json({ error: err.message || "Internal Server Error" });
}

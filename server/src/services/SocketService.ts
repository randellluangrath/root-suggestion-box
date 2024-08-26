import { Server as SocketIOServer, Socket } from "socket.io";
import { injectable } from "tsyringe";

@injectable()
export class SocketService {
  private io: SocketIOServer | null = null;

  /**
   * Initializes the Socket.IO server with the provided HTTP server.
   * @param httpServer - The HTTP server instance to attach Socket.IO to.
   */
  public initialize(httpServer: any): void {
    if (!httpServer) {
      throw new Error(
        "HTTP server instance is required to initialize Socket.IO"
      );
    }

    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: "*",
      },
      connectionStateRecovery: {},
    });
    this.setupEventHandlers();
  }

  /**
   * Sets up the event handlers for Socket.IO.
   */
  private setupEventHandlers(): void {
    if (!this.io) {
      throw new Error("Socket.IO server is not initialized");
    }

    this.io.on("connection", (socket: Socket) => {
      this.handleConnection(socket);
    });
  }

  /**
   * Handles a new client connection to the Socket.IO server.
   * @param socket - The connected client's socket instance.
   */
  private handleConnection(socket: Socket): void {
    console.log("A client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  }

  /**
   * Emits a custom event to all connected clients.
   * @param event - The event name.
   * @param data - The data to send with the event.
   */
  public emit(event: string, data: any): void {
    if (this.io) {
      this.io.emit(event, data);
    }
  }
}

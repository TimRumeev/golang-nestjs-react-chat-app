import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { AuthService } from "./auth.service";
import { BadRequestException, Logger, NotFoundException } from "@nestjs/common";
import { ISocket } from "src/types/socket.type";
import { error, log } from "console";

@WebSocketGateway({
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
		credentials: true,
		transports: ["websocket", "polling"],
	},
	allowEIO3: true,
})
export class AuthGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;
	constructor(private readonly authService: AuthService) {}

	afterInit(server: Server) {
		Logger.log(`${AuthGateway.name} initialized`);
	}
	async handleConnection(client: ISocket, ...args: any[]) {
		const { id } = client;
		const { userId } = client.handshake.query;
		if (!userId) {
			client.disconnect();
			return;
		}
		if (typeof userId !== "string") {
			client.disconnect();

			throw new BadRequestException(`Invalid user id: ${userId}`);
		}
		const user = await this.authService.findUserById(userId);

		if (!user) {
			client.disconnect();
			throw new NotFoundException(`userId ${userId} not found`);
		}

		client.data.user = { id: user.id, username: user.username };

		Logger.log(`Client connected`, { id, user: client.data.user });
	}
	async handleDisconnect(client: ISocket) {
		const { id } = client;
		const { user } = client.data;

		Logger.warn(`Client disconnected`, { id, user });
	}
}

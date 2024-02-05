import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatRoomsService } from "./chat-rooms.service";
import { Prisma } from "@prisma/client";
import { SOCKET_EVENT } from "src/constants/ws.constants";
import { ISocket, TSocketUser } from "src/types/socket.type";
import { SocketID } from "src/utils/socket.decorator";
import { SocketUser } from "src/utils/socket.user.decorator";
import { JoinChatRoomDto } from "./dto/join-chat-room.dto";
import {
	BadRequestException,
	ForbiddenException,
	Logger,
	NotFoundException,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import { NewMessageChatRoomDto } from "./dto/new-message-chat-room.dto";
import { DeleteChatRoomDto } from "./dto/delete-message-chat-room.dto";
import e from "express";
import { SocketAuthGuard } from "src/auth/guards/socket-auth.guard";
import { AuthService } from "src/auth/auth.service";

@WebSocketGateway({
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
		credentials: true,
		transports: ["websocket", "polling"],
	},
	allowEIO3: true,
})
export class ChatRoomsGateway implements OnGatewayInit {
	constructor(
		private readonly chatRoomsService: ChatRoomsService,
		private readonly authService: AuthService,
	) {}
	@WebSocketServer() server: Server;

	afterInit(server: any) {
		console.log(`Server initializied`);
	}
	//@UsePipes(new ValidationPipe())
	@SubscribeMessage(SOCKET_EVENT.JOIN_CHAT_ROOM)
	async handleJoinChatRoom(
		@ConnectedSocket() client: ISocket,
		@SocketID() SocketID: string,
		@SocketUser() user: TSocketUser,
		@MessageBody() dto: JoinChatRoomDto,
	) {
		Logger.warn("SDJKL;LLLLLLLLL");
		const { id: userId, username: username } = user;
		const { chatRoomId } = dto;
		const isAlreadyJoined = await this.chatRoomsService.isUserParticipatedInChatRoom(
			chatRoomId,
			userId,
		);
		if (isAlreadyJoined) {
			Logger.warn(`User ${username} already joined`);
			return;
		}
		await this.chatRoomsService.addParticipantToChatRoom(chatRoomId, userId);

		const event = SOCKET_EVENT.JOINED_CHAT_ROOM;
		const payload = { chatRoomId, user };

		client.emit(event, payload);
		Logger.log({ emit: event, payload });
		return { event: event, data: payload };
	}

	//@UsePipes(new ValidationPipe())
	@SubscribeMessage(SOCKET_EVENT.NEW_MESSAGE_CHAT_ROOM)
	async handleNewMessage(
		@ConnectedSocket() client: ISocket,
		@SocketID() socketId: string,
		@SocketUser() user: TSocketUser,
		@MessageBody() dto: NewMessageChatRoomDto,
	) {
		const { id: userId, username: username } = user;
		const { chatRoomId, message } = dto;
		const isParticipant = await this.chatRoomsService.isUserParticipatedInChatRoom(
			chatRoomId,
			userId,
		);

		if (!isParticipant) {
			throw new ForbiddenException(`User ${username} not participant chat room ${chatRoomId}`);
		}
		const chat = await this.chatRoomsService.addChatToChatRoom(chatRoomId, userId, message);

		const event = SOCKET_EVENT.BROADCAST_NEW_MESSAGE_CHAT_ROOM;
		const payload = { chatRoomId, chat };
		client.emit(event, payload);

		Logger.log({ emit: event, payload });
		return { event: event, data: payload };
	}

	@UsePipes(new ValidationPipe())
	@SubscribeMessage(SOCKET_EVENT.DELETE_MESSAGE_CHAT_ROOM)
	async handleDeleteMessage(
		@ConnectedSocket() client: ISocket,
		@SocketID() socketId: string,
		@SocketUser() user: TSocketUser,
		@MessageBody() dto: DeleteChatRoomDto,
	) {
		const { id: userId, username: username } = user;
		const { chatRoomId, chatId } = dto;

		const isChatBelongsToUser = await this.chatRoomsService.isChatBelongsToUser(chatId, userId);
		if (!isChatBelongsToUser) {
			throw new ForbiddenException(`This chat not belongs to user ${username}`);
		}

		const deletedChat = await this.chatRoomsService.deleteChat(chatId);

		const event = SOCKET_EVENT.DELETED_MESSAGE_CHAT_ROOM;
		const payload = { chatRoomId, chatId };

		client.emit(event, payload);
		Logger.log({ emit: event, payload });
		return { event: event, data: payload };
	}
}

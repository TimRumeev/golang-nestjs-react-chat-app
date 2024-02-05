import { Module } from "@nestjs/common";
import { ChatRoomsController } from "./chat-rooms.controller";
import { ChatRoomsService } from "./chat-rooms.service";
import { ChatRoomsGateway } from "./chat-rooms.gateway";
import { PrismaService } from "src/database/database.service";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "src/auth/auth.service";

@Module({
	controllers: [ChatRoomsController],
	providers: [ChatRoomsService, ChatRoomsGateway, PrismaService, ConfigService, AuthService],
	exports: [ChatRoomsService, ChatRoomsGateway],
})
export class ChatRoomsModule {}

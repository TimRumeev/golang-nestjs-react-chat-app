import { Module } from "@nestjs/common";
import { ChatRoomsController } from "./chat-rooms.controller";
import { ChatRoomsService } from "./chat-rooms.service";
import { ChatRoomsGateway } from "./chat-rooms.gateway";
import { PrismaService } from "src/database/database.service";
import { ConfigService } from "@nestjs/config";

@Module({
	controllers: [ChatRoomsController],
	providers: [ChatRoomsService, ChatRoomsGateway, PrismaService, ConfigService],
	exports: [ChatRoomsService],
})
export class ChatRoomsModule {}

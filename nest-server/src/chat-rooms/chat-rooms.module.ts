import { Module } from "@nestjs/common";
import { ChatRoomsController } from "./chat-rooms.controller";
import { ChatRoomsService } from "./chat-rooms.service";
import { ChatRoomsGateway } from "./chat-rooms.gateway";
import { PrismaService } from "src/database/database.service";

@Module({
	controllers: [ChatRoomsController],
	providers: [ChatRoomsService, ChatRoomsGateway, PrismaService],
	exports: [ChatRoomsService],
})
export class ChatRoomsModule {}

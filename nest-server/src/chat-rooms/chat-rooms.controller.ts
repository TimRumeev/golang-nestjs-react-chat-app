import {
	Body,
	Controller,
	Delete,
	Get,
	Logger,
	NotFoundException,
	Param,
	Post,
	UsePipes,
	Version,
} from "@nestjs/common";
import { ChatRoomsService } from "./chat-rooms.service";
import { ApiOperation, ApiParam } from "@nestjs/swagger";
import { CreateChatRoomDto } from "./dto/create-chat-room.dto";
import { DeleteChatRoomDto } from "./dto/delete-chat-room.dto";
import { AuthMiddleware } from "src/middleware/auth-middleware";

@Controller("chat-rooms")
export class ChatRoomsController {
	constructor(private readonly chatRoomsService: ChatRoomsService) {}

	@ApiOperation({
		summary: "get all chat rooms",
	})
	@Version("1")
	@Get()
	async findAll() {
		return await this.chatRoomsService.findAll();
	}

	@ApiOperation({
		summary: "get chat by room id",
	})
	@ApiParam({
		name: "id",
		required: true,
		type: "string",
		example: "1",
	})
	@Version("1")
	@Get(":id")
	async findById(@Param("id") id: string) {
		const id1 = Number(id);
		if (typeof id1 != "number") {
			return;
		}
		Logger.warn(id1);
		const result = await this.chatRoomsService.findChatRoomById(id1);

		if (!result) {
			throw new NotFoundException("Chat room not found");
		}

		return result;
	}

	@ApiOperation({
		summary: "get chat by room id",
	})
	@ApiParam({
		name: "id",
		required: true,
		type: "string",
		example: "1",
	})
	@Version("1")
	@Post("/create")
	async create(@Body() dto: CreateChatRoomDto) {
		return await this.chatRoomsService.createChatRoom(dto);
	}

	@ApiOperation({
		summary: "get chat by room id",
	})
	@ApiParam({
		name: "id",
		required: true,
		type: "string",
		example: "1",
	})
	@Version("1")
	@Delete(":id")
	async deleteChatRoom(@Param("id") id: number) {
		return await this.chatRoomsService.deleteChatRoom(Number(id));
	}
}

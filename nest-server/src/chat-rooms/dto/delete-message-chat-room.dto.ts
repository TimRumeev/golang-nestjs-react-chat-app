import { IsNotEmpty, IsNumber } from "class-validator";

export class DeleteChatRoomDto {
	@IsNotEmpty()
	@IsNumber()
	chatRoomId: number;

	@IsNotEmpty()
	@IsNumber()
	chatId: number;
}

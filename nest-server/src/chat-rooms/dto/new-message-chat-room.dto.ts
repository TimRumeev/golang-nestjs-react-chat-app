import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class NewMessageChatRoomDto {
	@IsNotEmpty()
	@IsNumber()
	chatRoomId: number;

	@IsNotEmpty()
	@IsString()
	message: string;
}

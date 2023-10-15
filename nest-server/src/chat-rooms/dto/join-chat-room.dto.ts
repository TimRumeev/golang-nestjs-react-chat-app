import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class JoinChatRoomDto {
	@IsNumber()
	chatRoomId: number;
}

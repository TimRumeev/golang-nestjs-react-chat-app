import { IsNumber } from "class-validator";

export class DeleteChatRoomDto {
	@IsNumber()
	id: number;
}

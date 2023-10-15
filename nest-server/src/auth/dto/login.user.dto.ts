import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail } from "class-validator";

export class LoginUserDto {
	@ApiProperty({
		required: true,
		example: "JohnDoe@email.ru",
	})
	@IsEmail({}, { message: "invalid email" })
	email: string;
	@ApiProperty({
		required: true,
		example: "Password",
	})
	@IsString()
	password: string;
}

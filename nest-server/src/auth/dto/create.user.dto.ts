import { ApiProperty } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { IsEmail, IsString } from "class-validator";

export class CreateUserDto {
	@ApiProperty({
		required: true,
		example: "John Doe",
	})
	@IsEmail()
	email: string;
	@ApiProperty({
		required: true,
		example: "JohnDoe@email.ru",
	})
	@IsString()
	username: string;
	@ApiProperty({
		required: true,
		example: "password",
	})
	@IsString()
	password: string;
}

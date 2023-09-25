import { Prisma } from "@prisma/client";
import { IsEmail, IsString } from "class-validator";

export class CreateUserDto {
	@IsEmail()
	email: string;
	@IsString()
	username: string;
	@IsString()
	password: string;
}

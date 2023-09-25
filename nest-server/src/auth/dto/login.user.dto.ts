import { IsString, IsEmail } from "class-validator";

export class LoginUserDto {
	@IsEmail({}, { message: "invalid email" })
	email: string;

	@IsString()
	password: string;
}

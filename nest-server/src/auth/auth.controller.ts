import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	Res,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/login.user.dto";
import { CreateUserDto } from "./dto/create.user.dto";
import { Response as res, response } from "express";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UsePipes(new ValidationPipe())
	@Post("register")
	async register(@Body() dto: CreateUserDto, @Res({ passthrough: true }) response: res) {
		const oldUser = await this.authService.findUser(dto.email);
		if (oldUser) {
			const jwt = this.authService.loginUser(dto.email);
			response.cookie("jwt", (await jwt).token);
			throw new BadRequestException("USER HAS BEEN ALREADY REGISTERED");
		}

		return this.authService.createUser(dto);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post("login")
	async login(@Body() dto: LoginUserDto, @Res({ passthrough: true }) response: res) {
		const { email } = await this.authService.validateUser(dto.email, dto.password);
		const jwt = this.authService.loginUser(email);
		response.cookie("jwt", (await jwt).token, {
			expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
		});
	}

	//, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24) }

	@Get("logout")
	async logout(@Res({ passthrough: true }) response: res) {
		response.cookie("jwt", "", { expires: new Date() });
	}
	//, { expires: new Date() }
}

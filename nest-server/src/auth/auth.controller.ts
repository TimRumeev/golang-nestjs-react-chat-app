import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	Logger,
	Post,
	Req,
	Res,
	UnauthorizedException,
	UsePipes,
	ValidationPipe,
	Version,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/login.user.dto";
import { CreateUserDto } from "./dto/create.user.dto";
import { NextFunction, Request, Response as res, response } from "express";
import { ApiTags } from "@nestjs/swagger";
@ApiTags("Auth")
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}
	@Version("1")
	//@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post("register")
	async register(@Body() dto: CreateUserDto, @Res({ passthrough: true }) response: res) {
		const oldUser = await this.authService.findUser(dto.email);
		if (oldUser) {
			throw new BadRequestException("USER HAS BEEN ALREADY REGISTERED");
		}
		const user = await this.authService.createUser(dto);
		const jwt = await this.authService.loginUser(dto.email);
		response.cookie("jwt", (await jwt).token, {
			expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
			secure: false,
		});
		return { user };
	}
	@Version("1")
	//@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post("login")
	async login(@Body() dto: LoginUserDto, @Res({ passthrough: true }) response: res) {
		const { email } = await this.authService.validateUser(dto.email, dto.password);
		const jwt = this.authService.loginUser(email);
		response.cookie("jwt", (await jwt).token, {
			expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
			secure: false,
		});
		const user = await this.authService.findUser(email);

		return { user: user, jwt: jwt };
	}

	//, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24) }

	@Get("logout")
	async logout(@Res({ passthrough: true }) response: res) {
		response.cookie("jwt", "", { expires: new Date() });
	}
	//, { expires: new Date() }
	@Version("1")
	@Get("getUserByJwt")
	async getUserByJwt(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		next: NextFunction,
	) {
		const cookies = req.cookies;
		const user = this.authService.parseJwt(cookies);
		if (!user) {
			throw new UnauthorizedException("cookie err");
		}
		return { user: user };
	}
}

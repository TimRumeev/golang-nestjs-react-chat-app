import { Injectable, NestMiddleware, Req, Res, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";
import { PrismaService } from "src/database/database.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly jwtService: JwtService,
	) {}
	//req: Request, res: Response, next: NextFunction
	use(@Req() req: Request, @Res({ passthrough: true }) res: Response, next: NextFunction) {
		// const cookie = this.getCookie(req);

		try {
			const cookies = req.cookies;
			const decoded = this.jwtService.decode(cookies.jwt);
			const email = decoded["email"];
			const user = this.prismaService.userModel.findFirst({
				where: {
					email: email,
				},
			});
			if (!user) {
				throw new UnauthorizedException("cookie err");
			}
		} catch (e) {
			throw new UnauthorizedException("user is not authorized");
		}

		next();
	}

	getCookie(req: Request) {
		const cookie = req.headers.cookie;

		return cookie.split("; ");
	}
}

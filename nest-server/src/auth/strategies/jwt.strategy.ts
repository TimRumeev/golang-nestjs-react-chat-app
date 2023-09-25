import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { UserModel } from "@prisma/client";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request as RequestType } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				JwtStrategy.extractJWT,
				ExtractJwt.fromAuthHeaderAsBearerToken(),
			]),
			ignoreExpiration: false,
			secretOrKey: configService.get("JWT_SECRET"),
		});
	}

	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	async validate({ email }: Pick<UserModel, "email">) {
		return email;
	}

	private static extractJWT(req: RequestType): string | null {
		if (req.cookies && "token" in req.cookies && req.cookies.jwt.length > 0) {
			return req.cookies.token;
		}
		return null;
	}
}

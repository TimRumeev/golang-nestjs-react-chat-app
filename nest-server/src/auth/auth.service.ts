import {
	Injectable,
	InternalServerErrorException,
	Logger,
	Req,
	Res,
	UnauthorizedException,
} from "@nestjs/common";
import { compare, genSalt, hash } from "bcryptjs";
import { PrismaService } from "src/database/database.service";
import { CreateUserDto } from "./dto/create.user.dto";
import { LoginUserDto } from "./dto/login.user.dto";
import { JwtService } from "@nestjs/jwt";
import { UserModel } from "@prisma/client";
import { NextFunction, Request } from "express";
import { decode } from "punycode";
import { LoaderTargetPlugin } from "webpack";

@Injectable()
export class AuthService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly jwtService: JwtService,
	) {}

	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	async createUser(dto: CreateUserDto) {
		const salt = await genSalt(10);
		// const newUser = await this.prismaService.userModel.create({
		// 	data: {
		// 		username: dto.username,
		// 		email: dto.email,
		// 		passwordHash: await hash(dto.password, salt),
		// 	},
		// });
		const newUser = await this.prismaService.userModel.create({
			data: {
				email: dto.email,
				username: dto.username,
				passwordHash: await hash(dto.password, salt),
			},
		});
		return newUser;
	}

	async validateUser(email: string, password: string): Promise<Pick<UserModel, "email">> {
		const user = await this.findUser(email);
		if (!user) {
			throw new UnauthorizedException("USER NOT FOUND");
		}
		const isCorrectPassword = await compare(password, user.passwordHash);
		if (!isCorrectPassword) {
			throw new UnauthorizedException("WRONG PASSWORD ERROR");
		}
		return { email: user.email };
	}

	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	async findUser(email: string) {
		return await this.prismaService.userModel.findFirst({
			where: {
				email,
			},
		});
	}
	async findUserById(id: string) {
		const id1 = Number(id);
		return await this.prismaService.userModel.findFirst({
			where: {
				id: id1,
			},
		});
	}
	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	async loginUser(email: string) {
		const payload = { email };

		const access_token = this.jwtService.sign(payload, {
			secret: "secret",
		});

		return { token: access_token };
		// return {
		// 	access_token: await this.jwtService.signAsync(payload, { secret: "secret " }),
		// };
	}

	async parseJwt(jwt: any) {
		const decoded = this.jwtService.decode(jwt["jwt"]);
		const email = decoded["email"];
		const user = await this.prismaService.userModel.findFirst({
			where: {
				email,
			},
		});
		return user;
	}
}

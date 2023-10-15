import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { env } from "process";
import { Socket } from "socket.io";
import { PrismaService } from "src/database/database.service";

@Injectable()
export class SocketAuthGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private readonly jwtService: JwtService,
		private readonly prismaService: PrismaService,
	) {}

	canActivate(context: ExecutionContext): boolean {
		const client: Socket = context.switchToWs().getClient();
		const cookies = client.handshake.headers.cookie;
		const jwtPayload = this.jwtService.verify(cookies, { secret: "secret" });
		const decoded = this.jwtService.decode(jwtPayload);
		const email = decoded["email"];
		const user = this.prismaService.userModel.findFirst({
			where: {
				email: email,
			},
		});
		if (!user) {
			return false;
		}
		return true;
	}
}

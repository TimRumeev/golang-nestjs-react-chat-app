import {
	CanActivate,
	ExecutionContext,
	Injectable,
	Logger,
	UnauthorizedException,
} from "@nestjs/common";
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
		const client = context.switchToWs().getClient();
		const cookies: string[] = client.handshake.headers.cookie;
		const jwt = cookies["jwt"];
		Logger.warn(jwt);
		const jwtPayload = this.jwtService.verify(jwt, { secret: "secret" });
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

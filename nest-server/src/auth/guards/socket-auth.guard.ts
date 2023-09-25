import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class SocketAuthGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const token = context.switchToWs().getClient().handshake.jwt.token;

		if (!token) {
			return false;
		}
		return true;
	}
}

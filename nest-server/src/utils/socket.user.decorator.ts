import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ISocket } from "src/types/socket.type";

export const SocketUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	const client = ctx.switchToWs().getClient<ISocket>();
	return client.data.user;
});

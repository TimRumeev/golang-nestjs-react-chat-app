import { UserModel } from "@prisma/client";
import { Socket } from "socket.io";

export type TSocketUser = Pick<UserModel, "id" | "username">;

export interface ISocket extends Socket {
	data: {
		user: TSocketUser;
	};
}

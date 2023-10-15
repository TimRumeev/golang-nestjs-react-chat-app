import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ChatModel, Message, Prisma, PrismaClient, UserModel } from "@prisma/client";
import { PrismaService } from "src/database/database.service";
import { CreateChatRoomDto } from "./dto/create-chat-room.dto";
import { faker, id_ID, tr } from "@faker-js/faker";
import { DeleteChatRoomDto } from "./dto/delete-chat-room.dto";

@Injectable()
export class ChatRoomsService {
	constructor(private readonly prismaService: PrismaService) {}

	async createChatRoom(createChatRoomDto: CreateChatRoomDto) {
		return await this.prismaService.chatRoomModel.create({
			data: {
				name: createChatRoomDto.name,
			},
		});
	}

	async findChatRoomById(id: number) {
		const id1 = Number(id);
		const room = await this.prismaService.chatRoomModel.findFirst({
			where: {
				id: id1,
			},
			select: {
				participants: true,
				id: true,
				chats: true,
				name: true,
			},
		});
		return { room };
	}

	async findAll() {
		return await this.prismaService.chatRoomModel.findMany();
	}

	async addParticipantToChatRoom(chatRoomId: number, userId: number) {
		// const user = await this.prismaService.userModel.findFirst({
		// 	where: {
		// 		id: userId,
		// 	},
		// });
		// const res = await this.prismaService.chatRoomModel.findFirst({
		// 	where: {
		// 		id: chatRoomId,
		// 	},
		// 	select: {
		// 		participants: true,
		// 	},
		// });
		// await this.prismaService.chatRoomModel.update({
		// 	where: {
		// 		id: chatRoomId,
		// 	},
		// 	//maybe err
		// 	data: {
		// 		participants: {
		// 			set: [...res.participants, user],
		// 		},
		// 	},
		// });

		await this.prismaService.$transaction(async () => {
			const user = await this.prismaService.userModel.findFirst({
				where: {
					id: userId,
				},
				select: {
					username: true,
					email: true,
					passwordHash: true,
				},
			});

			await this.prismaService.chatRoomModel.update({
				where: {
					id: chatRoomId,
				},
				data: {
					participants: {
						updateMany: {
							where: {
								id: userId,
							},
							data: user,
						},
					},
				},
			});

			return await this.prismaService.userModel.update({
				where: {
					id: userId,
				},
				data: {
					chatRoomId: chatRoomId,
				},
			});
		});
	}

	async isUserParticipatedInChatRoom(chatRoomId: number, userId: number) {
		const count = await this.prismaService.chatRoomModel.count({
			where: {
				id: chatRoomId,
				//maybe err
				participants: {
					some: {
						id: userId,
					},
				},
			},
		});

		//Logger.log("ASDFKLASF;ASDJF;ASKLJF;ASDKLFJ", count);
		return !!count;
	}

	async addChatToChatRoom(chatRoomId: number, userId: number, message: string) {
		const user = await this.prismaService.userModel.findFirst({
			where: {
				id: userId,
			},
			select: {
				username: true,
				email: true,
				passwordHash: true,
				chatRoomId: true,
			},
		});
		const chat = await this.prismaService.chatModel.create({
			data: {
				message: message,
				userId: userId,
				chatRoomId: chatRoomId,
			},
			select: {
				id: true,
				message: true,
				userId: true,
				chatRoomId: true,
				user: true,
			},
		});

		const findedChat = await this.prismaService.chatModel.findFirst({
			where: {
				id: chat.id,
			},
			select: {
				message: true,
			},
		});
		await this.prismaService.chatRoomModel.update({
			where: {
				id: chatRoomId,
			},
			data: {
				chats: {
					update: {
						where: {
							id: chat.id,
						},
						data: findedChat,
					},
				},
			},
		});
		return await this.prismaService.chatModel.update({
			where: {
				id: chat.id,
			},
			data: {
				user: {
					update: {
						where: {
							id: userId,
						},
						data: user,
					},
				},
			},
			select: {
				id: true,
				message: true,
				chatRoomId: true,
				userId: true,
				user: true,
			},
		});
	}
	async isChatBelongsToUser(chatId: number, userId: number) {
		const count = await this.prismaService.chatModel.count({
			where: {
				id: chatId,
				userId: userId,
			},
		});
		return !!count;
	}

	async deleteChat(id: number) {
		return await this.prismaService.chatModel.delete({
			where: {
				id: id,
			},
		});
	}

	async deleteChatRoom(id: number) {
		return await this.prismaService.chatRoomModel.delete({
			where: {
				id: id,
			},
		});
	}
}

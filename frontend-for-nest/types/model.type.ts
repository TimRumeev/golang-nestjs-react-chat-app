export type Base = {
  id: number;
};

export type User = Base & {
  username: string;
  email: string;
  password?: string;
};

export type Chat = Base & {
  message: string;
  user: User;
  userId: number;
};

export type ChatRoom = Base & {
  name: string;
  participants: User[];
  chats: Chat[];
};

export type UserInfo = Base & {
  username: string;
  id: number;
};

export type ChatRoomsData = Array<
  Omit<ChatRoom, "chats"> & {
    participants: Array<Pick<User, "id" | "username" | "email">>;
  }
>;

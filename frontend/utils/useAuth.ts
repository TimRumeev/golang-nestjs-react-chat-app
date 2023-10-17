import { use, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Socket, io } from "socket.io-client";
import { SOCKET_EVENT } from "@/constants/socket.constant";
import env from "@/constants/env.constant";
const USER_DATA = "user-data";
type User = { id: number; username: string; email: string; password?: string };

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  socket?.on("connect", () => {
    console.info(`Socket connected: ${socket?.id}`);
  });

  socket?.on("disconnect", () => {
    console.info(`Socket disconnected: ${socket?.id}`);
  });
  //ADD COOKIES AUTH!!!!!!!!!!!!!!!!
  useEffect(() => {
    const storageUserData = localStorage.getItem(USER_DATA);
    if (storageUserData) {
      const parsedUserData = JSON.parse(storageUserData);
      setUser(parsedUserData);

      setSocket(
        io(env.SOCKET_SERVER_URL, { query: { userId: parsedUserData.id } })
      );
    }
  }, []);

  const login = (userData: {
    id: number;
    username: string;
    email: string;
    password?: string;
  }) => {
    localStorage.setItem(USER_DATA, JSON.stringify(userData));
    setUser(userData);

    setSocket(io(env.SOCKET_SERVER_URL, { query: { userId: userData.id } }));
  };

  const logout = async () => {
    localStorage.removeItem(USER_DATA);
    setUser(null);

    socket?.disconnect();
    setSocket(null);
  };

  const joinChatRoom = (chatRoomId: number) => {
    socket?.emit(SOCKET_EVENT.JOIN_CHAT_ROOM, { chatRoomId });
  };

  const sendMessageChatRoom = (chatRoomId: number, message: string) => {
    socket?.emit(SOCKET_EVENT.NEW_MESSAGE_CHAT_ROOM, { chatRoomId, message });
  };

  const deleteMessageChatRoom = (payload: {
    chatRoomId: number;
    chatId: number;
  }) => {
    socket?.emit(SOCKET_EVENT.DELETE_MESSAGE_CHAT_ROOM, payload);
  };

  return {
    user,
    login,
    logout,
    socket,
    joinChatRoom,
    sendMessageChatRoom,
    deleteMessageChatRoom,
  };
}

export function useAuthRedirect({
  user,
  redirectTo = "/login",
}: {
  user: User | null;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      console.log("Redirecting to login page");
      router.push(redirectTo);
    }
    setIsLoading(false);
  }, [router, user, redirectTo, isLoading]);
}

import React, { use, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Socket, io } from "socket.io-client";
import { SOCKET_EVENT } from "@/constants/socket.constant";
import env from "@/constants/env.constant";
import axios from "axios";
import { User } from "@/types/model.type";
import { NextRequest } from "next/server";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { UserContext } from "@/context/auth.context";

export function useAuth() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user, setUser } = useContext(UserContext);

  socket?.on("connect", () => {
    console.info(`Socket connected: ${socket?.id}`);
  });

  socket?.on("disconnect", () => {
    console.info(`Socket disconnected: ${socket?.id}`);
  });
  //ADD COOKIES AUTH!!!!!!!!!!!!!!!!
  useEffect(() => {
    if (user.id) {
      setSocket(io(env.SOCKET_SERVER_URL, { query: { userId: user.id } }));
    }
  }, []);

  const login = (userData: {
    id: number;
    username: string;
    email: string;
    password?: string;
  }) => {
    setSocket(io(env.SOCKET_SERVER_URL, { query: { userId: userData.id } }));
  };

  const logout = async () => {
    const res = axios.get("http://localhost:3001/v1/auth/logout", {
      withCredentials: true,
    });

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
  jwt,
  redirectTo = "/login",
}: {
  user: User | undefined;
  jwt: string | undefined;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    console.log(user?.id, user?.email, user?.username);

    if (!isLoading && !jwt) {
      console.log("Redirecting to login page");
      router.push("/login");
    }
    setIsLoading(false);
  }, [router, user, redirectTo, isLoading]);
}

import React, { use, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Socket, io } from "socket.io-client";
import { SOCKET_EVENT } from "@/constants/socket.constant";
import env from "@/constants/env.constant";
import axios from "axios";
import { UserContext, defaultState } from "@/context/auth.context";
import { useCookies } from "react-cookie";

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
  redirectTo = "/login",
}: {
  redirectTo?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, setUser } = useContext(UserContext);
  const [cookies, setCookies, removeCookies] = useCookies(["jwt"]);
  useEffect(() => {
    if (!loading && !cookies) {
      if (user) {
        setUser(defaultState.user);
      }
      console.log("Redirecting to login page");
      router.push("/login");
    } else if (cookies && !user) {
      const res = axios
        .get(`${env.API_BASE_URL}/v1/auth/getUserByJwt`, {
          withCredentials: true,
        })
        .then((res1) => {
          setUser(res1.data.user);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
    setLoading(false);
  }, [router, cookies, redirectTo, loading]);
}

import React, { use, useContext, useEffect, useReducer, useState } from "react";
import { useRouter } from "next/router";
import { Socket, io } from "socket.io-client";
import { SOCKET_EVENT } from "@/constants/socket.constant";
import env from "@/constants/env.constant";
import axios, { AxiosError } from "axios";
import { UserContext, defaultState } from "@/context/auth.context";
import { useCookies, withCookies } from "react-cookie";

export function useAuth() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();

  socket?.on("connect", () => {
    console.info(`Socket connected: ${socket?.id}`);
  });

  socket?.on("disconnect", () => {
    console.info(`Socket disconnected: ${socket?.id}`);
  });
  //ADD COOKIES AUTH!!!!!!!!!!!!!!!!
  useEffect(() => {
    if (user.id) {
      setSocket(
        io(env.SOCKET_SERVER_URL, {
          query: { userId: user.id },
          transports: ["websocket", "polling"],
        })
      );
    }
  }, []);

  const socketSet = (userData: {
    id: number;
    username: string;
    email: string;
    password?: string;
  }) => {
    setSocket(
      io(env.SOCKET_SERVER_URL, {
        query: { userId: userData.id },
        transports: ["websocket", "polling"],
      })
    );
  };

  const logout = async () => {
    const res = axios.get(`${env.API_BASE_URL}/v1/auth/logout`, {
      withCredentials: true,
    });

    socket?.disconnect();
    setSocket(null);
  };

  const joinChatRoom = (chatRoomId: number) => {
    socket?.emit(SOCKET_EVENT.JOIN_CHAT_ROOM, { dto: chatRoomId });
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

  async function register(email: string, username: string, password: string) {
    try {
      const res = await fetch(`${env.API_BASE_URL}/v1/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          username,
          password,
        }),
      });
      await axios.post(
        `${env.API_BASE_URL}/v1/auth/register`,
        { email: email, username: username, password: password },
        { withCredentials: true }
      );
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        alert(data.user.id);

        socketSet(data.user);
        router.push("/");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log({
          code: error.code,
          message: error.message,
          status: error.response?.status,
          error: error.response?.data,
        });
        if ((error.message = "USER HAS BEEN ALREADY REGISTERED")) {
          alert("user is already registered, try to login");
        } else if (error.message) {
          alert("invalid data. try again");
        }
      }
    }
  }

  async function login(email: string, password: string) {
    try {
      // const { data } = await apiService.post<User>('/v1/auth/login', { em, ps })

      const res = await fetch(`${env.API_BASE_URL}/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      await axios.post(
        `${env.API_BASE_URL}/v1/auth/login`,
        {
          email: email,
          password: password,
        },
        { withCredentials: true }
      );

      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        socketSet(data.user);
      }
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log({
          code: error.code,
          message: error.message,
          status: error.response?.status,
          error: error.response?.data,
        });

        if (error.response?.data) return alert(error.response.data.message);

        return alert("auth failed");
      }
      console.log(error);
      alert("Unknown error");
    }
  }

  return {
    user,
    register,
    login,
    socketSet,
    logout,
    socket,
    joinChatRoom,
    sendMessageChatRoom,
    deleteMessageChatRoom,
  };
}

export async function useAuthRedirect({
  redirectTo = "/login",
  chatRoomId = undefined,
}: {
  redirectTo?: string;
  chatRoomId?: number;
}) {
  const router = useRouter();
  const { socket, socketSet } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, setUser } = useContext(UserContext);
  const [cookies, setCookies, removeCookies] = useCookies(["jwt"]);
  useEffect(() => {
    // if (!socket) {
    //   if (window.location.href == "http://localhost:3000/chat-rooms/") {
    //     socketSet(user);
    //   }
    // }
    // if (socket) {
    //   if (
    //     window.location.href == `http://localhost:3000/chat-rooms/${chatRoomId}`
    //   ) {
    //     if (chatRoomId) {
    //       socket?.emit(SOCKET_EVENT.JOIN_CHAT_ROOM, { chatRoomId });
    //     }
    //   }
    // }

    if (!loading && !cookies) {
      console.log("!LOADING !COOKIES");

      if (user) {
        setUser(defaultState.user);
      }
      console.log("Redirecting to login page");
      router.push("/login");
      setLoading(false);
    }
    if (!user.id) {
      console.log("COOKIES !USER");
      const res = axios
        .get(`${env.API_BASE_URL}/v1/auth/getUserByJwt`, {
          withCredentials: true,
        })
        .then((res) => {
          setUser(res.data);
          console.log(res.data.id);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }

    setLoading(false);
  }, [router, cookies, redirectTo, loading]);
}

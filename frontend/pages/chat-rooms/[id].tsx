/* eslint-disable react-hooks/rules-of-hooks */
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useAuth, useAuthRedirect } from "../../utils/useAuth";
import React, { useContext, useEffect, useState } from "react";
import { Chat, ChatRoom } from "../../types/model.type";
import { ErrorBox } from "../../components/ErrorBox";
import { LoadingSpinner } from "../../components/Loading";
import env from "@/constants/env.constant";
import { SOCKET_EVENT } from "@/constants/socket.constant";
import { cookies } from "next/headers";
import { getCookie } from "cookies-next";
import { UserContext } from "@/context/auth.context";


async function getChatRoomData(id: string) {
	try {
		// const res = await fetch(`${env.API_BASE_URL}/v1/chat-rooms/${id}`, {
		// 	method: "GET",
		// 	headers: { 'Content-Type': 'application/json' },
		// })
		// const data = await res.json()
		// if(res.ok) { 
		// 	return data
		// }
		const router = useRouter()
		const id1 = Number(id)
		const res = axios.get(`http://localhost:3001/v1/chat-rooms/${id1}`)
		if((await res).status == 401) {
			router.push("/login")
		}
		const res1 = await fetch(`${env.API_BASE_URL}/v1/chat-rooms/${id1}`)
		const data = res1.json()
		return data
	} catch (error) {
		if (error instanceof AxiosError) {
      		console.log({
        	code: error.code,
        	status: error.response?.status,
        	error: error.response?.data,
      	});

      	throw new Error('Failed connect to server');
    	}

    	throw new Error('Unknown error');
	}
}

export default function chatRoomPage() { 
	const router = useRouter();
  	const id = router.query.id as string;
  	const { socket, sendMessageChatRoom, deleteMessageChatRoom } = useAuth(); // Updated to use `user` instead of `userId`
  	const [data, setData] = useState<Omit<ChatRoom, 'chats'>>();
  	const [chats, setChats] = useState<Chat[]>();
  	const [loading, setLoading] = useState(true);
  	const [error, setError] = useState('');
	const {user, setUser} = useContext(UserContext)

	const jwt = getCookie("jwt")
	console.log(jwt);
	
	useAuthRedirect({user, jwt})

	useEffect(() => {
		getChatRoomData(id)
				.then((res) => {
					const { chats, ...rest } = res
					setData(rest)
					setChats(chats)
					setLoading(false)
				})
				.catch((err) => {
					setError(err.message)
					setLoading(false)
				})
	}, [id])

	const [newMessage, setNewMessage] = useState('')

	const handleNewMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    	setNewMessage(e.target.value);
  	};
	const handleSubmitMessage = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const trimmedMessage = newMessage.trim()

		if(trimmedMessage !== "") {
			sendMessageChatRoom(Number(id), trimmedMessage)
		}

		setNewMessage("")
	}

	socket?.on(
		SOCKET_EVENT.BROADCAST_NEW_MESSAGE_CHAT_ROOM,
		(payload: { chatRoomId : number; chat: Chat }) => {
			const { chatRoomId, chat } = payload
			if(chatRoomId === Number(id) && !chats?.some((existingChat) => existingChat.id === chat.id)) {

				if(!chats) { 
					setChats([chat])
				} else {
					setChats([...chats, chat])
				}

			}


		}
	)

	const deleteChat = ({chatId, chatRoomId}: {chatId: number, chatRoomId: number}) => {
		console.log({ chatId, chatRoomId });
		const confirmed = confirm("Are you sure you want to delete this chat?")
		
		if(confirmed) { 
			deleteMessageChatRoom({ chatId, chatRoomId })
		}
	}

	socket?.on(
		SOCKET_EVENT.DELETED_MESSAGE_CHAT_ROOM,
		(payload: { chatRoomId: number; chatId: number }) => {
			const { chatRoomId,chatId } = payload

			if(chatRoomId === Number(id)) { 
				const newChats = chats?.filter((chat) => chat.id !== chatId)
				setChats(newChats)
			}
		}
	)
	return (
		
		<div className="w-[85vw] lg:w-[70vw] ">
		<LoadingSpinner isLoading={loading} />
		<ErrorBox error={error} />

		{!loading && !error && (
			<>
			<div className="text-center mt-12 lg:mt-0">
				<h1 className="text-3xl">{data?.name}</h1>
			</div>
			

			<div className="mt-4 grid gap-4 lg:gap-8 bg-slate-500 p-6 lg:p-20 rounded-2xl pb-60">
				{chats?.map((chat, index) => {
					const isCurrentUser = true; // Updated to check user._id

					let className =
						'w-9/12 p-4 lg:p-6 border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit static rounded-xl border bg-gray-200 lg:dark:bg-zinc-800/30';

					if (isCurrentUser) {
						className += ' ml-auto';
					}

					return (
						// => index
						<div key={chat.id} className={className}>
							{!isCurrentUser && (
								<p className="text-sm font-medium mb-1 text-gray-400">~ {chat.user.username}</p>
							)}
							<p>{chat.message}</p>
							<p className="text-right text-gray-400">
								{isCurrentUser && (
									<button
										onClick={(e) => deleteChat({ chatId: chat.id, chatRoomId: Number(id) })}
										className="ml-2 text-red-500"
									>
									<small>delete</small>
									</button>
								)}
							</p>
						</div>
					);
				})}

				<form onSubmit={handleSubmitMessage}>
				<input
					placeholder="Type your message"
					className="outline-none ml-auto w-full p-4 lg:p-6 border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit static rounded-xl border bg-gray-200 lg:dark:bg-zinc-800/30"
					value={newMessage}
					onChange={handleNewMessageChange}
				/>
				</form>
			</div>
			</>
		)}
		</div>
  );
}
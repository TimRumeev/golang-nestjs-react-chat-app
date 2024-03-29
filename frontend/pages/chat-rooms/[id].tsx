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
import { UserContext } from "@/context/auth.context";
import { Socket, io } from "socket.io-client";


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
		
		const id1 = Number(id)
		const res = await fetch(`${env.API_BASE_URL}/v1/chat-rooms/${id}`, {
			method: "GET",
			headers: { 'Content-Type': 'application/json' },
			credentials: "include"
		})
		// if (res.status === 401) { 
		// 	return null;	
		// }
		const data = res.json()
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
		console.log(error)
    	throw new Error('Unknown error');
	}
}

export default function chatRoomPage() { 
	const router = useRouter();
  	const id = router.query.id as string;
  	const { socket, sendMessageChatRoom, deleteMessageChatRoom, socketSet, joinChatRoom  } = useAuth(); // Updated to use `user` instead of `userId`
  	const [data, setData] = useState<Omit<ChatRoom, 'chats'>>();
  	const [chats, setChats] = useState<Chat[]>();
  	const [loading, setLoading] = useState(true);
  	const [error, setError] = useState('');
	const {user, setUser} = useContext(UserContext)
	useAuth()
	useAuthRedirect({chatRoomId: parseInt(id)})
	
	useEffect(() => {
		if(router.isReady) {
			const id1 = router.query.id as string
			console.log(`room id: ${id1}`)
			const res = getChatRoomData(id1)
				
			res.then((res) => {
					const { chats, ...rest } = res
					setData(rest)
					setChats(chats)
					setLoading(false)
				})
				.catch((err) => {
					setError(err.message)
					setLoading(false)
				})
		}
		
		
		
		}, [id])
		useEffect(() => {
			if(user.id) {
				if(!socket) {

					socketSet(user)
				}
			}	
		})

	const [newMessage, setNewMessage] = useState('')

	const handleNewMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    	setNewMessage(e.target.value);
  	};
	const handleSubmitMessage = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const trimmedMessage = newMessage.trim()
		console.log(`handle submit message id: ${id}`);
		
		if(trimmedMessage !== "") {
			sendMessageChatRoom(Number(id), trimmedMessage)
		}

		setNewMessage("")
	}

	socket?.on(
		SOCKET_EVENT.BROADCAST_NEW_MESSAGE_CHAT_ROOM,
		(payload: { chatRoomId : number; chat: Chat }) => {
			const { chatRoomId, chat } = payload
			console.log(`broadcast new message chat room id: ${id}`);
			console.log(`broadcast chatroomid: ${chatRoomId}`)
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
					const chatUser = chat.user
					const isCurrentUser = chatUser.id === user.id // Updated to check user._id

					let className =
						'w-9/12 p-4 lg:p-6 border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit static rounded-xl border bg-gray-200 lg:dark:bg-zinc-800/30';

					if (isCurrentUser) {
						className += ' ml-auto';
					}

					return (
						// => index
						<div key={chat.id} className={className}>
							
							<p className="text-sm font-medium mb-1 text-gray-400">~ {chat.user.id}</p>
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
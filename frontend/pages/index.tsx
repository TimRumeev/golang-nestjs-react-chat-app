import axios, { AxiosError } from "axios";
import { ChatRoom, ChatRoomsData } from "../types/model.type";
import apiService from "../utils/api.service";
import { useAuth, useAuthRedirect} from "../utils/useAuth";
import {NextRouter, useRouter} from "next/router"
import React, { useContext, useEffect, useState } from "react";
import { ErrorBox } from "../components/ErrorBox";
import { LoadingSpinner } from "../components/Loading";
import { UserContext } from "@/context/auth.context";
import env from "@/constants/env.constant";
import { time } from "console";



async function getChatRoomsData(router: NextRouter) {
	try {
		
		const {data} = await apiService.get<ChatRoomsData>("/v1/chat-rooms", {withCredentials: true})
		
		return data
	} catch (err) { 
		if (err instanceof AxiosError) {
			if(err.code === "ERR_BAD_REQUEST") {
				router.push("/login")
			}
			console.log({
				code: err.code,
				status: err.response?.status,
				error: err.response?.data
			});
			throw new Error("Failed connect to server")
		}
		throw new Error("Unknown error")
	}
}

export default function Home() {
	const { socket, joinChatRoom } = useAuth()
	const router = useRouter()
	const [data, setData] = useState<ChatRoomsData>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")
	const {user, setUser} = useContext(UserContext)
	const [roomName, setRoomName] = useState("")
	useAuthRedirect({})
	

	useEffect(() => {
		
		const res = getChatRoomsData(router)
	
		res.then((res) => {
				setData(res)
				setLoading(false)
			})
			.catch((err) => {
			
				setError(err.message)
				setLoading(false)
			});
		
	}, []);
	const handleCreateRoom = async(e: React.SyntheticEvent) => { 
		e.preventDefault()

		const nm = 	roomName.trim()
		if(!nm) return alert("Please, enter room name")

		setLoading(true)

		try{
			axios.post("http://localhost:3001/v1/chat-rooms/create", {
				name: nm
			}, {withCredentials: true})
			
		} catch(error) { 
			if(error instanceof AxiosError) { 
				console.log({
					code: error.code,
					message: error.message,
					status: error.response?.status,
					error: error.response?.status
				});
				
			}
		} finally{
			setRoomName("")
			setLoading(false)
			location.reload()
		}
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setRoomName(e.target.value)
	}

	const handleJoinChatRoom = (chatRoomId: number) => {
		joinChatRoom(chatRoomId)

		router.push(`chat-rooms/${chatRoomId}`)
	}

	return (
    <div className="mt-16 mb-48 lg:mt-0 lg:mb-16">
      <h1 className="text-3xl text-center">Chat Rooms</h1>

      <LoadingSpinner isLoading={loading} />
      <ErrorBox error={error} />
	  <form onSubmit={handleCreateRoom}>
		<input
          className="px-4 py-2 lg:px-6 lg:py-3 lg:text-xl outline-none text-gray-800 rounded-l-lg lg:rounded-l-xl"
          type="text"
          placeholder="Room name"
          value={roomName} // Bind the input value to 'username'
          onChange={handleInputChange} // Handle input changes
        />
		<button
          type="submit"
          className="px-4 py-2 lg:px-6 lg:py-3 lg:text-xl bg-teal-500 font-medium rounded-r-lg lg:rounded-r-xl mt-2"
        >
          Submit
        </button>
	  </form>
      <div className="mt-10 grid md:grid-cols-2 gap-8">
        {!loading &&
          !error &&
          data.map((room) => (
            <div
              key={room.id}
              className="p-8 border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit static w-auto  rounded-xl border bg-gray-200 lg:dark:bg-zinc-800/30"
            >
              <h2 className="text-xl text-center">{room.name}</h2>
              <button
                onClick={() => handleJoinChatRoom(room.id)}
                className="px-4 py-2 bg-teal-500 rounded-lg w-full mt-4 font-medium"
              >
                Join
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}	
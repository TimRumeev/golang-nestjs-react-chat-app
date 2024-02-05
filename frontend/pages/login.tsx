import {useRouter} from "next/router"
import React, { PropsWithChildren, Children, createContext, useContext, useState, Dispatch, SetStateAction, useEffect } from "react";
import { User, UserInfo } from "../types/model.type";
import axios, { AxiosError } from "axios";
import { LoadingSpinner } from "../components/Loading";
import env from "@/constants/env.constant";
import { render } from "react-dom";
import UserProvider, { UserContext } from "@/context/auth.context";
import { useAuth } from "@/utils/useAuth";



export default function LoginPage() { 
	const router = useRouter()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const {user, setUser} = useContext(UserContext)
	const [username, setUsername] = useState('')
	const { login, register } = useAuth()
	const [email1, setEmail1] = useState('')
	const [password1, setPassword1] = useState('')
	// if(!context)  { 
	// 	return null
	// }

	// const { user, setUser } = context
	
	const handleInputEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value)
	}
	const handleInputRegisterEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail1(e.target.value)
	}
	const handleInputPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value)
	}

	const handleInputRegisterPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword1(e.target.value)
	}
	const handleInputUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUsername(e.target.value)
	}

	const handleRegister = async (e: React.SyntheticEvent) => {
		e.preventDefault()
		
		const em = email1.trim()
		if(!em) return alert("Please enter your email")
		const ps = password1.trim()
		if(!ps) return alert("Please enter your password")
		const un = username.trim()
		if(!un) return alert("Please enter your username")

		setLoading(true)

		const res = register(em, ps, un)
		res.then((res) => {
			router.push('/')
		})

		setLoading(false)
	}

	const handleLogin = async (e: React.SyntheticEvent) => { 
		setLoading(true)
		e.preventDefault()

		const em = email.trim()

		if(!em) return alert("Please enter email")

		const ps = password.trim()
		
		if(!ps) return alert("Please enter password")

		
		const res = login(em, ps)
		res.then((res) => {
			router.push('/')
		})
		setLoading(false)
	}
	return (
		<div className="mt-16">
			<LoadingSpinner isLoading={loading} />
			

			<h1 className="text-xl lg:text-3xl text-left lg:text-center mb-1 lg:mb-6">Login</h1>
			<form onSubmit={handleLogin} style={{justifyContent: "center", display: "flex", flexDirection: "column", alignItems: "center"}}>
				<input
				className="px-4 py-2 lg:px-6 lg:py-3 lg:text-xl outline-none text-gray-800 rounded-l-lg lg:rounded-l-xl"
				type="text"
				placeholder="JhonDoe@gmail.com"
				value={email} // Bind the input value to 'username'
				style={{marginRight: 1, marginBottom: 1, borderRadius: 10, width: 400}}
				onChange={handleInputEmailChange} // Handle input changes
				/>
				<input
				className="px-4 py-2 lg:px-6 lg:py-3 lg:text-xl outline-none text-gray-800"
				type="password"
				placeholder="password"
				value={password} // Bind the input value to 'username'
				style={{marginBottom: -6, borderRadius: 10, width: 400}}
				onChange={handleInputPasswordChange} // Handle input changes
				/>

				<button
				type="submit"
				className="px-4 py-2 lg:px-6 lg:py-3 lg:text-xl bg-teal-500 font-medium rounded-r-lg lg:rounded-r-xl mt-2"
				style={{borderRadius: 10}}
				>
				Submit
				
				</button>
				
				
			</form>
			<h1 className="text-xl lg:text-3xl text-left lg:text-center mb-1 lg:mb-6 mt-4">or</h1>

			<form onSubmit={handleRegister} style={{justifyContent: "center", display: "flex", flexDirection: "column", alignItems: "center"}}>
				<input
				className="px-4 py-2 lg:px-6 lg:py-3 lg:text-xl outline-none text-gray-800 rounded-l-lg lg:rounded-l-xl"
				type="text"
				placeholder="JhonDoe@gmail.com"
				value={email1} // Bind the input value to 'username'
				style={{marginRight: 1, marginBottom: 1, borderRadius: 10, width: 400}}
				onChange={handleInputRegisterEmailChange} // Handle input changes
				/>
				<input 
				className="px-4 py-2 lg:px-6 lg:py-3 lg:text-xl outline-none text-gray-800 rounded-l-lg lg:rounded-l-xl"
				type="text"
				placeholder="username"
				value={username} // Bind the input value to 'username'
				style={{marginRight: 1, marginBottom: 1, borderRadius: 10, width: 400}}
				onChange={handleInputUsernameChange} // Handle input changes
				/>
				<input
				className="px-4 py-2 lg:px-6 lg:py-3 lg:text-xl outline-none text-gray-800"
				type="password"
				placeholder="password"
				value={password1} // Bind the input value to 'username'
				style={{marginBottom: -6, borderRadius: 10, width: 400}}
				onChange={handleInputRegisterPasswordChange} // Handle input changes
				/>

				<button
				type="submit"
				className="px-4 py-2 lg:px-6 lg:py-3 lg:text-xl bg-teal-500 font-medium rounded-r-lg lg:rounded-r-xl mt-2"
				style={{borderRadius: 10}}
				>
				Submit
				
				</button>
			</form>
			
			{/* <form onSubmit={handleRegister}>
				<button
				
				type="submit"
				className="px-4 py-2 lg:px-6 lg:py-3 lg:text-xl bg-teal-500 font-medium rounded-r-lg lg:rounded-r-xl mt-2"
				style={{borderRadius: 10}}
				>
				Register
			
				</button>
			</form> */}
			
			
			
		</div>
  );
}

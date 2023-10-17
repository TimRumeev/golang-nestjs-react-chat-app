import {useRouter} from "next/router"
import { useAuth } from "../utils/useAuth";
import { useState } from "react";
import apiService from "../utils/api.service";
import { User, UserInfo } from "../types/model.type";
import axios, { AxiosError } from "axios";
import { LoadingSpinner } from "../components/Loading";
import env from "@/constants/env.constant";

export default function LoginPage() { 
	const { login } = useAuth()
	const router = useRouter()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)

	const handleInputEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value)
	}
	const handleInputPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value)
	}

	const handleLogin = async (e: React.SyntheticEvent) => { 
		e.preventDefault()

		const em = email.trim()

		if(!em) return alert("Please enter email")

		const ps = password.trim()

		if(!ps) return alert("Please enter password")

		setLoading(true)
		
		

		try{
			// const { data } = await apiService.post<User>('/v1/auth/login', { em, ps })
			
			const res = await fetch(`${env.API_BASE_URL}/v1/auth/login`, {
				method: "POST",
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
			})
			axios.post("http://localhost:3001/v1/auth/login", {
				email: email,
				password: password
			}, {withCredentials: true})
			
			const data = await res.json()
			if(res.ok) {
				const user: UserInfo = {
					username: data.user.username,
					id: data.user.id
				}
				localStorage.setItem('user-data', JSON.stringify(user))
				router.push('/')
			}	
			
			
		} catch(error) { 
			if (error instanceof AxiosError) { 
				console.log({
					code: error.code,
					message: error.message,
					status: error.response?.status,
					error: error.response?.data
				});

				if(error.response?.data) return alert(error.response.data.message)

				return alert('auth failed')
			}
			console.log(error);
			alert('Unknown error')
		} finally{
			setLoading(false)
		}
	}

	return (
    <div className="mt-16">
      <LoadingSpinner isLoading={loading} />

      <h1 className="text-xl lg:text-3xl text-left lg:text-center mb-1 lg:mb-6">Enter your name</h1>
      <form onSubmit={handleLogin}>
        <input
          className="px-4 py-2 lg:px-6 lg:py-3 lg:text-xl outline-none text-gray-800 rounded-l-lg lg:rounded-l-xl"
          type="text"
          placeholder="JhonDoe@gmail.com"
          value={email} // Bind the input value to 'username'
          onChange={handleInputEmailChange} // Handle input changes
        />
		<input
		  className="px-4 py-2 lg:px-6 lg:py-3 lg:text-xl outline-none text-gray-800 rounded-l-lg lg:rounded-l-xl"
          type="password"
          placeholder="password"
          value={password} // Bind the input value to 'username'
          onChange={handleInputPasswordChange} // Handle input changes
		/>

        <button
          type="submit"
          className="px-4 py-2 lg:px-6 lg:py-3 lg:text-xl bg-teal-500 font-medium rounded-r-lg lg:rounded-r-xl mt-2"
        >
          Submit
        </button>
      </form>
    </div>
	
  );
}


"use client"
import api from "@/lib/api";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

const authContext = createContext<Props>({
	loggedIn: false,
	login: () => { },
	logout: () => { },
	setUser: (user: { username: string, _id: string }) => { },
	user: {
		_id: "",
		username: ""
	}
})

interface Props {
	loggedIn: boolean,
	login: () => void,
	logout: () => void,
	setUser: (user: { username: string, _id: string }) => void,
	user: {
		_id: string,
		username: string
	}
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [loggedIn, setLoggedIn] = useState(false)
	const [user, setUser] = useState({
		_id: "",
		username: ""
	})
	const router = useRouter()

	const login = () => {
		setLoggedIn(true)
	}

	const logout = () => {
		setLoggedIn(false)
		localStorage.removeItem("token")
		router.push("/login")
	}

	useEffect(() => {
		if (localStorage.getItem("token")) {
			login()
			api.get("/api/user").then((response) => {
				setUser(response?.data?.user)
			}).catch((error) => {
				if (isAxiosError(error))
					if (error.response?.data.message)
						toast.error(error.response.data.message)
					else
						toast.error(error.message)
				else
					toast.error("something went wrong")
				console.log(error)
			})
		}
	}, [])

	return (
		<authContext.Provider value={{ loggedIn, logout, login, user, setUser }}>
			{children}
		</authContext.Provider>
	)
}

export const useAuth = () => {
	return useContext(authContext)
}

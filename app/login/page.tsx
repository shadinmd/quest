"use client";
import Container from "@/components/Container"
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";


const Login = () => {

	const { setUser } = useAuth()
	const {
		register,
		formState: { errors },
		handleSubmit
	} = useForm<formType>({ resolver: zodResolver(loginformSchema) })
	const router = useRouter()

	const submitForm = async (data: formType) => {
		try {
			const response = await api.post("/api/auth/login", data)
			if (response.data.success) {
				localStorage.setItem("token", response.data.token)
				setUser(response.data.user)
				router.push("/")
			}
			else
				toast.error(response.data.message)
		} catch (error) {
			if (isAxiosError(error))
				if (error.response?.data.message)
					toast.error(error.response.data.message)
				else
					toast.error(error.message)
			else

				toast.error("something went wrong")
			console.log(error)
		}
	}
	return (
		<Container className="flex-col gap-10 pb-32">
			<h2 className="text-4xl font-bold">
				Login
			</h2>
			<form onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-3">
				<input
					{...register("username")}
					placeholder="Username"
					type="text"
					className={inputStyle}
				/>
				{errors.username && <p className="text-red-500">{errors.username.message}</p>}
				<input
					{...register("password")}
					placeholder="Password"
					type="password"
					className={inputStyle}
				/>
				{errors.password && <p className="text-red-500">{errors.password.message}</p>}
				<button className="bg-black text-white px-3 py-1 rounded-lg font-bold" type="submit">
					Login
				</button>
				<Link href={"/register"} className="font-bold text-sm">don't have an account ? register here</Link>
			</form>
		</Container>
	)
}

const loginformSchema = z.object({
	username: z.string().min(1, { message: "please enter the username" }),
	password: z.string().min(1, { message: "please enter the password" })
})

type formType = z.infer<typeof loginformSchema>
type className = string

const inputStyle: className = "px-3 py-1 border-2 border-black rounded-lg font-bold"

export default Login

"use client"
import Container from "@/components/Container"
import api from "@/lib/api"
import { isAxiosError } from "axios"
import React, { useState } from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import Link from "next/link"

const Register = () => {

	const router = useRouter()
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<formType>({ resolver: zodResolver(registerFormSchema) })

	const formSubmit = async (data: formType) => {
		console.log(data)
		try {
			const response = await api.post("/api/auth/register", data)
			console.log(response)
			if (response.data.success)
				router.push("/login")
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

	return (<Container className="flex flex-col gap-5 pb-20">
		<h2 className="text-4xl font-bold">Register</h2>
		<form className="flex flex-col gap-3" onSubmit={handleSubmit(formSubmit)}>
			<input
				{...register("username")}
				placeholder="Username"
				type="text"
				className={inputSyle}
			/>
			{errors.username && <p className="text-red-500">{errors.username.message}</p>}
			<input
				{...register("password")}
				placeholder="Password"
				type="password"
				className={inputSyle}
			/>
			{errors.password && <p className="text-red-500">{errors.password.message}</p>}
			<input
				{...register("confirmPassword")}
				placeholder="Confirm Password"
				type="password"
				className={inputSyle}
			/>
			{errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
			<button className="bg-black text-white font-bold px-3 py-1 rounded-lg" type="submit">
				Register
			</button>
			<Link href={"/login"} className="text-gray-400 font-bold">
				allready have an account? <span className="text-black"> Login here</span>
			</Link>
		</form>
	</Container>
	)
}

const registerFormSchema = z.object({
	username: z.string().min(3, { message: "username too short" }),
	password: z.string(),
	confirmPassword: z.string()
}).superRefine(({ confirmPassword, password }, cx) => {
	if (password !== confirmPassword) {
		cx.addIssue({
			code: "custom",
			path: ["confirmPassword"],
			message: "passowrds doesn't match"
		})
	}
})

type formType = z.infer<typeof registerFormSchema>
type className = string

const inputSyle: className = "px-3 py-1 rounded-lg border-2 border-black"

export default Register

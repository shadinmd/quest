"use client"
import React, { useState } from "react"
import {
	Dialog,
	DialogTitle,
	DialogFooter,
	DialogHeader,
	DialogContent,
	DialogDescription,
} from "../ui/dialog"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useAuth } from "@/context/AuthContext"
import { zodResolver } from "@hookform/resolvers/zod"
import { isAxiosError } from "axios"
import { toast } from "sonner"
import api from "@/lib/api"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { Icon } from "@iconify/react/dist/iconify.js"
import TaskInterface from "@/interface/task.interface"

interface Props {
	open: boolean,
	onOpenChange: (open: boolean) => void,
	addTask: (task: TaskInterface) => void,
	group: string
}

const NewTask: React.FC<Props> = ({ open, onOpenChange, addTask, group }) => {
	const { user } = useAuth()

	const {
		register,
		formState: { errors },
		handleSubmit
	} = useForm<formType>({ resolver: zodResolver(formSchema) })

	const formSubmit = async (data: formType) => {
		try {
			const response = await api.post("/api/task", { ...data, group, user: user._id })
			if (response.data.success) {
				console.log(response.data)
				toast.success(response.data.message)
				addTask(response.data.task)
				onOpenChange(false)
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
				toast.error('something went wrong')
			console.log(error)
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger>
				<Icon icon={"typcn:plus"} className="text-4xl outline-none text-green-500" />
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						New Task
					</DialogTitle>
					<DialogDescription>
						create a new task
					</DialogDescription>
				</DialogHeader>
				<form className="flex flex-col gap-2" onSubmit={handleSubmit(formSubmit)}>
					<input
						{...register("title")}
						placeholder="Title"
						type="text"
						className="px-3 py-1 rounded-lg border-2 border-black"
					/>
					{errors.title && <p className="text-red-500">{errors.title.message}</p>}
					<input
						{...register("description")}
						placeholder="Description"
						type="text"
						className="px-3 py-1 rounded-lg border-2 border-black"
					/>
					{errors.description && <p className="text-red-500">{errors.description.message}</p>}
					<button type="submit" className="bg-black text-white font-bold px-3 py-1 rounded-lg">
						Create
					</button>
				</form>
				<DialogFooter>

				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

const formSchema = z.object({
	title: z.string().min(1, { message: "please enter a title" }),
	description: z.string().optional()
})

type formType = z.infer<typeof formSchema>

export default NewTask

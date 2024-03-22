"use client"
import React from "react"
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
import GroupInterface from "@/interface/group.interface"
import { cn } from "@/lib/utils"

interface Props {
	open: boolean,
	onOpenChange: (open: boolean) => void,
	addGroup: (group: GroupInterface) => void,
	children: React.ReactNode,
	className?: string
}

const NewGroup: React.FC<Props> = ({ className, open, onOpenChange, addGroup, children }) => {
	const { user } = useAuth()

	const {
		register,
		formState: { errors },
		handleSubmit
	} = useForm<formType>({ resolver: zodResolver(formSchema) })

	const formSubmit = async (data: formType) => {
		try {
			const response = await api.post("/group", { ...data, user: user._id })
			if (response.data.success) {
				addGroup(response.data.group)
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
			<DialogTrigger className={cn("w-full h-full outline-none", className)}>
				{children}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						New Group
					</DialogTitle>
					<DialogDescription>
						create a new group
					</DialogDescription>
				</DialogHeader>
				<form className="flex flex-col gap-2" onSubmit={handleSubmit(formSubmit)}>
					<input
						{...register("name")}
						placeholder="Name"
						type="text"
						className="px-3 py-1 rounded-lg border-2 border-black"
					/>
					{errors.name && <p className="text-red-500">{errors.name.message}</p>}
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
	name: z.string().min(1, { message: "please enter a title" }),
	description: z.string().optional()
})

type formType = z.infer<typeof formSchema>

export default NewGroup

"use client"
import TaskInterface from "@/interface/task.interface"
import React, { Dispatch, SetStateAction } from "react"
import { Check, Trash, X } from "lucide-react"
import TaskView from "./TaskView"
import api from "@/lib/api"
import { toast } from "sonner"
import { isAxiosError } from "axios"
import YesNoDialog from "../YesNoDialog"

interface Props {
	index: number,
	task: TaskInterface,
	check: (task: TaskInterface) => void,
	uncheck: (task: TaskInterface) => void,
	setTasks: Dispatch<SetStateAction<TaskInterface[]>>
}

const TaskItem: React.FC<Props> = ({ index, setTasks, task, check, uncheck }) => {

	const saveTask = (task: TaskInterface) => {
		setTasks((prev) => {
			const temp = [...prev]
			temp[index] = task
			return temp
		})

		api.put("/api/task", task).then(({ data }) => {
			if (data.success) {
				toast.success(data.message)
			} else {
				toast.error(data.message)
			}
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

	const deleteTask = () => {
		setTasks((prev) => {
			let temp = [...prev]
			return temp.filter((e) => e != task)
		})

		api.delete(`/api/task?id=${task._id}`).then(({ data }) => {
			if (data.success) {
				toast.success(data.message)
			} else {
				toast.error(data.message)
			}
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

	return (
		<div
			className="flex justify-between px-2 py-1 gap-2 items-center w-full h-10 border-2 rounded-lg"
		>
			<div
				className="flex gap-2 w-full items-center justify-start cursor-pointer">
				<TaskView saveTask={saveTask} task={task}>
					<p className="font-bold">
						{task.title}
					</p>
				</TaskView>
			</div>
			<div className="flex items-center gap-2 justify-center">
				<YesNoDialog onYes={deleteTask}>
					<Trash className="text-red-500"/>
				</YesNoDialog>
				{
					task.completed ?
						<X className="text-red-500" onClick={() => uncheck(task)} /> :
						<Check className="text-green-500" onClick={() => check(task)} />
				}
			</div>
		</div>
	)
}

export default TaskItem

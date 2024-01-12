"use client"
import Container from "@/components/Container"
import NewTask from "@/components/NewDaily"
import DailyInterface from "@/interface/daily.interface"
import api from "@/lib/api"
import { useEffect, useState } from "react"
import { ClockLoader } from "react-spinners"
import { toast } from "sonner"
import { isAxiosError } from "axios"
import { Trash } from "lucide-react"

const Daily = () => {
	const [tasks, setTasks] = useState<DailyInterface[]>([])
	const [loading, setLoading] = useState(true)
	const [newModal, setNewModal] = useState(false)

	const addTask = (task: DailyInterface) => {
		const temp = [...tasks]
		temp.push(task)
		setTasks(temp)
	}

	const checkTheBox = async (id: string, i: number) => {
		const temp = [...tasks]
		temp[i].completed = temp[i].completed ? false : true
		setTasks(temp)
		try {
			const response = await api.post("/api/daily/complete", { id, completed: tasks[i].completed })
			if (response.data.success) {
			} else {
				toast.error(response.data.message)
			}
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

	const removeTask = async (id: string) => {
		const temp = [...tasks].filter((e) => e._id != id)
		console.log(temp)
		setTasks(temp)
		try {
			const response = await api.post("/api/daily/delete", { id })
			if (response.data.success) {
				toast.success(response.data.message)
			} else {
				toast.error(response.data.message)
			}
		} catch (error) {
			if (isAxiosError(error))
				if (error.response?.data.message)
					toast.error(error.response.data.message)
				else
					toast.error(error.message)
			else
				toast.error("something went wrong")
			console.log("something went wrong")
		}
	}

	useEffect(() => {
		api.get("/api/daily").then(response => {
			if (response.data.success) {
				setTasks(response.data.tasks)
				setLoading(false)
			}
			else
				toast.error(response.data.messge)
		})
	}, [])

	return (
		<Container className="flex-col items-center justify-center">
			{
				loading ?
					<ClockLoader /> :
					<>
						<div className="flex items-center justify-between px-10 h-20 w-full">
							<p className="text-4xl font-bold">Home</p>
							<NewTask open={newModal} onOpenChange={setNewModal} addTask={addTask} />
						</div>
						<div className="flex flex-col gap-2 h-full w-full items-start justify-start">
							{
								tasks.map((e, i) => (
									<div
										key={i}
										className="flex cursor-pointer border-2 rounded-lg w-full h-min p-3 items-center justify-between text-black font-bold"
									>
										<div onClick={() => checkTheBox(e._id!, i)} className="flex gap-10 w-full justify-start items-center">
											<input
												className="w-7 h-7  text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
												type="checkbox"
												checked={e.completed}
											/>
											<p>
												{e.title}
											</p>
										</div>
										<button onClick={() => removeTask(e?._id!)}>
											<Trash className="text-red-500" />
										</button>
									</div>
								))
							}
						</div>
					</>
			}
		</Container>
	)
}

export default Daily

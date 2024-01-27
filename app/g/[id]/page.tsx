"use client"
import Container from "@/components/Container"
import YesNoDialog from "@/components/YesNoDialog"
import NewTask from "@/components/task/NewTask"
import { useGroup } from "@/context/GroupContext"
import GroupInterface from "@/interface/group.interface"
import TaskInterface from "@/interface/task.interface"
import api from "@/lib/api"
import { isAxiosError } from "axios"
import { Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const Group = ({ params }: { params: { id: string } }) => {

	const [tasks, setTasks] = useState<TaskInterface[]>([])
	const { groups, setGroups } = useGroup()
	const [group, setGroup] = useState<GroupInterface>()
	const [newTaskModal, setNewTaskModal] = useState(false)
	const [hoveredItem, setHoveredItem] = useState<number | undefined>()

	const router = useRouter()

	useEffect(() => {
		api.get(`/api/task?group=${params.id}`).then(({ data }) => {
			if (data.success)
				setTasks(data.tasks)
			else
				toast.error(data.message)
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

		api.get(`/api/group/${params.id}`).then(({ data }) => {
			if (data.success)
				setGroup(data.group)
			else
				toast.error(data.message)
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
	}, [params.id])

	const deleteGroup = () => {
		api.delete(`/api/group/${params.id}`).then(({ data }) => {
			if (data.success) {
				toast.success(data.message)
				const temp = [...groups]
				setGroups(temp.filter((e) => e._id != params.id))
				router.back()
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

	const addTask = (task: TaskInterface) => {
		const temp = [...tasks]
		temp.push(task)
		setTasks(temp)
	}

	const toggleTaskCompletion = async (id: string, i: number) => {
		const temp = [...tasks]
		temp[i].completed = temp[i].completed ? false : true
		setTasks(temp)
		try {
			const { data } = await api.patch("/api/task/complete", { id, completed: temp[i].completed })
			if (!data.success) {
				toast.error(data.message)
			}
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<Container className="flex-col">
			<div className="flex w-full justify-between px-3">
				<p className="text-3xl font-bold">{group?.name}</p>
				<div className="flex gap-2 items-center justify-center">
					<NewTask open={newTaskModal} onOpenChange={setNewTaskModal} addTask={addTask} group={params.id} />
					<YesNoDialog onYes={() => deleteGroup()}>
						<Trash className="text-red-500 cursor-pointer" />
					</YesNoDialog>
				</div>
			</div>
			<div className="flex w-full h-full flex-col items-center justify-start gap-2 py-10">
				{tasks.map((e, i) => (
					<div
						key={i}
						className="flex justify-between px-2 py-1 gap-2 items-center w-full h-10 border-2 rounded-lg"
						onMouseEnter={() => setHoveredItem(i)}
						onMouseLeave={() => setHoveredItem(undefined)}
					>
						<div onClick={() => toggleTaskCompletion(e?._id!, i)} className="flex gap-2 w-full items-center justify-start cursor-pointer">
							<input
								onChange={() => { }}
								className="h-[20px] w-[20px]"
								checked={e.completed}
								type="checkbox"
							/>
							<p className="font-bold">
								{e.title}
							</p>
						</div>
						<Trash className={`text-red-500 transition-all cursor-pointer ${hoveredItem == i ? "visible" : "hidden"}`} />
					</div>
				))}
			</div>
		</Container>
	)
}

export default Group

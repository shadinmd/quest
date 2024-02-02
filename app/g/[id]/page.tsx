"use client"
import Container from "@/components/Container"
import YesNoDialog from "@/components/YesNoDialog"
import NewTask from "@/components/task/NewTask"
import TaskItem from "@/components/task/TaskItem"
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
	const [completedTasks, setCompletedTasks] = useState<TaskInterface[]>([])
	const [inCompleteTasks, setIncompleteTasks] = useState<TaskInterface[]>([])
	const [newTaskModal, setNewTaskModal] = useState(false)

	const router = useRouter()

	useEffect(() => {
		api.get(`/api/task?group=${params.id}`).then(({ data }) => {
			if (data.success) {
				setTasks(data.tasks)
				setCompletedTasks(data.tasks.filter((e: TaskInterface) => e.completed))
				setIncompleteTasks(data.tasks.filter((e: TaskInterface) => e.completed == false))
			}
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
		const temp = [...inCompleteTasks]
		temp.push(task)
		setIncompleteTasks(temp)
	}

	const check = (task: TaskInterface) => {
		setIncompleteTasks((prev) => prev.filter((e) => e != task))
		task.completed = true
		setCompletedTasks((prev) => [...prev, task])

		api.patch("/api/task/complete", { id: task._id, completed: true }).then(({ data }) => {
			if (!data.success) {
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

	const uncheck = (task: TaskInterface) => {
		setCompletedTasks((prev) => prev.filter((e) => e != task))
		task.completed = false
		setIncompleteTasks((prev) => [...prev, task])

		api.patch("/api/task/complete", { id: task._id, completed: false }).then(({ data }) => {
			if (!data.success) {
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
			<div className="flex items-center justify-center p-5 w-full overflow-hidden">
				<div id="task-container" className="flex items-center justify-center h-full w-full overflow-auto">
					<div className="flex gap-10 w-full h-full flex-col items-center justify-start py-10">
						<div className="flex flex-col gap-2 w-full">
							<p className="text-xl font-bold underline">To do</p>
							{inCompleteTasks.map((e, i) => (
								<TaskItem
									setTasks={setIncompleteTasks}
									task={e}
									index={i}
									key={i}
									check={check}
									uncheck={uncheck}
								/>
							))}
						</div>
						<div className="flex flex-col gap-2 w-full">
							<p className="text-xl font-bold underline">Completed</p>
							{completedTasks.map((e, i) => (
								<TaskItem
									setTasks={setCompletedTasks}
									task={e}
									index={i}
									key={i}
									check={check}
									uncheck={uncheck}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</Container>
	)
}

export default Group

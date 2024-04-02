"use client"
import Container from "@/components/Container"
import Navbar from "@/components/Navbar"
import YesNoDialog from "@/components/YesNoDialog"
import NewTask from "@/components/task/NewTask"
import { useGroup } from "@/context/GroupContext"
import GroupInterface from "@/interface/group.interface"
import TaskInterface from "@/interface/task.interface"
import api, { handleAxiosError } from "@/lib/api"
import { Icon } from "@iconify/react/dist/iconify.js"
import { isAxiosError } from "axios"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { ScaleLoader } from "react-spinners"
import { toast } from "sonner"

interface Props {
	params: {
		id: string
	}
}

const Page = ({ params }: Props) => {

	const [tasks, setTasks] = useState<TaskInterface[]>([])
	const [filteredTasks, setFilteredTasks] = useState<TaskInterface[]>([])
	const [newTaskModal, setNewTaskModal] = useState(false)
	const [group, setGroup] = useState<GroupInterface>()
	const [loading, setLoading] = useState(true)
	const [search, setSearch] = useState("")
	const [sort, setSort] = useState("complete")
	const [filter, setFilter] = useState("")

	const { removeGroup } = useGroup()

	const router = useRouter()

	useEffect(() => {
		api.get(`/task?group=${params.id}`)
			.then(({ data }) => {
				if (data.success) {
					setTasks(data.tasks.sort((a: TaskInterface, b: TaskInterface) => new Date(b.updatedAt).getSeconds() - new Date(a.updatedAt).getSeconds()))
				} else {
					toast.error(data.message)
				}
			})
			.catch(error => {
				handleAxiosError(error)
			})

		api.get(`/group/${params.id}`)
			.then(({ data }) => {
				if (data.success) {
					setGroup(data.group)
				} else {
					toast.error(data.message)
				}
			})
			.catch(error => {
				handleAxiosError(error)
			})
			.finally(() => {
				setLoading(false)
			})
	}, [params.id])

	useEffect(() => {
		let filtered = tasks;
		if (search !== "") {
			filtered = tasks.filter(e => e.title?.includes(search));
		}

		if (sort === "date-ascend") {
			filtered.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
		} else if (sort === "date-descend") {
			filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
		}

		if (filter === "filter") {
		}

		if (filter === "complete") {
			filtered = filtered.filter((e) => e.completed)
		}

		if (filter === "incomplete") {
			filtered = filtered.filter((e) => !e.completed)
		}

		setFilteredTasks(filtered);
	}, [search, sort, tasks, filter]);

	const addTask = (task: TaskInterface) => {
		setTasks(prev => [...prev, task])
	}

	const toggleTaskCompletion = (id: string) => {

		let temp = [...tasks]
		const index = temp.findIndex((e) => e._id == id)
		temp[index].completed = !temp[index].completed
		setTasks(temp)

		api.patch("/task/complete", { id: tasks[index]._id, completed: temp[index].completed }).then(({ data }) => {
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

	const deleteTask = useCallback((id: string) => {
		const index = tasks.findIndex(e => e._id == id)
		setTasks((prev) => {
			let temp = [...prev]
			return temp.filter((e) => e._id != tasks[index]._id)
		})

		api.delete(`/task?id=${tasks[index]._id}`).then(({ data }) => {
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
	}, [tasks])

	const deleteGroup = async () => {
		try {
			const { data } = await api.delete(`/group/${params.id}`)
			if (data.success) {
				removeGroup(params.id)
				router.back()
			} else {
				toast.error(data.message)
			}
		} catch (error) {
			handleAxiosError(error)
		}
	}

	if (loading) {
		return (
			<Container className="">
				<ScaleLoader />
			</Container>
		)
	}

	return (
		<Container className="flex flex-col h-full w-full">
			<Navbar title={group?.name} >
			</Navbar>
			<Container className="flex-col justify-start overflow-hidden">
				<div className="flex items-center w-full text-xl border-b-2">
					<input
						autoFocus
						value={search}
						onChange={e => setSearch(e.target.value)}
						placeholder="Search..."
						className="outline-none w-full h-fit py-3 px-6 "
						type="text"
					/>
					<div className="flex items-center w-full h-full">
						<NewTask
							open={newTaskModal}
							onOpenChange={setNewTaskModal}
							addTask={addTask}
							group={params.id}
						>
							<div className="flex items-center justify-center h-full w-full bg-green-300">
								<Icon icon={"mdi:plus"} />
							</div>
						</NewTask>
						<YesNoDialog className="w-full h-full" onYes={deleteGroup} onNo={() => { console.log("oh no") }}>
							<div className="flex items-center justify-center h-full w-full bg-red-300">
								<Icon icon={"mdi:trash"} />
							</div>
						</YesNoDialog>
						<select onChange={(e) => { setSort(e.target.value) }} className="w-full border-r-2 font-semibold text-sm h-full outline-none">
							<option value={"date-descend"}>Date descend</option>
							<option value={"date-ascend"}>Date ascend</option>
						</select>
						<select onChange={(e) => { setFilter(e.target.value) }} className="w-full font-semibold text-sm h-full outline-none">
							<option value={"filter"}>Filter</option>
							<option value={"complete"}>Complete</option>
							<option value={"incomplete"}>In complete</option>
						</select>
					</div>
				</div>
				<div className="w-full h-full max-h-full overflow-y-auto">
					<div id="tasks-scroll" className="w-full">
						{filteredTasks.map((e, i) => (
							<div
								key={i}
								className={`flex text-xl ${e.completed ? "line-through italic hover:bg-green-100" : "hover:bg-red-100"} cursor-pointer border-b-2 font-semibold items-center gap-5 w-full`}
							>
								<div
									onClick={() => { toggleTaskCompletion(e._id!) }}
									className="flex gap-5 items-center w-full h-full py-3 px-6"
								>
									<input
										checked={e.completed}
										onChange={(_e) => toggleTaskCompletion(e._id!)}
										type="checkbox"
										className="accent-green-200 rounded-3xl bg-green-500 w-4 h-4 outline-none"
									/>
									<p className="w-full">{e.title}</p>
								</div>
								<YesNoDialog onYes={() => deleteTask(e._id!)} className="flex items-center justify-center w-14 h-full hover:bg-red-200 hover:text-white text-red-500">
									<Icon icon={"mdi:trash"} />
								</YesNoDialog>
							</div>
						))}
					</div>
				</div>
			</Container >
		</Container >
	)
}

export default Page

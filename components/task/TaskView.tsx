import React, { useState } from "react"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import TaskInterface from "@/interface/task.interface"
import moment from "moment"
import { Save, Trash } from "lucide-react"

interface Props {
	children: React.ReactNode,
	saveTask: (task: TaskInterface) => void,
	task: TaskInterface
}

const TaskView: React.FC<Props> = ({ children, task, saveTask }) => {

	const [description, setDescription] = useState(task.description)

	const deleteTask = () => {

	}

	return (
		<Sheet>
			<SheetTrigger className="flex flex-start outline-none w-full">
				{children}
			</SheetTrigger>
			<SheetContent className="outline-none">
				<SheetHeader>
					<SheetTitle className="font-bold text-2xl">
						{task.title}
					</SheetTitle>
				</SheetHeader>
				<div className="flex flex-col gap-2">
					<div className="flex gap-2 items-center">
						<p className="font-bold">status: </p>
						<p className={`${task.completed ? "text-green-500" : "text-red-500"} font-bold`}> {task.completed ? "completed" : "in complete"}</p>
					</div>
					<div className="flex gap-2 items-center">
						<p className="font-bold">created on: </p>
						<p className="font-bold"> {moment(task.createdAt).format("DD/MM/YYYY")}</p>
					</div>
					{task.completed &&
						<div className="flex gap-2 items-center">
							<p className="font-bold">completed on: </p>
							<p className="font-bold"> {moment(task.createdAt).format("DD/MM/YYYY")}</p>
						</div>
					}
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Description"
						className="outline-none resize-y h-64 p-1 rounded-lg border-black border-2"
					/>
				</div>
				<SheetFooter className="flex gap-2 mt-5 items-center">
					<button
						onClick={() => { }}
						className="border-red-500 border-2 hover:text-white hover:bg-red-500 rounded-lg py-1 px-2 text-red-500"
					>
						<Trash />
					</button>
					<button
						onClick={() => saveTask({ ...task, description })}
						className="border-green-500 border-2 hover:text-white hover:bg-green-500 rounded-lg py-1 px-2 text-green-500"
					>
						<Save />
					</button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}

export default TaskView

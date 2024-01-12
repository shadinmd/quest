"use client"
import Container from "@/components/Container"
import DailyInterface from "@/interface/daily.interface"
import api from "@/lib/api"
import dailyModel from "@/models/daily.model"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const Daily = () => {
	const [tasks, setTasks] = useState<DailyInterface[]>([])

	useEffect(() => {
		// api.get("/api/daily").then(response => {
		// 	if (response.data.success)
		// 		setTasks(response.data.tasks)
		// 	else
		// 		toast.error(response.data.messge)
		// })
	}, [])

	return (
		<Container>
			{
				tasks.map((e, i) => (
					<div key={i}>
						{e.title}
					</div>
				))
			}
		</Container>
	)
}

export default Daily

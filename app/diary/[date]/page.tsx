"use client"

import Container from "@/components/Container"
import Navbar from "@/components/Navbar"
import DiaryInterface from "@/interface/diary.interface"
import api, { handleAxiosError } from "@/lib/api"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface Props {
	params: {
		date: string
	}
}

const Page = ({ params }: Props) => {

	const [newDiary, setNewDiary] = useState(false)
	const [diary, setDiary] = useState<DiaryInterface>({
		title: "",
		user: "",
		content: "",
		date: "",
		createdAt: new Date(),
		updatedAt: new Date()
	})

	useEffect(() => {
		api.get(`/diary?date=${params.date}`)
			.then(({ data }) => {
				if (data.success) {
					if (data.diary)
						setDiary(data.diary)
					else
						setNewDiary(true)
				} else {
					toast.error(data.message)
				}
			})
			.catch(error => {
				handleAxiosError(error)
			})
	}, [params.date])

	const createDiary = async () => {
		try {
			const { data } = await api.post("/diary", { ...diary, date: params.date })
			if (data.success) {
				toast.success(data.message)
				setNewDiary(false)
			} else {
				toast.error(data.message)
			}
		} catch (error) {
			handleAxiosError(error)
		}
	}

	const saveDiary = async () => {
		try {
			const { data } = await api.put("/diary", { ...diary, date: params.date })
			if (data.success) {
				toast.success(data.message)
			} else {
				toast.error(data.message)
			}
		} catch (error) {
			handleAxiosError(error)
		}
	}

	return (
		<Container className="flex-col">
			<Navbar title={params.date} />
			<div className="flex items-center w-full">
				<input
					value={diary?.title}
					onChange={e => setDiary(prev => ({ ...prev, title: e.target.value }))}
					placeholder="Title"
					type="text"
					className="text-xl bg-white w-full px-5 py-3 border-b-2 font-bold outline-none"
				/>
				<div className="flex items-center h-full">
					<button onClick={e => { e.preventDefault(); newDiary ? createDiary() : saveDiary() }} className={`border-2 bg-green-200 font-semibold h-full px-3`}>
						Save
					</button>
				</div>
			</div>
			<textarea
				value={diary?.content}
				onChange={e => setDiary(prev => ({ ...prev, content: e.target.value }))}
				placeholder="Diary entry here...."
				className="h-full w-full outline-none border-b-2 p-5 text-xl font-bold"
			/>
		</Container>
	)
}

export default Page

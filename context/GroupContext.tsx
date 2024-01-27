"use client"
import GroupInterface from "@/interface/group.interface"
import api from "@/lib/api"
import { isAxiosError } from "axios"
import { createContext, useContext, useEffect, useState } from "react"
import { toast } from "sonner"

interface Props {
	groups: GroupInterface[],
	setGroups: (groups: GroupInterface[]) => void
}

const groupContext = createContext<Props>({
	groups: [],
	setGroups: (groups: GroupInterface[]) => { groups }
})

export const GroupProvider = ({ children }: { children: React.ReactNode }) => {
	const [groups, setGroups] = useState<GroupInterface[]>([])

	useEffect(() => {
		api.get("/api/group").then(({ data }) => {
			if (data.success)
				setGroups(data.groups)
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
	}, [])

	return (
		<groupContext.Provider value={{ groups, setGroups }}>
			{children}
		</groupContext.Provider>
	)
}

export const useGroup = () => {
	return useContext(groupContext)
}

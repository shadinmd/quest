"use client"
import GroupInterface from "@/interface/group.interface"
import api from "@/lib/api"
import { isAxiosError } from "axios"
import { createContext, useContext, useEffect, useState } from "react"
import { toast } from "sonner"
import { useAuth } from "./AuthContext"

interface Props {
	groups: GroupInterface[],
	setGroups: (groups: GroupInterface[]) => void,
	fetchGroups: () => void
}

const groupContext = createContext<Props>({
	groups: [],
	setGroups: (groups: GroupInterface[]) => { groups },
	fetchGroups: () => { }
})

export const GroupProvider = ({ children }: { children: React.ReactNode }) => {
	const [groups, setGroups] = useState<GroupInterface[]>([])
	const { loggedIn } = useAuth()

	useEffect(() => {
		if (loggedIn)
			fetchGroups()
	}, [loggedIn])

	const fetchGroups = () => {
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
	}

	return (
		<groupContext.Provider value={{ groups, setGroups, fetchGroups }}>
			{children}
		</groupContext.Provider>
	)
}

export const useGroup = () => {
	return useContext(groupContext)
}

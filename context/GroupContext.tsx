"use client"
import GroupInterface from "@/interface/group.interface";
import api, { handleAxiosError } from "@/lib/api";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
	groups: GroupInterface[],
	removeGroup: (id: string) => void
}

const groupContext = createContext<Props>({
	groups: [],
	removeGroup: () => { }
})

export const GroupProvider = ({ children }: { children: ReactNode }) => {

	const [groups, setGroups] = useState<GroupInterface[]>([])

	const removeGroup = (id: string) => {
		setGroups(groups.filter(e => e._id != id))
	}

	useEffect(() => {
		if (localStorage.getItem("token"))
			api.get("/group")
				.then(({ data }) => {
					if (data.success) {
						setGroups(data.groups)
					} else {
						toast.error(data.message)
					}
				})
				.catch(error => {
					handleAxiosError(error)
				})
	}, [])

	return (
		<groupContext.Provider value={{ groups, removeGroup }}>
			{children}
		</groupContext.Provider>
	)
}

export const useGroup = () => {
	return useContext(groupContext)
}

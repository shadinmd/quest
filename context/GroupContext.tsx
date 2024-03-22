"use client"
import GroupInterface from "@/interface/group.interface";
import api, { handleAxiosError } from "@/lib/api";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
	groups: GroupInterface[]
}

const groupContext = createContext<Props>({
	groups: []
})

export const GroupProvider = ({ children }: { children: ReactNode }) => {

	const [groups, setGroups] = useState<GroupInterface[]>([])

	useEffect(() => {
		if(localStorage.getItem("token"))
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
		<groupContext.Provider value={{ groups }}>
			{children}
		</groupContext.Provider>
	)
}

export const useGroup = () => {
	return useContext(groupContext)
}

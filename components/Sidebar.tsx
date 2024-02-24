"use client"
import { useAuth } from "@/context/AuthContext"
import cn from "@/lib/cn"
import { Icon } from "@iconify/react"
import Link from "next/link"
import YesNoDialog from "./YesNoDialog"
import { useState } from "react"
import GroupInterface from "@/interface/group.interface"
import NewGroup from "./group/NewGroup"
import { useGroup } from "@/context/GroupContext"

type className = string
const linkStyle: className = "flex gap-3 items-center text-xl text-black bg-white px-5 py-2 font-bold rounded-xl border-2"

const Sidebar = () => {
	const { logout, loggedIn } = useAuth()
	const { groups, setGroups, clearGroups } = useGroup()
	const [newGroup, setNewGroup] = useState(false)

	const addGroup = (group: GroupInterface) => {
		const temp = [...groups]
		temp.push(group)
		setGroups(temp)
	}

	return (
		<div className="flex flex-col gap-4 justify-between h-full py-5">
			<Link style={{ pointerEvents: loggedIn ? "auto" : "none" }} className={linkStyle} href={"/"}>Tasks</Link>
			<div id="groups-overflow-container" className="flex h-full w-full items-center justify-center overflow-auto">
				<div className="flex flex-col gap-2 items-center justify-start h-full w-full">
					{
						groups.length > 0 ? groups.map((e, i) => (
							<Link
								key={i}
								href={`/g/${e?._id}`}
								className={cn(linkStyle, "w-full")}
							>
								{e?.name}
							</Link>
						))
							:
							<p>Empty</p>
					}
				</div>
			</div>
			<div className="flex flex-col gap-3">
				<NewGroup open={newGroup} onOpenChange={setNewGroup} addGroup={addGroup}>
					<div className="flex items-center justify-center w-full rounded-xl border-2">
						<Icon icon={"typcn:plus"} className="text-2xl text-green-500 py-1" />
					</div>
				</NewGroup>
				<Link style={{ pointerEvents: loggedIn ? "auto" : "none" }} className={linkStyle} href={"/bucketlist"}>Bucket list</Link>
				{
					loggedIn &&
					<YesNoDialog onYes={() => { logout(); clearGroups() }}>
						<div className={cn(linkStyle, "text-red-500 w-full h-full")}>
							Logout
						</div>
					</YesNoDialog>
				}
				<Link style={{ pointerEvents: loggedIn ? "auto" : "none" }} className={linkStyle} href={"/settings"}>
					<Icon icon={"mdi:gear"} />
					Settings
				</Link>
			</div>
		</div>
	)
}

export default Sidebar

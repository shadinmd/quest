"use client"

import { useEffect, useState } from "react"
import { CommandDialog } from "./ui/command"
import { CommandInput, CommandItem, CommandList } from "cmdk"
import { useGroup } from "@/context/GroupContext"
import { useRouter } from "next/navigation"

const GroupCommand = () => {

	const [open, onOpenChange] = useState(false)
	const { groups } = useGroup()
	const router = useRouter()

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key == "k" && e.ctrlKey) {
				e.preventDefault()
				onOpenChange(!open)
			}
		}

		document.addEventListener("keydown", handler)

		return () => {
			document.removeEventListener("keydown", handler)
		}
	}, [groups, open])

	const onSelect = (id: string) => {
		router.push(`/g/${id}`)
		onOpenChange(false)
	}

	return (
		<CommandDialog open={open} onOpenChange={onOpenChange} >
			<CommandInput className="outline-none px-3" placeholder="Enter a group name" />
			<CommandList className="">
				{
					groups.map((e, i) => (
						<CommandItem key={i} onSelect={() => onSelect(e?._id!)} className="px-5" >
							{e.name}
						</CommandItem>
					))
				}
			</CommandList>
		</CommandDialog>
	)
}

export default GroupCommand

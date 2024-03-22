"use client"

import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select"
import React, { useState } from "react"

interface Props {
	setSearch: (item: string) => void
}

const Sort: React.FC<Props> = ({ setSearch }) => {
	const [sort, setSort] = useState("")

	const handleSelect = (option: string) => {
		setSort(option)
		setSearch(option)
	}

	return (
		<Select defaultValue="none" onValueChange={handleSelect}>
			<SelectTrigger className="w-full h-full outline-none rounded-none">
				{sort || "Sort"}
			</SelectTrigger>
			<SelectContent className="rounded-none bg-white outline-none">
				<SelectItem value="date-descend" className="flex items-center outline-none cursor-pointer">
					date descend
				</SelectItem>
				<SelectItem value="date-ascend" className="flex items-center outline-none cursor-pointer">
					date ascend
				</SelectItem>
				<SelectItem value="Complete" className="flex items-center outline-none cursor-pointer">
					<p>complete</p>
				</SelectItem>
				<SelectItem value="incomplete" className="flex items-center outline-none cursor-pointer">
					<p>in complete</p>
				</SelectItem>
			</SelectContent>
		</Select>
	)
}

export default Sort

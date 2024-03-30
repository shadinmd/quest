"use client"
import Link from "next/link"
import moment from "moment"
import { Icon } from "@iconify/react/dist/iconify.js"
import { useCallback, useState } from "react"

const Calendar = () => {

	const [date, setDate] = useState(new Date(Date.now()))
	const today = new Date(Date.now())
	const numberOfDays = moment(date).daysInMonth()

	const addMonth = useCallback(() => {
		const newDate = new Date(date)
		newDate.setMonth(newDate.getMonth() + 1)
		console.log(newDate)
		setDate(newDate)
	}, [date])

	const minusMonth = useCallback(() => {
		const newDate = new Date(date)
		newDate.setMonth(newDate.getMonth() - 1)
		console.log(newDate, today, newDate.getMonth() == today.getMonth())
		setDate(newDate)
	}, [date])

	return (
		<div className="flex flex-col w-full h-full">
			<div className="flex p-3 items-center justify-center w-full">
				<button onClick={(e) => { e.preventDefault(); minusMonth() }}>
					<Icon icon={"bxs:left-arrow"} className="text-3xl" />
				</button>
				<div className="flex items-center justify-center w-full">
					{moment(date).format("MMMM / YYYY")}
				</div>
				<button onClick={(e) => { e.preventDefault(); addMonth() }}>
					<Icon icon={"bxs:right-arrow"} className="text-3xl" />
				</button>
			</div>
			<div className="grid grid-cols-7 w-full h-full">
				{
					Array(numberOfDays)
						.fill(null)
						.map((_, i) => (
							<Link
								key={i}
								href={`/diary/${i + 1}-${moment(date).format("MM-YYYY")}`}
								className={`flex items-center ${moment(date).format("DD-MM-YYYY") == `${i + 1}-${moment(today).format("MM-YYYY")}` ? "bg-black text-white hover:scale-110" : "hover:bg-gray-200"} transition-all justify-center border text-4xl font-bold`}
							>
								{i + 1}
							</Link>
						))
				}
			</div>
		</div>
	)
}

export default Calendar

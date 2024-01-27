"use client";
import Container from "@/components/Container"
import { memo, useEffect, useState } from "react";
import moment from "moment"

const Clock = memo(() => {
	const [time, setTime] = useState<Date>()

	useEffect(() => {
		const interval = setInterval(() => setTime(new Date()), 500)
		return () => {
			clearInterval(interval)
		}
	}, [])

	return <p suppressHydrationWarning className="flex items-center justify-center text-6xl font-bold">{moment(time).format("HH:mm:ss")}</p>
})

Clock.displayName = "Clock"

const Home = () => {
	return (
		<Container className="flex-col items-center justify-center">
			<Clock />
			<p className="text-3xl font-bold">{moment(new Date()).format("DD/MM/YYYY")}</p>
		</Container>
	)
}


export default Home

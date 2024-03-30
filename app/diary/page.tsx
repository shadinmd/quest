"use client"
import Calendar from "@/components/Calendar"
import Container from "@/components/Container"
import Navbar from "@/components/Navbar"
import moment from "moment"
import { useRouter } from "next/navigation"

const Page = () => {

	const router = useRouter()

	const onSelect = (date: Date | undefined) => {
		if (!date) return
		router.push(`/diary/${moment(date).format("DD-MM-YYYY")}`)
	}

	return (
		<Container className="flex-col">
			<Navbar title="Diary" />
			<Container>
				<Calendar />
			</Container>
		</Container>
	)
}

export default Page

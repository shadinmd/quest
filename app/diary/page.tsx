"use client"
import Calendar from "@/components/Calendar"
import Container from "@/components/Container"
import Navbar from "@/components/Navbar"

const Page = () => {

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

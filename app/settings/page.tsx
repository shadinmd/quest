"use client"
import Container from "@/components/Container"
import Navbar from "@/components/Navbar"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const Settings = () => {

	const router = useRouter()

	const logout = () => {
		localStorage.removeItem("token")
		router.push("/login")
		toast.success("logout successfully")
	}

	return (
		<Container className="flex-col">
			<Navbar title="Settings" />
			<Container className="flex-col gap-5 items-start p-2 justify-start h-full w-full">
				<div className="flex flex-col items-start font-bold gap-2">
					<p className="text-xl">Logout?</p>
					<p className="text-gray-500">logout from this account</p>
					<button onClick={e => { e.preventDefault(); logout() }} className="bg-red-500 font-bold text-white px-3 py-1 rounded-lg">
						Logout
					</button>
				</div>
			</Container>
		</Container>
	)
}

export default Settings

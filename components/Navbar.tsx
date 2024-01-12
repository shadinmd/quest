"use client"
import { useAuth } from "@/context/AuthContext"

const Navbar = () => {
	const { user } = useAuth()

	return (
		<header className="flex justify-between px-10 py-5 w-full">
			<p className="text-3xl font-bold">Quest</p>
			<div className="flex gap-4 items-center">
				{user.username &&
					<p className="text-lg font-bold">{user?.username}</p>
				}
			</div>
		</header >
	);
}

export default Navbar

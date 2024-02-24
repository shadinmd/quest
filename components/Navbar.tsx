"use client"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"

const Navbar = () => {
	const { user } = useAuth()

	return (
		<header className="flex justify-between px-10 py-5 w-full">
			<Link href="/" className="text-3xl font-bold">Quest</Link>
			<div className="flex gap-4 items-center">
				{user.username &&
					<p className="text-lg font-bold">{user?.username}</p>
				}
			</div>
		</header >
	);
}

export default Navbar

"use client"
import { useAuth } from "@/context/AuthContext"
import cn from "@/lib/cn"
import { Icon } from "@iconify/react/dist/iconify.js"
import Link from "next/link"

type className = string
const linkStyle: className = "flex gap-3 items-center text-xl text-black bg-white px-5 py-2 font-bold rounded-xl border-2"

const Sidebar = () => {
	const { logout, loggedIn } = useAuth()

	return (
		<div className="flex flex-col justify-between h-full py-5">
			<div className="flex flex-col gap-3">
				<Link className={linkStyle} href={"/"}>Home</Link>
				<Link className={linkStyle} href={"/daily"}>Daily</Link>
				<Link className={linkStyle} href={"/bucketlist"}>Bucket list</Link>
			</div>
			<div className="flex flex-col gap-3">
				{
					loggedIn &&
					<button className={cn(linkStyle, "text-red-500")} onClick={() => logout()}>
						Logout
					</button>
				}
				<Link className={linkStyle} href={"/settings"}>
					<Icon icon={"mdi:gear"} />
					Settings
				</Link>
			</div>
		</div>
	)
}

export default Sidebar

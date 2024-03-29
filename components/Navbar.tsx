"use client"
import { useAuth } from "@/context/AuthContext"
import { ReactNode } from "react"
import { ResponsiveSidebar } from "./Sidebar"
import { Icon } from "@iconify/react/dist/iconify.js"

interface Props {
	title?: string,
	children?: ReactNode
}

const Navbar = ({ title, children }: Props) => {

	const { user } = useAuth()

	return (
		<header className="flex p-5 border-b-2 justify-between px-10 py-5 w-full">
			<p className="flex w-full win font-bold text-3xl">{title || "Hello"}</p>
			<div className="flex items-center justify-center w-full h-full">
				{children}
			</div>
			<div className="flex items-center">
				<ResponsiveSidebar>
					{user.username ?
						<p className="font-bold text-xl sm:hidden">{user.username}</p>
						:
						<Icon className="font-bold text-xl sm:hidden" icon={"mdi:menu"} />
					}
				</ResponsiveSidebar >
				<p className="font-bold text-xl hidden sm:block">{user.username}</p>
			</div>
		</header >
	);
}

export default Navbar

"use client"
import { useAuth } from "@/context/AuthContext"
import { ReactNode, useEffect, useState } from "react"
import { ResponsiveSidebar } from "./Sidebar"
import { Icon } from "@iconify/react/dist/iconify.js"
import { Moon, Sun } from "lucide-react"

interface Props {
	title?: string,
	children?: ReactNode
}

type Theme = "dark" | "light"

const Navbar = ({ title, children }: Props) => {

	const { user } = useAuth()

	const [theme, setTheme] = useState<Theme>("dark")

	useEffect(() => {
		let selectedTheme = localStorage.getItem("theme")
		if (isValidTheme(selectedTheme)) {
			setTheme(selectedTheme)
			return
		} else {
			localStorage.removeItem("theme")
		}

		let systemTheme: Theme = window.matchMedia("(prefers-color-scheme: dark)") ? "dark" : "light"
		setTheme(systemTheme)
	}, [])

	const isValidTheme = (value: string | null): value is Theme => {
		return (value === "light" || value === "dark")
	}

	useEffect(() => {
		if (theme == "dark") {
			document.documentElement.classList.add("dark")
		} else {
			document.documentElement.classList.remove("dark")
		}
	}, [theme])

	return (
		<header className="flex dark:bg-gray dark:text-white p-5 border-b-2 justify-between px-10 py-5 w-full">
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
				<div className="flex items-center gap-5">
					{
						theme == "dark" ?
							<Moon onClick={() => { setTheme("light"); localStorage.setItem("theme", "light") }} className="size-4 text-white cursor-pointer" /> :
							<Sun onClick={() => { setTheme("dark"); localStorage.setItem("theme", "dark") }} className="size-4 text-black cursor-pointer" />
					}
					<p className="font-bold text-xl hidden sm:block">{user.username}</p>
				</div>
			</div>
		</header >
	);
}

export default Navbar

"use client"

import { useAuth } from "@/context/AuthContext";
import { ReactNode } from "react";

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
				<p className="font-bold text-xl">{user.username}</p>
			</div>
		</header >
	);
}

export default Navbar

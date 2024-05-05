import cn from "@/lib/cn"
import { ClassValue } from "clsx"
import React from "react"

interface Props {
	className?: ClassValue,
	children?: React.ReactNode
}

const Container: React.FC<Props> = ({ className, children }) => {
	return (
		<div className={cn("flex items-center justify-center h-full w-full dark:bg-gray dark:text-white", className)}>
			{children}
		</div>
	)
}

export default Container 

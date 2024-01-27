import React, { useState } from "react"
import { Dialog, DialogTrigger, DialogTitle, DialogContent, DialogHeader, DialogDescription } from "./ui/dialog"

interface Props {
	onYes: () => void,
	onNo?: () => void,
	open?: boolean,
	onOpenChange?: (open: boolean) => void,
	children?: React.ReactNode
}

const YesNoDialog: React.FC<Props> = ({ onNo, onYes, onOpenChange, open, children }) => {
	const [dialog, setDialog] = useState(false)

	const no = () => {
		if (onOpenChange)
			onOpenChange(false)
		else
			setDialog(false)

		if (onNo)
			onNo()
	}

	const yes = () => {
		if (onOpenChange)
			onOpenChange(false)
		else
			setDialog(false)
		onYes()
	}

	return (
		<Dialog onOpenChange={onOpenChange || setDialog} open={open || dialog}>
			<DialogTrigger className="outline-none">
				{children}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						Confirm
					</DialogTitle>
					<DialogDescription>
						Please confirm the action you are about to do
					</DialogDescription>
				</DialogHeader>
				<div className="flex gap-5 justify-evenly w-full">
					<button
						className="text-green-500 w-full border-green-500 border px-2 py-1 rounded-lg hover:bg-green-500 hover:text-white transition-all"
						onClick={() => yes()}
					>
						Yes
					</button>
					<button
						className="text-red-500 w-full border-red-500 border px-2 py-1 rounded-lg hover:bg-red-500 hover:text-white transition-all"
						onClick={() => no()}
					>
						No
					</button>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default YesNoDialog

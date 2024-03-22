"use client"
import Container from "@/components/Container"
import GroupInterface from "@/interface/group.interface"
import api, { handleAxiosError } from "@/lib/api"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import Navbar from "@/components/Navbar"
import NewGroup from "@/components/group/NewGroup"
import { Icon } from "@iconify/react/dist/iconify.js"
import { ScaleLoader } from "react-spinners"
import { useRouter } from "next/navigation"

const Page = () => {

	const [groups, setGroups] = useState<GroupInterface[]>([])
	const [filteredGroups, setFilteredGroups] = useState<GroupInterface[]>([])
	const [newGroupModal, setNewGroupModal] = useState(false)
	const [loading, setLoading] = useState(true)
	const [search, setSearch] = useState("")

	const router = useRouter()

	useEffect(() => {
		api.get("/group")
			.then(({ data }) => {
				if (data.success) {
					setGroups(data.groups)
				} else {
					toast.error(data.message)
				}
			})
			.catch(error => {
				handleAxiosError(error)
			})
			.finally(() => {
				setLoading(false)
			})
	}, [])

	const addGroup = (group: GroupInterface) => {
		setGroups(prev => [...prev, group])
	}

	useEffect(() => {

		if (search != "") {
			setFilteredGroups(groups.filter((e) => e.name?.includes(search)))
		} else {
			setFilteredGroups(groups)
		}

	}, [search, groups])

	if (loading) {
		return (
			<Container>
				<ScaleLoader />
			</Container>
		)
	}

	return (
		<Container className="flex-col">
			<Navbar title="Tasks" />
			<Container className="flex-col justify-start">
				<div className="flex items-center w-full text-xl border-b-2">
					<input
						autoFocus
						value={search}
						onChange={e => setSearch(e.target.value)}
						placeholder="Search..."
						className="outline-none w-full h-fit py-3 px-6 "
						type="text"
						onKeyDown={e => {
							if (e.key == "Enter")
								if (filteredGroups[0])
									router.push(`/tasks/${filteredGroups[0]._id}`)
						}}
					/>
					<div className="flex items-center h-full w-14 justify-center">
						<NewGroup open={newGroupModal} onOpenChange={setNewGroupModal} addGroup={addGroup} >
							<div className="flex gap-1 bg-green-200 w-full h-full items-center justify-center">
								<Icon icon={"mdi:plus"} className="text-2xl" />
							</div>
						</NewGroup>
					</div>
				</div>
				{filteredGroups.map((e, i) => (
					<Link
						key={i}
						href={`/tasks/${e._id}`}
						className="flex hover:bg-gray-100 transition-all px-8 py-3 border-b-2 w-full"
					>
						<p className="text-xl font-bold">{e?.name}</p>
					</Link>
				))}
			</Container>
		</Container>
	)
}

export default Page

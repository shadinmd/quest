"use client"
import Container from "@/components/Container"
import Navbar from "@/components/Navbar"
import YesNoDialog from "@/components/YesNoDialog"
import NewBucket from "@/components/bucket/NewBucket"
import BucketInterface from "@/interface/bucket.interface"
import api, { handleAxiosError } from "@/lib/api"
import { Icon } from "@iconify/react/dist/iconify.js"
import { useCallback, useEffect, useState } from "react"
import { ScaleLoader } from "react-spinners"
import { toast } from "sonner"

const Page = () => {

	const [loading, setLoading] = useState(true)
	const [search, setSearch] = useState("")
	const [buckets, setBuckets] = useState<BucketInterface[]>([])
	const [filteredBuckets, setFilteredBuckets] = useState<BucketInterface[]>([])
	const [newBucketModel, setNewBucketModel] = useState(false)
	const [sort, setSort] = useState("complete")
	const [filter, setFilter] = useState("")


	useEffect(() => {
		api.get(`/bucket`)
			.then(({ data }) => {
				if (data.success) {
					setBuckets(data.buckets)
				} else {
					toast.error(data.message)
				}
			})
			.catch(error => {
				handleAxiosError(error)
			}).finally(() => {
				setLoading(false)
			})
	}, [])

	useEffect(() => {
		let filtered = buckets
		if (search !== "") {
			filtered = buckets.filter(e => e.title?.includes(search));
		}

		if (filter === "filter") {
		}

		if (filter === "complete") {
			filtered = filtered.filter((e) => e.completed)
		}

		if (filter === "incomplete") {
			filtered = filtered.filter((e) => !e.completed)
		}

		setFilteredBuckets(filtered);

	}, [search, buckets, filter, sort])

	const toggleTaskCompletion = (id: string) => {
		let temp = [...buckets]
		const index = temp.findIndex(e => e._id == id)
		temp[index].completed = !temp[index].completed
		setBuckets(temp)
	}

	const deleteTask = useCallback((id: string) => {
		const index = buckets.findIndex(e => e._id == id)
		setBuckets((prev) => {
			let temp = [...prev]
			return temp.filter((e) => e._id != buckets[index]._id)
		})

		api.delete(`/bucket?id=${buckets[index]._id}`).then(({ data }) => {
			if (data.success) {
				toast.success(data.message)
			} else {
				toast.error(data.message)
			}
		}).catch((error) => {
			handleAxiosError(error)
		})
	}, [buckets])

	const addBucket = (bucket: BucketInterface) => {
		setBuckets(prev => [...prev, bucket])
	}

	if (loading) {
		return (
			<Container className="">
				<ScaleLoader />
			</Container>
		)
	}

	return (
		<Container className="flex flex-col h-full w-full">
			<Navbar title="Bucket" >
			</Navbar>
			<Container className="flex-col justify-start overflow-hidden">
				<div className="flex items-center w-full text-xl border-b-2">
					<input
						autoFocus
						value={search}
						onChange={e => setSearch(e.target.value)}
						placeholder="Search..."
						className="outline-none w-full h-fit py-3 px-6 "
						type="text"
					/>
					<div className="flex items-center w-full h-full">
						<NewBucket
							open={newBucketModel}
							onOpenChange={setNewBucketModel}
							addBucket={addBucket}
						>
							<div className="flex items-center justify-center h-full w-full bg-green-300">
								<Icon icon={"mdi:plus"} />
							</div>
						</NewBucket>
						<select onChange={(e) => { setSort(e.target.value) }} className="w-full border-r-2 font-semibold text-sm h-full outline-none">
							<option value={"date-descend"}>Date descend</option>
							<option value={"date-ascend"}>Date ascend</option>
						</select>
						<select onChange={(e) => { setFilter(e.target.value) }} className="w-full font-semibold text-sm h-full outline-none">
							<option value={"filter"}>Filter</option>
							<option value={"complete"}>Complete</option>
							<option value={"incomplete"}>In complete</option>
						</select>
					</div>
				</div>
				<div className="w-full h-full max-h-full overflow-y-auto">
					<div id="tasks-scroll" className="w-full">
						{filteredBuckets.map((e, i) => (
							<div
								key={i}
								className={`flex text-xl ${e.completed ? "line-through italic hover:bg-green-100" : "hover:bg-red-100"} cursor-pointer border-b-2 font-semibold items-center gap-5 w-full`}
							>
								<div
									onClick={() => { toggleTaskCompletion(e._id!) }}
									className="flex gap-5 items-center w-full h-full py-3 px-6"
								>
									<input
										checked={e.completed}
										onChange={(_e) => toggleTaskCompletion(e._id!)}
										type="checkbox"
										className="accent-green-200 rounded-3xl bg-green-500 w-4 h-4 outline-none"
									/>
									<p className="w-full">{e.title}</p>
								</div>
								<YesNoDialog onYes={() => deleteTask(e._id!)} className="flex items-center justify-center w-14 h-full hover:bg-red-200 hover:text-white text-red-500">
									<Icon icon={"mdi:trash"} />
								</YesNoDialog>
							</div>
						))}
					</div>
				</div>
			</Container >
		</Container >
	)
}

export default Page


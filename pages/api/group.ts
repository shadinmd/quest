import authorize from "@/lib/authorize"
import connectDb from "@/lib/connectDb"
import GroupModel from "@/models/group.model"
import { NextApiRequest, NextApiResponse } from "next"

connectDb()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		if (req.method == "OPTIONS") {
			res.status(200).end()
			return
		}

		if (req.method && !(["GET", "POST"].includes(req.method))) {
			res.status(404).end()
			return
		}

		const user = authorize(req, res)
		if (user) {
			if (req.method == "GET") {
				const groups = await GroupModel.find({ user })

				res.status(200).send({
					success: true,
					message: "groups fetched",
					groups
				})

				return
			}

			if (req.method == "POST") {
				const { name, description } = req.body
				const groupSearch = await GroupModel.findOne({ name })
				if (groupSearch) {
					res.status(400).send({
						success: false,
						message: "group allready exists"
					})
					return
				}

				const group = await new GroupModel({ name, description, user }).save()
				res.status(200).send({
					success: true,
					message: "group created successfully",
					group
				})

				return
			}
		}
	} catch (error) {
		console.log(error)
		res.status(500).send({
			success: false,
			message: "server error"
		})
	}
}

export default handler

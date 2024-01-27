import authorize from "@/lib/authorize";
import connectDb from "@/lib/connectDb";
import taskModel from "@/models/task.model";
import { NextApiRequest, NextApiResponse } from "next";

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
				const { group } = req.query
				const tasks = await taskModel.find({ group })

				res.status(200).send({
					success: true,
					message: "tasks fetched",
					tasks
				})

				return
			}

			if (req.method == "POST") {
				const { title, description, group } = req.body

				if (!title || !group) {
					res.status(400).send({
						success: false,
						message: "please fill all fields"
					})

					return
				}

				const task = await new taskModel({ title, description, group, user }).save()
				res.status(200).send({
					success: true,
					message: "task created",
					task
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

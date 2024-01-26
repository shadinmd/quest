import authorize from "@/lib/authorize"
import connectDb from "@/lib/connectDb"
import taskModel from "@/models/task.model"
import { NextApiRequest, NextApiResponse } from "next"

connectDb()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		if (req.method == "OPTIONS") {
			res.status(200).end()
			return
		}

		const user = authorize(req, res)

		if (user) {
			const { title, description } = req.body
			if (!title) {
				res.status(400).send({
					success: false,
					message: "please fill all fields"
				})
				return
			}

			const task = await new taskModel({ title, description, user }).save()

			res.status(200).send({
				success: true,
				message: "task created successfully",
				task
			})
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

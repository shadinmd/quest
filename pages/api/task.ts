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

		const user = authorize(req, res)

		if (user) {
			const tasks = await taskModel.find({ user })

			res.status(200).send({
				success: true,
				message: "tasks fetched",
				tasks
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

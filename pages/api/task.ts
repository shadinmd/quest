import authorize from "@/lib/authorize";
import connectDb from "@/lib/connectDb";
import taskModel from "@/models/task.model";
import { NextApiRequest, NextApiResponse } from "next";

connectDb()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const id = authorize(req)
		if (!id) {
			res.status(401).send({
				success: false,
				message: "you are unathorized",
				error: "unauthorized"
			})
		}

		const tasks = await taskModel.find({ user: id })

		res.status(200).send({
			success: true,
			message: "tasks fetched",
			tasks
		})

	} catch (error) {
		console.log(error)
		res.status(500).send({
			success: false,
			message: "server error"
		})
	}
}

export default handler

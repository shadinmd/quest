import taskModel from "@/models/task.model"
import { NextApiResponse, NextApiRequest } from "next"
import connectDb from "@/lib/connectDb"
import authorize from "@/lib/authorize"

connectDb()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		if (req.method == "OPTIONS") {
			res.status(200).end()
			return
		}

		const user = authorize(req, res)
		if (user) {
			const { id } = req.body

			const task = await taskModel.deleteOne({ _id: id })

			res.status(200).send({
				success: true,
				message: "task deleted successfully"
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

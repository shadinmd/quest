import taskModel from "@/models/task.model"
import { NextApiResponse, NextApiRequest } from "next"
import connectDb from "@/lib/connectDb"

connectDb()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const { id } = req.body

		const task = await taskModel.deleteOne({ _id: id })

		res.status(200).send({
			success: true,
			message: "task deleted successfully"
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

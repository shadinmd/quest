import connectDb from "@/lib/connectDb"
import dailyModel from "@/models/daily.model"
import { NextApiRequest, NextApiResponse } from "next"

connectDb()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	try {

		if (req.method == "OPTIONS") {
			res.status(200).end()
			return
		}

		const { id, completed } = req.body

		const updatedTask = await dailyModel.updateOne({ _id: id }, { $set: { completed } })

		res.status(200).send({
			success: true,
			message: "task updated",
			task: updatedTask
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

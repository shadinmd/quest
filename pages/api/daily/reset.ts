import dailyModel from "@/models/daily.model"
import { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const tasks = await dailyModel.updateMany({}, { $set: { completed: false } })
		res.status(200).send({
			success: true,
			message: "tasks resetted",
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

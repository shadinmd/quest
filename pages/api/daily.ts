import authorize from "@/lib/authorize"
import dailyModel from "@/models/daily.model"
import { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const id = authorize(req)
		if (!id) {
			res.status(401).send({
				success: false,
				error: "unauthorized",
				message: "please login first"
			})
			return
		}

		const tasks = await dailyModel.find({ user: id })

		res.status(200).send({
			success: true,
			message: "fetched daily tasks",
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

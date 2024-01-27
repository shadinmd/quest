import authorize from "@/lib/authorize";
import GroupModel from "@/models/group.model";
import taskModel from "@/models/task.model";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		if (req.method == "OPTIONS") {
			res.status(200).end()
			return
		}

		const user = authorize(req, res)

		if (user) {
			if (req.method == "GET") {
				const { id } = req.query

				if (!id) {
					res.status(400).send({
						success: false,
						message: "id not provided"
					})
					return
				}

				const group = await GroupModel.findOne({ _id: id })

				res.status(200).send({
					success: true,
					message: "group data fetched",
					group
				})
				return
			}

			if (req.method == "DELETE") {
				const { id } = req.query
				console.log(id);

				if (!id) {
					res.status(400).send({
						success: false,
						message: "id not provided"
					})
					return
				}

				await GroupModel.deleteOne({ _id: id })
				await taskModel.deleteMany({ group: id })

				res.status(200).send({
					success: true,
					message: "group deleted successfully"
				})
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

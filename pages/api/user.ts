import authorize from "@/lib/authorize"
import connectDb from "@/lib/connectDb"
import userModel from "@/models/user.model"
import { NextApiRequest, NextApiResponse } from "next"

connectDb()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		if (req.method == "OPTIONS") {
			res.status(200).end()
			return
		}

		if (req.method !== "GET") {
			res.status(404).send({})
			return
		}

		const id = authorize(req, res)

		if (id) {
			const user = await userModel.findOne({ _id: id })

			res.status(200).send({
				success: true,
				message: "user data fetched successfully",
				user
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

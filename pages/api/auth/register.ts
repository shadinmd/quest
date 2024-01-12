import userModel from "@/models/user.model"
import { NextApiRequest, NextApiResponse } from "next"
import bcrypt from "bcrypt"
import connectDb from "@/lib/connectDb"

connectDb()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const { username, password } = req.body

		if (!username || !password) {
			res.status(400).send({
				success: false,
				message: "please fill all fields"
			})

			return
		}

		const existingUser = await userModel.findOne({ username })
		if (existingUser) {
			res.status(400).send({
				success: false,
				message: "username allready used"
			})

			return
		}

		const salt = bcrypt.genSaltSync(10)
		const hashedPassword = bcrypt.hashSync(password, salt)

		await new userModel({ username, password: hashedPassword }).save()

		res.status(200).send({
			success: true,
			message: "user created successfully"
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

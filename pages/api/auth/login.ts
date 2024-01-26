import userModel from "@/models/user.model"
import { NextApiRequest, NextApiResponse } from "next"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import connectDb from "@/lib/connectDb"

connectDb()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	try {

		if (req.method == "OPTIONS") {
			res.status(200).end()
			return
		}

		const { username, password } = req.body

		const user = await userModel.findOne({ username })

		if (!user) {
			res.status(400).send({
				success: false,
				message: `user not found ${username}`
			})

			return
		}

		const comparePass = bcrypt.compareSync(password, user.password!)

		if (!comparePass) {
			res.status(400).send({
				success: false,
				message: "incorrect username or password"
			})

			return
		}

		const token = jwt.sign(user._id.toString(), process.env.JWT_SECRET!)

		res.status(200).send({
			success: true,
			message: "logged in successfully",
			token,
			user
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

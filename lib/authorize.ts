import { NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken'

const authorize = (req: NextApiRequest, res: NextApiResponse) => {
	if (req.headers.authorization) {
		const id = jwt.verify(req.headers.authorization, process.env.JWT_SECRET!)
		return id
	} else {
		res.status(401).send({
			success: false,
			message: "you are unathorized",
			error: "unauthorized"
		})
		return
	}
}

export default authorize

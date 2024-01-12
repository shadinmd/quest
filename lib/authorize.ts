import { NextApiRequest } from "next";
import jwt from 'jsonwebtoken'

const authorize = (req: NextApiRequest) => {
	if (!req.headers.authorization) {
		return false
	}

	const id = jwt.verify(req.headers.authorization, process.env.JWT_SECRET!)
	return id
}

export default authorize

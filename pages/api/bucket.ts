import authorize from "@/lib/authorize";
import connectDb from "@/lib/connectDb";
import BucketModel from "@/models/bucket.model";
import { NextApiRequest, NextApiResponse } from "next";

connectDb()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		if (req.method == "OPTIONS") {
			res.status(200).end()
			return
		}

		const user = authorize(req, res)
		if (!user) return;

		if (req.method == "GET") {
			const buckets = await BucketModel.find({ user })

			res.status(200).send({
				success: true,
				message: "buckets fetched",
				buckets
			})

			return
		}

		if (req.method == "POST") {
			const { title, } = req.body

			if (!title) {
				res.status(400).send({
					success: false,
					message: "please fill all fields"
				})

				return
			}

			const bucketSearch = await BucketModel.findOne({ title, user })

			if (bucketSearch) {
				res.status(400).send({
					success: false,
					message: "bucket allready exists"
				})
				return
			}

			const bucket = await new BucketModel({
				title,
				user
			}).save()

			res.status(200).send({
				success: true,
				message: "bucket created",
				bucket
			})

			return
		}

		if (req.method == "PUT") {
			const { description, _id } = req.body
			await BucketModel.updateOne({ _id }, { $set: { description } })

			res.status(200).send({
				success: true,
				message: "bucket updated"
			})

			return
		}

		if (req.method == "DELETE") {
			const { id } = req.query

			const response = await BucketModel.deleteOne({ _id: id })

			if (response.deletedCount < 0) {
				res.status(400).send({
					success: false,
					message: "failed to delete bucket"
				})
				return
			}

			res.status(200).send({
				success: true,
				message: "bucket deleted successfully"
			})

			return
		}

		res.status(404).end()

	} catch (error) {
		console.log(error)
		res.status(500).send({
			success: false,
			message: "server error"
		})
	}
}

export default handler

import authorize from "@/lib/authorize"
import connectDb from "@/lib/connectDb"
import DiaryModel from "@/models/diary.model"
import { NextApiRequest, NextApiResponse } from "next"
import { decodeAction } from "next/dist/server/app-render/entry-base"

connectDb()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		if (req.method == "OPTIONS") {
			res.status(200).end()
		}

		const user = authorize(req, res) as { id: string }
		if (!user) return


		if (req.method == "GET") {
			const { date } = req.query

			if (!date) {
				res.status(400).send({
					success: false,
					message: "date not provided"
				})
				return
			}

			const diary = await DiaryModel.findOne({ date })
			res.status(200).send({
				success: true,
				message: "diary fetched successfully",
				diary
			})

			return
		}

		if (req.method == "POST") {
			const { title, content, date } = req.body

			if (!title || !content || !date) {
				res.status(400).send({
					success: false,
					message: "please fill all fields"
				})

				return
			}

			const diarySearch = await DiaryModel.findOne({ user, date })

			if (diarySearch) {
				res.status(400).send({
					success: false,
					message: "dairy allready created for this date"
				})
				return
			}

			const diary = new DiaryModel({
				title,
				content,
				date,
				user
			}).save()

			res.status(200).send({
				success: true,
				message: "diary created successfully",
				diary
			})

			return
		}

		if (req.method == "PUT") {
			const { title, content, date } = req.body

			if (!title || !content) {
				res.status(400).send({
					success: false,
					message: "please fill all fields"
				})
				return
			}

			const response = await DiaryModel.updateOne(
				{
					user,
					date
				},
				{
					$set: {
						title,
						content
					}
				}
			)

			if (response.matchedCount < 0) {
				res.status(400).send({
					success: false,
					message: "diary not found"
				})
				return
			}

			if (response.modifiedCount < 0) {
				res.status(400).send({
					scuccess: false,
					message: "failed not update"
				})
				return
			}


			res.status(200).send({
				success: true,
				message: "diary updated successfully"
			})
			return
		}

		res.status(404).send({
			success: false,
			message: "page not found"
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

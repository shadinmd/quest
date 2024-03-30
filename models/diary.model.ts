import DiaryInterface from "@/interface/diary.interface";
import mongoose from "mongoose";

const diarySchema = new mongoose.Schema<DiaryInterface>({
	title: {
		type: String,
		required: true
	},
	user: {
		type: String,
		required: true,
		ref: "User"
	},
	content: {
		type: String,
		required: true
	},
	date: {
		type: String,
		required: true
	}
}, { timestamps: true })

const DiaryModel = mongoose.models.Diary || mongoose.model("Diary", diarySchema)
export default DiaryModel

import DailyInterface from "@/interface/daily.interface";
import mongoose from "mongoose";

const dailySchema = new mongoose.Schema<DailyInterface>({
	user: {
		type: String,
		required: true,
		ref: "User"
	},
	title: {
		type: String,
		required: true
	},
	description: {
		type: String
	},
	completed: {
		type: Boolean,
		default: false
	}
}, { timestamps: true })

const dailyModel = mongoose.models.Daily<DailyInterface> || mongoose.model("Daily", dailySchema)
export default dailyModel

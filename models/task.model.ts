import TaskInterface from "@/interface/task.interface";
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema<TaskInterface>({
	title: {
		type: String,
		required: true
	},
	user: {
		type: String,
		required: true,
		ref: "User"
	},
	description: {
		type: String
	},
	completed: {
		type: Boolean,
		default: false
	}
}, { timestamps: true })

const taskModel = mongoose.models.Task as mongoose.Model<TaskInterface> || mongoose.model("Task", taskSchema)
export default taskModel

import GroupInterface from "@/interface/group.interface";
import mongoose from "mongoose";

const groupSchema = new mongoose.Schema<GroupInterface>({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		default: ""
	},
	user: {
		type: String,
		required: true,
		ref: "User"
	}
})

const GroupModel = mongoose.models.Group as mongoose.Model<GroupInterface> || mongoose.model("Group", groupSchema)
export default GroupModel

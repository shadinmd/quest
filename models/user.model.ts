import UserInterface from "@/interface/user.interface";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema<UserInterface>({
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true
	},
	image: {
		type: String
	},
	blocked: {
		type: Boolean,
		default: false
	}
}, { timestamps: true })

const userModel = mongoose.models.User as mongoose.Model<UserInterface> || mongoose.model("User", userSchema)
export default userModel

import BucketListInterface from "@/interface/bucketlist.interface";
import mongoose from "mongoose";

const bucketListSchema = new mongoose.Schema<BucketListInterface>({
	user: {
		type: String,
		ref: "User",
		required: true
	},
	descripton: {
		type: String
	},
	items: {
		type: [],
		default: []
	}
})

const bucketListModel = mongoose.models.BucketList<BucketListInterface> || mongoose.model("BucketList", bucketListSchema)
export default bucketListModel

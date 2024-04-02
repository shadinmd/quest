import BucketInterface from "@/interface/bucket.interface";
import mongoose from "mongoose";

const bucketSchema = new mongoose.Schema<BucketInterface>({
	user: {
		type: String,
		required: true,
		ref: "User"
	},
	title: {
		type: String,
		required: true
	},
	completed: {
		type: Boolean,
		default: false
	}
}, { timestamps: true })

const BucketModel = mongoose.models.Bucket || mongoose.model("Bucket", bucketSchema)
export default BucketModel

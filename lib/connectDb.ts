import mongoose from "mongoose"

const connectDb = async () => {
	if (mongoose.connections[0]?.readyState >= 1) return;
	try {
		const DBURL = process.env.DB_URL
		console.log(DBURL)
		if (DBURL)
			await mongoose.connect(DBURL)
		else
			throw new Error("database url not provided")
	} catch (error) {
		console.log(error)
	}
}

export default connectDb

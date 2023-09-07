import mongoose from "mongoose";

let isConnected = false;

/**
 * connect to cloud.mongodb.com
 * @returns
 */
export const connectToDB = async () => {
	mongoose.set("strictQuery", true);

	if (!process.env.MONGODB_URL) return console.log("MONGODB_URL not found");
	if (isConnected) return console.log("MongoDB is connected!");

	try {
		await mongoose.connect(process.env.MONGODB_URL);
		isConnected = true;
		console.log("MongoDB is connected first!");
	} catch (error) {
		console.log(error);
	}
};

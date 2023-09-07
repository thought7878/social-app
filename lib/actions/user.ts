"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user";
import { connectToDB } from "../mongoose";

interface UserParams {
	userId: string;
	username: string;
	name: string;
	bio: string;
	image: string;
	path: string;
}

export async function updateUser({
	userId,
	username,
	name,
	bio,
	image,
	path,
}: UserParams) {
	connectToDB();
	try {
		await User.findOneAndUpdate(
			{ id: userId },
			{
				username: username.toLowerCase(),
				name,
				bio,
				image,
				path,
				onboarded: true,
			},
			// update an existing row if a specified value already exists in a table,
			// and insert a new row if the specified value doesn't already exist
			{ upsert: true }
		);

		if (path === "/profile/edit") {
			revalidatePath(path);
		}
	} catch (error: any) {
		throw new Error(`Failed to create or update user: ${error.message}`);
	}
}

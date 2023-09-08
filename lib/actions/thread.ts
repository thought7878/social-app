"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread";
import User from "../models/user";
import { connectToDB } from "../mongoose";

interface Params {
	text: string;
	author: string;
	communityId: string | null;
	path: string;
}

async function createThread({ text, author, communityId, path }: Params) {
	try {
		connectToDB();

		const createdThread = await Thread.create({
			text,
			author,
			communityId: null,
		});

		// update user
		await User.findByIdAndUpdate(author, {
			$push: { threads: createdThread._id },
		});

		revalidatePath(path);
	} catch (error: any) {
		throw new Error(`Failed to create thread: ${error.message}`);
	}
}

export { createThread };

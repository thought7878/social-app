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

async function fetchThreads(pageNumber = 1, pageSize = 20) {
	try {
		connectToDB();

		const skipAmount = (pageNumber - 1) * pageSize;

		// find top level threads that have no parents
		const threadQuery = Thread.find({ parentId: { $in: [null, undefined] } })
			.sort({
				createdAt: "desc",
			})
			.skip(skipAmount)
			.limit(pageSize)
			.populate({ path: "author", model: User })
			.populate({
				path: "children",
				populate: {
					path: "author",
					model: User,
					select: "_id name parentId image",
				},
			});

		const totalThreadsCount = await Thread.countDocuments({
			parentId: { $in: [null, undefined] },
		});

		const threads = await threadQuery.exec();
		const hasNext = totalThreadsCount > skipAmount + threads.length;

		return { threads, hasNext };
	} catch (error: any) {
		throw new Error(`Failed to fetch threads: ${error.message}`);
	}
}

export { createThread, fetchThreads };
